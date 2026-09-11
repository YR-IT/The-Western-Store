# The Western Store Kurukshetra 🛍️✨

A modern, high-performance hybrid e-commerce platform crafted for **The Western Store Kurukshetra**, combining catalog browsing with seamless **WhatsApp Order Checkout**, **ImageKit CDN photo uploads**, **Supabase PostgreSQL database**, and a built-in **Boutique Admin Panel**.

---

## 🌟 Key Features

### 🛍️ Storefront & Customer Experience
- **Interactive Editorial Lookbook**: Hotspot pins highlighting curated ethnic and western outfits.
- **Fabric Detail Hover-to-Zoom**: Magnified lens up to 2.25x on PDP images for inspecting weave textures, embroidery, and zari work.
- **Dynamic Category & Budget Filtering**: Price-tier discovery cards (Under ₹999, Under ₹1499, Under ₹1999, Premium Edit).
- **WhatsApp Order Checkout**: Converts shopping bag into itemized WhatsApp messages sent directly to store staff while saving order records.
- **Live Order Tracking**: Customer order tracking by Order ID / Mobile number with real-time status timeline updates.
- **Wishlist & Cart Sync**: Synchronizes cart and wishlist across devices using Supabase and local storage caching.

### 🛡️ Admin Management & CMS Panel
- **Inventory Management**: Add, edit, and manage garment products, stock quantities (`inStockCount`), sizes, colors, and fabric details.
- **Smart Admin Stock Deduction**: Stock automatically decrements **only** when the store owner confirms/ships an order from the admin panel.
- **Category Manager**: Create, edit, and organize boutique departments and circular category icons.
- **Homepage CMS**: Re-order sections (Hero, Categories, New Arrivals, Lookbook, Instagram, Testimonials) dynamically.
- **Direct ImageKit CDN Uploads**: Upload product/category photos directly from PC/phone with live progress feedback.

---

## 🏗️ Architecture & Technology Stack

```
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                               FRONTEND APP                                      │
 │                (React 18 + TypeScript + Vite + Tailwind CSS)                    │
 └───────────────────────┬─────────────────────────────────┬───────────────────────┘
                         │                                 │
                         ▼                                 ▼
 ┌──────────────────────────────────────────────┐  ┌──────────────────────────────┐
 │                  SUPABASE                    │  │         IMAGEKIT CDN         │
 │           (PostgreSQL DB + Auth)             │  │   (Image Storage & Delivery) │
 ├──────────────────────────────────────────────┤  ├──────────────────────────────┤
 │ • Customer Auth (Google & Email Login)       │  │ • Product Photos Gallery     │
 │ • Customer Profiles & Shipping Addresses     │  │ • Category Cover Banners     │
 │ • Product Catalog Specs & Descriptions      │  │ • Automatic WebP Conversion  │
 │ • Price, Discount & In-Stock Quantities      │  │ • Real-time Image Resizing   │
 │ • Saved Cart & Wishlist Sync                 │  └──────────────▲───────────────┘
 │ • Order Records & Status Tracking            │                 │
 └──────────────────────────────────────────────┘                 │ (Secure Upload)
                                                                  │
                                                   ┌──────────────┴───────────────┐
                                                   │    EXPRESS BACKEND (RENDER)  │
                                                   │ • Server Admin Authentication│
                                                   │ • ImageKit Auth Signatures   │
                                                   │ • Keeps Private Key Safe     │
                                                   └──────────────────────────────┘
```

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, `motion/react`, `lucide-react`.
- **Backend API**: Node.js, Express.js, TypeScript, `@imagekit/nodejs` SDK.
- **Database & Security**: Supabase (PostgreSQL Database, Auth, Row Level Security policies).
- **Media CDN**: ImageKit global CDN with automatic WebP optimization.

---

## 📂 Repository Structure

```text
Western-Store/
├── backend/                  # Express API server (ImageKit auth & admin login)
│   ├── src/index.ts          # Server entry point
│   ├── render.yaml           # Render blueprint deployment file
│   ├── package.json
│   └── .env.example
├── frontend/                 # React + Vite storefront application
│   ├── src/
│   │   ├── components/       # Storefront & Admin UI components
│   │   ├── context/          # React Context (StoreContext)
│   │   ├── lib/              # Supabase & ImageKit helper services
│   │   └── types.ts          # TypeScript interfaces
│   ├── package.json
│   └── .env.example
├── supabase_schema.sql       # Production SQL Schema for Supabase
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/adityanaulakha/Western-Store.git
cd Western-Store
```

### 2. Configure Backend Environment
Create `backend/.env`:
```env
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
ADMIN_EMAIL=admin@thewesternstore.com
ADMIN_PASSWORD=your_admin_password
ADMIN_SECRET=your_admin_secret_key
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### 3. Configure Frontend Environment
Create `frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Supabase Database
1. Open your project on [Supabase Console](https://supabase.com).
2. Go to **SQL Editor** → Paste contents of `supabase_schema.sql` → Click **Run**.

### 5. Run Backend & Frontend

**Terminal 1 (Backend)**:
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🚀 Deployment Guide

### Deploy Backend to Render
1. Create a Web Service on [Render](https://render.com).
2. Connect your repo and set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install && npm run build` and **Start Command** to `npm start`.
4. Add environment variables (`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`).

### Deploy Frontend to Vercel / Netlify
1. Import repository and select `frontend` directory.
2. Set Build Command: `npm run build` & Output Directory: `dist`.
3. Add Environment Variable: `VITE_BACKEND_URL=https://your-backend.onrender.com`.

---

## 🔒 Security Best Practices Implemented
- **Private Key Isolation**: Private keys (`IMAGEKIT_PRIVATE_KEY`, `ADMIN_PASSWORD`) exist exclusively on the server.
- **Short-Lived Upload Tokens**: Frontend requests 30-second HMAC signatures for ImageKit uploads.
- **Row Level Security (RLS)**: PostgreSQL policies enforce strict row permissions per user.
- **No Hardcoded Secrets**: All keys, passwords, and connection strings are managed via Environment Variables.

---

*Built for **The Western Store Kurukshetra**.*
