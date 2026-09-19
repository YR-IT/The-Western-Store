-- ==============================================================================
-- THE WESTERN STORE KURUKSHETRA — CATALOG RESET & CLEAN SLATE SCRIPT
-- ==============================================================================
-- Run this in Supabase Dashboard → SQL Editor when you want to wipe sample demo
-- products & categories to launch with your own live store inventory.
-- NOTE: This safely preserves customer accounts, orders, and store layout settings.

-- 1. Wipe old demo catalog items
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.categories CASCADE;

-- 2. Verify Admin Helper Function
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

-- 3. Ensure hardened policies on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Categories Read" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Insert" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Update" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Delete" ON public.categories;
DROP POLICY IF EXISTS "Admin Categories Insert" ON public.categories;
DROP POLICY IF EXISTS "Admin Categories Update" ON public.categories;
DROP POLICY IF EXISTS "Admin Categories Delete" ON public.categories;

CREATE POLICY "Public Categories Read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin Categories Insert" ON public.categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin Categories Update" ON public.categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin Categories Delete" ON public.categories FOR DELETE USING (public.is_admin());

-- 4. Ensure hardened policies on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Products Read" ON public.products;
DROP POLICY IF EXISTS "Public Products Insert" ON public.products;
DROP POLICY IF EXISTS "Public Products Update" ON public.products;
DROP POLICY IF EXISTS "Public Products Delete" ON public.products;
DROP POLICY IF EXISTS "Admin Products Insert" ON public.products;
DROP POLICY IF EXISTS "Admin Products Update" ON public.products;
DROP POLICY IF EXISTS "Admin Products Delete" ON public.products;

CREATE POLICY "Public Products Read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin Products Insert" ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin Products Update" ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin Products Delete" ON public.products FOR DELETE USING (public.is_admin());

-- 5. Force PostgREST schema reload
NOTIFY pgrst, 'reload schema';
