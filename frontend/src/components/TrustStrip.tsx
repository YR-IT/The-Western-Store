import React from 'react';
import { motion } from 'motion/react';
import { Globe, RefreshCw, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

import { useStore } from '../context/StoreContext';

export const TrustStrip: React.FC = () => {
  const { trustFeatures } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'shield':
        return <ShieldCheck className="w-6 h-6" />;
      case 'whatsapp':
        return <MessageSquare className="w-6 h-6" />;
      case 'globe':
      default:
        return <Globe className="w-6 h-6" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'shield':
        return 'bg-[#B8860B]/10 text-[#B8860B]';
      case 'whatsapp':
        return 'bg-emerald-700/10 text-emerald-800';
      case 'globe':
      default:
        return 'bg-[#721B29]/10 text-[#721B29]';
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="py-10 bg-[#FAF8F3] border-b border-[#EAE4D9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E5DDCF]">
          {trustFeatures.map((tf, idx) => (
            <div
              key={tf.id}
              className={`flex items-start gap-4 pt-4 md:pt-0 md:px-6 ${
                idx === 0 ? 'first:pl-0' : idx === trustFeatures.length - 1 ? 'last:pr-0' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getBgClass(tf.iconType)}`}>
                {getIcon(tf.iconType)}
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#242120] tracking-tight">
                  {tf.title}
                </h3>
                <p className="text-xs text-[#736B63] mt-1 font-light leading-relaxed">
                  {tf.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
