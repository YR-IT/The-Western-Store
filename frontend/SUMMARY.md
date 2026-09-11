# The Western Store Kurukshetra — Application Flow & Feature Summary

Welcome to the comprehensive technical and functional documentation for **The Western Store Kurukshetra** web application. This document provides an in-depth breakdown of the user experience flows, storefront architecture, interactive features, admin management workflows, and technical design patterns implemented across the application.

---

## 1. Executive Overview & Brand Context

**The Western Store Kurukshetra** is a modern hybrid e-commerce platform crafted for a boutique fashion store located in Kurukshetra, Haryana, India. It seamlessly bridges online catalog discovery with direct **WhatsApp Checkout**, empowering customers to browse traditional ethnic wear, contemporary fusion outfits, and western apparel while directly connecting with store staff via WhatsApp for order placement, size consultations, and live order tracking.

---

## 2. Technical Stack & Architecture

- **Frontend Framework**: React 18+ with TypeScript
- **Backend API**: Express.js with TypeScript (`/backend`), providing API endpoints & ImageKit auth signature generation
- **Database & Auth**: Supabase (PostgreSQL Database + Auth + Realtime RLS Security)
- **Image Optimization & CDN**: ImageKit (`@imagekit/nodejs` backend SDK + `@imagekit/react` frontend SDK + `ImageKitUploader` admin component)
- **Styling**: Tailwind CSS with custom editorial color tokens (`#721B29` Deep Ruby, `#241C1D` Charcoal Dark, `#FDFBF7` Warm Linen)
- **Animations & Micro-interactions**: `motion/react` for smooth view transitions, skeleton loaders, and layout morphing
- **Icons**: `lucide-react`
- **State Management**: React Context (`StoreContext`) backed by `localStorage` persistence for catalog items, active cart, wishlist, orders, customer profiles, and CMS homepage configurations
- **Build System**: Vite with TypeScript support

---

## 3. Core User Flows & Navigation

```
                                 [ Home Page ]
                                       |
    +------------------+---------------+---------------+------------------+
    |                  |               |               |                  |
[ Header Nav ]   [ Category Grid ] [ Budget Grid ] [ Lookbook ]   [ Hero Carousel ]
    |                  |               |               |                  |
    +------------------+---------------+---------------+------------------+
                                       |
                         [ Product Listing Page (PLP) ]
                                       |
                               ( Click Product )
                                       |
                          [ Product Detail Page (PDP) ]
                                       |
            +--------------------------+--------------------------+
            |                                                     |
  [ Add to Cart / Buy Now ]                               [ Share / Wishlist ]
            |                                                     |
   [ Cart Drawer / Page ]                                  [ Wishlist View ]
            |
  [ WhatsApp Checkout Modal ]
            |
    ( Send to WhatsApp )
            |
   [ Order Placed & Tracked ] ---> [ Order Tracking & History ]
```

### Flow A: Discovery & Browsing
1. **Scrolling Announcement Bar**: Displays promotional discounts (e.g., "Flat 20% OFF on Festive Ethnic Drapes") with ticker controls.
2. **Dynamic Header**: Features instant search button, category quick-links, wishlist counter, cart drawer trigger, track order link, customer profile trigger, and Admin toggle.
3. **Hero Carousel**: High-impact editorial banners featuring seasonal collections ("Festive Drapes 2026", "Kurukshetra Boutique Specials") with direct call-to-action buttons.
4. **Shop by Category**: Visual category cards (Ethnic Wear, Western Wear, Indo-Western Fusion, Accessories) leading straight to pre-filtered catalog views.
5. **Shop by Budget**: Direct price-tier filtering cards (Under ₹999, Under ₹1499, Under ₹1999, Premium Edit).
6. **Editorial Lookbook**: Interactive showcase featuring hotspot pins on curated outfits. Hovering or tapping a pin highlights the matching item with quick-add options.
7. **Social Proof & Testimonials**: Customer review carousel with star ratings and a self-submission form for verified store shoppers.

---

### Flow B: Catalog & Product Exploration
1. **Product Listing Page (PLP)**:
   - Category navigation tabs (All, Ethnic Wear, Western Wear, Indo-Western, Accessories).
   - Multi-criteria filtering (Budget Tiers, Price Range slider, On Sale items, In Stock only).
   - Sorting options (Featured, Price: Low to High, Price: High to Low, Customer Ratings, Newest).
   - Responsive product cards with image hover swap, discount tags (`-24% OFF`), low-stock urgency badges (`Only 3 left`), wishlist toggles, and Quick View actions.
2. **Product Detail Page (PDP)**:
   - Multi-image gallery with thumbnail selection.
   - **Fabric Detail Hover-to-Zoom**: Interactive cursor-tracking zoom lens on the main image allowing up to 2.25x magnification to inspect weave textures and embroidery.
   - **Size Selection & Size Guide Modal**: Interactive size picker (XS to XXL) with a modal providing chest, waist, and hip measurement charts in inches and centimeters.
   - **Urgency & Inventory Signals**: Real-time stock counts highlighting low inventory to drive conversion.
   - **Social Sharing**: One-click sharing buttons for WhatsApp, Facebook, X (Twitter), and Copy Link.
   - **Pincode Delivery Estimator**: Instant delivery date calculator based on customer pincode.
   - **Direct WhatsApp Inquiry**: Dedicated button opening a pre-filled WhatsApp conversation regarding the specific product.

---

