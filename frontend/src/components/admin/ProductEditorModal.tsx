import React, { useState, useEffect } from 'react';
import { ImageKitUploader } from './ImageKitUploader';
import { Product, BudgetTier, Category, ReviewItem } from '../../types';
import { getOptimizedImageUrl, FALLBACK_PRODUCT_IMAGE } from '../../utils/imageUtils';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Star,
  Sparkles,
  Percent,
  Tag,
  Palette,
  Ruler,
  Layers,
  Info,
  MessageSquare,
  Edit2,
  User,
} from 'lucide-react';

interface ProductEditorModalProps {
  product: Product | null; // null means adding a new product
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
}

const LUXURY_COLOR_PALETTE = [
  { name: 'Deep Maroon', hex: '#721B29' },
  { name: 'Champagne Gold', hex: '#C5A059' },
  { name: 'Rani Pink', hex: '#B82855' },
  { name: 'Emerald Green', hex: '#1B4D3E' },
  { name: 'Royal Indigo', hex: '#2B3A42' },
  { name: 'Sage Green', hex: '#8F9779' },
  { name: 'Warm Ivory', hex: '#F7F3E8' },
  { name: 'Rust Terracotta', hex: '#B2533E' },
  { name: 'Midnight Black', hex: '#1A1A1A' },
  { name: 'Mustard Ochre', hex: '#D49B28' },
  { name: 'Powder Blue', hex: '#9BB5C4' },
  { name: 'Wine Plum', hex: '#581845' },
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = !!product;

  // Basic Details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Ethnic Wear');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('under_1499');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(true);

  // Pricing & Discounts
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [onSale, setOnSale] = useState(false);
  const [saleDiscount, setSaleDiscount] = useState('');

  // Stock
  const [inStockCount, setInStockCount] = useState<number | ''>(1);
  const [isSoldOut, setIsSoldOut] = useState(false);

  // Images
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Description
  const [description, setDescription] = useState('');

  // Fabric & Care
  const [fabric, setFabric] = useState('');
  const [washCare, setWashCare] = useState('');
  const [fit, setFit] = useState('');
  const [occasion, setOccasion] = useState('');

  // Custom Accordions Per Product
  const [customReturnPolicy, setCustomReturnPolicy] = useState('');
  const [customWashCareNotesText, setCustomWashCareNotesText] = useState('');
  const [haryanaDelivery, setHaryanaDelivery] = useState('');
  const [restOfIndiaDelivery, setRestOfIndiaDelivery] = useState('');
  const [internationalDelivery, setInternationalDelivery] = useState('');

  // Custom Product Reviews Tab State
  const [customReviews, setCustomReviews] = useState<ReviewItem[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revName, setRevName] = useState('');
  const [revLocation, setRevLocation] = useState('Kurukshetra, Haryana');
  const [revRating, setRevRating] = useState(5);
  const [revDate, setRevDate] = useState('Recently');
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revSize, setRevSize] = useState('M');
  const [revVerified, setRevVerified] = useState(true);

  // Sizes & Colors
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSizeInput, setNewSizeInput] = useState('');

  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#721B29');

  // Rating & Reviews
  const [rating, setRating] = useState<number | ''>(5.0);
  const [reviewCount, setReviewCount] = useState<number | ''>(0);

  // Active Tab in Modal
  const [modalTab, setModalTab] = useState<'details' | 'images' | 'specs' | 'variants' | 'reviews'>('details');

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setCategory(product.category || (categories[0]?.name || 'Ethnic Wear'));
      setBudgetTier(product.budgetTier || 'under_1499');
      setIsBestSeller(!!product.isBestSeller);
      setIsNew(!!product.isNew);
      setPrice(product.price ?? '');
      setOriginalPrice(product.originalPrice ?? '');
      setOnSale(!!product.onSale);
      setSaleDiscount(product.saleDiscount || '');
      setInStockCount(product.inStockCount !== undefined ? product.inStockCount : 1);
      setIsSoldOut(!!product.isSoldOut);
      setImages(product.images || []);
      setDescription(product.description || '');
      setFabric(product.fabricCare?.fabric || '');
      setWashCare(product.fabricCare?.washCare || '');
      setFit(product.fabricCare?.fit || '');
      setOccasion(product.fabricCare?.occasion || '');
      setCustomReturnPolicy(product.customReturnPolicy || '');
      setCustomWashCareNotesText(product.customWashCareNotes ? product.customWashCareNotes.join('\n') : '');
      setHaryanaDelivery(product.customDeliveryTimeline?.haryanaDelhi || '');
      setRestOfIndiaDelivery(product.customDeliveryTimeline?.restOfIndia || '');
      setInternationalDelivery(product.customDeliveryTimeline?.international || '');
      setCustomReviews(product.customReviews ? [...product.customReviews] : []);
      setShowReviewForm(false);
      setEditingReviewId(null);
      setSizes(product.sizes || []);
      setColors(product.colors || []);
      setRating(product.rating ?? 5.0);
      setReviewCount(product.reviewCount ?? 0);
    } else {
      // Default initial state for new product: COMPLETELY BLANK
      setTitle('');
      setCategory(categories[0]?.name || 'Ethnic Wear');
      setBudgetTier('under_1499');
      setIsBestSeller(false);
      setIsNew(false);
      setPrice('');
      setOriginalPrice('');
      setOnSale(false);
      setSaleDiscount('');
      setInStockCount(1);
      setIsSoldOut(false);
      setImages([]);
      setDescription('');
      setFabric('');
      setWashCare('');
      setFit('');
      setOccasion('');
      setCustomReturnPolicy('');
      setCustomWashCareNotesText('');
      setHaryanaDelivery('');
      setRestOfIndiaDelivery('');
      setInternationalDelivery('');
      setCustomReviews([]);
      setShowReviewForm(false);
      setEditingReviewId(null);
      setSizes([]);
      setColors([]);
      setRating(5.0);
      setReviewCount(0);
    }
  }, [product, isOpen, categories]);

  // Auto-calculate discount and budget tier when price / originalPrice changes
  const handlePriceChange = (newPriceVal: number | '') => {
    setPrice(newPriceVal);
    const newPrice = Number(newPriceVal) || 0;
    const orig = Number(originalPrice) || 0;
    if (orig > newPrice && newPrice > 0) {
      const pct = Math.round(((orig - newPrice) / orig) * 100);
      setSaleDiscount(`-${pct}%`);
      setOnSale(true);
    }
    // Auto suggest budget tier
    if (newPrice > 0) {
      if (newPrice <= 999) setBudgetTier('under_999');
      else if (newPrice <= 1499) setBudgetTier('under_1499');
      else if (newPrice <= 1999) setBudgetTier('under_1999');
      else setBudgetTier('premium');
    }
  };

  const handleOriginalPriceChange = (newOrigVal: number | '') => {
    setOriginalPrice(newOrigVal);
    const newOrig = Number(newOrigVal) || 0;
    const prc = Number(price) || 0;
    if (newOrig > prc && prc > 0) {
      const pct = Math.round(((newOrig - prc) / newOrig) * 100);
      setSaleDiscount(`-${pct}%`);
      setOnSale(true);
    }
  };

  // Stock toggle sync
  const handleSoldOutToggle = (soldOut: boolean) => {
    setIsSoldOut(soldOut);
    if (soldOut) {
      setInStockCount(0);
    } else if (inStockCount === 0) {
      setInStockCount(15);
    }
  };

  const handleStockCountChange = (count: number) => {
    setInStockCount(count);
    if (count <= 0) {
      setIsSoldOut(true);
    } else {
      setIsSoldOut(false);
    }
  };

  // Image helpers
  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    setImages((prev) => [...prev, url.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) return; // keep at least 1
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMakeCoverImage = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([target, ...rest]);
  };

  // Size helpers
  const handleAddSize = (sz: string) => {
    const trimmed = sz.trim();
    if (!trimmed || sizes.includes(trimmed)) return;
    setSizes([...sizes, trimmed]);
    setNewSizeInput('');
  };

  const handleRemoveSize = (sz: string) => {
    setSizes(sizes.filter((s) => s !== sz));
  };

  const applySizePreset = (preset: string[]) => {
    setSizes(preset);
  };

  // Color helpers
  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    setColors([...colors, { name: customColorName.trim(), hex: customColorHex }]);
    setCustomColorName('');
  };

  const handleAddPaletteColor = (c: { name: string; hex: string }) => {
    if (colors.some((item) => item.name.toLowerCase() === c.name.toLowerCase())) return;
    setColors([...colors, c]);
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // Custom Product Reviews Handlers
  const handleOpenNewReviewForm = () => {
    setEditingReviewId(null);
    setRevName('');
    setRevLocation('Kurukshetra, Haryana');
    setRevRating(5);
    setRevDate('Recently');
    setRevTitle('');
    setRevComment('');
    setRevSize(sizes[0] || 'M');
    setRevVerified(true);
    setShowReviewForm(true);
  };

  const handleEditReview = (rev: ReviewItem) => {
    setEditingReviewId(rev.id);
    setRevName(rev.name);
    setRevLocation(rev.location);
    setRevRating(rev.rating);
    setRevDate(rev.date);
    setRevTitle(rev.title);
    setRevComment(rev.comment);
    setRevSize(rev.size || 'M');
    setRevVerified(rev.verified);
    setShowReviewForm(true);
  };

  const handleDeleteReview = (revId: string) => {
    const updated = customReviews.filter((r) => r.id !== revId);
    setCustomReviews(updated);
    if (updated.length > 0) {
      setReviewCount(updated.length);
      const avg = (updated.reduce((acc, r) => acc + r.rating, 0) / updated.length).toFixed(1);
      setRating(Number(avg));
    } else {
      setReviewCount(0);
      setRating(5.0);
    }
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;

    let updated: ReviewItem[];
    if (editingReviewId) {
      updated = customReviews.map((r) =>
        r.id === editingReviewId
          ? {
              ...r,
              name: revName.trim(),
              location: revLocation.trim() || 'Kurukshetra, Haryana',
              rating: Number(revRating),
              date: revDate.trim() || 'Recently',
              title: revTitle.trim(),
              comment: revComment.trim(),
              size: revSize,
              verified: revVerified,
            }
          : r
      );
    } else {
      const newRev: ReviewItem = {
        id: `rev-${Date.now()}`,
        name: revName.trim(),
        location: revLocation.trim() || 'Kurukshetra, Haryana',
        rating: Number(revRating),
        date: revDate.trim() || 'Recently',
        title: revTitle.trim(),
        comment: revComment.trim(),
        size: revSize,
        verified: revVerified,
        helpfulCount: Math.floor(Math.random() * 15) + 3,
      };
      updated = [newRev, ...customReviews];
    }

    setCustomReviews(updated);
    setReviewCount(updated.length);
    const avg = (updated.reduce((acc, r) => acc + r.rating, 0) / updated.length).toFixed(1);
    setRating(Number(avg));
    setShowReviewForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setModalTab('details');
      return;
    }

    const finalProductData: Partial<Product> = {
      title: title.trim(),
      category,
      price: Number(price) || 999,
      originalPrice: Number(originalPrice) || Number(price) || 1499,
      onSale,
      saleDiscount: onSale ? saleDiscount : undefined,
      isSoldOut,
      inStockCount: Number(inStockCount) || 0,
      isBestSeller,
      isNew,
      budgetTier,
      description: description.trim(),
      images: images,
      sizes: sizes,
      colors: colors,
      fabricCare: {
        fabric: fabric.trim(),
        washCare: washCare.trim(),
        fit: fit.trim(),
        occasion: occasion.trim(),
      },
      customReturnPolicy: customReturnPolicy.trim() || undefined,
      customWashCareNotes: customWashCareNotesText.trim()
        ? customWashCareNotesText.split('\n').map((s) => s.trim()).filter(Boolean)
        : undefined,
      customDeliveryTimeline: (haryanaDelivery.trim() || restOfIndiaDelivery.trim() || internationalDelivery.trim())
        ? {
            haryanaDelhi: haryanaDelivery.trim() || undefined,
            restOfIndia: restOfIndiaDelivery.trim() || undefined,
            international: internationalDelivery.trim() || undefined,
          }
        : undefined,
      customReviews: customReviews.length > 0 ? customReviews : undefined,
      rating: customReviews.length > 0
        ? Number((customReviews.reduce((acc, r) => acc + r.rating, 0) / customReviews.length).toFixed(1))
        : (Number(rating) || 5.0),
      reviewCount: customReviews.length > 0 ? customReviews.length : (Number(reviewCount) || 0),
    };

    onSave(finalProductData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/55 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#FDFBF7] rounded-2xl shadow-2xl border border-[#EAE4D9] z-10 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE4D9] bg-[#FAF8F3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#721B29] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#242120]">
                {isEditing ? `Edit Garment: ${product.title}` : 'Add New Garment to Catalog'}
              </h3>
              <p className="text-xs text-[#736B63]">
                Manage all aspects: imagery, descriptions, pricing, inventory stock, sizes & shades.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#736B63] hover:text-[#242120] hover:bg-[#EAE4D9]/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation inside Modal */}
        <div className="flex border-b border-[#EAE4D9] bg-[#FAF8F3]/60 px-4 sm:px-6 gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'details', label: '1. General & Pricing', icon: Tag },
            { id: 'images', label: `2. Gallery Images (${images.length})`, icon: ImageIcon },
            { id: 'specs', label: '3. Fabric & Fit Story', icon: Layers },
            { id: 'variants', label: '4. Sizes & Colors', icon: Palette },
            { id: 'reviews', label: `5. Customer Reviews (${customReviews.length})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = modalTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setModalTab(tab.id as any)}
                className={`py-3 px-2 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#721B29] text-[#721B29] font-bold'
                    : 'border-transparent text-[#736B63] hover:text-[#242120]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-[#242120] flex-1">
          <form id="product-editor-form" onSubmit={handleSubmit} className="space-y-6">
            {/* TAB 1: GENERAL & PRICING & STOCK */}
            {modalTab === 'details' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Title */}
                <div>
                  <label className="block font-semibold text-[#242120] mb-1">
                    Garment Title / Model Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Banarasi Silk Zari Saree"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                {/* Category & Budget Tier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Store Category <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    >
                      {categories.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Budget Collection Tier
                    </label>
                    <select
                      value={budgetTier}
                      onChange={(e) => setBudgetTier(e.target.value as BudgetTier)}
                      className="w-full px-3 py-2.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    >
                      <option value="under_999">Budget Edit: Under ₹999</option>
                      <option value="under_1499">Value Edit: Under ₹1,499</option>
                      <option value="under_1999">Festive Edit: Under ₹1,999</option>
                      <option value="premium">Luxury Bridal & Premium Couture</option>
                    </select>
                  </div>
                </div>

                {/* Pricing & Sale Section */}
                <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#EAE4D9] space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE4D9]">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-[#721B29]" />
                      <span className="font-serif font-bold text-sm text-[#242120]">
                        Pricing & Promotions
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#721B29]">
                      <input
                        type="checkbox"
                        checked={onSale}
                        onChange={(e) => setOnSale(e.target.checked)}
                        className="w-4 h-4 accent-[#721B29]"
                      />
                      <span>Show as "On Sale" Deal</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-medium text-[#242120] mb-1">
                        Selling Price (₹) <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-[#8C8276] font-sans">₹</span>
                        <input
                          type="number"
                          required
                          min="1"
                          value={price}
                          onChange={(e) => handlePriceChange(Number(e.target.value))}
                          className="w-full pl-7 pr-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] font-bold focus:outline-none focus:border-[#721B29]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-[#242120] mb-1">
                        Original MRP (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-[#8C8276] font-sans">₹</span>
                        <input
                          type="number"
                          min="1"
                          value={originalPrice}
                          onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                          className="w-full pl-7 pr-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-[#242120] mb-1">
                        Discount Badge Text
                      </label>
                      <input
                        type="text"
                        placeholder="-25% or SPECIAL OFFER"
                        value={saleDiscount}
                        onChange={(e) => setSaleDiscount(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock & Merchandising Badges */}
                <div className="p-4 bg-white rounded-xl border border-[#EAE4D9] space-y-4 shadow-xs">
                  <span className="font-serif font-bold text-sm text-[#242120] block pb-2 border-b border-[#F4EFE6]">
                    Inventory Stock & Showcase Badges
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Stock Units */}
                    <div>
                      <label className="block font-medium text-[#242120] mb-1">
                        Units in Stock (Kurukshetra Warehouse)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={inStockCount}
                        onChange={(e) => handleStockCountChange(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                      />
                      <p className="text-[11px] text-[#736B63] mt-1">
                        Setting units to 0 automatically marks this garment as Sold Out.
                      </p>
                    </div>

                    {/* Stock Status Pill */}
                    <div>
                      <label className="block font-medium text-[#242120] mb-1">
                        Availability Status
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSoldOutToggle(false)}
                          className={`flex-1 py-2 px-3 rounded-sm border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                            !isSoldOut
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white border-[#D9CEBF] text-[#736B63] hover:bg-[#F3EFE6]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>In Stock & Ready</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSoldOutToggle(true)}
                          className={`flex-1 py-2 px-3 rounded-sm border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                            isSoldOut
                              ? 'bg-rose-700 text-white border-rose-700'
                              : 'bg-white border-[#D9CEBF] text-[#736B63] hover:bg-[#F3EFE6]'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Sold Out / Out of Stock</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Toggles */}
                  <div className="pt-2 border-t border-[#F4EFE6] flex flex-wrap gap-4 sm:gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="w-4 h-4 accent-[#B8860B]"
                      />
                      <span className="font-semibold text-[#8F6808] flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#B8860B]" />
                        <span>Best Seller Badge</span>
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isNew}
                        onChange={(e) => setIsNew(e.target.checked)}
                        className="w-4 h-4 accent-[#2B3A2C]"
                      />
                      <span className="font-semibold text-[#2B3A2C] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>New Arrival Badge</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: IMAGES GALLERY */}
            {modalTab === 'images' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#242120] mb-1">
                    Garment Photo Gallery
                  </h4>
                  <p className="text-xs text-[#736B63]">
                    The first image is the main cover photo in listings. You can reorder, set primary, or remove photos.
                  </p>
                </div>

                {/* Current Images Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={`${img}-${idx}`}
                      className={`relative rounded-xl border-2 overflow-hidden bg-white group ${
                        idx === 0 ? 'border-[#721B29] ring-2 ring-[#721B29]/20' : 'border-[#EAE4D9]'
                      }`}
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-[#FAF8F3]">
                        <img
                          src={getOptimizedImageUrl(img, 300, 80)}
                          alt={`Product ${idx + 1}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                          }}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Cover Badge */}
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-[#721B29] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          Primary Cover
                        </span>
                      )}

                      {/* Action buttons overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleMakeCoverImage(idx)}
                            className="p-1.5 bg-white text-[#721B29] hover:bg-[#FAF8F3] rounded-full text-xs font-semibold shadow-md flex items-center gap-1 cursor-pointer"
                            title="Set as Main Cover"
                          >
                            <Star className="w-3.5 h-3.5 fill-[#721B29]" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-full text-xs shadow-md cursor-pointer"
                          title="Delete Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {images.length === 0 && (
                  <div className="p-8 border-2 border-dashed border-[#D9CEBF] bg-[#FAF8F3] rounded-xl text-center text-[#8C8276] space-y-1">
                    <ImageIcon className="w-8 h-8 mx-auto text-[#736B63]" />
                    <p className="text-xs font-bold text-[#242120]">No product photos uploaded yet</p>
                    <p className="text-[11px]">Upload a photo from your PC or phone via ImageKit, or paste an image URL link below.</p>
                  </div>
                )}

                {/* Upload Image via ImageKit or Add by URL */}
                <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#EAE4D9] space-y-4">
                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Upload High-Res Garment Photo (ImageKit CDN)
                    </label>
                    <p className="text-[11px] text-[#736B63] mb-2.5">
                      Upload directly from your phone or PC. ImageKit will compress, optimize webp format, and generate CDN link automatically.
                    </p>
                    <ImageKitUploader
                      folder="/products"
                      buttonText="Choose Photo & Upload to ImageKit"
                      onUploadSuccess={(url) => handleAddImage(url)}
                    />
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-[#EAE4D9]"></div>
                    <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-[#8C8276]">Or enter image URL</span>
                    <div className="flex-grow border-t border-[#EAE4D9]"></div>
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddImage(newImageUrl)}
                        className="px-4 py-2 bg-[#721B29] text-white rounded-sm text-xs font-semibold hover:bg-[#852031] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add URL</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SPECS, FABRIC & DESCRIPTION */}
            {modalTab === 'specs' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Description */}
                <div>
                  <label className="block font-semibold text-[#242120] mb-1">
                    Garment Story & Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the fabric weave, embroidery, zari motifs, and drape silhouette..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29] leading-relaxed"
                  />
                </div>

                {/* Fabric & Fit Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Fabric Composition
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pure Banarasi Silk with Brocade border"
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Wash & Garment Care
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dry Clean Only / Delicate Hand Wash"
                      value={washCare}
                      onChange={(e) => setWashCare(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Silhouette & Fit Details
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Voluminous 4-meter flare with can-can inner lining"
                      value={fit}
                      onChange={(e) => setFit(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Ideal Occasion
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sangeet, Mehendi, Cocktail & Wedding Receptions"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>
                </div>

                {/* Custom Product Accordions & Policy Settings */}
                <div className="p-4 bg-white rounded-xl border border-[#EAE4D9] space-y-4 shadow-2xs">
                  <div className="border-b border-[#F4EFE6] pb-2">
                    <span className="font-serif font-bold text-sm text-[#721B29] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#721B29]" />
                      <span>Custom Product Details Accordions (Optional Settings)</span>
                    </span>
                    <p className="text-[11px] text-[#736B63] mt-0.5">
                      Customize individual accordion content for this specific garment. If left empty, default store policies will be displayed.
                    </p>
                  </div>

                  {/* Custom Return & Exchange Policy */}
                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Custom Return & Exchange Policy Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Final Sale: No exchange on customized stitched items. Standard 3-point check applied."
                      value={customReturnPolicy}
                      onChange={(e) => setCustomReturnPolicy(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  {/* Custom Wash Care Notes */}
                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Additional Wash Care Bullet Points (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Store folded in a cool dry place or breathable muslin cover&#10;Iron on reverse or use garment steamer on delicate silk"
                      value={customWashCareNotesText}
                      onChange={(e) => setCustomWashCareNotesText(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  {/* Custom Delivery Timelines */}
                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Custom Delivery Timelines (per region)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[11px] text-[#736B63] font-medium block mb-1">Haryana & Delhi NCR</span>
                        <input
                          type="text"
                          placeholder="Default: 1-2 business days"
                          value={haryanaDelivery}
                          onChange={(e) => setHaryanaDelivery(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-[#736B63] font-medium block mb-1">Rest of India</span>
                        <input
                          type="text"
                          placeholder="Default: 3-5 business days"
                          value={restOfIndiaDelivery}
                          onChange={(e) => setRestOfIndiaDelivery(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-[#736B63] font-medium block mb-1">International</span>
                        <input
                          type="text"
                          placeholder="Default: 7-10 business days"
                          value={internationalDelivery}
                          onChange={(e) => setInternationalDelivery(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews & Social proof */}
                <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#EAE4D9] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Customer Rating (out of 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#242120] mb-1">
                      Verified Buyer Reviews Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={reviewCount}
                      onChange={(e) => setReviewCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SIZES & COLORS */}
            {modalTab === 'variants' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Sizes Management */}
                <div className="p-4 bg-white rounded-xl border border-[#EAE4D9] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F4EFE6]">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-[#721B29]" />
                      <span className="font-serif font-bold text-sm text-[#242120]">
                        Available Sizes ({sizes.length})
                      </span>
                    </div>
                    {/* Presets */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-[#8C8276]">Quick Presets:</span>
                      <button
                        type="button"
                        onClick={() => applySizePreset(['XS', 'S', 'M', 'L', 'XL', 'XXL'])}
                        className="text-[#721B29] font-medium hover:underline cursor-pointer"
                      >
                        Standard S-XXL
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => applySizePreset(['Free Size'])}
                        className="text-[#721B29] font-medium hover:underline cursor-pointer"
                      >
                        Free Size Only
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => applySizePreset(['26', '28', '30', '32', '34'])}
                        className="text-[#721B29] font-medium hover:underline cursor-pointer"
                      >
                        Denim (26-34)
                      </button>
                    </div>
                  </div>

                  {/* Size chips */}
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((sz) => (
                      <span
                        key={sz}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F3] border border-[#D9CEBF] rounded-sm text-xs font-semibold text-[#242120]"
                      >
                        <span>{sz}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(sz)}
                          className="text-[#8C8276] hover:text-rose-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add size input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="e.g. 3XL, Semi-Stitched, 36"
                      value={newSizeInput}
                      onChange={(e) => setNewSizeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSize(newSizeInput);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSize(newSizeInput)}
                      className="px-3.5 py-1.5 bg-[#242120] text-white rounded-sm text-xs font-medium hover:bg-[#3D3334] cursor-pointer"
                    >
                      + Add Size
                    </button>
                  </div>
                </div>

                {/* Colors Management */}
                <div className="p-4 bg-white rounded-xl border border-[#EAE4D9] space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F4EFE6]">
                    <Palette className="w-4 h-4 text-[#721B29]" />
                    <span className="font-serif font-bold text-sm text-[#242120]">
                      Garment Colors & Shades ({colors.length})
                    </span>
                  </div>

                  {/* Current Color Chips */}
                  <div className="flex flex-wrap gap-2.5">
                    {colors.map((col, idx) => (
                      <div
                        key={`${col.name}-${idx}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded-full text-xs font-medium text-[#242120] shadow-2xs"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        {colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(idx)}
                            className="text-[#8C8276] hover:text-rose-700 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Curated Luxury Palette quick add */}
                  <div>
                    <p className="text-[11px] font-semibold text-[#736B63] mb-2">
                      Click to add from Boutique Palette:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {LUXURY_COLOR_PALETTE.map((pal) => (
                        <button
                          key={pal.name}
                          type="button"
                          onClick={() => handleAddPaletteColor(pal)}
                          className="p-1.5 bg-[#FAF8F3] hover:bg-[#F3EFE6] border border-[#EAE4D9] rounded-md text-left flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                            style={{ backgroundColor: pal.hex }}
                          />
                          <span className="text-[11px] text-[#242120] truncate">{pal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom color input */}
                  <div className="pt-2 border-t border-[#F4EFE6] flex items-center gap-2">
                    <input
                      type="color"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="w-9 h-8 p-0.5 rounded border border-[#D9CEBF] cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Custom Shade Name (e.g. Dusty Rose)"
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="px-3.5 py-1.5 bg-[#242120] text-white rounded-sm text-xs font-medium hover:bg-[#3D3334] cursor-pointer"
                    >
                      + Add Shade
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CUSTOMER REVIEWS */}
            {modalTab === 'reviews' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#242120] flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#721B29]" />
                      <span>Product Customer Reviews ({customReviews.length})</span>
                    </h4>
                    <p className="text-xs text-[#736B63] mt-0.5">
                      Upload and manage authentic reviews for this product. If left empty, default boutique reviews will be displayed.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenNewReviewForm}
                    className="px-3.5 py-2 bg-[#721B29] text-white rounded-sm text-xs font-semibold hover:bg-[#852031] flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Review</span>
                  </button>
                </div>

                {/* Add / Edit Review Form */}
                {showReviewForm && (
                  <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#721B29]/30 space-y-4 shadow-sm animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-2">
                      <span className="font-bold text-xs text-[#721B29]">
                        {editingReviewId ? 'Edit Product Review' : 'Upload New Buyer Review'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="text-[#736B63] hover:text-[#242120]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#242120] mb-1">
                          Reviewer Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Pooja Sharma"
                          value={revName}
                          onChange={(e) => setRevName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#242120] mb-1">
                          Customer Location
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Kurukshetra, Haryana"
                          value={revLocation}
                          onChange={(e) => setRevLocation(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#242120] mb-1">
                          Star Rating (1 to 5)
                        </label>
                        <div className="flex items-center gap-1 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRevRating(star)}
                              className="cursor-pointer p-0.5"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= revRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold ml-2 text-[#242120]">{revRating}.0</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#242120] mb-1">
                          Purchased Garment Size
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. M, Free Size, L"
                          value={revSize}
                          onChange={(e) => setRevSize(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#242120] mb-1">
                          Review Date / Tag
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2 days ago or 14 Sep 2026"
                          value={revDate}
                          onChange={(e) => setRevDate(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#242120]">
                          <input
                            type="checkbox"
                            checked={revVerified}
                            onChange={(e) => setRevVerified(e.target.checked)}
                            className="w-4 h-4 accent-emerald-700"
                          />
                          <span>Show "Verified Kurukshetra Buyer" Badge</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#242120] mb-1">
                        Review Title / Headline
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stunning boutique quality! Fabric is super soft & elegant"
                        value={revTitle}
                        onChange={(e) => setRevTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#242120] mb-1">
                        Review Description / Comment <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Write buyer feedback, fit experience, fabric quality commentary..."
                        value={revComment}
                        onChange={(e) => setRevComment(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE4D9]">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-3.5 py-1.5 border border-[#D9CEBF] bg-white text-[#242120] rounded-sm text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveReview}
                        className="px-4 py-1.5 bg-[#721B29] text-white rounded-sm text-xs font-semibold hover:bg-[#852031] cursor-pointer"
                      >
                        {editingReviewId ? 'Update Review' : 'Save Review'}
                      </button>
                    </div>
                  </div>
                )}

                {/* List of Custom Reviews */}
                <div className="space-y-3">
                  {customReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 bg-white rounded-xl border border-[#EAE4D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-[#721B29]/30 transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#242120]">{rev.name}</span>
                          <span className="text-[11px] text-[#736B63]">({rev.location})</span>
                          {rev.verified && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              ✓ Verified Buyer
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#736B63]">• Size: {rev.size || 'M'}</span>
                          <span className="text-[11px] text-[#736B63]">• {rev.date}</span>
                        </div>

                        {rev.title && <p className="font-bold text-xs text-[#242120] pt-1">{rev.title}</p>}
                        <p className="text-xs text-[#5C544B] leading-relaxed">{rev.comment}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleEditReview(rev)}
                          className="p-1.5 text-[#736B63] hover:text-[#721B29] hover:bg-[#FAF8F3] rounded-md transition-colors cursor-pointer"
                          title="Edit Review"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 text-[#736B63] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {customReviews.length === 0 && !showReviewForm && (
                    <div className="p-8 border-2 border-dashed border-[#D9CEBF] bg-[#FAF8F3] rounded-xl text-center space-y-2">
                      <MessageSquare className="w-8 h-8 mx-auto text-[#8C8276]" />
                      <p className="text-xs font-bold text-[#242120]">No custom reviews uploaded for this product yet</p>
                      <p className="text-[11px] text-[#736B63]">
                        Click <strong>"+ Add Review"</strong> above to upload customer feedback. If left empty, default store reviews will be shown on the product detail page.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#EAE4D9] bg-[#FAF8F3] flex items-center justify-between gap-3">
          <div className="text-xs text-[#736B63] hidden sm:block">
            {isEditing ? `Editing product ID: ${product.id}` : 'Creating new catalog item'}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D9CEBF] bg-white hover:bg-[#FAF7F0] text-[#242120] rounded-sm text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-editor-form"
              className="px-6 py-2 bg-[#721B29] hover:bg-[#852031] text-white rounded-sm text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save All Product Updates' : 'Add to Catalog'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
