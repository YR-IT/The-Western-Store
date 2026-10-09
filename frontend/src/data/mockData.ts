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

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Priya Sharma',
    location: 'Kurukshetra, Haryana',
    rating: 5,
    comment: 'Absolutely stunning anarkali! The fabric quality is exceptional and the embroidery is so intricate. Wore it to my cousin\'s wedding and received so many compliments. The stitching was perfect and it fit like a dream.',
    date: 'October 2026',
    outfitPurchased: 'Festive Anarkali Suit',
    verified: true,
    helpfulCount: 24,
    tag: 'Wedding Drape',
  },
  {
    id: 'rev-2',
    name: 'Meera Gupta',
    location: 'Delhi',
    rating: 5,
    comment: 'Ordered a co-ord set online and it arrived in 2 days! The color is exactly as shown in the photos — no surprises. Fabric is super comfortable for daily wear. Will definitely order more.',
    date: 'September 2026',
    outfitPurchased: 'Printed Co-Ord Set',
    verified: true,
    helpfulCount: 18,
    tag: 'Western Wear',
  },
  {
    id: 'rev-3',
    name: 'Anjali Verma',
    location: 'Ambala, Haryana',
    rating: 5,
    comment: 'The chanderi silk dupatta I bought is just gorgeous. The golden border catches the light beautifully. Packaging was also very neat and gift-ready. Great boutique experience!',
    date: 'October 2026',
    outfitPurchased: 'Chanderi Silk Dupatta',
    verified: true,
    helpfulCount: 12,
    tag: 'Ethnic Elegance',
  },
  {
    id: 'rev-4',
    name: 'Nidhi Arora',
    location: 'Panipat, Haryana',
    rating: 5,
    comment: 'Got a beautiful kurti set under ₹999 and honestly couldn\'t believe the quality. The cotton is so breathable for summer. This is my go-to shop now for budget-friendly ethnic wear.',
    date: 'August 2026',
    outfitPurchased: 'Printed Cotton Kurti Set',
    verified: true,
    helpfulCount: 31,
    tag: 'Budget Edit',
  },
  {
    id: 'rev-5',
    name: 'Simran Kaur',
    location: 'Patiala, Punjab',
    rating: 5,
    comment: 'The lehenga choli is absolutely breathtaking! It arrived beautifully packed and the quality matches every luxury boutique I\'ve visited. Wore it for Navratri and felt like a queen.',
    date: 'October 2026',
    outfitPurchased: 'Navratri Lehenga Choli',
    verified: true,
    helpfulCount: 42,
    tag: 'Wedding Drape',
  },
  {
    id: 'rev-6',
    name: 'Riya Bansal',
    location: 'Rohtak, Haryana',
    rating: 5,
    comment: 'Visited the store and the staff was so helpful with styling advice. Tried on multiple suits and they patiently helped me pick what suits my body type. Left with 3 outfits — all perfect!',
    date: 'September 2026',
    outfitPurchased: 'Salwar Suit Collection',
    verified: true,
    helpfulCount: 15,
    tag: 'Boutique Finish',
  },
  {
    id: 'rev-7',
    name: 'Kavya Reddy',
    location: 'Hyderabad, Telangana',
    rating: 5,
    comment: 'Placed an order from Hyderabad and it reached in 4 days — perfectly packed with no damage. The georgette saree drapes so elegantly. Exceeded my expectations completely!',
    date: 'September 2026',
    outfitPurchased: 'Georgette Embroidered Saree',
    verified: true,
    helpfulCount: 27,
    tag: 'Ethnic Elegance',
  },
  {
    id: 'rev-8',
    name: 'Tanishka Joshi',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    comment: 'The printed maxi dress I ordered is so chic and comfortable. Perfect for college events and outings. The Western Store really lives up to its name for stylish western wear at great prices.',
    date: 'August 2026',
    outfitPurchased: 'Floral Maxi Dress',
    verified: true,
    helpfulCount: 19,
    tag: 'Campus Style',
  },
];

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
  { id: 'sec-testimonials', title: 'Customer Stories & Reviews', type: 'testimonials', tagline: 'Voices of Kurukshetra', subtitle: 'Honest reflections and style stories from over 10,000 discerning patrons across Haryana and worldwide.', enabled: true, order: 6, images: [] },
  { id: 'sec-instagram', title: 'Instagram Community', type: 'instagram', enabled: true, order: 7, images: [] },
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
