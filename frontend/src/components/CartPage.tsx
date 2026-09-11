import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import {
  ShoppingBag,
  Trash2,
  Send,
  ArrowLeft,
  ShieldCheck,
  Truck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    setIsCheckoutModalOpen,
    setView,
    navigateToProduct,
  } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-[#FDFBF7] py-6 sm:py-14 w-full max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        {/* Header & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#EAE4D9]">
          <div>
            <button
              type="button"
              onClick={() => setView('home')}
              className="inline-flex items-center gap-1.5 text-xs text-[#721B29] font-medium hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#242120] tracking-tight">
              Your Shopping Bag
            </h1>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-[#8C8276] hover:text-[#721B29] underline self-start sm:self-auto"
            >
              Empty Bag
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-12 text-center border border-[#EAE4D9] max-w-lg mx-auto"
          >
            <ShoppingBag className="w-14 h-14 text-[#C9BFB0] mx-auto mb-4" />
            <h2 className="font-serif text-xl font-bold text-[#242120]">
              Your shopping bag is currently empty
            </h2>
            <p className="text-xs text-[#736B63] mt-2 max-w-sm mx-auto leading-relaxed">
              Explore our fresh drop of stitched georgette sarees, lehengas, and western cord sets.
            </p>
            <button
              type="button"
              onClick={() => setView('plp')}
              className="mt-6 px-6 py-3 bg-[#721B29] text-white text-xs font-semibold rounded-sm shadow-md hover:bg-[#852031] transition-colors"
            >
              Explore Catalog
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Cart Items (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-[#EAE4D9] divide-y divide-[#F0EBE1]">
              <AnimatePresence>
                {cart.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5"
                  >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    onClick={() => navigateToProduct(item.product.id)}
                    className="w-24 sm:w-28 aspect-[3/4] object-cover object-top rounded-sm border border-[#EAE4D9] bg-[#F4EFE6] cursor-pointer"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#B8860B] tracking-wider">
                            {item.product.category}
                          </span>
                          <h3
                            onClick={() => navigateToProduct(item.product.id)}
                            className="font-serif text-base sm:text-lg font-bold text-[#242120] hover:text-[#721B29] cursor-pointer transition-colors leading-snug"
                          >
                            {item.product.title}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#998F82] hover:text-[#721B29] transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#5C544B]">
                        <span className="bg-[#FAF7F0] px-2 py-0.5 rounded-xs border border-[#EAE4D9]">
                          Size: <strong>{item.selectedSize}</strong>
                        </span>
                        <span className="bg-[#FAF7F0] px-2 py-0.5 rounded-xs border border-[#EAE4D9]">
                          Color: <strong>{item.selectedColor}</strong>
                        </span>
                        <span className="text-[#8C8276]">
                          Unit Price: ₹{item.product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F7F4EE] flex items-center justify-between">
                      {/* Stepper */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#736B63]">Quantity:</span>
                        <div className="flex items-center border border-[#D9CEBF] rounded-xs bg-white text-xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-[#4A453E] hover:bg-[#F3EFE6]"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 font-semibold text-[#242120]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-[#4A453E] hover:bg-[#F3EFE6]"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <span className="font-sans text-lg font-bold text-[#721B29]">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>

            {/* Right: Summary & WhatsApp Checkout (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-xl p-6 border border-[#EAE4D9] shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#242120] pb-3 border-b border-[#F0EBE1]">
                  Order Summary
                </h3>

                <div className="py-4 space-y-2.5 text-xs text-[#5C544B]">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-semibold text-[#242120]">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Shipping</span>
                    <span className="text-emerald-800 font-medium">Free across India</span>
                  </div>
                  <div className="flex justify-between">
                    <span>International Courier</span>
                    <span className="text-[#8C8276]">Available on Request</span>
                  </div>
                  <div className="pt-3 border-t border-[#F0EBE1] flex justify-between items-baseline">
                    <span className="font-serif text-base font-bold text-[#242120]">Estimated Total</span>
                    <span className="font-sans text-2xl font-bold text-[#721B29]">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Single prominent WhatsApp checkout button */}
                <button
                  id="cart-page-whatsapp-checkout-btn"
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-4 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-semibold text-sm rounded-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Checkout via WhatsApp</span>
                </button>

                <p className="mt-3 text-[11px] text-[#736B63] text-center leading-relaxed">
                  No automated card payment. You'll review sizing and payment with our Kurukshetra store staff directly on WhatsApp.
                </p>
              </div>

              {/* Kurukshetra Store Assurance */}
              <div className="bg-[#FAF7F0] rounded-xl p-5 border border-[#EAE4D9] space-y-3 text-xs text-[#5C544B]">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Personal Attention:</strong> Real store staff review each piece for thread perfection before dispatch.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-[#721B29] flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Dispatched From:</strong> Opp. Hotel Pearl Marc, Railway Road, Kurukshetra-136118.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#B8860B] flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Have a question?</strong> Tap to chat on <strong>📲 {STORE_INFO.phone}</strong> anytime.
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
