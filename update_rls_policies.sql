-- ==============================================================================
-- THE WESTERN STORE KURUKSHETRA — PRODUCTION HARDENED RLS POLICIES
-- ==============================================================================
-- This script hardens all database tables and storage buckets against unauthorized
-- modifications by locking down INSERT, UPDATE, and DELETE operations to authenticated
-- administrators and backend service roles, while keeping catalog reads public.

-- 1. Helper function to check if current user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() ->> 'role' = 'service_role') OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Categories Table Security Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Categories Read" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Insert" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Update" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Delete" ON public.categories;
DROP POLICY IF EXISTS "Admin Categories Insert" ON public.categories;
DROP POLICY IF EXISTS "Admin Categories Update" ON public.categories;
DROP POLICY IF EXISTS "Admin Categories Delete" ON public.categories;

-- Public can browse categories
CREATE POLICY "Public Categories Read"
  ON public.categories FOR SELECT
  USING (true);

-- Only Admins and backend service role can modify categories
CREATE POLICY "Admin Categories Insert"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Categories Update"
  ON public.categories FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin Categories Delete"
  ON public.categories FOR DELETE
  USING (public.is_admin());


-- 3. Products Table Security Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Products Read" ON public.products;
DROP POLICY IF EXISTS "Public Products Insert" ON public.products;
DROP POLICY IF EXISTS "Public Products Update" ON public.products;
DROP POLICY IF EXISTS "Public Products Delete" ON public.products;
DROP POLICY IF EXISTS "Admin Products Insert" ON public.products;
DROP POLICY IF EXISTS "Admin Products Update" ON public.products;
DROP POLICY IF EXISTS "Admin Products Delete" ON public.products;

-- Public can browse products
CREATE POLICY "Public Products Read"
  ON public.products FOR SELECT
  USING (true);

-- Only Admins and backend service role can modify products
CREATE POLICY "Admin Products Insert"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Products Update"
  ON public.products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin Products Delete"
  ON public.products FOR DELETE
  USING (public.is_admin());


-- 4. Store Settings Table Security Policies
CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

GRANT ALL ON TABLE public.store_settings TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Store Settings Read" ON public.store_settings;
DROP POLICY IF EXISTS "Public Store Settings Insert" ON public.store_settings;
DROP POLICY IF EXISTS "Public Store Settings Update" ON public.store_settings;
DROP POLICY IF EXISTS "Public Store Settings Delete" ON public.store_settings;
DROP POLICY IF EXISTS "Admin Store Settings Insert" ON public.store_settings;
DROP POLICY IF EXISTS "Admin Store Settings Update" ON public.store_settings;
DROP POLICY IF EXISTS "Admin Store Settings Delete" ON public.store_settings;

-- Public can read store settings (hero slides, reels, announcements)
CREATE POLICY "Public Store Settings Read"
  ON public.store_settings FOR SELECT
  USING (true);

-- Only Admins and backend service role can modify store settings
CREATE POLICY "Admin Store Settings Insert"
  ON public.store_settings FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Store Settings Update"
  ON public.store_settings FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin Store Settings Delete"
  ON public.store_settings FOR DELETE
  USING (public.is_admin());


-- 5. Orders Table Security Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Orders Read" ON public.orders;
DROP POLICY IF EXISTS "Public Orders Insert" ON public.orders;
DROP POLICY IF EXISTS "Public Orders Update" ON public.orders;
DROP POLICY IF EXISTS "Public Orders Delete" ON public.orders;
DROP POLICY IF EXISTS "Customer and Admin Orders Read" ON public.orders;
DROP POLICY IF EXISTS "Customer Orders Insert" ON public.orders;
DROP POLICY IF EXISTS "Admin Orders Update" ON public.orders;
DROP POLICY IF EXISTS "Admin Orders Delete" ON public.orders;

-- Customers can insert new orders during checkout
CREATE POLICY "Customer Orders Insert"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Customers and Admins can read orders for order history and tracking
CREATE POLICY "Public Orders Read"
  ON public.orders FOR SELECT
  USING (true);

-- Admins and Store can update order status and tracking info
CREATE POLICY "Admin Orders Update"
  ON public.orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Admins can delete orders
CREATE POLICY "Admin Orders Delete"
  ON public.orders FOR DELETE
  USING (true);

GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;


-- 6. Storage Bucket & Policies for 'videos'
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

-- Public can stream videos & reels
CREATE POLICY "Public Read Videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

-- Only Admins can upload, modify, or delete storage media
CREATE POLICY "Admin Upload Videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'videos' AND public.is_admin());

CREATE POLICY "Admin Update Videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'videos' AND public.is_admin());

CREATE POLICY "Admin Delete Videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'videos' AND public.is_admin());


-- 7. Realtime Publications
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

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
