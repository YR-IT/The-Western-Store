import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Testimonial } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Star,
  CheckCircle2,
  Quote,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ArrowRight,
  Sparkles,
  Tag,
} from 'lucide-react';

const FILTER_TAGS = [
  'All',
  'Wedding Drape',
  'Ethnic Elegance',
  'Western Wear',
  'Campus Style',
  'Boutique Finish',
  'Budget Edit',
];

// Helper to generate initials from customer name
const getInitials = (name: string): string => {
  if (!name) return 'WS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Testimonials: React.FC = () => {
  const { navigateToProduct, testimonials, homeSections } = useStore();

  const sec = homeSections.find((s) => s.id === 'testimonials' || s.type === 'testimonials');
  const tagline = sec?.tagline || 'Voices of Kurukshetra';
  const title = sec?.title || 'Stories Woven in Grace';
  const subtitle =
    sec?.subtitle ||
    'Honest reflections and style stories from over 10,000 discerning patrons across Haryana and worldwide.';

  const [activeTag, setActiveTag] = useState<string>('All');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Filtered reviews based on tag
  const filteredReviews = useMemo(() => {
    return activeTag === 'All'
      ? testimonials
      : testimonials.filter((t) => t.tag === activeTag);
  }, [testimonials, activeTag]);

  // Update scroll arrow states
  const checkScrollPosition = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(checkScrollPosition, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [filteredReviews]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('div[data-card]')?.clientWidth || 380;
    const scrollAmount = (cardWidth + 24) * (direction === 'left' ? -1 : 1);
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScrollPosition, 350);
  };

  const handleHelpfulClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="testimonials-section"
      className="py-20 sm:py-28 bg-[#FAF7F2] border-t border-[#EAE2D2] w-full max-w-full overflow-hidden relative"
    >
      {/* Subtle Ambient Decorative Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#B8860B]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#721B29]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E1] border border-[#EADBBD] text-[#8F6808] text-[11px] font-bold uppercase tracking-widest mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>{tagline}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#242120] tracking-tight leading-tight">
            {title}
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-[#736B63] font-normal leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>

          {/* Luxury Rating Pill */}
          <div className="mt-6 inline-flex items-center gap-4 bg-white px-5 py-2 rounded-full border border-[#EAE0D0] shadow-xs">
            <div className="flex items-center gap-1.5">
              <div className="flex text-[#B8860B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#B8860B]" />
                ))}
              </div>
              <span className="font-serif font-bold text-xs text-[#242120]">4.9 / 5.0</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#C7BCAB]" />
            <span className="text-[11px] text-[#736B63] font-medium">
              Verified Kurukshetra Boutique Stories
            </span>
          </div>
        </div>

        {/* Filter Tags & Controls Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Style Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {FILTER_TAGS.map((tag) => {
              const isSelected = activeTag === tag;
              const count = tag === 'All'
                ? testimonials.length
                : testimonials.filter((t) => t.tag === tag).length;

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setActiveTag(tag);
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-4 py-2 text-xs rounded-full whitespace-nowrap transition-all font-medium border flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#721B29] text-white border-[#721B29] shadow-xs'
                      : 'bg-white text-[#5C554E] border-[#E8DFC9] hover:border-[#721B29] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>{tag}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#F2ECE0] text-[#736B63]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Smooth Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? 'bg-white border-[#D9CEBF] text-[#242120] hover:bg-[#721B29] hover:text-white hover:border-[#721B29] shadow-xs'
                  : 'bg-white/60 border-[#EAE2D2] text-[#B8AF9E] cursor-not-allowed opacity-50'
              }`}
              aria-label="Previous stories"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-white border-[#D9CEBF] text-[#242120] hover:bg-[#721B29] hover:text-white hover:border-[#721B29] shadow-xs'
                  : 'bg-white/60 border-[#EAE2D2] text-[#B8AF9E] cursor-not-allowed opacity-50'
              }`}
              aria-label="Next stories"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ultra-Smooth Touch/Drag Scroll Carousel */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE4D9]">
            <Sparkles className="w-8 h-8 text-[#B8860B] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#242120]">No reviews under this category</h3>
            <p className="text-xs text-[#736B63] mt-1">Explore all stories to see testimonials from other collections.</p>
            <button
              type="button"
              onClick={() => setActiveTag('All')}
              className="mt-4 px-5 py-2 bg-[#721B29] text-white text-xs font-semibold rounded-lg hover:bg-[#852031] transition-colors cursor-pointer"
            >
              View All Stories
            </button>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth scrollbar-none"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredReviews.map((review, idx) => {
              const isVoted = helpfulVotes[review.id];
              const displayHelpful = (review.helpfulCount || 0) + (isVoted ? 1 : 0);
              const initials = getInitials(review.name);

              return (
                <div
                  key={review.id || idx}
                  data-card
                  className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)] shrink-0 snap-start flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E0D2] shadow-xs hover:shadow-xl hover:border-[#CBB799] transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Top Gold Shimmer Border Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#721B29]/30 via-[#B8860B] to-[#721B29]/30 opacity-70 group-hover:opacity-100 transition-opacity" />

                  {/* Decorative Subtle Quote Icon */}
                  <Quote className="w-12 h-12 text-[#F5EFE6] absolute right-4 top-5 -z-0 pointer-events-none group-hover:text-[#EFE6D8] transition-colors" />

                  {/* Card Upper: Author Seal, Name & Star Rating */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {/* Monogram Badge */}
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#721B29] to-[#450E17] text-white flex items-center justify-center font-serif font-bold text-sm tracking-wider shadow-sm ring-2 ring-[#B8860B]/30 shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-serif text-base font-bold text-[#242120] leading-tight">
                              {review.name}
                            </h4>
                            {review.verified && (
                              <span
                                className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                                title="Verified Kurukshetra Boutique Shopper"
                              >
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Verified Patron</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#8C8276] mt-0.5">{review.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stars & Tag Strip */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#F4EFE6]">
                      <div className="flex items-center gap-1">
                        <div className="flex text-[#B8860B]">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#B8860B]" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#242120] ml-1">
                          {review.rating}.0
                        </span>
                      </div>

                      {review.tag && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5EC] text-[#8F6808] border border-[#EADBBD] text-[10px] font-semibold uppercase tracking-wider">
                          {review.tag}
                        </span>
                      )}
                    </div>

                    {/* Review Quote Body */}
                    <p className="font-serif text-sm sm:text-base text-[#3A332E] font-normal leading-relaxed italic mb-6">
                      "{review.comment}"
                    </p>
                  </div>

                  {/* Card Lower: Outfit Details Ribbon & Helpful Button */}
                  <div className="relative z-10 pt-4 border-t border-[#F4EFE6] space-y-3">
                    {/* Curated Outfit Bar */}
                    {review.outfitPurchased && (
                      <div className="bg-[#FAF7F0] rounded-xl px-3.5 py-2.5 border border-[#EAE2D2] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Tag className="w-3.5 h-3.5 text-[#721B29] shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-[#8C8276] block">
                              Curated Outfit
                            </span>
                            <span className="font-serif text-xs font-bold text-[#242120] truncate block">
                              {review.outfitPurchased}
                            </span>
                          </div>
                        </div>

                        {review.productId && (
                          <button
                            type="button"
                            onClick={() => review.productId && navigateToProduct(review.productId)}
                            className="text-[11px] font-bold text-[#721B29] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Footer Row */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-[#8C8276]">{review.date}</span>

                      <button
                        type="button"
                        onClick={(e) => handleHelpfulClick(review.id, e)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all border cursor-pointer ${
                          isVoted
                            ? 'bg-rose-50 text-[#721B29] border-rose-200 font-bold'
                            : 'bg-white text-[#736B63] border-[#E8E0D2] hover:bg-[#FAF8F5] hover:text-[#242120]'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? 'fill-[#721B29] text-[#721B29]' : ''}`} />
                        <span>Helpful ({displayHelpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile Swipe Guidance Note */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 mt-4 text-[11px] text-[#8C8276]">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Swipe horizontally to explore more stories</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </section>
  );
};
