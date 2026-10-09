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

### Verify Everything Works
```bash
curl http://localhost:4000/api/health
# Expected: { "status": "ok", "jwt": { "configured": true }, "supabase": { "configured": true } }
```

---

## ⚠️ Backend `.env` Gotcha

`tsx watch` does NOT watch `.env` files. After editing `.env`:
```bash
touch backend/src/index.ts
# Wait ~2 seconds for restart
curl http://localhost:4000/api/health  # verify
```

---

## 🌐 Planned Deployment Targets

| Service | Component | Notes |
|---------|-----------|-------|
| **Render** (or Railway) | Backend | `render.yaml` already exists in `/backend` |
| **Vercel** (or Netlify) | Frontend | Vite SPA build |
| **Supabase** | Database + Auth | Already live |
| **ImageKit.io** | Image CDN | Already live |
| **Razorpay** | Payments | Pending KYC |

---

## 🚀 Production Checklist

### Backend
- [ ] Set strong `JWT_SECRET` (random 64-char string)
- [ ] Set strong `ADMIN_PASSWORD`
- [ ] Set `FRONTEND_URL` to actual production domain
- [ ] Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (after KYC)
- [ ] Remove or restrict `http://localhost:*` from CORS allowlist

### Frontend
- [ ] Set `VITE_BACKEND_URL` to production backend URL
- [ ] Verify Google OAuth redirect URL is updated in Supabase dashboard
- [ ] Add production URL to Supabase Auth allowed redirects

### Supabase
- [ ] Review and tighten RLS policies for production
- [ ] Enable email confirmation if needed
- [ ] Set up database backups

### General
- [ ] Add custom domain (DNS configuration)
- [ ] Set up SSL (auto on Render/Vercel)
- [ ] Submit store to Google Search Console
- [ ] Test full order flow end-to-end on production

---

## 📄 `render.yaml` (Backend)

A `render.yaml` file exists in `/backend` for one-click Render.com deployment. It defines:
- Build command: `npm run build`
- Start command: `node dist/index.js`
- Environment group for secrets

---

## 🏗️ Frontend Build

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

For Vercel deployment:
- Root: `frontend/`
- Build command: `npm run build`
- Output dir: `dist`
- Environment variable: `VITE_BACKEND_URL=https://your-backend.onrender.com`
