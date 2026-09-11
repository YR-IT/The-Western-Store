import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigateToProduct, setSelectedCategory, setView } = useStore();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fabricCare.fabric.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!isSearchOpen) return null;

  const popularSearches = [
    'Ethnic Wear',
    'Western Wear',
    'Pre-stitched Saree',
    'Co-ord Sets',
    'Wide Leg Jeans',
    'Under ₹999',
    'Anarkali Suit',
  ];

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
  };

  const handleProductSelect = (id: string) => {
    navigateToProduct(id);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-xl shadow-2xl border border-[#E0D7C8] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Input header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE4D9] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#721B29]" />
          <input
            type="text"
            autoFocus
            placeholder="Search ready-to-wear sarees, lehengas, kurtis, jeans..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm sm:text-base text-[#242120] placeholder-[#9B9285] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-[#8C8276] hover:text-[#242120] p-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[#4A453E] hover:text-[#721B29] rounded-full hover:bg-[#F3EFE6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions or Results */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {!query ? (
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8276] block mb-3">
                Trending in Kurukshetra
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSuggestionClick(term)}
                    className="px-3 py-1.5 rounded-full border border-[#D9CEBF] bg-white text-xs text-[#4A453E] hover:border-[#721B29] hover:text-[#721B29] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#736B63]">
              <p className="font-serif text-sm font-semibold text-[#242120] mb-1">
                No styles found for "{query}"
              </p>
              <p>Try searching for "Saree", "Suit", "Kurti", or "Cord Set"</p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8276] block">
                Matching Styles ({searchResults.length})
              </span>
              <div className="divide-y divide-[#EAE4D9]">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleProductSelect(p.id)}
                    className="py-3 flex items-center gap-3.5 hover:bg-[#F4EFE6] px-2 rounded-md transition-colors cursor-pointer"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-12 h-16 object-cover object-top rounded-xs border border-[#EAE4D9]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-semibold text-[#B8860B] block">
                        {p.category}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-[#242120] truncate">
                        {p.title}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-sans text-xs font-bold text-[#721B29]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        {p.onSale && (
                          <span className="text-[10px] text-[#9B9285] line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8C8276]" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
