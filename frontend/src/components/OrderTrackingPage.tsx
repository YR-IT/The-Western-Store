import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { STORE_INFO } from '../data/mockData';
import { getOptimizedImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orders, setView, trackingPrefill, lastPlacedOrder } = useStore();

  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize from prefill or last placed order if available
  useEffect(() => {
    if (trackingPrefill) {
      setOrderIdInput(trackingPrefill.orderNumber);
      setPhoneInput(trackingPrefill.phone);
      performSearch(trackingPrefill.orderNumber, trackingPrefill.phone);
    } else if (lastPlacedOrder) {
      setOrderIdInput(lastPlacedOrder.orderNumber);
      setPhoneInput(lastPlacedOrder.phone);
      performSearch(lastPlacedOrder.orderNumber, lastPlacedOrder.phone);
    }
  }, [trackingPrefill, lastPlacedOrder]);

  // Normalize phone number (strip +91, 0, spaces, dashes)
  const normalizePhone = (p: string) => {
    const clean = p.replace(/\D/g, '');
    if (clean.length > 10 && clean.startsWith('91')) {
      return clean.slice(2);
    }
    if (clean.length === 11 && clean.startsWith('0')) {
      return clean.slice(1);
    }
    return clean;
  };

  const performSearch = (orderNum: string, phone: string) => {
    const cleanOrderNum = orderNum.trim().toUpperCase().replace('#', '');
    const cleanPhone = normalizePhone(phone);

    if (!cleanOrderNum || !cleanPhone) {
      setErrorMessage('Please enter both your Order ID and registered 10-digit Phone Number.');
      setMatchedOrder(null);
      setSearched(true);
      return;
    }

    setErrorMessage(null);
    setSearched(true);

    const found = orders.find((o) => {
      const matchOrder =
        o.orderNumber.toUpperCase() === cleanOrderNum ||
        o.id.toUpperCase() === cleanOrderNum ||
        o.orderNumber.toUpperCase().endsWith(cleanOrderNum);

      const matchPhone = normalizePhone(o.phone) === cleanPhone;
      return matchOrder && matchPhone;
    });

    if (found) {
      setMatchedOrder(found);
      setErrorMessage(null);
    } else {
      setMatchedOrder(null);
      setErrorMessage(
        `We could not find an order matching "${orderNum.trim()}" with phone ending in "${cleanPhone.slice(-4)}". Please check the details or reach out directly to our Kurukshetra showroom team.`
      );
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(orderIdInput, phoneInput);
  };

  const handleCopyTracking = (trackNum: string) => {
    navigator.clipboard.writeText(trackNum);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleWhatsAppHelp = (order: Order) => {
    const text = encodeURIComponent(
      `Hello The Western Store team, I am checking the status of my Order ${order.orderNumber} (Customer: ${order.customerName}, Phone: ${order.phone}). Could you please give me an update?`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  // Helper for progress status milestones
  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'Pending WhatsApp':
        return 1;
      case 'Contacted':
      case 'Confirmed':
      case 'Paid':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  // Status color styles
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending WhatsApp':
        return {
          label: 'Pending WhatsApp Verification',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'Contacted':
        return {
          label: 'Stylist Contacted via WhatsApp',
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'Confirmed':
        return {
          label: 'Confirmed & Packing at Store',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
        };
      case 'Paid':
        return {
          label: 'Payment Verified',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
        };
      case 'Shipped':
        return {
          label: 'Dispatched & In Transit',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
        };
      case 'Delivered':
        return {
          label: 'Delivered',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
        };
      case 'Cancelled':
        return {
          label: 'Order Cancelled',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        };
      default:
        return {
          label: status,
          bg: 'bg-gray-50 text-gray-800 border-gray-200',
          dot: 'bg-gray-400',
        };
    }
  };

  const activeStep = matchedOrder ? getStatusStep(matchedOrder.status) : 1;
  const statusBadge = matchedOrder ? getStatusBadge(matchedOrder.status) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-[#FAF7F0] min-h-screen py-6 sm:py-12 w-full max-w-full overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-6 w-full">
        {/* Navigation Back & Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setView('home')}
            className="inline-flex items-center gap-1.5 text-xs text-[#736B63] hover:text-[#721B29] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
          <div className="flex items-center gap-1 text-xs text-[#8C8276]">
            <span>Account</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#721B29] font-medium">Order Status & Tracking</span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721B29]/10 text-[#721B29] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Package className="w-3.5 h-3.5" />
            <span>Live Order Tracking</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#242120] tracking-tight">
            Check Your Order Status
          </h1>
          <p className="text-xs sm:text-sm text-[#736B63] mt-2 leading-relaxed">
            Enter your Order ID and the phone number provided at checkout to track packing,
            dispatch, and courier shipment directly from our Kurukshetra boutique.
          </p>
        </div>

        {/* Lookup Card */}
        <div
          id="order-tracking-lookup-card"
          className="bg-white rounded-xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm mb-8"
        >
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="track-order-id-input"
                  className="block text-xs font-semibold text-[#242120] uppercase tracking-wider mb-1.5"
                >
                  Order ID / Reference <span className="text-[#721B29]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="track-order-id-input"
                    type="text"
                    required
                    placeholder="e.g. TWS-2026-1001"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F0] border border-[#D9CEBF] rounded-sm text-sm text-[#242120] focus:bg-white focus:outline-none focus:border-[#721B29] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[#8C8276] mt-1">
                  Sent on WhatsApp or confirmation screen
                </p>
              </div>

              <div>
                <label
                  htmlFor="track-phone-input"
                  className="block text-xs font-semibold text-[#242120] uppercase tracking-wider mb-1.5"
                >
                  Registered Phone Number <span className="text-[#721B29]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="track-phone-input"
                    type="tel"
                    required
                    placeholder="e.g. 9812345678"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F0] border border-[#D9CEBF] rounded-sm text-sm text-[#242120] focus:bg-white focus:outline-none focus:border-[#721B29] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[#8C8276] mt-1">10-digit mobile number</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                id="track-order-submit-btn"
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-[#721B29] text-white hover:bg-[#852031] font-medium text-xs tracking-wider uppercase rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Track Order Status</span>
              </button>

              <span className="text-[11px] text-[#8C8276] text-center sm:text-right flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Direct real-time link to Kurukshetra store admin</span>
              </span>
            </div>
          </form>
        </div>

        {/* Error State */}
        {errorMessage && (
          <div
            id="order-tracking-error"
            className="bg-white rounded-xl border border-rose-200 p-6 text-center shadow-xs mb-8 animate-in fade-in duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#242120] mb-1">
              Order Details Not Found
            </h3>
            <p className="text-xs text-[#736B63] max-w-md mx-auto mb-4">{errorMessage}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const text = encodeURIComponent(
                    `Hi The Western Store, I am trying to track my order (${orderIdInput || 'ID'}), but it says not found. Could you please check?`
                  );
                  window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${text}`, '_blank');
                }}
                className="px-4 py-2 bg-emerald-700 text-white rounded-sm text-xs font-medium hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Verify on WhatsApp (9729515288)</span>
              </button>
            </div>
          </div>
        )}

        {/* Order Found Details */}
        {matchedOrder && statusBadge && (
          <div
            id={`tracked-order-${matchedOrder.id}`}
            className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            {/* Top Status Banner */}
            <div className="bg-white rounded-xl border border-[#EAE4D9] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F3EFE6]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-[#8C8276] font-semibold">
                      Order Reference
                    </span>
                    <span className="font-mono text-sm font-bold text-[#721B29]">
                      #{matchedOrder.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-[#736B63] mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Placed on {new Date(matchedOrder.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${statusBadge.bg}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusBadge.dot} animate-pulse`} />
                    <span>{statusBadge.label}</span>
                  </div>
                </div>
              </div>

              {/* Progress Milestones Stepper */}
              {matchedOrder.status !== 'Cancelled' ? (
                <div className="pt-8 pb-4">
                  <div className="relative">
                    {/* Stepper Line Background */}
                    <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#EAE4D9] -z-0 hidden sm:block" />
                    {/* Stepper Active Line */}
                    <div
                      className="absolute top-4 left-6 h-0.5 bg-[#721B29] transition-all duration-700 hidden sm:block"
                      style={{
                        width:
                          activeStep === 1
                            ? '0%'
                            : activeStep === 2
                            ? '33%'
                            : activeStep === 3
                            ? '66%'
                            : 'calc(100% - 48px)',
                      }}
                    />

                    {/* Step Nodes */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
                      {/* Step 1 */}
                      <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            activeStep >= 1
                              ? 'bg-[#721B29] border-[#721B29] text-white'
                              : 'bg-white border-[#D9CEBF] text-[#8C8276]'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#242120]">Order Placed</p>
                          <p className="text-[11px] text-[#8C8276]">WhatsApp Request Logged</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            activeStep >= 2
                              ? 'bg-[#721B29] border-[#721B29] text-white'
                              : 'bg-white border-[#D9CEBF] text-[#8C8276]'
                          }`}
                        >
                          {activeStep > 2 ? <Check className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#242120]">Confirmed & Packed</p>
                          <p className="text-[11px] text-[#8C8276]">Inspected at Kurukshetra</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            activeStep >= 3
                              ? 'bg-[#721B29] border-[#721B29] text-white'
                              : 'bg-white border-[#D9CEBF] text-[#8C8276]'
                          }`}
                        >
                          {activeStep > 3 ? <Check className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#242120]">Dispatched</p>
                          <p className="text-[11px] text-[#8C8276]">Handed to Courier Partner</p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            activeStep >= 4
                              ? 'bg-emerald-700 border-emerald-700 text-white'
                              : 'bg-white border-[#D9CEBF] text-[#8C8276]'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#242120]">Delivered</p>
                          <p className="text-[11px] text-[#8C8276]">Package Handed Over</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-rose-700 font-medium">
                    This order has been marked as cancelled. Please message our store for any refund or
                    replacement queries.
                  </p>
                </div>
              )}
            </div>

            {/* Courier & Shipping Tracking Card (Admin-Managed Data) */}
            <div className="bg-white rounded-xl border border-[#EAE4D9] p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#F3EFE6]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#721B29]" />
                  <h3 className="font-serif text-base font-bold text-[#242120]">
                    Courier & Shipment Details
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs">
                  Admin Verified
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 bg-[#FAF7F0] rounded-md border border-[#EAE4D9]">
                  <p className="text-[11px] uppercase tracking-wider text-[#8C8276] font-medium">
                    Courier Partner
                  </p>
                  <p className="text-sm font-semibold text-[#242120] mt-1">
                    {matchedOrder.courierName || 'Assigned upon packing'}
                  </p>
                  <p className="text-[11px] text-[#736B63] mt-0.5">
                    {matchedOrder.courierName
                      ? 'Express surface/air dispatch'
                      : 'Standard insured dispatch'}
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF7F0] rounded-md border border-[#EAE4D9]">
                  <p className="text-[11px] uppercase tracking-wider text-[#8C8276] font-medium">
                    AWB / Tracking Number
                  </p>
                  {matchedOrder.trackingNumber ? (
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-sm font-bold text-[#721B29]">
                        {matchedOrder.trackingNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyTracking(matchedOrder.trackingNumber || '')}
                        className="p-1 text-[#736B63] hover:text-[#721B29] transition-colors"
                        title="Copy tracking number"
                      >
                        {copiedTracking ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-[#736B63] italic mt-1">
                      Generated once package leaves showroom
                    </p>
                  )}
                  {matchedOrder.shippedDate && (
                    <p className="text-[11px] text-[#736B63] mt-0.5">
                      Shipped: {matchedOrder.shippedDate}
                    </p>
                  )}
                  {matchedOrder.estimatedDelivery && (
                    <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                      Expected ETA: {matchedOrder.estimatedDelivery}
                    </p>
                  )}
                </div>

                <div className="p-3.5 bg-[#FAF7F0] rounded-md border border-[#EAE4D9] flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#8C8276] font-medium">
                      Live Courier Link
                    </p>
                    <p className="text-xs text-[#736B63] mt-1">
                      {matchedOrder.trackingLink
                        ? 'Track directly on official carrier portal'
                        : 'Link available once in transit'}
                    </p>
                  </div>
                  {matchedOrder.trackingLink ? (
                    <a
                      href={matchedOrder.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#721B29] text-white hover:bg-[#852031] text-xs font-medium rounded-xs transition-colors"
                    >
                      <span>Open Carrier Tracker</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleWhatsAppHelp(matchedOrder)}
                      className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#EAE4D9] hover:bg-[#D0C5B4] text-[#242120] text-xs font-medium rounded-xs transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Ask Courier ETA on WhatsApp</span>
                    </button>
                  )}
                </div>
              </div>

              {matchedOrder.trackingNotes && (
                <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-md text-xs text-amber-950 flex items-start gap-2">
                  <Truck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-900 block">Dispatch & Packaging Note:</span>
                    <span>{matchedOrder.trackingNotes}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Items in Order & Delivery Address */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Items column */}
              <div className="md:col-span-7 bg-white rounded-xl border border-[#EAE4D9] p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[#F3EFE6]">
                  <h3 className="font-serif text-base font-bold text-[#242120]">
                    Ordered Outfits ({matchedOrder.items.length})
                  </h3>
                  <span className="text-xs text-[#8C8276]">Kurukshetra Collection</span>
                </div>

                <div className="divide-y divide-[#F3EFE6]">
                  {matchedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex gap-3.5 items-center">
                      <img
                        src={getOptimizedImageUrl(item.image, 180, 80)}
                        alt={item.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                        }}
                        className="w-16 h-20 object-cover object-top rounded-md border border-[#EAE4D9] bg-[#F4EFE6] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-semibold text-[#242120] truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#736B63] mt-1">
                          {item.size && (
                            <span className="bg-[#FAF7F0] px-1.5 py-0.5 rounded-xs border border-[#EAE4D9]">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="bg-[#FAF7F0] px-1.5 py-0.5 rounded-xs border border-[#EAE4D9]">
                              {item.color}
                            </span>
                          )}
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <p className="font-sans text-sm font-bold text-[#721B29] mt-1.5">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#F3EFE6] space-y-1.5 text-xs text-[#736B63]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#242120]">
                      ₹{matchedOrder.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-semibold">
                      {matchedOrder.shippingFee === 0 ? 'FREE (Pan-India)' : `₹${matchedOrder.shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#242120] pt-2 border-t border-[#F3EFE6]">
                    <span>Total Amount</span>
                    <span className="font-sans text-base text-[#721B29]">
                      ₹{matchedOrder.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Customer details */}
              <div className="md:col-span-5 bg-white rounded-xl border border-[#EAE4D9] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#242120] pb-3 border-b border-[#F3EFE6] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#721B29]" />
                    <span>Delivery Address</span>
                  </h3>

                  <div className="mt-4 space-y-2 text-xs text-[#4A453E]">
                    <p className="font-bold text-sm text-[#242120]">{matchedOrder.customerName}</p>
                    <p className="flex items-center gap-1.5 text-[#736B63]">
                      <Phone className="w-3.5 h-3.5 text-[#721B29]" />
                      <span>{matchedOrder.phone}</span>
                    </p>
                    <p className="leading-relaxed text-[#5C544B] pt-1">
                      {matchedOrder.address}
                      <br />
                      {matchedOrder.city}, {matchedOrder.state} -{' '}
                      <span className="font-semibold text-[#242120]">{matchedOrder.pincode}</span>
                    </p>

                    {matchedOrder.notes && (
                      <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200/70 rounded text-[11px] text-[#8C3E00]">
                        <span className="font-bold">Customer Note:</span> {matchedOrder.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* WhatsApp Help CTA */}
                <div className="mt-6 pt-4 border-t border-[#F3EFE6]">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppHelp(matchedOrder)}
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat with Kurukshetra Showroom</span>
                  </button>
                  <p className="text-[10px] text-center text-[#8C8276] mt-2">
                    Need size alteration or expedited delivery? We are 1 message away!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
