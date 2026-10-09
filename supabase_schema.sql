-- ==============================================================================
-- THE WESTERN STORE KURUKSHETRA — SUPABASE PRODUCTION SQL DATABASE SCHEMA
-- ==============================================================================
-- ⚠️ WARNING: DO NOT RUN THIS ON AN EXISTING PRODUCTION DATABASE WITH LIVE DATA.
-- This file defines the full schema for a fresh setup. For existing databases,
-- apply sequential migrations from the `supabase/migrations/` directory.
-- ==============================================================================

-- 1. EXTENSIONS & SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  sale_discount TEXT,
  on_sale BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_sold_out BOOLEAN DEFAULT false,
  in_stock_count INT DEFAULT 15,
  budget_tier TEXT DEFAULT 'under_1499',
  description TEXT,
  fabric_care JSONB DEFAULT '{}'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(2, 1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE (Unified Single Source of Truth)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'Pending WhatsApp',
  payment_method TEXT DEFAULT 'whatsapp_cod',
  payment_status TEXT DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  refund_status TEXT,
  refund_id TEXT,
  refund_amount NUMERIC(10, 2),
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  status_history JSONB DEFAULT '[]'::jsonb,
  courier_name TEXT,
  tracking_number TEXT,
  tracking_link TEXT,
  items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders (razorpay_order_id);

-- 6. USER CARTS & WISHLISTS
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color_name TEXT,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STORE SETTINGS & CONFIGS
CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Security helper for Supabase authenticated admin users
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users manage own profile
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: Public read, Admin manage
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (public.is_admin());
GRANT SELECT ON TABLE public.categories TO anon, authenticated;

-- Products: Public read, Admin manage
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (public.is_admin());
GRANT SELECT ON TABLE public.products TO anon, authenticated;

-- Store Settings: Public read, Admin manage
CREATE POLICY "Public read store settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage store settings" ON public.store_settings FOR ALL USING (public.is_admin());
GRANT SELECT ON TABLE public.store_settings TO anon, authenticated;

-- Cart & Wishlist: Authenticated user owns rows
CREATE POLICY "Users manage own cart select" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart insert" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own cart update" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart delete" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users manage own wishlist select" ON public.wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist insert" ON public.wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist delete" ON public.wishlist_items FOR DELETE USING (auth.uid() = user_id);

-- Orders: Strict backend service_role control + Customer own order read
REVOKE ALL ON TABLE public.orders FROM anon;
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.orders FROM authenticated;
GRANT ALL ON TABLE public.orders TO service_role;

CREATE POLICY "Users Read Own Orders" ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Contact Messages: Service role only (protects customer PII)
REVOKE ALL ON TABLE public.contact_messages FROM anon, authenticated;
GRANT ALL ON TABLE public.contact_messages TO service_role;

-- 10. REALTIME PUBLICATIONS (Catalog & Store Settings only — NO orders)
DO $$
BEGIN
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

-- 11. SUPABASE STORAGE BUCKET FOR REELS & VIDEOS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  52428800, -- 50MB per video limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Videos" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Videos" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Videos" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Videos" ON storage.objects;

CREATE POLICY "Public Read Videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Admin Upload Videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos' AND public.is_admin());
CREATE POLICY "Admin Update Videos" ON storage.objects FOR UPDATE USING (bucket_id = 'videos' AND public.is_admin());
CREATE POLICY "Admin Delete Videos" ON storage.objects FOR DELETE USING (bucket_id = 'videos' AND public.is_admin());

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
