import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, isAdminEmail } from './firebase';
import {
  syncUserProfile,
  toggleWishlistItem,
  subscribeBookings,
  createFirestoreBooking,
  updateFirestoreBookingStatus,
  subscribeReviews,
  createFirestoreReview,
  deleteFirestoreReview
} from './services/firebaseStore';
import { products as initialProducts } from './data/products';
import { Product, Comment, Booking, SupabaseConfig } from './types';
import {
  fetchComments,
  fetchBookings,
  updateBookingStatus,
  getSupabaseConfig,
  saveSupabaseConfig
} from './services/storage';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { BookingModal } from './components/BookingModal';
import { BookingsDrawer } from './components/BookingsDrawer';
import { DatabaseSettingsModal } from './components/DatabaseSettingsModal';
import { AuthModal } from './components/AuthModal';
import { HeritageSection } from './components/HeritageSection';
import { ArtisanCollectiveSection } from './components/ArtisanCollectiveSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { OfflineBanner } from './components/OfflineBanner';
import { buildWhatsAppLink } from './config/contact';

import { Search, Info, Heart } from 'lucide-react';

export default function App() {
  const [products] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authHint, setAuthHint] = useState<string | undefined>(undefined);

  // Comments maps: curated/local seed + live Firestore reviews
  const [seedCommentsMap, setSeedCommentsMap] = useState<Record<string, Comment[]>>({});
  const [firestoreReviewsMap, setFirestoreReviewsMap] = useState<Record<string, Comment[]>>({});

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Optional Supabase config (preserved for legacy/local fallback)
  const [dbConfig, setDbConfig] = useState<SupabaseConfig>(getSupabaseConfig());

  // Modals state
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [isBookingsDrawerOpen, setIsBookingsDrawerOpen] = useState(false);
  const [isDbSettingsOpen, setIsDbSettingsOpen] = useState(false);

  const isAdmin = isAdminEmail(user?.email, user?.emailVerified);

  // Register Service Worker & load initial seed reviews
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.log('ServiceWorker registration note:', err));
    }

    const loadInitialComments = async () => {
      const map: Record<string, Comment[]> = {};
      for (const p of products) {
        try {
          map[p.id] = await fetchComments(p.id);
        } catch {
          map[p.id] = [];
        }
      }
      setSeedCommentsMap(map);
    };
    loadInitialComments();
  }, [products]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (currentUser) {
        try {
          const savedWishlist = await syncUserProfile(currentUser);
          setWishlist(savedWishlist);
        } catch (err) {
          console.error('Failed to sync user profile:', err);
        }
      } else {
        setWishlist([]);
        setShowWishlistOnly(false);
      }
    });
    return () => unsub();
  }, []);

  // Subscribe to public Firestore reviews
  useEffect(() => {
    const unsub = subscribeReviews(
      (reviewsByProduct) => {
        setFirestoreReviewsMap(reviewsByProduct);
      },
      (err) => {
        console.warn('Firestore reviews listener warning:', err.message);
      }
    );
    return () => unsub();
  }, []);

  // Subscribe to Firestore bookings when signed in; fallback to local/Supabase when guest
  useEffect(() => {
    if (!authReady) return;

    if (user) {
      const unsub = subscribeBookings(
        user,
        isAdmin,
        (cloudBookings) => {
          setBookings(cloudBookings);
        },
        (err) => {
          console.error('Firestore bookings listener error:', err.message);
        }
      );
      return () => unsub();
    } else {
      fetchBookings().then(setBookings).catch(console.error);
    }
  }, [authReady, user, isAdmin]);

  // Combined reviews map (live Firestore reviews first, followed by curated/seed reviews)
  const commentsMap = useMemo(() => {
    const combined: Record<string, Comment[]> = {};
    for (const p of products) {
      const live = firestoreReviewsMap[p.id] || [];
      const seed = seedCommentsMap[p.id] || [];
      combined[p.id] = [...live, ...seed];
    }
    return combined;
  }, [products, firestoreReviewsMap, seedCommentsMap]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesWishlist = !showWishlistOnly || wishlist.includes(p.id);
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.woodType.toLowerCase().includes(q) ||
        p.artisan.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesWishlist && matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, showWishlistOnly, wishlist]);

  const handleRequestAuth = (hint?: string) => {
    setAuthHint(hint);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      handleRequestAuth('Sign in with Google to save wooden crafts to your personal wishlist.');
      return;
    }
    const updated = await toggleWishlistItem(user, wishlist, productId);
    setWishlist(updated);
  };

  const handleOpenBooking = (product: Product) => {
    setBookingProduct(product);
    setIsBookingOpen(true);
  };

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddComment = async (
    productId: string,
    customerName: string,
    comment: string,
    rating: number
  ) => {
    if (!user) {
      handleRequestAuth('Sign in with Google to post a verified review.');
      return;
    }
    await createFirestoreReview(user, productId, customerName, comment, rating);
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteFirestoreReview(commentId);
  };

  const handleSubmitBooking = async (
    bookingData: Omit<Booking, 'reference' | 'created_at' | 'status'>
  ): Promise<Booking> => {
    const created = await createFirestoreBooking(user, bookingData);
    if (!user) {
      // Also store local receipt for guest customer's own browser session
      try {
        const key = 'karigarsetu_bookings_v2';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        localStorage.setItem(key, JSON.stringify([created, ...existing]));
      } catch {
        // Ignore localStorage quota issues
      }
      setBookings((prev) => [created, ...prev]);
    }
    return created;
  };

  const handleUpdateBookingStatus = async (idOrRef: string, newStatus: Booking['status']) => {
    if (user) {
      await updateFirestoreBookingStatus(idOrRef, newStatus);
    } else {
      await updateBookingStatus(idOrRef, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.reference === idOrRef ? { ...b, status: newStatus } : b))
      );
    }
  };

  const handleSaveConfig = (newConfig: SupabaseConfig) => {
    saveSupabaseConfig(newConfig);
    setDbConfig(newConfig);
    if (!user) {
      fetchBookings().then(setBookings);
    }
  };

  const categories = ['All', 'Home Decor', 'Gifts', 'Furniture', 'Lighting', 'Kitchen & Dining', 'Doors & Timber'];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf6ef] text-[#2e2118]">
      <Navbar
        user={user}
        isAdmin={isAdmin}
        bookingsCount={bookings.length}
        onOpenBookings={() => setIsBookingsDrawerOpen(true)}
        onOpenAuth={() => handleRequestAuth()}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onWhatsAppInquiry={() => {
            window.open(
              buildWhatsAppLink('Hello KarigarSetu! I would like to inquire about custom handcrafted woodcraft.'),
              '_blank'
            );
          }}
        />

        <section id="products" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#ead8c3]">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#3c543f]">
                Artisanal Woodwork Catalogue
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#2e2118] mt-1">
                Handcrafted Wooden Creations
              </h2>
            </div>
            <div className="text-xs font-semibold text-[#8c5835] tabular-nums">
              Showing {filteredProducts.length} handcrafted piece{filteredProducts.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="mt-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 bg-[#f4ecdf] rounded-xl overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-white text-[#2e2118] shadow-xs'
                      : 'text-[#6d6259] hover:text-[#2e2118]'
                  }`}
                >
                  {cat === 'All' ? 'All Collections' : cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    handleRequestAuth('Sign in with Google to view and manage your saved wishlist.');
                    return;
                  }
                  setShowWishlistOnly(!showWishlistOnly);
                }}
                className={`inline-flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
                  showWishlistOnly
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-white border-[#dfcbb5] text-[#2e2118] hover:bg-[#faf5ef]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-red-600 text-red-600' : 'text-[#8c5835]'}`} />
                <span>Wishlist{user ? ` (${wishlist.length})` : ''}</span>
              </button>

              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9a8c80]" />
                <input
                  type="search"
                  placeholder="Search wardrobe, chair, door, utensils, lamp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#dfcbb5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6b3f25]"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                className="py-2 px-3 text-xs bg-white border border-[#dfcbb5] rounded-xl text-[#2e2118] focus:outline-none"
              >
                <option value="featured">Featured Artisanal</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-[#faf5ef] border border-[#dfcbb5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5c5249]">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#8c5835] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2e2118]">Direct Booking & Account Sync:</strong>{' '}
                {user ? (
                  <span>
                    Signed in as <span className="font-semibold text-[#6b3f25]">{user.email}</span>. Bookings, wishlist, and reviews sync live to Firebase Cloud.
                  </span>
                ) : (
                  <span>
                    Sign in with Google to save wishlists, post verified reviews, and track bookings across devices—or book immediately as a guest.
                  </span>
                )}
              </div>
            </div>
            {!user && (
              <button
                onClick={() => handleRequestAuth()}
                className="text-xs font-semibold text-[#6b3f25] hover:underline whitespace-nowrap shrink-0"
              >
                Sign in with Google →
              </button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                comments={commentsMap[p.id] || []}
                user={user}
                isAdmin={isAdmin}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={handleToggleWishlist}
                onBook={handleOpenBooking}
                onQuickView={handleOpenQuickView}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                onRequestAuth={handleRequestAuth}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#ead8c3] mt-8 p-8 space-y-3">
              <p className="text-base font-bold text-[#2e2118]">No wooden products match your filter</p>
              <p className="text-xs text-[#6d6259]">
                Try searching for other terms like "Sheesham", "wardrobe", "door", or clear your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setShowWishlistOnly(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#6b3f25] bg-[#faf5ef] rounded-lg border border-[#dfcbb5]"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>

        <HeritageSection />
        <ArtisanCollectiveSection />
        <ContactSection />
      </main>

      <Footer
        onOpenDbSettings={() => setIsDbSettingsOpen(true)}
        isDbConnected={!!user || dbConfig.connected}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        contextHint={authHint}
      />

      <BookingModal
        product={bookingProduct}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSubmitBooking={handleSubmitBooking}
        user={user}
        onRequestAuth={(hint) => {
          setIsBookingOpen(false);
          handleRequestAuth(hint);
        }}
        isDbConnected={!!user || dbConfig.connected}
      />

      <ProductModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onBookNow={(p) => {
          setIsQuickViewOpen(false);
          handleOpenBooking(p);
        }}
      />

      <BookingsDrawer
        isOpen={isBookingsDrawerOpen}
        onClose={() => setIsBookingsDrawerOpen(false)}
        bookings={bookings}
        onUpdateStatus={handleUpdateBookingStatus}
        user={user}
        isAdmin={isAdmin}
        onRequestAuth={(hint) => {
          setIsBookingsDrawerOpen(false);
          handleRequestAuth(hint);
        }}
        isDbConnected={!!user || dbConfig.connected}
      />

      <DatabaseSettingsModal
        isOpen={isDbSettingsOpen}
        onClose={() => setIsDbSettingsOpen(false)}
        config={dbConfig}
        onSaveConfig={handleSaveConfig}
      />

      <OfflineBanner />
    </div>
  );
}
