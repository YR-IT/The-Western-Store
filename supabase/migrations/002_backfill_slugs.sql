-- ==============================================================================
-- Migration 002: Backfill Slugs for Products and Categories
-- Ensures every category and product has a URL-friendly, unique slug.
-- ==============================================================================

-- 1. Add slug columns if they do not exist
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Backfill Categories Slugs
UPDATE public.categories
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM(name), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL OR TRIM(slug) = '';

-- Ensure categories slug is unique
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_unique_idx ON public.categories (slug);

-- 3. Backfill Products Slugs (with deduplication suffix support)
DO $$
DECLARE
  prod_record RECORD;
  base_slug TEXT;
  target_slug TEXT;
  counter INT;
BEGIN
  FOR prod_record IN SELECT id, title, slug FROM public.products ORDER BY created_at ASC LOOP
    IF prod_record.slug IS NULL OR TRIM(prod_record.slug) = '' THEN
      base_slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM(prod_record.title), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
      IF base_slug = '' THEN
        base_slug := 'product';
      END IF;
      
      target_slug := base_slug;
      counter := 1;
      
      WHILE EXISTS (SELECT 1 FROM public.products WHERE slug = target_slug AND id <> prod_record.id) LOOP
        counter := counter + 1;
        target_slug := base_slug || '-' || counter;
      END LOOP;
      
      UPDATE public.products SET slug = target_slug WHERE id = prod_record.id;
    END IF;
  END LOOP;
END $$;

-- Ensure products slug is indexed
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique_idx ON public.products (slug);
