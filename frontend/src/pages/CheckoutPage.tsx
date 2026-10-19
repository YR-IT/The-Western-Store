import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import { SEOHead } from '../components/common/SEOHead';
import { getOptimizedImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';
import { loadRazorpayScript, RazorpayOptions } from '../utils/razorpay';
import {
  ShieldCheck,
  CreditCard,
  Send,
  Lock,
  ArrowLeft,
  Truck,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  Mail,
  Loader2,
} from 'lucide-react';
import { CartItem } from '../types';

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    cart,
    cartSubtotal,
    clearCart,
    currentUser,
    orders,
  } = useStore();

  // Check if this is an isolated "Buy Now" checkout (single item, does not touch shopping cart)
  const buyNowItem: CartItem | null = (location.state as any)?.buyNowItem || null;
  const isBuyNow = Boolean(buyNowItem);

  const activeItems: CartItem[] = isBuyNow && buyNowItem ? [buyNowItem] : cart;
  const activeSubtotal = isBuyNow && buyNowItem
    ? buyNowItem.price * buyNowItem.quantity
    : cartSubtotal;

  // Form State
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    state: 'Haryana',
    pincode: '',
    notes: '',
  });

  const [agreedToPolicies, setAgreedToPolicies] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If user arrives at checkout with 0 items, redirect to cart or shop
  useEffect(() => {
    if (!isBuyNow && cart.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [isBuyNow, cart.length, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleRazorpayPayment = async (orderId: string, orderNumber: string) => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded || !window.Razorpay) {
      throw new Error('Razorpay SDK could not be loaded. Please check your internet connection and try again.');
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    // 1. Create order on backend
    const res = await fetch(`${backendUrl}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: activeItems,
        formData,
        userId: currentUser?.id || null,
        orderId,
        orderNumber,
        isBuyNow,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to initialize payment.');
    }

    const { razorpayOrderId, amount, currency, keyId } = data;

    // 2. Open Razorpay Modal
    return new Promise<void>((resolve, reject) => {
      const options: RazorpayOptions = {
        key: keyId || (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || '',
        amount,
        currency: currency || 'INR',
        name: 'The Western Store',
        description: `Order #${orderNumber}`,
        image: 'https://ik.imagekit.io/thewesternstore/logo/Logo_Final.jpg',
        order_id: razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#721B29',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setErrorMessage('Payment window was closed. Please retry to complete your purchase.');
          },
        },
        handler: async (response) => {
          try {
            // 3. Verify signature on backend
            const verifyRes = await fetch(`${backendUrl}/api/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }

            // Clear cart if this was standard cart checkout
            if (!isBuyNow) {
              clearCart();
            }

            // Navigate to Order Confirmation
            navigate(`/order-confirmation/${orderId}`, {
              state: {
                order: {
                  id: orderId,
                  orderNumber,
                  customerName: formData.name,
                  customerPhone: formData.phone,
                  shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                  },
                  total: activeSubtotal,
                  paymentMethod: 'razorpay',
                  paymentStatus: 'paid',
                  items: activeItems,
                },
              },
            });
            resolve();
          } catch (err: any) {
            reject(err);
          }
        },
      };

      const rzp = new window.Razorpay!(options);
      rzp.open();
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!agreedToPolicies) {
      setErrorMessage('Please accept the store policies and Final Sale terms to continue.');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    setIsProcessing(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TWS-2026-${randomSuffix}`;
    const orderId = `order-${Date.now()}`;

    try {
      await handleRazorpayPayment(orderId, orderNumber);
    } catch (err: any) {
      console.error('[Checkout Submission Error]', err);
      setErrorMessage(err.message || 'Payment could not be completed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-12">
      <SEOHead
        title="Secure Checkout | The Western Store Kurukshetra"
        description="Complete your order for handcrafted ethnic wear and designer western coordinates."
        noIndex={true}
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#736B63] hover:text-[#721B29] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to browsing</span>
          </button>

          {isBuyNow && (
            <span className="text-xs font-bold text-[#721B29] bg-[#721B29]/10 px-3 py-1 rounded-full border border-[#721B29]/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Direct Buy Now Checkout</span>
            </span>
          )}
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#242120] mb-6 sm:mb-8 tracking-tight">
          Checkout & Shipping
        </h1>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Notice</p>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Payment Selection (7 cols) */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer & Delivery Details */}
            <div className="bg-white border border-[#EAE4D9] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F4EFE6] pb-3">
                <div className="w-6 h-6 rounded-full bg-[#721B29] text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h2 className="font-serif text-base font-bold text-[#242120]">
                  Shipping & Contact Details
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">
                    Full Name <span className="text-[#721B29]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs border border-[#D9CEBF] rounded-xl bg-[#FAF8F3] focus:outline-none focus:border-[#721B29] pl-9"
                    />
                    <User className="w-4 h-4 text-[#A39B8F] absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">
                    Phone / WhatsApp <span className="text-[#721B29]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs border border-[#D9CEBF] rounded-xl bg-[#FAF8F3] focus:outline-none focus:border-[#721B29] pl-9"
                    />
                    <Phone className="w-4 h-4 text-[#A39B8F] absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] mb-1">
                  Email Address (for invoice & tracking updates)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="priya@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#D9CEBF] rounded-xl bg-[#FAF8F3] focus:outline-none focus:border-[#721B29] pl-9"
                  />
                  <Mail className="w-4 h-4 text-[#A39B8F] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] mb-1">
                  Street Address & House / Flat No. <span className="text-[#721B29]">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="address"
                    required
                    rows={2}
                    placeholder="House / Flat No., Building, Street Name, Landmark"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#D9CEBF] rounded-xl bg-[#FAF8F3] focus:outline-none focus:border-[#721B29] pl-9 resize-none"
                  />
                  <MapPin className="w-4 h-4 text-[#A39B8F] absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">
                    City / Town <span className="text-[#721B29]">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Kurukshetra"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-xs border border-[#D9CEBF] rounded-xl bg-[#FAF8F3] focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">
                    State <span className="text-[#721B29]">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="Haryana"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-xs border border-[#D9CEBF] rounded-xl bg-[#FAF8F3] focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">
                    PIN Code <span className="text-[#721B29]">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="136118"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-xs border border-[#D9CEBF] rounded-xl bg-[#FAF8F3] focus:outline-none focus:border-[#721B29]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] mb-1">
                  Customization Note / Fitting instructions (optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="e.g. Please shorten saree fall / gift packaging"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#D9CEBF] rounded-xl bg-[#FAF8F3] focus:outline-none focus:border-[#721B29]"
                />
              </div>
            </div>

            {/* Step 2: Payment Method Selection */}
            <div className="bg-white border border-[#EAE4D9] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F4EFE6] pb-3">
                <div className="w-6 h-6 rounded-full bg-[#721B29] text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <h2 className="font-serif text-base font-bold text-[#242120]">
                  Payment Method
                </h2>
              </div>

              <div className="p-4 rounded-xl border-2 border-[#721B29] bg-[#721B29]/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-[#242120] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#721B29]" />
                    <span>Razorpay Secure Online Checkout</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Instant & 256-bit Encrypted</span>
                  </span>
                </div>
                <p className="text-xs text-[#736B63] leading-relaxed">
                  Supports all major Indian payment methods: <strong>UPI (Google Pay, PhonePe, Paytm, BHIM)</strong>, <strong>Credit & Debit Cards (Visa, Mastercard, RuPay)</strong>, <strong>NetBanking (50+ Banks)</strong>, and <strong>Wallets</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#8C8276]">
                  <span className="bg-white px-2 py-0.5 rounded border border-[#EAE4D9] font-medium">⚡ Instant Payment Confirmation</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-[#EAE4D9] font-medium">🔒 RBI & PCI-DSS Compliant</span>
                </div>
              </div>
            </div>

            {/* Step 3: Terms & Policy Acknowledgment */}
            <div className="bg-[#FAF8F3] border border-[#EAE4D9] rounded-xl p-4 space-y-3 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToPolicies}
                  onChange={(e) => setAgreedToPolicies(e.target.checked)}
                  className="mt-0.5 text-[#721B29] rounded focus:ring-[#721B29]"
                />
                <span className="text-[#5C544B] leading-relaxed">
                  I acknowledge and accept the{' '}
                  <Link to="/policies/refund-policy" target="_blank" className="font-bold text-[#721B29] underline">
                    No Exchange & No Return Policy (Final Sale)
                  </Link>{' '}
                  and agree to the{' '}
                  <Link to="/policies/terms" target="_blank" className="font-bold text-[#721B29] underline">
                    Terms & Conditions
                  </Link>.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <button
              id="checkout-submit-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 bg-[#721B29] hover:bg-[#5B1520] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Your Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#E6C280]" />
                  <span>Pay ₹{activeSubtotal.toLocaleString('en-IN')} via Razorpay</span>
                </>
              )}
            </button>
          </form>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#EAE4D9] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 sticky top-28">
              <h2 className="font-serif text-base font-bold text-[#242120] border-b border-[#F4EFE6] pb-3">
                Order Summary ({activeItems.length} {activeItems.length === 1 ? 'item' : 'items'})
              </h2>

              {/* Items List */}
              <div className="divide-y divide-[#F4EFE6] max-h-72 overflow-y-auto pr-1">
                {activeItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                    <img
                      src={getOptimizedImageUrl(item.product.images[0], 140, 80)}
                      alt={item.product.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                      }}
                      className="w-14 h-18 object-cover object-top rounded-sm border border-[#EAE4D9] bg-[#F4EFE6] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-xs font-bold text-[#242120] truncate">
                        {item.product.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-[#736B63] mt-0.5">
                        <span>Size: <strong className="text-[#242120]">{item.size || 'Free Size'}</strong></span>
                        <span>•</span>
                        <span>Qty: <strong className="text-[#242120]">{item.quantity}</strong></span>
                      </div>
                      <p className="font-sans text-xs font-bold text-[#721B29] mt-1">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-[#EAE4D9] pt-4 space-y-2 text-xs text-[#5C544B]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#242120]">₹{activeSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-emerald-700">Calculated / Standard Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Dispatch</span>
                  <span className="font-semibold text-[#242120]">Within 24-48 Hours</span>
                </div>
                <div className="pt-3 border-t border-[#EAE4D9] flex justify-between font-bold text-base text-[#242120]">
                  <span>Total Payable</span>
                  <span className="text-[#721B29]">₹{activeSubtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="pt-2 border-t border-[#EAE4D9] space-y-2 text-[11px] text-[#736B63]">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>100% Authentic Handcrafted Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#721B29]" />
                  <span>Courier tracking link sent on WhatsApp/SMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
