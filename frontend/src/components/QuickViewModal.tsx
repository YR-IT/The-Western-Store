import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Heart, ArrowRight, Check, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getOptimizedImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateToProduct,
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes?.[0] || 'Free Size');
      setSelectedColor(quickViewProduct.colors?.[0]?.name || '');
      setQuantity(1);
      setAdded(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  const handleAdd = () => {
    if (quickViewProduct.isSoldOut) return;
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  const handleGoToPDP = () => {
    navigateToProduct(quickViewProduct.id);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={() => setQuickViewProduct(null)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-xl shadow-2xl border border-[#EAE4D9] overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 text-[#242120] hover:text-[#721B29] hover:bg-white flex items-center justify-center shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-[#F4EFE6]">
            <img
              src={getOptimizedImageUrl(quickViewProduct.images[0], 800, 85)}
              alt={quickViewProduct.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
              }}
              className="w-full h-full object-cover object-top"
            />
            {quickViewProduct.onSale && (
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#721B29] text-white text-[10px] font-bold tracking-wider rounded-xs">
                {quickViewProduct.saleDiscount}
              </span>
            )}
            {!quickViewProduct.isSoldOut &&
              quickViewProduct.inStockCount !== undefined &&
              quickViewProduct.inStockCount > 0 &&
              quickViewProduct.inStockCount <= 5 && (
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 bg-[#C05621] text-white text-[10px] font-bold tracking-wide rounded-xs shadow-sm">
                  <Flame className="w-3 h-3 text-amber-200 fill-amber-200 shrink-0" />
                  <span>Only {quickViewProduct.inStockCount} left!</span>
                </span>
              )}
          </div>

          {/* Details & Select Options */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-[#B8860B]">
                {quickViewProduct.category}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#242120] mt-1 leading-snug">
                {quickViewProduct.title}
              </h3>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-sans font-bold text-xl text-[#721B29]">
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </span>
                {quickViewProduct.onSale && (
                  <span className="text-xs text-[#9B9285] line-through">
                    ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {!quickViewProduct.isSoldOut &&
                quickViewProduct.inStockCount !== undefined &&
                quickViewProduct.inStockCount > 0 &&
                quickViewProduct.inStockCount <= 5 && (
                  <div className="mt-2.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded text-[11px] text-[#8C3E00] flex items-center gap-1.5 font-medium">
                    <Flame className="w-3.5 h-3.5 text-[#C05621] fill-[#C05621] shrink-0" />
                    <span>Hurry! Only {quickViewProduct.inStockCount} {quickViewProduct.inStockCount === 1 ? 'piece' : 'pieces'} left in stock!</span>
                  </div>
                )}

              {/* Color */}
              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-[#5C544B] mb-1.5">
                    Color: <strong>{selectedColor}</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3 py-1 text-xs rounded-xs border transition-all ${
                          selectedColor === c.name
                            ? 'bg-[#721B29] text-white border-[#721B29]'
                            : 'border-[#D9CEBF] text-[#4A453E] hover:border-[#721B29]'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Chips */}
              <div className="mt-4">
                <p className="text-xs text-[#5C544B] mb-1.5">
                  Size: <strong>{selectedSize}</strong>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickViewProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs rounded-xs border transition-all ${
                        selectedSize === sz
                          ? 'bg-[#721B29] text-white border-[#721B29]'
                          : 'bg-white text-[#242120] border-[#D9CEBF] hover:border-[#721B29]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-[#5C544B]">Qty:</span>
                <div className="flex items-center border border-[#D9CEBF] rounded-xs bg-white text-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-1 text-[#4A453E] hover:bg-[#F3EFE6]"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2.5 py-1 text-[#4A453E] hover:bg-[#F3EFE6]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#EAE4D9] space-y-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={quickViewProduct.isSoldOut}
                className={`w-full py-2.5 text-xs font-semibold rounded-xs shadow-xs flex items-center justify-center gap-2 ${
                  quickViewProduct.isSoldOut
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-800 text-white'
                    : 'bg-[#721B29] text-white hover:bg-[#852031]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{quickViewProduct.isSoldOut ? 'Sold Out' : 'Add To Bag'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className="text-[#5C544B] hover:text-[#721B29] flex items-center gap-1"
                >
                  <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-[#721B29] text-[#721B29]' : ''}`} />
                  <span>{inWishlist ? 'In Wishlist' : 'Save to Wishlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoToPDP}
                  className="text-[#721B29] font-medium hover:underline flex items-center gap-1"
                >
                  <span>Full Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
