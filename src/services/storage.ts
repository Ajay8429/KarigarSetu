import { Comment, Booking, SupabaseConfig } from '../types';

const COMMENTS_STORAGE_KEY = 'karigarsetu_comments_v2';
const BOOKINGS_STORAGE_KEY = 'karigarsetu_bookings_v2';
const CONFIG_STORAGE_KEY = 'karigarsetu_supabase_config_v1';

// Seed initial authentic reviews for the products
const INITIAL_COMMENTS: Record<string, Comment[]> = {
  'wood-frame': [
    {
      id: 'seed-c1',
      product_id: 'wood-frame',
      customer_name: 'Pooja Verma, Jaipur',
      comment: 'The floral carving on this Sheesham frame is extraordinary! You can tell it is carved by real hands, not a CNC machine. Fits my grandmother’s portrait beautifully.',
      rating: 5,
      created_at: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'seed-c2',
      product_id: 'wood-frame',
      customer_name: 'Vikram Sengupta, Kolkata',
      comment: 'Very solid weight and natural wood aroma. Delivered safe in corrugated wooden crate with bubble wrap.',
      rating: 5,
      created_at: new Date(Date.now() - 11 * 86400000).toISOString()
    }
  ],
  'jewel-box': [
    {
      id: 'seed-c3',
      product_id: 'jewel-box',
      customer_name: 'Ananya Sharma, Bengaluru',
      comment: 'The brass inlay (Tarkashi) work is mesmerising. The green velvet cushion inside holds my gold necklace and rings safely. A real heirloom piece.',
      rating: 5,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    }
  ],
  'wall-panel': [
    {
      id: 'seed-c4',
      product_id: 'wall-panel',
      customer_name: 'Dr. Rajiv Menon, Pune',
      comment: 'Placed this in our entryway beneath an accent spotlight. The Jali lattice cast gorgeous shadows on the wall in the evening.',
      rating: 5,
      created_at: new Date(Date.now() - 6 * 86400000).toISOString()
    }
  ],
  'side-table': [
    {
      id: 'seed-c5',
      product_id: 'side-table',
      customer_name: 'Meera Deshmukh, Mumbai',
      comment: 'Exceeded expectations. Very sturdy Sheesham wood and the legs screwed in within 2 minutes without any tools. 5 stars to the Saharanpur artisans!',
      rating: 5,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ],
  'table-lamp': [
    {
      id: 'seed-c6',
      product_id: 'table-lamp',
      customer_name: 'Rohit Khandelwal, Delhi',
      comment: 'The turned wood contour has a lovely warm grain. Linen shade creates a serene ambient reading glow in the study.',
      rating: 5,
      created_at: new Date(Date.now() - 8 * 86400000).toISOString()
    }
  ],
  'keepsake-box': [
    {
      id: 'seed-c7',
      product_id: 'keepsake-box',
      customer_name: 'Sunita Gill, Chandigarh',
      comment: 'Bought this as a wedding gift for my niece. The antique brass latch and mandala carving gave it a vintage royal feel.',
      rating: 5,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ]
};

// Seed initial bookings
const INITIAL_BOOKINGS: Booking[] = [
  {
    reference: 'KS-891042',
    product_id: 'jewel-box',
    product_name: 'Wooden Jewellery Box',
    unit_price: 1199,
    quantity: 1,
    total_amount: 1199,
    customer_name: 'Siddharth Rao',
    phone: '+91 98201 44512',
    address: 'Flat 402, Lotus Greens, Indiranagar, Bengaluru',
    pincode: '560038',
    instructions: 'Please pack as gift with walnut finish.',
    finish_preference: 'Dark Walnut Semi-Gloss',
    status: 'In Carving',
    created_at: new Date(Date.now() - 36 * 3600000).toISOString()
  },
  {
    reference: 'KS-889120',
    product_id: 'side-table',
    product_name: 'Handcrafted Side Table',
    unit_price: 3499,
    quantity: 2,
    total_amount: 6998,
    customer_name: 'Kavita Chawla',
    phone: '+91 98112 77890',
    address: 'B-14, Vasant Kunj, New Delhi',
    pincode: '110070',
    instructions: 'Call before delivery. Weekend preferred.',
    finish_preference: 'Warm Amber Hand-Rubbed',
    status: 'Confirmed',
    created_at: new Date(Date.now() - 72 * 3600000).toISOString()
  }
];

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return { url: '', anonKey: '', connected: false };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
}

// Fetch comments for product
export async function fetchComments(productId: string): Promise<Comment[]> {
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      const res = await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/product_comments?product_id=eq.${encodeURIComponent(productId)}&order=created_at.desc&limit=50`, {
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        return data as Comment[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage:', err);
    }
  }

  // LocalStorage fallback
  try {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : INITIAL_COMMENTS;
    return all[productId] || [];
  } catch {
    return INITIAL_COMMENTS[productId] || [];
  }
}

// Add comment
export async function postComment(
  productId: string,
  customerName: string,
  comment: string,
  rating: number = 5
): Promise<Comment> {
  const newComment: Comment = {
    id: 'c_' + Math.random().toString(36).substring(2, 9),
    product_id: productId,
    customer_name: customerName,
    comment,
    rating,
    created_at: new Date().toISOString()
  };

  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      const res = await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/product_comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`,
          Prefer: 'return=representation'
        },
        body: JSON.stringify(newComment)
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data[0]) return data[0];
      }
    } catch (err) {
      console.warn('Supabase insert failed, saving to local storage:', err);
    }
  }

  // Save to LocalStorage
  const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
  const all = stored ? JSON.parse(stored) : { ...INITIAL_COMMENTS };
  if (!all[productId]) all[productId] = [];
  all[productId].unshift(newComment);
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(all));

  return newComment;
}

// Fetch bookings
export async function fetchBookings(): Promise<Booking[]> {
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      const res = await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/product_bookings?order=created_at.desc&limit=100`, {
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`
        }
      });
      if (res.ok) {
        return (await res.json()) as Booking[];
      }
    } catch (err) {
      console.warn('Supabase bookings fetch failed, using local storage:', err);
    }
  }

  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
}

// Save booking
export async function createBooking(data: Omit<Booking, 'reference' | 'created_at' | 'status'>): Promise<Booking> {
  const ref = 'KS-' + Math.floor(100000 + Math.random() * 900000).toString();
  const booking: Booking = {
    ...data,
    reference: ref,
    status: 'New',
    created_at: new Date().toISOString()
  };

  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      const res = await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/product_bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`,
          Prefer: 'return=representation'
        },
        body: JSON.stringify(booking)
      });
      if (res.ok) {
        const saved = await res.json();
        if (Array.isArray(saved) && saved[0]) return saved[0];
      }
    } catch (err) {
      console.warn('Supabase booking save failed, saving locally:', err);
    }
  }

  const current = await fetchBookings();
  const updated = [booking, ...current];
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));

  return booking;
}

// Update booking status
export async function updateBookingStatus(reference: string, newStatus: Booking['status']): Promise<void> {
  const bookings = await fetchBookings();
  const updated = bookings.map(b => b.reference === reference ? { ...b, status: newStatus } : b);
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));

  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/product_bookings?reference=eq.${reference}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error(e);
    }
  }
}
