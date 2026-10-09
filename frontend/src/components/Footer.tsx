import React from 'react';
import { Link } from 'react-router-dom';
import { STORE_INFO } from '../data/mockData';
import {
  MapPin,
  Phone,
  Instagram,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';

const footerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const footerColVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1717] text-[#E8E1D5] border-t border-[#332A2B] pt-14 pb-8 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          variants={footerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-[#2E2425]"
        >
          {/* Col 0: Brand Info */}
          <motion.div variants={footerColVariants} className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl font-bold text-[#FDFBF7] tracking-tight">
                    The Western Store
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6C280]" />
                </div>
                <p className="text-xs uppercase tracking-widest text-[#B8860B] font-medium">
                  Kurukshetra • Ethnic & Western Wear
                </p>
              </div>
            </div>
            <p className="text-xs text-[#BFB5A5] leading-relaxed mb-6 max-w-md font-light">
              Crafting accessible, high-finish Indian ethnic outfits and trendsetting silhouettes for women. Handcrafted and dispatched with love from our Kurukshetra boutique across India.
            </p>

            {/* Address Box */}
            <div className="space-y-2.5 text-xs text-[#D1C7B8]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E6C280] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {STORE_INFO.address}, {STORE_INFO.city}, {STORE_INFO.state} - {STORE_INFO.pincode}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E6C280] flex-shrink-0" />
                <span>{STORE_INFO.operatingHours}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E6C280] flex-shrink-0" />
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E6C280] transition-colors"
                >
                  WhatsApp: +91 {STORE_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-[#E6C280] flex-shrink-0" />
                <a
                  href={STORE_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E6C280] transition-colors"
                >
                  {STORE_INFO.instagram}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Col 1: Store & Quick Links */}
          <motion.div variants={footerColVariants}>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#721B29] pl-2.5">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B5ABA0]">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>All Collections</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>Transparent Pricing</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Col 2: Policies */}
          <motion.div variants={footerColVariants}>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#721B29] pl-2.5">
              Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B5ABA0]">
              <li>
                <Link
                  to="/policies/refund-policy"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>Refund & Cancellation Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/shipping-policy"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>Shipping & Delivery Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/terms-and-conditions"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/privacy-policy"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Col 3: Customer Care & Grievance */}
          <motion.div variants={footerColVariants}>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#721B29] pl-2.5">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B5ABA0]">
              <li>
                <Link
                  to="/track-order"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>Track Order Status</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>Contact Us & Grievance Redressal</span>
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Hi%20The%20Western%20Store%2C%20I%20need%20assistance%20with%20sizing%20and%20orders.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium group"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280] group-hover:translate-x-0.5 transition-transform" />
                  <span>Direct WhatsApp Order</span>
                </a>
              </li>
              <li>
                <span className="block text-[#8E8378] pl-4">Pan-India Express Dispatch</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar: Copyright & Payment/Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C8276]"
        >
          <p className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} The Western Store, Kurukshetra. All rights reserved.</span>
          </p>

          {/* Payment & WhatsApp ordering badges */}
          <div className="flex items-center flex-wrap gap-2 text-[11px]">
            {['UPI / QR', 'Cards & NetBanking', 'Razorpay Secure'].map((method, idx) => (
              <motion.span
                key={method}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + idx * 0.06 }}
                className="px-2 py-1 bg-[#282122] rounded-xs border border-[#3D3335] text-[#D1C7B8]"
              >
                {method}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.59 }}
              className="px-2 py-1 bg-[#721B29]/30 rounded-xs border border-[#721B29]/60 text-[#E6C280] font-medium flex items-center gap-1"
            >
              <span>📲 WhatsApp Support</span>
            </motion.span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
