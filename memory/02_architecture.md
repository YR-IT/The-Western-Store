# 02 — Architecture

## 📂 Project Root Structure

```
The Western Store/
├── frontend/          # React + Vite app
├── backend/           # Express + TypeScript API
├── supabase/          # Supabase migrations
├── docs/              # Extra documentation
├── memory/            # 🧠 This folder — project memory
├── supabase_schema.sql
├── update_rls_policies.sql
└── README.md
```

---

## 📂 Frontend Structure (`frontend/src/`)

```
src/
├── App.tsx                      # Root layout, routing, StoreProvider wrapper
├── main.tsx                     # Vite entry point, BrowserRouter
├── index.css                    # Global styles & design tokens
├── types.ts                     # All TypeScript interfaces & types
├── vite-env.d.ts
│
├── context/
│   └── StoreContext.tsx         # ⭐ Central state — ALL global state lives here
│
├── data/
│   └── mockData.ts              # STORE_INFO, initial empty arrays, budget tiles, trust features
│
├── pages/                       # Route-level page components
│   ├── HomePage.tsx
│   ├── AdminLoginPage.tsx       # /admin/login — standalone admin auth page
│   ├── CheckoutPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── AboutUsPage.tsx
│   ├── PricingPage.tsx
│   ├── OrderConfirmationPage.tsx
│   └── NotFoundPage.tsx
│
├── components/                  # Reusable UI components
│   ├── Header.tsx               # Sticky nav with search, cart, wishlist, account dropdown
│   ├── Footer.tsx
│   ├── AnnouncementBar.tsx      # Top scrolling announcement strip
│   ├── HeroCarousel.tsx         # Full-width hero banner with mobile/desktop split
│   ├── ProductSection.tsx       # Horizontal scroll product carousel (home sections)
│   ├── ProductListingPage.tsx   # /shop & /category/:slug — filter + grid
│   ├── ProductDetailPage.tsx    # /product/:slug
│   ├── ProductCard.tsx          # Reusable card with quick-add & wishlist
│   ├── CartDrawer.tsx           # Right-side slide-in cart
│   ├── CartPage.tsx             # Full /cart page
│   ├── WishlistPage.tsx
│   ├── AdminPanel.tsx           # ⭐ Full admin CMS (tabs: Dashboard, Orders, Products...)
│   ├── AuthModal.tsx            # Customer login/signup modal overlay
│   ├── SearchModal.tsx          # Full-screen search
│   ├── QuickViewModal.tsx       # Product quick-view popup
│   ├── SizeChartModal.tsx
│   ├── WhatsAppCheckoutModal.tsx
│   ├── OrderTrackingPage.tsx
│   ├── OrderHistoryPage.tsx
│   ├── ContactPage.tsx
│   ├── PolicyPage.tsx           # All legal pages (tabbed)
│   ├── InstagramFeed.tsx
│   ├── Testimonials.tsx
│   ├── TrustStrip.tsx
│   ├── ShopByBudget.tsx
│   ├── Skeletons.tsx            # Loading skeleton components
│   │
│   ├── admin/                   # Admin sub-components (inside AdminPanel)
│   ├── common/                  # Shared utilities (SEOHead, etc.)
│   └── routing/
│       ├── AdminRoute.tsx       # JWT-token-gated route guard
│       ├── PrivateRoute.tsx     # Supabase-auth-gated route guard
│       └── ScrollToTop.tsx
│
├── lib/
│   └── supabase.ts              # Supabase client init & isSupabaseConfigured()
│
├── utils/
│   └── imageUtils.ts            # getOptimizedImageUrl() for ImageKit transforms
│
└── assets/ gifs/                # Static assets
```

---

## 🗺️ Route Map

