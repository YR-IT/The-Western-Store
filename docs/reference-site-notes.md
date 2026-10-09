# Reference Site Notes: Kiah Silver (kiahsilver.in) & D2C Compliance Baseline

## 1. Overview & Verification Method
- **Target URL:** `https://www.kiahsilver.in`
- **Method:** Automated HTTP fetch & document structure analysis.
- **Note on Client-Side Rendering:** `kiahsilver.in` is built as a client-side rendered / hydrated React storefront. The raw HTML response delivers the initial shell while full interactive catalog widgets hydrate dynamically.
- **Purpose:** Extract best practices, compliance elements, layout patterns, and Razorpay readiness standards for modern Indian D2C jewellery/fashion storefronts to benchmark *The Western Store*.

---

## 2. Core Compliance & Trust Baseline (Indian D2C / Razorpay Merchant Requirements)

Under Indian Consumer Protection (E-Commerce) Rules, 2020 and Razorpay Merchant Verification guidelines, an e-commerce storefront must provide unambiguous legal, logistical, and grievance information:

### A. Header & Top Bar
- **Announcement Bar:** Dynamic or concise notification ticker (e.g., Shipping coverage details, order support helpline, discount codes). Must *not* claim "Worldwide Shipping" unless international logistics are genuinely integrated.
- **Navigation:** Clear hierarchy (Categories, Collections, Best Sellers, New Arrivals, About Us, Contact Us, Policies).
- **Authentication:** Distinct "Login / Sign Up" buttons; clear account dashboard; no developer or boutique admin logins exposed in public navigation.

### B. Product Listing & Detail Pages (PLP & PDP)
- **Clear Pricing:** All prices shown in INR (`₹`) with clear indicator whether prices are inclusive of GST.
- **Size / Variant Selection:** Clear size guides, dimensions, mandatory variant selector before "Add to Cart" or "Buy Now".
- **Action Buttons:** Dual CTA ("Add to Cart" and immediate "Buy Now"). "Buy Now" must initiate an isolated checkout for that single selected SKU without altering the user's existing cart.
- **Trust Elements on PDP:**
  - Real material & care specifications.
  - Estimated dispatch & delivery timeline (e.g., "Ships within 24-48 hours", "Delivered in 4-7 business days across India").
  - Clear Return/Exchange snippet with link to the comprehensive Refund Policy.

### C. Footer Architecture & Legal Requirements
Every Indian e-commerce merchant onboarding with Razorpay must feature a complete footer with dedicated links to:
1. **Terms and Conditions** (`/policies/terms`)
2. **Privacy Policy** (`/policies/privacy-policy`)
3. **Refund and Cancellation Policy** (`/policies/refund-policy`) — MUST clearly state timeline, conditions, and resolution mechanism.
4. **Shipping and Delivery Policy** (`/policies/shipping-policy`) — delivery estimates, courier partners, shipping charges.
5. **Contact Us & Grievance Redressal** (`/contact` or `/policies/contact`) — Legal Entity Name, Physical Registered Address, Phone, Support Email, and designated Grievance Officer details.
6. **About Us** (`/about`) — authentic brand story, origins, and mission.
7. **Pricing / Order Tracking** (`/pricing`, `/track-order`).

---

## 3. Findings & Architectural Plan for The Western Store

1. **Security & Authentication:**
   - Migrate from unauthenticated frontend order access and hardcoded admin secrets to secure server-side JWT authentication and strict Supabase Row Level Security (RLS).
   - Secure payment flows with cryptographically verified Razorpay signatures (`razorpay_signature`) and idempotent webhooks.

2. **Routing & SEO:**
   - Implement full client-side URL routing (`react-router-dom`) with deep linking, canonical tags, OpenGraph metadata, and structured JSON-LD data.
   - Zero flash of home view on refresh; clean URLs for categories (`/category/:slug`) and products (`/product/:slug`).

3. **Content Integrity:**
   - Remove mock DiceBear testimonials and unverified claims.
   - Standardize all business identity points through a single source of truth (`STORE_INFO`).
