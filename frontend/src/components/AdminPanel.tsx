import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import { Order, OrderStatus, Product, ProductCategory, OrderTrackingUpdate, Category } from '../types';
import { CategoryEditorModal } from './admin/CategoryEditorModal';
import { ProductEditorModal } from './admin/ProductEditorModal';
import { HomepageSectionsManager } from './admin/HomepageSectionsManager';
import { CollectionFiltersManager } from './admin/CollectionFiltersManager';
import { ImageKitMediaLibraryModal } from './admin/ImageKitMediaLibraryModal';
import { getOptimizedImageUrl, FALLBACK_PRODUCT_IMAGE, FALLBACK_CATEGORY_IMAGE } from '../utils/imageUtils';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Calendar,
  DollarSign,
  Tag,
  Check,
  Truck,
  Link,
  Copy,
  Share2,
  Send,
  MapPin,
  Info,
  Sparkles,
  X,
  ChevronRight,
  Eye,
  Archive,
  AlertTriangle,
  HardDrive,
  RotateCcw,
  Star,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const CATEGORIES: ProductCategory[] = [
  'Ethnic Wear',
  'Western Wear',
];

interface CourierPreset {
  name: string;
  badge: string;
  getUrl: (awb: string) => string;
}

const COURIER_PRESETS: CourierPreset[] = [
  {
    name: 'Delhivery Express',
    badge: 'Delhivery',
    getUrl: (awb) => `https://www.delhivery.com/track/package/${awb.trim()}`,
  },
  {
    name: 'Blue Dart Surface / Air',
    badge: 'Blue Dart',
    getUrl: (awb) => `https://www.bluedart.com/tracking?trackNumber=${awb.trim()}`,
  },
  {
    name: 'DTDC Courier',
    badge: 'DTDC',
    getUrl: (awb) => `https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${awb.trim()}`,
  },
  {
    name: 'Speed Post / India Post',
    badge: 'India Post',
    getUrl: (awb) => `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`,
  },
  {
    name: 'Shiprocket',
    badge: 'Shiprocket',
    getUrl: (awb) => `https://shiprocket.co/tracking/${awb.trim()}`,
  },
  {
    name: 'XpressBees',
    badge: 'XpressBees',
    getUrl: (awb) => `https://www.xpressbees.com/track?isawb=Yes&trackid=${awb.trim()}`,
  },
  {
    name: 'Shadowfax',
    badge: 'Shadowfax',
    getUrl: (awb) => `https://tracker.shadowfax.in/#/track/${awb.trim()}`,
  },
  {
    name: 'Trackon Couriers',
    badge: 'Trackon',
    getUrl: (awb) => `https://trackon.in/track?tracking_no=${awb.trim()}`,
  },
  {
    name: 'Professional Couriers',
    badge: 'TPC',
    getUrl: (awb) => `https://www.tpcindia.com/tracking.aspx?type=DOM&id=${awb.trim()}`,
  },
  {
    name: 'Kurukshetra Local Delivery',
    badge: 'Local Rider',
    getUrl: () => `https://wa.me/${STORE_INFO.whatsappNumber}`,
  },
];

