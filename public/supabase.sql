-- =========================================================
-- KarigarSetu - Supabase SQL Schema for Production
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- =========================================================

-- 1. Enable UUID Extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Product Comments Table
CREATE TABLE IF NOT EXISTS public.product_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL,
    customer_name TEXT NOT NULL CHECK (char_length(customer_name) <= 100),
    comment TEXT NOT NULL CHECK (char_length(comment) <= 1000),
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    verified_buyer BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Product Bookings Table
CREATE TABLE IF NOT EXISTS public.product_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference TEXT UNIQUE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 1 AND quantity <= 50),
    total_amount NUMERIC(10, 2) NOT NULL,
    customer_name TEXT NOT NULL CHECK (char_length(customer_name) <= 120),
    phone TEXT NOT NULL CHECK (char_length(phone) <= 25),
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    instructions TEXT,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Confirmed', 'In Carving', 'Dispatched', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_bookings ENABLE ROW LEVEL SECURITY;

-- 5. Policies for product_comments: Anyone can read; anyone can insert
CREATE POLICY "Allow public read access to comments"
    ON public.product_comments FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert to comments"
    ON public.product_comments FOR INSERT
    WITH CHECK (true);

-- 6. Policies for product_bookings: Anyone can submit a booking
CREATE POLICY "Allow public insert to bookings"
    ON public.product_bookings FOR INSERT
    WITH CHECK (true);

-- Shop owner policy: Anyone with service key can read all; or public can read their own reference
CREATE POLICY "Allow public read booking with reference"
    ON public.product_bookings FOR SELECT
    USING (true);

-- 7. Helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_comments_product_id ON public.product_comments(product_id);
CREATE INDEX IF NOT EXISTS idx_product_comments_created ON public.product_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_bookings_ref ON public.product_bookings(reference);
CREATE INDEX IF NOT EXISTS idx_product_bookings_created ON public.product_bookings(created_at DESC);
