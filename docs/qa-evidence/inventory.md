# QA & Security Test Inventory — The Western Store

**Repository:** `thewesternstore/The-Western-Store`  
**Production URL:** `https://www.thewesternstore.in`  
**Stack:** React 19 + TypeScript + Vite + Tailwind 4 + `motion` (Frontend), Express 4 + TypeScript (Backend, Render), Supabase (PostgreSQL, Auth, Storage, Realtime), ImageKit (CDN & Media), Razorpay (Payment Gateway - Sandbox/Readiness mode), WhatsApp-based checkout.

---

## 1. Route & View Inventory

The application uses `react-router-dom` (v7) with history routing (`BrowserRouter` in `frontend/src/main.tsx`).

| Route Path | Component / Page | Access Guard | Primary Purpose |
|------------|------------------|--------------|-----------------|
| `/` | `HomePage` (`pages/HomePage.tsx`) | Public | Brand storefront, Hero Carousel, Budget tiles, Curated sections, Testimonials, Trust Strip, Instagram feed |
| `/shop` | `ProductListingPage` (`components/ProductListingPage.tsx`) | Public | Full catalog PLP with category/budget/search filters, sorting, price range, stock tags |
| `/category/:slug` | `ProductListingPage` (`components/ProductListingPage.tsx`) | Public | Category-filtered PLP (e.g., `/category/suits`, `/category/dresses`) |
| `/collection/:slug` | `ProductListingPage` (`components/ProductListingPage.tsx`) | Public | Collection/Budget-filtered PLP (e.g., `/collection/under-999`, `/collection/best-sellers`) |
| `/product/:slug` | `ProductDetailPage` (`components/ProductDetailPage.tsx`) | Public | PDP with ImageKit gallery, zoom, size selector, quantity, Add to Cart, Buy Now, Wishlist, WhatsApp share, Size Chart |
| `/cart` | `CartPage` (`components/CartPage.tsx`) | Public | Full cart view with line item editing, quantity adjustment, coupon code, price summary, checkout CTA |
| `/checkout` | `CheckoutPage` (`pages/CheckoutPage.tsx`) | Public (Guest & Auth) | Shipping address collection, PIN code validation, Order summary, Razorpay online payment / WhatsApp fallback |
| `/order-confirmation/:orderId` | `OrderConfirmationPage` (`pages/OrderConfirmationPage.tsx`) | Public | Post-purchase confirmation, order summary, tracking details, customer support link |
| `/order-confirmation` | `OrderConfirmationPage` (`pages/OrderConfirmationPage.tsx`) | Public | Fallback post-purchase confirmation |
| `/wishlist` | `WishlistPage` (`components/WishlistPage.tsx`) | Public | Saved items grid, move-to-cart, remove item, empty state |
| `/track-order` | `OrderTrackingPage` (`components/OrderTrackingPage.tsx`) | Public | Self-service order lookup by Order Number + Phone number (no auth required) |
| `/account` | `OrderHistoryPage` (`components/OrderHistoryPage.tsx`) | `PrivateRoute` (Supabase Auth) | Logged-in customer portal: profile summary, address, previous orders |
| `/account/orders` | `OrderHistoryPage` (`components/OrderHistoryPage.tsx`) | `PrivateRoute` (Supabase Auth) | Direct link to customer past orders |
| `/login` | `LoginPage` (`pages/LoginPage.tsx`) | Public (Guest) | Customer login with email/password + Google OAuth |
| `/signup` | `SignupPage` (`pages/SignupPage.tsx`) | Public (Guest) | Customer registration |
| `/admin/login` | `AdminLoginPage` (`pages/AdminLoginPage.tsx`) | Public | Standalone administrative authentication with staff credentials |
| `/admin/*` | `AdminPanel` (`components/AdminPanel.tsx`) | `AdminRoute` (JWT token in `sessionStorage`) | Full store CMS: Dashboard, Orders, Products, Categories, Hero Banners, Sections, Budget, Reviews, ImageKit Media, Video Library, Settings |
| `/about` | `AboutUsPage` (`pages/AboutUsPage.tsx`) | Public | Boutique history, Kurukshetra physical store location, heritage, craft commitment |
| `/pricing` | `PricingPage` (`pages/PricingPage.tsx`) | Public | Transparent pricing philosophy, fabric tiers, custom tailoring info, Razorpay compliance |
| `/contact` | `ContactPage` (`components/ContactPage.tsx`) | Public | Interactive contact & inquiry form with honeypot spam protection, physical address, map, WhatsApp/phone/email |
| `/policies/shipping-policy` | `PolicyPage` (`components/PolicyPage.tsx`) | Public | Shipping zones, transit times, free delivery threshold (₹999+), tracking information |
| `/policies/refund-policy` | `PolicyPage` (`components/PolicyPage.tsx`) | Public | 7-day exchange/return policy, unboxing video requirement, damaged item replacement |
| `/policies/terms` | `PolicyPage` (`components/PolicyPage.tsx`) | Public | Terms & Conditions, governing law (Kurukshetra, Haryana jurisdiction), IP rights |
| `/policies/privacy-policy` | `PolicyPage` (`components/PolicyPage.tsx`) | Public | Data protection, cookie usage, privacy grievance officer contact |
| `/policies/:policyType` | `PolicyPage` (`components/PolicyPage.tsx`) | Public | Dynamic route for policy tabs |
| `*` | `NotFoundPage` (`pages/NotFoundPage.tsx`) | Public | Branded 404 with search suggestions and Return Home CTA |

---

## 2. Interactive Elements Inventory (Per Page & Modal)

### Global Header & Navigation (`Header.tsx`, `AnnouncementBar.tsx`)
- **Announcement Bar:** Ticker carousel with promotions, clickable links.
- **Logo:** Navigates to `/`.
- **Navigation Links / Mega Menu:** Desktop navigation items (`All Collections`, `New Arrivals`, `Best Sellers`, `Suits & Sets`, `Dresses`, `Shop by Budget`, `About`, `Contact`).
- **Mobile Menu (Hamburger):** Slide-out drawer with accordion links, category list, policy links, store contact details.
- **Search Button / Bar:** Opens `SearchModal` (live query with instant results, recent searches, clear button, Esc key).
- **Wishlist Icon with Badge:** Badge counter, navigates to `/wishlist`.
- **Cart Icon with Badge:** Badge counter, opens `CartDrawer`.
- **Account Icon / Dropdown:** 
  - Guest: Opens `AuthModal` or navigates to `/login`.
  - Authenticated: Dropdown with `My Orders` (`/account/orders`), `Profile`, `Logout`.
- **Floating WhatsApp Concierge:** Fixed bottom-right button opening WhatsApp chat with pre-filled message.

### Home Page (`pages/HomePage.tsx`)
- **Hero Carousel (`HeroCarousel.tsx`):** Autoplay slide rotation, next/prev arrow buttons, slide dot indicators, pause on hover, device-responsive banners (16:9 desktop, 9:16 mobile), slide click-through to categories/products.
- **Shop By Budget (`ShopByBudget.tsx`):** Clickable budget tier tiles (e.g., `Under ₹999`, `Under ₹1,499`, `Under ₹1,999`, `Luxury Edit`) navigating to filtered PLP.
- **Category Grid:** Visual category cards linking to `/category/:slug`.
- **Product Sections (`ProductSection.tsx`):** Horizontal carousels with smooth scroll, quick-add button, wishlist button, click to PDP.
- **Testimonials (`Testimonials.tsx`):** Carousel of verified boutique reviews, rating stars, outfit tags, helpful counter.
- **Trust Strip (`TrustStrip.tsx`):** Four boutique guarantees (Authentic Handcrafted, Express Dispatch, Quality Guaranteed, Dedicated Support).
- **Instagram Feed (`InstagramFeed.tsx`):** Boutique reel showcase with external links.

### Product Listing Page (`ProductListingPage.tsx`)
- **Category Filter Tabs:** Horizontal pills + sidebar filters (Category, Price range, In-stock only, Sale only, Sizes).
- **Sort Dropdown:** Low to High, High to Low, Newest, Bestselling, Rating.
- **Search Query Filter:** In-page search refinement.
- **Clear All Filters:** Resets active filters.
- **Product Grid:** Responsive product cards (`ProductCard.tsx`):
  - Image hover flip / zoom.
  - Discount badge (-X%).
  - Quick View button (opens `QuickViewModal`).
  - Quick Add to Bag button with size selector drawer.
  - Wishlist heart toggle with instant animation.

### Product Detail Page (`ProductDetailPage.tsx`)
- **Image Gallery:** Main large image view, thumbnail strip, zoom lens on hover, mobile touch swipe.
- **Breadcrumb Navigation:** `Home > Shop > Category > Product Title`.
- **Size Selector:** Chips for XS, S, M, L, XL, XXL, Free Size with stock availability state.
- **Size Chart Link:** Opens `SizeChartModal` with measurement table (bust, waist, hips, length).
- **Quantity Selector:** Increment/decrement buttons (clamped to 1..10 or stock limit).
- **Add to Bag Button:** Adds to global cart state, opens `CartDrawer`.
- **Buy Now Button:** Direct checkout trigger (clears or preserves cart and navigates directly to `/checkout` with selected item).
- **Wishlist Button:** Toggles wishlist state.
- **Share Button:** Native Web Share API or copy URL with toast notification.
- **Accordion Tabs:** Product Description, Fabric & Care, Delivery & Returns.
- **Related Products Carousel:** Recommended items from same category.

### Cart Drawer (`CartDrawer.tsx`) & Cart Page (`CartPage.tsx`)
- **Line Items:** Thumbnail, title, selected size/color, unit price, quantity increment/decrement, remove button.
- **Free Shipping Progress Bar:** Dynamic threshold indicator (Free shipping above ₹999).
- **Coupon Code Input:** Promo code apply/remove with instant discount recalculation.
- **Price Breakdown:** Subtotal, Discount, Estimated Shipping (Free/₹99), Final Total.
- **Checkout CTA Button:** Navigates to `/checkout` (closes drawer).
- **Continue Shopping Button:** Closes drawer.

### Checkout Page (`pages/CheckoutPage.tsx`)
- **Shipping Address Form:**
  - Full Name (`name`), Mobile Number (10 digits `tel`), Email Address (`email`).
  - Street Address (`address`), PIN Code (6 digits `postal-code`), City (`city`), State (`state`).
  - Delivery instructions / notes (`notes`).
- **Payment Method Toggle:**
  - Online Payment (Razorpay - Cards, UPI, NetBanking, Wallets).
  - WhatsApp Boutique Checkout (Order reservation via WhatsApp).
- **Place Order Button:** Validates fields, creates server-side order, initiates Razorpay SDK or opens WhatsApp chat.

### Modals & Overlays
- **`AuthModal.tsx`:** Modal with Login / Sign Up tabs, email/password form, Google OAuth button, forgot password trigger.
- **`QuickViewModal.tsx`:** Quick product preview overlay with gallery, size select, Add to Bag.
- **`SizeChartModal.tsx`:** Size guide tables in inches and centimeters.
- **`WhatsAppCheckoutModal.tsx`:** Form to collect customer details before redirecting to WhatsApp.
- **`SearchModal.tsx`:** Keyboard-accessible full-screen search overlay with instant debounced results.

### Admin Panel (`AdminPanel.tsx` & subcomponents)
- **Navigation Tabs:**
  - Dashboard (metrics, revenue, order stats).
  - Orders (filtering by status, search by customer/phone, status transition, courier & tracking assignment, delete).
  - Products (CRUD: create new, edit modal, delete, toggle sale/bestseller/soldout, ImageKit uploader).
  - Categories (CRUD: create, edit, delete, slug generation).
  - Hero Banners (add slide, edit slide, target device selection desktop/mobile, reorder, delete).
  - Home Sections (enable/disable sections, change section title & order).
  - Shop by Budget (configure budget tiles).
  - Testimonials (manage customer reviews).
  - ImageKit Media Library (`ImageKitMediaLibraryModal.tsx` - browse assets, copy CDN URL, delete file).
  - Supabase Video Library (`SupabaseVideoLibraryModal.tsx` - browse uploaded mp4 reels).
  - Store Settings (announcement text, contact phone/email, Instagram handle).
- **Logout Action:** Invalidates session and clears `sessionStorage`.

---

## 3. Backend Endpoints Inventory (`backend/src/index.ts`)

| Method | Path | Auth / Middleware | Rate Limit | Request Body / Query | Response Shape |
|--------|------|-------------------|------------|----------------------|----------------|
| `GET` | `/` | None | None | None | `{ status: 'online', app, version, documentation }` |
| `GET` | `/api/health` | None | None | None | `{ status: 'ok', message, imagekit, supabase, jwt }` |
| `POST` | `/api/admin/login` | None | `loginLimiter` (20 req / 15 min) | `{ email, password }` | `{ success: true, token, user }` (JWT 12h) |
| `GET` | `/api/admin/orders` | `requireAdmin` (JWT) | None | None | `Order[]` (all orders from Supabase) |
| `PUT` | `/api/admin/orders/:id` | `requireAdmin` (JWT) | None | `{ status, courier_name, tracking_number, notes, payment_status }` | `{ success: true, message }` |
| `DELETE` | `/api/admin/orders/:id` | `requireAdmin` (JWT) | None | None | `{ success: true, message }` |
| `GET` | `/api/orders` | `requireAdmin` (JWT) | None | None | `Order[]` (legacy endpoint alias) |
| `PUT` | `/api/orders/:id` | `requireAdmin` (JWT) | None | `{ status, courier_name, tracking_number }` | `{ success: true }` |
| `DELETE` | `/api/orders/:id` | `requireAdmin` (JWT) | None | None | `{ success: true }` |
| `GET` | `/api/orders/track` | None (Public) | `trackLimiter` (15 req / 1 min) | `?orderNumber=...&phone=...` | `{ orderNumber, status, courierName, trackingNumber, totalAmount, createdAt, itemCount, items }` |
| `GET` | `/api/account/orders` | `requireUser` (Supabase JWT) | None | None | `Order[]` (filtered by `user_id = auth.uid()`) |
| `POST` | `/api/orders` | None (Public) | `orderCreateLimiter` (15 req / 15 min) | `{ formData, items, orderId, orderNumber, userId }` | `{ success: true, orderId, orderNumber, total }` |
| `POST` | `/api/payments/create-order` | None (Public) | `orderCreateLimiter` (15 req / 15 min) | `{ items, formData, userId, orderId, orderNumber }` | `{ success: true, orderId, orderNumber, razorpayOrderId, amount, currency, keyId }` |
| `POST` | `/api/payments/verify` | None (Public) | None | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id }` | `{ success: true, verified: true, orderId, message }` |
| `POST` | `/api/payments/webhook` | Raw Body Signature Check | None | Webhook payload from Razorpay | `{ status: 'ok' }` |
| `POST` | `/api/payments/refund` | `requireAdmin` (JWT) | None | `{ paymentId, amount, notes, orderId }` | `{ success: true, refund, message }` |
| `POST` | `/api/contact` | None (Honeypot protected) | `contactLimiter` (5 req / 15 min) | `{ name, email, phone, message, subject, hp_field }` | `{ success: true, message }` |
| `GET` | `/api/imagekit/auth` | `requireAdmin` (JWT) | None | None | `{ token, expire, signature, publicKey }` |
| `GET` | `/api/imagekit/files` | `requireAdmin` (JWT) | None | `?path=...&limit=...&searchQuery=...` | `{ success: true, files }` |
| `DELETE` | `/api/imagekit/files/:fileId` | `requireAdmin` (JWT) | None | None | `{ success: true, message }` |
| `GET` | `/api/store-settings` | None (Public) | None | None | `{ success: true, settings }` |
| `POST` | `/api/store-settings` | `requireAdmin` (JWT) | None | `{ key, value }` | `{ success: true, message }` |

---

## 4. Supabase Database Tables & RLS Inventory

| Table Name | Primary Key | Key Columns | RLS Status | Public Permissions (`anon`) | Authenticated Permissions | Service Role Permissions | Realtime Enabled |
|------------|-------------|-------------|------------|-----------------------------|---------------------------|--------------------------|------------------|
| `public.profiles` | `id` (UUID -> `auth.users`) | `full_name`, `phone`, `email`, `avatar_url`, `role` | ENABLED | None | SELECT/UPDATE own row (`auth.uid() = id`) | Full ALL | No |
| `public.categories` | `id` (TEXT) | `name`, `slug` (UNIQUE), `subtitle`, `image` | ENABLED | SELECT only | SELECT (Admin can ALL via `is_admin()`) | Full ALL | Yes |
| `public.products` | `id` (TEXT) | `title`, `slug` (UNIQUE), `category`, `price`, `images`, `sizes`, `colors`, `is_sold_out` | ENABLED | SELECT only | SELECT (Admin can ALL via `is_admin()`) | Full ALL | Yes |
| `public.orders` | `id` (TEXT) | `order_number` (UNIQUE), `user_id`, `customer_name`, `customer_phone`, `shipping_address`, `items`, `total_amount`, `status`, `payment_status`, `razorpay_order_id` | ENABLED | None (Revoked) | SELECT own orders (`auth.uid() = user_id`) | Full ALL | **NO (Disabled to prevent PII leaks)** |
| `public.cart_items` | `id` (UUID) | `user_id`, `product_id`, `size`, `quantity` | ENABLED | None | SELECT/INSERT/UPDATE/DELETE own rows (`auth.uid() = user_id`) | Full ALL | No |
| `public.wishlist_items` | `id` (UUID) | `user_id`, `product_id` | ENABLED | None | SELECT/INSERT/DELETE own rows (`auth.uid() = user_id`) | Full ALL | No |
| `public.store_settings` | `key` (TEXT) | `value` (JSONB), `updated_at` | ENABLED | SELECT only | SELECT (Admin can ALL via `is_admin()`) | Full ALL | Yes |
| `public.contact_messages` | `id` (UUID) | `name`, `email`, `phone`, `subject`, `message`, `status` | ENABLED | None (Revoked) | None | Full ALL | No |
| `storage.objects` (`videos`) | `id` (UUID) | `bucket_id`, `name`, `metadata` | ENABLED | SELECT (bucket = 'videos') | SELECT (Admin can INSERT/UPDATE/DELETE via `is_admin()`) | Full ALL | No |

---

## 5. Environment Variables Inventory

### Frontend (`frontend/.env`, `frontend/.env.example`)
| Variable Name | Exposed to Browser? | Purpose / Usage | Sensitive? |
|---------------|---------------------|-----------------|------------|
| `VITE_SUPABASE_URL` | Yes (`VITE_*`) | Supabase project URL (`supabase.co`) | Public config |
| `VITE_SUPABASE_ANON_KEY` | Yes (`VITE_*`) | Supabase anonymous public client key | Public (protected by RLS) |
| `VITE_BACKEND_URL` | Yes (`VITE_*`) | Express backend API URL (`http://localhost:4000` / Render URL) | Public config |
| `VITE_IMAGEKIT_URL_ENDPOINT` | Yes (`VITE_*`) | ImageKit CDN URL (`https://ik.imagekit.io/...`) | Public config |
| `VITE_IMAGEKIT_PUBLIC_KEY` | Yes (`VITE_*`) | ImageKit Public API key | Public config |

