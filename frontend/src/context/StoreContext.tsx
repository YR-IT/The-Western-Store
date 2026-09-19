import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  fetchProductsFromSupabase,
  fetchCategoriesFromSupabase,
  fetchOrdersFromSupabase,
  syncCartToSupabase,
  syncWishlistToSupabase,
  saveOrderToSupabase,
  deleteOrderFromSupabase,
  upsertProductToSupabase,
  deleteProductFromSupabase,
  upsertCategoryToSupabase,
  deleteCategoryFromSupabase,
  fetchStoreSettingsFromSupabase,
  saveStoreSettingToSupabase,
} from '../lib/supabaseServices';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  ProductCategory,
  BudgetTier,
  HeroSlide,
  OrderTrackingUpdate,
  UserAccount,
  HomeSectionConfig,
  CollectionFilterConfig,
  BudgetTileConfig,
  TrustFeatureConfig,
  Testimonial,
  InstagramPost,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_HERO_SLIDES,
  INITIAL_HOME_SECTIONS,
  INITIAL_COLLECTION_FILTERS,
  INITIAL_BUDGET_TILES,
  INITIAL_TRUST_FEATURES,
  INITIAL_TESTIMONIALS,
  INITIAL_INSTAGRAM_POSTS,
  STORE_INFO,
} from '../data/mockData';

interface CheckoutFormData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  notes?: string;
}

interface StoreContextType {
  // Navigation
  view: 'home' | 'plp' | 'pdp' | 'cart' | 'wishlist' | 'admin' | 'track-order' | 'order-history' | 'contact';
  currentView: 'home' | 'plp' | 'pdp' | 'cart' | 'wishlist' | 'admin' | 'track-order' | 'order-history' | 'contact';
  setView: (view: 'home' | 'plp' | 'pdp' | 'cart' | 'wishlist' | 'admin' | 'track-order' | 'order-history' | 'contact') => void;
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (category: ProductCategory | 'All') => void;
  selectedBudgetTier: BudgetTier | 'all';
  setSelectedBudgetTier: (tier: BudgetTier | 'all') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  adminActiveTab: 'dashboard' | 'orders' | 'products' | 'categories' | 'homepage' | 'sections' | 'filters';
  setAdminActiveTab: (tab: 'dashboard' | 'orders' | 'products' | 'categories' | 'homepage' | 'sections' | 'filters') => void;

  // Catalog
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  deleteHeroSlide: (id: string) => void;
  resetHeroSlides: () => void;

  announcementText: string;
  setAnnouncementText: (text: string) => void;

  budgetTiles: BudgetTileConfig[];
  updateBudgetTile: (tier: BudgetTier, updates: Partial<BudgetTileConfig>) => void;
  resetBudgetTiles: () => void;

  trustFeatures: TrustFeatureConfig[];
  updateTrustFeature: (id: string, updates: Partial<TrustFeatureConfig>) => void;
  resetTrustFeatures: () => void;

