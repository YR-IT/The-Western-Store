import React from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import { ProductCategory } from '../types';
import {
  MapPin,
  Phone,
  Instagram,
  Clock,
  Mail,
  ShieldCheck,
  CreditCard,
  Heart,
  ChevronRight,
} from 'lucide-react';

const CATEGORIES: ProductCategory[] = [
  'Ethnic Wear',
  'Western Wear',
];

export const Footer: React.FC = () => {
  const { navigateToCategory, setView, setAdminActiveTab } = useStore();

  return (
    <footer className="bg-[#1C1717] text-[#E8E1D5] border-t border-[#332A2B] pt-14 pb-8 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2E2425]">
          {/* Col 1 & 2: Brand & Kurukshetra Physical Boutique */}
          <div className="lg:col-span-2">
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
              Crafting accessible, high-finish Indian ethnic outfits and trendsetting western silhouettes for girls and women. Proudly rooted in Haryana, shipping worldwide.
            </p>

            {/* Address Box */}
            <div className="space-y-2.5 text-xs text-[#D1C7B8]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E6C280] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {STORE_INFO.address}
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
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#721B29] pl-2.5">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => navigateToCategory(cat)}
                    className="text-[#B5ABA0] hover:text-[#E6C280] transition-colors text-left flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-[#721B29]" />
                    <span>{cat}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: More Categories */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#721B29] pl-2.5">
              Western & Sets
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => navigateToCategory(cat)}
                    className="text-[#B5ABA0] hover:text-[#E6C280] transition-colors text-left flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-[#721B29]" />
                    <span>{cat}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setView('wishlist')}
                  className="text-[#B5ABA0] hover:text-[#E6C280] transition-colors text-left flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#721B29]" />
                  <span>My Wishlist</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Quick Links & Store Policies */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#721B29] pl-2.5">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#B5ABA0]">
              <li>
                <button
                  type="button"
                  onClick={() => setView('track-order')}
                  className="hover:text-[#E6C280] transition-colors text-left flex items-center gap-1.5 text-white font-medium"
                >
                  <ChevronRight className="w-3 h-3 text-[#E6C280]" />
                  <span>Track Order Status</span>
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Hi%20The%20Western%20Store%2C%20I%20need%20assistance%20with%20sizing%20and%20orders.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E6C280] transition-colors block"
                >
                  Direct WhatsApp Order
                </a>
              </li>
              <li>
                <span className="block text-[#8E8378]">No Exchange & No Return Policy</span>
              </li>
              <li>
                <span className="block text-[#8E8378]">Pan-India & Global Courier</span>
              </li>
              <li>
                <span className="block text-[#8E8378]">Authentic Hand-Drape Sarees</span>
              </li>
              <li className="pt-2">
                {/* Internal Admin link */}
                <button
                  type="button"
                  onClick={() => {
                    setView('admin');
                    setAdminActiveTab('dashboard');
                  }}
                  className="text-[11px] text-[#E6C280] hover:underline flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E6C280]" />
                  <span>Store Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment/Trust Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C8276]">
          <p className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} The Western Store, Kurukshetra. All rights reserved.</span>
          </p>

          {/* Payment & WhatsApp ordering badges */}
          <div className="flex items-center flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-1 bg-[#282122] rounded-xs border border-[#3D3335] text-[#D1C7B8]">
              UPI / QR
            </span>
            <span className="px-2 py-1 bg-[#282122] rounded-xs border border-[#3D3335] text-[#D1C7B8]">
              Google Pay
            </span>
            <span className="px-2 py-1 bg-[#282122] rounded-xs border border-[#3D3335] text-[#D1C7B8]">
              PhonePe
            </span>
            <span className="px-2 py-1 bg-[#282122] rounded-xs border border-[#3D3335] text-[#D1C7B8]">
              Paytm
            </span>
            <span className="px-2 py-1 bg-[#721B29]/30 rounded-xs border border-[#721B29]/60 text-[#E6C280] font-medium flex items-center gap-1">
              <span>📲 WhatsApp Checkout</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
