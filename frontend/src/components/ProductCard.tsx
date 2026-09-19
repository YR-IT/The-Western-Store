import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Flame } from 'lucide-react';
import { getOptimizedImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateToProduct, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const rawPrimary = (product.images && product.images[0]) || '';
  const rawSecondary = (product.images && product.images[1]) || rawPrimary;

  const primaryImage = getOptimizedImageUrl(rawPrimary, 800, 85);
  const secondaryImage = rawSecondary !== rawPrimary ? getOptimizedImageUrl(rawSecondary, 800, 85) : null;

  return (
    <div
      id={`product-card-${product.id}`}
      className="product-card group relative flex flex-col h-full bg-white rounded-lg overflow-hidden border border-[#EAE4D9]/80 hover:border-[#D0C5B4] hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div
        className="relative w-full aspect-[3/4] overflow-hidden bg-[#F4EFE6] cursor-pointer"
        onClick={() => navigateToProduct(product.id)}
      >
        {/* Primary Image */}
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

        {/* Alternate Image on Hover */}
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

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 items-start">
          {product.onSale && product.saleDiscount && (
            <span className="px-2 py-0.5 bg-[#721B29] text-white text-[11px] font-bold tracking-wider rounded-xs shadow-xs">
              {product.saleDiscount}
            </span>
          )}
          {!product.isSoldOut && product.inStockCount !== undefined && product.inStockCount > 0 && product.inStockCount <= 5 && (
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

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
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

        {/* Quick View Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-12 right-2.5 w-8 h-8 rounded-full bg-white/90 text-[#4A453E] hover:text-[#721B29] hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
          title="Quick preview"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Sold out overlay */}
        {product.isSoldOut && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-3 py-1 bg-black/75 text-white text-xs font-semibold uppercase tracking-widest rounded-xs">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover "Select Options" Action Drawer on Desktop */}
        <div className="hidden sm:block absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            disabled={product.isSoldOut}
            className="w-full py-2 bg-[#FDFBF7] text-[#721B29] hover:bg-[#721B29] hover:text-white font-medium text-xs rounded-sm transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Select Options</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#8C8276] mb-1">
            {product.category}
          </p>

          {/* Title */}
          <h4
            onClick={() => navigateToProduct(product.id)}
            className="font-serif text-sm sm:text-base font-semibold text-[#242120] hover:text-[#721B29] line-clamp-2 transition-colors cursor-pointer leading-snug"
          >
            {product.title}
          </h4>
        </div>

        {/* Pricing & Mobile Select Button */}
        <div className="mt-3 pt-2 border-t border-[#F3EFE6] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-base sm:text-lg font-bold text-[#721B29]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.onSale && product.originalPrice > product.price && (
              <span className="text-xs text-[#9B9285] line-through font-normal">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile Select Options button */}
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            disabled={product.isSoldOut}
            className="sm:hidden px-2.5 py-1 bg-[#FAF7F0] border border-[#D9CEBF] text-[#721B29] text-[11px] font-medium rounded-xs hover:bg-[#721B29] hover:text-white transition-colors"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};
