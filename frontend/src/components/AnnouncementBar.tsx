import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import { sanitizeAnnouncement } from '../utils/sanitizeAnnouncement';
import { Phone, Globe, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { announcementText } = useStore();
  const safeAnnouncement = useMemo(() => sanitizeAnnouncement(announcementText), [announcementText]);

  const segments = (
    <>
      <span className="flex items-center gap-2">
        <Globe className="w-3.5 h-3.5 text-[#E6C280]" />
        <span>Free Pan-India Shipping on All Prepaid Orders</span>
      </span>
      <span className="text-[#C5A059]">•</span>
      <a
        href={`tel:+91${STORE_INFO.phone}`}
        className="flex items-center gap-1.5 hover:text-[#E6C280] transition-colors"
      >
        <Phone className="w-3.5 h-3.5 text-[#E6C280]" />
        <span>Support: {STORE_INFO.phoneFormatted}</span>
      </a>
      <span className="text-[#C5A059]">•</span>
      <Link
        to="/shop"
        className="flex items-center gap-1.5 hover:text-[#E6C280] transition-colors"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#E6C280]" />
        <span>Shop &amp; Checkout Securely Online</span>
      </Link>
      <span className="text-[#C5A059]">•</span>
      <Link to="/refund-policy" className="hover:text-[#E6C280] transition-colors">
        Easy Refund / Replacement on Damaged or Wrong Items
      </Link>
      <span className="text-[#C5A059]">•</span>
      {safeAnnouncement ? (
        <>
          <span className="text-[#FDFBF7]/90">{safeAnnouncement}</span>
          <span className="text-[#C5A059]">•</span>
        </>
      ) : null}
    </>
  );

  return (
    <aside
      aria-label="Store Announcement"
      className="group fixed top-0 left-0 right-0 z-50 bg-[#721B29] text-[#FDFBF7] h-[34px] text-xs font-medium tracking-wide overflow-hidden border-b border-[#5e1622] select-none w-full flex items-center"
    >
      <div className="w-full overflow-hidden whitespace-nowrap flex items-center">
        <div className="animate-marquee flex items-center gap-8 shrink-0 pr-8">{segments}</div>
        <div className="animate-marquee flex items-center gap-8 shrink-0 pr-8" aria-hidden="true">
          {segments}
        </div>
        <div className="animate-marquee flex items-center gap-8 shrink-0 pr-8" aria-hidden="true">
          {segments}
        </div>
      </div>
    </aside>
  );
};
