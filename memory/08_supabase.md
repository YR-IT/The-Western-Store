# 08 — Supabase

## Project Details

| Field | Value |
|-------|-------|
| **Project URL** | `https://tgvqrxnyrougiidkdwkg.supabase.co` |
| **Anon Key** | In `backend/.env` as `SUPABASE_KEY` |
| **Service Role Key** | Commented out in `.env` (not in active use) |
| **Auth Providers** | Google OAuth, Email/Password |

---

## 🗄️ Database Tables

### `products`
Stores the product catalog.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `title` | text | Product name |
| `slug` | text | URL-safe identifier |
| `category` | text | Category name string |
| `price` | numeric | Current price (INR) |
| `original_price` | numeric | Pre-sale price |
| `on_sale` | boolean | |
| `sale_discount` | text | e.g. "20% OFF" |
| `is_sold_out` | boolean | |
| `is_new` | boolean | |
| `is_best_seller` | boolean | |
| `budget_tier` | text | BudgetTier enum value |
| `images` | jsonb | Array of ImageKit URLs |
| `sizes` | jsonb | Array of size strings |
| `colors` | jsonb | Array of `{name: string}` |
| `description` | text | |
| `fabric_care` | jsonb | `{fabric, washCare, fit, occasion}` |
| `in_stock_count` | integer | |
| `rating` | numeric | |
| `review_count` | integer | |
| `created_at` | timestamptz | |

---

### `categories`
Navigation categories shown in header and PLP filters.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `name` | text | Display name |
| `slug` | text | URL slug |
| `image` | text | ImageKit URL |
| `subtitle` | text | Short description |
| `show_on_navbar` | boolean | |
| `navbar_order` | integer | Sort order |

---

### `orders`
All customer orders.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `order_number` | text | Human-readable (e.g. TWS-123456) |
| `created_at` | timestamptz | |
| `user_id` | uuid | Nullable — guest orders allowed |
| `customer_name` | text | |
| `customer_phone` | text | |
| `customer_email` | text | |
| `shipping_address` | jsonb | `{address, city, state, pincode, notes}` |
| `items` | jsonb | Array of `OrderItemSummary` |
| `total_amount` | numeric | |
| `status` | text | OrderStatus value |
| `courier_name` | text | Filled by admin |
| `tracking_number` | text | Filled by admin |
| `tracking_link` | text | Auto or custom URL |
| `shipped_date` | text | |
| `estimated_delivery` | text | |
| `tracking_notes` | text | |

---

### `hero_slides`
Homepage hero carousel configuration.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `image` | text | Fallback image URL |
| `desktop_image` | text | 16:9 desktop banner |
| `mobile_image` | text | 9:16 mobile banner |
| `target_device` | text | `'all'` \| `'desktop'` \| `'mobile'` |
| `title` | text | Optional overlay text |
| `tagline` | text | |
| `subtitle` | text | |
| `category` | text | |
| `cta_text` | text | Button label |
| `link_url` | text | Custom URL |
| `show_text_overlay` | boolean | Default `false` |
| `order` | integer | Slide position |

---

### Other Tables
- `testimonials` — customer testimonials
- `instagram_posts` — Instagram feed items
- `home_sections` — homepage section config and order
- `trust_features` — trust strip items
- `budget_tiles` — Shop By Budget section config

---

## 🔐 Row Level Security (RLS)

RLS policies are defined in `update_rls_policies.sql`. General pattern:

- **Products, Categories, Hero Slides, Home Sections** — publicly readable (`SELECT` allowed for `anon`), write requires authenticated admin
- **Orders** — users can read their own orders (by `user_id`), admin reads all
- **Guest orders** — `user_id` is null; publicly creatable but not publicly readable after creation

---

## 🔧 Supabase Client (`frontend/src/lib/supabase.ts`)

```typescript
export const isSupabaseConfigured = () => {
  return !!(SUPABASE_URL && SUPABASE_KEY);
};
```

The frontend gracefully degrades if Supabase isn't configured — uses local state only.

---

## 📡 Realtime

Not currently in use. Orders are polled every 25 seconds by admin via REST API.

---

## ⚙️ Supabase Auth Configuration

- **Google OAuth:** Requires Google Cloud Console credentials set in Supabase dashboard
- **Email Confirmations:** May be enabled — check Supabase Auth settings if signup isn't working
- **Redirect URLs:** Must include `http://localhost:5173` for local dev OAuth
