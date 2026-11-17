import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Booking, Comment } from '../types';

const toIsoString = (val: unknown): string => {
  if (val instanceof Timestamp) {
    return val.toDate().toISOString();
  }
  if (typeof val === 'string') return val;
  return new Date().toISOString();
};

/**
 * Ensure user profile document exists at /users/{uid} and return their saved wishlist.
 */
export async function syncUserProfile(user: User): Promise<string[]> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      return Array.isArray(data.wishlist) ? (data.wishlist as string[]) : [];
    }
    const safeDisplayName = (user.displayName || user.email?.split('@')[0] || 'KarigarSetu Customer').slice(0, 100);
    await setDoc(ref, {
      uid: user.uid,
      displayName: safeDisplayName,
      email: (user.email || '').slice(0, 160),
      wishlist: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return [];
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Toggle a product ID in the user's Firestore wishlist (bounded <= 50 items).
 */
export async function toggleWishlistItem(
  user: User,
  currentWishlist: string[],
  productId: string
): Promise<string[]> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  const exists = currentWishlist.includes(productId);
  const nextWishlist = exists
    ? currentWishlist.filter((id) => id !== productId)
    : [...currentWishlist, productId].slice(0, 50);

  try {
    const safeDisplayName = (user.displayName || user.email?.split('@')[0] || 'KarigarSetu Customer').slice(0, 100);
    await updateDoc(ref, {
      displayName: safeDisplayName,
      wishlist: nextWishlist,
      updatedAt: serverTimestamp(),
    });
    return nextWishlist;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Subscribe to bookings in Firestore.
 * Admin reads all bookings; customers read only bookings matching userId == user.uid.
 */
export function subscribeBookings(
  user: User,
  isAdmin: boolean,
  onData: (bookings: Booking[]) => void,
  onError?: (err: Error) => void
): () => void {
  const bookingsRef = collection(db, 'bookings');
  const q = isAdmin
    ? query(bookingsRef)
    : query(bookingsRef, where('userId', '==', user.uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Booking[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          reference: String(data.reference || d.id),
          userId: String(data.userId || ''),
          product_id: String(data.productId || ''),
          product_name: String(data.productName || ''),
          unit_price: Number(data.unitPrice || 0),
          quantity: Number(data.quantity || 1),
          total_amount: Number(data.totalAmount || 0),
          customer_name: String(data.customerName || ''),
          phone: String(data.phone || ''),
          address: String(data.address || ''),
          pincode: String(data.pincode || ''),
          instructions: data.instructions ? String(data.instructions) : undefined,
          finish_preference: data.finishPreference ? String(data.finishPreference) : undefined,
          status: (data.status as Booking['status']) || 'New',
          created_at: toIsoString(data.createdAt),
        };
      });
      // Client-side sort newest first to avoid composite index dependency
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    }
  );
}

/**
 * Create a new booking in Firestore strictly matching firebase-blueprint.json & firestore.rules.
 */
export async function createFirestoreBooking(
  user: User,
  data: Omit<Booking, 'reference' | 'created_at' | 'status' | 'id' | 'userId'>
): Promise<Booking> {
  const reference = 'KS-' + Math.floor(100000 + Math.random() * 900000).toString();
  const docId = reference;
  const path = `bookings/${docId}`;

  const payload: Record<string, unknown> = {
    reference,
    userId: user.uid,
    productId: data.product_id.slice(0, 64),
    productName: data.product_name.slice(0, 120),
    unitPrice: Number(data.unit_price),
    quantity: Math.max(1, Math.min(20, Math.round(data.quantity))),
    totalAmount: Number(data.total_amount),
    customerName: data.customer_name.trim().slice(0, 100),
    phone: data.phone.trim().slice(0, 20),
    address: data.address.trim().slice(0, 500),
    pincode: data.pincode.trim().slice(0, 6),
    status: 'New',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (data.instructions && data.instructions.trim()) {
    payload.instructions = data.instructions.trim().slice(0, 300);
  }
  if (data.finish_preference && data.finish_preference.trim()) {
    payload.finishPreference = data.finish_preference.trim().slice(0, 80);
  }

  try {
    await setDoc(doc(db, 'bookings', docId), payload);
    return {
      id: docId,
      reference,
      userId: user.uid,
      product_id: data.product_id,
      product_name: data.product_name,
      unit_price: data.unit_price,
      quantity: data.quantity,
      total_amount: data.total_amount,
      customer_name: data.customer_name,
      phone: data.phone,
      address: data.address,
      pincode: data.pincode,
      instructions: data.instructions,
      finish_preference: data.finish_preference,
      status: 'New',
      created_at: new Date().toISOString(),
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

/**
 * Update booking status (Admin for all statuses, or Owner for cancellation).
 */
export async function updateFirestoreBookingStatus(
  bookingId: string,
  newStatus: Booking['status']
): Promise<void> {
  const path = `bookings/${bookingId}`;
  try {
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Subscribe to public product reviews from Firestore /reviews.
 */
export function subscribeReviews(
  onData: (reviewsByProduct: Record<string, Comment[]>) => void,
  onError?: (err: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'reviews'),
    (snapshot) => {
      const map: Record<string, Comment[]> = {};
      snapshot.docs.forEach((d) => {
        const data = d.data();
        const productId = String(data.productId || '');
        if (!productId) return;
        const item: Comment = {
          id: d.id,
          product_id: productId,
          userId: String(data.userId || ''),
          customer_name: String(data.customerName || 'Verified Buyer'),
          comment: String(data.comment || ''),
          rating: Number(data.rating || 5),
          created_at: toIsoString(data.createdAt),
        };
        if (!map[productId]) map[productId] = [];
        map[productId].push(item);
      });

      Object.keys(map).forEach((pid) => {
        map[pid].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      });

      onData(map);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'reviews');
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    }
  );
}

/**
 * Create a verified review in Firestore /reviews.
 */
export async function createFirestoreReview(
  user: User,
  productId: string,
  customerName: string,
  comment: string,
  rating: number
): Promise<void> {
  const reviewId = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const path = `reviews/${reviewId}`;
  try {
    await setDoc(doc(db, 'reviews', reviewId), {
      productId: productId.slice(0, 64),
      userId: user.uid,
      customerName: customerName.trim().slice(0, 60),
      comment: comment.trim().slice(0, 500),
      rating: Math.max(1, Math.min(5, Math.round(rating))),
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

/**
 * Delete a review (author or admin).
 */
export async function deleteFirestoreReview(reviewId: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
