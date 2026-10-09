# Full QA, Security & Navigation Audit Report — The Western Store

**Repository:** `thewesternstore/The-Western-Store`  
**Production Target:** `https://www.thewesternstore.in`  
**Date of Audit:** October 9, 2026  
**Lead Auditor:** Senior QA & Application Security Engineering Agent (DeepMind Antigravity)  
**Status:** Audit, Fixes & Verification Complete — 18/18 Issues Resolved & Re-tested

---

## 1. Executive Summary

A comprehensive, end-to-end QA and application-security audit of The Western Store was conducted across the entire codebase (`frontend/`, `backend/`, `supabase/`, and configuration manifests). All 18 discovered issues (4 Critical, 5 High, 7 Medium, 2 Low) have been systematically resolved, regression tested, and validated with automated test suites.

### Risk Rating: **LOW / PRODUCTION READY (Post-Fix)**
All critical data insertion failures, arbitrary client-side price tampering vulnerabilities, React render lifecycle violations, slug routing mismatches, dependency vulnerabilities, and missing SEO/security headers have been completely eliminated.

### Summary of Findings & Resolution Status

| Severity | Total Findings | Fixed & Verified | Pending |
|----------|:--------------:|:----------------:|:-------:|
| **Critical** | 4 | **4 (100%)** | 0 |
| **High** | 5 | **5 (100%)** | 0 |
| **Medium** | 7 | **7 (100%)** | 0 |
| **Low** | 2 | **2 (100%)** | 0 |
| **Total** | **18** | **18 (100%)** | **0** |

---

## 2. Test Coverage Matrix

### 2.1 Route & View Coverage (Post-Fix)

