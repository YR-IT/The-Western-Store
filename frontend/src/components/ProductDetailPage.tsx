import React, { useState, useEffect, useRef } from 'react';
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
  MessageSquare,
  Ruler,
  Check,
  Flame,
  ZoomIn,
  Copy,
  AlertTriangle,
  ShieldAlert,
  ChevronLeft,
  Star,
  ThumbsUp,
  CheckCircle2,
  User,
  Plus,
  X,
  Filter,
} from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  size: string;
  verified: boolean;
  helpfulCount: number;
  userLiked?: boolean;
}

const INITIAL_INDIAN_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Pooja Sharma',
    location: 'Kurukshetra, Haryana',
    rating: 5,
    date: '2 days ago',
    title: 'Stunning boutique quality! Fabric is super soft & elegant',
    comment: 'Bought this directly after checking with the store stylist at Railway Road boutique. The finish and zari work are immaculate! Delivered in Kurukshetra within 24 hours. Fitting was 100% accurate as per size guide.',
    size: 'M',
    verified: true,
    helpfulCount: 18,
  },
  {
    id: 'rev-2',
    name: 'Ananya Verma',
    location: 'Karnal, Haryana',
    rating: 5,
    date: '5 days ago',
    title: 'Exact color as shown in pictures! Perfect fitting',
    comment: 'I was hesitant about ordering online, but the store manager shared a quick WhatsApp video of the outfit fabric before dispatch. Fits like a glove with zero alteration required.',
    size: 'L',
    verified: true,
    helpfulCount: 14,
  },
  {
    id: 'rev-3',
    name: 'Simranjit Kaur',
    location: 'Ambala Cantt, Punjab',
    rating: 5,
    date: '1 week ago',
    title: 'Gorgeous outfit for family function & festive season',
    comment: 'High quality material and sturdy stitching. Wore this to a family sangeet in Ambala and received so many compliments! Super comfortable to wear for long hours.',
    size: 'S',
    verified: true,
    helpfulCount: 11,
  },
  {
    id: 'rev-4',
    name: 'Dr. Ritu Aggarwal',
    location: 'Delhi NCR',
    rating: 5,
    date: '2 weeks ago',
    title: 'Best budget western & ethnic boutique edit',
    comment: 'The drape and lining material are top class. Very breathable fabric and premium look without paying exorbitant designer prices. Highly recommend The Western Store!',
    size: 'XL',
    verified: true,
    helpfulCount: 8,
  },
  {
    id: 'rev-5',
    name: 'Kavita Joshi',
    location: 'Panipat, Haryana',
    rating: 4,
    date: '3 weeks ago',
    title: 'Loved the fast courier delivery & boutique box packaging',
    comment: 'Great packaging and prompt responses on WhatsApp. The color looks even richer in person.',
    size: 'M',
    verified: true,
    helpfulCount: 6,
  },
];

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

  // Carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  // Reviews state
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(INITIAL_INDIAN_REVIEWS);
  const [reviewFilter, setReviewFilter] = useState<'all' | '5star' | 'verified'>('all');
  const [reviewPage, setReviewPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: 'Kurukshetra, Haryana',
    rating: 5,
    size: product.sizes[0] || 'M',
    title: '',
    comment: '',
  });
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  // Trigger skeleton loading when product changes or on mount
  useEffect(() => {
    setIsLoading(true);
    setSelectedImageIdx(0);
    setReviewPage(1);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [selectedProductId]);

  useEffect(() => {
    setReviewPage(1);
  }, [reviewFilter]);

  // Share link feedback state
  const [copiedLink, setCopiedLink] = useState(false);

  // Accordions (closed by default)
  const [accordionOpen, setAccordionOpen] = useState<{ fabric: boolean; returnPolicy: boolean; shipping: boolean; care: boolean }>({
    fabric: false,
    returnPolicy: false,
    shipping: false,
    care: false,
  });

  const inWishlist = isInWishlist(product.id);

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

  // Related products from same category (or fallback to other products)
  const categoryProducts = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const relatedProducts = categoryProducts.length > 0
    ? categoryProducts
    : products.filter((p) => p.id !== product.id);

  const scrollRelated = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Active reviews list (Use custom product reviews if present, else fallback to default store reviews)
  const activeReviewsList = (product.customReviews && product.customReviews.length > 0)
    ? product.customReviews
    : reviewsList;

  const handleToggleHelpful = (reviewId: string) => {
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const userLiked = !r.userLiked;
          return {
            ...r,
            userLiked,
            helpfulCount: userLiked ? r.helpfulCount + 1 : r.helpfulCount - 1,
          };
        }
        return r;
      })
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    const createdReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: newReview.name.trim(),
      location: newReview.location.trim() || 'Kurukshetra, Haryana',
      rating: newReview.rating,
      date: 'Just now',
      title: newReview.title.trim() || 'Verified Customer Review',
      comment: newReview.comment.trim(),
      size: newReview.size,
      verified: true,
      helpfulCount: 1,
    };

    setReviewsList([createdReview, ...reviewsList]);
    setIsReviewModalOpen(false);
    setNewReview({
      name: '',
      location: 'Kurukshetra, Haryana',
      rating: 5,
      size: product.sizes[0] || 'M',
      title: '',
      comment: '',
    });
    setReviewSuccessMsg(true);
    setTimeout(() => setReviewSuccessMsg(false), 4000);
  };

  const filteredReviews = activeReviewsList.filter((r) => {
    if (reviewFilter === '5star') return r.rating === 5;
    if (reviewFilter === 'verified') return r.verified;
    return true;
  });

  const totalReviewPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE) || 1;
  const paginatedReviews = filteredReviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE
  );

  const avgScore = activeReviewsList.length > 0
    ? (activeReviewsList.reduce((acc, r) => acc + r.rating, 0) / activeReviewsList.length).toFixed(1)
    : '4.9';

  const count5 = activeReviewsList.filter((r) => r.rating === 5).length;
  const count4 = activeReviewsList.filter((r) => r.rating === 4).length;
  const count3 = activeReviewsList.filter((r) => r.rating === 3).length;
  const count2 = activeReviewsList.filter((r) => r.rating === 2).length;
  const count1 = activeReviewsList.filter((r) => r.rating === 1).length;
  const totalR = activeReviewsList.length || 1;

  const starPercentages = [
    { stars: 5, percent: Math.round((count5 / totalR) * 100) },
    { stars: 4, percent: Math.round((count4 / totalR) * 100) },
    { stars: 3, percent: Math.round((count3 / totalR) * 100) },
    { stars: 2, percent: Math.round((count2 / totalR) * 100) },
    { stars: 1, percent: Math.round((count1 / totalR) * 100) },
  ];

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="pdp-skeleton"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <PDPSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="pdp-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-2 lg:pb-4 w-full items-start">
              {/* Gallery Column (6 cols on large screen) */}
              <div className="lg:col-span-6 flex flex-col gap-6 items-start w-full">
                {/* Image & Thumbnails Area */}
                <div className="flex flex-col-reverse sm:flex-row gap-4 items-start w-full">
                  {/* Thumbnails list */}
                  <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 sm:max-h-[500px]">
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

                  {/* Main Stage Image */}
                  <div className="flex-1 relative aspect-[3/4] w-full max-w-[440px] rounded-xl overflow-hidden bg-[#F4EFE6] border border-[#EAE4D9] shadow-sm">
                    <img
                      src={product.images[selectedImageIdx] || product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover object-top"
                    />

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

                {/* Accordions below image area (Desktop view only) */}
                <div className="hidden lg:block w-full mt-2 border-t border-[#EAE4D9] divide-y divide-[#EAE4D9] text-xs">
                  {/* Description & Fabric Details */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setAccordionOpen((p) => ({ ...p, fabric: !p.fabric }))}
                      className="w-full py-3.5 flex items-center justify-between text-left font-sans font-bold text-sm text-[#242120] cursor-pointer"
                    >
                      <span>Fabric & Silhouette Details</span>
                      <motion.span animate={{ rotate: accordionOpen.fabric ? 180 : 0 }} transition={{ duration: 0.25 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {accordionOpen.fabric && (
                        <motion.div
                          key="fabric"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="pb-4 text-[#5C544B] space-y-2 leading-relaxed">
                            <p>{product.description}</p>
                            <ul className="list-disc pl-4 space-y-1 pt-1 text-[11px]">
                              <li><strong>Fabric:</strong> {product.fabricCare.fabric}</li>
                              <li><strong>Fit & Silhouette:</strong> {product.fabricCare.fit}</li>
                              <li><strong>Occasion:</strong> {product.fabricCare.occasion}</li>
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Return & Exchange Policy Accordion */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setAccordionOpen((p) => ({ ...p, returnPolicy: !p.returnPolicy }))}
                      className="w-full py-3.5 flex items-center justify-between text-left font-sans font-bold text-sm text-[#242120] cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 text-[#721B29]">
                        <ShieldAlert className="w-4 h-4" />
                        <span>No Return & No Exchange Policy</span>
                      </span>
                      <motion.span animate={{ rotate: accordionOpen.returnPolicy ? 180 : 0 }} transition={{ duration: 0.25 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {accordionOpen.returnPolicy && (
                        <motion.div
                          key="returnPolicy"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="pb-4 text-[#5C544B] space-y-2 leading-relaxed text-[11px]">
                            <div className="p-2.5 bg-amber-50/80 border border-amber-200 text-[#8C3E00] rounded font-medium">
                              ⚠️ <strong>Final Sale:</strong> We follow a strict <strong>No Exchange and No Return Policy</strong> for all ordered garments.
                            </div>
                            {product.customReturnPolicy ? (
                              <p className="whitespace-pre-line">• {product.customReturnPolicy}</p>
                            ) : (
                              <>
                                <p>• Please double-check your sizing using our size guide or message our store stylist on WhatsApp before confirming your order.</p>
                                <p>• Every piece undergoes a rigorous 3-point quality check at our Railway Road store prior to dispatch to ensure pristine craftsmanship.</p>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Wash Care */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setAccordionOpen((p) => ({ ...p, care: !p.care }))}
                      className="w-full py-3.5 flex items-center justify-between text-left font-sans font-bold text-sm text-[#242120] cursor-pointer"
                    >
                      <span>Wash Care & Maintenance</span>
                      <motion.span animate={{ rotate: accordionOpen.care ? 180 : 0 }} transition={{ duration: 0.25 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {accordionOpen.care && (
                        <motion.div
                          key="care"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="pb-4 text-[#5C544B] space-y-1.5 leading-relaxed text-[11px]">
                            <p>• {product.fabricCare.washCare}</p>
                            {product.customWashCareNotes && product.customWashCareNotes.length > 0 ? (
                              product.customWashCareNotes.map((note, idx) => (
                                <p key={idx}>• {note}</p>
                              ))
                            ) : (
                              <>
                                <p>• Store folded in a cool dry place or breathable muslin cover for zari longevity.</p>
                                <p>• Iron on reverse or use garment steamer on delicate silk/georgette fabrics.</p>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Delivery info */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setAccordionOpen((p) => ({ ...p, shipping: !p.shipping }))}
                      className="w-full py-3.5 flex items-center justify-between text-left font-sans font-bold text-sm text-[#242120] cursor-pointer"
                    >
                      <span>Courier & Delivery Timeline</span>
                      <motion.span animate={{ rotate: accordionOpen.shipping ? 180 : 0 }} transition={{ duration: 0.25 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {accordionOpen.shipping && (
                        <motion.div
                          key="shipping"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="pb-4 text-[#5C544B] space-y-1 text-[11px] leading-relaxed">
                            <p>• <strong>Haryana & Delhi NCR:</strong> {product.customDeliveryTimeline?.haryanaDelhi || '1-2 business days.'}</p>
                            <p>• <strong>Rest of India:</strong> {product.customDeliveryTimeline?.restOfIndia || '3-5 business days via Delhivery or Blue Dart.'}</p>
                            <p>• <strong>International:</strong> {product.customDeliveryTimeline?.international || '7-10 business days via DHL / FedEx.'}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Details Column (6 cols on large screen) */}
              <motion.div
                className="lg:col-span-6 flex flex-col justify-between"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
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
                  <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#242120] leading-snug tracking-tight">
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
                          <motion.button
                            key={sz}
                            type="button"
                            onClick={() => setSelectedSize(sz)}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.93 }}
                            className={`min-w-[48px] px-3.5 py-2 text-xs font-semibold rounded-sm border transition-colors ${
                              isSelected
                                ? 'bg-[#721B29] text-white border-[#721B29] shadow-xs'
                                : 'bg-white text-[#242120] border-[#D9CEBF] hover:border-[#721B29]'
                            }`}
                          >
                            {sz}
                          </motion.button>
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
                    <motion.button
                      id="pdp-add-to-cart-btn"
                      type="button"
                      onClick={handleAddToCart}
                      disabled={product.isSoldOut}
                      whileHover={!product.isSoldOut ? { scale: 1.015 } : {}}
                      whileTap={!product.isSoldOut ? { scale: 0.97 } : {}}
                      className={`w-full py-4 px-6 rounded-sm font-medium text-sm tracking-wide transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                        product.isSoldOut
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : addedAnimation
                          ? 'bg-emerald-800 text-white'
                          : 'bg-[#721B29] text-white hover:bg-[#852031]'
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {addedAnimation ? (
                          <motion.span
                            key="added"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            className="flex items-center gap-2"
                          >
                            <Check className="w-5 h-5" />
                            <span>Added to Bag!</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="add"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            className="flex items-center gap-2"
                          >
                            <ShoppingBag className="w-5 h-5" />
                            <span>{product.isSoldOut ? 'Sold Out' : 'Add To Shopping Bag'}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Direct WhatsApp Inquiry */}
                    <motion.button
                      id="pdp-whatsapp-inquire-btn"
                      type="button"
                      onClick={handleWhatsAppInquiry}
                      whileHover={{ scale: 1.012 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3 px-6 rounded-sm border-2 border-emerald-700 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100 transition-colors font-medium text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-700" />
                      <span>Ask Store Stylist on WhatsApp (📲 9729515288)</span>
                    </motion.button>
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

                  {/* Accordions below physical store guarantee strip (Mobile view only) */}
                  <div className="block lg:hidden w-full mt-6 border-t border-[#EAE4D9] divide-y divide-[#EAE4D9] text-xs">
                    {/* Description & Fabric Details */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setAccordionOpen((p) => ({ ...p, fabric: !p.fabric }))}
                        className="w-full py-3.5 flex items-center justify-between text-left font-sans font-bold text-sm text-[#242120] cursor-pointer"
                      >
                        <span>Fabric & Silhouette Details</span>
                        <motion.span animate={{ rotate: accordionOpen.fabric ? 180 : 0 }} transition={{ duration: 0.25 }}>
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {accordionOpen.fabric && (
                          <motion.div
                            key="fabric"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="pb-4 text-[#5C544B] space-y-2 leading-relaxed">
                              <p>{product.description}</p>
                              <ul className="list-disc pl-4 space-y-1 pt-1 text-[11px]">
                                <li><strong>Fabric:</strong> {product.fabricCare.fabric}</li>
                                <li><strong>Fit & Silhouette:</strong> {product.fabricCare.fit}</li>
                                <li><strong>Occasion:</strong> {product.fabricCare.occasion}</li>
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Return & Exchange Policy Accordion */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setAccordionOpen((p) => ({ ...p, returnPolicy: !p.returnPolicy }))}
                        className="w-full py-3.5 flex items-center justify-between text-left font-sans font-bold text-sm text-[#242120] cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 text-[#721B29]">
                          <ShieldAlert className="w-4 h-4" />
                          <span>No Return & No Exchange Policy</span>
                        </span>
                        <motion.span animate={{ rotate: accordionOpen.returnPolicy ? 180 : 0 }} transition={{ duration: 0.25 }}>
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {accordionOpen.returnPolicy && (
                          <motion.div
                            key="returnPolicy"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="pb-4 text-[#5C544B] space-y-2 leading-relaxed text-[11px]">
                              <div className="p-2.5 bg-amber-50/80 border border-amber-200 text-[#8C3E00] rounded font-medium">
                                ⚠️ <strong>Final Sale:</strong> We follow a strict <strong>No Exchange and No Return Policy</strong> for all ordered garments.
                              </div>
                              {product.customReturnPolicy ? (
                                <p className="whitespace-pre-line">• {product.customReturnPolicy}</p>
                              ) : (
                                <>
                                  <p>• Please double-check your sizing using our size guide or message our store stylist on WhatsApp before confirming your order.</p>
                                  <p>• Every piece undergoes a rigorous 3-point quality check at our Railway Road store prior to dispatch to ensure pristine craftsmanship.</p>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Wash Care */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setAccordionOpen((p) => ({ ...p, care: !p.care }))}
                        className="w-full py-3.5 flex items-center justify-between text-left font-sans font-bold text-sm text-[#242120] cursor-pointer"
                      >
                        <span>Wash Care & Maintenance</span>
                        <motion.span animate={{ rotate: accordionOpen.care ? 180 : 0 }} transition={{ duration: 0.25 }}>
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {accordionOpen.care && (
                          <motion.div
                            key="care"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="pb-4 text-[#5C544B] space-y-1.5 leading-relaxed text-[11px]">
                              <p>• {product.fabricCare.washCare}</p>
                              {product.customWashCareNotes && product.customWashCareNotes.length > 0 ? (
                                product.customWashCareNotes.map((note, idx) => (
                                  <p key={idx}>• {note}</p>
                                ))
                              ) : (
                                <>
                                  <p>• Store folded in a cool dry place or breathable muslin cover for zari longevity.</p>
                                  <p>• Iron on reverse or use garment steamer on delicate silk/georgette fabrics.</p>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Delivery info */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setAccordionOpen((p) => ({ ...p, shipping: !p.shipping }))}
                        className="w-full py-3.5 flex items-center justify-between text-left font-sans font-bold text-sm text-[#242120] cursor-pointer"
                      >
                        <span>Courier & Delivery Timeline</span>
                        <motion.span animate={{ rotate: accordionOpen.shipping ? 180 : 0 }} transition={{ duration: 0.25 }}>
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {accordionOpen.shipping && (
                          <motion.div
                            key="shipping"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="pb-4 text-[#5C544B] space-y-1 text-[11px] leading-relaxed">
                              <p>• <strong>Haryana & Delhi NCR:</strong> {product.customDeliveryTimeline?.haryanaDelhi || '1-2 business days.'}</p>
                              <p>• <strong>Rest of India:</strong> {product.customDeliveryTimeline?.restOfIndia || '3-5 business days via Delhivery or Blue Dart.'}</p>
                              <p>• <strong>International:</strong> {product.customDeliveryTimeline?.international || '7-10 business days via DHL / FedEx.'}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* You May Also Like Carousel Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-6 lg:mt-8 pt-6 lg:pt-6 border-t border-[#EAE4D9]">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
                  <div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#B8860B] font-semibold">
                      Matching Silhouettes
                    </span>
                    <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#242120] mt-1">
                      You May Also Like
                    </h3>
                    <p className="text-xs text-[#736B63] mt-1">
                      Curated recommendations from {product.category}
                    </p>
                  </div>

                  {/* Carousel Scroll Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollRelated('left')}
                      className="w-9 h-9 rounded-full border border-[#D9CEBF] hover:border-[#721B29] text-[#4A453E] hover:text-[#721B29] hover:bg-[#721B29]/5 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Previous related products"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollRelated('right')}
                      className="w-9 h-9 rounded-full border border-[#D9CEBF] hover:border-[#721B29] text-[#4A453E] hover:text-[#721B29] hover:bg-[#721B29]/5 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Next related products"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Carousel Container */}
                <div
                  ref={carouselRef}
                  className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x scroll-smooth -mx-3 px-3 sm:mx-0 sm:px-0 w-auto"
                >
                  {relatedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="w-[220px] xs:w-[240px] sm:w-[270px] lg:w-[285px] flex-shrink-0 snap-start"
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indian Customer Reviews Section */}
            <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-[#EAE4D9]">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#B8860B] font-semibold">
                    Customer Ratings & Feedback
                  </span>
                  <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#242120] mt-1 flex items-center gap-2.5 flex-wrap">
                    <span>Verified Customer Reviews</span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-200">
                      🇮🇳 Indian Buyers
                    </span>
                  </h3>
                  <p className="text-xs text-[#736B63] mt-1">
                    Authentic feedback from boutique shoppers in Kurukshetra, Karnal, Ambala & across India
                  </p>
                </div>

                {/* Write a Review Button */}
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-5 py-2.5 bg-[#721B29] hover:bg-[#852031] text-white font-medium text-xs rounded-sm transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Success Toast Banner */}
              <AnimatePresence>
                {reviewSuccessMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-md text-xs font-medium flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <span>Thank you! Your review has been published successfully.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ratings Overview Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 bg-[#FAF7F0] rounded-xl border border-[#EAE4D9] mb-8">
                {/* Main Score */}
                <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#EAE4D9] pb-6 md:pb-0 md:pr-6 text-center">
                  <span className="text-5xl font-extrabold text-[#721B29]">{avgScore}</span>
                  <div className="flex items-center gap-1 my-2 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-[#5C544B] font-medium">
                    Based on {activeReviewsList.length} verified Indian buyer reviews
                  </span>
                  <span className="text-[11px] text-[#721B29] font-semibold mt-1">
                    98% would recommend this silhouette
                  </span>
                </div>

                {/* Rating Breakdown Bars */}
                <div className="md:col-span-8 flex flex-col justify-center space-y-2">
                  {starPercentages.map((b) => (
                    <div key={b.stars} className="flex items-center gap-3 text-xs">
                      <span className="w-12 font-medium text-[#4A453E] flex items-center gap-1">
                        <span>{b.stars}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 h-2 bg-[#EAE4D9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#721B29] rounded-full"
                          style={{ width: `${b.percent}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-[#8C8276] text-[11px] font-medium">
                        {b.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
                <span className="text-xs font-semibold text-[#4A453E] mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    reviewFilter === 'all'
                      ? 'bg-[#721B29] text-white'
                      : 'bg-white text-[#4A453E] border border-[#D9CEBF] hover:border-[#721B29]'
                  }`}
                >
                  All Reviews ({activeReviewsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('5star')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    reviewFilter === '5star'
                      ? 'bg-[#721B29] text-white'
                      : 'bg-white text-[#4A453E] border border-[#D9CEBF] hover:border-[#721B29]'
                  }`}
                >
                  5★ Ratings
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('verified')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    reviewFilter === 'verified'
                      ? 'bg-[#721B29] text-white'
                      : 'bg-white text-[#4A453E] border border-[#D9CEBF] hover:border-[#721B29]'
                  }`}
                >
                  Verified Buyers
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {paginatedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-white rounded-lg border border-[#EAE4D9] shadow-2xs hover:border-[#D9CEBF] transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#721B29]/10 text-[#721B29] flex items-center justify-center font-bold text-xs">
                          {rev.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#242120]">{rev.name}</span>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#8C8276]">{rev.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#8C8276]">
                        <span className="px-2 py-0.5 bg-[#FAF7F0] rounded text-[11px] border border-[#EAE4D9]">
                          Size Purchased: <strong>{rev.size}</strong>
                        </span>
                        <span>{rev.date}</span>
                      </div>
                    </div>

                    {/* Stars & Title */}
                    <div className="flex items-center gap-2 my-2">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <h4 className="font-bold text-xs text-[#242120]">{rev.title}</h4>
                    </div>

                    {/* Comment */}
                    <p className="text-xs text-[#5C544B] leading-relaxed mb-3">{rev.comment}</p>

                    {/* Helpful Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F4EFE6] text-[11px]">
                      <span className="text-[#8C8276]">Was this review helpful?</span>
                      <button
                        type="button"
                        onClick={() => handleToggleHelpful(rev.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          rev.userLiked
                            ? 'bg-[#721B29] text-white font-medium'
                            : 'bg-[#FAF7F0] text-[#5C544B] hover:bg-[#EAE4D9]'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful ({rev.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                ))}

                {paginatedReviews.length === 0 && (
                  <div className="p-8 bg-[#FAF7F0] border border-dashed border-[#D9CEBF] rounded-lg text-center text-[#736B63]">
                    <p className="text-xs font-semibold">No reviews match the selected filter.</p>
                  </div>
                )}
              </div>

              {/* Review Pagination Bar */}
              {totalReviewPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#EAE4D9] mt-6">
                  <span className="text-xs text-[#736B63]">
                    Showing {((reviewPage - 1) * REVIEWS_PER_PAGE) + 1} - {Math.min(reviewPage * REVIEWS_PER_PAGE, filteredReviews.length)} of {filteredReviews.length} reviews
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={reviewPage === 1}
                      onClick={() => setReviewPage((p) => Math.max(p - 1, 1))}
                      className="px-3 py-1.5 rounded-sm border border-[#D9CEBF] bg-white text-xs font-semibold text-[#242120] hover:bg-[#FAF8F3] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Previous
                    </button>

                    {[...Array(totalReviewPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setReviewPage(pageNum)}
                          className={`w-8 h-8 rounded-sm text-xs font-bold transition-colors cursor-pointer ${
                            reviewPage === pageNum
                              ? 'bg-[#721B29] text-white'
                              : 'bg-white border border-[#D9CEBF] text-[#242120] hover:bg-[#FAF8F3]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      disabled={reviewPage === totalReviewPages}
                      onClick={() => setReviewPage((p) => Math.min(p + 1, totalReviewPages))}
                      className="px-3.5 py-1.5 rounded-sm border border-[#D9CEBF] bg-white text-xs font-semibold text-[#242120] hover:bg-[#FAF8F3] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Write Review Modal */}
            <AnimatePresence>
              {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-[#EAE4D9] relative"
                  >
                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h3 className="font-sans text-xl font-bold text-[#242120] mb-1">
                      Write an Indian Customer Review
                    </h3>
                    <p className="text-xs text-[#736B63] mb-4">
                      Share your experience regarding fabric quality, sizing fit, and delivery with Western Store.
                    </p>

                    <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-[#242120] mb-1">Overall Rating</label>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview((p) => ({ ...p, rating: star }))}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#242120] mb-1">Your Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Pooja Sharma"
                            value={newReview.name}
                            onChange={(e) => setNewReview((p) => ({ ...p, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-[#D9CEBF] rounded-sm focus:outline-none focus:border-[#721B29]"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#242120] mb-1">City / Location</label>
                          <input
                            type="text"
                            placeholder="e.g. Kurukshetra, Haryana"
                            value={newReview.location}
                            onChange={(e) => setNewReview((p) => ({ ...p, location: e.target.value }))}
                            className="w-full px-3 py-2 border border-[#D9CEBF] rounded-sm focus:outline-none focus:border-[#721B29]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#242120] mb-1">Size Purchased</label>
                          <select
                            value={newReview.size}
                            onChange={(e) => setNewReview((p) => ({ ...p, size: e.target.value }))}
                            className="w-full px-3 py-2 border border-[#D9CEBF] rounded-sm focus:outline-none focus:border-[#721B29] bg-white"
                          >
                            {product.sizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-[#242120] mb-1">Review Headline</label>
                          <input
                            type="text"
                            placeholder="e.g. Perfect fabric & fast dispatch"
                            value={newReview.title}
                            onChange={(e) => setNewReview((p) => ({ ...p, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-[#D9CEBF] rounded-sm focus:outline-none focus:border-[#721B29]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#242120] mb-1">Detailed Review *</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Tell us about the fabric feel, drape, color accuracy, and overall fit..."
                          value={newReview.comment}
                          onChange={(e) => setNewReview((p) => ({ ...p, comment: e.target.value }))}
                          className="w-full px-3 py-2 border border-[#D9CEBF] rounded-sm focus:outline-none focus:border-[#721B29]"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsReviewModalOpen(false)}
                          className="px-4 py-2 border border-[#D9CEBF] rounded-sm text-[#4A453E] hover:bg-gray-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#721B29] text-white rounded-sm font-semibold hover:bg-[#852031] cursor-pointer"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



