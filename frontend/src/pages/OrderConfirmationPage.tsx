import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
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
} from 'lucide-react';
import { Order } from '../types';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useStore();

  const [order, setOrder] = useState<Order | null>(
    (location.state as any)?.order || null
  );

  useEffect(() => {
    if (!order && orderId) {
      const found = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (found) {
        setOrder(found);
      }
    }
  }, [orderId, orders, order]);

  const targetOrderNumber = order?.orderNumber || orderId || 'TWS-ORDER';
  const paymentMethodText =
    order?.paymentMethod === 'razorpay'
      ? 'Paid Online (Razorpay / UPI / Card)'
      : 'WhatsApp Order / COD';

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
                {order?.paymentStatus === 'paid' ? 'Paid & Verified' : 'Order Recorded'}
              </p>
            </div>
          </div>

          {/* Line Items List */}
          {order?.items && order.items.length > 0 && (
            <div className="p-4 sm:p-6 border-b border-[#EAE4D9] divide-y divide-[#F4EFE6]">
              <h2 className="font-serif text-sm font-bold text-[#242120] mb-3">
                Ordered Garments ({order.items.length})
              </h2>
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-4 first:pt-0 last:pb-0">
                  <img
                    src={getOptimizedImageUrl(item.product.images[0], 160, 80)}
                    alt={item.product.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                    }}
                    className="w-14 h-18 object-cover object-top rounded-sm border border-[#EAE4D9] bg-[#F4EFE6] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-xs sm:text-sm font-bold text-[#242120] truncate">
                      {item.product.title}
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
              ))}
            </div>
          )}

          {/* Summary Details */}
          <div className="p-4 sm:p-6 grid sm:grid-cols-2 gap-6 text-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#242120] mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#721B29]" />
                <span>Shipping Address</span>
              </div>
              <p className="font-semibold text-[#242120]">{order?.customerName || 'Customer'}</p>
              <p className="text-[#736B63] mt-0.5 whitespace-pre-line leading-relaxed">
                {order?.shippingAddress?.address || 'Provided during checkout'}
              </p>
              {order?.shippingAddress?.city && (
                <p className="text-[#736B63]">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              )}
              <p className="text-[#736B63] mt-1">Phone: {order?.customerPhone}</p>
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
                  ₹{(order?.total || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* WhatsApp Direct Confirmation Button */}
          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Confirm Order Details on WhatsApp</span>
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to={`/track-order?orderId=${targetOrderNumber}`}
              className="py-3 px-4 bg-white border border-[#D9CEBF] hover:border-[#721B29] text-[#242120] hover:text-[#721B29] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Truck className="w-4 h-4 text-[#721B29]" />
              <span>Track Live Delivery Status</span>
            </Link>

            <Link
              to="/shop"
              className="py-3 px-4 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
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