| Path | Component | Guard |
|------|-----------|-------|
| `/` | `HomePage` | Public |
| `/shop` | `ProductListingPage` | Public |
| `/category/:slug` | `ProductListingPage` | Public |
| `/collection/:slug` | `ProductListingPage` | Public |
| `/product/:slug` | `ProductDetailPage` | Public |
| `/cart` | `CartPage` | Public |
| `/checkout` | `CheckoutPage` | Public |
| `/order-confirmation/:orderId` | `OrderConfirmationPage` | Public |
| `/wishlist` | `WishlistPage` | Public |
| `/track-order` | `OrderTrackingPage` | Public |
| `/account/orders` | `OrderHistoryPage` | `PrivateRoute` (Supabase) |
| `/account` | `OrderHistoryPage` | `PrivateRoute` (Supabase) |
| `/login` | `LoginPage` | Public |
| `/signup` | `SignupPage` | Public |
| `/admin/login` | `AdminLoginPage` | Public |
| `/admin/*` | `AdminPanel` | `AdminRoute` (JWT token) |
| `/about` | `AboutUsPage` | Public |
| `/pricing` | `PricingPage` | Public |
| `/contact` | `ContactPage` | Public |
| `/policies/refund-policy` | `PolicyPage (returns tab)` | Public |
| `/policies/shipping-policy` | `PolicyPage (shipping tab)` | Public |
| `/policies/terms` | `PolicyPage (terms tab)` | Public |
| `/policies/privacy-policy` | `PolicyPage (privacy tab)` | Public |
| `*` | `NotFoundPage` | Public |

---

## 🧩 StoreContext — Global State Architecture

`StoreContext.tsx` is the **single source of truth** for all global state. It provides:

- Product catalog, categories, hero slides, testimonials, Instagram posts
- Cart, wishlist (persisted to localStorage)
- Auth state (`currentUser`, `adminToken`)
- Orders (customer + admin views)
- Home section config, filter config, trust features, budget tiles
- UI state (modal open/close flags, active tabs)
- Navigation helpers (`routerNavigate`, `navigateToCategory`, `navigateToPlp`)

### Key Pattern: `routerNavigate`
Because `StoreContext` is outside the `BrowserRouter`, it cannot directly use `useNavigate()`. Instead:
1. `App.tsx` calls `setRouterNavigate(navigate)` after mounting inside `BrowserRouter`
2. The context stores the function in a ref and exposes `routerNavigate(path)`
3. All context-level navigations use `routerNavigate()`

---

## 🖼️ HeroCarousel — Device-Responsive Banners

- Slides can have `targetDevice: 'all' | 'desktop' | 'mobile'`
- `isMobile` is detected at runtime via `window.innerWidth < 768`
- Desktop uses `aspect-[16/9]`, mobile uses `aspect-[9/16]` (portrait)
- Uses `<picture>` tag for `targetDevice: 'all'` slides
- Images served via ImageKit with `getOptimizedImageUrl()`

---

## 🔧 Backend Structure (`backend/src/`)

```
src/
└── index.ts    # Single-file Express server (~1062 lines)
                # Contains: rate limiters, CORS, auth, all API routes
```

### Backend API Routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/` | None | Root info |
| `GET` | `/api/health` | None | Health check |
| `POST` | `/api/admin/login` | Rate limited (20/15min) | Admin JWT login |
| `GET` | `/api/admin/orders` | `requireAdmin` (JWT) | Fetch all orders |
| `PUT` | `/api/admin/orders/:id/status` | `requireAdmin` | Update order status |
| `PUT` | `/api/admin/orders/:id/tracking` | `requireAdmin` | Update tracking info |
| `DELETE` | `/api/admin/orders/:id` | `requireAdmin` | Delete order |
| `GET` | `/api/admin/products` | `requireAdmin` | Fetch all products |
| `POST` | `/api/admin/products` | `requireAdmin` | Add product |
| `PUT` | `/api/admin/products/:id` | `requireAdmin` | Update product |
| `DELETE` | `/api/admin/products/:id` | `requireAdmin` | Delete product |
| `POST` | `/api/orders` | Rate limited | Create new order |
| `GET` | `/api/orders/track` | None | Public order tracking |
| `POST` | `/api/contact` | Rate limited (5/15min) | Contact form |
| `POST` | `/api/razorpay/create-order` | None | Create Razorpay order |
| `POST` | `/api/razorpay/verify-payment` | None | Verify Razorpay signature |
| `POST` | `/api/imagekit/auth` | None | ImageKit upload auth |
