import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ProductCategory, Product, BudgetTier } from '../types';
import { ProductCard } from './ProductCard';
import { PLPSkeleton } from './Skeletons';
import { Filter, X, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

const SIZES = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34'];

export const ProductListingPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedBudgetTier,
    setSelectedBudgetTier,
    collectionFilters,
    setView,
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);

  // Trigger loading skeleton on category/budget change or initial mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedBudgetTier]);

  const categoryList: (string | 'All')[] = useMemo(() => {
    return ['All', ...categories.map((c) => c.name)];
  }, [categories]);

  // Filters State
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Enabled filter lists from Admin Panel config
  const enabledSizes = useMemo(() => {
    return (collectionFilters?.sizes || []).filter((s) => s.enabled).map((s) => s.value);
  }, [collectionFilters]);

  const enabledFabrics = useMemo(() => {
    return (collectionFilters?.fabrics || []).filter((f) => f.enabled);
  }, [collectionFilters]);

  const enabledOccasions = useMemo(() => {
    return (collectionFilters?.occasions || []).filter((o) => o.enabled);
  }, [collectionFilters]);

  const enabledColors = useMemo(() => {
    return (collectionFilters?.colors || []).filter((c) => c.enabled);
  }, [collectionFilters]);

  const enabledBudgetTiers = useMemo(() => {
    return (collectionFilters?.budgetTiers || []).filter((b) => b.enabled);
  }, [collectionFilters]);

  const enabledSortOptions = useMemo(() => {
    return (collectionFilters?.sortOptions || []).filter((s) => s.enabled);
  }, [collectionFilters]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory === 'New Arrivals' || selectedCategory === 'New Arrival') {
          if (!p.isNew) return false;
        } else if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Budget filter from context
        if (selectedBudgetTier !== 'all' && p.budgetTier !== selectedBudgetTier) {
          return false;
        }

        // Size filter
        if (selectedSizes.length > 0) {
          const hasSize = p.sizes.some((sizeStr) =>
            selectedSizes.some((s) => sizeStr.toLowerCase().includes(s.toLowerCase()))
          );
          if (!hasSize) return false;
        }

        // Price range filter
        if (selectedPriceRange !== 'all') {
          const tier = enabledBudgetTiers.find((t) => t.id === selectedPriceRange || t.label === selectedPriceRange);
          if (tier) {
            if (p.price < tier.minPrice || p.price > tier.maxPrice) return false;
          }
        }

        // Color filter
        if (selectedColor !== 'all') {
          const hasColor = p.colors.some((c) =>
            c.name.toLowerCase().includes(selectedColor.toLowerCase())
          );
          if (!hasColor) return false;
        }

        // Fabric filter
        if (selectedFabric !== 'all') {
          const fabricStr = p.fabricCare?.fabric || '';
          if (!fabricStr.toLowerCase().includes(selectedFabric.toLowerCase())) return false;
        }

        // Occasion filter
        if (selectedOccasion !== 'all') {
          const occStr = p.fabricCare?.occasion || '';
          if (!occStr.toLowerCase().includes(selectedOccasion.toLowerCase())) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc' || sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-desc' || sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [
    products,
    selectedCategory,
    selectedBudgetTier,
    selectedSizes,
    selectedPriceRange,
    selectedColor,
    selectedFabric,
    selectedOccasion,
    sortBy,
    enabledBudgetTiers,
  ]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBudgetTier('all');
    setSelectedSizes([]);
    setSelectedPriceRange('all');
    setSelectedColor('all');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedBudgetTier !== 'all' ||
    selectedSizes.length > 0 ||
    selectedPriceRange !== 'all' ||
    selectedColor !== 'all';

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="plp-skeleton"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <PLPSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="plp-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="min-h-screen bg-[#FDFBF7] py-6 sm:py-12 w-full max-w-full overflow-hidden"
        >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[#8C8276] mb-2">
            <button
              type="button"
              onClick={() => setView('home')}
              className="hover:text-[#721B29] transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#242120] font-medium">
              {selectedCategory === 'All' ? 'All Collections' : selectedCategory}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-4 border-b border-[#EAE4D9] pb-4 sm:pb-6">
            <div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#242120] tracking-tight">
                {selectedCategory === 'All' ? 'Women’s Collection' : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-[#736B63] mt-1 font-light">
                Showing {filteredProducts.length} handcrafted silhouettes from our Kurukshetra store
              </p>
            </div>

            {/* Sort Dropdown & Mobile Filter Trigger */}
            <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto mt-2 sm:mt-0">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xs border border-[#D9CEBF] bg-white text-xs font-medium text-[#242120]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#721B29]" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs text-[#8C8276] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white border border-[#D9CEBF] rounded-xs text-xs font-medium text-[#242120] focus:outline-none focus:border-[#721B29]"
                >
                  {enabledSortOptions.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center flex-wrap gap-2 mb-6 overflow-hidden"
            >
              <span className="text-xs text-[#736B63]">Applied:</span>

              <AnimatePresence mode="popLayout">
                {selectedCategory !== 'All' && (
                  <motion.span
                    key="cat-chip"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#721B29]/10 text-[#721B29] text-xs rounded-full font-medium"
                  >
                    <span>{selectedCategory}</span>
                    <button type="button" onClick={() => setSelectedCategory('All')}>
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                )}

                {selectedBudgetTier !== 'all' && (
                  <motion.span
                    key="budget-chip"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#B8860B]/15 text-[#8F6808] text-xs rounded-full font-medium"
                  >
                    <span>Budget: {selectedBudgetTier.replace('_', ' ')}</span>
                    <button type="button" onClick={() => setSelectedBudgetTier('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                )}

                {selectedSizes.map((size) => (
                  <motion.span
                    key={`size-${size}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EAE4D9] text-[#242120] text-xs rounded-full font-medium"
                  >
                    <span>Size: {size}</span>
                    <button type="button" onClick={() => toggleSize(size)}>
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}

                {selectedPriceRange !== 'all' && (
                  <motion.span
                    key="price-chip"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EAE4D9] text-[#242120] text-xs rounded-full font-medium"
                  >
                    <span>Price: {selectedPriceRange}</span>
                    <button type="button" onClick={() => setSelectedPriceRange('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                )}

                {selectedColor !== 'all' && (
                  <motion.span
                    key="color-chip"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EAE4D9] text-[#242120] text-xs rounded-full font-medium"
                  >
                    <span>Color: {selectedColor}</span>
                    <button type="button" onClick={() => setSelectedColor('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[#721B29] font-medium underline underline-offset-2 ml-2 hover:opacity-80"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 bg-white p-6 rounded-xl border border-[#EAE4D9] sticky top-28">
            {/* Category Filter */}
            <div>
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#242120] mb-3 pb-2 border-b border-[#F4EFE6]">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categoryList.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-sm transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-[#721B29] text-white font-medium'
                        : 'text-[#4A453E] hover:bg-[#F7F4EE] hover:text-[#721B29]'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat !== 'All' && (
                      <span className="text-[10px] opacity-70">
                        {products.filter((p) => p.category === cat).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Tiers Filter */}
            {enabledBudgetTiers.length > 0 && (
              <div>
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#242120] mb-3 pb-2 border-b border-[#F4EFE6]">
                  Budget / Price Range
                </h3>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#4A453E] hover:text-[#721B29]">
                    <input
                      type="radio"
                      name="price-range"
                      checked={selectedPriceRange === 'all'}
                      onChange={() => setSelectedPriceRange('all')}
                      className="accent-[#721B29]"
                    />
                    <span>All Prices</span>
                  </label>
                  {enabledBudgetTiers.map((tier) => (
                    <label
                      key={tier.id}
                      className="flex items-center gap-2 cursor-pointer text-[#4A453E] hover:text-[#721B29]"
                    >
                      <input
                        type="radio"
                        name="price-range"
                        checked={selectedPriceRange === tier.id || selectedPriceRange === tier.label}
                        onChange={() => setSelectedPriceRange(tier.id)}
                        className="accent-[#721B29]"
                      />
                      <span>{tier.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Size Filter Chips */}
            {enabledSizes.length > 0 && (
              <div>
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#242120] mb-3 pb-2 border-b border-[#F4EFE6]">
                  Size
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {enabledSizes.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-2.5 py-1 text-xs rounded-xs border transition-all ${
                          isSelected
                            ? 'bg-[#721B29] border-[#721B29] text-white font-medium'
                            : 'bg-white border-[#D9CEBF] text-[#4A453E] hover:border-[#721B29]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fabric Filter */}
            {enabledFabrics.length > 0 && (
              <div>
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#242120] mb-3 pb-2 border-b border-[#F4EFE6]">
                  Fabric
                </h3>
                <div className="space-y-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedFabric('all')}
                    className={`w-full text-left py-1 px-2 rounded-sm transition-colors ${
                      selectedFabric === 'all'
                        ? 'bg-[#721B29] text-white font-medium'
                        : 'text-[#4A453E] hover:bg-[#F7F4EE]'
                    }`}
                  >
                    All Fabrics
                  </button>
                  {enabledFabrics.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFabric(selectedFabric === f.value ? 'all' : f.value)}
                      className={`w-full text-left py-1 px-2 rounded-sm transition-colors ${
                        selectedFabric === f.value
                          ? 'bg-[#721B29] text-white font-medium'
                          : 'text-[#4A453E] hover:bg-[#F7F4EE]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Occasion Filter */}
            {enabledOccasions.length > 0 && (
              <div>
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#242120] mb-3 pb-2 border-b border-[#F4EFE6]">
                  Occasion
                </h3>
                <div className="space-y-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedOccasion('all')}
                    className={`w-full text-left py-1 px-2 rounded-sm transition-colors ${
                      selectedOccasion === 'all'
                        ? 'bg-[#721B29] text-white font-medium'
                        : 'text-[#4A453E] hover:bg-[#F7F4EE]'
                    }`}
                  >
                    All Occasions
                  </button>
                  {enabledOccasions.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setSelectedOccasion(selectedOccasion === o.value ? 'all' : o.value)}
                      className={`w-full text-left py-1 px-2 rounded-sm transition-colors ${
                        selectedOccasion === o.value
                          ? 'bg-[#721B29] text-white font-medium'
                          : 'text-[#4A453E] hover:bg-[#F7F4EE]'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Swatches */}
            {enabledColors.length > 0 && (
              <div>
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#242120] mb-3 pb-2 border-b border-[#F4EFE6]">
                  Color
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedColor('all')}
                    className={`px-2 py-1 text-xs rounded-xs border ${
                      selectedColor === 'all'
                        ? 'bg-[#242120] text-white'
                        : 'border-[#D9CEBF] text-[#4A453E]'
                    }`}
                  >
                    All
                  </button>
                  {enabledColors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(selectedColor === c.name ? 'all' : c.name)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        selectedColor === c.name ? 'scale-125 border-[#721B29]' : 'border-white shadow-xs'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-[#EAE4D9]">
                <Sparkles className="w-8 h-8 text-[#B8860B] mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#242120]">
                  No matching designs found
                </h3>
                <p className="text-xs text-[#736B63] mt-1 max-w-sm mx-auto">
                  Try adjusting your size, budget, or category filters to explore more Kurukshetra store collections.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-5 py-2 bg-[#721B29] text-white text-xs font-semibold rounded-sm hover:bg-[#852031] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 items-stretch">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34, mass: 0.9 }}
              className="relative w-4/5 max-w-xs bg-white h-full p-5 overflow-y-auto shadow-2xl z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9] mb-4">
                  <h3 className="font-serif text-base font-bold text-[#242120]">Filter Collections</h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 text-[#4A453E] hover:text-[#721B29] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Category */}
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8F867C] mb-2">Category</p>
                  <div className="space-y-1">
                    {categoryList.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded-xs ${
                          selectedCategory === cat ? 'bg-[#721B29] text-white font-medium' : 'text-[#4A453E]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8F867C] mb-2">Budget</p>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { label: 'All', val: 'all' },
                      { label: 'Under ₹999', val: 'under-999' },
                      { label: 'Under ₹1499', val: '1000-1499' },
                      { label: 'Under ₹1999', val: '1500-1999' },
                      { label: 'Above ₹2000', val: 'above-2000' },
                    ].map((item) => (
                      <label key={item.val} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={selectedPriceRange === item.val}
                          onChange={() => setSelectedPriceRange(item.val)}
                          className="accent-[#721B29]"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8F867C] mb-2">Size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-2.5 py-1 text-xs border rounded-xs ${
                          selectedSizes.includes(size) ? 'bg-[#721B29] text-white' : 'border-[#D9CEBF]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE4D9] flex gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 py-2 border border-[#D9CEBF] text-xs font-medium rounded-xs text-[#4A453E]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2 bg-[#721B29] text-white text-xs font-semibold rounded-xs"
                >
                  Apply ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </motion.div>
    )}
  </AnimatePresence>
);
};
