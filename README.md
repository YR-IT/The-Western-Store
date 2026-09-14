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
                                                    │ • Secure Order Validation    │
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
├── backend/                  # Express API server (ImageKit auth, order validation)
│   ├── src/index.ts          # Server entry point & Order API
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
├── supabase_schema.sql       # Production PostgreSQL DB Schema
├── update_rls_policies.sql   # Security policy enforcement script
├── seed_supabase.sql         # Production Seed Data
└── README.md
```

---

## 🚀 Complete Step-by-Step Production Deployment Guide

Follow this guide to deploy all parts of the application to production:

### Step 1: Set Up Database on Supabase

1. **Create Supabase Project**:
   - Go to [Supabase Console](https://supabase.com) and create a new project.
   - Note down your **Project URL** and **Anon API Key** from **Project Settings → API**.

2. **Execute Database Schema**:
   - In Supabase Dashboard, go to **SQL Editor** → Click **New Query**.
   - Execute [`supabase_schema.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/supabase_schema.sql).

3. **Seed Initial Categories & Products**:
   - Execute [`seed_supabase.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/seed_supabase.sql) in a new SQL query tab.

4. **Enforce Security Policies**:
   - **CRITICAL:** Execute [`update_rls_policies.sql`](file:///Users/aditya/Desktop/WORK/The%20Western%20Store/update_rls_policies.sql) in a new SQL query tab to secure your database against unauthorized modifications.

---

### Step 2: Set Up Media CDN on ImageKit

1. Register at [ImageKit.io](https://imagekit.io).
2. Retrieve your **Public Key**, **Private Key**, and **URL Endpoint** from **Developer Options**.

---

### Step 3: Deploy Backend API Service (Render)

The Express backend now handles secure, server-side order processing and validation.

1. Create a new Web Service on Render.
2. **Environment Variables**:
   Add the following variables under **Environment**:

   | Key | Value / Example | Notes |
   |---|---|---|
   | `PORT` | `10000` | Port for Render |
   | `IMAGEKIT_PUBLIC_KEY` | `public_...` | From ImageKit Dashboard |
   | `IMAGEKIT_PRIVATE_KEY` | `private_...` | From ImageKit Dashboard |
   | `IMAGEKIT_URL_ENDPOINT` | `https://ik.imagekit.io/your_id` | From ImageKit Dashboard |
   | `SUPABASE_URL` | `https://your-project-id.supabase.co` | |
   | `SUPABASE_SERVICE_ROLE_KEY` | `ey...` | **SECRET** Supabase Service Role Key |
   | `ADMIN_EMAIL` | `admin@thewesternstore.com` | |
   | `ADMIN_PASSWORD` | `your_secure_password_2026` | |
   | `ADMIN_SECRET` | `your_secure_admin_secret` | Custom secret for admin routes |
   | `FRONTEND_URL` | `https://your-store.vercel.app` | Production frontend domain for CORS |

---

### Step 4: Deploy Storefront Web App

Add the following environment variables to your deployment platform (Vercel/Netlify):

| Key | Value / Example |
|---|---|
| `VITE_BACKEND_URL` | `https://your-backend.onrender.com` |
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

---

## 🔒 Security Best Practices Implemented

- **Server-Side Order Processing**: Prices and totals are validated on the backend via the `POST /api/orders` endpoint, preventing client-side manipulation.
- **Strict RLS Policies**: Database modification (INSERT/UPDATE/DELETE) is restricted to authenticated administrators.
- **Admin Login Rate Limiting**: The `/api/admin/login` endpoint is protected against brute-force attacks via `express-rate-limit`.
- **Isolated Credentials**: Administrative keys (Service Role Key, ImageKit Private Key) are never exposed to the frontend.

*Built for **The Western Store Kurukshetra**.*
