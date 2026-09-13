import React from 'react';
import { motion } from 'motion/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import shoppingCartLottie from '../gifs/shopping cart.lottie';
import walletLottie from '../gifs/Wallet.lottie';
import supportIconLottie from '../gifs/Support icon.lottie';

const HARDCODED_TRUST_FEATURES = [
  {
    id: 'free-shipping',
    title: 'Free Shipping',
    description: 'Free shipping on orders above ₹999',
    lottie: shoppingCartLottie,
  },
  {
    id: 'flexible-payment',
    title: 'Flexible Payment',
    description: 'Multiple payment options available',
    lottie: walletLottie,
  },
  {
    id: 'premium-support',
    title: 'Premium Support',
    description: '24/7 customer support',
    lottie: supportIconLottie,
  },
];

export const TrustStrip: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      className="py-12 sm:py-16 bg-white border-y border-[#EAE4D9]/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-center"
        >
          {HARDCODED_TRUST_FEATURES.map((tf) => (
            <motion.div
              key={tf.id}
              variants={itemVariants}
              className="flex flex-col items-center justify-center p-3 group"
            >
              {/* Circular Animated Lottie Container */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mb-4 bg-[#FAF8F3] group-hover:bg-[#F3EDE0] transition-colors duration-300 overflow-hidden shadow-xs border border-[#EAE4D9]/80 p-3"
              >
                <DotLottieReact
                  src={tf.lottie}
                  loop
                  autoplay
                  className="w-full h-full object-contain pointer-events-none"
                />
              </motion.div>

              {/* Feature Title */}
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#242120] tracking-tight group-hover:text-[#721B29] transition-colors">
                {tf.title}
              </h3>

              {/* Subtitle / Description */}
              <p className="text-xs sm:text-sm text-[#736B63] mt-1.5 font-light leading-relaxed max-w-xs">
                {tf.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};