### Flow C: Cart, Checkout & WhatsApp Order Placement
1. **Cart Management**:
   - Access via slide-over **Cart Drawer** or dedicated **Cart Page**.
   - Quantity modifiers, item removal with undo, and coupon code application (e.g., `FESTIVE20` for 20% off).
   - Free shipping progress bar indicating how much more is needed for complimentary delivery.
2. **WhatsApp Checkout Modal**:
   - Step 1: Customer enters shipping details (Name, Mobile Number, Full Address, City, State, Pincode, Payment Preference like UPI / Cash on Delivery).
   - Step 2: System formats a structured WhatsApp message with Itemized Order List, Sizes, Total Price, Coupon Applied, Delivery Address, and Order Reference Number.
   - Step 3: Redirects customer to WhatsApp to send the message directly to the store manager while automatically creating a local order record in the database.

---

### Flow D: Order Tracking & Order History
1. **Order Tracking Page**:
   - Search by Order ID or Customer Mobile Number.
   - Visual step-by-step progress tracker (Order Placed -> Verified -> Dispatch Processing -> Out for Delivery -> Delivered).
   - Live courier tracking details (Courier partner name, AWB tracking number, estimated delivery date).
   - Real-time order timeline notes updated by store admin.
2. **Order History Page**:
   - Complete list of past orders saved in local storage / profile.
   - Quick "Re-order on WhatsApp" button and direct tracking links.

---

## 4. Admin Panel & Content Management Workflows

The built-in **Admin Panel** (`/admin` view toggle) provides store administrators with complete control over inventory, customer orders, and homepage CMS sections:

### 1. Store CMS & Section Reordering
- Toggle visibility of homepage sections (Hero, Categories, New Arrivals, Budget Edit, Lookbook, Testimonials, Instagram, Trust Strip).
- Drag/reorder section hierarchy.
- Edit section headings, sub-titles, taglines, and call-to-action button links.

### 2. Catalog Management (CRUD)
- Add new products or edit existing items.
- Custom title, category, budget tier, price, original price, sale badge, stock quantity (`inStockCount`), sizes, fabric details, and image URLs.
- Quick stock increment/decrement buttons and sold-out status toggling.

### 3. Category Management
- Create, rename, or remove product categories dynamically.

### 4. Order Management
- View all customer orders with status filter (All, Pending, Verified, Shipped, Delivered, Cancelled).
- Update order status, assign courier partners and tracking IDs.
- Add timeline status notes visible to customers on the tracking page.

### 5. Store Settings & Announcement Ticker
- Configure store WhatsApp number, store location address, phone numbers, and email.
- Update running announcement bar text messages and discount codes.

---

## 5. Key Interactive Features

| Feature | Description |
| :--- | :--- |
| **Fabric Detail Hover-to-Zoom** | Move mouse over PDP image to view magnified fabric weave texture up to 2.25x. |
| **Low-Stock Urgency Badges** | Highlights `Only X left in stock!` when inventory drops to 5 or fewer items. |
| **Multi-Channel Social Sharing** | Instant share options for WhatsApp, Facebook, Twitter, and direct URL copy. |
| **Size Chart Modal** | Detailed measurement tables in inches/cm for Ethnic and Western garments. |
| **Instant Search Modal** | Real-time auto-suggestions, category filters, and popular tag quick-searches. |
| **Animated Motion Views** | `motion/react` page transition effects, scale animations, and layout transitions. |
| **Shimmer Skeleton Screen** | Smooth loading placeholders for PLP grid and PDP views during data fetching. |

---

## 6. Data Schema & Persistence

All application state is centrally managed via `StoreContext` and synchronized with `localStorage`:

- `the_western_store_products_v2`: Inventory catalog items
- `the_western_store_cart_v2`: Active customer shopping bag
- `the_western_store_wishlist_v2`: Saved favorite products
- `the_western_store_orders_v2`: Active and past customer order records
- `the_western_store_cms_v2`: CMS layout and section order
- `the_western_store_user_v2`: Verified customer profile details

---

## 7. Backend API & ImageKit CDN Upload Setup

### Overview
The app includes a dedicated Express + TypeScript backend located in `/backend` to handle server-side operations, secure authentication signatures, and ImageKit CDN integration.

### ImageKit Direct Upload Flow
1. **Admin Panel**: When creating or editing a product or category in `ProductEditorModal` or `CategoryEditorModal`, clicking **"Choose Photo & Upload to ImageKit"** triggers the `ImageKitUploader` component.
2. **Backend Authentication**: The frontend requests a short-lived signature from `GET http://localhost:4000/api/imagekit/auth`.
3. **Private Key Protection**: The server uses `@imagekit/nodejs` `helper.getAuthenticationParameters()` to sign the request. The private key remains 100% secret on the server.
4. **Direct CDN Upload**: The browser uploads the image directly to ImageKit's high-speed Upload API.
5. **Instant Preview & Optimization**: ImageKit returns the optimized URL (with automatic WebP formatting and real-time resizing capabilities), which auto-populates in the product/category form.

### How to Run Backend & Set Credentials

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   The backend will start on `http://localhost:4000`.

2. **Configure ImageKit Keys**:
   Get your keys from [ImageKit Dashboard → Developer Options](https://imagekit.io/dashboard):
   Edit `/backend/.env`:
   ```env
   IMAGEKIT_PUBLIC_KEY=public_your_public_key
   IMAGEKIT_PRIVATE_KEY=private_your_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
   ADMIN_SECRET=westernstore_admin_2026
   PORT=4000
   FRONTEND_URL=http://localhost:3000
   ```

---

*Document compiled for **The Western Store Kurukshetra** platform.*

