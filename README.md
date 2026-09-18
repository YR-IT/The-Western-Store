# The Western Store Kurukshetra 🛍️✨

A high-performance, boutique e-commerce web platform built for **The Western Store Kurukshetra**, featuring direct **WhatsApp Order Placement**, **ImageKit CDN photo uploads**, **Supabase PostgreSQL database with Realtime subscriptions**, and a dedicated **Boutique Admin Panel**.

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
 │ • Supabase Realtime WebSocket Pub/Sub        │  └──────────────▲───────────────┘
 └──────────────────────────────────────────────┘                 │
                                                                   │ (HMAC Signature)
                                                    ┌──────────────┴───────────────┐
                                                    │    EXPRESS BACKEND (RENDER)  │
                                                    │ • Admin Authentication       │
                                                    │ • ImageKit Upload Tokens     │
                                                    │ • Order Total Verification   │
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
├── backend/                  # Express API server (Admin Auth, ImageKit tokens, Orders)
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
│   │   ├── components/       # UI components (Storefront, PDP, PLP, AdminPanel, Lookbook)
│   │   ├── context/          # StoreContext (Catalog, Cart, Wishlist, Local Storage, Realtime)
│   │   ├── data/             # Initial metadata & store configurations
│   │   ├── lib/              # Supabase & ImageKit service wrappers
│   │   └── types.ts          # TypeScript type definitions
│   ├── .env.example          # Frontend public variables template
│   ├── vercel.json           # Vercel SPA router rewrite
│   ├── package.json
│   └── vite.config.ts
├── supabase_schema.sql       # Complete database schema (tables, triggers, RLS, realtime)
├── rls_polices_fix.sql       # 1-click script to truncate demo data & grant CRUD permissions
├── update_rls_policies.sql   # Standalone RLS security update script
├── seed_supabase.sql         # Optional sample demo catalog seed data
└── README.md                 # System documentation & deployment guide
```

---

## 🚀 Systemized Implementation & Setup Guide

To set up and run the entire platform from scratch, execute the following phases in sequence:

```
Step 1: Supabase DB ──► Step 2: ImageKit CDN ──► Step 3: Backend Server ──► Step 4: Frontend App
```

---

### Phase 1: Database Setup (Supabase)

1. **Create a Supabase Project**:
   - Go to [Supabase Console](https://supabase.com) and create a new project.
   - Go to **Project Settings → API** and copy:
     - `Project URL` (e.g. `https://xxxx.supabase.co`)
     - `anon / public key`
     - `service_role key` (keep this secret; only used in backend).

2. **Database SQL Scripts & Execution Guide**:
   Navigate to the **SQL Editor** in your Supabase Dashboard and run the appropriate scripts according to your workflow:

   | Script File | Purpose | When to Run |
   |---|---|---|
   | [`supabase_schema.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/supabase_schema.sql) | **Complete Database Schema** — Creates tables (`products`, `categories`, `orders`, `profiles`, `cart_items`, `wishlist_items`), triggers, Realtime broadcast publication, and base RLS. | **Mandatory on initial setup**. |
   | [`rls_polices_fix.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/rls_polices_fix.sql) | **Clean Slate + RLS Fix** — Truncates existing demo data and enables full Admin CRUD permissions (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) on `products` and `categories`. | **When starting fresh** with your own store inventory. |
   | [`update_rls_policies.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/update_rls_policies.sql) | **Standalone RLS Security Script** — Updates and grants full CRUD policies on `categories`, `products`, and `orders` **without** wiping or truncating existing inventory data. | **When fixing permissions** on an active database with existing items. |
   | [`seed_supabase.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/seed_supabase.sql) | **Demo Catalog Seed** — Inserts sample categories and curated boutique garments with tags, sizes, colors, and prices. | **Optional** (for development / demo testing). |

