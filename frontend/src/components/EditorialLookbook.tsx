import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Sparkles, ArrowRight, Eye } from 'lucide-react';

export const EditorialLookbook: React.FC = () => {
  const { navigateToProduct, setQuickViewProduct, products, homeSections } = useStore();
  const [activeHotspot, setActiveHotspot] = useState<number>(0);

  const lookbookSection = homeSections.find((s) => s.id === 'lookbook' || s.type === 'lookbook');
  const bannerImg =
    lookbookSection?.images?.[0] ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85';
  const tagline = lookbookSection?.tagline || 'Editorial Series • Volume IV';
  const title = lookbookSection?.title || 'Curated Kurukshetra Lookbook';
  const subtitle =
    lookbookSection?.subtitle ||
    'From regal farewell soirées to easy Sunday brunching on Railway Road. Designed for real comfort, drape-tested for confidence.';

  // Look items
  const featuredSaree = products.find((p) => p.id === 'prod-1') || products[0];
  const featuredCordSet = products.find((p) => p.id === 'prod-4') || products[3];

  const hotspots = [
    {
      id: 0,
      x: '38%',
      y: '45%',
      label: 'Pre-Stitched Drape',
      product: featuredSaree,
    },
    {
      id: 1,
      x: '68%',
      y: '55%',
      label: 'Fusion Co-Ord Set',
      product: featuredCordSet,
    },
  ];

  const activeProduct = hotspots[activeHotspot].product;

  return (
    <motion.section
      id="lookbook-section"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="py-12 sm:py-20 bg-[#241C1D] text-[#FDFBF7] relative w-full max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-12 gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#E6C280] text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{tagline}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#D1C7B8] max-w-md font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Big Editorial Lifestyle Stage */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#1A1415] min-h-[460px] sm:min-h-[550px] md:min-h-[600px] flex flex-col justify-end w-full">
          {/* Lifestyle photography */}
          <img
            src={bannerImg}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

          {/* Interactive Hotspot Pulses on the Model */}
          {hotspots.map((spot, idx) => (
            <div
              key={spot.id}
              style={{ left: spot.x, top: spot.y }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setActiveHotspot(idx)}
            >
              <div className="relative group">
                {/* Ping ring */}
                <span className="animate-ping absolute inline-flex h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#E6C280] opacity-75" />
                {/* Center dot */}
                <div
                  className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${
                    activeHotspot === idx
                      ? 'bg-[#721B29] border-[#E6C280] text-white scale-110'
                      : 'bg-white/90 border-[#721B29] text-[#721B29]'
                  }`}
                >
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                {/* Tooltip on hover */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-sm text-[11px] font-medium text-white border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                  {spot.label}
                </div>
              </div>
            </div>
          ))}

          {/* "Shop the Look" Callout Card */}
          <div className="relative z-20 p-4 sm:p-8 md:p-10 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4 sm:gap-6 w-full">
            {/* Editorial Caption */}
            <div className="max-w-md">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#E6C280]">
                Featured Ensemble
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-bold text-white mt-1 leading-snug">
                The Ready Drape in Royal Ruby
              </h3>
              <p className="text-xs sm:text-sm text-white/80 font-light mt-1.5 sm:mt-2 leading-relaxed">
                Pre-stitched pleats paired with an embellished belt. Zero safety pins required, maximum twirl guaranteed.
              </p>
            </div>

            {/* Floating Product Callout Card */}
            <div className="w-full sm:w-80 bg-white/95 backdrop-blur-md text-[#242120] rounded-xl p-3.5 sm:p-4 shadow-xl border border-white/30 flex items-center gap-3">
              <img
                src={activeProduct.images[0]}
                alt={activeProduct.title}
                className="w-16 h-20 sm:w-18 sm:h-22 object-cover object-top rounded-md border border-[#EAE4D9] flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#721B29] block">
                  Shop The Look
                </span>
                <h4 className="font-serif text-xs sm:text-sm font-bold text-[#242120] truncate mt-0.5">
                  {activeProduct.title}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-sans font-bold text-xs sm:text-sm text-[#721B29]">
                    ₹{activeProduct.price.toLocaleString('en-IN')}
                  </span>
                  {activeProduct.onSale && (
                    <span className="text-[10px] sm:text-[11px] text-[#8C8276] line-through">
                      ₹{activeProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateToProduct(activeProduct.id)}
                    className="flex-1 py-1.5 px-2 bg-[#721B29] text-white text-[10px] sm:text-[11px] font-semibold rounded-xs hover:bg-[#852031] transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View Detail</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(activeProduct)}
                    className="p-1.5 border border-[#D9CEBF] text-[#4A453E] hover:text-[#721B29] rounded-xs hover:bg-[#F3EFE6] transition-colors"
                    title="Quick View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
