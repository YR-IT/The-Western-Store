import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  User,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  RefreshCw,
  XCircle,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { STORE_INFO } from '../data/mockData';

export const OrderHistoryPage: React.FC = () => {
  const {
    currentUser,
    orders,
    openAuthModal,
    openOrderTracking,
    setView,
    addToCart,
    setSelectedCategory,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filter orders strictly for the current logged-in user
  const userOrders = orders.filter((o) => {
    if (!currentUser) return false;
    if (o.userId && o.userId === currentUser.id) return true;
    if (currentUser.email && o.email?.toLowerCase() === currentUser.email.toLowerCase()) return true;
    if (currentUser.email && o.userEmail?.toLowerCase() === currentUser.email.toLowerCase()) return true;
    return false;
  });

  // Apply tab and text search
  const filteredOrders = userOrders.filter((o) => {
    // Tab filter
    if (activeTab === 'active') {
      if (['Delivered', 'Cancelled'].includes(o.status)) return false;
    } else if (activeTab === 'delivered') {
      if (o.status !== 'Delivered') return false;
    } else if (activeTab === 'cancelled') {
      if (o.status !== 'Cancelled') return false;
    }

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = o.orderNumber.toLowerCase().includes(q);
      const matchItems = o.items.some((i) => i.title.toLowerCase().includes(q));
      const matchTracking = o.trackingNumber?.toLowerCase().includes(q);
      return matchNumber || matchItems || matchTracking;
    }

    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Shipped & In Transit</span>
          </span>
        );
      case 'Confirmed':
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Order Confirmed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{status}</span>
          </span>
        );
    }
  };

  const handleTrackClick = (order: Order) => {
    openOrderTracking(order.orderNumber, order.phone);
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="py-8 sm:py-12 bg-[#FAF8F3] min-h-[80vh]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#EAE4D9] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721B29]/10 text-[#721B29] text-xs font-bold uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>Customer Account Portal</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#242120] tracking-tight">
              Order History & Tracking
            </h1>
            <p className="text-xs sm:text-sm text-[#736B63] mt-1">
              Review past boutique purchases, dispatch statuses, and courier tracking details.
            </p>
          </div>

          {currentUser && (
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#EAE4D9] shadow-2xs">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#EAE4D9]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#721B29] text-white flex items-center justify-center font-bold text-sm">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-bold text-[#242120] leading-tight">{currentUser.name}</p>
                <p className="text-[11px] text-[#736B63] truncate max-w-[180px]">{currentUser.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* NOT LOGGED IN STATE */}
        {!currentUser ? (
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#EAE4D9] shadow-sm max-w-xl mx-auto my-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#721B29]/10 text-[#721B29] flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#242120] mb-2">
              Sign In to View Your Order History
            </h2>
            <p className="text-xs sm:text-sm text-[#736B63] mb-6 leading-relaxed max-w-md mx-auto">
              Please sign in to your account to associate past orders, access live courier tracking links, and manage your profile.
            </p>
            <button
              type="button"
              onClick={() => openAuthModal('customer', 'Sign in to view your order history.')}
              className="px-6 py-3 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-xl border border-[#EAE4D9] shadow-2xs">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                {(
                  [
                    { id: 'all', label: 'All Orders' },
                    { id: 'active', label: 'Active & In Transit' },
                    { id: 'delivered', label: 'Delivered' },
                    { id: 'cancelled', label: 'Cancelled' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#721B29] text-white shadow-2xs'
                        : 'text-[#736B63] hover:text-[#242120] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64 shrink-0">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8276]" />
                <input
                  type="text"
                  placeholder="Search order # or item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F3] border border-[#EAE4D9] rounded-lg text-xs text-[#242120] placeholder-[#8C8276] focus:outline-none focus:ring-1 focus:ring-[#721B29]"
                />
              </div>
            </div>

            {/* ORDERS LIST */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#EAE4D9]">
                <ShoppingBag className="w-12 h-12 text-[#A39B8F] mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#242120] mb-1">
                  No Orders Found
                </h3>
                <p className="text-xs text-[#736B63] mb-5">
                  {searchQuery
                    ? `No orders matching "${searchQuery}"`
                    : 'You have not placed any boutique orders yet.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setView('plp');
                  }}
                  className="px-5 py-2.5 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl border border-[#EAE4D9] shadow-2xs overflow-hidden transition-all hover:border-[#D0C4B4]"
                    >
                      {/* Order Header */}
                      <div className="p-4 sm:p-5 bg-[#FAF8F3]/60 border-b border-[#EAE4D9] flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-serif font-bold text-base sm:text-lg text-[#242120]">
                              {order.orderNumber}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#736B63]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#8C8276]" />
                              <span>{formattedDate}</span>
                            </span>
                            <span>•</span>
                            <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                            <span>•</span>
                            <span className="font-bold text-[#721B29]">₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Order Header Quick Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTrackClick(order)}
                            className="px-3 py-1.5 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Package</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleExpand(order.id)}
                            className="p-1.5 text-[#736B63] hover:text-[#242120] hover:bg-[#FAF8F3] rounded-lg transition-colors"
                            aria-label="Toggle details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="p-4 sm:p-5 space-y-4">
                        <div className="divide-y divide-[#F4EFE6]">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3 sm:gap-4">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-14 h-18 sm:w-16 sm:h-20 object-cover rounded-md border border-[#EAE4D9] shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#242120] truncate">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-[#736B63] mt-0.5">
                                  Size: <span className="font-semibold text-[#242120]">{item.size}</span> | Color:{' '}
                                  <span className="font-semibold text-[#242120]">{item.color}</span>
                                </p>
                                <p className="text-xs font-bold text-[#721B29] mt-1">
                                  Qty {item.quantity} × ₹{item.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Courier & Live Tracking Card */}
                        {order.courierName || order.trackingNumber ? (
                          <div className="bg-[#FAF8F3] rounded-lg p-3.5 border border-[#EAE4D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="space-y-0.5">
                              <span className="text-[10px] uppercase font-bold text-[#8C8276] tracking-wider block">
                                Shipping Partner
                              </span>
                              <p className="font-bold text-[#242120] flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-blue-700" />
                                <span>{order.courierName || 'Standard Express'}</span>
                              </p>
                              {order.trackingNumber && (
                                <p className="text-[#736B63]">
                                  Waybill / AWB: <span className="font-mono text-[#242120] font-semibold">{order.trackingNumber}</span>
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {order.trackingLink && (
                                <a
                                  href={order.trackingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-white border border-[#D9CEBF] hover:border-[#721B29] text-[#242120] hover:text-[#721B29] rounded-md font-medium text-xs flex items-center gap-1 transition-colors"
                                >
                                  <span>Courier Portal</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleTrackClick(order)}
                                className="px-3 py-1.5 bg-[#721B29] text-white rounded-md font-bold text-xs hover:bg-[#52131D] flex items-center gap-1 shadow-2xs transition-colors"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Live Status Timeline</span>
                              </button>
                            </div>
                          </div>
                        ) : null}

                        {/* Expanded Details Section */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-3 border-t border-[#F4EFE6] space-y-3 text-xs text-[#736B63]"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8F5EE] p-3.5 rounded-lg border border-[#EAE4D9]">
                              <div>
                                <span className="font-bold text-[#242120] flex items-center gap-1 mb-1">
                                  <MapPin className="w-3.5 h-3.5 text-[#721B29]" />
                                  <span>Delivery Address</span>
                                </span>
                                <p className="text-[#242120] font-medium">{order.customerName}</p>
                                <p>{order.address}</p>
                                <p>
                                  {order.city}, {order.state} — {order.pincode}
                                </p>
                                <p className="mt-1 font-mono text-[11px]">Phone: {order.phone}</p>
                              </div>

                              <div>
                                <span className="font-bold text-[#242120] flex items-center gap-1 mb-1">
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Store Assistance</span>
                                </span>
                                <p className="mb-2">
                                  Have questions about this order or customization requests?
                                </p>
                                <a
                                  href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Hi%20The%20Western%20Store,%20I%20have%20an%20inquiry%20regarding%20Order%20${order.orderNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-md transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Inquire on WhatsApp</span>
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
