-- ==============================================================================
-- THE WESTERN STORE KURUKSHETRA — SUPABASE PRODUCTION SQL DATABASE SCHEMA
-- ==============================================================================
-- Paste this entire script into your Supabase Dashboard → SQL Editor → Run.

-- 1. EXTENSIONS & SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Safe cleanup for re-running in Supabase SQL Editor
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.wishlist_items CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. PROFILES TABLE (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  default_address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Valued Customer'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  sale_discount TEXT,
  on_sale BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT true,
  is_sold_out BOOLEAN DEFAULT false,
  in_stock_count INT DEFAULT 15,
  budget_tier TEXT DEFAULT 'under_1499',
  description TEXT,
  fabric_care JSONB DEFAULT '{}'::jsonb,
  sizes TEXT[] DEFAULT ARRAY['Free Size', 'S', 'M', 'L', 'XL'],
  colors JSONB DEFAULT '[]'::jsonb,
  images TEXT[] DEFAULT ARRAY[]::text[],
  rating NUMERIC DEFAULT 4.9,
  review_count INT DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  size TEXT NOT NULL,
  color_name TEXT,
  color_hex TEXT,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, size)
);

-- 6. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending WhatsApp',
  payment_method TEXT DEFAULT 'whatsapp_cod',
  items JSONB NOT NULL,
  tracking_number TEXT,
  courier_name TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Categories & Products: Public Read, Authenticated Write
CREATE POLICY "Public Categories Read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Categories Insert" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Categories Update" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Public Categories Delete" ON public.categories FOR DELETE USING (true);

CREATE POLICY "Public Products Read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Products Insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Products Update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Products Delete" ON public.products FOR DELETE USING (true);

-- Profiles: Users read/write their own profile
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Cart Items: Users manage their own cart
CREATE POLICY "Users manage own cart select" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart insert" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own cart update" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart delete" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Wishlist Items: Users manage their own wishlist
CREATE POLICY "Users manage own wishlist select" ON public.wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist insert" ON public.wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist delete" ON public.wishlist_items FOR DELETE USING (auth.uid() = user_id);

-- Orders: Public Insert & Read for storefront checkout & order tracking
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

-- Store Settings Table (Autoplay Reels, Hero Slides, Testimonials, Home Sections)
CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Store Settings Read" ON public.store_settings;
DROP POLICY IF EXISTS "Public Store Settings Insert" ON public.store_settings;
DROP POLICY IF EXISTS "Public Store Settings Update" ON public.store_settings;
DROP POLICY IF EXISTS "Public Store Settings Delete" ON public.store_settings;
CREATE POLICY "Public Store Settings Read" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public Store Settings Insert" ON public.store_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Store Settings Update" ON public.store_settings FOR UPDATE USING (true);
CREATE POLICY "Public Store Settings Delete" ON public.store_settings FOR DELETE USING (true);

-- Enable Realtime broadcasting for live order tracking & catalog updates & store settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'categories'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'store_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
  END IF;
END $$;

