import React from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import { X, ShoppingBag, Trash2, Send, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
    setIsCheckoutModalOpen,
    setView,
  } = useStore();

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleGoToFullCart = () => {
    setIsCartOpen(false);
    setView('cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', stiffness: 340, damping: 34, mass: 0.9 }}
            className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl z-10 flex flex-col justify-between border-l border-[#EAE4D9]"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#EAE4D9] flex items-center justify-between bg-[#F8F5EE]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#721B29]" />
                <h3 className="font-serif text-lg font-bold text-[#242120]">Your Shopping Bag</h3>
                <motion.span
                  key={cart.length}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="text-xs text-[#721B29] font-semibold bg-[#721B29]/10 px-2 py-0.5 rounded-full"
                >
                  {cart.length}
                </motion.span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-[#4A453E] hover:text-[#721B29] rounded-full hover:bg-white transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Line Items */}
            <div className="p-5 overflow-y-auto flex-1 divide-y divide-[#F0EBE1]">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="py-16 text-center"
                >
                  <ShoppingBag className="w-12 h-12 text-[#C9BFB0] mx-auto mb-3" />
                  <p className="font-serif text-base font-semibold text-[#242120]">
                    Your shopping bag is empty
                  </p>
                  <p className="text-xs text-[#736B63] mt-1 max-w-xs mx-auto">
                    Explore our ready-to-wear sarees, lehengas, and western coordinates.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setView('plp');
                    }}
                    className="mt-5 px-5 py-2.5 bg-[#721B29] text-white text-xs font-semibold rounded-xs shadow-xs hover:bg-[#852031] transition-colors active:scale-95"
                  >
                    Start Shopping
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {cart.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.28, delay: idx * 0.04 }}
                      className="py-4 flex gap-4 first:pt-0 last:pb-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-20 h-26 object-cover object-top rounded-sm border border-[#EAE4D9] bg-[#F4EFE6] flex-shrink-0"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#242120] line-clamp-2 leading-snug">
                              {item.product.title}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#998F82] hover:text-[#721B29] transition-colors p-0.5 active:scale-90"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="mt-1 flex items-center gap-2 text-[11px] text-[#736B63]">
                            <span>Size: <strong className="text-[#242120]">{item.selectedSize}</strong></span>
                            <span>•</span>
                            <span>Color: <strong className="text-[#242120]">{item.selectedColor}</strong></span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          {/* Stepper */}
                          <div className="flex items-center border border-[#D9CEBF] rounded-xs bg-white text-xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-[#4A453E] hover:bg-[#F3EFE6] transition-colors"
                            >
                              −
                            </button>
                            <span className="px-2.5 py-0.5 font-semibold text-[#242120]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-[#4A453E] hover:bg-[#F3EFE6] transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-sans font-bold text-sm text-[#721B29]">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer & WhatsApp Checkout CTA */}
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 border-t border-[#EAE4D9] bg-[#FAF8F3] space-y-3"
                >
                  <div className="space-y-1.5 text-xs text-[#5C544B]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-sans font-bold text-base text-[#242120]">
                        ₹{cartSubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#8C8276]">
                      <span>Shipping</span>
                      <span>Calculated on WhatsApp / Worldwide</span>
                    </div>
                  </div>

                  {/* Single Prominent WhatsApp Checkout button */}
                  <motion.button
                    id="cart-drawer-checkout-whatsapp-btn"
                    type="button"
                    onClick={handleProceedToCheckout}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Checkout via WhatsApp</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={handleGoToFullCart}
                    className="w-full text-center text-xs text-[#721B29] font-medium hover:underline py-1"
                  >
                    View Full Cart Page & Details
                  </button>

                  <div className="pt-2 border-t border-[#EAE4D9] space-y-1.5 text-[10px] text-[#8C8276]">
                    <div className="flex items-center justify-center gap-1.5 text-[#8C2220] font-semibold">
                      <span>⚠️ Final Sale: Strict No Exchange & No Return Policy</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Direct confirmation with Kurukshetra store staff</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
