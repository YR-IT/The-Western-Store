import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setView } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-[#FDFBF7] py-6 sm:py-14 w-full max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8 pb-4 border-b border-[#EAE4D9]">
          <button
            type="button"
            onClick={() => setView('home')}
            className="inline-flex items-center gap-1.5 text-xs text-[#721B29] font-medium hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
          <div className="flex items-baseline justify-between">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#242120]">
              My Saved Wishlist
            </h1>
            <span className="text-xs text-[#736B63]">
              {wishlistedProducts.length} Saved Design{wishlistedProducts.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {wishlistedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-8 sm:p-12 text-center border border-[#EAE4D9] max-w-md mx-auto"
          >
            <Heart className="w-12 h-12 text-[#C9BFB0] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#242120]">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-[#736B63] mt-1 mb-5">
              Click the heart icon on any saree, suit, or dress to save it for later.
            </p>
            <button
              type="button"
              onClick={() => setView('plp')}
              className="px-5 py-2.5 bg-[#721B29] text-white text-xs font-semibold rounded-xs hover:bg-[#852031] transition-colors"
            >
              Explore Collections
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
