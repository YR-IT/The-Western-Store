-- 1. Wipe old demo items from the database
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.categories CASCADE;

-- 2. Allow Admin Panel to Insert, Update & Delete on Supabase
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Categories Read" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Insert" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Update" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Delete" ON public.categories;
CREATE POLICY "Public Categories Read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Categories Insert" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Categories Update" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Public Categories Delete" ON public.categories FOR DELETE USING (true);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Products Read" ON public.products;
DROP POLICY IF EXISTS "Public Products Insert" ON public.products;
DROP POLICY IF EXISTS "Public Products Update" ON public.products;
DROP POLICY IF EXISTS "Public Products Delete" ON public.products;
CREATE POLICY "Public Products Read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Products Insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Products Update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Products Delete" ON public.products FOR DELETE USING (true);

-- 3. Store Settings Table (Autoplay Reels, Hero Slides, Testimonials, Home Sections)
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

-- 4. Supabase Storage 'videos' Bucket & Policies
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

CREATE POLICY "Public Read Videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Public Upload Videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Public Update Videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'videos');

CREATE POLICY "Public Delete Videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos');