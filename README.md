# The Western Store Kurukshetra 🛍️✨

A high-performance, live-ready e-commerce platform built for **The Western Store Kurukshetra**, combining catalog discovery with seamless **WhatsApp Order Placement**, **ImageKit CDN photo uploads**, **Supabase PostgreSQL database with Realtime subscriptions**, and a built-in **Boutique Admin Panel**.

---

## 🌟 Architecture Overview

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
 │ • Live Product Catalog & Categories          │  │ • Product Photo Gallery CDN  │
 │ • Customer Account & Auth Profiles           │  │ • Category Cover Images      │
 │ • Saved Shopping Cart & Wishlist Sync        │  │ • Automatic WebP Conversion  │
 │ • Customer Orders & Tracking History         │  │ • Real-time Image Resizing   │
 │ • Supabase Realtime WebSocket Pub/Sub        │  └──────────────▲───────────────┘
 └──────────────────────────────────────────────┘                 │
                                                                   │ (HMAC Signature)
                                                    ┌──────────────┴───────────────┐
                                                    │    EXPRESS BACKEND (RENDER)  │
                                                    │ • ImageKit Upload Tokens     │
                                                    │ • Keeps Private Key Secure   │
                                                    └──────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, `motion/react`, `lucide-react`.
- **Backend Service**: Node.js, Express.js, TypeScript, `@imagekit/nodejs` SDK.
- **Database & Security**: Supabase (PostgreSQL, Realtime Pub/Sub, RLS Security Policies).
- **Media CDN**: ImageKit global CDN with automatic WebP optimization.

---

## 📂 Repository Structure

```text
Western-Store/
├── backend/                  # Express API server (ImageKit auth & upload tokens)
│   ├── src/index.ts          # Server entry point
│   ├── render.yaml           # Render blueprint deployment file
│   ├── package.json
│   └── .env.example
├── frontend/                 # React + Vite storefront application
│   ├── public/
│   │   └── _redirects        # Netlify SPA redirect rule
│   ├── src/
│   │   ├── components/       # Storefront & Admin UI components
│   │   ├── context/          # React Context (StoreContext)
│   │   ├── lib/              # Supabase & ImageKit helper services
│   │   └── types.ts          # TypeScript interfaces
│   ├── vercel.json           # Vercel SPA rewrite rule
│   ├── package.json
│   └── .env.example
├── supabase_schema.sql       # Production PostgreSQL DB Schema & Realtime Setup
├── seed_supabase.sql         # Production Seed Data (Ethnic & Western Wear)
└── README.md
```

---

## 🚀 Complete Step-by-Step Production Deployment Guide

Follow this guide to deploy all 4 parts of the application to production:

---

### Step 1: Set Up Database on Supabase

1. **Create Supabase Project**:
   - Go to [Supabase Console](https://supabase.com) and create a new project.
   - Note down your **Project URL** (e.g., `https://xyzcompany.supabase.co`) and **Anon API Key** from **Project Settings → API**.

2. **Execute Database Schema**:
   - In Supabase Dashboard, go to **SQL Editor** → Click **New Query**.
   - Copy the entire contents of [`supabase_schema.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/supabase_schema.sql) into the SQL editor.
   - Click **Run**. This creates:
     - `categories` table
     - `products` table
     - `orders` table (with Realtime WebSocket enabled)
     - `profiles`, `cart_items`, `wishlist_items` tables
     - Auto-updating `updated_at` triggers and Row Level Security (RLS) policies.

3. **Seed Initial Categories & Products**:
   - In **SQL Editor**, open a new query tab.
   - Copy the contents of [`seed_supabase.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/seed_supabase.sql) into the editor.
   - Click **Run**. This pre-populates live Ethnic Wear and Western Wear collections.

---

### Step 2: Set Up Media CDN on ImageKit

1. **Create ImageKit Account**:
   - Register at [ImageKit.io](https://imagekit.io).
2. **Retrieve API Credentials**:
   - Go to **Developer Options** in the ImageKit Dashboard.
   - Copy the following details:
     - **Public Key** (e.g. `public_...`)
     - **Private Key** (e.g. `private_...`)
     - **URL Endpoint** (e.g. `https://ik.imagekit.io/your_imagekit_id`)

---

### Step 3: Deploy Backend API Service (Render)

The Express backend handles secure, 30-second HMAC token signatures for direct browser uploads to ImageKit without exposing private keys.

#### Deployment via Render (Recommended)

1. Sign in to [Render.com](https://render.com).
2. Click **New +** → Select **Web Service**.
3. Connect your GitHub repository (`Western-Store`).
4. Configure the service settings:
   - **Name**: `western-store-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Environment Variables**:
   Add the following variables in the Render Dashboard under **Environment**:

   | Key | Value / Example | Notes |
   |---|---|---|
   | `PORT` | `10000` | Port for Render |
   | `IMAGEKIT_PUBLIC_KEY` | `public_...` | From ImageKit Dashboard |
   | `IMAGEKIT_PRIVATE_KEY` | `private_...` | From ImageKit Dashboard |
   | `IMAGEKIT_URL_ENDPOINT` | `https://ik.imagekit.io/your_id` | From ImageKit Dashboard |
   | `ADMIN_SECRET` | `your_secure_admin_secret` | Custom secret for admin routes |
   | `FRONTEND_URL` | `https://your-store.vercel.app` | Production frontend domain for CORS |

6. Click **Create Web Service**.
7. Once deployed, test the health check endpoint in browser:
   `https://your-backend.onrender.com/health` → Should return `{"status":"ok","timestamp":"..."}`.

---

### Step 4: Deploy Storefront Web App (Vercel / Netlify)

#### Option A: Deploy to Vercel (Recommended)

1. Sign in to [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project** → Select your repository (`Western-Store`).
3. Set **Framework Preset**: `Vite`.
4. Set **Root Directory**: `frontend`.
5. Expand **Build and Output Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add **Environment Variables**:

   | Key | Value / Example |
   |---|---|
   | `VITE_BACKEND_URL` | `https://your-backend.onrender.com` |
   | `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

7. Click **Deploy**. Vercel will build and assign your production URL (e.g. `https://western-store.vercel.app`).

#### Option B: Deploy to Netlify

1. Sign in to [Netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**.
2. Select your repository → Set **Base directory** to `frontend`.
3. Set **Build command**: `npm run build` & **Publish directory**: `dist`.
4. Add environment variables (`VITE_BACKEND_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. Deploy site. (The included `public/_redirects` ensures SPA single-page routing).

---

### Step 5: Post-Deployment Verification Checklist

After deploying all services, perform the following end-to-end verification steps:

1. **Storefront Verification**:
   - Visit your production domain (e.g., `https://western-store.vercel.app`).
   - Confirm products load from Supabase with categories and prices displayed in ₹ INR.
2. **WhatsApp Order Checkout**:
   - Add a product to your cart → Proceed to Checkout → Fill customer name & address → Click **Place Order & Open WhatsApp**.
   - Verify that the order is generated, saved in Supabase `orders` table, and opens WhatsApp with formatted message.
3. **Admin Panel Real-time Verification**:
   - Log into Admin Panel → Navigate to **Orders & Tracking**.
   - Verify the newly placed order appears live in the table via Supabase Realtime subscriptions.
   - Test changing order status to **Shipped** and entering tracking number (e.g., Delhivery / Blue Dart).
4. **ImageKit Photo Upload Verification**:
   - In Admin Panel → Go to **Products** → Click **Add New Product**.
   - Upload a new photo directly from your device. Confirm the upload progress bar completes and displays the ImageKit CDN photo.

---

## ⚡ Local Setup & Development

If you want to run the project locally for development:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/adityanaulakha/Western-Store.git
   cd Western-Store
   ```

2. **Configure Local Environment Files**:
   - Copy `backend/.env.example` to `backend/.env` and update variables.
   - Copy `frontend/.env.example` to `frontend/.env` and update variables.

3. **Start Local Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Start Local Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:3000` in your browser.

---

## 🔒 Security Best Practices Implemented

- **Isolated Server Private Keys**: `IMAGEKIT_PRIVATE_KEY` and `ADMIN_SECRET` are kept strictly inside the backend environment.
- **Short-Lived Signature Tokens**: Upload authorization tokens expire after 30 seconds to prevent unauthorized reuse.
- **Database Row Level Security**: Supabase RLS policies enforce access permissions for customers and administrators.
- **Strict Input Validation**: Sanitize order inputs and UUID parameters to prevent SQL injection and database type mismatches.

---

*Built for **The Western Store Kurukshetra**.*
