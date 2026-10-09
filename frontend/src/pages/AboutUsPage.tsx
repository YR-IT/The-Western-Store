import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Heart, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { SEOHead } from '../components/common/SEOHead';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 sm:py-16">
      <SEOHead
        title="About Us | Our Story & Craftsmanship"
        description="Discover the story behind The Western Store Kurukshetra — our commitment to tailored elegance, hand-selected fabrics, and celebrating timeless women's fashion."
        canonical="/about"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF5F0] border border-[#721B29]/20 text-[#721B29] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Our Boutique Heritage</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#242120] tracking-tight">
            Crafting Grace for Every Celebration
          </h1>
          <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
            From our flagship boutique in the historic heart of Kurukshetra to wardrobes across India, we bring you meticulously curated drapes, festive suits, and contemporary co-ords.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#EAE4D9] shadow-sm space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#242120]">
            The Journey of The Western Store
          </h2>
          <div className="prose prose-sm text-[#736B63] space-y-4 leading-relaxed font-sans text-xs sm:text-sm">
            <p>
              Founded in Kurukshetra, Haryana, <strong>The Western Store</strong> was born out of a passion for refined fabrics, flattering silhouettes, and accessible luxury. We noticed that modern women sought ensembles that transition effortlessly from intimate family gatherings to grand festivities without compromising on comfort or craft.
            </p>
            <p>
              Every garment in our catalog is thoughtfully selected from artisan looms and experienced design houses across India. We obsess over the tactile details: breathability of pure cottons, luster of Chanderi silks, depth of hand-embroidery, and longevity of every seam.
            </p>
            <p>
              Whether you visit our brick-and-mortar boutique on Railway Road or shop via our digital storefront, our commitment remains identical: transparent pricing, authentic photography, and dedicated personalized support.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EAE4D9] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF5F0] text-[#721B29] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#242120]">
              Handpicked Quality
            </h3>
            <p className="text-xs text-[#736B63] leading-relaxed">
              Every textile undergoes rigorous quality inspection for dye fastness, weave strength, and stitch accuracy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EAE4D9] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF5F0] text-[#721B29] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#242120]">
              Pan-India Express Dispatch
            </h3>
            <p className="text-xs text-[#736B63] leading-relaxed">
              Securely packaged and dispatched via premier logistics partners with end-to-end SMS & WhatsApp tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EAE4D9] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF5F0] text-[#721B29] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#242120]">
              Customer First Support
            </h3>
            <p className="text-xs text-[#736B63] leading-relaxed">
              Direct phone and WhatsApp helpline for size consultations, styling guidance, and swift order assistance.
            </p>
          </div>
        </div>

        {/* Location & Store Visit */}
        <div className="bg-[#241C1D] text-white p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#E6C280] text-xs font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Visit Our Boutique</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              The Western Store Kurukshetra
            </h3>
            <p className="text-xs text-[#D9CEBF] max-w-md">
              {STORE_INFO.address}, {STORE_INFO.city}, {STORE_INFO.state} - {STORE_INFO.pincode}
            </p>
            <p className="text-[11px] text-[#A89F91]">
              Open: {STORE_INFO.operatingHours}
            </p>
          </div>

          <Link
            to="/shop"
            className="px-6 py-3 bg-[#721B29] hover:bg-[#852031] text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-md flex-shrink-0"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
