import { Category, Product, Testimonial, InstagramPost, HomeSectionConfig, CollectionFilterConfig, BudgetTileConfig, TrustFeatureConfig } from '../types';

export interface StoreInfo {
  name: string;
  legalName: string | null;
  gstin: string | null;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  phoneFormatted: string;
  whatsappNumber: string;
  instagram: string;
  instagramUrl: string;
  instagramGlamifyUrl: string;
  email: string;
  grievanceOfficer: string | null;
  grievanceEmail: string | null;
  announcement: string;
  operatingHours: string;
  shippingFlatRate: number;
  freeShippingThreshold: number;
  currency: string;
  storeLocations: {
    id: string;
    name: string;
    address: string;
    phone: string;
    hours: string;
    mapUrl: string;
  }[];
}

export const STORE_INFO: StoreInfo = {
  name: 'The Western Store',
  // [OWNER: Provide exact legal registered business name matching bank / PAN / GST]
  legalName: null,
  // [OWNER: Provide 15-digit GSTIN or confirm business is currently unregistered]
  gstin: null,
  tagline: 'Kurukshetra\u2019s Premier Ethnic & Western Wardrobe',
  address: 'Opp. Hotel Pearl Marc, Railway Road, near Ujjivan Bank',
  city: 'Kurukshetra',
  state: 'Haryana',
  pincode: '136118',
  country: 'India',
  phone: '9729515288',
  phoneFormatted: '+91 97295 15288',
  whatsappNumber: '919729515288',
  instagram: '@the_western_store_kkr',
  instagramUrl: 'https://instagram.com/the_western_store_kkr',
  instagramGlamifyUrl: 'https://www.instagram.com/the_western_store_glamify?stkn=ZDNlZDc0MzIxNw==',
  email: 'thewesternstorekkr@gmail.com',
  // [OWNER: Provide designated Grievance Officer name under Consumer Protection Rules, 2020]
  grievanceOfficer: null,
  // [OWNER: Provide designated Grievance Officer email address]
  grievanceEmail: null,
  announcement: '🚚 Fast Pan-India Dispatch | 📲 WhatsApp Concierge: +91 97295 15288',
  operatingHours: '10:30 AM \u2013 9:00 PM (Mon-Sun)',
  shippingFlatRate: 0,
  freeShippingThreshold: 0,
  currency: 'INR',
  storeLocations: [
    {
      id: 'loc-1',
      name: 'Kurukshetra (Flagship Store)',
      address: 'Opp. Hotel Pearl Marc, Railway Road, near Ujjivan Bank, Kurukshetra - 136118, Haryana',
      phone: '+91 97295 15288',
      hours: '10:30 AM \u2013 9:00 PM',
      mapUrl: 'https://maps.google.com/?q=The+Western+Store+Kurukshetra',
    },
  ],
};

