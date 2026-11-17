export interface Product {
  id: string;
  name: string;
  category: 'Home Decor' | 'Gifts' | 'Furniture' | 'Lighting' | 'Kitchen & Dining' | 'Doors & Timber';
  price: number;
  image: string;
  desc: string;
  artisan: string;
  artisanVillage: string;
  woodType: string;
  dimensions: string;
  finish: string;
  weight: string;
  inStock: boolean;
  leadTime: string;
  features: string[];
}

export interface Comment {
  id: string;
  product_id: string;
  userId?: string;
  customer_name: string;
  comment: string;
  rating?: number;
  created_at: string;
}

export interface Booking {
  id?: string;
  reference: string;
  userId?: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_amount: number;
  customer_name: string;
  phone: string;
  address: string;
  pincode: string;
  instructions?: string;
  finish_preference?: string;
  status: 'New' | 'Confirmed' | 'In Carving' | 'Dispatched' | 'Delivered' | 'Cancelled';
  created_at: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  connected: boolean;
}