3. **Step-by-Step Initial Setup**:
   - **Step 2a (Required):** Open [`supabase_schema.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/supabase_schema.sql), paste its content into the Supabase SQL Editor, and click **Run**.
   - **Step 2b (Choose one):**
     - **For a fresh store (your own products):** Run [`rls_polices_fix.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/rls_polices_fix.sql).
     - **To preserve existing items & update permissions:** Run [`update_rls_policies.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/update_rls_policies.sql).
     - **To load sample demo items:** Run [`seed_supabase.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/seed_supabase.sql).

---

### Phase 2: Media CDN Setup (ImageKit)

1. Sign up for a free account at [ImageKit.io](https://imagekit.io).
2. Go to **Developer Options** in the ImageKit dashboard and copy:
   - **URL-endpoint** (e.g. `https://ik.imagekit.io/your_id`)
   - **Public Key** (`public_...`)
   - **Private Key** (`private_...`)

---

### Phase 3: Backend API Setup (Node/Express)

1. **Local Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
2. **Configure `backend/.env`**:
   ```env
   PORT=4000
   FRONTEND_URL=http://localhost:5173
   IMAGEKIT_PUBLIC_KEY=public_your_key_here
   IMAGEKIT_PRIVATE_KEY=private_your_key_here
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint_here
   SUPABASE_URL=https://your_project_id.supabase.co
   SUPABASE_KEY=your_supabase_anon_or_service_key
   ADMIN_EMAIL=admin@thewesternstore.com
   ADMIN_PASSWORD=admin123
   ADMIN_SECRET=westernstore_admin_2026
   ```
3. **Run Backend Locally**:
   ```bash
   npm run dev
   # API running on http://localhost:4000
   # Health check: http://localhost:4000/api/health
   ```
4. **Deploy Backend to Render**:
   - Create a **Web Service** on Render pointing to the `/backend` folder.
   - Add the environment variables listed in `backend/.env` under **Render Environment**.
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

---

### Phase 4: Frontend Web App Setup (React + Vite)

1. **Local Setup**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```
2. **Configure `frontend/.env`**:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   VITE_SUPABASE_URL=https://your_project_id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
3. **Run Frontend Locally**:
   ```bash
   npm run dev
   # App running at http://localhost:5173
   ```
4. **Deploy Frontend to Vercel / Netlify**:
   - Import repository root or `/frontend` into Vercel/Netlify.
   - Set Environment Variables:
     - `VITE_BACKEND_URL`: `https://your-backend.onrender.com`
     - `VITE_SUPABASE_URL`: `https://your_project_id.supabase.co`
     - `VITE_SUPABASE_ANON_KEY`: `your_supabase_anon_key_here`
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

## 👑 Boutique Admin Panel Guide

To access the boutique administrative portal:

1. Open the storefront in your browser.
2. Click the **Account / Login** button in the header and switch to **Admin Login**.
3. Default credentials (configurable in `backend/.env`):
   - **Email:** `admin@thewesternstore.com`
   - **Password:** `admin123`
4. Once authenticated, the Admin Dashboard allows you to:
   - **Product Management:** Add, edit, or delete garments, manage variants (sizes & colors), upload multi-angle photos directly to ImageKit CDN, and toggle live stock availability.
   - **Category Management:** Reorder store navigation tabs, create custom edits, and upload category banners.
   - **Live Order Tracking:** Manage incoming WhatsApp customer orders, assign Delhivery / Blue Dart AWB tracking numbers, generate instant WhatsApp customer dispatch messages, and update statuses.
   - **Homepage Layout Customizer:** Customize hero carousel slides, banner announcements, editorial lookbooks, trust badges, and boutique reviews.

---

## 🔐 Security & Architecture Safeguards

- **Persistent Deletion Safeguard:** Product and category deletions made in the admin portal are tracked with persistent identifiers, preventing deleted items from reappearing upon page reload.
- **Server-Side Validation:** Prices, garment options, and final bill totals are computed and verified server-side before orders are dispatched.
- **Admin Brute-Force Rate Limiting:** Login attempts are rate-limited via IP window protection.
- **Strict Key Isolation:** `IMAGEKIT_PRIVATE_KEY`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` are never bundled in client-side code.

---

*Handcrafted for **The Western Store Kurukshetra**.*
