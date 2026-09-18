import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const EditorialLookbook: React.FC = () => {
  const { setView, setSelectedCategory, homeSections } = useStore();

  const lookbookSection = homeSections.find((s) => s.id === 'lookbook' || s.type === 'lookbook');
  
  // Dynamic or fallback content matching the editorial banner style
  const bannerImg =
    lookbookSection?.images?.[0] ||
    'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1400&q=85';
  const title = lookbookSection?.title || 'HANDBAGS';
  const tagline = lookbookSection?.tagline || 'Min. 60% Off';
  const subtitle = lookbookSection?.subtitle || 'Curated luxury collection crafted for every modern silhouette.';
  const buttonText = lookbookSection?.buttonText || 'Explore';
  const buttonLink = lookbookSection?.buttonLink || 'plp';

  const handleNavigate = () => {
    setSelectedCategory('All');
    setView('plp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.section
      id="lookbook-section"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="py-6 sm:py-10 md:py-12 bg-[#FDFBF7] w-full max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Editorial Split Banner Card */}
        <div
          onClick={handleNavigate}
          className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-[#EAE4D9] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row items-stretch min-h-[360px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[500px]"
        >
          {/* Top-Left Boutique Tag Badge */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#EAE4D9] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#721B29] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#242120] uppercase font-sans">
              The Western Store
            </span>
          </div>

          {/* Left Side: Product Showcase Image with Studio Background */}
          <div className="relative w-full md:w-3/5 lg:w-[62%] min-h-[260px] sm:min-h-[340px] md:min-h-full bg-gradient-to-r from-[#F9F8F6] via-[#FDFBF7] to-white flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-radial from-amber-50/40 via-transparent to-transparent opacity-70 pointer-events-none" />

            <img
              src={bannerImg}
              alt={title}
              className="relative z-10 w-full h-full max-h-[460px] object-contain object-center group-hover:scale-103 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>

          {/* Right Side: High-Fashion Minimalist Typography & Explore Action */}
          <div className="relative w-full md:w-2/5 lg:w-[38%] bg-white p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center items-start md:items-start border-t md:border-t-0 md:border-l border-[#F0EBE1] z-10">
            {/* Main Bold Uppercase Serif Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#1A1817] tracking-tight uppercase leading-[1.08]">
              {title}
            </h2>

            {/* Discount / Tagline Offer */}
            <p className="font-serif text-lg sm:text-2xl md:text-3xl text-[#4A433E] font-normal mt-2 sm:mt-3 leading-snug">
              {tagline}
            </p>

            {/* Optional Subtitle (if available) */}
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#7A7269] font-light mt-2 max-w-sm leading-relaxed hidden sm:block">
                {subtitle}
              </p>
            )}

            {/* Delicate Hairline Separator */}
            <div className="w-full max-w-[240px] sm:max-w-[280px] h-[1px] bg-[#EAE4D9] my-4 sm:my-6" />

            {/* "+ Explore" Interactive Button */}
            <div className="inline-flex items-center gap-2 pt-1 group/btn">
              <span className="text-[#721B29] font-light text-lg sm:text-xl transition-transform duration-300 group-hover/btn:rotate-90">
                +
              </span>
              <span className="text-xs sm:text-sm md:text-base font-sans font-medium uppercase tracking-widest text-[#721B29] group-hover/btn:text-[#52131D] transition-colors relative">
                {buttonText.replace(/^\+\s*/, '')}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#721B29] group-hover/btn:w-full transition-all duration-300" />
              </span>
              <ArrowRight className="w-4 h-4 text-[#721B29] -translate-x-1 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
