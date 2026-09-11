-- ==============================================================================
-- THE WESTERN STORE KURUKSHETRA — SUPABASE PRODUCTION SEED DATA
-- ==============================================================================
-- Run this in Supabase Dashboard → SQL Editor to pre-populate live categories & products.

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, subtitle, image)
VALUES
  ('cat-ethnic', 'Ethnic Wear', 'ethnic-wear', 'Royal Banarasi sarees, lehengas & festive edits', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'),
  ('cat-western', 'Western Wear', 'western-wear', 'Chic blazers, contemporary tops & denim edit', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  image = EXCLUDED.image;

-- 2. SEED PRODUCTS
INSERT INTO public.products (
  id, title, slug, category, price, original_price, sale_discount, on_sale,
  is_bestseller, is_new, is_sold_out, in_stock_count, budget_tier, description,
  fabric_care, sizes, colors, images, rating, review_count
) VALUES
(
  'prod-1',
  'Hand-Embroidered Zari Silk Saree',
  'hand-embroidered-zari-silk-saree',
  'Ethnic Wear',
  1499, 1999, '-25%', true,
  true, true, false, 15, 'under_1499',
  'Exquisite handcrafted Banarasi silk saree featuring heavy zari embroidery on palau and intricate floral motifs. Comes with unstitched blouse piece.',
  '{"fabric": "Pure Banarasi Silk & Zari", "washCare": "Dry Clean Only", "fit": "Unstitched / Free Drape", "occasion": "Weddings & Festive Ceremonies"}'::jsonb,
  ARRAY['Free Size'],
  '[{"name": "Deep Ruby Maroon", "hex": "#721B29"}, {"name": "Champagne Gold", "hex": "#C5A059"}]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
  ],
  4.9, 38
),
(
  'prod-2',
  'Royal Velvet Anarkali Suit Set',
  'royal-velvet-anarkali-suit-set',
  'Ethnic Wear',
  1899, 2499, '-24%', true,
  true, false, false, 8, 'under_1999',
  'Luxurious velvet Anarkali suit paired with zari embroidered organza dupatta and tailored churidar pants. Crafted for winter weddings and festive evenings.',
  '{"fabric": "Micro Velvet & Organza Dupatta", "washCare": "Dry Clean Only", "fit": "Flared Anarkali Cut", "occasion": "Sangeet & Reception"}'::jsonb,
  ARRAY['S', 'M', 'L', 'XL'],
  '[{"name": "Royal Emerald", "hex": "#1B4D3E"}, {"name": "Midnight Blue", "hex": "#1B2A4A"}]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80'
  ],
  4.8, 26
),
(
  'prod-3',
  'Tailored Oversized Linen Blazer',
  'tailored-oversized-linen-blazer',
  'Western Wear',
  999, 1299, '-23%', true,
  false, true, false, 12, 'under_999',
  'Contemporary structured blazer in breathable linen-cotton blend. Features notched lapels, dual front pockets, and tortoiseshell button accents.',
  '{"fabric": "Linen Cotton Blend", "washCare": "Machine Wash Cold", "fit": "Relaxed Oversized Fit", "occasion": "Smart Casual & Office Edit"}'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  '[{"name": "Warm Sand", "hex": "#C2B280"}, {"name": "Classic Ivory", "hex": "#FFFDD0"}]'::jsonb,
  ARRAY[
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80'
  ],
  4.7, 19
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  images = EXCLUDED.images;
