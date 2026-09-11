import React from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import { Instagram, Phone, Globe } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { announcementText } = useStore();

  return (
    <aside
      aria-label="Store Announcement"
      className="group bg-[#721B29] text-[#FDFBF7] py-2 px-3 text-xs font-medium tracking-wide overflow-hidden border-b border-[#5e1622] relative z-40 select-none cursor-pointer"
    >
      <div className="w-full overflow-hidden whitespace-nowrap flex items-center">
        {/* Primary Marquee Track */}
        <div className="animate-marquee flex items-center gap-8 shrink-0 pr-8">
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#E6C280]" />
            <span>Worldwide Shipping</span>
          </span>
          <span className="text-[#C5A059]">•</span>
          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#E6C280] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#E6C280]" />
            <span>📲 {STORE_INFO.phone}</span>
          </a>
          <span className="text-[#C5A059]">•</span>
          <a
            href={STORE_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#E6C280] transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-[#E6C280]" />
            <span>DM us on Instagram @the_western_store_kkr to Order</span>
          </a>
          <span className="text-[#C5A059]">•</span>
          <span className="text-[#FDFBF7]/90">{announcementText}</span>
          <span className="text-[#C5A059]">•</span>
        </div>

        {/* Duplicated Marquee Track for Seamless Infinite Loop */}
        <div className="animate-marquee flex items-center gap-8 shrink-0 pr-8" aria-hidden="true">
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#E6C280]" />
            <span>Worldwide Shipping</span>
          </span>
          <span className="text-[#C5A059]">•</span>
          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#E6C280] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#E6C280]" />
            <span>📲 {STORE_INFO.phone}</span>
          </a>
          <span className="text-[#C5A059]">•</span>
          <a
            href={STORE_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#E6C280] transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-[#E6C280]" />
            <span>DM us on Instagram @the_western_store_kkr to Order</span>
          </a>
          <span className="text-[#C5A059]">•</span>
          <span className="text-[#FDFBF7]/90">{announcementText}</span>
          <span className="text-[#C5A059]">•</span>
        </div>
      </div>
    </aside>
  );
};
