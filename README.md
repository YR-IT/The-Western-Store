# The Western Store Kurukshetra 🛍️✨

A high-performance boutique e-commerce platform built for **The Western Store, Kurukshetra**. Features direct **WhatsApp order placement**, **ImageKit CDN** photo management, **Supabase PostgreSQL** with real-time subscriptions, and a fully role-protected **Boutique Admin Panel**.

---

## 🌟 System Architecture

```
 ┌────────────────────────────────────────────────────────────────────┐
 │                          FRONTEND APP                              │
 │            (React 18 · TypeScript · Vite · Vanilla CSS)            │
 └──────────────────────┬──────────────────────────┬─────────────────┘
                        │                          │
                        ▼                          ▼
 ┌─────────────────────────────────────┐  ┌───────────────────────────┐
 │              SUPABASE               │  │       IMAGEKIT CDN        │
 │   (PostgreSQL · Realtime · Auth)    │  │  (Image Storage & CDN)    │
 ├─────────────────────────────────────┤  ├───────────────────────────┤
 │ • Products & Categories Catalog     │  │ • Garment Product Photos  │
 │ • Customer Auth & Profiles          │  │ • Hero Banners & Covers   │
 │ • Cart & Wishlist Sync              │  │ • Budget Tile Images      │
 │ • Orders & Delivery Tracking        │  │ • Automatic WebP & Resize │
 │ • Store Settings (Hero, Reviews…)   │  └────────────▲──────────────┘
 │ • Realtime WebSocket Pub/Sub        │               │ HMAC Signature
 └─────────────────────────────────────┘  ┌────────────┴──────────────┐
                                          │  EXPRESS BACKEND (RENDER)  │
                                          │ • Admin Authentication      │
                                          │ • ImageKit Upload Tokens   │
                                          │ • Secret Keys (Private)    │
                                          └────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Vanilla CSS, `motion/react`, `lucide-react` |
| **Backend** | Node.js, Express.js, TypeScript, `@imagekit/nodejs` SDK, `express-rate-limit` |
| **Database & Auth** | Supabase (PostgreSQL 15, Realtime Pub/Sub, Row-Level Security, Auth) |
| **Media CDN** | ImageKit — global CDN, dynamic WebP conversion, real-time resizing |

---

## 📂 Repository Structure

```text
The Western Store/
├── backend/                    # Express API (Admin Auth, ImageKit tokens, Orders)
│   ├── src/
│   │   └── index.ts            # Express entry point & all secure API endpoints
│   ├── .env.example            # Backend environment variables template
│   ├── package.json
│   ├── render.yaml             # Render one-click deployment blueprint
│   └── tsconfig.json
├── frontend/                   # React storefront + Admin Panel
│   ├── public/
│   │   └── _redirects          # Netlify SPA router rewrite
│   ├── src/
│   │   ├── components/         # All UI components (storefront, PDP, PLP, Admin)
│   │   │   └── admin/          # Admin-only components (panels, editors, managers)
│   │   ├── context/            # StoreContext (global state, Supabase sync, realtime)
│   │   ├── data/
│   │   │   └── mockData.ts     # STORE_INFO constants & default config (no mock products)
│   │   ├── lib/                # Supabase & ImageKit service wrappers
│   │   ├── utils/              # Image helpers (compression, CDN URL optimization)
│   │   └── types.ts            # All TypeScript type definitions
│   ├── .env.example            # Frontend public variables template
│   ├── vercel.json             # Vercel SPA router rewrite
│   ├── package.json
│   └── vite.config.ts
├── supabase_schema.sql         # Full DB schema (tables, RLS, triggers, realtime, storage)
├── update_rls_policies.sql     # Quick-fix script — resolves RLS/permissions without data loss
└── README.md
```

> [!NOTE]
> **No seed data files are included.** The codebase ships clean — products, categories, hero images, and Instagram reels are all added exclusively through the **Admin Panel** and stored in your Supabase database and ImageKit CDN.

---

## 🚀 Setup Guide

```
Step 1: Database  ──►  Step 2: Media CDN  ──►  Step 3: Backend  ──►  Step 4: Frontend
```

---

### Step 1 — Database Setup (Supabase)

#### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Navigate to **Project Settings → API** and note down:
   - `Project URL` (e.g., `https://xxxxxxxxxxxx.supabase.co`)
   - `anon / public` key
   - `service_role` key *(keep this secret — backend only)*

