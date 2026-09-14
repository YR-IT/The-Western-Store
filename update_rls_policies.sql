-- 1. Create a helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update Policies for PRODUCTS
DROP POLICY IF EXISTS "Public Products Insert" ON public.products;
DROP POLICY IF EXISTS "Public Products Update" ON public.products;
DROP POLICY IF EXISTS "Public Products Delete" ON public.products;

CREATE POLICY "Admin Products Insert" ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin Products Update" ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin Products Delete" ON public.products FOR DELETE USING (public.is_admin());

-- 3. Update Policies for CATEGORIES
DROP POLICY IF EXISTS "Public Categories Insert" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Update" ON public.categories;
DROP POLICY IF EXISTS "Public Categories Delete" ON public.categories;

CREATE POLICY "Admin Categories Insert" ON public.categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin Categories Update" ON public.categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin Categories Delete" ON public.categories FOR DELETE USING (public.is_admin());

-- 4. Update Policies for ORDERS
-- Allow public to insert orders, but only admins to update/delete
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public update orders" ON public.orders;

CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Orders Update" ON public.orders FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin Orders Delete" ON public.orders FOR DELETE USING (public.is_admin());
-- Users can read their own orders (if they are logged in) or Admins can read all
DROP POLICY IF EXISTS "Public select orders" ON public.orders;
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