export const AdminPanel: React.FC = () => {
  const {
    adminActiveTab,
    setAdminActiveTab,
    orders,
    updateOrderStatus,
    updateOrderTracking,
    deleteOrder,
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    resetCategoriesToDefault,
    setView,
    openOrderTracking,
    navigateToCategory,
    navigateToProduct,
    setSelectedProductId,
    currentUser,
  } = useStore();

  // Search & Filter in Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderTrackingFilter, setOrderTrackingFilter] = useState<'all' | 'has_tracking' | 'missing_tracking'>('all');

  // Search & Filter in Products
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'sold_out' | 'low_stock'>('all');

  // Tracking Modal State
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  const [trackingForm, setTrackingForm] = useState({
    courierName: 'Delhivery Express',
    trackingNumber: '',
    trackingLink: '',
    shippedDate: new Date().toISOString().split('T')[0],
    estimatedDelivery: '',
    trackingNotes: '',
    autoUpdateStatus: true,
  });
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals for CRUD operations
  const [categoryModalState, setCategoryModalState] = useState<{ isOpen: boolean; category: Category | null }>({
    isOpen: false,
    category: null,
  });

  const [productModalState, setProductModalState] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null,
  });

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    type: 'product' | 'category';
    id: string;
    name: string;
    affectedCount?: number;
  } | null>(null);

  // Calculate Dashboard KPIs
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending WhatsApp').length;
  const dispatchedOrders = orders.filter((o) => o.status === 'Shipped' || o.status === 'Delivered').length;
  const ordersWithTracking = orders.filter((o) => o.trackingNumber || o.trackingLink).length;
  const ordersAwaitingTracking = orders.filter(
    (o) => o.status !== 'Cancelled' && o.status !== 'Delivered' && !o.trackingNumber && !o.trackingLink
  ).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCopyText = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedTrackingId(id);
    setTimeout(() => setCopiedTrackingId(null), 2000);
    showToast('Copied to clipboard!');
  };

  // Open Tracking Modal for an Order
  const handleOpenTrackingModal = (order: Order) => {
    // Determine default estimated delivery (+3 days) if not set
    const defaultETA = new Date();
    defaultETA.setDate(defaultETA.getDate() + 3);
    const defaultETAString = defaultETA.toISOString().split('T')[0];

    setTrackingModalOrder(order);
    setTrackingForm({
      courierName: order.courierName || 'Delhivery Express',
      trackingNumber: order.trackingNumber || '',
      trackingLink: order.trackingLink || '',
      shippedDate: order.shippedDate || new Date().toISOString().split('T')[0],
      estimatedDelivery: order.estimatedDelivery || defaultETAString,
      trackingNotes: order.trackingNotes || '',
      autoUpdateStatus: order.status !== 'Delivered' && order.status !== 'Shipped',
    });
  };

  // Auto-generate URL from courier preset & AWB
  const handleGenerateTrackingLink = (courierName: string, awbNumber: string) => {
    if (!awbNumber.trim()) {
      showToast('Please enter an AWB / Tracking Number first');
      return;
    }
    const matchedPreset = COURIER_PRESETS.find(
      (p) => p.name.toLowerCase() === courierName.toLowerCase() || courierName.toLowerCase().includes(p.badge.toLowerCase())
    );
    if (matchedPreset) {
      const generated = matchedPreset.getUrl(awbNumber);
      setTrackingForm((prev) => ({ ...prev, trackingLink: generated }));
      showToast(`Generated ${matchedPreset.badge} tracking link!`);
    } else {
      const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(courierName + ' tracking ' + awbNumber)}`;
      setTrackingForm((prev) => ({ ...prev, trackingLink: fallbackUrl }));
      showToast('Generated search tracking link for custom courier');
    }
  };

  // Quick Preset Click
  const handleSelectPreset = (preset: CourierPreset) => {
    setTrackingForm((prev) => {
      const updatedCourier = preset.name;
      let updatedLink = prev.trackingLink;
      if (prev.trackingNumber.trim()) {
        updatedLink = preset.getUrl(prev.trackingNumber.trim());
      }
      return {
        ...prev,
        courierName: updatedCourier,
        trackingLink: updatedLink,
      };
    });
  };

  // Save Tracking Handler
  const handleSaveTracking = (e?: React.FormEvent, sendWhatsApp = false) => {
    if (e) e.preventDefault();
    if (!trackingModalOrder) return;

    const updates: OrderTrackingUpdate = {
      courierName: trackingForm.courierName.trim(),
      trackingNumber: trackingForm.trackingNumber.trim(),
      trackingLink: trackingForm.trackingLink.trim(),
      shippedDate: trackingForm.shippedDate,
      estimatedDelivery: trackingForm.estimatedDelivery,
      trackingNotes: trackingForm.trackingNotes.trim(),
    };

    if (trackingForm.autoUpdateStatus && trackingModalOrder.status !== 'Delivered') {
      updates.status = 'Shipped';
    }

    updateOrderTracking(trackingModalOrder.id, updates);

    if (sendWhatsApp) {
      // Build WhatsApp dispatch message with tracking details
      const cleanPhone = trackingModalOrder.phone.replace(/[^0-9]/g, '');
      const firstName = trackingModalOrder.customerName.split(' ')[0] || trackingModalOrder.customerName;

      let msg = `🌸 *DISPATCH UPDATE — THE WESTERN STORE, KURUKSHETRA*\n\n`;
      msg += `Dear ${firstName},\n`;
      msg += `Your boutique order *#${trackingModalOrder.orderNumber}* has been dispatched from our Kurukshetra store! 📦✨\n\n`;
      msg += `🚚 *Courier Partner:* ${updates.courierName || 'Express Courier'}\n`;
      if (updates.trackingNumber) {
        msg += `🏷️ *AWB / Tracking No:* ${updates.trackingNumber}\n`;
      }
      if (updates.trackingLink) {
        msg += `🔗 *Live Tracking Link:* ${updates.trackingLink}\n`;
      }
      if (updates.shippedDate) {
        msg += `📅 *Dispatched On:* ${updates.shippedDate}\n`;
      }
      if (updates.estimatedDelivery) {
        msg += `⏳ *Expected Delivery:* ${updates.estimatedDelivery}\n`;
      }
      if (updates.trackingNotes) {
        msg += `📝 *Note:* ${updates.trackingNotes}\n`;
      }
      msg += `\n👗 *Items in Parcel:*\n`;
      trackingModalOrder.items.forEach((item, idx) => {
        msg += `${idx + 1}. ${item.title} (${item.size}) × ${item.quantity}\n`;
      });
      msg += `\nYou can also check your real-time status anytime on our store website.\n`;
      msg += `Thank you for shopping with The Western Store Kurukshetra! 🛍️`;

      const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
      showToast(`Tracking saved & WhatsApp chat opened for ${trackingModalOrder.customerName}!`);
    } else {
      showToast(`Tracking details saved for Order #${trackingModalOrder.orderNumber}!`);
    }

    setTrackingModalOrder(null);
  };

  // Clear tracking
  const handleClearTracking = () => {
    if (!trackingModalOrder) return;
    if (confirm(`Are you sure you want to clear tracking details for Order #${trackingModalOrder.orderNumber}?`)) {
      updateOrderTracking(trackingModalOrder.id, {
        courierName: '',
        trackingNumber: '',
        trackingLink: '',
        shippedDate: '',
        estimatedDelivery: '',
        trackingNotes: '',
      });
      showToast('Tracking details cleared');
      setTrackingModalOrder(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderTrackingFilter === 'has_tracking' && !o.trackingNumber && !o.trackingLink) return false;
    if (orderTrackingFilter === 'missing_tracking' && (o.trackingNumber || o.trackingLink)) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.city.toLowerCase().includes(q) ||
        (o.courierName && o.courierName.toLowerCase().includes(q)) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredProducts = products.filter((p) => {
    if (productCatFilter !== 'all' && p.category !== productCatFilter) return false;
    
    // Stock filter
    if (productStockFilter === 'in_stock' && p.isSoldOut) return false;
    if (productStockFilter === 'sold_out' && !p.isSoldOut) return false;
    if (productStockFilter === 'low_stock' && (p.isSoldOut || (p.inStockCount !== undefined && p.inStockCount > 5))) return false;

    if (productSearch) {
      const q = productSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setProductModalState({ isOpen: true, product: null });
  };

  const handleOpenEditProduct = (prod: Product) => {
    setProductModalState({ isOpen: true, product: prod });
  };

  const handleSaveProduct = (data: Partial<Product>) => {
    if (productModalState.product) {
      // Edit existing
      updateProduct(productModalState.product.id, data);
      showToast(`Updated "${data.title || productModalState.product.title}" in catalog!`);
    } else {
      // Add new
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: data.title || 'New Item',
        slug: (data.title || 'new-item').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        category: (data.category as ProductCategory) || 'Ethnic Wear',
        price: Number(data.price) || 999,
        originalPrice: Number(data.originalPrice) || 1499,
        onSale: Boolean(data.onSale),
        saleDiscount: data.saleDiscount || '',
        isSoldOut: Boolean(data.isSoldOut),
        inStockCount: data.inStockCount !== undefined ? data.inStockCount : 15,
        isBestSeller: Boolean(data.isBestSeller),
        isNew: Boolean(data.isNew),
        budgetTier: data.budgetTier || 'under_1499',
        images: data.images && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        sizes: data.sizes || ['Free Size'],
        colors: data.colors || [{ name: 'Deep Maroon' }],
        description: data.description || 'Exclusive boutique garment crafted for The Western Store.',
        fabricCare: data.fabricCare || {
          fabric: 'Pure Silk & Georgette',
          washCare: 'Dry Clean Only',
          fit: 'Regular Fit',
          occasion: 'Festive & Weddings',
        },
        rating: data.rating || 4.9,
        reviewCount: data.reviewCount || 24,
      };
      addProduct(newProd);
      showToast(`Added "${newProd.title}" to catalog!`);
    }
  };

  const handlePromptDeleteProduct = (prod: Product) => {
    setDeleteConfirmModal({
      isOpen: true,
      type: 'product',
      id: prod.id,
      name: prod.title,
    });
  };

  const handleConfirmDeleteProduct = (id: string) => {
    deleteProduct(id);
    setDeleteConfirmModal(null);
    showToast('Garment deleted from catalog');
  };

  const handleToggleProductStock = (prod: Product) => {
    const nextSoldOut = !prod.isSoldOut;
    updateProduct(prod.id, {
      isSoldOut: nextSoldOut,
      inStockCount: nextSoldOut ? 0 : (prod.inStockCount && prod.inStockCount > 0 ? prod.inStockCount : 12),
    });
    showToast(nextSoldOut ? `Marked "${prod.title}" as Sold Out` : `Marked "${prod.title}" as In Stock`);
  };

  // Category CRUD Handlers
  const handleOpenAddCategory = () => {
    setCategoryModalState({ isOpen: true, category: null });
  };

  const handleOpenEditCategory = (cat: Category) => {
    setCategoryModalState({ isOpen: true, category: cat });
  };

  const handleSaveCategory = (data: Partial<Category>) => {
    if (categoryModalState.category) {
      updateCategory(categoryModalState.category.id, data);
      showToast(`Updated category "${data.name || categoryModalState.category.name}"!`);
    } else {
      addCategory({
        name: data.name || 'New Category',
        subtitle: data.subtitle,
        image: data.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        slug: data.slug,
      });
      showToast(`Created new category "${data.name}"!`);
    }
  };

  const handlePromptDeleteCategory = (cat: Category) => {
    const linkedProductsCount = products.filter((p) => p.category === cat.name).length;
    setDeleteConfirmModal({
      isOpen: true,
      type: 'category',
      id: cat.id,
      name: cat.name,
      affectedCount: linkedProductsCount,
    });
  };

  const handleConfirmDeleteCategory = (id: string) => {
    deleteCategory(id);
    setDeleteConfirmModal(null);
    showToast('Category removed from store navigation');
  };

  const handleResetCategories = () => {
    resetCategoriesToDefault();
    showToast('Reset categories to default Ethnic Wear & Western Wear');
  };

  const handleMoveCategoryUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...categories];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    reorderCategories(updated);
    showToast(`Moved "${updated[index - 1].name}" up`);
  };

  const handleMoveCategoryDown = (index: number) => {
    if (index >= categories.length - 1) return;
    const updated = [...categories];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    reorderCategories(updated);
    showToast(`Moved "${updated[index + 1].name}" down`);
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#721B29] mb-4 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-[#242120] mb-2">Admin Access Required</h2>
        <p className="text-xs text-[#736B63] max-w-md mb-6 leading-relaxed">
          You must be logged in as an authorized store administrator to view the Management Console.
        </p>
        <button
          type="button"
          onClick={() => setView('home')}
          className="px-5 py-2.5 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen bg-[#F7F4EE] flex flex-col relative w-full max-w-full overflow-x-hidden"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1717] text-white px-4 py-3 rounded-lg shadow-xl border border-[#3E3435] flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Bar */}
      <header className="bg-[#1C1717] text-white px-3 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#332A2B] w-full">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView('home')}
            className="flex items-center gap-1.5 text-xs text-[#E6C280] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </button>
          <span className="text-[#594F50]">|</span>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-white">
              The Western Store
            </span>
            <span className="text-[10px] bg-[#721B29] px-2 py-0.5 rounded-xs font-semibold uppercase tracking-wider text-[#E6C280]">
              Seller Portal
            </span>
          </div>
        </div>

        <div className="text-xs text-[#BFB5A5] hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-[#2B2324] px-2.5 py-1 rounded-sm border border-[#3D3334]">
            <Truck className="w-3.5 h-3.5 text-[#E6C280]" />
            <span>Tracking Manager Active</span>
          </span>
          <span className="text-[#594F50]">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live WhatsApp Sync</span>
          </span>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-full overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-[#EAE4D9] p-3 sm:p-4 flex md:flex-col justify-between overflow-x-auto shrink-0">
          <div className="space-y-1 w-full flex md:flex-col gap-1 md:gap-0">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders & Tracking', icon: ShoppingBag, badge: pendingOrders },
              { id: 'products', label: 'Catalog & Products', icon: Package, badge: products.length },
              { id: 'categories', label: 'Categories', icon: Layers },
              { id: 'sections', label: 'Homepage & Photos', icon: Sliders },
              { id: 'filters', label: 'Collection Filters', icon: Filter },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = adminActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAdminActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#721B29] text-white shadow-xs'
                      : 'text-[#4A453E] hover:bg-[#FAF7F0] hover:text-[#721B29]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#EAE4D9] text-[#242120]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden md:block pt-6 border-t border-[#EAE4D9] text-[11px] text-[#736B63] space-y-2">
            <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#EAE4D9]">
              <div className="flex items-center gap-1.5 font-bold text-[#242120]">
                <Truck className="w-3.5 h-3.5 text-[#721B29]" />
                <span>Courier Dispatch</span>
              </div>
              <p className="text-[10px] text-[#736B63] mt-1 leading-snug">
                Add tracking links and AWB numbers to keep customers informed via WhatsApp.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#242120]">Kurukshetra Showroom</p>
              <p>Railway Road, Opp. Hotel Pearl Marc</p>
              <p>WhatsApp: 9729515288</p>
            </div>
          </div>
        </aside>

        {/* Tab Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* TAB 1: DASHBOARD */}
          {adminActiveTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#242120]">
                  Store Executive Overview
                </h2>
                <p className="text-xs text-[#736B63] mt-0.5">
                  Real-time activity from Kurukshetra showroom and Instagram bio shoppers.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-[#EAE4D9] shadow-xs">
                  <span className="text-[11px] uppercase font-semibold text-[#8C8276] tracking-wider">
                    Total Order Volume
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#721B29]">
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-[#736B63] mt-1">Across all WhatsApp inquiries</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#EAE4D9] shadow-xs">
                  <span className="text-[11px] uppercase font-semibold text-[#8C8276] tracking-wider">
                    Pending Confirmation
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B8860B]">
                      {pendingOrders}
                    </span>
                    <Clock className="w-4 h-4 text-[#B8860B]" />
                  </div>
                  <p className="text-[11px] text-[#736B63] mt-1">Awaiting staff chat reply</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#EAE4D9] shadow-xs">
                  <span className="text-[11px] uppercase font-semibold text-[#8C8276] tracking-wider">
                    Active Shipments (With Tracking)
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800">
                      {ordersWithTracking}
                    </span>
                    <Truck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-[#736B63] mt-1">
                    {ordersAwaitingTracking > 0 ? (
                      <span className="text-amber-700 font-medium">
                        ⚠️ {ordersAwaitingTracking} order{ordersAwaitingTracking > 1 ? 's' : ''} need tracking
                      </span>
                    ) : (
                      'All dispatched orders have tracking'
                    )}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#EAE4D9] shadow-xs">
                  <span className="text-[11px] uppercase font-semibold text-[#8C8276] tracking-wider">
                    Top Selling Category
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-serif text-lg sm:text-xl font-bold text-[#242120]">
                      Ethnic Wear
                    </span>
                    <Tag className="w-4 h-4 text-[#721B29]" />
                  </div>
                  <p className="text-[11px] text-[#736B63] mt-1">Leading demand this week</p>
                </div>
              </div>

              {/* Recent Orders Stream */}
              <div className="bg-white rounded-xl border border-[#EAE4D9] p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F4EFE6]">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#242120]">
                      Recent Orders & Tracking Status
                    </h3>
                    <p className="text-xs text-[#736B63]">Click any order to manage tracking link, AWB & dispatch</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminActiveTab('orders')}
                    className="text-xs text-[#721B29] font-semibold hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-[#F4EFE6]">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#242120] font-sans">
                            #{order.orderNumber}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-[#242120]">{order.customerName}</span>
                          <span className="text-[#8C8276]">({order.city})</span>
                        </div>
                        <p className="text-[11px] text-[#736B63] mt-0.5">
                          {order.items.map((i) => `${i.title} (${i.size})`).join(', ')}
                        </p>
                      </div>

                      {/* Tracking Pill & Actions */}
                      <div className="flex items-center flex-wrap gap-2.5">
                        {order.trackingNumber || order.trackingLink ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-sm text-[11px]">
                            <Truck className="w-3.5 h-3.5 text-purple-700" />
                            <span className="font-medium">{order.courierName || 'Courier'}:</span>
                            <span className="font-mono font-bold">{order.trackingNumber || 'Track Link Set'}</span>
                            {order.trackingLink && (
                              <a
                                href={order.trackingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-0.5 text-purple-700 hover:text-purple-900"
                                title="Test tracking link"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenTrackingModal(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-sm text-[11px] font-medium hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3 text-amber-700" />
                            <span>Add Tracking</span>
                          </button>
                        )}

                        <span className="font-sans font-bold text-sm text-[#721B29]">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === 'Pending WhatsApp'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'Shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleOpenTrackingModal(order)}
                          className="px-2.5 py-1 bg-[#FAF7F0] hover:bg-[#EAE4D9] text-[#242120] border border-[#D9CEBF] rounded-xs text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3 text-[#721B29]" />
                          <span>{order.trackingNumber || order.trackingLink ? 'Edit Tracking' : 'Add Tracking'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete order #${order.orderNumber}?`)) {
                              deleteOrder(order.id);
                              showToast(`Deleted order #${order.orderNumber}`);
                            }
                          }}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xs transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT & TRACKING */}
          {adminActiveTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#242120]">
                    Orders & Tracking Manager ({orders.length})
                  </h2>
                  <p className="text-xs text-[#736B63]">
                    Add courier tracking links, AWB numbers, dispatch dates, and send 1-click WhatsApp tracking updates to buyers.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#998F82] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search order, customer, AWB..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  {/* Tracking status filter */}
                  <select
                    value={orderTrackingFilter}
                    onChange={(e) => setOrderTrackingFilter(e.target.value as any)}
                    className="px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] font-medium"
                  >
                    <option value="all">All Tracking Statuses</option>
                    <option value="has_tracking">📦 Tracking Added ({ordersWithTracking})</option>
                    <option value="missing_tracking">⚠️ Awaiting Tracking ({ordersAwaitingTracking})</option>
                  </select>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120]"
                  >
                    <option value="all">All Order Statuses</option>
                    <option value="Pending WhatsApp">Pending WhatsApp</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Paid">Paid</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl border border-[#EAE4D9] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F3] border-b border-[#EAE4D9] text-[#736B63] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-3.5">Order</th>
                        <th className="p-3.5">Customer & Destination</th>
                        <th className="p-3.5">Garment Items</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Courier & Tracking Details</th>
                        <th className="p-3.5">Order Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4EFE6] text-[#242120]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-xs text-[#8C8276]">
                            No orders match your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const hasTracking = Boolean(order.trackingNumber || order.trackingLink);
                          return (
                            <tr key={order.id} className="hover:bg-[#FDFBF7] transition-colors">
                              {/* Order ID & Date */}
                              <td className="p-3.5 font-sans">
                                <span className="font-bold text-[#721B29] block">
                                  #{order.orderNumber}
                                </span>
                                <span className="text-[10px] text-[#8C8276] block">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openOrderTracking(order.orderNumber, order.phone)}
                                  className="mt-1 text-[10px] text-[#721B29] hover:underline flex items-center gap-0.5 cursor-pointer"
                                  title="View customer tracking page"
                                >
                                  <Eye className="w-2.5 h-2.5" />
                                  <span>Customer View</span>
                                </button>
                              </td>

                              {/* Customer Details */}
                              <td className="p-3.5">
                                <p className="font-bold">{order.customerName}</p>
                                <p className="text-[11px] text-[#736B63]">
                                  📲 {order.phone}
                                </p>
                                <p className="text-[10px] text-[#8C8276] truncate max-w-[200px]" title={`${order.address}, ${order.city} - ${order.pincode}`}>
                                  {order.address}, {order.city} - {order.pincode}
                                </p>
                              </td>

                              {/* Items */}
                              <td className="p-3.5">
                                <div className="space-y-1 max-w-[220px]">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="text-[11px] leading-snug">
                                      <span>{item.quantity}x </span>
                                      <strong>{item.title}</strong>
                                      <span className="text-[#8C8276]">
                                        {' '}
                                        [{item.size} / {item.color}]
                                      </span>
                                    </div>
                                  ))}
                                  {order.notes && (
                                    <p className="text-[10px] text-[#B8860B] italic">
                                      Note: {order.notes}
                                    </p>
                                  )}
                                </div>
                              </td>

                              {/* Total Amount */}
                              <td className="p-3.5 font-sans font-bold text-[#721B29]">
                                ₹{order.total.toLocaleString('en-IN')}
                              </td>

                              {/* Courier & Tracking Details Column */}
                              <td className="p-3.5">
                                {hasTracking ? (
                                  <div className="space-y-1.5 min-w-[200px]">
                                    <div className="flex items-center">
                                      <span className="font-semibold text-xs text-[#242120] flex items-center gap-1">
                                        <Truck className="w-3.5 h-3.5 text-[#721B29]" />
                                        <span>{order.courierName || 'Courier Partner'}</span>
                                      </span>
                                    </div>

                                    {order.trackingNumber && (
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-[11px] bg-[#F4EFE6] px-1.5 py-0.5 rounded-xs border border-[#D9CEBF] font-semibold text-[#242120]">
                                          {order.trackingNumber}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopyText(order.trackingNumber || '', `tbl-${order.id}`)}
                                          className="p-1 text-[#8C8276] hover:text-[#721B29] rounded-xs"
                                          title="Copy AWB Number"
                                        >
                                          {copiedTrackingId === `tbl-${order.id}` ? (
                                            <Check className="w-3 h-3 text-emerald-600" />
                                          ) : (
                                            <Copy className="w-3 h-3" />
                                          )}
                                        </button>
                                      </div>
                                    )}

                                    {order.trackingLink && (
                                      <div className="flex items-center gap-1">
                                        <a
                                          href={order.trackingLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-[11px] text-[#721B29] hover:underline font-medium"
                                          title={order.trackingLink}
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          <span>Open Live Tracking URL</span>
                                        </a>
                                      </div>
                                    )}

                                    {order.shippedDate && (
                                      <p className="text-[10px] text-[#8C8276]">
                                        Shipped: {order.shippedDate}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-[#8C8276] italic">
                                    No tracking added
                                  </div>
                                )}
                              </td>

                              {/* Status Dropdown */}
                              <td className="p-3.5">
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    updateOrderStatus(order.id, e.target.value as OrderStatus)
                                  }
                                  className={`px-2.5 py-1 rounded-sm text-[11px] font-semibold border ${
                                    order.status === 'Pending WhatsApp'
                                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                                      : order.status === 'Confirmed'
                                      ? 'bg-blue-50 text-blue-900 border-blue-300'
                                      : order.status === 'Shipped'
                                      ? 'bg-purple-50 text-purple-900 border-purple-300'
                                      : order.status === 'Delivered'
                                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                      : 'bg-gray-100 text-gray-800 border-gray-300'
                                  }`}
                                >
                                  <option value="Pending WhatsApp">Pending WhatsApp</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Paid">Paid</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>

                              {/* Actions Column */}
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenTrackingModal(order)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FAF7F0] hover:bg-[#EAE4D9] text-[#242120] border border-[#D9CEBF] rounded-xs font-semibold text-[11px] transition-colors cursor-pointer"
                                    title="Manage Tracking & Dispatch Details"
                                  >
                                    <Truck className="w-3.5 h-3.5 text-[#721B29]" />
                                    <span>{hasTracking ? 'Edit Tracking' : 'Add Tracking'}</span>
                                  </button>

                                   <a
                                    href={`https://wa.me/91${order.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(order.customerName)}%2C%20greetings%20from%20The%20Western%20Store%20Kurukshetra!%20Regarding%20your%20order%20%23${order.orderNumber}...`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs font-semibold text-[11px] transition-colors"
                                    title="Open WhatsApp Chat"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete order #${order.orderNumber}?`)) {
                                        deleteOrder(order.id);
                                        showToast(`Deleted order #${order.orderNumber}`);
                                      }
                                    }}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xs transition-colors cursor-pointer"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {adminActiveTab === 'products' && (
            <div className="space-y-6">
              {/* Header & Main Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-[#EAE4D9] shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#242120]">
                      Product Catalogue ({filteredProducts.length} of {products.length})
                    </h2>
                    <span className="bg-[#721B29]/10 text-[#721B29] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Editable
                    </span>
                  </div>
                  <p className="text-xs text-[#736B63] mt-1">
                    Manage boutique garments: edit photos, descriptions, stock inventory, prices, sizes, and shades.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMediaLibraryOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#D9CEBF] text-[#242120] hover:border-[#721B29] hover:text-[#721B29] rounded-sm text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                  >
                    <HardDrive className="w-4 h-4 text-[#721B29]" />
                    <span>Browse ImageKit Library</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddProduct}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#721B29] text-white rounded-sm text-xs font-semibold hover:bg-[#852031] transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Garment</span>
                  </button>
                </div>
              </div>

              {/* Filters and Search Bar */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE4D9] shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#8C8276] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search by title, category, ID, fabric..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF8F3] border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                    {productSearch && (
                      <button
                        type="button"
                        onClick={() => setProductSearch('')}
                        className="absolute right-2.5 top-2.5 text-[#8C8276] hover:text-[#242120]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={productCatFilter}
                      onChange={(e) => setProductCatFilter(e.target.value)}
                      className="px-3 py-2 bg-[#FAF8F3] border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    >
                      <option value="all">All Categories ({categories.length})</option>
                      {categories.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stock Status Quick Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F4EFE6] text-xs">
                  <span className="text-[11px] font-semibold text-[#8C8276] mr-1">Stock Status:</span>
                  {[
                    { id: 'all', label: `All (${products.length})` },
                    { id: 'in_stock', label: `In Stock (${products.filter((p) => !p.isSoldOut).length})` },
                    {
                      id: 'low_stock',
                      label: `Low Stock ≤5 (${products.filter((p) => !p.isSoldOut && p.inStockCount !== undefined && p.inStockCount <= 5).length})`,
                    },
                    { id: 'sold_out', label: `Sold Out (${products.filter((p) => p.isSoldOut).length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setProductStockFilter(tab.id as any)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        productStockFilter === tab.id
                          ? 'bg-[#721B29] text-white shadow-2xs'
                          : 'bg-[#FAF8F3] text-[#5C544B] hover:bg-[#F3EFE6] border border-[#EAE4D9]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid Table */}
              <div className="bg-white rounded-xl border border-[#EAE4D9] overflow-hidden shadow-xs">
                {filteredProducts.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#FAF8F3] text-[#8C8276] flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#242120]">No garments found</h3>
                    <p className="text-xs text-[#736B63] max-w-sm mx-auto">
                      No products match your current search or category/stock filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setProductSearch('');
                        setProductCatFilter('all');
                        setProductStockFilter('all');
                      }}
                      className="px-4 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] text-[#242120] rounded-sm text-xs hover:bg-[#F3EFE6] cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="bg-[#FAF8F3] border-b border-[#EAE4D9] text-[#736B63] uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="p-3.5">Garment & Gallery</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Pricing & Discount</th>
                          <th className="p-3.5">Stock & Warehouse</th>
                          <th className="p-3.5">Sizes & Colors</th>
                          <th className="p-3.5 text-right">Garment Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F4EFE6] text-[#242120]">
                        {filteredProducts.map((p) => {
                          const stockCount = p.inStockCount !== undefined ? p.inStockCount : (p.isSoldOut ? 0 : 12);
                          const isLowStock = !p.isSoldOut && stockCount <= 5 && stockCount > 0;

                          return (
                            <tr key={p.id} className="hover:bg-[#FDFBF7] transition-colors group">
                              {/* Garment Image & Title */}
                              <td className="p-3.5">
                                <div className="flex items-start gap-3">
                                  <div className="relative w-12 h-16 rounded-md overflow-hidden border border-[#EAE4D9] bg-[#FAF8F3] flex-shrink-0 shadow-2xs group-hover:border-[#721B29] transition-colors">
                                    <img
                                      src={getOptimizedImageUrl(p.images[0], 150, 75)}
                                      alt={p.title}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                                      }}
                                      className="w-full h-full object-cover object-top"
                                    />
                                    {p.images.length > 1 && (
                                      <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 font-mono">
                                        +{p.images.length - 1}
                                      </span>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <p className="font-bold text-[#242120] line-clamp-1">{p.title}</p>
                                    <p className="text-[11px] text-[#8C8276] line-clamp-1 max-w-xs">
                                      {p.description || 'Exclusive boutique collection'}
                                    </p>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {p.isBestSeller && (
                                        <span className="text-[10px] bg-[#B8860B]/15 text-[#8F6808] px-1.5 py-0.2 rounded-xs font-semibold flex items-center gap-0.5">
                                          <Star className="w-2.5 h-2.5 fill-[#B8860B]" />
                                          <span>Best Seller</span>
                                        </span>
                                      )}
                                      {p.isNew && (
                                        <span className="text-[10px] bg-[#2B3A2C]/15 text-[#2B3A2C] px-1.5 py-0.2 rounded-xs font-semibold">
                                          New Drop
                                        </span>
                                      )}
                                      <span className="text-[10px] text-[#8C8276]">
                                        ★ {p.rating || 4.9} ({p.reviewCount || 20})
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="p-3.5">
                                <span className="inline-block px-2.5 py-1 bg-[#FAF8F3] border border-[#EAE4D9] rounded-sm text-xs font-semibold text-[#5C544B]">
                                  {p.category}
                                </span>
                              </td>

                              {/* Pricing */}
                              <td className="p-3.5 font-sans">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-sm text-[#721B29]">
                                      ₹{p.price.toLocaleString('en-IN')}
                                    </span>
                                    {p.saleDiscount && (
                                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-xs">
                                        {p.saleDiscount}
                                      </span>
                                    )}
                                  </div>
                                  {p.onSale && (
                                    <span className="text-[11px] text-[#8C8276] line-through block">
                                      MRP: ₹{p.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Stock status */}
                              <td className="p-3.5">
                                <div className="space-y-1">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                      p.isSoldOut
                                        ? 'bg-rose-100 text-rose-800'
                                        : isLowStock
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {p.isSoldOut ? (
                                      <>
                                        <X className="w-3 h-3" />
                                        <span>Sold Out</span>
                                      </>
                                    ) : (
                                      <>
                                        <Check className="w-3 h-3" />
                                        <span>{stockCount} in Stock</span>
                                      </>
                                    )}
                                  </span>
                                  {isLowStock && (
                                    <p className="text-[10px] text-amber-700 font-medium flex items-center gap-0.5">
                                      <AlertTriangle className="w-2.5 h-2.5" />
                                      <span>Restock soon</span>
                                    </p>
                                  )}
                                </div>
                              </td>

                              {/* Sizes & Colors */}
                              <td className="p-3.5 text-[#5C544B]">
                                <div className="space-y-1">
                                  <p className="text-[11px] font-medium truncate max-w-[120px]">
                                    {p.sizes.join(', ')}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-1">
                                    {p.colors.slice(0, 3).map((c, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] font-medium px-1.5 py-0.5 bg-[#F4EFE6] border border-[#D9CEBF] rounded text-[#4A453E] truncate max-w-[80px]"
                                        title={c.name}
                                      >
                                        {c.name}
                                      </span>
                                    ))}
                                    {p.colors.length > 3 && (
                                      <span className="text-[9px] text-[#8C8276]">
                                        +{p.colors.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Edit Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditProduct(p)}
                                    className="px-2.5 py-1.5 bg-[#FAF8F3] hover:bg-[#721B29] hover:text-white border border-[#D9CEBF] text-[#242120] rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                    title="Edit all product fields (Images, Description, Stock, Price, Sizes)"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>

                                  {/* Quick Stock Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleProductStock(p)}
                                    className={`p-1.5 rounded-sm text-xs border transition-colors cursor-pointer ${
                                      p.isSoldOut
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                        : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                    }`}
                                    title={p.isSoldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>

                                  {/* View in Store */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigateToProduct(p.id);
                                    }}
                                    className="p-1.5 bg-[#FAF8F3] text-[#736B63] hover:text-[#721B29] hover:bg-[#F3EFE6] border border-[#EAE4D9] rounded-sm text-xs transition-colors cursor-pointer"
                                    title="Preview in Storefront"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => handlePromptDeleteProduct(p)}
                                    className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-sm text-xs transition-colors cursor-pointer"
                                    title="Delete product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {adminActiveTab === 'categories' && (
            <div className="space-y-6">
              {/* Department Header & Main Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-[#EAE4D9] shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#242120]">
                      Store Departments & Categories ({categories.length})
                    </h2>
                    <span className="bg-[#721B29]/10 text-[#721B29] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Editable & Dynamic
                    </span>
                  </div>
                  <p className="text-xs text-[#736B63] mt-1">
                    Manage boutique categories, department covers, and homepage circular navigation badges.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleResetCategories}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#D9CEBF] text-[#242120] rounded-sm text-xs font-semibold hover:bg-[#FAF7F0] transition-colors cursor-pointer"
                    title="Reset to default categories"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#736B63]" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddCategory}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#721B29] text-white rounded-sm text-xs font-semibold hover:bg-[#852031] transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Category</span>
                  </button>
                </div>
              </div>

              {/* Category Grid */}
              {categories.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#EAE4D9] p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8F3] text-[#8C8276] flex items-center justify-center mx-auto">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#242120]">No categories defined</h3>
                  <p className="text-xs text-[#736B63] max-w-sm mx-auto">
                    Add new categories or restore default store categories.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetCategories}
                    className="px-4 py-2 bg-[#721B29] text-white rounded-sm text-xs font-semibold cursor-pointer"
                  >
                    Restore Default Categories
                  </button>
                </div>
              ) : (
                <div className={`grid gap-4 ${
                  categories.length === 1
                    ? 'grid-cols-1 max-w-md'
                    : categories.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {categories.map((c, index) => {
                    const linkedCount = products.filter((p) => p.category === c.name).length;

                    return (
                      <div
                        key={c.id}
                        className="bg-white rounded-xl p-4 border border-[#EAE4D9] hover:border-[#721B29] transition-all shadow-xs hover:shadow-md flex flex-col justify-between group space-y-3 relative"
                      >
                        <div>
                          {/* Order Index Header */}
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-[10px] font-mono font-bold text-[#8C8276] bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#EAE4D9]">
                              Category #{index + 1}
                            </span>
                          </div>

                          <div className="flex items-start gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-[#721B29]/10 border border-[#721B29]/20 flex items-center justify-center text-[#721B29] group-hover:bg-[#721B29] group-hover:text-white flex-shrink-0 transition-colors shadow-2xs">
                              <Layers className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif font-bold text-sm text-[#242120] group-hover:text-[#721B29] transition-colors line-clamp-1">
                                {c.name}
                              </h4>
                              <p className="text-[10px] font-mono text-[#8C8276] truncate mt-0.5">
                                slug: {c.slug}
                              </p>
                              {c.subtitle && (
                                <p className="text-[11px] text-[#736B63] line-clamp-1 mt-0.5">
                                  {c.subtitle}
                                </p>
                              )}
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="text-[11px] font-semibold text-[#721B29] bg-[#721B29]/10 px-2 py-0.5 rounded-full">
                                  {linkedCount} Active {linkedCount === 1 ? 'Style' : 'Styles'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons footer */}
                        <div className="pt-3 border-t border-[#F4EFE6] flex items-center justify-between gap-1.5">
                          {/* Reordering Controls */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveCategoryUp(index)}
                              className="p-1.5 bg-[#FAF8F3] text-[#242120] hover:bg-[#721B29] hover:text-white border border-[#EAE4D9] rounded-sm text-xs transition-colors disabled:opacity-30 disabled:hover:bg-[#FAF8F3] disabled:hover:text-[#242120] cursor-pointer"
                              title="Move left/up in navbar order"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === categories.length - 1}
                              onClick={() => handleMoveCategoryDown(index)}
                              className="p-1.5 bg-[#FAF8F3] text-[#242120] hover:bg-[#721B29] hover:text-white border border-[#EAE4D9] rounded-sm text-xs transition-colors disabled:opacity-30 disabled:hover:bg-[#FAF8F3] disabled:hover:text-[#242120] cursor-pointer"
                              title="Move right/down in navbar order"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(c)}
                            className="flex-1 py-1.5 px-2 bg-[#FAF8F3] hover:bg-[#721B29] hover:text-white border border-[#D9CEBF] text-[#242120] rounded-sm text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              navigateToCategory(c.name);
                            }}
                            className="p-1.5 bg-[#FAF8F3] text-[#736B63] hover:text-[#721B29] hover:bg-[#F3EFE6] border border-[#EAE4D9] rounded-sm text-xs transition-colors cursor-pointer"
                            title="View in Storefront Catalog"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePromptDeleteCategory(c)}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-sm text-xs transition-colors cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HOMEPAGE SECTIONS & PHOTOS */}
          {adminActiveTab === 'sections' && <HomepageSectionsManager />}

          {/* TAB 6: COLLECTION FILTERS */}
          {adminActiveTab === 'filters' && <CollectionFiltersManager />}
        </main>
      </div>

      {/* SELLER ORDER TRACKING MANAGEMENT MODAL */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setTrackingModalOrder(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-xl shadow-2xl border border-[#E0D7C8] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-[#EAE4D9] bg-[#F8F5EE] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#721B29]/10 text-[#721B29] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#242120]">
                      Add & Edit Tracking Details
                    </h3>
                    <span className="font-mono text-xs bg-[#721B29] text-white px-2 py-0.5 rounded-xs font-bold">
                      #{trackingModalOrder.orderNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#736B63]">
                    Customer: <strong>{trackingModalOrder.customerName}</strong> ({trackingModalOrder.phone}) • {trackingModalOrder.city}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="p-1.5 text-[#8C8276] hover:text-[#242120] hover:bg-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* Order Brief Strip */}
              <div className="p-3 bg-white rounded-lg border border-[#EAE4D9] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C8276]">
                    Destination Address:
                  </span>
                  <p className="text-xs font-medium text-[#242120]">
                    {trackingModalOrder.address}, {trackingModalOrder.city}, {trackingModalOrder.state} - {trackingModalOrder.pincode}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#8C8276]">Status:</span>
                  <span className="font-semibold text-xs text-[#721B29] bg-[#721B29]/10 px-2 py-0.5 rounded-xs">
                    {trackingModalOrder.status}
                  </span>
                </div>
              </div>

              {/* Form Section */}
              <form id="tracking-details-form" onSubmit={(e) => handleSaveTracking(e, false)} className="space-y-4">
                {/* 1. Courier Presets Chips */}
                <div>
                  <label className="block text-xs font-semibold text-[#242120] uppercase tracking-wider mb-2">
                    Select Courier Partner
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COURIER_PRESETS.map((preset) => {
                      const isSelected = trackingForm.courierName.toLowerCase() === preset.name.toLowerCase();
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          className={`px-2.5 py-1 rounded-sm text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#721B29] text-white border-[#721B29] shadow-xs'
                              : 'bg-white text-[#4A453E] border-[#D9CEBF] hover:border-[#721B29] hover:bg-[#FAF7F0]'
                          }`}
                        >
                          {preset.badge}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Courier Name Manual Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#242120] mb-1">
                      Courier / Delivery Partner Name <span className="text-[#721B29]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhivery Express"
                      value={trackingForm.courierName}
                      onChange={(e) => setTrackingForm({ ...trackingForm, courierName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  {/* 3. AWB / Tracking Number */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-[#242120]">
                        AWB / Tracking Number <span className="text-[#721B29]">*</span>
                      </label>
                      {trackingForm.trackingNumber && (
                        <button
                          type="button"
                          onClick={() =>
                            handleGenerateTrackingLink(trackingForm.courierName, trackingForm.trackingNumber)
                          }
                          className="text-[10px] text-[#721B29] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Auto-Generate URL</span>
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. DEL1361189921 or 244589201"
                        value={trackingForm.trackingNumber}
                        onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] font-mono focus:outline-none focus:border-[#721B29]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Tracking Link (URL) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-[#242120] flex items-center gap-1">
                      <Link className="w-3.5 h-3.5 text-[#721B29]" />
                      <span>Direct Courier Tracking Link (URL)</span>
                    </label>
                    {trackingForm.trackingLink && (
                      <a
                        href={trackingForm.trackingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Test / Verify Link</span>
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="e.g. https://www.delhivery.com/track/package/DEL1361189921"
                    value={trackingForm.trackingLink}
                    onChange={(e) => setTrackingForm({ ...trackingForm, trackingLink: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                  <p className="text-[10px] text-[#8C8276] mt-0.5">
                    Customers can click this link directly from their WhatsApp update or on the public store tracking page.
                  </p>
                </div>

                {/* 5. Dispatch Date & Estimated Delivery Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-[#242120]">Shipped / Dispatch Date</label>
                      <button
                        type="button"
                        onClick={() =>
                          setTrackingForm({ ...trackingForm, shippedDate: new Date().toISOString().split('T')[0] })
                        }
                        className="text-[10px] text-[#721B29] hover:underline cursor-pointer"
                      >
                        Today
                      </button>
                    </div>
                    <input
                      type="date"
                      value={trackingForm.shippedDate}
                      onChange={(e) => setTrackingForm({ ...trackingForm, shippedDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-[#242120]">Estimated Delivery (ETA)</label>
                      <div className="flex items-center gap-1 text-[10px] text-[#721B29]">
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 2);
                            setTrackingForm({ ...trackingForm, estimatedDelivery: d.toISOString().split('T')[0] });
                          }}
                          className="hover:underline cursor-pointer"
                        >
                          +2d
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 3);
                            setTrackingForm({ ...trackingForm, estimatedDelivery: d.toISOString().split('T')[0] });
                          }}
                          className="hover:underline cursor-pointer"
                        >
                          +3d
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 5);
                            setTrackingForm({ ...trackingForm, estimatedDelivery: d.toISOString().split('T')[0] });
                          }}
                          className="hover:underline cursor-pointer"
                        >
                          +5d
                        </button>
                      </div>
                    </div>
                    <input
                      type="date"
                      value={trackingForm.estimatedDelivery}
                      onChange={(e) => setTrackingForm({ ...trackingForm, estimatedDelivery: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120]"
                    />
                  </div>
                </div>

                {/* 6. Dispatch Notes */}
                <div>
                  <label className="block font-medium text-[#242120] mb-1">
                    Dispatch & Packaging Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Packed in boutique gift box with extra zari safety cover"
                    value={trackingForm.trackingNotes}
                    onChange={(e) => setTrackingForm({ ...trackingForm, trackingNotes: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120]"
                  />
                </div>

                {/* 7. Auto-update status checkbox */}
                <div className="p-3 bg-[#FAF7F0] rounded-md border border-[#EAE4D9] flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="auto-mark-shipped"
                    checked={trackingForm.autoUpdateStatus}
                    onChange={(e) => setTrackingForm({ ...trackingForm, autoUpdateStatus: e.target.checked })}
                    className="w-4 h-4 text-[#721B29] rounded-xs border-[#D9CEBF] focus:ring-[#721B29] cursor-pointer"
                  />
                  <label htmlFor="auto-mark-shipped" className="text-xs text-[#242120] font-medium cursor-pointer">
                    Automatically update order status to <strong>"Shipped"</strong>
                  </label>
                </div>

                {/* Customer Preview Box */}
                {(trackingForm.trackingNumber || trackingForm.trackingLink) && (
                  <div className="p-3.5 bg-emerald-50/70 rounded-lg border border-emerald-200/80 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-700" />
                      <span>Customer Tracking Preview</span>
                    </p>
                    <p className="text-xs text-emerald-950 font-medium">
                      Courier: <strong>{trackingForm.courierName}</strong> | AWB:{' '}
                      <strong className="font-mono">{trackingForm.trackingNumber || 'Pending'}</strong>
                    </p>
                    {trackingForm.trackingLink && (
                      <p className="text-[11px] text-emerald-800 truncate">
                        Link: {trackingForm.trackingLink}
                      </p>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#EAE4D9] bg-[#F8F5EE] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {(trackingModalOrder.trackingNumber || trackingModalOrder.trackingLink) && (
                  <button
                    type="button"
                    onClick={handleClearTracking}
                    className="px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-sm text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Clear Tracking
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2 border border-[#D9CEBF] bg-white hover:bg-[#FAF7F0] text-[#242120] rounded-sm text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={(e) => handleSaveTracking(e, false)}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-[#242120] hover:bg-[#3D3334] text-white rounded-sm text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Tracking</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSaveTracking(e, true)}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm text-xs font-semibold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save & WhatsApp Buyer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Editor Modal (Full CRUD: Images, Descriptions, Stock, Pricing, Variants) */}
      <ProductEditorModal
        product={productModalState.product}
        categories={categories}
        isOpen={productModalState.isOpen}
        onClose={() => setProductModalState({ isOpen: false, product: null })}
        onSave={handleSaveProduct}
      />

      {/* Category Editor Modal (Full CRUD: Name, Subtitle, Cover Image, Slug) */}
      <CategoryEditorModal
        category={categoryModalState.category}
        isOpen={categoryModalState.isOpen}
        onClose={() => setCategoryModalState({ isOpen: false, category: null })}
        onSave={handleSaveCategory}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setDeleteConfirmModal(null)}
          />
          <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-xl shadow-2xl border border-[#EAE4D9] p-6 z-10 text-xs text-[#242120] space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Delete {deleteConfirmModal.type === 'product' ? 'Garment' : 'Category'}?
                </h3>
                <p className="text-xs text-[#736B63]">
                  Are you sure you want to delete{' '}
                  <strong className="text-[#242120]">"{deleteConfirmModal.name}"</strong>?
                </p>
                {deleteConfirmModal.type === 'category' && (deleteConfirmModal.affectedCount || 0) > 0 && (
                  <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-md border border-amber-200 mt-2">
                    ⚠️ <strong>{deleteConfirmModal.affectedCount}</strong> products currently belong to this category. They will remain in your catalog but you may want to reassign their category.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE4D9]">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="px-4 py-2 border border-[#D9CEBF] bg-white hover:bg-[#FAF7F0] text-[#242120] rounded-sm text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmModal.type === 'product') {
                    handleConfirmDeleteProduct(deleteConfirmModal.id);
                  } else {
                    handleConfirmDeleteCategory(deleteConfirmModal.id);
                  }
                }}
                className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-sm text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ImageKit Cloud Media Library Modal */}
      <ImageKitMediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectImages={(urls) => {
          if (urls.length > 0) {
            handleOpenAddProduct();
          }
        }}
        currentProductFolder="/products"
        multiple={true}
      />
    </motion.div>
  );
};

