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

## Bug #007 — WhatsApp Checkout Redirection Replaced by Direct Razorpay
**Date:** October 13, 2026  
**Status:** ✅ Fixed

### Symptom
Checkout and cart actions redirected to WhatsApp messages rather than processing actual credit/debit card, UPI, or net banking transactions.

### Root Cause
Initial prototype utilized WhatsApp ordering (`WhatsAppCheckoutModal`) as an interim solution.

### Fix
- Removed WhatsApp checkout triggers from `CartDrawer.tsx` and `CartPage.tsx`, replacing them with direct navigation to `/checkout`.
- Updated `CheckoutPage.tsx` to process payments exclusively via Razorpay modal and verify HMAC signatures via `/api/payments/verify`.
- Cleaned up `OrderConfirmationPage.tsx` to provide live tracking links rather than WhatsApp verification prompts.

---

## Bug #008 — Product Detail Page WhatsApp Inquiry Button Removal
**Date:** October 13, 2026  
**Status:** ✅ Fixed

### Symptom
PDP displayed an "Ask Store Stylist on WhatsApp" button alongside "Buy Now" and "Add to Bag", diverting checkout focus.

### Fix
- Removed `pdp-whatsapp-inquire-btn` button element and unused `handleWhatsAppInquiry` helper from `ProductDetailPage.tsx`.
- Standardized PDP to strictly expose **"Buy Now — Instant Checkout"** and **"Add to Shopping Bag"** action buttons.

---

## Bug #009 — Admin Catalog Mutations Blocked by Supabase RLS
**Date:** October 13, 2026  
**Status:** ✅ Fixed

### Symptom
Product and category additions/edits/deletions performed by the admin were rejected with HTTP 401/403 RLS policy errors because the frontend uses the Supabase `anon` key.

### Root Cause
Admin authentication is handled via Express JWT, which is unknown to Supabase client-side RLS unless service_role privileges are used.

### Fix
- Implemented secure Express endpoints in `backend/src/index.ts`:
  - `POST /api/admin/products`, `PUT /api/admin/products/:id`, `DELETE /api/admin/products/:id`
  - `POST /api/admin/categories`, `PUT /api/admin/categories/:id`, `DELETE /api/admin/categories/:id`
- Protected all catalog endpoints with `requireAdmin` middleware and executed operations via `supabaseAdmin` (`service_role` client).
- Updated `frontend/src/lib/supabaseServices.ts` to proxy requests to backend admin endpoints when `adminToken` is present in `sessionStorage`.

---

## Bug #010 — Wishlist Table Name Schema Mismatch
**Date:** October 13, 2026  
**Status:** ✅ Fixed

### Symptom
Wishlist operations failed to sync with Supabase or threw 404 / relation does not exist errors.

### Root Cause
Database migration defined `public.wishlist_items`, whereas `frontend/src/lib/supabaseServices.ts` attempted to query `public.wishlists`.

### Fix
Updated `supabaseServices.ts` table queries from `from('wishlists')` to `from('wishlist_items')`.

---

## Bug #011 — Guest-to-Customer Cart Overwrite on Login
**Date:** October 13, 2026  
**Status:** ✅ Fixed

### Symptom
Items added to cart by a guest were completely overwritten by user's previous saved cart upon Google login.

### Fix
Updated `loginWithGoogle` in `frontend/src/context/StoreContext.tsx` to non-destructively merge guest cart items with remote saved items, summing quantities for identical composite keys (`productId + size + color`).

---

## Bug #012 — Search Query Not Filtered on PLP
**Date:** October 13, 2026  
**Status:** ✅ Fixed

### Symptom
Entering a query in `SearchModal.tsx` and pressing Enter or clicking "View all results" did not filter products on `/shop`.

### Fix
- Added `?q=` / `?search=` extraction and matching across product title, category, description, fabric, and occasion in `ProductListingPage.tsx`.
- Added active search chip with clear button and dynamic heading: `Search: "${searchQuery}"`.
- Connected `SearchModal.tsx` enter key and "View all results" button to navigate to `/shop?q=${encodeURIComponent(query)}`.

---

