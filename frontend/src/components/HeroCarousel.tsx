import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HeroCarousel: React.FC = () => {
  const { heroSlides, navigateToCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  const goToSlide = (idx: number) => setCurrentSlide(idx);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  if (!heroSlides || heroSlides.length === 0) return null;

  const active = heroSlides[currentSlide];

  return (
    <section
      id="hero-carousel"
      className="relative w-full overflow-hidden bg-[#0D0809] select-none"
      style={{ height: '100svh', minHeight: '600px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10">
        <motion.div
          key={currentSlide}
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? undefined : '100%' }}
          transition={{ duration: 6, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-[#B8860B] via-[#F0D080] to-[#B8860B]"
        />
      </div>

      {/* Slide Backgrounds */}
      {heroSlides.map((slide, index) => {
        const isCurrent = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover object-center transition-transform duration-[8000ms] ease-out ${
                isCurrent ? 'scale-110' : 'scale-100'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            {/* Cinematic Gradient Layers */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
              }}
            />
          </div>
        );
      })}

      {/* Centered Content Overlay */}
      <div className="relative z-20 h-full flex flex-col items-center justify-end pb-24 sm:pb-32 px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className="flex flex-col items-center gap-4 sm:gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(4px)' }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Tagline Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#E6C280]/40 text-[#E6C280] text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase"
            >
              <Sparkles className="w-3 h-3 text-[#E6C280] shrink-0" />
              <span>{active.tagline}</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              className="font-serif text-5xl xs:text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight"
              style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}
            >
              {active.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm sm:text-base lg:text-lg text-white/70 font-light leading-relaxed max-w-xl"
            >
              {active.subtitle}
            </motion.p>

            {/* Gold Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
              className="w-16 h-px bg-gradient-to-r from-transparent via-[#E6C280] to-transparent"
            />

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.45 }}
              className="flex flex-col xs:flex-row items-center gap-3 sm:gap-4 pt-1"
            >
              <button
                id={`hero-cta-${active.id}`}
                type="button"
                onClick={() => navigateToCategory(active.category)}
                className="group px-8 sm:px-10 py-3.5 sm:py-4 bg-[#721B29] hover:bg-[#8a2133] text-white text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-3 shadow-2xl active:scale-95 border border-[#962638]/60"
                style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
              >
                <span>{active.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>

              <button
                type="button"
                onClick={() => navigateToCategory('All')}
                className="px-8 sm:px-10 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 border border-white/25 active:scale-95"
                style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
              >
                View Full Catalog
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-7 sm:bottom-9 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12">
        {/* Slide Dots */}
        <div className="flex items-center gap-2.5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-[2px] rounded-full transition-all duration-400 cursor-pointer ${
                i === currentSlide
                  ? 'w-10 bg-[#E6C280]'
                  : 'w-3 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Counter + Arrows */}
        <div className="flex items-center gap-3">
          <div className="hidden xs:flex items-center gap-1.5 text-white/60 text-xs font-mono tracking-widest">
            <span className="text-[#E6C280] font-bold text-sm">0{currentSlide + 1}</span>
            <span className="text-white/30 mx-0.5">/</span>
            <span>0{heroSlides.length}</span>
          </div>

          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-full p-1">
            <button
              id="hero-prev-btn"
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="hero-next-btn"
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
