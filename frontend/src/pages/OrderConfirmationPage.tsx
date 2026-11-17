import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import { SEOHead } from '../components/common/SEOHead';
import { getOptimizedImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';
import {
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Clock,
  Phone,
  MapPin,
  ExternalLink,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { Order } from '../types';
import { resolveTrackingUrl } from '../utils/tracking';
import { getBackendUrl } from '../utils/backendUrl';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, addOrder, clearCart } = useStore();

  const cfOrderIdParam = searchParams.get('order_id');

  const [order, setOrder] = useState<Order | null>(() => {
    if ((location.state as any)?.order) {
      return (location.state as any).order;
    }
    try {
      const savedPending = localStorage.getItem('tws_pending_order');
      if (savedPending) {
        return JSON.parse(savedPending);
      }
    } catch {}
    return null;
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedAwb, setCopiedAwb] = useState<string | null>(null);

  useEffect(() => {
    // 1. Try resolving immediately from in-memory / local storage orders
    if (orderId) {
      const found = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (found) {
        setOrder((prev) => (prev ? { ...prev, ...found } : found));
      }
    }

    // 2. Authoritative verification with backend (especially on 3DS browser redirect)
    const targetToVerify = cfOrderIdParam || orderId;
    const backendUrl = getBackendUrl();

    if (targetToVerify) {
      setIsVerifying(true);

      fetch(`${backendUrl}/api/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: targetToVerify,
          orderId,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.verified && data.order) {
            const row = data.order;
            const trackingUrl = resolveTrackingUrl(row.courier_name, row.tracking_number, row.tracking_link);
            const normalized: Order = {
              id: row.id || orderId || `ord_${Date.now()}`,
              orderNumber: row.order_number || row.orderNumber || data.orderNumber || orderId || 'TWS-ORDER',
              createdAt: row.created_at || row.createdAt || new Date().toISOString(),
              customerName: row.customer_name || row.customerName || order?.customerName || 'Customer',
              phone: row.customer_phone || row.phone || order?.phone || '',
              email: row.customer_email || row.email || order?.email,
              address: row.shipping_address?.address || row.address || order?.address || 'Provided during checkout',
              pincode: row.shipping_address?.pincode || row.pincode || order?.pincode || '',
              city: row.shipping_address?.city || row.city || order?.city || '',
              state: row.shipping_address?.state || row.state || order?.state || '',
              notes: row.notes || row.shipping_address?.notes || order?.notes,
              items: Array.isArray(row.items) && row.items.length > 0 ? row.items : (order?.items || []),
              subtotal: Number(row.total_amount ?? row.subtotal ?? order?.subtotal ?? row.total ?? 0),
              shippingFee: 0,
              total: Number(row.total_amount ?? row.total ?? order?.total ?? row.subtotal ?? 0),
              status: (row.status as any) || 'Paid',
              paymentMethod: 'cashfree',
              courierName: row.courier_name,
              trackingNumber: row.tracking_number,
              trackingLink: trackingUrl || row.tracking_link,
            };

            setOrder(normalized);
            addOrder(normalized);
            clearCart();
            try {
              localStorage.removeItem('tws_pending_order');
            } catch {}
          }
        })
        .catch((err) => {
          console.warn('[OrderConfirmation Verification Notice]', err);
        })
        .finally(() => {
          setIsVerifying(false);
        });

      // Always fetch latest authoritative tracking and status details
      const cleanTarget = (targetToVerify || '').replace(/^#/, '').trim();
      fetch(`${backendUrl}/api/orders/lookup/${encodeURIComponent(cleanTarget)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && data.order) {
            const row = data.order;
            const trackingUrl = resolveTrackingUrl(row.courier_name, row.tracking_number, row.tracking_link);
            setOrder((prev) => {
              const updated: Order = {
                ...(prev || {}),
                id: row.id || prev?.id || `ord_${Date.now()}`,
                orderNumber: row.order_number || prev?.orderNumber || cleanTarget,
                createdAt: row.created_at || prev?.createdAt || new Date().toISOString(),
                customerName: row.customer_name || prev?.customerName || 'Customer',
                phone: row.customer_phone || prev?.phone || '',
                email: row.customer_email || prev?.email,
                address: row.shipping_address?.address || row.address || prev?.address || '',
                pincode: row.shipping_address?.pincode || row.pincode || prev?.pincode || '',
                city: row.shipping_address?.city || row.city || prev?.city || '',
                state: row.shipping_address?.state || row.state || prev?.state || '',
                items: Array.isArray(row.items) && row.items.length > 0 ? row.items : (prev?.items || []),
                total: Number(row.total_amount ?? prev?.total ?? 0),
                subtotal: Number(row.total_amount ?? prev?.subtotal ?? 0),
                shippingFee: 0,
                status: (row.status as any) || prev?.status || 'Paid',
                paymentMethod: 'cashfree',
                courierName: row.courier_name || prev?.courierName,
                trackingNumber: row.tracking_number || prev?.trackingNumber,
                trackingLink: trackingUrl || row.tracking_link || prev?.trackingLink,
              };
              addOrder(updated);
              return updated;
            });
          }
        })
        .catch(() => {});
    }
  }, [orderId, cfOrderIdParam, addOrder, clearCart]);

  const targetOrderNumber =
    order?.orderNumber ||
    ((order as any)?.order_number) ||
    (orderId && orderId.startsWith('TWS-') ? orderId : null) ||
    (cfOrderIdParam && cfOrderIdParam.startsWith('TWS_') ? cfOrderIdParam.replace(/_/g, '-') : null) ||
    (orderId && !orderId.includes('-') ? `TWS-${orderId}` : orderId) ||
    'TWS-ORDER';

  const trackLink = '/account/orders';
  const paymentMethodText =
    order?.paymentMethod === 'cashfree' || (order as any)?.paymentStatus === 'paid'
      ? 'Paid Online (Cashfree / UPI / Card / NetBanking)'
      : order?.paymentMethod
        ? String(order.paymentMethod)
        : 'Paid Online (Cashfree)';

  const waMessage = encodeURIComponent(
    `Hi The Western Store! 👋\nI just placed order *#${targetOrderNumber}* on your website.\nCould you please confirm receipt and dispatch details? Thank you!`
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-16">
      <SEOHead
        title={`Order Confirmation #${targetOrderNumber} | The Western Store`}
        description="Thank you for shopping with The Western Store Kurukshetra. Your boutique order is being prepared."
        noIndex={true}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Success Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/30 text-emerald-600 mx-auto flex items-center justify-center shadow-lg mb-4">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-200">
            Order Confirmed
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#242120] mt-3 tracking-tight">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-[#736B63] mt-2 max-w-md mx-auto leading-relaxed">
            Your order has been recorded in our Kurukshetra boutique system. Our team is now preparing your outfit.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-[#EAE4D9] rounded-2xl shadow-sm overflow-hidden mb-6"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#F8F5EE] border-b border-[#EAE4D9] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-[#736B63] uppercase tracking-wider font-semibold">
                Order Number
              </span>
              <p className="font-serif text-lg sm:text-xl font-bold text-[#721B29]">
                #{targetOrderNumber}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#736B63] uppercase tracking-wider font-semibold">
                Payment Status
              </span>
              <p className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                {isVerifying ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-800">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-700" /> Verifying...
                  </span>
                ) : (order as any)?.paymentStatus === 'paid' ||
                order?.paymentMethod === 'cashfree' ||
                order?.status === 'Paid'
                  ? 'Paid & Verified'
                  : 'Order Recorded'}
              </p>
            </div>
          </div>

          {/* Line Items List */}
          {order?.items && order.items.length > 0 && (
            <div className="p-4 sm:p-6 border-b border-[#EAE4D9] divide-y divide-[#F4EFE6]">
              <h2 className="font-serif text-sm font-bold text-[#242120] mb-3">
                Ordered Garments ({order.items.length})
              </h2>
              {order.items.map((item: any, idx) => {
                const title = item.product?.title || item.title || 'Boutique Item';
                const image =
                  item.product?.images?.[0] || item.image || FALLBACK_PRODUCT_IMAGE;
                return (
                <div key={idx} className="py-3 flex items-center gap-4 first:pt-0 last:pb-0">
                  <img
                    src={getOptimizedImageUrl(image, 160, 80)}
                    alt={title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                    }}
                    className="w-14 h-18 object-cover object-top rounded-sm border border-[#EAE4D9] bg-[#F4EFE6] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-xs sm:text-sm font-bold text-[#242120] truncate">
                      {title}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-[#736B63] mt-1">
                      <span>Size: <strong className="text-[#242120]">{item.size || 'Free Size'}</strong></span>
                      {item.color && <span>Color: <strong className="text-[#242120]">{item.color}</strong></span>}
                      <span>Qty: <strong className="text-[#242120]">{item.quantity}</strong></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-xs sm:text-sm font-bold text-[#721B29]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          )}

          {/* Summary Details */}
          <div className="p-4 sm:p-6 grid sm:grid-cols-2 gap-6 text-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#242120] mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#721B29]" />
                <span>Shipping Address</span>
              </div>
              <p className="font-semibold text-[#242120]">
                {order?.customerName || (order as any)?.customer_name || 'Customer'}
              </p>
              <p className="text-[#736B63] mt-0.5 whitespace-pre-line leading-relaxed">
                {order?.address ||
                  (order as any)?.shipping_address?.address ||
                  (order as any)?.shippingAddress?.address ||
                  'Provided during checkout'}
              </p>
              {(order?.city || (order as any)?.shipping_address?.city || (order as any)?.shippingAddress?.city) && (
                <p className="text-[#736B63]">
                  {order?.city || (order as any)?.shipping_address?.city || (order as any)?.shippingAddress?.city},{' '}
                  {order?.state || (order as any)?.shipping_address?.state || (order as any)?.shippingAddress?.state} —{' '}
                  {order?.pincode || (order as any)?.shipping_address?.pincode || (order as any)?.shippingAddress?.pincode}
                </p>
              )}
              <p className="text-[#736B63] mt-1">
                Phone: {order?.phone || (order as any)?.customer_phone || (order as any)?.customerPhone || '—'}
              </p>
            </div>

            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#EAE4D9] space-y-2">
              <div className="flex justify-between text-[#736B63]">
                <span>Payment Method</span>
                <span className="font-semibold text-[#242120] text-right">{paymentMethodText}</span>
              </div>
              <div className="flex justify-between text-[#736B63]">
                <span>Boutique Dispatch</span>
                <span className="font-semibold text-emerald-800">24 – 48 Hours</span>
              </div>
              <div className="pt-2 border-t border-[#EAE4D9] flex justify-between font-bold text-sm text-[#242120]">
                <span>Total Amount</span>
                <span className="text-[#721B29]">
                  ₹{Number(order?.total ?? (order as any)?.total_amount ?? (order as any)?.subtotal ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shipping & Tracking Card */}
        {order && (order.courierName || order.trackingNumber || order.trackingLink) && (() => {
          const trackingUrl = resolveTrackingUrl(order.courierName, order.trackingNumber, order.trackingLink);
          return (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE4D9] shadow-sm mb-6 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F4EFE6]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F3] border border-[#EAE4D9] flex items-center justify-center text-[#721B29] shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C8276] tracking-wider block">
                      Dispatched Shipment
                    </span>
                    <p className="font-bold text-sm text-[#242120] mt-0.5">
                      {order.courierName || 'Courier Partner Assigned'}
                    </p>
                  </div>
                </div>

                {trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#721B29] hover:bg-[#52131D] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
                  >
                    <span>Track Live on Courier Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {order.trackingNumber && (
                <div className="flex items-center gap-2 text-xs text-[#736B63] pt-1">
                  <span>AWB / Waybill Number:</span>
                  <strong className="font-mono text-[#242120] font-bold bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#D9CEBF]">
                    {order.trackingNumber}
                  </strong>
                  <button
                    type="button"
                    onClick={() => {
                      if (!order.trackingNumber) return;
                      navigator.clipboard.writeText(order.trackingNumber);
                      setCopiedAwb(order.trackingNumber);
                      setTimeout(() => setCopiedAwb(null), 2500);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white border border-[#D9CEBF] hover:border-[#721B29] rounded text-[#721B29] font-medium transition-colors cursor-pointer"
                    title="Copy AWB number"
                  >
                    {copiedAwb === order.trackingNumber ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          );
        })()}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to={trackLink}
            className="py-3.5 px-4 bg-white border border-[#D9CEBF] hover:border-[#721B29] text-[#242120] hover:text-[#721B29] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <Truck className="w-4 h-4 text-[#721B29]" />
            <span>My Orders</span>
          </Link>

          <Link
            to="/shop"
            className="py-3.5 px-4 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Quality Check Guarantee */}
        <div className="mt-8 p-4 bg-[#FAF8F3] border border-[#EAE4D9] rounded-xl flex items-center gap-3 text-xs text-[#736B63]">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="leading-relaxed">
            Every garment is individually inspected for seam perfection and hand-packed at our Kurukshetra boutique before shipping.
          </p>
        </div>
      </div>
    </div>
  );
};
