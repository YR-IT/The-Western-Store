import React, { useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const ShopByCategory: React.FC = () => {
  const { categories, products, navigateToCategory } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isCarouselMode = categories.length >= 5;

  // Repeat categories 4 times to create an infinite loop track when in carousel mode
  const displayCategories = React.useMemo(() => {
    if (categories.length === 0) return [];
    if (!isCarouselMode) return categories;
    return [...categories, ...categories, ...categories, ...categories];
  }, [categories, isCarouselMode]);

  // Center scroll position on initial load if carousel
  useEffect(() => {
    if (isCarouselMode && scrollRef.current && displayCategories.length > 0) {
      const container = scrollRef.current;
      container.scrollLeft = container.scrollWidth / 3;
    }
  }, [displayCategories, isCarouselMode]);

  // Handle scroll wrapping for infinite loop effect
  const handleScroll = () => {
    if (!isCarouselMode || !scrollRef.current) return;
    const container = scrollRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;

    // Loop around when reaching right end
    if (scrollLeft + clientWidth >= scrollWidth - 40) {
      container.scrollLeft = scrollWidth / 3;
    } 
    // Loop around when reaching left end
    else if (scrollLeft <= 40) {
      container.scrollLeft = scrollWidth / 3;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      id="shop-by-category"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="py-10 sm:py-16 bg-[#FDFBF7] border-b border-[#EAE4D9]/60 w-full max-w-full overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-[#B8860B] text-xs font-semibold tracking-widest uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#242120] tracking-tight">
            Shop By Category
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-[#736B63] max-w-md font-normal px-2">
            Explore ready-to-wear ethnic silhouettes and contemporary western edits curated for effortless elegance.
          </p>

          {/* Carousel Nav Arrows & Counter (Only shown when 5 or more categories) */}
          {isCarouselMode && (
            <div className="flex items-center gap-3 mt-4 text-xs text-[#736B63]">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="p-2 rounded-full border border-[#D9D2C5] bg-white hover:border-[#721B29] hover:bg-[#721B29] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-serif tracking-widest text-[#242120] font-semibold">
                {categories.length} Collections
              </span>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="p-2 rounded-full border border-[#D9D2C5] bg-white hover:border-[#721B29] hover:bg-[#721B29] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                aria-label="Next categories"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Layout: Carousel Mode for >= 5 categories, Centered Static Grid for < 5 */}
        {isCarouselMode ? (
          <div className="relative max-w-6xl mx-auto">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex items-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar pb-4 pt-2 px-2 snap-x scroll-smooth w-full justify-start"
            >
              {displayCategories.map((category, idx) => {
                const productCount = products.filter((p) => p.category === category.name).length;
                return (
                  <motion.div
                    key={`${category.id}-${idx}`}
                    id={`cat-tile-${category.slug}-${idx}`}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (idx % categories.length) * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateToCategory(category.name)}
                    className="flex-shrink-0 w-36 xs:w-40 sm:w-48 flex flex-col items-center text-center cursor-pointer group snap-center"
                  >
                    <div className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44 rounded-full p-1.5 border-2 border-[#D9CEBF] group-hover:border-[#721B29] transition-all duration-300 shadow-sm group-hover:shadow-lg bg-white">
                      <div className="w-full h-full rounded-full overflow-hidden relative">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    <div className="mt-4 px-1 w-full">
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#242120] group-hover:text-[#721B29] transition-colors leading-snug">
                        {category.name}
                      </h3>
                      {category.subtitle && (
                        <p className="text-xs text-[#736B63] mt-1 font-normal line-clamp-1">
                          {category.subtitle}
                        </p>
                      )}
                      <p className="text-[11px] font-semibold text-[#8C8276] mt-0.5">
                        {productCount > 0 ? `${productCount} styles` : `${category.itemCount || 0} styles`}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Static Centered Layout when < 5 Categories */
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12 w-full max-w-5xl mx-auto pb-2">
            {categories.map((category, idx) => {
              const productCount = products.filter((p) => p.category === category.name).length;
              return (
                <motion.div
                  key={category.id}
                  id={`cat-tile-${category.slug}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateToCategory(category.name)}
                  className="flex-shrink-0 w-36 xs:w-40 sm:w-48 flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44 rounded-full p-1.5 border-2 border-[#D9CEBF] group-hover:border-[#721B29] transition-all duration-300 shadow-sm group-hover:shadow-lg bg-white">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="mt-4 px-1 w-full">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#242120] group-hover:text-[#721B29] transition-colors leading-snug">
                      {category.name}
                    </h3>
                    {category.subtitle && (
                      <p className="text-xs text-[#736B63] mt-1 font-normal line-clamp-1">
                        {category.subtitle}
                      </p>
                    )}
                    <p className="text-[11px] font-semibold text-[#8C8276] mt-0.5">
                      {productCount > 0 ? `${productCount} styles` : `${category.itemCount || 0} styles`}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
};