### Backend (`backend/.env`, `backend/.env.example`)
| Variable Name | Exposed to Browser? | Purpose / Usage | Sensitive? |
|---------------|---------------------|-----------------|------------|
| `PORT` | No | Express server listening port (Default: 4000) | No |
| `NODE_ENV` | No | `development` / `production` | No |
| `FRONTEND_URL` | No | CORS allowed origin URL | No |
| `ADMIN_EMAIL` | No | Administrative login email identity | **Sensitive** |
| `ADMIN_PASSWORD` | No | Administrative login password hash/string | **CRITICAL SECRET** |
| `JWT_SECRET` | No | Secret key for signing 12-hour admin JWT tokens | **CRITICAL SECRET** |
| `SUPABASE_URL` | No | Supabase API URL | Standard |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Full administrative bypass key for Supabase DB | **CRITICAL SECRET** |
| `SUPABASE_KEY` | No | Supabase anon key fallback | Standard |
| `IMAGEKIT_PUBLIC_KEY` | No | ImageKit public key for auth param signing | Standard |
| `IMAGEKIT_PRIVATE_KEY` | No | ImageKit private key for asset deletion and signing | **CRITICAL SECRET** |
| `IMAGEKIT_URL_ENDPOINT` | No | ImageKit base endpoint | Standard |
| `RAZORPAY_KEY_ID` | No (Shared in API response) | Razorpay public key ID (`rzp_test_...` / `rzp_live_...`) | Public identifier |
| `RAZORPAY_KEY_SECRET` | No | Razorpay HMAC signature verification secret | **CRITICAL SECRET** |
| `RAZORPAY_WEBHOOK_SECRET` | No | Secret for verifying incoming Razorpay webhook signatures | **CRITICAL SECRET** |
| `RENDER_EXTERNAL_URL` | No | Render self-ping keep-alive URL | No |

