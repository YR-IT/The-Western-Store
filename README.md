# The Western Store Kurukshetra 🛍️✨

A high-performance, boutique e-commerce web platform built for **The Western Store Kurukshetra**, featuring direct **WhatsApp Order Placement**, **ImageKit CDN photo uploads**, **Supabase PostgreSQL database with Realtime subscriptions**, and a dedicated, role-protected **Boutique Admin Panel**.

---

## 🌟 System Architecture

```
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                               FRONTEND APP                                      │
 │                (React 18 + TypeScript + Vite + Tailwind CSS)                    │
 └───────────────────────┬─────────────────────────────────┬───────────────────────┘
                         │                                 │
                         ▼                                 ▼
 ┌──────────────────────────────────────────────┐  ┌──────────────────────────────┐
 │                  SUPABASE                    │  │         IMAGEKIT CDN         │
 │     (PostgreSQL Database & Realtime WS)      │  │   (Image Storage & Delivery) │
 ├──────────────────────────────────────────────┤  ├──────────────────────────────┤
 │ • Live Product Catalog & Categories          │  │ • High-res Garment Media CDN │
 │ • Customer Account & Auth Profiles           │  │ • Category Cover Images      │
 │ • Saved Shopping Cart & Wishlist Sync        │  │ • Automatic WebP Conversion  │
 │ • Customer Orders & Tracking History         │  │ • Real-time Image Resizing   │
 │ • Store Settings (Hero, Reels, Reviews)      │  └──────────────▲───────────────┘
 │ • Supabase Realtime WebSocket Pub/Sub        │                 │
 └──────────────────────────────────────────────┘                 │ (HMAC Signature)
                                                    ┌──────────────┴───────────────┐
                                                    │    EXPRESS BACKEND (RENDER)  │
                                                    │ • Admin Authentication       │
                                                    │ • ImageKit Upload Tokens     │
                                                    │ • Order Total Verification   │
                                                    │ • Store Settings Persistence │
                                                    │ • Keeps Secret Keys Private  │
                                                    └──────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, `motion/react`, `lucide-react`.
- **Backend Service**: Node.js, Express.js, TypeScript, `@imagekit/nodejs` SDK, `express-rate-limit`.
- **Database & Realtime**: Supabase (PostgreSQL 15, Realtime Pub/Sub, Row-Level Security).
- **Media CDN**: ImageKit global CDN with dynamic format conversion & WebP compression.

---

## 📂 Repository File Structure

```text
The Western Store/
├── backend/                  # Express API server (Admin Auth, ImageKit tokens, Orders, Settings)
│   ├── src/
│   │   └── index.ts          # Express entry point & secure endpoints
│   ├── .env.example          # Backend environment variables template
│   ├── package.json
│   ├── render.yaml           # Render deployment blueprint
│   └── tsconfig.json
├── frontend/                 # React storefront & admin portal
│   ├── public/
│   │   └── _redirects        # Netlify SPA router rewrite
│   ├── src/
│   │   ├── components/       # UI components (Storefront, PDP, PLP, AdminPanel, Header, Footer)
│   │   ├── context/          # StoreContext (Catalog, Cart, Wishlist, Local Storage, Realtime)
│   │   ├── data/             # Initial metadata & store configurations
│   │   ├── lib/              # Supabase & ImageKit service wrappers
│   │   └── types.ts          # TypeScript type definitions
│   ├── .env.example          # Frontend public variables template
│   ├── vercel.json           # Vercel SPA router rewrite
│   ├── package.json
│   └── vite.config.ts
├── supabase_schema.sql       # Complete database schema (tables, triggers, RLS, realtime, storage)
├── update_rls_policies.sql   # Standalone 1-click script to fix RLS, 404 store_settings & storage without losing data
├── seed_supabase.sql         # Optional sample demo catalog seed data
├── clean_catalog_reset.sql   # Clean slate script to wipe test products & categories for live launch
├── SECURITY_PATCH_PLAN.md    # Security checklist & implementation status
└── README.md                 # System documentation & execution guide
```

---

## 🚀 Step-by-Step Setup Guide

Follow these 4 simple steps to get the entire project running locally or in production:

```
Step 1: Database Setup ──► Step 2: Media CDN ──► Step 3: Backend API ──► Step 4: Frontend App
```

---

### Step 1: Database Setup (Supabase)

1. **Create a Supabase Project**:
   - Go to [Supabase](https://supabase.com) and create a new project.
   - Go to **Project Settings → API** and copy:
     - `Project URL` (e.g., `https://xxxx.supabase.co`)
     - `anon / public key`
     - `service_role key` (keep secret; backend only).

