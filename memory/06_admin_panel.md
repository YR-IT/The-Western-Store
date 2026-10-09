# 06 — Admin Panel

## Overview

`AdminPanel.tsx` is the full CMS for managing the store. It's lazy-loaded at `/admin/*` and protected by both `AdminRoute` (JWT check) and an internal `isAdmin` guard.

**Access URL:** `http://localhost:5173/admin/login`

---

## 🗂️ Admin Panel Tabs

| Tab | Purpose |
|-----|---------|
| **Dashboard** | Overview stats — total orders, revenue, product count |
| **Orders** | View all orders, update status, add tracking info, delete |
| **Products** | Add / edit / delete products, manage images via ImageKit |
| **Categories** | Add / edit / delete / reorder categories |
| **Hero Banners** | Manage hero carousel slides (desktop + mobile images) |
| **Home Sections** | Reorder/enable/disable homepage sections |
| **Testimonials** | Manage customer testimonials |
| **Instagram** | Manage Instagram feed posts |
| **Budget Tiles** | Edit Shop By Budget section tiles |
| **Trust Strip** | Edit trust feature icons & text |
| **Filters** | Manage PLP filters (fabrics, occasions, sizes, colors) |
| **Settings** | Store info, announcement bar, store hours |

---

## 🧭 Admin Navigation

- **Back to Storefront** button → `navigate('/')` (top-left of admin bar)
- **Logout** button → calls `logout()` → clears token → redirects to `/`
- Admin panel has its **own top bar** (dark `#1C1717` background)
- Public `Header` and `Footer` are **hidden** on all `/admin/*` routes (checked via `location.pathname.startsWith('/admin')` in `App.tsx`)

---

## 📦 Order Management

### Order Status Flow
```
Pending WhatsApp → Contacted → Confirmed → Paid → Shipped → Delivered
                                                           ↓
                                                       Cancelled (at any stage)
```

### Tracking Fields (filled when status = Shipped)
- Courier Name
- Tracking Number
- Tracking Link (auto-generated for Delhivery if only tracking number provided)
- Shipped Date
- Estimated Delivery
- Tracking Notes

### Orders API
- `GET /api/admin/orders` — fetches from Supabase with JWT auth
- `PUT /api/admin/orders/:id/status` — updates status field
- `PUT /api/admin/orders/:id/tracking` — updates tracking fields
- `DELETE /api/admin/orders/:id` — hard deletes the order

### Admin Order Polling
StoreContext polls `/api/admin/orders` every **25 seconds** when admin is logged in.

---

## 🖼️ Image Upload Flow (ImageKit)

1. Admin selects image in product/hero editor
2. Frontend calls `/api/imagekit/auth` on backend
3. Backend generates signed upload token using `IMAGEKIT_PRIVATE_KEY`
4. Frontend uploads directly to ImageKit using the signed token
5. ImageKit returns the `url` of the uploaded file
6. URL is stored in Supabase

---

## ⚠️ Admin Panel Guard — Two-Layer Check

```
Route: /admin/*
  └── AdminRoute.tsx         → checks: sessionStorage.tws_admin_token exists
        └── AdminPanel.tsx   → checks: currentUser?.isAdmin === true
              └── (shows panel)
```

If **either** fails:
- `AdminRoute` fails → redirects to `/admin/login`
- `AdminPanel` fails → shows "Admin Access Required" message inline

**Both must be satisfied** for the panel to render.
