-- ==============================================================================
-- Migration 003: Payments, Refund Columns, and Contact Messages Table
-- Adds support for Razorpay payment lifecycle and customer contact form submissions.
-- ==============================================================================

-- 1. Extend orders table with Razorpay & refund tracking fields
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refund_status TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refund_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10,2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;

-- Index for rapid webhook lookup by razorpay_order_id
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders (razorpay_order_id);

-- 2. Create contact_messages table for store inquiries & grievance submissions
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

-- Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Revoke public reads from contact messages (contains customer PII)
REVOKE ALL ON TABLE public.contact_messages FROM anon, authenticated;
GRANT ALL ON TABLE public.contact_messages TO service_role;
