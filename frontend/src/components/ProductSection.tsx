import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface ProductSectionProps {
  id: string;
  tagline: string;
  title: string;
  subtitle?: string;
  products: Product[];
  onViewAll?: () => void;
  scrollable?: boolean;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  id,
  tagline,
  title,
  subtitle,
  products,
  onViewAll,
  scrollable = true,
}) => {
  const { setView, setSelectedCategory } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleDefaultViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      setSelectedCategory('All');
      setView('plp');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="py-10 sm:py-16 bg-[#FDFBF7] w-full max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4 border-b border-[#EAE4D9] pb-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-[#B8860B]">
              {tagline}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#242120] mt-1 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#736B63] mt-1 max-w-lg font-light">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Action: Scroll Arrows + View All */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleDefaultViewAll}
              className="text-xs font-semibold text-[#721B29] hover:text-[#52131D] flex items-center gap-1 group"
            >
              <span>View Collection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            {scrollable && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  className="w-8 h-8 rounded-full border border-[#D9CEBF] hover:border-[#721B29] text-[#4A453E] hover:text-[#721B29] flex items-center justify-center transition-colors"
                  aria-label="Previous items"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  className="w-8 h-8 rounded-full border border-[#D9CEBF] hover:border-[#721B29] text-[#4A453E] hover:text-[#721B29] flex items-center justify-center transition-colors"
                  aria-label="Next items"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel / Grid */}
        {scrollable ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 w-auto"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[195px] xs:w-[220px] sm:w-[260px] lg:w-[280px] flex-shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 items-stretch">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};
