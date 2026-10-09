# 03 — Environment Variables & Secrets

> ⚠️ **NEVER commit this file or the `.env` file to git.** The `.gitignore` excludes `.env`.

---

## 🔧 Backend — `backend/.env`

| Variable | Value / Status | Notes |
|----------|---------------|-------|
| `PORT` | `4000` | Express server port |
| `ADMIN_EMAIL` | `admin@thewesternstore.com` | Admin login email |
| `ADMIN_PASSWORD` | `admin123` | Admin login password — **change before production** |
| `ADMIN_SECRET` | `westernstore_admin_2026` | Legacy secret (kept for compatibility) |
| `JWT_SECRET` | `tws_jwt_super_secret_2026_western_store_secure_key` | Signs admin JWT tokens (12h expiry) — **must be strong in prod** |
| `FRONTEND_URL` | `http://localhost:3000` | CORS allowlist entry for production URL |
| `IMAGEKIT_PRIVATE_KEY` | `private_7xyIsY7IQdFAl+ggCJD/Luu9rDk=` | ImageKit server-side upload auth |
| `IMAGEKIT_PUBLIC_KEY` | `public_K6Mwc5OpDWUwOwpLt1E1Biulzfw=` | ImageKit public identifier |
| `IMAGEKIT_URL_ENDPOINT` | `https://ik.imagekit.io/kndawzmos` | Base URL for all ImageKit images |
| `SUPABASE_URL` | `https://tgvqrxnyrougiidkdwkg.supabase.co` | Supabase project URL |
| `SUPABASE_KEY` | (anon key — see .env) | Supabase anon/public key |
| `RAZORPAY_KEY_ID` | ⚠️ **Not set** | Razorpay live key — KYC not yet completed |
| `RAZORPAY_KEY_SECRET` | ⚠️ **Not set** | Razorpay secret — KYC not yet completed |

### ⚠️ Important: `tsx watch` & `.env` Changes
`tsx watch` only watches `.ts` files. If you edit `.env`, the server **will NOT auto-restart**.  
**Fix:** Run `touch src/index.ts` to force a restart and re-read the new env values.

---

## 🔧 Frontend — `frontend/.env` (if exists) / Vite env

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_BACKEND_URL` | `http://localhost:4000` (default) | Override to point to production backend |

If `VITE_BACKEND_URL` is not set, the frontend defaults to `http://localhost:4000`.

---

## 🔑 Third-Party Services

### ImageKit.io
- **Endpoint:** `https://ik.imagekit.io/kndawzmos`
- **Usage:** All product images, hero banners, category images are uploaded to and served from ImageKit
- **Auth flow:** Frontend requests a signed token from `/api/imagekit/auth`, then uploads directly
- **Transforms used:** Width + quality params for responsive images

### Supabase
- **Project URL:** `https://tgvqrxnyrougiidkdwkg.supabase.co`
- **Auth:** Google OAuth + email/password (for customers only)
- **Database:** PostgreSQL — tables for products, categories, orders, hero slides, etc.
- **Storage:** Not used — images go through ImageKit

### Razorpay
- **Status:** 🟡 Integration code exists, sandbox mode only
- **KYC Status:** ⚠️ Not completed — owner needs to submit:
  - Business website (for verification)
  - Legal business name
  - GSTIN
  - Bank account details
- **Behavior without keys:** Backend runs in "sandbox notification mode" — no real payments processed
- **Note:** Owner can submit website for KYC verification first, then fill remaining details later

---

## 🔐 CORS Allowlist (Backend)

Requests are allowed from:
- `FRONTEND_URL` env var
- `http://localhost:3000`
- `http://localhost:5173`

Add production domain to `FRONTEND_URL` in `.env` when deploying.