#### 1.2 Run the Database Schema

1. Open **Supabase Dashboard → SQL Editor → New Query**.
2. Open [`supabase_schema.sql`](./supabase_schema.sql) from this repo, copy the entire contents, paste into the editor, and click **Run**.
3. Verify the result shows **`Success. No rows returned`**.

This single script creates:
- Tables: `products`, `categories`, `orders`, `profiles`, `cart_items`, `wishlist_items`, `store_settings`
- Supabase Realtime publication on all tables
- `videos` public storage bucket
- Production-hardened Row-Level Security policies

> [!IMPORTANT]
> Run **only** `supabase_schema.sql` for a fresh setup. Do **not** run any seed scripts — the store launches with a clean, empty database. All content is added via the Admin Panel.

#### 1.3 Enable Google Auth (Optional — for Customer Accounts)

1. Go to **Supabase Dashboard → Authentication → Providers**.
2. Enable **Google** and fill in your Google OAuth credentials.
3. Add your frontend domain to the **Redirect URLs** allowlist.

---

### Step 2 — Media CDN Setup (ImageKit)

1. Sign up at [imagekit.io](https://imagekit.io) (free tier is sufficient).
2. In the ImageKit Dashboard → **Developer Options**, copy:
   - **URL Endpoint** (e.g., `https://ik.imagekit.io/your_id`)
   - **Public Key** (`public_...`)
   - **Private Key** (`private_...`) *(keep secret — backend only)*

> [!NOTE]
> **No manual folder creation needed.** The Admin Panel automatically creates and routes assets into the correct ImageKit folders on first upload:
> - `/products` — Multi-angle garment photos
> - `/budget-photos` — Shop By Budget card cover images
> - `/hero-slides` — Homepage carousel banners
> - `/videos` — Vertical Instagram-style reels

---

### Step 3 — Backend API Setup

#### 3.1 Install Dependencies

```bash
cd backend
npm install
```

#### 3.2 Create `backend/.env`

Copy `.env.example` and fill in your real values:

```env
# ─── ImageKit Credentials ─────────────────────────────────────────
IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxxxxxxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# ─── Supabase Credentials ─────────────────────────────────────────
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ─── Admin Authentication (KEEP THESE SECRET) ─────────────────────
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_strong_password_here
ADMIN_SECRET=your_random_secret_string_here

# ─── Server Config ─────────────────────────────────────────────────
PORT=4000
FRONTEND_URL=http://localhost:5173
```

> [!CAUTION]
> Never commit `.env` to version control. The `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` are the credentials used to log in to the Admin Panel. Use strong, unique values for production.

#### 3.3 Start the Backend

```bash
npm run dev
```

Verify it's running: open `http://localhost:4000/api/health` — you should see `{ "status": "ok" }`.

#### 3.4 Deploy Backend to Render (Production)

1. Connect your GitHub repo on [render.com](https://render.com).
2. Create a **Web Service**, set root directory to `backend/`.
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add all environment variables from `backend/.env` under **Environment**.
6. After deployment, copy your Render service URL (e.g., `https://your-backend.onrender.com`) — you'll need it in Step 4.

---

### Step 4 — Frontend App Setup

#### 4.1 Install Dependencies

```bash
cd frontend
npm install
```

#### 4.2 Create `frontend/.env`

Copy `.env.example` and fill in your values:

```env
# Backend API URL — use http://localhost:4000 for local dev
# Use your live Render URL for production
VITE_BACKEND_URL=http://localhost:4000

# Supabase — use the anon/public key (NOT service_role)
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

#### 4.3 Start the Frontend

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

#### 4.4 Deploy Frontend to Vercel (Production)

1. Connect your GitHub repo on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend/`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add the 3 environment variables — set `VITE_BACKEND_URL` to your live Render backend URL.
6. Deploy. The `vercel.json` in the repo handles SPA routing automatically.

> [!TIP]
> For **Netlify** deployments, `public/_redirects` handles SPA routing. Set the same 3 environment variables in Netlify's site settings.

---

## 👑 Admin Panel Guide

### Accessing the Admin Panel

1. Open the storefront in your browser.
2. Click the **Account icon** in the top navigation bar.
3. Switch to the **Admin Login** tab.
4. Enter the credentials you set in `backend/.env`:
   - **Email:** value of `ADMIN_EMAIL`
   - **Password:** value of `ADMIN_PASSWORD`
5. Once logged in, the **Store Admin Panel** link appears in your account menu.

### Admin Capabilities

| Section | What You Can Do |
|---|---|
| **Dashboard** | Live order count, revenue summary, and quick-access links |
| **Products** | Add/edit/delete garments — upload multi-angle ImageKit photos, set sizes, colors, price, budget tier, stock |
| **Categories** | Create collections, upload cover art, reorder navigation |
| **Orders** | View all customer orders, update delivery status, assign courier AWB numbers, send WhatsApp dispatch alerts |
| **Homepage** | Configure hero banners (desktop + mobile), Shop By Budget cards with images, trust badges, announcement bar |
| **Reviews** | Add, edit, or remove customer testimonials displayed on the storefront |
| **Instagram Feed** | Upload and manage vertical video reels shown in the Instagram section |
| **Media Library** | Browse, filter, and delete all ImageKit CDN assets by folder |

---

## 🔧 Troubleshooting

### `store_settings: 404 Not Found` / Hero slides not persisting

**Cause:** The `store_settings` table doesn't exist or PostgREST schema cache is stale.

**Fix:** Run [`update_rls_policies.sql`](./update_rls_policies.sql) in the Supabase SQL Editor. This is a safe, non-destructive script that creates missing tables, fixes permissions, and refreshes the cache without touching existing products or orders.

---

### `new row violates row-level security policy`

**Cause:** A Supabase RLS policy is blocking an insert or update.

**Fix:** Run [`update_rls_policies.sql`](./update_rls_policies.sql) — it resets all RLS policies across every table to the correct production configuration.

---

### Video / Reel Upload Fails (`bucket not found`)

**Cause:** The `videos` storage bucket hasn't been created, or it's set to private.

**Fix:**
1. Go to **Supabase Dashboard → Storage**.
2. If the `videos` bucket is missing, run [`update_rls_policies.sql`](./update_rls_policies.sql) — it creates the bucket automatically.
3. Alternatively, create it manually: click **New bucket**, name it `videos`, enable **Public bucket**.

---

### ImageKit 401 Unauthorized / Upload Signature Fails

**Cause:** Missing or incorrect ImageKit credentials in `backend/.env`, or the backend is not running.

**Fix:**
1. Confirm the backend is live: `http://localhost:4000/api/health` should return `{ "status": "ok" }`.
2. Double-check `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT` match your ImageKit dashboard exactly.
3. Confirm you are logged in as Admin in the storefront (the frontend sends the `x-admin-secret` header only when authenticated as admin).

---

### Products / Categories Not Showing After Refresh

**Cause:** Supabase `anon` role doesn't have SELECT permission on the tables.

**Fix:** Run [`update_rls_policies.sql`](./update_rls_policies.sql) — it ensures public read access is correctly configured on all tables.

---

## 🔐 Security Notes

- **Admin credentials** (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`) live only in `backend/.env` — they are never exposed to the browser.
- **ImageKit Private Key** and **Supabase Service Role Key** are backend-only — never set in frontend env variables.
- **Frontend env** uses only the `anon` (public) Supabase key, which is safe to expose.
- **RLS policies** ensure customers can only read public data and write their own cart/wishlist/orders. Admin mutations require either the service role key or a verified admin profile row.
- The Admin Panel link is hidden from non-admin sessions and all admin API endpoints require the `x-admin-secret` header.

---

*Built for **The Western Store Kurukshetra** — Opp. Hotel Pearl Marc, Railway Road, Kurukshetra.*