2. **Choose the SQL Script to Run in Supabase SQL Editor**:

| Goal | Script to Run | Description |
|---|---|---|
| **Fresh Setup (New Database)** | [`supabase_schema.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/supabase_schema.sql) | Creates all tables (`products`, `categories`, `orders`, `profiles`, `cart_items`, `wishlist_items`, `store_settings`), real-time sync publications, `videos` storage bucket, and production-hardened RLS policies. |
| **Fix Existing DB / Resolve Errors** | [`update_rls_policies.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/update_rls_policies.sql) | **1-Click Quick Fix**: Resolves `store_settings` 404 errors, RLS permission errors, creates missing `videos` storage bucket, grants role access, and refreshes the PostgREST cache **without losing existing products or categories**. |
| **Populate Sample Test Products** | [`seed_supabase.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/seed_supabase.sql) | Inserts sample categories and curated boutique items (suits, sarees, co-ords) for testing and development. |
| **Wipe Test Data (Clean Slate)** | [`clean_catalog_reset.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/clean_catalog_reset.sql) | Safely truncates test products and categories to launch with your own authentic boutique inventory (preserves customer accounts, orders, and store settings). |

3. **Execution Instructions**:
   1. Open **Supabase Dashboard → SQL Editor**.
   2. Click **New query**.
   3. Copy the contents of the chosen `.sql` file, paste into the editor, and click **Run**.
   4. Verify that the query returns **`Success. No rows returned`**.

---

### Step 2: Media CDN Setup (ImageKit)

