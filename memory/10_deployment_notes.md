# 10 — Deployment Notes

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Start Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:4000
```

### Verify
```bash
curl http://localhost:4000/api/health
# Expected: status ok + jwt/supabase/imagekit configured flags
```

---

## ⚠️ Backend `.env` Gotcha

`tsx watch` does NOT watch `.env`. After editing:
```bash
touch backend/src/index.ts
curl http://localhost:4000/api/health
```

On **Render**, env changes need a redeploy / restart — stale JWT or ImageKit keys = admin login or upload failures.

---

## 🌐 Live Deployment (Oct 2026)

| Layer | Platform | URL / notes |
|-------|----------|-------------|
| **Frontend** | Vercel | `https://www.thewesternstore.in` (+ apex) |
| **Backend** | Render | `https://the-western-store.onrender.com` |
| **Repo for Render** | GitHub `YR-IT/The-Western-Store` | Remote `yr-it`; `rootDir: backend/` |
| **Other remotes** | `origin` (thewesternstore), `western` (adityanaulakha) | Push all when shipping |
| **Supabase** | Hosted | `ghdrlqzcdmysnpmlkeju` |
| **ImageKit** | CDN | `https://ik.imagekit.io/89dmpbgrm` |
| **Razorpay** | Pending keys/KYC | Sandbox notification mode if unset |

### Render must have
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET` (must match what admins use)
- `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_URL_ENDPOINT` (account **89dmpbgrm**)
- `SUPABASE_URL`, `SUPABASE_KEY`
- `FRONTEND_URL` preferably `https://www.thewesternstore.in`
- Optional: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

### Vercel must have
- `VITE_BACKEND_URL=https://the-western-store.onrender.com`
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`

CORS allowlists production domains + `*.vercel.app`. Backend uses `trust proxy` for Render.

Free Render web services spin down after ~15 min idle — first request after sleep can be slow.

---

## 🚀 Hardening checklist (still open)

### Backend
- [ ] Stronger `JWT_SECRET` + `ADMIN_PASSWORD` before hard launch
- [ ] Live Razorpay keys after KYC
- [ ] Tighten localhost CORS if desired

### Frontend / Supabase
- [ ] Confirm Google OAuth redirect URLs include production domain
- [ ] Review RLS for guest orders
- [ ] Catalog content (products/heroes) populated in prod DB

### General
- [x] Custom domain + SSL (Vercel)
- [ ] Full paid-order E2E on production after Razorpay live
- [ ] Google Search Console

---

## 📄 `render.yaml`

Exists under `/backend` for Blueprint-style deploys (build `npm run build`, start `node dist/index.js`). Live service may already be wired via dashboard to `yr-it` repo.

---

## 🏗️ Frontend Build

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

Vercel: root `frontend/`, build `npm run build`, output `dist`, env `VITE_BACKEND_URL=https://the-western-store.onrender.com`.
