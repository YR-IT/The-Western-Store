import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ShoppingBag, X, Zap } from 'lucide-react';
import { CartItem, Product } from '../types';
import { useStore } from '../context/StoreContext';
import { FALLBACK_PRODUCT_IMAGE, getOptimizedImageUrl } from '../utils/imageUtils';

export type ProductOptionsIntent = 'add' | 'buy';

interface ProductOptionsPopupProps {
  product: Product | null;
  intent: ProductOptionsIntent;
  open: boolean;
  onClose: () => void;
}

export const ProductOptionsPopup: React.FC<ProductOptionsPopupProps> = ({
  product,
  intent,
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const sizes = product?.sizes?.filter(Boolean) ?? [];
  const colors = product?.colors?.filter((c) => c?.name) ?? [];
  const hasSizes = sizes.length > 0;
  const hasColors = colors.length > 0;

  useEffect(() => {
    if (!product || !open) return;
    setSelectedSize(sizes[0] || 'Free Size');
    setSelectedColor(colors[0]?.name || '');
    setQuantity(1);
    setAdded(false);
  }, [product, open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const handleAdd = () => {
    if (!product || product.isSoldOut) return;
    addToCart(product, selectedSize || 'Free Size', selectedColor, quantity);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const handleBuyNow = () => {
    if (!product || product.isSoldOut) return;
    const buyNowItem: CartItem = {
      id: `buynow-${product.id}-${Date.now()}`,
      productId: product.id,
      product,
      size: selectedSize || 'Free Size',
      color: selectedColor,
      quantity,
      price: product.price,
    };
    onClose();
    navigate('/checkout', { state: { buyNowItem } });
  };

  const primaryIsBuy = intent === 'buy';

  return createPortal(
    <AnimatePresence>
      {open && product && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.button
            type="button"
            aria-label="Close options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px] border-0 cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`product-options-title-${product.id}`}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="relative z-10 w-full sm:max-w-lg bg-[#FDFBF7] rounded-t-2xl sm:rounded-2xl border border-[#EAE4D9] shadow-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#EAE4D9]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#721B29]">
                {primaryIsBuy ? 'Buy Now — choose options' : 'Add to Cart — choose options'}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-[#EAE4D9] text-[#242120] hover:text-[#721B29] flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 flex gap-4">
              <div className="w-24 sm:w-28 shrink-0 aspect-[3/4] rounded-lg overflow-hidden bg-[#F4EFE6] border border-[#EAE4D9]">
                <img
                  src={getOptimizedImageUrl(product.images?.[0] || '', 400, 85)}
                  alt={product.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                  }}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider text-[#8C8276] font-semibold">
                  {product.category}
                </p>
                <h3
                  id={`product-options-title-${product.id}`}
                  className="font-serif text-base sm:text-lg font-bold text-[#242120] leading-snug mt-0.5 line-clamp-2"
                >
                  {product.title}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-sans font-bold text-lg text-[#721B29]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.onSale && product.originalPrice > product.price && (
                    <span className="text-xs text-[#9B9285] line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <Link
                  to={`/product/${product.slug || product.id}`}
                  onClick={onClose}
                  className="inline-block mt-2 text-[11px] font-semibold text-[#721B29] underline underline-offset-2"
                >
                  View full product details
                </Link>
              </div>
            </div>

            <div className="px-4 sm:px-5 pb-5 space-y-4">
              {hasColors && (
                <div>
                  <p className="text-xs text-[#5C544B] mb-1.5">
                    Color: <strong className="text-[#242120]">{selectedColor || 'Select'}</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                          selectedColor === c.name
                            ? 'bg-[#721B29] text-white border-[#721B29]'
                            : 'border-[#D9CEBF] text-[#4A453E] hover:border-[#721B29] bg-white'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hasSizes && (
                <div>
                  <p className="text-xs text-[#5C544B] mb-1.5">
                    Size: <strong className="text-[#242120]">{selectedSize || 'Select'}</strong>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
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
              )}

              {!hasColors && !hasSizes && (
                <p className="text-xs text-[#736B63] bg-[#FAF8F3] border border-[#EAE4D9] rounded-lg px-3 py-2.5">
                  No size or color options for this piece — you can continue with quantity only.
                </p>
              )}

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#5C544B]">Qty</span>
                <div className="flex items-center border border-[#D9CEBF] rounded-md bg-white text-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-[#4A453E] hover:bg-[#F3EFE6]"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-3 py-1.5 font-semibold min-w-[2rem] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-[#4A453E] hover:bg-[#F3EFE6]"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Horizontal action row — primary matches which card button was clicked */}
              <div className="flex flex-row gap-2 pt-2 border-t border-[#EAE4D9]">
                {primaryIsBuy ? (
                  <>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={product.isSoldOut}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-3 bg-[#721B29] hover:bg-[#52131D] disabled:bg-[#B5ABA0] text-white text-xs font-bold rounded-md shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span>Buy Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={product.isSoldOut || added}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-3 bg-white border border-[#721B29]/40 hover:bg-[#FAF7F0] disabled:opacity-50 text-[#721B29] text-xs font-bold rounded-md"
                    >
                      {added ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={product.isSoldOut || added}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-3 bg-[#721B29] hover:bg-[#52131D] disabled:bg-[#B5ABA0] text-white text-xs font-bold rounded-md shadow-sm"
                    >
                      {added ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={product.isSoldOut}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-3 bg-white border border-[#721B29]/40 hover:bg-[#FAF7F0] disabled:opacity-50 text-[#721B29] text-xs font-bold rounded-md"
                    >
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span>Buy Now</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
