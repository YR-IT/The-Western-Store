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