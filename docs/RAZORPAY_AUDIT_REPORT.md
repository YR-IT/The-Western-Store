# Razorpay-Readiness, Routing & Security Audit Report
**The Western Store** — Kurukshetra Flagship Boutique (`https://www.thewesternstore.in`)  
**Audit Date:** October 2026  
**Status:** Ready for Razorpay Merchant Verification & Live Activation

---

## 1. Executive Summary

This upgrade modernizes **The Western Store** storefront and backend infrastructure from a monolithic state-driven view system into a high-performance, compliant, and Razorpay-ready online boutique.

### Key Achievements
| Domain | Previous State | Upgraded State |
| :--- | :--- | :--- |
| **Routing** | Legacy `setView`/`tws_view` localStorage state | **Declarative React Router DOM** with clean URLs (`/shop`, `/product/:slug`, `/policies/*`, etc.) |
| **Direct URLs & Deep Linking** | Page reloads defaulted to home | **Direct URL deep links, browser history, back/forward buttons, SPA 404 rewrite handling** |
| **Backend Authentication** | Unauthenticated admin endpoints | **Hardened JWT Bearer token authentication** + timing-safe comparison + rate limiting |
| **Database Security (RLS)** | Anon client had read/write order permissions | **Revoked anon write/read on `orders`**; orders access restricted to backend service role |
| **Payment Gateway** | WhatsApp inquiry only | **Razorpay Checkout SDK (`checkout.js`) with HMAC SHA-256 signature verification** + WhatsApp assisted order fallback |
| **Isolated "Buy Now"** | Not available | **1-click Buy Now flow** that does not mutate or clear the user's shopping bag |
| **Statutory Compliance** | Missing mandatory legal disclosures | **E-Commerce Rules 2020 complaint**: explicit Final Sale policy, Grievance contact, statutory entity fields |

---

## 2. Security & Backend Architecture

### 2.1 Authentication & Authorization
- **Admin Authentication (`backend/src/middleware/auth.ts`)**:
  - Requires standard `Authorization: Bearer <JWT>` header.
  - Signed using high-entropy `JWT_SECRET` (24h expiry).
  - Admin login endpoint protected with rate limiter (5 attempts / 15 min) and timing-safe string comparison.
- **Customer Authentication (`requireUser`)**:
  - Verified against Supabase customer JWT session. Customers can only fetch their own associated order history.

