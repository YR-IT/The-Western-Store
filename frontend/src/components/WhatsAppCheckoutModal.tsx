import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import { X, Send, ShieldCheck, ShoppingBag, MapPin, Phone, User, CheckCircle2, Package } from 'lucide-react';

export const WhatsAppCheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartSubtotal,
    submitWhatsAppOrder,
    lastPlacedOrder,
    setLastPlacedOrder,
    openOrderTracking,
    currentUser,
    openAuthModal,
  } = useStore();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: '',
    email: currentUser?.email || '',
    address: '',
    pincode: '136118',
    city: 'Kurukshetra',
    state: 'Haryana',
    notes: '',
  });

  // Update formData when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
      }));
    }
  }, [currentUser]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderInfo, setSuccessOrderInfo] = useState<{ orderNumber: string; waUrl: string } | null>(null);

  if (!isCheckoutModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { orderNumber, waUrl } = await submitWhatsAppOrder(formData);
      setSuccessOrderInfo({ orderNumber, waUrl });
      setIsSubmitting(false);

      // Open WhatsApp in a new tab
      window.open(waUrl, '_blank');
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again or contact us directly.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setSuccessOrderInfo(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-[#FDFBF7] rounded-xl shadow-2xl border border-[#E0D7C8] overflow-hidden z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EAE4D9] flex items-center justify-between bg-[#F8F5EE]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-700/10 text-emerald-800 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#242120]">
                {successOrderInfo ? 'Order Created!' : 'Delivery Details & WhatsApp Order'}
              </h3>
              <p className="text-[11px] text-[#736B63]">
                {successOrderInfo ? 'Ready for confirmation on WhatsApp' : 'Dispatch directly from Kurukshetra store'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-[#4A453E] hover:text-[#721B29] rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {successOrderInfo ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#B8860B]">
                  Status: Pending WhatsApp Confirmation
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#242120]">
                  Order #{successOrderInfo.orderNumber}
                </h4>
                <p className="text-xs text-[#736B63] max-w-sm mx-auto">
                  Your order record has been created in our store database. If WhatsApp didn't open automatically, click the button below to send your pre-filled cart details to our Kurukshetra team.
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <a
                  href={successOrderInfo.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-sm shadow-md transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Open WhatsApp to Confirm (📲 9729515288)</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    openOrderTracking(successOrderInfo.orderNumber, formData.phone);
                  }}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#FAF7F0] border border-[#D9CEBF] hover:bg-[#EAE4D9] text-[#242120] font-medium text-xs rounded-sm transition-colors cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-[#721B29]" />
                  <span>Track This Order Live</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-[#721B29] hover:underline block mx-auto pt-2"
              >
                Back to Shopping
              </button>
            </div>
          ) : (
            <form id="whatsapp-checkout-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Cart Summary Header */}
              <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#EAE4D9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#721B29]" />
                  <span className="font-medium text-[#242120]">
                    {cart.length} item{cart.length > 1 ? 's' : ''} in Bag
                  </span>
                </div>
                <span className="font-bold text-[#721B29] text-sm font-sans">
                  Total: ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Customer Account Indicator */}
              {currentUser ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full border border-emerald-600 object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-emerald-950">{currentUser.name}</p>
                      <p className="text-[10px] text-emerald-700">{currentUser.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                    Linked Account
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-[#721B29]/10 border border-[#721B29]/20 rounded-lg flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-[#721B29]">Have a Google Account?</p>
                    <p className="text-[10px] text-[#52131D]">Link your account to track this order easily.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('customer', 'Sign in with Google to align your cart and orders.')}
                    className="px-3 py-1.5 bg-[#721B29] text-white text-xs font-bold rounded-xs shadow-xs hover:bg-[#52131D] shrink-0"
                  >
                    Google Sign-In
                  </button>
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block font-medium text-[#242120] mb-1">
                  Full Name <span className="text-[#721B29]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#998F82] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Verma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-medium text-[#242120] mb-1">
                  WhatsApp Mobile Number <span className="text-[#721B29]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#998F82] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98123 45678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                </div>
                <p className="text-[10px] text-[#8C8276] mt-0.5">
                  Our store representative will confirm order details and share live videos/photos on this number.
                </p>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block font-medium text-[#242120] mb-1">
                  Complete Delivery Address <span className="text-[#721B29]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#998F82] absolute left-3 top-2.5" />
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No., Landmark, Colony/Sector"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                </div>
              </div>

              {/* City, State & Pincode */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-[#242120] mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="136118"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#242120] mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Kurukshetra"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#242120] mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Haryana"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                </div>
              </div>

              {/* Special Note / Sizing requirements */}
              <div>
                <label className="block font-medium text-[#242120] mb-1">
                  Optional Sizing or Alteration Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saree waist 30in, urgent dispatch for Saturday"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                />
              </div>

              {/* Information pill */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>No Upfront Payment Required Now</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-800 font-light">
                  Clicking "Proceed to WhatsApp" formats your cart and opens a conversation with <strong>The Western Store Kurukshetra</strong>. You can verify stock, ask for videos, and pay via UPI/QR or Bank Transfer directly with the store.
                </p>
              </div>

              {/* Policy Notice */}
              <div className="p-2.5 rounded-lg bg-amber-50/90 border border-amber-200 text-[#8C3E00] text-[11px] font-medium flex items-center gap-2">
                <span>⚠️ Note: All garments are sold under a strict <strong>No Exchange & No Return Policy</strong>.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Confirm & Open WhatsApp (wa.me/919729515288)</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
