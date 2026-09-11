import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchProductsFromSupabase,
  fetchCategoriesFromSupabase,
  syncCartToSupabase,
  syncWishlistToSupabase,
  saveOrderToSupabase,
  upsertProductToSupabase,
  deleteProductFromSupabase,
  upsertCategoryToSupabase,
  deleteCategoryFromSupabase,
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
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_HERO_SLIDES,
  INITIAL_HOME_SECTIONS,
  INITIAL_COLLECTION_FILTERS,
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
  view: 'home' | 'plp' | 'pdp' | 'cart' | 'wishlist' | 'admin' | 'track-order' | 'order-history';
  currentView: 'home' | 'plp' | 'pdp' | 'cart' | 'wishlist' | 'admin' | 'track-order' | 'order-history';
  setView: (view: 'home' | 'plp' | 'pdp' | 'cart' | 'wishlist' | 'admin' | 'track-order' | 'order-history') => void;
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
  announcementText: string;
  setAnnouncementText: (text: string) => void;

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
  submitWhatsAppOrder: (formData: CheckoutFormData) => { order: Order; waUrl: string };

  // Admin Catalog Management
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStockStatus: (productId: string) => void;

  // Category Management
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
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
  const [view, setView] = useState<'home' | 'plp' | 'pdp' | 'cart' | 'wishlist' | 'admin' | 'track-order' | 'order-history'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<BudgetTier | 'all'>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories' | 'homepage'>('dashboard');
  const [trackingPrefill, setTrackingPrefill] = useState<{ orderNumber: string; phone: string } | null>(null);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tws_products_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: Product) => {
            const cat = p.category;
            if (['Ethnic Wear', 'Stitched Sarees', 'Lehenga', 'Suits', 'Kurti', 'Ethnic & Western Wear'].includes(cat)) {
              return { ...p, category: 'Ethnic Wear' };
            }
            return { ...p, category: 'Western Wear' };
          });
        }
      } catch {}
    }
    return INITIAL_PRODUCTS;
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('tws_categories_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    return INITIAL_CATEGORIES;
  });
  const [heroSlides] = useState<HeroSlide[]>(INITIAL_HERO_SLIDES);
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    return localStorage.getItem('tws_announcement') || STORE_INFO.announcement;
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

  useEffect(() => {
    localStorage.setItem('tws_home_sections', JSON.stringify(homeSections));
  }, [homeSections]);

  useEffect(() => {
    localStorage.setItem('tws_collection_filters', JSON.stringify(collectionFilters));
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

  // Orders (Starts completely empty for live production use)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tws_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
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
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    fetchProductsFromSupabase().then((remoteProducts) => {
      if (remoteProducts && remoteProducts.length > 0) {
        setProducts(remoteProducts);
      }
    });

    fetchCategoriesFromSupabase().then((remoteCategories) => {
      if (remoteCategories && remoteCategories.length > 0) {
        setCategories(remoteCategories);
      }
    });
  }, []);

  // Sync state to localStorage & Supabase
  useEffect(() => {
    localStorage.setItem('tws_products_v4', JSON.stringify(products));
  }, [products]);

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

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updated = { ...order, status };
        saveOrderToSupabase(updated, updated.userId).catch(() => {});
        return updated;
      })
    );
  };

  const updateOrderTracking = (
    orderId: string,
    tracking: OrderTrackingUpdate
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
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
      })
    );
  };

  const submitWhatsAppOrder = (formData: CheckoutFormData) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TWS-2026-${randomSuffix}`;
    const newOrderId = `order-${Date.now()}`;

    const itemsSummary = cart.map((item) => ({
      productId: item.productId,
      title: item.product.title,
      image: item.product.images[0],
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
    }));

    const newOrder: Order = {
      id: newOrderId,
      orderNumber,
      createdAt: new Date().toISOString(),
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
      items: itemsSummary,
      subtotal: cartSubtotal,
      shippingFee: 0,
      total: cartSubtotal,
      status: 'Pending WhatsApp',
    };

    // Save order locally and sync to Supabase
    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    saveOrderToSupabase(newOrder, currentUser?.id).catch((err) => {
      console.warn('[Supabase] Non-blocking order sync notice:', err);
    });

    // Build formatted message for WhatsApp
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
    itemsSummary.forEach((item, index) => {
      message += `${index + 1}. *${item.title}*\n`;
      message += `   Size: ${item.size} | Color: ${item.color}\n`;
      message += `   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${(item.quantity * item.price).toLocaleString('en-IN')}\n`;
    });
    message += `\n─────────────────────\n`;
    message += `*Total Amount:* ₹${cartSubtotal.toLocaleString('en-IN')}\n`;
    message += `*Shipping:* Free / Pan-India Delivery\n`;
    message += `*Status:* Pending WhatsApp Confirmation\n`;
    message += `─────────────────────\n\n`;
    message += `Hi The Western Store team! I have submitted this order on your website. Kindly confirm availability and share payment/QR details for dispatch from your Kurukshetra store. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodedMessage}`;

    // Clear cart (Stock will be deducted by Admin upon order confirmation)
    clearCart();

    return { order: newOrder, waUrl };
  };

  // Admin Catalog & Supabase DB Sync
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    upsertProductToSupabase(newProduct).catch((err) => console.warn('[Supabase] Product sync notice:', err));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const updated = { ...prod, ...updates };
          upsertProductToSupabase(updated).catch((err) => console.warn('[Supabase] Product sync notice:', err));
          return updated;
        }
        return prod;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
    deleteProductFromSupabase(id).catch((err) => console.warn('[Supabase] Delete product notice:', err));
  };

  const toggleStockStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const updated = {
            ...prod,
            isSoldOut: !prod.isSoldOut,
            inStockCount: !prod.isSoldOut ? 0 : 15,
          };
          upsertProductToSupabase(updated).catch((err) => console.warn('[Supabase] Stock status sync notice:', err));
          return updated;
        }
        return prod;
      })
    );
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
    const target = categories.find((c) => c.id === id);
    if (target && selectedCategory === target.name) {
      setSelectedCategory('All');
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    deleteCategoryFromSupabase(id).catch((err) => console.warn('[Supabase] Delete category notice:', err));
  };

  const resetCategoriesToDefault = () => {
    setCategories(INITIAL_CATEGORIES);
    localStorage.removeItem('tws_categories_v4');
    localStorage.removeItem('tws_categories');
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
        announcementText,
        setAnnouncementText,
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
        submitWhatsAppOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStockStatus,
        addCategory,
        updateCategory,
        deleteCategory,
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
