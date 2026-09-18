-- Standalone RLS Security & Permissions Update Script
-- Use this script to update/fix Row-Level Security policies without wiping existing products or categories.

-- 1. Categories Table Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Categories Read" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Insert" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Update" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Delete" ON public.categories;
CREATE POLICY "Public Categories Read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Categories Insert" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Categories Update" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Public Categories Delete" ON public.categories FOR DELETE USING (true);

-- 2. Products Table Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Products Read" ON public.products;
DROP POLICY IF EXISTS "Public Products Insert" ON public.products;
DROP POLICY IF EXISTS "Public Products Update" ON public.products;
DROP POLICY IF EXISTS "Public Products Delete" ON public.products;
CREATE POLICY "Public Products Read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Products Insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Products Update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Products Delete" ON public.products FOR DELETE USING (true);

-- 3. Orders Table Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Orders Read" ON public.orders;
DROP POLICY IF EXISTS "Public Orders Insert" ON public.orders;
DROP POLICY IF EXISTS "Public Orders Update" ON public.orders;
DROP POLICY IF EXISTS "Public Orders Delete" ON public.orders;
CREATE POLICY "Public Orders Read" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Orders Insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Orders Update" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public Orders Delete" ON public.orders FOR DELETE USING (true);

-- 4. Store Settings Table (Reels, Hero Slides, Testimonials, Home Sections)
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

-- Enable Realtime for store_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'store_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
  END IF;
END $$;
