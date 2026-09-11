import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { PDPSkeleton } from './Skeletons';
import {
  Heart,
  ShoppingBag,
  Share2,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Ruler,
  Check,
  Flame,
  ZoomIn,
  Copy,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeChartOpen,
    setView,
    setSelectedCategory,
    navigateToCategory,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // PDP State
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Trigger skeleton loading when product changes or on mount
  useEffect(() => {
    setIsLoading(true);
    setSelectedImageIdx(0);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [selectedProductId]);

  // Hover to zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Share link feedback state
  const [copiedLink, setCopiedLink] = useState(false);

  // Accordions
  const [accordionOpen, setAccordionOpen] = useState<{ fabric: boolean; returnPolicy: boolean; shipping: boolean; care: boolean }>({
    fabric: true,
    returnPolicy: true,
    shipping: false,
    care: false,
  });

  const inWishlist = isInWishlist(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hi The Western Store Kurukshetra! I am interested in *${product.title}* (₹${product.price}) in Size: *${selectedSize}*, Color: *${selectedColor}*. Could you please confirm if this is in stock at your Railway Road store?`;
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Social Share Handlers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `Check out ${product.title} at The Western Store Kurukshetra!`;

  const shareWhatsApp = () => {
    const text = `${shareTitle}\nPrice: ₹${product.price.toLocaleString('en-IN')}\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = `${shareTitle} ₹${product.price.toLocaleString('en-IN')}`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyProductLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  if (isLoading) {
    return <PDPSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-[#FDFBF7] py-6 sm:py-12 w-full max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8C8276] mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-1">
          <button
            type="button"
            onClick={() => setView('home')}
            className="hover:text-[#721B29] transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => navigateToCategory(product.category)}
            className="hover:text-[#721B29] transition-colors"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-[#242120] font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Showcase: Gallery Left + Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pb-12 sm:pb-16 border-b border-[#EAE4D9] w-full">
          {/* Gallery Column (7 cols on large screen) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails list */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 sm:max-h-[560px]">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative w-16 sm:w-20 aspect-[3/4] rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[#721B29] shadow-xs scale-102'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image with Hover-to-Zoom */}
            <div
              className="flex-1 relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F4EFE6] border border-[#EAE4D9] shadow-sm cursor-zoom-in group/zoom"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.title}
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }}
                className={`w-full h-full object-cover object-top transition-transform duration-200 ease-out ${
                  isZoomed ? 'scale-225 cursor-zoom-out' : 'scale-100'
                }`}
              />

              {/* Hover Zoom Hint Overlay Pill */}
              <div
                className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/65 text-white text-[11px] font-medium backdrop-blur-xs transition-opacity duration-200 pointer-events-none flex items-center gap-1.5 z-10 ${
                  isZoomed ? 'opacity-0' : 'opacity-85 group-hover/zoom:opacity-100'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5 text-amber-200" />
                <span>Hover to zoom fabric</span>
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.onSale && product.saleDiscount && (
                  <span className="px-3 py-1 bg-[#721B29] text-white text-xs font-bold uppercase tracking-wider rounded-xs shadow-sm">
                    {product.saleDiscount}
                  </span>
                )}
                {!product.isSoldOut && product.inStockCount !== undefined && product.inStockCount > 0 && product.inStockCount <= 5 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C05621] text-white text-xs font-bold uppercase tracking-wider rounded-xs shadow-md backdrop-blur-xs">
                    <Flame className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
                    Only {product.inStockCount} left!
                  </span>
                )}
                {product.isSoldOut && (
                  <span className="px-3 py-1 bg-[#4A453E] text-white text-xs font-bold uppercase tracking-wider rounded-xs">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Wishlist Button on Image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 ${
                  inWishlist
                    ? 'bg-[#721B29] text-white shadow-md'
                    : 'bg-white/80 text-[#4A453E] hover:text-[#721B29] hover:bg-white'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Details Column (5 cols on large screen) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#B8860B]">
                  {product.category}
                </span>
                {product.isBestSeller && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#721B29] font-semibold bg-[#721B29]/10 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>Kurukshetra Best Seller</span>
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#242120] leading-snug tracking-tight">
                {product.title}
              </h1>

              {/* Pricing Section */}
              <div className="mt-4 flex items-baseline gap-3 pb-4 border-b border-[#EAE4D9]">
                <span className="font-sans text-2xl sm:text-3xl font-bold text-[#721B29]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.onSale && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-[#9B9285] line-through font-normal">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>

              {/* Low Inventory Urgency Alert */}
              {!product.isSoldOut && product.inStockCount !== undefined && product.inStockCount > 0 && product.inStockCount <= 5 && (
                <div id="pdp-low-stock-alert" className="mt-4 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/90 rounded-md">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-[#8C3E00] flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#C05621] fill-[#C05621] animate-pulse" />
                      <span>Hurry! Only {product.inStockCount} {product.inStockCount === 1 ? 'piece' : 'pieces'} left in stock</span>
                    </span>
                    <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-xs uppercase tracking-wide">
                      Selling Fast
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-[#721B29] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(25, (product.inStockCount / 5) * 100))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#736B63] mt-2">
                    Popular in Kurukshetra — complete your WhatsApp order before inventory runs out.
                  </p>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium text-[#242120]">
                      Color: <span className="font-normal text-[#736B63]">{selectedColor}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`group relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                          selectedColor === c.name
                            ? 'border-[#721B29] ring-2 ring-[#721B29]/20'
                            : 'border-[#D9CEBF] hover:border-[#721B29]'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-full h-full rounded-full block"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-medium text-[#242120]">
                    Select Size: <span className="font-bold text-[#721B29]">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-[#721B29] font-semibold underline underline-offset-2 flex items-center gap-1 hover:text-[#52131D]"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[48px] px-3.5 py-2 text-xs font-semibold rounded-sm border transition-all ${
                          isSelected
                            ? 'bg-[#721B29] text-white border-[#721B29] shadow-xs'
                            : 'bg-white text-[#242120] border-[#D9CEBF] hover:border-[#721B29]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-medium text-[#242120]">Quantity:</span>
                <div className="flex items-center border border-[#D9CEBF] rounded-sm bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-sm text-[#4A453E] hover:bg-[#F3EFE6] transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 text-xs font-semibold text-[#242120] min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-sm text-[#4A453E] hover:bg-[#F3EFE6] transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#8C8276]">
                  {product.isSoldOut ? 'Out of stock' : 'Ready for fast dispatch'}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 space-y-3">
                <button
                  id="pdp-add-to-cart-btn"
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.isSoldOut}
                  className={`w-full py-4 px-6 rounded-sm font-medium text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    product.isSoldOut
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : addedAnimation
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#721B29] text-white hover:bg-[#852031]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>{product.isSoldOut ? 'Sold Out' : 'Add To Shopping Bag'}</span>
                    </>
                  )}
                </button>

                {/* Direct WhatsApp Inquiry */}
                <button
                  id="pdp-whatsapp-inquire-btn"
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="w-full py-3 px-6 rounded-sm border-2 border-emerald-700 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100 transition-colors font-medium text-xs tracking-wide flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Ask Store Stylist on WhatsApp (📲 9729515288)</span>
                </button>
              </div>

              {/* Social Media Share Buttons */}
              <div className="mt-6 pt-5 border-t border-[#EAE4D9]">
                <div className="flex items-center justify-between text-xs text-[#5C544B] mb-2.5">
                  <span className="font-semibold flex items-center gap-1.5 text-[#242120]">
                    <Share2 className="w-3.5 h-3.5 text-[#721B29]" />
                    <span>Share This Silhouette:</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={shareWhatsApp}
                    className="px-3 py-1.5 bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 font-medium text-xs rounded border border-[#25D366]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 0C5.396 0 0 5.396 0 12.031c0 2.122.553 4.188 1.603 6.012L0 24l6.126-1.579c1.764.961 3.76 1.464 5.905 1.464 6.634 0 12.03-5.396 12.03-12.031C24.061 5.396 18.665 0 12.031 0zm0 22.04c-1.83 0-3.626-.492-5.197-1.422l-.373-.222-3.864.995 1.026-3.766-.244-.388c-1.025-1.633-1.567-3.524-1.567-5.467 0-5.541 4.509-10.05 10.05-10.05 5.54 0 10.05 4.509 10.05 10.05 0 5.54-4.51 10.05-10.051 10.05z" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={shareFacebook}
                    className="px-3 py-1.5 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 font-medium text-xs rounded border border-[#1877F2]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Share on Facebook"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>

                  {/* Twitter / X */}
                  <button
                    type="button"
                    onClick={shareTwitter}
                    className="px-3 py-1.5 bg-black/5 text-[#242120] hover:bg-black/10 font-medium text-xs rounded border border-black/15 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Share on Twitter / X"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>X (Twitter)</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    type="button"
                    onClick={copyProductLink}
                    className="px-3 py-1.5 bg-[#F4EFE6] text-[#4A453E] hover:bg-[#EAE4D9] font-medium text-xs rounded border border-[#D9CEBF] transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Copy product link"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-800 font-semibold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Physical Store Guarantee Strip & Policy Notice */}
              <div className="mt-6 p-4 bg-[#FAF7F0] rounded-lg border border-[#EAE4D9] space-y-2.5 text-xs text-[#5C544B]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#721B29] flex-shrink-0" />
                  <span>Pan-India Courier & Worldwide Shipping Available</span>
                </div>
                {/* No Exchange & No Return Notice */}
                <div className="flex items-center gap-2 text-[#721B29] font-semibold bg-[#721B29]/10 p-2 rounded-md border border-[#721B29]/20">
                  <AlertTriangle className="w-4 h-4 text-[#721B29] flex-shrink-0" />
                  <span>No Exchange and No Return Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                  <span>Verified Kurukshetra Boutique: Railway Road near Ujjivan Bank</span>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="mt-8 border-t border-[#EAE4D9] divide-y divide-[#EAE4D9] text-xs">
              {/* Description & Fabric Details */}
              <div>
                <button
                  type="button"
                  onClick={() => setAccordionOpen((p) => ({ ...p, fabric: !p.fabric }))}
                  className="w-full py-3.5 flex items-center justify-between text-left font-serif font-bold text-sm text-[#242120]"
                >
                  <span>Fabric & Silhouette Details</span>
                  {accordionOpen.fabric ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {accordionOpen.fabric && (
                  <div className="pb-4 text-[#5C544B] space-y-2 leading-relaxed">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1 pt-1 text-[11px]">
                      <li><strong>Fabric:</strong> {product.fabricCare.fabric}</li>
                      <li><strong>Fit & Silhouette:</strong> {product.fabricCare.fit}</li>
                      <li><strong>Occasion:</strong> {product.fabricCare.occasion}</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Return & Exchange Policy Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setAccordionOpen((p) => ({ ...p, returnPolicy: !p.returnPolicy }))}
                  className="w-full py-3.5 flex items-center justify-between text-left font-serif font-bold text-sm text-[#242120]"
                >
                  <span className="flex items-center gap-1.5 text-[#721B29]">
                    <ShieldAlert className="w-4 h-4" />
                    <span>No Return & No Exchange Policy</span>
                  </span>
                  {accordionOpen.returnPolicy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {accordionOpen.returnPolicy && (
                  <div className="pb-4 text-[#5C544B] space-y-2 leading-relaxed text-[11px]">
                    <div className="p-2.5 bg-amber-50/80 border border-amber-200 text-[#8C3E00] rounded font-medium">
                      ⚠️ <strong>Final Sale:</strong> We follow a strict <strong>No Exchange and No Return Policy</strong> for all ordered garments.
                    </div>
                    <p>• Please double-check your sizing using our size guide or message our store stylist on WhatsApp before confirming your order.</p>
                    <p>• Every piece undergoes a rigorous 3-point quality check at our Railway Road store prior to dispatch to ensure pristine craftsmanship.</p>
                  </div>
                )}
              </div>

              {/* Wash Care */}
              <div>
                <button
                  type="button"
                  onClick={() => setAccordionOpen((p) => ({ ...p, care: !p.care }))}
                  className="w-full py-3.5 flex items-center justify-between text-left font-serif font-bold text-sm text-[#242120]"
                >
                  <span>Wash Care & Maintenance</span>
                  {accordionOpen.care ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {accordionOpen.care && (
                  <div className="pb-4 text-[#5C544B] space-y-1.5 leading-relaxed text-[11px]">
                    <p>• {product.fabricCare.washCare}</p>
                    <p>• Store folded in a cool dry place or breathable muslin cover for zari longevity.</p>
                    <p>• Iron on reverse or use garment steamer on delicate silk/georgette fabrics.</p>
                  </div>
                )}
              </div>

              {/* Delivery info */}
              <div>
                <button
                  type="button"
                  onClick={() => setAccordionOpen((p) => ({ ...p, shipping: !p.shipping }))}
                  className="w-full py-3.5 flex items-center justify-between text-left font-serif font-bold text-sm text-[#242120]"
                >
                  <span>Courier & Delivery Timeline</span>
                  {accordionOpen.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {accordionOpen.shipping && (
                  <div className="pb-4 text-[#5C544B] space-y-1 text-[11px] leading-relaxed">
                    <p>• <strong>Haryana & Delhi NCR:</strong> 1-2 business days.</p>
                    <p>• <strong>Rest of India:</strong> 3-5 business days via Delhivery or Blue Dart.</p>
                    <p>• <strong>International:</strong> 7-10 business days via DHL / FedEx.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Outfits Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center max-w-md mx-auto mb-8">
              <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold">
                Complete The Look
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#242120] mt-1">
                You May Also Like
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

