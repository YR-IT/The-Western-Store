import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Flame, Zap } from 'lucide-react';
import { getOptimizedImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';
import { ProductOptionsIntent, ProductOptionsPopup } from './ProductOptionsPopup';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsIntent, setOptionsIntent] = useState<ProductOptionsIntent>('add');
  const inWishlist = isInWishlist(product.id);

  const productUrl = `/product/${product.slug || product.id}`;

  const rawPrimary = (product.images && product.images[0]) || '';
  const rawSecondary = (product.images && product.images[1]) || rawPrimary;

  const primaryImage = getOptimizedImageUrl(rawPrimary, 800, 85);
  const secondaryImage = rawSecondary !== rawPrimary ? getOptimizedImageUrl(rawSecondary, 800, 85) : null;

  const openOptions = (e: React.MouseEvent, intent: ProductOptionsIntent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.isSoldOut) return;
    setOptionsIntent(intent);
    setOptionsOpen(true);
  };

  return (
    <>
      <div
        id={`product-card-${product.id}`}
        className="product-card group relative flex flex-col h-full bg-white rounded-lg overflow-hidden border border-[#EAE4D9]/80 hover:border-[#D0C5B4] hover:shadow-md transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={productUrl}
          className="relative block w-full aspect-[3/4] overflow-hidden bg-[#F4EFE6] cursor-pointer"
          aria-label={`View details for ${product.title}`}
        >
          <img
            src={primaryImage}
            alt={product.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
            }}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              isHovered && secondaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
            loading="lazy"
          />

          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.title} view 2`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
              }}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
              loading="lazy"
            />
          )}

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 items-start">
            {product.onSale && product.saleDiscount && (
              <span className="px-2 py-0.5 bg-[#721B29] text-white text-[11px] font-bold tracking-wider rounded-xs shadow-xs">
                {product.saleDiscount}
              </span>
            )}
            {!product.isSoldOut &&
              product.inStockCount !== undefined &&
              product.inStockCount > 0 &&
              product.inStockCount <= 5 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C05621] text-white text-[10px] font-bold tracking-wide rounded-xs shadow-sm backdrop-blur-xs">
                  <Flame className="w-3 h-3 text-amber-200 fill-amber-200 shrink-0" />
                  <span>Only {product.inStockCount} left!</span>
                </span>
              )}
            {product.isNew && !product.isSoldOut && (
              <span className="px-2 py-0.5 bg-[#2B3A2C] text-white text-[10px] font-semibold uppercase tracking-wider rounded-xs">
                New
              </span>
            )}
            {product.isSoldOut && (
              <span className="px-2.5 py-0.5 bg-[#4A453E] text-[#FDFBF7] text-[10px] font-bold uppercase tracking-wider rounded-xs">
                Sold Out
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-all z-10 ${
              inWishlist
                ? 'bg-[#721B29] text-white shadow-sm'
                : 'bg-white/85 text-[#4A453E] hover:text-[#721B29] hover:bg-white'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="absolute bottom-3 right-2.5 w-8 h-8 rounded-full bg-white/90 text-[#4A453E] hover:text-[#721B29] hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
            title="Quick preview"
          >
            <Eye className="w-4 h-4" />
          </button>

          {product.isSoldOut && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1 bg-black/75 text-white text-xs font-semibold uppercase tracking-widest rounded-xs">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        <div className="p-3 sm:p-4 flex flex-col flex-1 gap-3">
          <div className="flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#8C8276] mb-1">
              {product.category}
            </p>

            <Link
              to={productUrl}
              className="block font-serif text-sm sm:text-base font-semibold text-[#242120] hover:text-[#721B29] line-clamp-2 transition-colors cursor-pointer leading-snug"
            >
              {product.title}
            </Link>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-sans text-base sm:text-lg font-bold text-[#721B29]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.onSale && product.originalPrice > product.price && (
                <span className="text-xs text-[#9B9285] line-through font-normal">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Horizontal CTA row */}
          <div className="flex flex-row items-stretch gap-2 pt-2 border-t border-[#F3EFE6]">
            <button
              type="button"
              onClick={(e) => openOptions(e, 'add')}
              disabled={product.isSoldOut}
              className="flex-1 min-w-0 inline-flex flex-row items-center justify-center gap-1.5 h-10 px-2 bg-white border border-[#721B29]/35 hover:bg-[#FAF7F0] disabled:opacity-50 disabled:cursor-not-allowed text-[#721B29] text-[11px] sm:text-xs font-bold rounded-md transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>
            <button
              type="button"
              onClick={(e) => openOptions(e, 'buy')}
              disabled={product.isSoldOut}
              className="flex-1 min-w-0 inline-flex flex-row items-center justify-center gap-1.5 h-10 px-2 bg-[#721B29] hover:bg-[#52131D] disabled:bg-[#B5ABA0] disabled:cursor-not-allowed text-white text-[11px] sm:text-xs font-bold rounded-md transition-colors shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      <ProductOptionsPopup
        product={product}
        intent={optionsIntent}
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
      />
    </>
  );
};