1. Sign up for a free account at [ImageKit.io](https://imagekit.io).
2. In the ImageKit Dashboard, go to **Developer Options** and copy:
   - **URL-endpoint** (e.g. `https://ik.imagekit.io/your_id`)
   - **Public Key** (`public_...`)
   - **Private Key** (`private_...`)

---

### Step 3: Backend API Setup (Node / Express)

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure `backend/.env`**:
   ```env
   PORT=4000
   FRONTEND_URL=http://localhost:5173
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint_id
   SUPABASE_URL=https://your_project_id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ADMIN_EMAIL=admin@thewesternstore.com
   ADMIN_PASSWORD=admin123
   ADMIN_SECRET=westernstore_admin_2026
   ```

3. **Start the backend server**:
   ```bash
   npm run dev
   ```
   Verify at: `http://localhost:4000/api/health`

4. **Deploy Backend to Render (Optional)**:
   - Connect the repo on [Render](https://render.com) and create a **Web Service** with root directory `/backend`.
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add the environment variables from `backend/.env`.

---

### Step 4: Frontend Web App Setup (React + Vite)

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure `frontend/.env`**:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   VITE_SUPABASE_URL=https://your_project_id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start the frontend application**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Deploy Frontend to Vercel / Netlify (Optional)**:
   - Set the root directory to `/frontend` (or deploy root).
   - Set Build Command: `npm run build`
   - Set Output Directory: `dist`
   - Add the 3 environment variables from `frontend/.env` (pointing `VITE_BACKEND_URL` to your live Render backend URL).

---

## 🔧 Troubleshooting & Error Resolution Guide

Here is the exact step-by-step resolution for common issues:

### 1. 🔴 `store_settings?select=*: 404 (Not Found)` / Hero Slides or Reels Not Loading
* **Symptom:** In the browser console, you see `.../rest/v1/store_settings?select=*: 404` and hero slides or reels do not persist or load from Supabase.
* **Root Cause:** The `store_settings` table was not yet created, permissions were not granted to `anon`/`authenticated` roles, or PostgREST's schema cache has not reloaded.
* **Step-by-Step Fix:**
  1. Open **Supabase Dashboard → SQL Editor**.
  2. Copy and paste the following snippet (or run [`update_rls_policies.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/update_rls_policies.sql)):
     ```sql
     CREATE TABLE IF NOT EXISTS public.store_settings (
       key TEXT PRIMARY KEY,
       value JSONB NOT NULL,
       updated_at TIMESTAMPTZ DEFAULT NOW()
     );
     GRANT ALL ON TABLE public.store_settings TO anon, authenticated, service_role;
     GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
     ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
     DROP POLICY IF EXISTS "Public Store Settings Read" ON public.store_settings;
     CREATE POLICY "Public Store Settings Read" ON public.store_settings FOR SELECT USING (true);
     NOTIFY pgrst, 'reload schema';
     ```
  3. Click **Run**.
  4. Refresh your browser page. The 404 will disappear immediately.

---

### 2. 🔴 `new row violates row-level security policy` / RLS Permission Denied Error
* **Symptom:** Saving a product, category, or order fails with a Supabase policy violation error.
* **Root Cause:** Supabase RLS is enabled without the appropriate `INSERT`/`UPDATE` policy for the active role.
* **Step-by-Step Fix:**
  1. Run [`update_rls_policies.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/update_rls_policies.sql) in your Supabase SQL Editor.
  2. This updates all RLS policies across `categories`, `products`, `orders`, and `store_settings` while ensuring public readability and admin/service-role write authorization.

---

### 3. 🔴 Supabase Video / Reel Upload Error (`bucket not found` or `storage error`)
* **Symptom:** Uploading `.mp4` video reels in the Admin Panel fails.
* **Root Cause:** The Supabase Storage bucket named `videos` has not been initialized or is set to private.
* **Step-by-Step Fix:**
  1. Go to **Supabase Dashboard → Storage**.
  2. If the `videos` bucket does not exist, run [`update_rls_policies.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/update_rls_policies.sql) (or click **New bucket**, name it `videos`, and toggle **Public bucket** to ON).
  3. Ensure the MIME types `video/mp4, video/webm, video/quicktime` are accepted.

---

### 4. 🔴 ImageKit 401 Unauthorized / "Failed to generate upload authentication"
* **Symptom:** Product photo upload modal says unauthorized or fails to generate signature.
* **Root Cause:** `backend/.env` is missing `IMAGEKIT_PRIVATE_KEY` / `ADMIN_SECRET` or the backend server is offline.
* **Step-by-Step Fix:**
  1. Verify the backend is running by opening `http://localhost:4000/api/health` in your browser.
  2. Check that `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT` in `backend/.env` match your ImageKit developer console.
  3. Make sure you are logged in as Admin so the frontend sends the valid `x-admin-secret` header.

---

## 👑 Boutique Admin Panel Guide

### How to Access Admin Panel:
1. Open the storefront in your browser.
2. Click the **User / Account icon** in the top navigation bar.
3. Switch to the **Admin Login** tab.
4. Default credentials:
   - **Email:** `admin@thewesternstore.com`
   - **Password:** `admin123` *(change in `backend/.env` for production)*
5. Once logged in, the **Store Admin Panel** option will appear in your account menu, allowing you to access the dashboard.

### Admin Capabilities:
- **Product Management:** Add, edit, delete products, manage multi-angle ImageKit images, sizes, colors, and stock counts.
- **Category Management:** Create collections, reorder navigation items, upload banner artwork.
- **Live Order Tracking:** View customer orders, update delivery milestones, assign courier AWB tracking numbers, and trigger instant WhatsApp dispatch messages.
- **Homepage Customizer:** Customize hero slides, autoplay video reels, trust badges, customer reviews, and announcement banners.

---

## 🔐 Security Hardening & Best Practices

- **Role-Protected Navigation:** The Store Admin link is completely hidden from non-admin visitors and protected by server-side verification.
- **Client Route Guards:** Unauthenticated users attempting to access `/admin` are immediately redirected to the storefront.
- **Secure Backend Endpoints:** Administrative endpoints (ImageKit token generation, media file deletion, store settings mutations) require strict `x-admin-secret` header authorization.
- **Production Row-Level Security:** Database mutations are locked to admin roles and backend service credentials while preserving fast, public reads for customer catalog browsing.

---

*Handcrafted for **The Western Store Kurukshetra**.*
