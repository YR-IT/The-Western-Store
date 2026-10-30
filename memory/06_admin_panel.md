# 06 — Admin Panel

## Overview

`AdminPanel.tsx` is the CMS for managing the store. Lazy-loaded at `/admin/*`, protected by `AdminRoute` (JWT) and an internal `isAdmin` guard.

**Local:** `http://localhost:5173/admin/login`  
**Prod:** `https://www.thewesternstore.in/admin/login`

---

## 🗂️ Admin Panel Tabs (simplified)

Primary sidebar (store-owner focused):

| Tab | Purpose |
|-----|---------|
| **Home** | Overview stats — orders, revenue, product count |
| **Orders** | View orders, update status, tracking, delete |
| **Products** | Add / edit / delete products; images via ImageKit |
| **Categories** | Add / edit / delete / reorder categories |
| **Homepage** | Hero banners, home sections, budget tiles, trust, Instagram, testimonials (grouped) |
| **Filters** | PLP filters (fabrics, occasions, sizes, colors) |

Settings / store info remain reachable from Homepage or Settings flows as implemented in the panel.

**Removed / simplified (Oct 2026):**
- No “restore categories” / demo-seed helpers in the admin UI
- No paste-image-URL fields — upload + media library only
- Storefront header share button removed (not admin-specific)

---

## 🧭 Admin Navigation

- **Storefront** → `navigate('/')` (top-left of admin bar)
- **Logout** → clears token → redirects
- Own dark top bar (`#1C1717`); public Header/Footer hidden on `/admin/*`

---

## 📦 Order Management

### Order Status Flow
```
Paid (Online via Razorpay) → Confirmed → Shipped → Delivered
                                             ↓
                                         Cancelled (at any stage)
```

### Tracking Fields (when status = Shipped)
- Courier Name, Tracking Number, Tracking Link, Shipped Date, Estimated Delivery, Tracking Notes

### Orders API
- `GET /api/admin/orders` — JWT
- `PUT /api/admin/orders/:id` — status + tracking + history
- `PUT /api/admin/orders/:id/status`
- `PUT /api/admin/orders/:id/tracking`
- `DELETE /api/admin/orders/:id`

### Catalog (Products & Categories)
Mutations go through Express (`POST/PUT/DELETE /api/admin/products|categories`) with `requireAdmin` + Supabase **service_role** (bypasses anon RLS).

### Admin Order Polling
StoreContext polls `/api/admin/orders` every **25 seconds** when admin is logged in.

---

## 🖼️ Image Upload Flow (ImageKit) — current

1. Admin picks a file in `ImageKitUploader` (product / hero / homepage editors)
2. Frontend reads file → base64 → `POST /api/imagekit/upload` with `Authorization: Bearer <admin JWT>`
3. Backend uses ImageKit Node SDK + `IMAGEKIT_PRIVATE_KEY` → uploads → returns CDN `url`
4. URL is stored on the entity in Supabase

**Also available (admin JWT):**
- `GET /api/imagekit/auth` — legacy client-side signature params
- `GET /api/imagekit/files` — media library list
- `DELETE /api/imagekit/files/:fileId` — delete asset

**Account:** `https://ik.imagekit.io/89dmpbgrm` (keys in `backend/.env` + Render env)

**Safari / macOS:** Do **not** use restrictive `accept="image/*"` or programmatic `.click()` on a hidden input — Upload becomes greyed out. Use a visible label / opacity-0 overlay input without image-only accept.

**UI rule:** No “paste image URL” fields anywhere in admin.

---

## ⚠️ Admin Panel Guard — Two-Layer Check

```
Route: /admin/*
  └── AdminRoute.tsx         → sessionStorage.tws_admin_token / adminToken
        └── AdminPanel.tsx   → currentUser?.isAdmin === true
```

Both must pass or login / “Admin Access Required” is shown.