### 2.2 Database RLS Hardening (`supabase/migrations/`)
- `001_fix_orders_rls.sql`: Revoked anonymous insert/select on `public.orders`. Orders can only be queried by authenticated users matching their `user_id` or by the backend service role.
- `002_backfill_slugs.sql`: Created slug column on `products` with auto-generation trigger and unique index.
- `003_payments_and_contact.sql`: Added Razorpay tracking columns (`payment_gateway`, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`) and created `contact_messages` table.

### 2.3 Express Server Hardening
- **Helmet (`helmet`)**: Configured with cross-origin resource policy.
- **CORS Allowlist**: Restricted to production domain (`thewesternstore.in`, `www.thewesternstore.in`), Vercel preview environments, and local development ports.
- **Rate Limiters**:
  - `loginLimiter`: 5 requests / 15 min
  - `trackLimiter`: 15 requests / 1 min
  - `orderCreateLimiter`: 15 requests / 15 min
  - `contactLimiter`: 5 requests / 15 min

---

## 3. Direct URLs & Sitemap Inventory

Every storefront destination is now directly linkable, bookmarkable, and crawlable:

| Route Pattern | Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Boutique hero, curated collections, budget tiers, store showcase |
| `/shop` | `ProductListingPage` | Full product catalog with filter sidebars & sorting |
| `/category/:slug` | `ProductListingPage` | Category-filtered listings (e.g. `/category/Ready to Wear Sarees`) |
| `/collection/:slug` | `ProductListingPage` | Collection-filtered listings |
| `/product/:slug` | `ProductDetailPage` | Product details, size guide, gallery, isolated Buy Now |
| `/cart` | `CartPage` | Full shopping bag with quantity adjustments |
| `/checkout` | `CheckoutPage` | Dual Razorpay / WhatsApp checkout |
| `/order-confirmation/:orderId` | `OrderConfirmationPage` | Verified receipt with live tracking link |
| `/track-order` | `OrderTrackingPage` | Real-time order dispatch lookup |
| `/wishlist` | `WishlistPage` | Customer saved boutique favorites |
| `/account/orders` | `OrderHistoryPage` | Customer order history (protected) |
| `/login`, `/signup` | `LoginPage`, `SignupPage` | Customer auth |
| `/admin/login` | `AdminLoginPage` | Staff portal entrance |
| `/admin/*` | `AdminPanel` | Catalog, orders, tracking updates, ImageKit library |
| `/about`, `/pricing` | `AboutUsPage`, `PricingPage` | Boutique brand story & transparent pricing tier guide |
| `/contact` | `ContactPage` | WhatsApp concierge & statutory grievance contact |
| `/policies/refund-policy` | `PolicyPage (returns)` | Final Sale / No Exchange policy & defect claims guidelines |
| `/policies/shipping-policy` | `PolicyPage (shipping)` | 24-48h dispatch, courier tracking info |
| `/policies/terms` | `PolicyPage (terms)` | Store terms & conditions |
| `/policies/privacy-policy` | `PolicyPage (privacy)` | Privacy and data protection notice |

### SEO & Indexing Infrastructure
- **Sitemap Generator**: `frontend/scripts/generate-sitemap.ts` generates `frontend/public/sitemap.xml` automatically during every build.
- **Robots.txt**: `frontend/public/robots.txt` disallows `/admin/` and `/account/` while indexing public catalog pages.
- **SPA Rewrites**: `frontend/vercel.json` configured with rewrites to `index.html` to eliminate 404s on direct navigation.

---

## 4. Payment Gateway & Checkout Flow

### 4.1 Razorpay Endpoints
1. `POST /api/payments/create-order`
   - Validates cart / Buy Now items against the database product catalog.
   - Recalculates total server-side to prevent client price tampering.
   - Creates a Razorpay order in INR paise.
   - Inserts order into Supabase with status `Pending Payment` and `awaiting_payment`.
2. `POST /api/payments/verify`
   - Validates HMAC SHA-256 signature using `process.env.RAZORPAY_KEY_SECRET`.
   - Uses timing-safe string comparison.
   - Updates order to `Paid` / `paid` with timestamp and Razorpay payment ID.
3. `POST /api/payments/webhook`
   - Validates webhook signature (`x-razorpay-signature`).
   - Idempotently handles `payment.captured`, `order.paid`, `payment.failed`, and `refund.processed`.
4. `POST /api/payments/refund`
   - Admin-authenticated refund trigger directly calling Razorpay API.

### 4.2 Frontend Checkout UX
- **Dedicated Checkout Page (`/checkout`)**:
  - Full shipping address form (Name, Phone, Address, City, State, PIN Code, Customization Note).
  - Clear toggle between **Pay Online via Razorpay** and **Checkout via WhatsApp**.
  - Dynamic on-demand loading of `checkout.js`.
  - Graceful sandbox mode / fallback error messaging if keys are not yet configured.
- **Isolated "Buy Now"**:
  - Available on `ProductDetailPage` and `QuickViewModal`.
  - Routes directly to `/checkout` with single-item payload in router state.
  - Does **not** wipe or mutate the customer's existing shopping cart.
- **WhatsApp Fallback**:
  - Available as an assisted order option at checkout, in cart drawer, and on product detail pages.

---

## 5. Owner Action Checklist (Required Before Live Payments)

To activate live Razorpay payments and complete statutory merchant verification, the store owner must provide/configure the following:

| Item | Location | Action Required |
| :--- | :--- | :--- |
| **GSTIN Number** | `frontend/src/data/mockData.ts` (`STORE_INFO.gstin`) | Fill in the store's 15-digit GSTIN number |
| **Legal Entity Name** | `frontend/src/data/mockData.ts` (`STORE_INFO.legalName`) | Fill in official registered business name (e.g., Sole Proprietorship / Partnership / Pvt Ltd) |
| **Grievance Officer Name** | `frontend/src/data/mockData.ts` (`STORE_INFO.grievanceOfficer`) | Specify designated Grievance Officer name & contact |
| **Razorpay Key ID** | `backend/.env` & `frontend/.env` (`RAZORPAY_KEY_ID`, `VITE_RAZORPAY_KEY_ID`) | Add live Key ID from Razorpay Dashboard (`rzp_live_...`) |
| **Razorpay Key Secret** | `backend/.env` (`RAZORPAY_KEY_SECRET`) | Add live Secret from Razorpay Dashboard |
| **Razorpay Webhook Secret** | `backend/.env` (`RAZORPAY_WEBHOOK_SECRET`) | Configure webhook URL in Razorpay Dashboard (`https://<backend-url>/api/payments/webhook`) and save secret |
| **Supabase Migrations** | Supabase SQL Editor | Execute `supabase/migrations/001_fix_orders_rls.sql`, `002_backfill_slugs.sql`, and `003_payments_and_contact.sql` |

---

## 6. Verification & Build Status

- **Frontend Build (`npm run build`)**: ✅ Passed (Vite production bundle generated, sitemap created, 0 TypeScript errors)
- **Frontend Lint (`npm run lint`)**: ✅ Passed (`tsc --noEmit` clean)
- **Backend Build (`npm run build`)**: ✅ Passed (`tsc` clean)
- **Backend Lint (`npm run lint`)**: ✅ Passed (`tsc --noEmit` clean)