  testimonials: Testimonial[];
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'date'>) => void;
  deleteTestimonial: (id: string) => void;
  resetTestimonials: () => void;

  instagramPosts: InstagramPost[];
  updateInstagramPost: (id: string, updates: Partial<InstagramPost>) => void;
  addInstagramPost: (post: Omit<InstagramPost, 'id'>) => void;
  deleteInstagramPost: (id: string) => void;
  reorderInstagramPosts: (id: string, direction: 'up' | 'down') => void;
  resetInstagramPosts: () => void;
  instagramHandle: string;
  setInstagramHandle: (handle: string) => void;

  // Dynamic Homepage Sections & Photos
  homeSections: HomeSectionConfig[];
  updateHomeSection: (id: string, updates: Partial<HomeSectionConfig>) => void;
  addHomeSection: (section: Omit<HomeSectionConfig, 'id' | 'order'>) => void;
  deleteHomeSection: (id: string) => void;
  reorderHomeSections: (id: string, direction: 'up' | 'down') => void;
  resetHomeSections: () => void;

  // Collection Filters Management
  collectionFilters: CollectionFilterConfig;
  updateCollectionFilters: (updates: Partial<CollectionFilterConfig>) => void;
  resetCollectionFilters: () => void;

  // Modals & Drawers
  currentUser: UserAccount | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'customer' | 'admin';
  setAuthModalMode: (mode: 'customer' | 'admin') => void;
  authModalMessage: string;
  loginWithGoogle: (userInfo?: Partial<UserAccount>) => void;
  loginAsAdmin: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  openAuthModal: (mode?: 'customer' | 'admin', message?: string) => void;

  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSizeChartOpen: boolean;
  setIsSizeChartOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Admin
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderTracking: (orderId: string, tracking: OrderTrackingUpdate) => void;
  deleteOrder: (id: string) => void;
  submitWhatsAppOrder: (formData: CheckoutFormData) => { order: Order; waUrl: string };

  // Admin Catalog Management
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStockStatus: (productId: string) => void;
  resetProductsToDefault: () => void;

  // Category Management
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (newCategories: Category[]) => void;
  resetCategoriesToDefault: () => void;

  // Helper navigation actions
  navigateToCategory: (category: ProductCategory) => void;
  navigateToBudget: (tier: BudgetTier) => void;
  navigateToProduct: (productId: string) => void;
  openOrderTracking: (orderNumber?: string, phone?: string) => void;
  trackingPrefill: { orderNumber: string; phone: string } | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [view, setView] = useState<'home' | 'plp' | 'pdp' | 'cart' | 'wishlist' | 'admin' | 'track-order' | 'order-history' | 'contact'>(
    () => (localStorage.getItem('tws_view') as any) || 'home'
  );
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(
    () => (localStorage.getItem('tws_selected_category') as ProductCategory | 'All') || 'All'
  );
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<BudgetTier | 'all'>(
    () => (localStorage.getItem('tws_selected_budget_tier') as BudgetTier | 'all') || 'all'
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    () => localStorage.getItem('tws_selected_product_id') || null
  );
  const [adminActiveTab, setAdminActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories' | 'homepage' | 'sections' | 'filters'>(
    () => (localStorage.getItem('tws_admin_active_tab') as any) || 'dashboard'
  );
  const [trackingPrefill, setTrackingPrefill] = useState<{ orderNumber: string; phone: string } | null>(null);

  // Sync Navigation State to localStorage
  useEffect(() => {
    localStorage.setItem('tws_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('tws_selected_category', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('tws_selected_budget_tier', selectedBudgetTier);
  }, [selectedBudgetTier]);

  useEffect(() => {
    if (selectedProductId) {
      localStorage.setItem('tws_selected_product_id', selectedProductId);
    } else {
      localStorage.removeItem('tws_selected_product_id');
    }
  }, [selectedProductId]);

  useEffect(() => {
    localStorage.setItem('tws_admin_active_tab', adminActiveTab);
  }, [adminActiveTab]);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tws_products_v4');
    const deletedIds = new Set<string>(JSON.parse(localStorage.getItem('tws_deleted_product_ids') || '[]'));
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p) => p && !deletedIds.has(p.id));
        }
      } catch {}
    }
    return INITIAL_PRODUCTS.filter((p) => p && !deletedIds.has(p.id));
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('tws_categories_v4');
    const deletedIds = new Set<string>(JSON.parse(localStorage.getItem('tws_deleted_category_ids') || '[]'));
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((c) => c && !deletedIds.has(c.id));
        }
      } catch {}
    }
    return INITIAL_CATEGORIES.filter((c) => c && !deletedIds.has(c.id));
  });
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('tws_hero_slides');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_HERO_SLIDES;
  });

  const [announcementText, setAnnouncementText] = useState<string>(() => {
    return localStorage.getItem('tws_announcement') || STORE_INFO.announcement;
  });

  const [budgetTiles, setBudgetTiles] = useState<BudgetTileConfig[]>(() => {
    const saved = localStorage.getItem('tws_budget_tiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_BUDGET_TILES;
  });

  const [trustFeatures, setTrustFeatures] = useState<TrustFeatureConfig[]>(() => {
    const saved = localStorage.getItem('tws_trust_features');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_TRUST_FEATURES;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('tws_customer_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_TESTIMONIALS;
  });

  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>(() => {
    const saved = localStorage.getItem('tws_instagram_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_INSTAGRAM_POSTS;
  });

  const [instagramHandle, setInstagramHandle] = useState<string>(() => {
    return localStorage.getItem('tws_instagram_handle') || STORE_INFO.instagram;
  });

  // Home Sections State
  const [homeSections, setHomeSections] = useState<HomeSectionConfig[]>(() => {
    const saved = localStorage.getItem('tws_home_sections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_HOME_SECTIONS;
      }
    }
    return INITIAL_HOME_SECTIONS;
  });

  // Collection Filters State
  const [collectionFilters, setCollectionFilters] = useState<CollectionFilterConfig>(() => {
    const saved = localStorage.getItem('tws_collection_filters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          fabrics: parsed.fabrics || INITIAL_COLLECTION_FILTERS.fabrics,
          occasions: parsed.occasions || INITIAL_COLLECTION_FILTERS.occasions,
          sizes: parsed.sizes || INITIAL_COLLECTION_FILTERS.sizes,
          colors: parsed.colors || INITIAL_COLLECTION_FILTERS.colors,
          budgetTiers: parsed.budgetTiers || INITIAL_COLLECTION_FILTERS.budgetTiers,
          sortOptions: parsed.sortOptions || INITIAL_COLLECTION_FILTERS.sortOptions,
        };
      } catch {
        return INITIAL_COLLECTION_FILTERS;
      }
    }
    return INITIAL_COLLECTION_FILTERS;
  });

  const isInitialSettingsSyncDone = useRef(false);

  useEffect(() => {
    localStorage.setItem('tws_hero_slides', JSON.stringify(heroSlides));
    if (isInitialSettingsSyncDone.current && isSupabaseConfigured()) {
      saveStoreSettingToSupabase('hero_slides', heroSlides).catch(() => {});
    }
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem('tws_announcement', announcementText);
    if (isInitialSettingsSyncDone.current && isSupabaseConfigured()) {
      saveStoreSettingToSupabase('announcement_text', announcementText).catch(() => {});
    }
  }, [announcementText]);

  useEffect(() => {
    localStorage.setItem('tws_budget_tiles', JSON.stringify(budgetTiles));
    if (isInitialSettingsSyncDone.current && isSupabaseConfigured()) {
      saveStoreSettingToSupabase('budget_tiles', budgetTiles).catch(() => {});
    }
  }, [budgetTiles]);

  useEffect(() => {
    localStorage.setItem('tws_trust_features', JSON.stringify(trustFeatures));
    if (isInitialSettingsSyncDone.current && isSupabaseConfigured()) {
      saveStoreSettingToSupabase('trust_features', trustFeatures).catch(() => {});
    }
  }, [trustFeatures]);

  useEffect(() => {
    localStorage.setItem('tws_customer_reviews', JSON.stringify(testimonials));
    if (isInitialSettingsSyncDone.current && isSupabaseConfigured()) {
      saveStoreSettingToSupabase('testimonials', testimonials).catch(() => {});
    }
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('tws_instagram_posts', JSON.stringify(instagramPosts));
    if (isInitialSettingsSyncDone.current && isSupabaseConfigured()) {
      saveStoreSettingToSupabase('instagram_posts', instagramPosts).catch(() => {});
    }
  }, [instagramPosts]);

  useEffect(() => {
    localStorage.setItem('tws_instagram_handle', instagramHandle);
    if (isInitialSettingsSyncDone.current && isSupabaseConfigured()) {
      saveStoreSettingToSupabase('instagram_handle', instagramHandle).catch(() => {});
    }
  }, [instagramHandle]);

  useEffect(() => {
    localStorage.setItem('tws_home_sections', JSON.stringify(homeSections));
    if (isInitialSettingsSyncDone.current && isSupabaseConfigured()) {
      saveStoreSettingToSupabase('home_sections', homeSections).catch(() => {});
    }
  }, [homeSections]);

  useEffect(() => {
    localStorage.setItem('tws_collection_filters', JSON.stringify(collectionFilters));
    if (isInitialSettingsSyncDone.current && isSupabaseConfigured()) {
      saveStoreSettingToSupabase('collection_filters', collectionFilters).catch(() => {});
    }
  }, [collectionFilters]);

  const updateHomeSection = (id: string, updates: Partial<HomeSectionConfig>) => {
    setHomeSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec))
    );
  };

  const addHomeSection = (section: Omit<HomeSectionConfig, 'id' | 'order'>) => {
    const newId = `sec_${Date.now()}`;
    const newOrder = homeSections.length + 1;
    const newSec: HomeSectionConfig = {
      ...section,
      id: newId,
      order: newOrder,
    };
    setHomeSections((prev) => [...prev, newSec]);
  };

  const deleteHomeSection = (id: string) => {
    setHomeSections((prev) => prev.filter((sec) => sec.id !== id));
  };

  const reorderHomeSections = (id: string, direction: 'up' | 'down') => {
    setHomeSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;

      return copy.map((sec, i) => ({ ...sec, order: i + 1 }));
    });
  };

  const resetHomeSections = () => {
    setHomeSections(INITIAL_HOME_SECTIONS);
    localStorage.removeItem('tws_home_sections');
  };

  const updateCollectionFilters = (updates: Partial<CollectionFilterConfig>) => {
    setCollectionFilters((prev) => ({ ...prev, ...updates }));
  };

  const resetCollectionFilters = () => {
    setCollectionFilters(INITIAL_COLLECTION_FILTERS);
    localStorage.removeItem('tws_collection_filters');
  };

  const updateHeroSlide = (id: string, updates: Partial<HeroSlide>) => {
    setHeroSlides((prev) => prev.map((slide) => (slide.id === id ? { ...slide, ...updates } : slide)));
  };

  const addHeroSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = { ...slide, id: `slide_${Date.now()}` };
    setHeroSlides((prev) => [...prev, newSlide]);
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((slide) => slide.id !== id));
  };

  const resetHeroSlides = () => {
    setHeroSlides(INITIAL_HERO_SLIDES);
    localStorage.removeItem('tws_hero_slides');
  };

  const updateBudgetTile = (tier: BudgetTier, updates: Partial<BudgetTileConfig>) => {
    setBudgetTiles((prev) => prev.map((bt) => (bt.tier === tier ? { ...bt, ...updates } : bt)));
  };

  const resetBudgetTiles = () => {
    setBudgetTiles(INITIAL_BUDGET_TILES);
    localStorage.removeItem('tws_budget_tiles');
  };

  const updateTrustFeature = (id: string, updates: Partial<TrustFeatureConfig>) => {
    setTrustFeatures((prev) => prev.map((tf) => (tf.id === id ? { ...tf, ...updates } : tf)));
  };

  const resetTrustFeatures = () => {
    setTrustFeatures(INITIAL_TRUST_FEATURES);
    localStorage.removeItem('tws_trust_features');
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const addTestimonial = (t: Omit<Testimonial, 'id' | 'date'>) => {
    const newReview: Testimonial = {
      ...t,
      id: `rev_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    setTestimonials((prev) => [newReview, ...prev]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const resetTestimonials = () => {
    setTestimonials(INITIAL_TESTIMONIALS);
    localStorage.removeItem('tws_customer_reviews');
  };

  const updateInstagramPost = (id: string, updates: Partial<InstagramPost>) => {
    setInstagramPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addInstagramPost = (post: Omit<InstagramPost, 'id'>) => {
    const newPost: InstagramPost = { ...post, id: `ig_${Date.now()}` };
    setInstagramPosts((prev) => [...prev, newPost]);
  };

  const deleteInstagramPost = (id: string) => {
    setInstagramPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const reorderInstagramPosts = (id: string, direction: 'up' | 'down') => {
    setInstagramPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const resetInstagramPosts = () => {
    setInstagramPosts(INITIAL_INSTAGRAM_POSTS);
    localStorage.removeItem('tws_instagram_posts');
  };

  // Orders (Starts completely empty for live production use)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tws_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((o: Order) => o && o.id && o.orderNumber && !['order-1001', 'order-1002'].includes(o.id));
        }
      } catch {
        return [];
      }
    }
    return [];
  });

  // Active User & Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('tws_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'customer' | 'admin'>('customer');
  const [authModalMessage, setAuthModalMessage] = useState('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedUserStr = localStorage.getItem('tws_active_user');
    if (savedUserStr) {
      try {
        const u = JSON.parse(savedUserStr);
        const userCart = localStorage.getItem(`tws_cart_${u.id}`);
        if (userCart) return JSON.parse(userCart);
      } catch {
        // fallback
      }
    }
    const saved = localStorage.getItem('tws_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Wishlist (Starts completely empty until user adds items)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('tws_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Initial Fetch from Supabase (if configured)
  // Initial Fetch & Realtime Subscriptions from Supabase (if configured)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    fetchProductsFromSupabase().then((remoteProducts) => {
      if (remoteProducts !== null) {
        const deletedIds = new Set<string>(JSON.parse(localStorage.getItem('tws_deleted_product_ids') || '[]'));
        setProducts(remoteProducts.filter((p) => p && !deletedIds.has(p.id)));
      }
    });

    fetchCategoriesFromSupabase().then((remoteCategories) => {
      if (remoteCategories !== null) {
        const deletedIds = new Set<string>(JSON.parse(localStorage.getItem('tws_deleted_category_ids') || '[]'));
        setCategories(remoteCategories.filter((c) => c && !deletedIds.has(c.id)));
      }
    });

    const syncOrders = async () => {
      try {
        const fetchedOrders: Order[] = [];
        let hasRemoteData = false;

        // 1. Try Supabase
        const remoteOrders = await fetchOrdersFromSupabase();
        if (remoteOrders !== null && remoteOrders.length > 0) {
          fetchedOrders.push(...remoteOrders);
          hasRemoteData = true;
        }

        // 2. Fetch from backend API
        try {
          const backendUrl = ((import.meta as any).env?.VITE_BACKEND_URL) || 'http://localhost:4000';
          const res = await fetch(`${backendUrl}/api/orders`);
          if (res.ok) {
            const apiOrders = await res.json();
            if (Array.isArray(apiOrders) && apiOrders.length > 0) {
              const mappedOrders: Order[] = apiOrders.map((row: any) => ({
                id: row.id,
                orderNumber: row.order_number || row.orderNumber || row.id,
                createdAt: row.created_at || row.createdAt || new Date().toISOString(),
                customerName: row.customer_name || row.customerName || 'Customer',
                phone: row.customer_phone || row.phone || '',
                email: row.customer_email || row.email || undefined,
                address: row.shipping_address?.address || row.address || '',
                pincode: row.shipping_address?.pincode || row.pincode || '',
                city: row.shipping_address?.city || row.city || '',
                state: row.shipping_address?.state || row.state || '',
                notes: row.notes || row.shipping_address?.notes || undefined,
                items: Array.isArray(row.items) ? row.items : [],
                subtotal: Number(row.total_amount ?? row.subtotal ?? row.total ?? 0),
                shippingFee: 0,
                total: Number(row.total_amount ?? row.total ?? row.subtotal ?? 0),
                status: (row.status as OrderStatus) || 'Pending WhatsApp',
                courierName: row.courier_name || row.courierName || undefined,
                trackingNumber: row.tracking_number || row.trackingNumber || undefined,
                trackingLink: row.tracking_number || row.trackingNumber
                  ? `https://delhivery.com/track/package/${row.tracking_number || row.trackingNumber}`
                  : (row.tracking_link || row.trackingLink || undefined),
                userId: row.user_id || row.userId || undefined,
              }));

              const existingIds = new Set(fetchedOrders.map((o) => o.id));
              for (const o of mappedOrders) {
                if (!existingIds.has(o.id)) {
                  fetchedOrders.push(o);
                  existingIds.add(o.id);
                }
              }
              hasRemoteData = true;
            }
          }
        } catch (backendErr) {
          console.warn('[Backend Orders Sync Notice]', backendErr);
        }

        // 3. Merge with current local state / storage so local orders are never accidentally lost
        setOrders((prev) => {
          const map = new Map<string, Order>();
          fetchedOrders.forEach((o) => {
            if (o && o.id) map.set(o.id, o);
          });
          prev.forEach((o) => {
            if (o && o.id) {
              if (!map.has(o.id)) {
                map.set(o.id, o);
              } else {
                const existing = map.get(o.id)!;
                map.set(o.id, {
                  ...existing,
                  ...o,
                  status: o.status || existing.status,
                  trackingNumber: o.trackingNumber || existing.trackingNumber,
                  courierName: o.courierName || existing.courierName,
                  trackingLink: o.trackingLink || existing.trackingLink,
                });
              }
            }
          });

          const merged = Array.from(map.values())
            .filter((o) => o && o.id && o.orderNumber && !['order-1001', 'order-1002'].includes(o.id))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          if (merged.length > 0 || hasRemoteData) {
            try {
              localStorage.setItem('tws_orders', JSON.stringify(merged));
            } catch {}
            return merged;
          }
          return prev;
        });
      } catch (err) {
        console.warn('[Orders Sync Notice]', err);
      }
    };
    syncOrders();

    fetchStoreSettingsFromSupabase().then((settings) => {
      if (settings && Object.keys(settings).length > 0) {
        if (settings.instagram_posts && Array.isArray(settings.instagram_posts) && settings.instagram_posts.length > 0) {
          setInstagramPosts(settings.instagram_posts);
          localStorage.setItem('tws_instagram_posts', JSON.stringify(settings.instagram_posts));
        }
        if (settings.hero_slides && Array.isArray(settings.hero_slides) && settings.hero_slides.length > 0) {
          setHeroSlides(settings.hero_slides);
          localStorage.setItem('tws_hero_slides', JSON.stringify(settings.hero_slides));
        }
        if (settings.testimonials && Array.isArray(settings.testimonials) && settings.testimonials.length > 0) {
          setTestimonials(settings.testimonials);
          localStorage.setItem('tws_customer_reviews', JSON.stringify(settings.testimonials));
        }
        if (settings.home_sections && Array.isArray(settings.home_sections) && settings.home_sections.length > 0) {
          setHomeSections(settings.home_sections);
          localStorage.setItem('tws_home_sections', JSON.stringify(settings.home_sections));
        }
        if (settings.budget_tiles && Array.isArray(settings.budget_tiles) && settings.budget_tiles.length > 0) {
          setBudgetTiles(settings.budget_tiles);
          localStorage.setItem('tws_budget_tiles', JSON.stringify(settings.budget_tiles));
        }
        if (settings.trust_features && Array.isArray(settings.trust_features) && settings.trust_features.length > 0) {
          setTrustFeatures(settings.trust_features);
          localStorage.setItem('tws_trust_features', JSON.stringify(settings.trust_features));
        }
        if (settings.announcement_text !== undefined && typeof settings.announcement_text === 'string') {
          setAnnouncementText(settings.announcement_text);
          localStorage.setItem('tws_announcement', settings.announcement_text);
        }
        if (settings.instagram_handle && typeof settings.instagram_handle === 'string') {
          setInstagramHandle(settings.instagram_handle);
          localStorage.setItem('tws_instagram_handle', settings.instagram_handle);
        }
        if (settings.collection_filters && typeof settings.collection_filters === 'object') {
          setCollectionFilters(settings.collection_filters);
          localStorage.setItem('tws_collection_filters', JSON.stringify(settings.collection_filters));
        }
      } else if (settings && Object.keys(settings).length === 0 && isSupabaseConfigured()) {
        const currentHero = localStorage.getItem('tws_hero_slides');
        if (currentHero) {
          try {
            const parsed = JSON.parse(currentHero);
            if (Array.isArray(parsed) && parsed.length > 0) {
              saveStoreSettingToSupabase('hero_slides', parsed).catch(() => {});
            }
          } catch {}
        }
      }
      isInitialSettingsSyncDone.current = true;
    }).catch(() => {
      isInitialSettingsSyncDone.current = true;
    });

    if (supabase) {
      const ordersChannel = supabase
        .channel('public-orders-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          () => {
            fetchOrdersFromSupabase().then((remoteOrders) => {
              if (remoteOrders !== null && remoteOrders.length > 0) {
                setOrders((prev) => {
                  const map = new Map<string, Order>();
                  remoteOrders.forEach((o) => o && o.id && map.set(o.id, o));
                  prev.forEach((o) => {
                    if (o && o.id && !map.has(o.id)) map.set(o.id, o);
                  });
                  const merged = Array.from(map.values())
                    .filter((o) => o && o.id && o.orderNumber && !['order-1001', 'order-1002'].includes(o.id))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                  try {
                    localStorage.setItem('tws_orders', JSON.stringify(merged));
                  } catch {}
                  return merged;
                });
              }
            });
          }
        )
        .subscribe();

      const settingsChannel = supabase
        .channel('public-settings-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'store_settings' },
          (payload: any) => {
            const key = payload.new?.key;
            const val = payload.new?.value;
            if (!key || val === undefined) return;

            if (key === 'instagram_posts' && Array.isArray(val)) {
              setInstagramPosts(val);
              localStorage.setItem('tws_instagram_posts', JSON.stringify(val));
            } else if (key === 'hero_slides' && Array.isArray(val)) {
              setHeroSlides(val);
              localStorage.setItem('tws_hero_slides', JSON.stringify(val));
            } else if (key === 'testimonials' && Array.isArray(val)) {
              setTestimonials(val);
              localStorage.setItem('tws_customer_reviews', JSON.stringify(val));
            } else if (key === 'home_sections' && Array.isArray(val)) {
              setHomeSections(val);
              localStorage.setItem('tws_home_sections', JSON.stringify(val));
            } else if (key === 'budget_tiles' && Array.isArray(val)) {
              setBudgetTiles(val);
              localStorage.setItem('tws_budget_tiles', JSON.stringify(val));
            } else if (key === 'trust_features' && Array.isArray(val)) {
              setTrustFeatures(val);
              localStorage.setItem('tws_trust_features', JSON.stringify(val));
            } else if (key === 'announcement_text' && typeof val === 'string') {
              setAnnouncementText(val);
              localStorage.setItem('tws_announcement', val);
            } else if (key === 'instagram_handle' && typeof val === 'string') {
              setInstagramHandle(val);
              localStorage.setItem('tws_instagram_handle', val);
            } else if (key === 'collection_filters' && typeof val === 'object') {
              setCollectionFilters(val);
              localStorage.setItem('tws_collection_filters', JSON.stringify(val));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(ordersChannel);
        supabase.removeChannel(settingsChannel);
      };
    }
  }, []);

  // Sync state to localStorage & Supabase
  useEffect(() => {
    localStorage.setItem('tws_products_v4', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tws_categories_v4', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('tws_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tws_cart', JSON.stringify(cart));
    if (currentUser) {
      localStorage.setItem(`tws_cart_${currentUser.id}`, JSON.stringify(cart));
      syncCartToSupabase(currentUser.id, cart).catch(() => {});
    }
  }, [cart, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tws_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tws_active_user');
    }
  }, [currentUser]);

  // Real-time Supabase Auth Listener
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const userName = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Store Customer';
        setCurrentUser({
          id: session.user.id,
          name: userName,
          email: session.user.email || '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
          authProvider: 'google',
          isAdmin: false,
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const userName = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Store Customer';
        setCurrentUser({
          id: session.user.id,
          name: userName,
          email: session.user.email || '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
          authProvider: 'google',
          isAdmin: false,
        });
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCart([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth Methods
  const openAuthModal = (mode: 'customer' | 'admin' = 'customer', message = '') => {
    if (mode === 'admin' && currentUser?.isAdmin) {
      setView('admin');
      setAdminActiveTab('dashboard');
      setIsAuthModalOpen(false);
      return;
    }
    setAuthModalMode(mode);
    setAuthModalMessage(message);
    setIsAuthModalOpen(true);
  };

  const loginWithGoogle = (userInfo?: Partial<UserAccount>) => {
    if (!userInfo?.email) return;
    const newUser: UserAccount = {
      id: userInfo.id || `usr_${Date.now()}`,
      name: userInfo.name || userInfo.email.split('@')[0],
      email: userInfo.email,
      avatar: userInfo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userInfo.name || 'Customer')}`,
      authProvider: 'google',
      isAdmin: false,
    };
    setCurrentUser(newUser);

    const savedAccountCart = localStorage.getItem(`tws_cart_${newUser.id}`);
    if (savedAccountCart) {
      try {
        setCart(JSON.parse(savedAccountCart));
      } catch {
        // keep current
      }
    } else if (cart.length > 0) {
      localStorage.setItem(`tws_cart_${newUser.id}`, JSON.stringify(cart));
    }
  };

  const loginAsAdmin = async (email: string, pass: string): Promise<boolean> => {
    const backendUrl = ((import.meta as any).env?.VITE_BACKEND_URL) || 'http://localhost:4000';
    try {
      const res = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          if (data.adminSecret) {
            sessionStorage.setItem('tws_admin_secret', data.adminSecret);
          }
          setView('admin');
          setAdminActiveTab('dashboard');
          return true;
        }
      }
    } catch (err) {
      console.warn('[Admin Auth] Backend server request failed:', err);
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      localStorage.setItem(`tws_cart_${currentUser.id}`, JSON.stringify(cart));
    }
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentUser(null);
    setCart([]);
  };

  useEffect(() => {
    localStorage.setItem('tws_wishlist', JSON.stringify(wishlist));
    if (currentUser) {
      syncWishlistToSupabase(currentUser.id, wishlist).catch(() => {});
    }
  }, [wishlist, currentUser]);

  useEffect(() => {
    localStorage.setItem('tws_categories_v4', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('tws_announcement', announcementText);
  }, [announcementText]);

  // Cart Helpers
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setCart((prev) => {
      const itemKey = `${product.id}-${size}-${color}`;
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          productId: product.id,
          product,
          size,
          color,
          quantity,
          price: product.price,
        },
      ];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Helpers
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Navigation helpers
  const navigateToCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setSelectedBudgetTier('all');
    setView('plp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBudget = (tier: BudgetTier) => {
    setSelectedBudgetTier(tier);
    setSelectedCategory('All');
    setView('plp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Orders & Admin Stock Management
  const isConfirmedState = (s: OrderStatus) => ['Confirmed', 'Shipped', 'Paid', 'Delivered'].includes(s);
  const isPendingState = (s: OrderStatus) => ['Pending WhatsApp', 'Contacted'].includes(s);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      const oldStatus = targetOrder.status;

      // Deduct stock if Admin confirms/ships an order from pending state
      if (isPendingState(oldStatus) && isConfirmedState(status)) {
        setProducts((prevProducts) =>
          prevProducts.map((p) => {
            const item = targetOrder.items.find((i) => i.productId === p.id);
            if (!item) return p;
            const currentCount = p.inStockCount !== undefined ? p.inStockCount : 15;
            const newCount = Math.max(0, currentCount - item.quantity);
            return { ...p, inStockCount: newCount, isSoldOut: newCount === 0 };
          })
        );
      }
      // Restore stock if Admin cancels a confirmed order
      else if (isConfirmedState(oldStatus) && status === 'Cancelled') {
        setProducts((prevProducts) =>
          prevProducts.map((p) => {
            const item = targetOrder.items.find((i) => i.productId === p.id);
            if (!item) return p;
            const currentCount = p.inStockCount !== undefined ? p.inStockCount : 0;
            const newCount = currentCount + item.quantity;
            return { ...p, inStockCount: newCount, isSoldOut: false };
          })
        );
      }
    }

    setOrders((prev) => {
      const updatedList = prev.map((order) => {
        if (order.id !== orderId) return order;
        const updated = { ...order, status };
        saveOrderToSupabase(updated, updated.userId).catch(() => {});
        return updated;
      });
      try {
        localStorage.setItem('tws_orders', JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });

    const backendUrl = ((import.meta as any).env?.VITE_BACKEND_URL) || 'http://localhost:4000';
    fetch(`${backendUrl}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  const updateOrderTracking = (
    orderId: string,
    tracking: OrderTrackingUpdate
  ) => {
    setOrders((prev) => {
      const updatedList = prev.map((order) => {
        if (order.id !== orderId) return order;
        const updated: Order = {
          ...order,
          ...tracking,
          ...(tracking.status ? { status: tracking.status } : {}),
        };
        if (tracking.status) {
          updateOrderStatus(orderId, tracking.status);
        } else {
          saveOrderToSupabase(updated, updated.userId).catch(() => {});
        }
        return updated;
      });
      try {
        localStorage.setItem('tws_orders', JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });

    const backendUrl = ((import.meta as any).env?.VITE_BACKEND_URL) || 'http://localhost:4000';
    fetch(`${backendUrl}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courier_name: tracking.courierName,
        courierName: tracking.courierName,
        tracking_number: tracking.trackingNumber,
        trackingNumber: tracking.trackingNumber,
        tracking_link: tracking.trackingLink,
        trackingLink: tracking.trackingLink,
        status: tracking.status,
      }),
    }).catch(() => {});
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== id);
      try {
        localStorage.setItem('tws_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteOrderFromSupabase(id).catch((err) => console.warn('[Supabase] Delete order notice:', err));
    const backendUrl = ((import.meta as any).env?.VITE_BACKEND_URL) || 'http://localhost:4000';
    fetch(`${backendUrl}/api/orders/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const submitWhatsAppOrder = async (formData: CheckoutFormData) => {
    const backendUrl = ((import.meta as any).env?.VITE_BACKEND_URL) || 'http://localhost:4000';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    let orderNumber = `TWS-2026-${randomSuffix}`;
    let finalTotal = cartSubtotal;

    const validatedItems: OrderItemSummary[] = cart.map((item) => ({
      productId: item.productId,
      title: item.product.title,
      image: item.product.images?.[0] || '',
      size: item.size || item.product?.sizes?.[0] || 'Free Size',
      color: item.color && item.color !== 'Standard' ? item.color : '',
      quantity: item.quantity,
      price: item.price,
    }));

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id,
      userEmail: currentUser?.email || formData.email,
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      pincode: formData.pincode,
      city: formData.city,
      state: formData.state,
      notes: formData.notes,
      items: validatedItems,
      subtotal: cartSubtotal,
      shippingFee: 0,
      total: finalTotal,
      status: 'Pending WhatsApp' as OrderStatus,
      createdAt: new Date().toISOString(),
    };

    // 1. Immediately store order in local store state & localStorage & Supabase
    setOrders((prev) => {
      const updated = [newOrder, ...prev.filter((o) => o.id !== newOrder.id)];
      try {
        localStorage.setItem('tws_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setLastPlacedOrder(newOrder);

    try {
      saveOrderToSupabase(newOrder, currentUser?.id).catch((err) =>
        console.warn('[Supabase Order Insert Notice]', err)
      );
    } catch (err) {
      console.warn('[Supabase Order Call Notice]', err);
    }

    // 2. Send to backend API in background
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          userId: currentUser?.id,
          formData,
          items: validatedItems,
        }),
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const resData = await response.json();
        if (resData.orderNumber) orderNumber = resData.orderNumber;
        if (resData.total !== undefined && resData.total > 0) finalTotal = resData.total;
      }
    } catch (err) {
      console.warn('[Backend Order Notice] Running in direct frontend mode:', err);
    }

    // 3. Clear cart
    clearCart();

    // 4. Build formatted message for WhatsApp
    let message = `*NEW ORDER - THE WESTERN STORE, KURUKSHETRA*\n\n`;
    message += `*Order ID:* ${orderNumber}\n`;
    message += `*Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `• Name: ${formData.name}\n`;
    message += `• Phone: ${formData.phone}\n`;
    message += `• Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n`;
    if (formData.notes) {
      message += `• Note: ${formData.notes}\n`;
    }
    message += `\n👗 *Items Ordered:*\n`;
    validatedItems.forEach((item, index) => {
      message += `${index + 1}. *${item.title}*\n`;
      message += `   Size: ${item.size}${item.color ? ` | Color: ${item.color}` : ''}\n`;
      message += `   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${(item.quantity * item.price).toLocaleString('en-IN')}\n`;
    });
    message += `\n─────────────────────\n`;
    message += `*Total Amount:* ₹${finalTotal.toLocaleString('en-IN')}\n`;
    message += `*Shipping:* Free / Pan-India Delivery\n`;
    message += `*Status:* Pending WhatsApp Confirmation\n`;
    message += `─────────────────────\n\n`;
    message += `Hi The Western Store team! I have submitted this order on your website. Kindly confirm availability and share payment/QR details for dispatch from your Kurukshetra store. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodedMessage}`;

    return { order: newOrder, orderNumber, waUrl };
  };

  // Admin Catalog & Supabase DB Sync
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    try {
      const deleted: string[] = JSON.parse(localStorage.getItem('tws_deleted_product_ids') || '[]');
      if (deleted.includes(newProduct.id)) {
        localStorage.setItem('tws_deleted_product_ids', JSON.stringify(deleted.filter((id) => id !== newProduct.id)));
      }
    } catch {}

    setProducts((prev) => [newProduct, ...prev]);
    upsertProductToSupabase(newProduct).catch((err) => console.warn('[Supabase] Product sync notice:', err));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let updatedProduct: Product | undefined;
    setProducts((prev) => {
      const updatedProducts = prev.map((prod) => {
        if (prod.id === id) {
          updatedProduct = { ...prod, ...updates };
          return updatedProduct;
        }
        return prod;
      });
      localStorage.setItem('tws_products_v4', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
    if (updatedProduct) {
      upsertProductToSupabase(updatedProduct).catch((err) => console.warn('[Supabase] Product sync notice:', err));
    }
  };

  const deleteProduct = (id: string) => {
    try {
      const deleted: string[] = JSON.parse(localStorage.getItem('tws_deleted_product_ids') || '[]');
      if (!deleted.includes(id)) {
        deleted.push(id);
        localStorage.setItem('tws_deleted_product_ids', JSON.stringify(deleted));
      }
    } catch {}

    setProducts((prev) => {
      const updatedProducts = prev.filter((prod) => prod.id !== id);
      localStorage.setItem('tws_products_v4', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
    deleteProductFromSupabase(id).catch((err) => console.warn('[Supabase] Delete product notice:', err));
  };

  const toggleStockStatus = (productId: string) => {
    let updatedProduct: Product | undefined;
    setProducts((prev) => {
      const updatedProducts = prev.map((prod) => {
        if (prod.id === productId) {
          updatedProduct = {
            ...prod,
            isSoldOut: !prod.isSoldOut,
            inStockCount: !prod.isSoldOut ? 0 : 15,
          };
          return updatedProduct;
        }
        return prod;
      });
      localStorage.setItem('tws_products_v4', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
    if (updatedProduct) {
      upsertProductToSupabase(updatedProduct).catch((err) => console.warn('[Supabase] Stock status sync notice:', err));
    }
  };

  // Category Management & Supabase DB Sync
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const slug =
      categoryData.slug ||
      categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      slug,
      itemCount: categoryData.itemCount || 0,
    };
    try {
      const deleted: string[] = JSON.parse(localStorage.getItem('tws_deleted_category_ids') || '[]');
      if (deleted.includes(newCategory.id)) {
        localStorage.setItem('tws_deleted_category_ids', JSON.stringify(deleted.filter((id) => id !== newCategory.id)));
      }
    } catch {}

    setCategories((prev) => [...prev, newCategory]);
    upsertCategoryToSupabase(newCategory).catch((err) => console.warn('[Supabase] Category add notice:', err));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const existingCat = categories.find((c) => c.id === id);
    if (!existingCat) return;

    const oldName = existingCat.name;
    const newName = updates.name ? updates.name.trim() : oldName;

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === id) {
          const updated = { ...cat, ...updates };
          if (updates.name && !updates.slug) {
            updated.slug = updates.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '');
          }
          upsertCategoryToSupabase(updated).catch((err) => console.warn('[Supabase] Category update notice:', err));
          return updated;
        }
        return cat;
      })
    );
    // If category name was changed, sync products associated with old category name
    if (updates.name && updates.name !== oldName) {
      setProducts((prev) =>
        prev.map((prod) =>
          prod.category === oldName ? { ...prod, category: newName } : prod
        )
      );
      if (selectedCategory === oldName) {
        setSelectedCategory(newName);
      }
    }
  };

  const deleteCategory = (id: string) => {
    try {
      const deleted: string[] = JSON.parse(localStorage.getItem('tws_deleted_category_ids') || '[]');
      if (!deleted.includes(id)) {
        deleted.push(id);
        localStorage.setItem('tws_deleted_category_ids', JSON.stringify(deleted));
      }
    } catch {}

    const target = categories.find((c) => c.id === id);
    if (target && selectedCategory === target.name) {
      setSelectedCategory('All');
    }
    setCategories((prev) => {
      const updated = prev.filter((cat) => cat.id !== id);
      localStorage.setItem('tws_categories_v4', JSON.stringify(updated));
      return updated;
    });
    deleteCategoryFromSupabase(id).catch((err) => console.warn('[Supabase] Delete category notice:', err));
  };

  const reorderCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  const resetCategoriesToDefault = () => {
    setCategories(INITIAL_CATEGORIES);
    localStorage.removeItem('tws_categories_v4');
    localStorage.removeItem('tws_categories');
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('tws_products_v4');
    localStorage.removeItem('tws_products');
  };

  const openOrderTracking = (orderNumber?: string, phone?: string) => {
    if (orderNumber || phone) {
      setTrackingPrefill({ orderNumber: orderNumber || '', phone: phone || '' });
    }
    setView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreContext.Provider
      value={{
        view,
        currentView: view,
        setView,
        selectedCategory,
        setSelectedCategory,
        selectedBudgetTier,
        setSelectedBudgetTier,
        selectedProductId,
        setSelectedProductId,
        adminActiveTab,
        setAdminActiveTab,
        trackingPrefill,
        openOrderTracking,
        products,
        categories,
        heroSlides,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        resetHeroSlides,
        announcementText,
        setAnnouncementText,
        budgetTiles,
        updateBudgetTile,
        resetBudgetTiles,
        trustFeatures,
        updateTrustFeature,
        resetTrustFeatures,
        testimonials,
        updateTestimonial,
        addTestimonial,
        deleteTestimonial,
        resetTestimonials,
        instagramPosts,
        updateInstagramPost,
        addInstagramPost,
        deleteInstagramPost,
        reorderInstagramPosts,
        resetInstagramPosts,
        instagramHandle,
        setInstagramHandle,
        homeSections,
        updateHomeSection,
        addHomeSection,
        deleteHomeSection,
        reorderHomeSections,
        resetHomeSections,
        collectionFilters,
        updateCollectionFilters,
        resetCollectionFilters,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authModalMessage,
        loginWithGoogle,
        loginAsAdmin,
        logout,
        openAuthModal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCartOpen: isCartDrawerOpen,
        setIsCartOpen: setIsCartDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        quickViewProduct,
        setQuickViewProduct,
        isSizeChartOpen,
        setIsSizeChartOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        updateOrderStatus,
        updateOrderTracking,
        deleteOrder,
        submitWhatsAppOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStockStatus,
        resetProductsToDefault,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        resetCategoriesToDefault,
        navigateToCategory,
        navigateToBudget,
        navigateToProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
