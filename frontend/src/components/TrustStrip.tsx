import React from 'react';
import { motion } from 'motion/react';
import { Globe, RefreshCw, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

export const TrustStrip: React.FC = () => {
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
          {/* Column 1: Worldwide Shipping */}
          <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-6 first:pl-0">
            <div className="w-12 h-12 rounded-full bg-[#721B29]/10 text-[#721B29] flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#242120] tracking-tight">
                Worldwide Shipping
              </h3>
              <p className="text-xs text-[#736B63] mt-1 font-light leading-relaxed">
                Prompt dispatch across India and overseas. Express shipping available right from our Kurukshetra boutique.
              </p>
            </div>
          </div>

          {/* Column 2: Quality Assured */}
          <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-6">
            <div className="w-12 h-12 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#242120] tracking-tight">
                Quality Assured
              </h3>
              <p className="text-xs text-[#736B63] mt-1 font-light leading-relaxed">
                3-point quality inspection prior to dispatch. Final sale under our strict No Exchange & No Return Policy.
              </p>
            </div>
          </div>

          {/* Column 3: WhatsApp Support */}
          <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-6 last:pr-0">
            <div className="w-12 h-12 rounded-full bg-emerald-700/10 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#242120] tracking-tight">
                WhatsApp Support
              </h3>
              <p className="text-xs text-[#736B63] mt-1 font-light leading-relaxed">
                Connect directly with store stylists on <a href={`https://wa.me/${STORE_INFO.whatsappNumber}`} className="font-semibold text-emerald-800 underline underline-offset-2">📲 {STORE_INFO.phone}</a> for live trial videos & sizing advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
