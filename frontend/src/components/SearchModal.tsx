import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getOptimizedImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ background: '#FDF0D5', color: '#721B29', fontWeight: 700, borderRadius: 2, padding: '0 2px' }}>
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    categories,
    navigateToProduct,
    navigateToCategory,
  } = useStore();

  const [rawQuery, setRawQuery] = useState('');
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRawQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(val), 150);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) {
      setRawQuery('');
      setQuery('');
    } else {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    if (isSearchOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSearchOpen, setIsSearchOpen]);

  // Real categories that have at least one product
  const activeCategories = useMemo(() => {
    const catSet = new Set(products.map((p) => p.category));
    const fromList = categories.filter((c) => catSet.has(c.name));
    const listNames = new Set(fromList.map((c) => c.name));
    const extra = [...catSet]
      .filter((n) => !listNames.has(n))
      .map((n) => ({ id: n, name: n, slug: n }));
    return [...fromList, ...extra].slice(0, 8);
  }, [products, categories]);

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabricCare.fabric.toLowerCase().includes(q) ||
          p.fabricCare.occasion.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [products, query]);

  const matchedCategories = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return activeCategories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3);
  }, [activeCategories, query]);

  if (!isSearchOpen) return null;

  const handleCategoryClick = (catName: string) => {
    navigateToCategory(catName as any);
    setIsSearchOpen(false);
  };

  const handleProductSelect = (id: string) => {
    navigateToProduct(id);
    setIsSearchOpen(false);
  };

  const handleClearQuery = () => {
    setRawQuery('');
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-xl shadow-2xl border border-[#E0D7C8] overflow-hidden z-10"
      >
        {/* Input header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE4D9] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#721B29] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            autoFocus
            placeholder="Search sarees, kurtis, suits, lehengas, jeans…"
            value={rawQuery}
            onChange={handleInputChange}
            className="flex-1 text-sm sm:text-base text-[#242120] placeholder-[#9B9285] bg-transparent focus:outline-none"
          />
          {rawQuery && (
            <button
              type="button"
              onClick={handleClearQuery}
              className="text-xs text-[#8C8276] hover:text-[#242120] px-2 py-1 rounded hover:bg-[#F3EFE6] transition-colors flex-shrink-0"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[#4A453E] hover:text-[#721B29] rounded-full hover:bg-[#F3EFE6] transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto">
          <AnimatePresence mode="wait">

            {!query.trim() ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeCategories.length > 0 ? (
                  <>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8276] flex items-center gap-1.5 mb-3">
                      <Tag className="w-3 h-3" />
                      Shop by Category
                    </span>
                    <motion.div
                      className="flex flex-wrap gap-2"
                      initial="hidden"
                      animate="visible"
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.045 } } }}
                    >
                      {activeCategories.map((cat) => (
                        <motion.button
                          key={cat.id}
                          variants={{
                            hidden: { opacity: 0, scale: 0.85 },
                            visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 22 } },
                          }}
                          type="button"
                          onClick={() => handleCategoryClick(cat.name)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 rounded-full border border-[#D9CEBF] bg-white text-xs text-[#4A453E] hover:border-[#721B29] hover:text-[#721B29] hover:bg-[#FDF5F0] transition-colors"
                        >
                          {cat.name}
                        </motion.button>
                      ))}
                    </motion.div>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <Search className="w-8 h-8 mx-auto mb-2 text-[#D9CEBF]" />
                    <p className="text-sm font-serif font-semibold text-[#4A453E] mb-1">Start typing to search</p>
                    <p className="text-xs text-[#9B9285]">Find sarees, kurtis, suits, lehengas, jeans and more.</p>
                  </div>
                )}
              </motion.div>

            ) : searchResults.length === 0 && matchedCategories.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 text-center"
              >
                <Search className="w-10 h-10 mx-auto mb-3 text-[#D9CEBF]" />
                <p className="font-serif text-sm font-semibold text-[#242120] mb-1">
                  No styles found for "{query}"
                </p>
                <p className="text-xs text-[#736B63] mb-4">
                  Try "Saree", "Kurti", "Suit", "Lehenga" or browse categories
                </p>
                {activeCategories.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {activeCategories.slice(0, 5).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryClick(cat.name)}
                        className="px-3 py-1.5 rounded-full border border-[#D9CEBF] bg-white text-xs text-[#4A453E] hover:border-[#721B29] hover:text-[#721B29] transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Category quick-jump */}
                {matchedCategories.length > 0 && (
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8276] flex items-center gap-1.5 mb-2">
                      <Tag className="w-3 h-3" />
                      Categories
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {matchedCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryClick(cat.name)}
                          className="px-3 py-1.5 rounded-full border border-[#721B29]/40 bg-[#FDF5F0] text-xs text-[#721B29] font-semibold hover:bg-[#721B29] hover:text-white transition-colors flex items-center gap-1.5"
                        >
                          {highlightMatch(cat.name, query)}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product results */}
                {searchResults.length > 0 && (
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8276] block mb-2">
                      Products ({searchResults.length}{searchResults.length === 12 ? '+' : ''})
                    </span>
                    <div className="divide-y divide-[#EAE4D9]">
                      {searchResults.map((p, idx) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03, duration: 0.22 }}
                          onClick={() => handleProductSelect(p.id)}
                          className="py-3 flex items-center gap-3.5 hover:bg-[#F4EFE6] px-2 rounded-md transition-colors cursor-pointer group"
                        >
                          <img
                            src={getOptimizedImageUrl(p.images[0], 150, 75)}
                            alt={p.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                            }}
                            className="w-12 h-16 object-cover object-top rounded-sm border border-[#EAE4D9] flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] uppercase font-semibold text-[#B8860B] block">
                              {highlightMatch(p.category, query)}
                            </span>
                            <h4 className="font-serif text-xs sm:text-sm font-bold text-[#242120] leading-snug line-clamp-2">
                              {highlightMatch(p.title, query)}
                            </h4>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="font-sans text-xs font-bold text-[#721B29]">
                                ₹{p.price.toLocaleString('en-IN')}
                              </span>
                              {p.onSale && p.originalPrice > p.price && (
                                <span className="text-[10px] text-[#9B9285] line-through">
                                  ₹{p.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                              {p.isSoldOut && (
                                <span className="text-[10px] text-red-400 font-medium">Sold Out</span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#C4BAB0] group-hover:text-[#721B29] transition-colors flex-shrink-0" />
                        </motion.div>
                      ))}
                    </div>

                    {searchResults.length >= 5 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (matchedCategories.length > 0) {
                            navigateToCategory(matchedCategories[0].name as any);
                          }
                          setIsSearchOpen(false);
                        }}
                        className="w-full mt-3 py-2.5 text-xs font-semibold text-[#721B29] border border-[#721B29]/30 rounded-lg hover:bg-[#721B29] hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        View all results
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
