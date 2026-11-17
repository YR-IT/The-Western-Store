# 11 — Pending To-Do & Open Items

## 🔴 Critical / Go-Live Actions (Before Real Customer Payments)

- [ ] **Cashfree Production Credentials** — Swap Sandbox keys (`TEST...`) with Cashfree Production API keys (`CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENV=PRODUCTION`) in Render backend environment and `VITE_CASHFREE_MODE=production` on Vercel.
- [ ] **Whitelist Production Domains** — In Cashfree Merchant Dashboard (`Payment Gateway > Developers > Whitelisting`), add `https://thewesternstore.in`, `https://www.thewesternstore.in`, and your Vercel production domain.
- [ ] **Configure Cashfree Production Webhook** — Register `https://the-western-store.onrender.com/api/payments/webhook` with API version `2026-01-01` and events (`PAYMENT_SUCCESS_WEBHOOK`, `PAYMENT_FAILED_WEBHOOK`, `USER_DROPPED_WEBHOOK`) on Cashfree Merchant Dashboard.
- [ ] **Change `ADMIN_PASSWORD`** — Change from default `admin123` in Render environment before public launch.
- [ ] **Rotate `JWT_SECRET`** — Update to a high-entropy cryptographically random string in Render environment.

---

## 🟡 Store Content & Operations (Owner Checklist)

- [x] **Legal Business Name** — Set to `'Shweta'` in `STORE_INFO` (`frontend/src/data/mockData.ts`).
- [x] **GSTIN** — Registered `'06FTCPS9145C1ZJ'` set in `STORE_INFO` and displayed in footer/policies.
- [x] **Grievance Officer** — Set to `'Shweta'` (`thewesternstorekkr@gmail.com`) complying with Consumer Protection (E-Commerce) Rules 2020.
- [ ] **Live Catalog Sync** — Add/review live inventory quantities and high-res imagery for all Kurukshetra boutique silhouettes via Admin Panel.
- [ ] **Hero Banners (High-Res)** — Upload production 16:9 desktop and 9:16 mobile banners via Admin → Homepage.

---

## 🟢 Implemented Features (Verified in Codebase)

### Payments & Checkout
- [x] **Cashfree Payments PG Integration** — Migrated from Razorpay to Cashfree Payments using `cashfree-pg` (v6.0.6) backend SDK and Cashfree.js (v3) Drop-in Web SDK. All references to Razorpay fully removed from production code.
- [x] **Server-Side Authoritative Verification** — `POST /api/payments/verify` verifies status directly with Cashfree (`cashfree.PGFetchOrder`); never relies on client-side state alone.
- [x] **Webhook Replay Protection** — Rejects webhooks with `x-webhook-timestamp` older than 300 seconds (5-minute window) to prevent replay exploits.
- [x] **Idempotent Webhook Processing** — Signature verification via `cashfree.PGVerifyWebhookSignature`, idempotent status updates, and single-execution inventory decrements.
- [x] **Guest Checkout Supabase Compatibility** — Foreign key constraint fallback (`23503`) so guest orders persist cleanly with `user_id = null`.
- [x] **Post-Payment Flow & Verification** — Clean redirect to `/order-confirmation/:orderId` for both QR scan modal dismissal and Card 3DS browser redirects.
- [x] **Payment Security Hardening** — Mandatory webhook signatures (401 on missing headers), strict INR currency and amount tamper assertions in verify, and refund upper-bound validation.
- [x] **Removed Sandbox / Test Mode Badges** — Cleaned up checkout UI; removed all `"Cashfree Sandbox Mode — use test cards / UPI"` badges and sandbox notices. Dynamic production mode resolution for web SDK.

