import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../../data/mockData';
import { SEOHead } from '../common/SEOHead';

interface PolicyLayoutProps {
  title: string;
  description: string;
  canonical: string;
  eyebrow?: string;
  children: React.ReactNode;
}

export const PolicyLayout: React.FC<PolicyLayoutProps> = ({
  title,
  description,
  canonical,
  eyebrow = 'Customer Policy',
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-16">
      <SEOHead title={title} description={description} canonical={canonical} />

      <div className="relative bg-gradient-to-b from-[#F6F0E6] via-[#EFE5D5] to-[#FDFBF7] border-b border-[#E3D6C5] overflow-hidden pt-12 sm:pt-16 pb-10 sm:pb-12">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(230,194,128,0.4) 0%, transparent 65%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#721B29] bg-[#721B29]/10 px-4 py-1.5 rounded-full border border-[#721B29]/20 mb-3.5 shadow-xs"
          >
            <span>The Western Store</span>
            <span className="w-1 h-1 rounded-full bg-[#721B29]" />
            <span>{eyebrow}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-[#241C1D] tracking-tight mb-3"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="text-xs sm:text-sm text-[#6B5E50] max-w-2xl mx-auto font-light leading-relaxed"
          >
            {description}
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {children}

        <div className="mt-10 rounded-2xl border border-[#EAE4D9] bg-white p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[#721B29]/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-[#721B29]" />
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-[#242120]">Have questions about this policy?</p>
              <p className="text-xs text-[#736B63] font-light">
                {STORE_INFO.name}, Kurukshetra · {STORE_INFO.operatingHours}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              to="/contact-us"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-[#D9CEBF] text-[#242120] hover:bg-[#FAF8F3] text-xs font-semibold rounded-xl transition text-center"
            >
              Contact Us
            </Link>
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
                `Hi ${STORE_INFO.name}, I have a question about your store policies.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
