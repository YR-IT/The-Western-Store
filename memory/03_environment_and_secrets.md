# 03 — Environment Variables & Secrets

> ⚠️ **NEVER commit real production secrets carelessly.** Prefer mirroring values from `backend/.env` locally; keep Render/Vercel dashboards as source of truth for prod.

---

## 🔧 Backend — `backend/.env`

| Variable | Value / Status | Notes |
|----------|---------------|-------|
| `PORT` | `4000` | Express server port (Render also sets `PORT`) |
| `ADMIN_EMAIL` | `admin@thewesternstore.com` | Admin login email |
| `ADMIN_PASSWORD` | `admin123` | Admin login password — **change before hard launch** |
| `ADMIN_SECRET` | `westernstore_admin_2026` | Legacy secret (kept for compatibility) |
| `JWT_SECRET` | `tws_jwt_super_secret_2026_western_store_secure_key` | Signs admin JWT tokens (12h expiry) |
| `FRONTEND_URL` | `http://localhost:3000` locally | Prod CORS also allowlists `thewesternstore.in` + Vercel previews |
| `IMAGEKIT_PRIVATE_KEY` | `private_Zg4KcBf6/Y1qlE/UL1Q9nkLVEeI=` | ImageKit account **89dmpbgrm** |
| `IMAGEKIT_PUBLIC_KEY` | `public_T/sj0t3BMoUZCztm+VThmtygX8s=` | Must match private key account |
| `IMAGEKIT_URL_ENDPOINT` | `https://ik.imagekit.io/89dmpbgrm` | CDN base URL |
| `SUPABASE_URL` | `https://ghdrlqzcdmysnpmlkeju.supabase.co` | Active Supabase project |
| `SUPABASE_KEY` | (service role / key in `.env`) | Backend catalog + orders |
| `RAZORPAY_KEY_ID` | ⚠️ **Not set on Render** | Sandbox notification mode until set |
| `RAZORPAY_KEY_SECRET` | ⚠️ **Not set on Render** | Same |

### ⚠️ Important: `tsx watch` & `.env` Changes
`tsx watch` only watches `.ts` files. If you edit `.env`, the server **will NOT auto-restart**.  
**Fix:** Run `touch src/index.ts` to force a restart and re-read the new env values.

---

## 🔧 Frontend — Vite env

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_BACKEND_URL` | Prod: `https://the-western-store.onrender.com` | Baked at build time on Vercel |
| `VITE_SUPABASE_URL` | Same Supabase project | Customer auth + public catalog reads |
| `VITE_SUPABASE_ANON_KEY` | Anon key | Public client |

Local default if unset: `http://localhost:4000` for backend (ImageKit uploader also falls back to Render URL off-localhost).

---

## 🔑 Third-Party Services

### ImageKit.io (account id `89dmpbgrm`)
- **Endpoint:** `https://ik.imagekit.io/89dmpbgrm`
- **Usage:** Product photos, hero banners, budget cards, promo banners
- **Upload flow (current):** Admin JWT → `POST /api/imagekit/upload` (base64) → backend uploads with private key → returns CDN URL
- **Also available:** `GET /api/imagekit/auth` (legacy client-side signature) and media library list/delete
- **UI:** No paste-image-URL fields — upload + media library only
- **Safari note:** File input must not use restrictive `accept` / programmatic `click()` or macOS greys out Upload

### Supabase
- **Project URL:** `https://ghdrlqzcdmysnpmlkeju.supabase.co`
- **Auth:** Google OAuth + email/password (customers)
- **Database:** products, categories, orders, store_settings, etc.
- **Images:** Stored as ImageKit URLs in DB (not Supabase Storage)

### Razorpay
- **Status:** 🟡 Code present; keys often unset → sandbox notification mode
- **KYC:** Owner action still required for live payments

---

## 🔐 CORS Allowlist (Backend)

Allowed origins include:
- `FRONTEND_URL`
- `http://localhost:3000` / `5173` / `4173`
- `https://www.thewesternstore.in` / `https://thewesternstore.in`
- `*.vercel.app` previews
- `trust proxy` enabled for Render / Cloudflare `X-Forwarded-For`

---

## ☁️ Production hosts

| Layer | Host |
|-------|------|
| Frontend | `https://www.thewesternstore.in` (Vercel) |
| Backend | `https://the-western-store.onrender.com` (Render, repo `YR-IT/The-Western-Store`, `rootDir: backend/`) |
| Remotes | `origin` (thewesternstore), `western` (adityanaulakha), `yr-it` (YR-IT — Render auto-deploy source) |
