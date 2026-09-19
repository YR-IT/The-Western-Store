import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { BudgetTier } from '../types';
import { ArrowRight, Tag } from 'lucide-react';

interface BudgetTile {
  tier: BudgetTier;
  title: string;
  priceLabel: string;
  subtitle: string;
  itemsPreview: string;
  image: string;
  badge: string;
}

const BUDGET_TILES: BudgetTile[] = [
  {
    tier: 'under_999',
    title: 'Pocket Friendly Chic',
    priceLabel: 'Under ₹999',
    subtitle: 'Daily cotton kurtis, Korean crop tops & chic summer co-ords',
    itemsPreview: '15+ styles available',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    badge: 'College & Daily Edit',
  },
  {
    tier: 'under_1499',
    title: 'Mid-Tier Elegance',
    priceLabel: 'Under ₹1,499',
    subtitle: 'Flowy anarkali suits, tiered dresses & vintage wide-leg jeans',
    itemsPreview: '28+ styles available',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    badge: 'Most Popular',
  },
  {
    tier: 'under_1999',
    title: 'Festive & Premium',
    priceLabel: 'Under ₹1,999',
    subtitle: 'Pre-stitched georgette sarees, fusion capes & embroidered sets',
    itemsPreview: '22+ styles available',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    badge: 'Wedding Guest Favorite',
  },
  {
    tier: 'under_2499',
    title: 'Royal Celebration',
    priceLabel: 'Under ₹2,499',
    subtitle: 'Heavy embroidered organza suits, bridal co-ords & festive drapes',
    itemsPreview: '18+ styles available',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    badge: 'Grand Festive Edit',
  },
];

export const ShopByBudget: React.FC = () => {
  const { navigateToBudget, budgetTiles, homeSections } = useStore();

  const sec = homeSections.find((s) => s.id === 'budget-edit' || s.type === 'budget-edit');
  const tagline = sec?.tagline || 'Smart Shopping';
  const title = sec?.title || 'Shop By Budget';
  const subtitle =
    sec?.subtitle ||
    'Effortless style crafted for every milestone, whether you’re refreshing your everyday rotation or dressing up for a sangeet.';

  return (
    <motion.section
      id="shop-by-budget"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="py-12 sm:py-18 bg-[#F8F5EE] border-y border-[#E8E1D5] w-full max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#B8860B]">
            <Tag className="w-3.5 h-3.5" />
            <span>{tagline}</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#242120] mt-1.5 tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#736B63] font-normal">
            {subtitle}
          </p>
        </div>

        {/* 4 Budget Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
          {budgetTiles.map((tile, idx) => (
            <motion.div
              key={tile.tier}
              id={`budget-tile-${tile.tier}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => navigateToBudget(tile.tier)}
              className="group relative h-[340px] xs:h-[380px] sm:h-[420px] rounded-xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500 border border-[#E0D7C8] bg-white flex flex-col justify-end w-full"
            >
              {/* Background Image with Zoom */}
              <img
                src={tile.image}
                alt={tile.priceLabel}
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Shading Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Bottom Content Box - Only Price Label and Explore Now */}
              <div className="relative z-10 p-5 sm:p-6 text-white w-full">
                <div className="mb-3 sm:mb-4">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7] tracking-tight block">
                    {tile.priceLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/20 w-full">
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E6C280] group-hover:text-white transition-colors">
                    <span>Explore Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
