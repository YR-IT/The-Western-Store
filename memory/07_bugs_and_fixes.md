# 07 — Bugs & Fixes Log

Chronological record of all bugs encountered and fixed during development.

---

## Bug #001 — HeroCarousel Mobile Image Cropping
**Date:** October 9, 2026  
**Status:** ✅ Fixed

### Symptom
Mobile hero banner was zoomed in / cropped. Portrait images were not fully visible. Desktop was fine.

### Root Cause
The `<section>` wrapper used `h-[min(calc(100svh-98px),740px)] min-h-[420px]` — a fixed pixel height derived from viewport height. This forced `object-cover` to crop tall portrait images to fit the constrained height.

### Fix
**File:** `frontend/src/components/HeroCarousel.tsx` line 144

```diff
- className="... h-[min(calc(100svh-98px),740px)] min-h-[420px] md:h-auto md:min-h-0 md:aspect-[16/9]"
+ className="... aspect-[9/16] md:aspect-[16/9]"
```

Changed mobile to use `aspect-[9/16]` (natural portrait ratio) — the container now expands to fit the image proportionally instead of clipping it.

---

## Bug #002 — Admin Login 429 Too Many Requests
**Date:** October 9, 2026  
**Status:** ✅ Fixed

### Symptom
`POST /api/admin/login` returned `429 Too Many Requests` after a few failed login attempts.

### Root Cause
`loginLimiter` had `max: 5` — only 5 attempts per 15 minutes per IP. During dev/testing this was hit quickly.

### Fix
**File:** `backend/src/index.ts` line 41

```diff
- max: 5,
+ max: 20,
```

---

## Bug #003 — Admin Login 500 Internal Server Error (Missing JWT_SECRET)
**Date:** October 9, 2026  
**Status:** ✅ Fixed

### Symptom
`POST /api/admin/login` returned `500` with body:  
`{ error: 'Server configuration error: ADMIN credentials or JWT_SECRET is not configured.' }`

### Root Cause
`JWT_SECRET` was never added to `backend/.env`. The login route validates all three env vars before proceeding.

### Fix
**File:** `backend/.env`
```
JWT_SECRET=tws_jwt_super_secret_2026_western_store_secure_key
```

### Secondary Issue
After adding the env var, `tsx watch` did NOT auto-restart because it only watches `.ts` files, not `.env`.

**Fix:** Run `touch src/index.ts` to force restart. Verify with:
```bash
curl http://localhost:4000/api/health
# Should show: "jwt": { "configured": true }
```

---

## Bug #004 — Admin Login Succeeds but Shows "Admin Access Required"
**Date:** October 9, 2026  
**Status:** ✅ Fixed

### Symptom
After successful login (backend returns `{ success: true, token, user }`), navigating to `/admin` showed "Admin Access Required" instead of the management console. Also the "Admin Panel" button was missing from the Header dropdown.

### Root Cause
Two-part mismatch:

1. Backend returns `user.role = 'admin'` (string)
2. Every frontend check uses `currentUser.isAdmin` (boolean)
3. `loginAsAdmin()` was storing the raw user object without mapping `role → isAdmin`
4. So `currentUser.isAdmin` was always `undefined` → falsy → both AdminPanel guard and Header dropdown button were hidden

### Fix
**File:** `frontend/src/context/StoreContext.tsx` in `loginAsAdmin()`

```diff
- setCurrentUser(data.user);
+ setCurrentUser({
+   ...data.user,
+   isAdmin: data.user.role === 'admin',
+ });
```

### Affected UI Elements That Check `isAdmin`
- `AdminPanel.tsx` line 564 — `if (!currentUser?.isAdmin)` — main guard
- `Header.tsx` line 343 — `{currentUser?.isAdmin && ...}` — desktop "Admin Panel" menu item
- `Header.tsx` line 612 — `{currentUser?.isAdmin && ...}` — mobile drawer "Admin Panel" item

---

## Bug #005 — Navigation Refactor: `setView()` Remnants
**Date:** October 9, 2026  
**Status:** ✅ Fixed

### Symptom
After routing was refactored from single-page `view` state to React Router, many components still called `setView('plp')`, `setView('admin')`, etc. which no longer worked.

### Fix
Replaced all `setView()` calls with `useNavigate()` + `navigate('/path')` across:
- `CartDrawer.tsx` — `setView('plp')` → `navigate('/shop')`
- `Header.tsx` — all nav links, dropdown items, mobile drawer
- `ProductSection.tsx` — view all / category links
- `AuthModal.tsx` — `setView('admin')` → `navigate('/admin')`
- `AdminPanel.tsx` — `setView('home')` → `navigate('/')`
- `PolicyPage.tsx` — internal nav links

---

## Bug #006 — Homepage Reviews/Testimonials Section Missing
**Date:** October 9, 2026  
**Status:** ✅ Fixed

### Symptom
Customer reviews/testimonials section was not rendering on the homepage.

### Root Cause
1. `INITIAL_HOME_SECTIONS` in `frontend/src/data/mockData.ts` was missing the `sec-testimonials` config object. Since `HomePage.tsx` dynamically renders `homeSections`, the section was completely omitted.
2. In `Testimonials.tsx`, if `testimonials` state in `StoreContext` was empty `[]`, it did not fallback to `INITIAL_TESTIMONIALS`.

### Fix
1. **File:** `frontend/src/data/mockData.ts` — added `sec-testimonials` to `INITIAL_HOME_SECTIONS`.
2. **File:** `frontend/src/context/StoreContext.tsx` — updated `homeSections` state initialization and Supabase fetch logic to automatically inject `sec-testimonials` if missing.
3. **File:** `frontend/src/components/Testimonials.tsx` — added fallback to `INITIAL_TESTIMONIALS` when `testimonials` array is empty.

---

## ⚠️ Known Potential Issue — `tsx watch` + `.env`

**Pattern:** Any time `backend/.env` is edited, the running server does NOT pick up changes automatically.

**Always do:** `touch backend/src/index.ts` after editing `.env`, then wait ~2 seconds for restart.

**Verify:** `curl http://localhost:4000/api/health` and check the response JSON.