---

## 6. Client Storage Inventory (`localStorage`, `sessionStorage`, Cookies)

| Storage Type | Key Name | Content & Data Structure | Read Location | Write Location | Clear / Invalidation Trigger |
|--------------|----------|--------------------------|---------------|----------------|------------------------------|
| `sessionStorage` | `tws_admin_token` | Admin JWT Bearer token (`eyJ...`) | `StoreContext.tsx`, `AdminRoute.tsx`, `ImageKitUploader.tsx`, `AdminLoginPage.tsx` | `StoreContext.tsx` on successful `/api/admin/login` | On admin logout (`handleAdminLogout`) or browser tab close |
| `localStorage` | `tws_cart` | Guest cart items array (`CartItem[]`) | `StoreContext.tsx` | `StoreContext.tsx` on cart update | Cleared on checkout completion or item removal |
| `localStorage` | `tws_cart_<userId>` | Authenticated user cart items array | `StoreContext.tsx` | `StoreContext.tsx` on cart update | Cleared on user-specific checkout completion |
| `localStorage` | `tws_wishlist` | Saved product IDs array (`string[]`) | `StoreContext.tsx` | `StoreContext.tsx` on wishlist toggle | Manual user removal |
| `localStorage` | `tws_active_user` | Cached customer profile object (`User`) | `StoreContext.tsx` | `StoreContext.tsx` on auth state change | On customer logout |
| `localStorage` | `tws_products_v4` | Offline cached product catalog (`Product[]`) | `StoreContext.tsx` | `StoreContext.tsx` on products fetch | On catalog refresh |
| `localStorage` | `tws_categories_v4` | Offline cached category list (`Category[]`) | `StoreContext.tsx` | `StoreContext.tsx` on categories fetch | On category refresh |
| `localStorage` | `tws_orders` | Cached customer orders (`Order[]`) | `StoreContext.tsx` | `StoreContext.tsx` on order creation | On customer logout |
| `localStorage` | `tws_budget_tiles` | Cached budget tiles config | `StoreContext.tsx` | `StoreContext.tsx` on settings sync | Stored persistently |
| `localStorage` | `tws_home_sections`| Cached home sections ordering & visibility | `StoreContext.tsx` | `StoreContext.tsx` on settings sync | Stored persistently |
| `localStorage` | `tws_trust_features`| Cached trust strip copy | `StoreContext.tsx` | `StoreContext.tsx` on settings sync | Stored persistently |
| `localStorage` | `tws_customer_reviews`| Cached testimonials | `StoreContext.tsx` | `StoreContext.tsx` on settings sync | Stored persistently |
| `localStorage` | `tws_instagram_posts`| Cached Instagram posts | `StoreContext.tsx` | `StoreContext.tsx` on settings sync | Stored persistently |
| `localStorage` | `tws_instagram_handle`| Cached Instagram profile handle | `StoreContext.tsx` | `StoreContext.tsx` on settings sync | Stored persistently |
| `localStorage` | `tws_announcement` | Cached announcement bar text | `StoreContext.tsx` | `StoreContext.tsx` on settings sync | Stored persistently |
| `localStorage` | `tws_collection_filters`| Cached filter configuration | `StoreContext.tsx` | `StoreContext.tsx` on settings sync | Stored persistently |
| `localStorage` | `tws_deleted_product_ids`| Array of locally deleted product IDs | `StoreContext.tsx` | `StoreContext.tsx` on product delete | When product re-added |
| `localStorage` | `tws_deleted_category_ids`| Array of locally deleted category IDs | `StoreContext.tsx` | `StoreContext.tsx` on category delete | When category re-added |
| `localStorage` (LEGACY) | `tws_selected_category` | Persisted category string | `StoreContext.tsx` | `StoreContext.tsx` | **VULNERABLE:** Persists category across sessions, overrides URL |
| `localStorage` (LEGACY) | `tws_selected_budget_tier`| Persisted budget tier string | `StoreContext.tsx` | `StoreContext.tsx` | **VULNERABLE:** Persists budget tier across sessions, overrides URL |
| `localStorage` (LEGACY) | `tws_selected_product_id`| Persisted product ID string | `StoreContext.tsx` | `StoreContext.tsx` | **VULNERABLE:** Persists product ID across sessions |
