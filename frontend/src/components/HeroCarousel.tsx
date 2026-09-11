import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

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

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  if (!heroSlides || heroSlides.length === 0) return null;

  const active = heroSlides[currentSlide];

  return (
    <section
      id="hero-carousel"
      className="relative w-full h-[520px] sm:h-[580px] lg:h-[650px] overflow-hidden bg-[#241B1A]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Images */}
      {heroSlides.map((slide, index) => {
        const isCurrent = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background image with subtle zoom */}
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out ${
                isCurrent ? 'scale-105' : 'scale-100'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            {/* Editorial overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        );
      })}

      {/* Slide Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-10 lg:px-12 flex flex-col justify-center">
        <div className="max-w-xl text-white">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-[#FDFBF7]/15 backdrop-blur-md border border-white/20 text-[#E6C280] text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-3 sm:mb-4 animate-in fade-in duration-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6C280]" />
            <span>{active.tagline}</span>
          </div>

          <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FDFBF7] leading-tight mb-3 sm:mb-4 drop-shadow-xs">
            {active.title}
          </h1>

          <p className="text-xs sm:text-base text-[#FDFBF7]/90 font-light leading-relaxed mb-6 sm:mb-8 max-w-lg">
            {active.subtitle}
          </p>

          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4">
            <button
              id={`hero-cta-${active.id}`}
              type="button"
              onClick={() => navigateToCategory(active.category)}
              className="px-5 sm:px-7 py-3 sm:py-3.5 bg-[#721B29] text-white hover:bg-[#852031] transition-all font-medium text-xs sm:text-sm tracking-wide rounded-xs shadow-lg shadow-black/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{active.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => navigateToCategory('Ethnic & Western Wear')}
              className="px-4 sm:px-6 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-all font-medium text-xs sm:text-sm tracking-wide rounded-xs border border-white/30 text-center"
            >
              Explore All Collections
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-12 z-20 flex items-center gap-3">
        {/* Pagination Indicator */}
        <div className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium tracking-widest flex items-center gap-1.5">
          <span>0{currentSlide + 1}</span>
          <span className="text-white/40">/</span>
          <span className="text-white/60">0{heroSlides.length}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md p-1 rounded-full border border-white/20">
          <button
            id="hero-prev-btn"
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            id="hero-next-btn"
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom slide dots */}
      <div className="absolute bottom-6 left-6 sm:left-12 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === currentSlide ? 'w-8 bg-[#E6C280]' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