export const INITIAL_CATEGORIES: Category[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_TESTIMONIALS: Testimonial[] = [];

export const INITIAL_INSTAGRAM_POSTS: InstagramPost[] = [];

export const INITIAL_BUDGET_TILES: BudgetTileConfig[] = [
  {
    tier: 'under_999',
    title: 'Under ₹999',
    priceLabel: 'Under ₹999',
    subtitle: 'Daily & Casual Wear',
    itemsPreview: 'Kurtis, Tops & Everyday Separates',
    image: '',
    badge: 'Starting ₹499',
  },
  {
    tier: 'under_1499',
    title: '₹999 – ₹1,499',
    priceLabel: '₹999 – ₹1,499',
    subtitle: 'Workwear & Co-Ords',
    itemsPreview: 'Chic Co-Ords & Office Drapes',
    image: '',
    badge: 'Popular Choice',
  },
  {
    tier: 'under_1999',
    title: '₹1,499 – ₹1,999',
    priceLabel: '₹1,499 – ₹1,999',
    subtitle: 'Festive & Party Wear',
    itemsPreview: 'Anarkalis & Embellished Suits',
    image: '',
    badge: 'Festive Edit',
  },
  {
    tier: 'premium',
    title: 'Above ₹2,000',
    priceLabel: 'Above ₹2,000',
    subtitle: 'Luxury & Heritage',
    itemsPreview: 'Handloom Silks & Bridal Sets',
    image: '',
    badge: 'Exclusive Craft',
  },
];

export const INITIAL_TRUST_FEATURES: TrustFeatureConfig[] = [
  {
    id: 'tf-1',
    title: 'PAN-INDIA DISPATCH',
    description: 'Tracked courier delivery across all Indian pin codes',
    iconType: 'truck',
  },
  {
    id: 'tf-2',
    title: 'AUTHENTIC QUALITY',
    description: 'Handpicked textiles & artisan embroidery',
    iconType: 'shield',
  },
  {
    id: 'tf-3',
    title: 'DIRECT WHATSAPP SUPPORT',
    description: 'Live size & styling assistance before purchase',
    iconType: 'whatsapp',
  },
  {
    id: 'tf-4',
    title: 'TRANSPARENT VALUE',
    description: 'All prices in INR with zero hidden checkout fees',
    iconType: 'wallet',
  },
];

export const INITIAL_HOME_SECTIONS: HomeSectionConfig[] = [
  { id: 'sec-hero', title: 'Hero Carousel', type: 'hero', enabled: true, order: 1, images: [] },
  { id: 'sec-new', title: 'New Arrivals', type: 'new-arrivals', tagline: 'Fresh Off The Loom', subtitle: 'Curated seasonal drapes & co-ords', enabled: true, order: 2, images: [] },
  { id: 'sec-budget', title: 'Shop By Budget', type: 'budget-edit', enabled: true, order: 3, images: [] },
  { id: 'sec-bestsellers', title: 'Best Sellers', type: 'best-sellers', tagline: 'Most Loved in Kurukshetra', subtitle: 'Customer favorites repeatedly restocked', enabled: true, order: 4, images: [] },
  { id: 'sec-trust', title: 'Trust Features', type: 'trust-strip', enabled: true, order: 5, images: [] },
  { id: 'sec-instagram', title: 'Instagram Community', type: 'instagram', enabled: true, order: 6, images: [] },
];

export const INITIAL_COLLECTION_FILTERS: CollectionFilterConfig = {
  fabrics: [
    { id: 'f-cotton', label: 'Pure Cotton', value: 'Cotton', enabled: true },
    { id: 'f-georgette', label: 'Georgette', value: 'Georgette', enabled: true },
    { id: 'f-chanderi', label: 'Chanderi Silk', value: 'Chanderi', enabled: true },
    { id: 'f-rayon', label: 'Rayon / Viscose', value: 'Rayon', enabled: true },
    { id: 'f-silk', label: 'Silk Blend', value: 'Silk', enabled: true },
    { id: 'f-organza', label: 'Organza', value: 'Organza', enabled: true },
  ],
  occasions: [
    { id: 'o-casual', label: 'Casual & Daily Wear', value: 'Casual', enabled: true },
    { id: 'o-festive', label: 'Festive & Puja', value: 'Festive', enabled: true },
    { id: 'o-party', label: 'Party & Evening', value: 'Party', enabled: true },
    { id: 'o-wedding', label: 'Wedding & Sangeet', value: 'Wedding', enabled: true },
    { id: 'o-work', label: 'Work / Office', value: 'Office', enabled: true },
  ],
  sizes: [
    { id: 's-free', label: 'Free Size', value: 'Free Size', enabled: true },
    { id: 's-xs', label: 'XS (34)', value: 'XS', enabled: true },
    { id: 's-s', label: 'S (36)', value: 'S', enabled: true },
    { id: 's-m', label: 'M (38)', value: 'M', enabled: true },
    { id: 's-l', label: 'L (40)', value: 'L', enabled: true },
    { id: 's-xl', label: 'XL (42)', value: 'XL', enabled: true },
    { id: 's-xxl', label: 'XXL (44)', value: 'XXL', enabled: true },
  ],
  colors: [
    { id: 'c-red', name: 'Ruby Red', enabled: true },
    { id: 'c-pink', name: 'Rose Pink', enabled: true },
    { id: 'c-green', name: 'Emerald Green', enabled: true },
    { id: 'c-blue', name: 'Royal Blue', enabled: true },
    { id: 'c-yellow', name: 'Mustard Gold', enabled: true },
    { id: 'c-black', name: 'Classic Black', enabled: true },
    { id: 'c-white', name: 'Ivory / White', enabled: true },
  ],
  budgetTiers: [
    { id: 'b-under999', label: 'Under ₹999', minPrice: 0, maxPrice: 999, enabled: true },
    { id: 'b-999-1499', label: '₹999 – ₹1,499', minPrice: 999, maxPrice: 1499, enabled: true },
    { id: 'b-1499-2499', label: '₹1,499 – ₹2,499', minPrice: 1499, maxPrice: 2499, enabled: true },
    { id: 'b-above2499', label: 'Above ₹2,499', minPrice: 2499, maxPrice: 99999, enabled: true },
  ],
  sortOptions: [
    { id: 'sort-featured', label: 'Featured & Trending', value: 'featured', enabled: true },
    { id: 'sort-newest', label: 'Newest Arrivals', value: 'newest', enabled: true },
    { id: 'sort-low-high', label: 'Price: Low to High', value: 'price_asc', enabled: true },
    { id: 'sort-high-low', label: 'Price: High to Low', value: 'price_desc', enabled: true },
  ],
};
