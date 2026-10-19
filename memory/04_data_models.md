# 04 — Data Models

All TypeScript types are in `frontend/src/types.ts`.

---

## 👤 UserAccount

```typescript
interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider: 'google' | 'admin';
  isAdmin?: boolean;   // ⭐ CRITICAL: Must be true for AdminPanel access
}
```

> **Key gotcha:** The backend returns `{ role: 'admin' }` not `{ isAdmin: true }`.  
> `loginAsAdmin()` must map: `isAdmin: data.user.role === 'admin'`  
> Without this, `AdminPanel` shows "Admin Access Required" even after login.

---

## 📦 Product

```typescript
interface Product {
  id: string;
  title: string;
  slug?: string;
  category: string;           // ProductCategory (string)
  price: number;
  originalPrice: number;
  onSale: boolean;
  saleDiscount?: string;
  isSoldOut: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  budgetTier: BudgetTier;
  images: string[];           // ImageKit URLs
  sizes: string[];
  colors: { name: string }[];
  description: string;
  fabricCare: {
    fabric: string;
    washCare: string;
    fit: string;
    occasion: string;
  };
  customReturnPolicy?: string;
  customWashCareNotes?: string[];
  customDeliveryTimeline?: {
    haryanaDelhi?: string;
    restOfIndia?: string;
    international?: string;
  };
  customReviews?: ReviewItem[];
  inStockCount?: number;
  rating?: number;
  reviewCount?: number;
}
```

---

## 🛒 CartItem

```typescript
interface CartItem {
  id: string;         // Composite: productId + size + color
  productId: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
}
```

---

## 📋 Order

```typescript
type OrderStatus =
  | 'Pending'           // Awaiting payment or processing
  | 'Paid'              // Razorpay payment verified
  | 'Confirmed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

interface OrderItemNormalized {
  id: string;
  productId: string;
  title: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  product: Product;     // Retained for backward/forward compatibility
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  notes?: string;
  items: OrderItemNormalized[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'razorpay';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  // Tracking (filled by admin after ship)
  courierName?: string;
  trackingNumber?: string;
  trackingLink?: string;
  shippedDate?: string;
  estimatedDelivery?: string;
  trackingNotes?: string;
  statusHistory?: { status: OrderStatus; timestamp: string; note?: string }[];
}
```

> **Stock Decrementing:** Upon successful payment verification (`POST /api/payments/verify`), `in_stock_count` is decremented in `products` table for each purchased item. If `in_stock_count` reaches 0 or below, `is_sold_out` is automatically set to `true`.

---

## 🎠 HeroSlide

```typescript
interface HeroSlide {
  id: string;
  image: string;              // Fallback image
  desktopImage?: string;      // 16:9 widescreen banner
  mobileImage?: string;       // 9:16 portrait banner
  targetDevice?: 'all' | 'desktop' | 'mobile';
  title?: string;
  tagline?: string;
  subtitle?: string;
  category?: string;
  ctaText?: string;
  linkUrl?: string;
  showTextOverlay?: boolean;  // Default false = pure image banner
}
```

---

## 🏷️ Category

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  subtitle?: string;
  itemCount?: number;
  showOnNavbar?: boolean;
  navbarOrder?: number;
}
```

---

## 💰 BudgetTier

```typescript
type BudgetTier = 'under_999' | 'under_1499' | 'under_1999' | 'under_2499' | 'premium' | 'all';
```

---

## 🏠 HomeSectionType

```typescript
type HomeSectionType =
  | 'hero'
  | 'categories'
  | 'new-arrivals'
  | 'budget-edit'
  | 'best-sellers'
  | 'lookbook'
  | 'trust-strip'
  | 'trust'
  | 'testimonials'
  | 'instagram'
  | 'custom-banner';
```

---

## 🗃️ Supabase Table Mapping

| Frontend Model | Supabase Table | Key Notes |
|----------------|---------------|-----------|
| `Product` | `products` | `images[]` stored as JSON array of ImageKit URLs |
| `Category` | `categories` | `slug` is URL-safe version of name |
| `Order` | `orders` | `shipping_address` is JSONB, `items` is normalized JSONB array |
| `WishlistItem` | `wishlist_items` | User wishlist items (`user_id`, `product_id`) |
| `HeroSlide` | `hero_slides` | `desktop_image`, `mobile_image` columns |
| `Testimonial` | `testimonials` | |
| `InstagramPost` | `instagram_posts` | `reel_url`, `video_url` |
| `HomeSectionConfig` | `home_sections` | `images` is JSONB array |
