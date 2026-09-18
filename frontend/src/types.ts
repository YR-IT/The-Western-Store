export type ProductCategory = string;

export type BudgetTier = 'under_999' | 'under_1499' | 'under_1999' | 'under_2499' | 'premium' | 'all';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider: 'google' | 'admin';
  isAdmin?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  subtitle?: string;
  itemCount?: number;
  showOnNavbar?: boolean;
  navbarOrder?: number;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  size: string;
  verified: boolean;
  helpfulCount: number;
  userLiked?: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug?: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  onSale: boolean;
  saleDiscount?: string;
  isSoldOut: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  budgetTier: BudgetTier;
  images: string[];
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

export interface CartItem {
  id: string; // generated from productId + size + color
  productId: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | 'Pending WhatsApp'
  | 'Contacted'
  | 'Confirmed'
  | 'Paid'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItemSummary {
  productId: string;
  title: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  userId?: string;
  userEmail?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  notes?: string;
  items: OrderItemSummary[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  // Tracking section (filled by admin once Confirmed/Shipped)
  courierName?: string;
  trackingNumber?: string;
  trackingLink?: string;
  shippedDate?: string;
  estimatedDelivery?: string;
  trackingNotes?: string;
}

export interface OrderTrackingUpdate {
  courierName?: string;
  trackingNumber?: string;
  trackingLink?: string;
  shippedDate?: string;
  estimatedDelivery?: string;
  trackingNotes?: string;
  status?: OrderStatus;
}

export interface HeroSlide {
  id: string;
  image: string; // fallback / default image
  desktopImage?: string; // High-res widescreen banner for PC / laptops
  mobileImage?: string; // Vertical/portrait optimized image for mobile phones
  title?: string;
  tagline?: string;
  subtitle?: string;
  category?: ProductCategory | string;
  ctaText?: string;
  linkUrl?: string; // Custom navigation link (e.g. /plp or category)
  showTextOverlay?: boolean; // If false (default), shows pure image banner without text
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  outfitPurchased: string;
  productId?: string;
  productImage?: string;
  verified: boolean;
  helpfulCount?: number;
  tag?: string;
}

export interface InstagramPost {
  id: string;
  reelUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  image?: string;
  title?: string;
  caption: string;
  likes: number;
  comments: number;
  productTag?: string;
}

export interface BudgetTileConfig {
  tier: BudgetTier;
  title: string;
  priceLabel: string;
  subtitle: string;
  itemsPreview: string;
  image: string;
  badge: string;
}

export interface TrustFeatureConfig {
  id: string;
  title: string;
  description: string;
  iconType: 'globe' | 'shield' | 'whatsapp' | 'cart' | 'wallet' | 'support' | string;
}

export type HomeSectionType =
  | 'hero'
  | 'categories'
  | 'new-arrivals'
  | 'budget-edit'
  | 'best-sellers'
  | 'lookbook'
  | 'trust-strip'
  | 'testimonials'
  | 'instagram'
  | 'custom-banner';

export interface HomeSectionConfig {
  id: string;
  type: HomeSectionType;
  title: string;
  tagline?: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  images: string[];
  buttonText?: string;
  buttonLink?: string;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  enabled: boolean;
}

export interface CollectionFilterConfig {
  fabrics: FilterOption[];
  occasions: FilterOption[];
  sizes: FilterOption[];
  colors: { id: string; name: string; enabled: boolean }[];
  budgetTiers: { id: string; label: string; minPrice: number; maxPrice: number; enabled: boolean }[];
  sortOptions: FilterOption[];
}
