-- ==============================================================================
-- Migration 001: Fix Orders Table Row Level Security (RLS)
-- ⚠️ DEPLOYMENT NOTICE: Apply backend & frontend code updates FIRST.
-- Once this migration is applied, anonymous clients can no longer read/mutate
-- orders directly. All order administration will go through the Express backend
-- using service_role credentials and verified admin JWT Bearer tokens.
-- ==============================================================================

-- 1. Enable Row Level Security on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. Drop insecure legacy policies
DROP POLICY IF EXISTS "Customer and Admin Orders Read" ON public.orders;
DROP POLICY IF EXISTS "Admin Orders Update" ON public.orders;
DROP POLICY IF EXISTS "Admin Orders Delete" ON public.orders;
DROP POLICY IF EXISTS "Customer Orders Insert" ON public.orders;
DROP POLICY IF EXISTS "Allow public read on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public delete on orders" ON public.orders;

-- 3. Revoke direct permissions from public anonymous access
REVOKE ALL ON TABLE public.orders FROM anon;
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.orders FROM authenticated;

-- 4. Grant full access to service_role (backend API server)
GRANT ALL ON TABLE public.orders TO service_role;

-- 5. Strict User Access Policy: Logged-in customers can only read their OWN orders
CREATE POLICY "Users Read Own Orders" ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
