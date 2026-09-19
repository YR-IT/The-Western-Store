import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HeroCarousel: React.FC = () => {
  const { heroSlides, navigateToCategory, navigateToPlp } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Responsive device view detection (Desktop >= 768px, Mobile < 768px)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter slides according to current device view
  const activeSlides = useMemo(() => {
    if (!heroSlides || heroSlides.length === 0) return [];
    const filtered = heroSlides.filter((slide) => {
      const target = slide.targetDevice || 'all';
      if (isMobile) {
        return target === 'mobile' || target === 'all';
      }
      return target === 'desktop' || target === 'all';
    });
    return filtered.length > 0 ? filtered : heroSlides;
  }, [heroSlides, isMobile]);

  // Ensure currentSlide is within bounds when slides change
  useEffect(() => {
    if (currentSlide >= activeSlides.length) {
      setCurrentSlide(0);
    }
  }, [activeSlides.length, currentSlide]);

  const nextSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  const goToSlide = (idx: number) => setCurrentSlide(idx);

  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, activeSlides.length]);

  if (!activeSlides || activeSlides.length === 0) return null;

  const active = activeSlides[currentSlide] || activeSlides[0];

  const handleSlideClick = () => {
    if (!active) return;
    if (active.linkUrl) {
      if (active.linkUrl.startsWith('http')) {
        window.open(active.linkUrl, '_blank');
      } else {
        navigateToPlp();
      }
      return;
    }
    if (active.category && active.category !== 'All') {
      navigateToCategory(active.category);
    } else {
      navigateToPlp();
    }
  };

  return (
    <section
      id="hero-carousel"
      className="relative w-full overflow-hidden bg-[#0D0809] select-none cursor-pointer h-[min(calc(100svh-98px),740px)] min-h-[420px] md:h-auto md:min-h-0 md:aspect-[16/9]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={handleSlideClick}
    >
      {/* Top Progress Bar */}
      {activeSlides.length > 1 && (
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10 pointer-events-none">
          <motion.div
            key={`${currentSlide}-${active?.id}`}
            initial={{ width: '0%' }}
            animate={{ width: isPaused ? undefined : '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-[#B8860B] via-[#F0D080] to-[#B8860B]"
          />
        </div>
      )}

      {/* Responsive Slide Banners */}
      {activeSlides.map((slide, index) => {
        const isCurrent = index === currentSlide;
        // Resolve correct images per device target
        const desktopImg = slide.desktopImage || slide.image;
        const mobileImg = slide.mobileImage || slide.image || slide.desktopImage;

        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Render the right image(s) per targetDevice */}
            {slide.targetDevice === 'desktop' ? (
              <img
                src={desktopImg}
                alt={slide.title || 'The Western Store Desktop Banner'}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding={index === 0 ? 'sync' : 'async'}
                fetchPriority={index === 0 ? 'high' : 'low'}
              />
            ) : slide.targetDevice === 'mobile' ? (
              <img
                src={mobileImg}
                alt={slide.title || 'The Western Store Mobile Banner'}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding={index === 0 ? 'sync' : 'async'}
                fetchPriority={index === 0 ? 'high' : 'low'}
              />
            ) : (
              /* 'all' — use <picture> to serve widescreen on desktop, portrait on mobile */
              <picture className="w-full h-full block">
                {desktopImg && <source media="(min-width: 768px)" srcSet={desktopImg} />}
                <img
                  src={mobileImg}
                  alt={slide.title || 'The Western Store Banner'}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding={index === 0 ? 'sync' : 'async'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                />
              </picture>
            )}

            {/* Optional Subtle Shadow Overlay only if text overlay is enabled */}
            {slide.showTextOverlay && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />
              </>
            )}
          </div>
        );
      })}

      {/* Optional Centered Content Overlay (Only renders if showTextOverlay is true) */}
      {active && active.showTextOverlay && (
        <div className="relative z-20 h-full flex flex-col items-center justify-end pb-24 sm:pb-28 px-4 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="flex flex-col items-center gap-4 sm:gap-5 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {active.tagline && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#E6C280]/40 text-[#E6C280] text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase shadow-md"
                >
                  <Sparkles className="w-3 h-3 text-[#E6C280] shrink-0" />
                  <span>{active.tagline}</span>
                </motion.div>
              )}

              {active.title && (
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="font-serif text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight"
                  style={{ textShadow: '0 4px 30px rgba(0,0,0,0.7)' }}
                >
                  {active.title}
                </motion.h1>
              )}

              {active.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.45 }}
                  className="text-xs sm:text-sm lg:text-base text-white/80 font-light leading-relaxed max-w-xl"
                >
                  {active.subtitle}
                </motion.p>
              )}

              {/* Action Button */}
              {active.ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="pt-2 pointer-events-auto"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSlideClick();
                    }}
                    className="group px-7 sm:px-9 py-3 sm:py-3.5 bg-[#721B29] hover:bg-[#8a2133] text-white text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-2.5 shadow-2xl active:scale-95 border border-[#962638]/60 cursor-pointer"
                    style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                  >
                    <span>{active.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Bottom Slider Indicators & Controls */}
      {activeSlides.length > 1 && (
        <div
          className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Slide Line Dots */}
          <div className="flex items-center gap-2.5">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer shadow-sm ${
                  i === currentSlide
                    ? 'w-10 bg-[#E6C280]'
                    : 'w-3.5 bg-white/40 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          {/* Slide Counter & Next/Prev Arrows */}
          <div className="flex items-center gap-3">
            <div className="hidden xs:flex items-center gap-1.5 text-white/80 text-xs font-mono tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="text-[#E6C280] font-bold">0{currentSlide + 1}</span>
              <span className="text-white/40">/</span>
              <span>0{activeSlides.length}</span>
            </div>

            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/15 rounded-full p-1 shadow-lg">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