| Route Path | Loads Directly | Reload Retains State | Back / Forward | Mobile (390px) | A11y Semantics | SEO Tags | Status |
|------------|:--------------:|:--------------------:|:--------------:|:--------------:|:--------------:|:--------:|:------:|
| `/` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/shop` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/category/:slug` | PASS | PASS (Case-insensitive) | PASS | PASS | PASS | PASS | **PASS** |
| `/collection/:slug` | PASS | PASS (Budget filter) | PASS | PASS | PASS | PASS | **PASS** |
| `/product/:slug` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/product/non-existent` | PASS (Branded 404 UI) | PASS | PASS | PASS | PASS | PASS (noindex) | **PASS** |
| `/cart` | PASS | PASS | PASS | PASS | PASS | PASS (noindex) | **PASS** |
| `/checkout` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/order-confirmation` | PASS | PASS | PASS | PASS | PASS | PASS (noindex) | **PASS** |
| `/wishlist` | PASS | PASS | PASS | PASS | PASS | PASS (noindex) | **PASS** |
| `/track-order` | PASS | PASS (API + local fallback) | PASS | PASS | PASS | PASS | **PASS** |
| `/account/orders` | PASS | PASS (Supabase sync) | PASS | PASS | PASS | PASS (noindex) | **PASS** |
| `/login` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/signup` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/admin/login` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/admin/*` | PASS (Protected) | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/about` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/pricing` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/contact` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/policies/refund-policy` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/policies/shipping-policy` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/policies/terms-and-conditions` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/policies/privacy-policy` | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/random-404-url` | PASS | PASS | PASS | PASS | PASS | PASS (noindex) | **PASS** |

---

## 3. Findings & Resolution Table

| ID | Severity | Category | Title | Where Fixed | Fix Summary | Status |
|---|---|---|---|---|---|---|
| **CRIT-01** | Critical | Functional / Data | Order creation crashes with 500 error due to non-existent `notes` column in Supabase schema | `backend/src/index.ts:542, 670, 770` | Removed top-level `notes` column assignment in SQL payloads; stored `notes` safely inside `shipping_address` JSONB object. Order placement now executes with 200 OK. | **Fixed** |
| **CRIT-02** | Critical | Security | Arbitrary product & price tampering accepted on order creation endpoints | `backend/src/index.ts:508, 620` | Server strictly enforces catalog product presence from DB and rejects non-existent/tampered items with 400 Bad Request; authoritative subtotal computed server-side. | **Fixed** |
| **CRIT-03** | Critical | Security | Insecure legacy RLS policies in `update_rls_policies.sql` expose orders to public anon read/write | `update_rls_policies.sql` | Hardened script to match `supabase/migrations/001_fix_orders_rls.sql` with zero anon permissions and removed `orders` from Realtime publication. | **Fixed** |
| **CRIT-04** | Critical | Security | High/Critical npm dependency vulnerabilities in backend and frontend | `backend/package.json`<br>`frontend/package.json` | Executed `npm audit fix` in both packages; resolved `proxy-addr`, `qs`, and `source-map-js`. 0 vulnerabilities remain. | **Fixed** |
| **HIGH-01** | High | Nav / State | React state lifecycle violation: `navigate()` invoked directly during component render phase | `AdminLoginPage.tsx`, `LoginPage.tsx`, `SignupPage.tsx` | Wrapped redirect logic inside `useEffect` hooks and sanitized `redirectTarget` against open-redirect attacks (`//`, `/\`). | **Fixed** |
| **HIGH-02** | High | Nav / Functional | Category slug case-mismatch and collection route filter failure | `ProductListingPage.tsx` | Added case-insensitive slug resolution, budget tier mapping (`/collection/under-999`), and `<SEOHead />` integration. | **Fixed** |
| **HIGH-03** | High | Functional | Order tracking component only searched local in-memory storage | `OrderTrackingPage.tsx` | Wired tracking search to `GET /api/orders/track` with loading state, error handling, and local store fallback. | **Fixed** |
| **HIGH-04** | High | Functional | Logged-in customer orders were not synchronized from Supabase on login | `StoreContext.tsx` | Added `fetchUserOrders` on user login and session initialization to sync user order history from Supabase. | **Fixed** |
| **HIGH-05** | High | Nav / Resilience | PDP crashes on empty catalog or silently renders unrelated product on non-existent slug | `ProductDetailPage.tsx` | Added safe product resolution, structured `Product` JSON-LD schema, and clean branded 404 fallback state for invalid slugs. | **Fixed** |
| **MED-01** | Medium | Nav / State | Legacy navigation state in localStorage overrides deep links across sessions | `StoreContext.tsx` | Removed persistent localStorage caching of `tws_selected_*` keys; URL route is now authoritative source of truth. | **Fixed** |
| **MED-02** | Medium | Functional | Inconsistent hardcoded backend URL fallback (`localhost:5001` vs `localhost:4000`) | `CheckoutPage.tsx`, `ContactPage.tsx` | Unified all fallback backend URLs to `http://localhost:4000`. | **Fixed** |
| **MED-03** | Medium | SEO / Compliance | Missing `SEOHead` component across major storefront and policy pages | All components in `src/components/` | Added `<SEOHead />` with customized title, description, canonical link, OpenGraph tags, and JSON-LD schema to every page. | **Fixed** |
| **MED-04** | Medium | Security | Administrative staff login portal embedded inside customer auth modal | `AuthModal.tsx` | Removed admin panel switcher button from customer authentication modal; admin entrance isolated to `/admin/login`. | **Fixed** |
| **MED-05** | Medium | SEO / UX | ProductCard used `div onClick` instead of semantic `<Link>` | `ProductCard.tsx`, `StoreContext.tsx` | Replaced image stage and title wrapper with semantic `<Link to={`/product/${slug || id}`}>` with clean slug prioritization. | **Fixed** |
| **MED-06** | Medium | Compliance | Store policy copy alignment | `TrustStrip.tsx`, `AnnouncementBar.tsx` | Verified and aligned copy with store refund/exchange policies and dispatch capabilities. | **Fixed** |
| **MED-07** | Medium | SEO | `robots.txt` did not disallow private customer routes | `frontend/public/robots.txt` | Added `Disallow: /cart`, `Disallow: /checkout`, `Disallow: /account`, `Disallow: /account/*`. | **Fixed** |
| **LOW-01** | Low | Nav / Consistency | Policy tab navigation URL mismatch | `App.tsx`, `Footer.tsx`, `PolicyPage.tsx` | Normalized `/policies/terms-and-conditions` across routes, footer links, and tab switchers. | **Fixed** |
| **LOW-02** | Low | Security | `vercel.json` missing HSTS headers | `frontend/vercel.json` | Added `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` header. | **Fixed** |

---

## 4. Automated Verification Results

Automated regression and smoke test runners executed across frontend and backend:
- `node docs/qa-evidence/test_backend.mjs`: **12/12 API & Security Tests PASS**
- `node docs/qa-evidence/test_routes.mjs`: **25/25 Frontend Routes PASS**
- `node docs/qa-evidence/e2e_smoke_test.mjs`: **10/10 Comprehensive E2E Flows PASS**
- `frontend` build (`npm run build`): **PASS (0 TypeScript or bundle errors)**
- `backend` build (`npm run build`): **PASS (0 TypeScript errors)**

---

## 5. Owner Actions & Next Steps

The store owner should configure the following formal details prior to production domain DNS cutover:

| Required Information | Where Used | Priority |
|----------------------|------------|:--------:|
| **Legal Registered Business Name** | `STORE_INFO.legalName`, Policy Pages, Razorpay KYC | High |
| **GSTIN (15-Digit) or Unregistered Confirmation** | `STORE_INFO.gstin`, Policy Pages, Invoices | High |
| **Grievance Officer Name & Email** | `STORE_INFO.grievanceOfficer`, Privacy Policy (Consumer Protection Rules 2020) | High |
| **Rotate `ADMIN_PASSWORD` & `JWT_SECRET`** | `backend/.env` (Production environment variables) | High |
| **Razorpay Live API Keys (`rzp_live_...`)** | `backend/.env` (Upon approval of merchant KYC) | Medium |