## Bug #013 — Inventory Stock Decrement Missing Post-Payment
**Date:** October 13, 2026  
**Status:** ✅ Fixed

### Symptom
Product stock remained static even after successful payments, leading to potential overselling.

### Fix
In `backend/src/index.ts` within `POST /api/payments/verify`:
- Decremented `in_stock_count` in `products` table for each purchased item using service_role client.
- Automatically set `is_sold_out: true` when `in_stock_count` reaches 0 or below.

---

## Bug #014 — Pricing Page Tier Link & Key Mismatch
**Date:** October 13, 2026  
**Status:** ✅ Fixed

### Symptom
Clicking "Shop Tier" on `/pricing` led to unselected budget filters or mismatched products.

### Root Cause
`PricingPage.tsx` used keys `999_1499`, `1499_2499`, `above_2499` and query parameter `?budgetTier=`, whereas PLP expected `under_1499`, `under_2499`, `premium` and query parameter `?budget=`.

### Fix
Updated `PricingPage.tsx` tier keys to valid `BudgetTier` values (`under_999`, `under_1499`, `under_2499`, `premium`) and updated links to `/shop?budget=${t.tierKey}`. Also added fallback support for `?budgetTier=` in PLP.

---

## Bug #015 — Missing Product Link 404 Route
**Date:** October 13, 2026  
**Status:** ✅ Fixed

### Symptom
On PDP, when product was not found, the "Back to collections" button navigated to `/collections` which triggered `NotFoundPage` (404).

### Fix
- Changed fallback button link to `/shop`.
- Added `<Route path="/collections" element={<ProductListingPage />} />` and `<Route path="/collections/:slug" element={<ProductListingPage />} />` in `frontend/src/App.tsx`.

---

## Bug #016 — Prod Admin Login Fail (Stale Render JWT / Env)
**Date:** October 2026  
**Status:** ✅ Fixed

### Symptom
Production `/admin/login` rejected valid credentials or JWT checks failed after deploy.

### Root Cause
Render backend had stale/mismatched `JWT_SECRET` / admin env vs local expectations; free instance spin-down + old deploy.

### Fix
Redeploy Render service from `yr-it` repo; confirm `ADMIN_*` + `JWT_SECRET` on Render match intended values; verify `/api/health`.

---

## Bug #017 — ImageKit Uploads Broken / Wrong Account
**Date:** October 2026  
**Status:** ✅ Fixed

### Symptom
Admin image uploads failed or assets went to the wrong ImageKit account.

### Root Cause
Env pointed at old ImageKit credentials; client-side auth upload path was fragile.

### Fix
- Switched keys to account **89dmpbgrm** (`IMAGEKIT_*` in `backend/.env` + Render)
- Primary path: `POST /api/imagekit/upload` (base64 + private key on server)
- Removed paste-image-URL fields from admin editors

---

## Bug #018 — Safari / macOS “Upload” Greyed Out
**Date:** October 2026  
**Status:** ✅ Fixed

### Symptom
ImageKit file picker Upload button disabled / greyed on Safari (macOS).

### Root Cause
Restrictive `accept="image/*"` and/or programmatic `.click()` on a hidden `<input type="file">`.

### Fix
`ImageKitUploader.tsx`: opacity-0 overlay / label-driven input; **no** image-only `accept`; avoid `.click()` patterns that Safari blocks.

---

## Bug #019 — Admin UX Clutter
**Date:** October 2026  
**Status:** ✅ Fixed

### Changes
- Simplified admin sidebar (Home / Orders / Products / Categories / Homepage / Filters)
- Removed restore-categories / demo seed helpers from admin UI
- Removed storefront navbar share button

---

## ⚠️ Known Potential Issue — `tsx watch` + `.env`

**Pattern:** Any time `backend/.env` is edited, the running server does NOT pick up changes automatically.

**Always do:** `touch backend/src/index.ts` after editing `.env`, then wait ~2 seconds for restart.

**Verify:** `curl http://localhost:4000/api/health` and check the response JSON.

**Prod equivalent:** After changing Render env vars, trigger a redeploy/restart or uploads/login stay broken.