### Customer Storefront Experience
- [x] **Clean Low Stock Indicator** — Clean pill showing `Only {count} pieces left.` when stock `<= 5`.
- [x] **Product Reviews** — Fully interactive rating system on PDP with submission form, star ratings, verified filter, and pagination.
- [x] **Size Guide** — Sizing chart modal and dedicated `/size-guide` page covering Ethnic Wear (XS–XXL) and Western/Denim with inch/cm unit toggles.
- [x] **Courier Tracking Integration** — Normalizes courier URLs (`https://`) across Delhivery, Blue Dart, DTDC, India Post, Shiprocket, XpressBees, Shadowfax with 1-click AWB copy.
- [x] **Account Order History** — Authenticated customer order history (`/account/orders`) with direct courier tracking links and live manual sync.
- [x] **Guest Cart Merge & Persistent Cart** — Preserves cart items across sessions and merges guest carts upon login.
- [x] **PLP Search & Filter Wiring** — Filtering by category, fabric, occasion, size, color, price range, and in-stock availability.

### Admin Panel (CMS)
- [x] **CSV / Excel Order Export** — One-click download of filtered orders (`tws_orders_export_YYYY-MM-DD.csv`) encoded with UTF-8 BOM (`\uFEFF`) for clean Excel rendering.
- [x] **Bulk Order Status Actions** — Multi-select checkboxes to batch-update orders to Confirmed, Paid, Shipped, or Delivered.
- [x] **Customer Phone & Email Search** — Search bar queries raw digits, formatted phone numbers, and customer emails.
- [x] **Low Stock Dashboard Alert Widget** — KPI card and alert box for garments with `<= 2` units left, with 1-click restock modal.
- [x] **ImageKit Cloud Media Library** — Direct launcher in the admin sidebar navigation to browse, search, and delete ImageKit cloud assets.
- [x] **Admin Catalog Mutations Proxy** — Service role proxy on backend (`requireAdmin`) bypassing Supabase client-side RLS restrictions.
- [x] **Homepage Sections Manager** — Visual management of hero sliders, featured sections, budget tiles, and testimonials.

---

## 🔵 Future Enhancements (Post-Launch Roadmap)

- [ ] **Order Email Notifications** — Automated order confirmation and dispatch receipts via Nodemailer / Resend.
- [ ] **WhatsApp Business Cloud API** — Automated transactional dispatch updates via official Meta WhatsApp Business API.
- [ ] **Coupon / Promo Discount Codes** — Promotion engine in cart and checkout with percentage/flat discounts.
- [ ] **Analytics Tracking** — Google Analytics 4 (GA4) or privacy-first Plausible integration.
- [ ] **Google Merchant Center Feed** — XML/JSON automated product feed for Google Shopping listings.
- [ ] **Instagram Shopping Integration** — Facebook Commerce catalog sync for `@the_western_store_kkr`.
- [ ] **Supabase Realtime WebSockets** — Realtime order updates replacing 25s polling in Admin Panel.
- [ ] **Multi-location Inventory** — Separate warehouse vs. Thanesar retail boutique inventory tracking.

---

## 📝 Compliance & Legal Reference Status

| Requirement | Implementation Detail | Status |
|---|---|---|
| **Legal Entity Name** | `STORE_INFO.legalName = 'Shweta'` | ✅ Implemented |
| **GSTIN** | `STORE_INFO.gstin = '06FTCPS9145C1ZJ'` | ✅ Implemented |
| **Grievance Redressal** | `STORE_INFO.grievanceOfficer = 'Shweta'`, `thewesternstorekkr@gmail.com` | ✅ Implemented |
| **Boutique Address** | Behind Hotel Pearl Marc, Thanesar, Kurukshetra, Haryana | ✅ Implemented |
| **Customer Support** | Phone + WhatsApp: `+91 9729515288` | ✅ Implemented |
| **Mandatory Policies** | Privacy Policy, Refund Policy, Shipping Policy, Terms & Conditions | ✅ Implemented |

---

## 🐛 Watch List & Operational Notes

- **Render Idle Spin-Down:** Render free tier spins down after ~15 minutes of inactivity; first request after spin-down takes 30-50 seconds (cold start).
- **Restarting Backend after `.env` edits:** Remember to run `touch backend/src/index.ts` so `tsx watch` reloads updated environment variables.
- **Admin JWT Expiry:** Admin session token expires after 12 hours (`sessionStorage.tws_admin_token`).
