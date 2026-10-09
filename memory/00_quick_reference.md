# ⚡ Quick Reference Cheatsheet

The single-page reference for the most commonly needed info.

---

## 🚀 Dev Servers

```bash
# Frontend → http://localhost:5173
cd frontend && npm run dev

# Backend → http://localhost:4000
cd backend && npm run dev

# After editing backend/.env — force reload:
touch backend/src/index.ts
```

---

## 🔑 Admin Login

| | Value |
|-|-------|
| URL | `http://localhost:5173/admin/login` |
| Email | `admin@thewesternstore.com` |
| Password | `admin123` |

---

## 🏥 Backend Health Check

```bash
curl http://localhost:4000/api/health
# Good response: { "status": "ok", "jwt": { "configured": true }, "supabase": { "configured": true } }
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `frontend/src/context/StoreContext.tsx` | ALL global state |
| `frontend/src/types.ts` | ALL TypeScript types |
| `frontend/src/data/mockData.ts` | STORE_INFO + initial data |
| `frontend/src/App.tsx` | Routes + layout |
| `frontend/src/components/HeroCarousel.tsx` | Hero banner |
| `frontend/src/components/AdminPanel.tsx` | CMS (huge, ~2357 lines) |
| `backend/src/index.ts` | Entire backend (~1062 lines) |
| `backend/.env` | All secrets |

---

## 🌐 Third-Party Services

| Service | Dashboard URL |
|---------|--------------|
| Supabase | https://supabase.com/dashboard |
| ImageKit | https://imagekit.io/dashboard |
| Razorpay | https://dashboard.razorpay.com |

---

## 🎨 Brand Colors

| Name | Hex |
|------|-----|
| Primary Red | `#721B29` |
| Dark Red | `#52131D` |
| Gold Accent | `#E6C280` |
| Dark Background | `#1C1717` |
| Page Background | `#FDFBF7` |
| Text Dark | `#242120` |
| Text Light | `#736B63` |

---

## 📞 Store Contact

| | |
|-|-|
| Phone / WhatsApp | +91 97295 15288 |
| Email | thewesternstorekkr@gmail.com |
| Instagram | @the_western_store_kkr |
| Address | Opp. Hotel Pearl Marc, Railway Road, Kurukshetra — 136118 |
