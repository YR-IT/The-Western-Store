import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const PricingPage: React.FC = () => {
  const tiers = [
    {
      title: 'Everyday Chic',
      range: 'Under ₹999',
      description: 'Comfortable daily kurtis, cotton tops, and casual separates crafted for breathable routine wear.',
      features: ['100% Pure & Blended Cottons', 'Machine Wash Friendly', 'Pan-India Delivery'],
      tierKey: 'under_999',
    },
    {
      title: 'Boutique Classics',
      range: '₹999 – ₹1,499',
      description: 'Office-ready kurtas, elegant solid co-ords, and festive dupattas with subtle embellishments.',
      features: ['Modal, Muslin & Rayon Blends', 'Refined Silhouette Cuts', 'Standard Pan-India Dispatch'],
      tierKey: '999_1499',
      popular: true,
    },
    {
      title: 'Festive Elegance',
      range: '₹1,499 – ₹2,499',
      description: 'Heavily embroidered suit sets, festive anarkalis, and statement partywear drapes.',
      features: ['Chanderi & Silk Fabrics', 'Zari & Gota Patti Detailing', 'Matching Dupattas Included'],
      tierKey: '1499_2499',
    },
    {
      title: 'Heritage Couture',
      range: 'Above ₹2,499',
      description: 'Exclusive bridal edit, heavy party ensembles, and artisanal luxury festive collections.',
      features: ['Premium Handloom Silks', 'Artisan Hand-Embroidery', 'Complimentary Express Dispatch'],
      tierKey: 'above_2499',
    },
  ];

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 sm:py-16">
      <SEOHead
        title="Pricing & Value | Transparent Boutique Fashion"
        description="Discover our transparent pricing tiers across daily ethnic wear, festive suits, and heritage couture. All prices in INR with zero hidden fees."
        canonical="/pricing"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF5F0] border border-[#721B29]/20 text-[#721B29] text-xs font-semibold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Honest & Transparent Value</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#242120] tracking-tight">
            Curated Collections for Every Budget
          </h1>
          <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
            We believe in honest, direct pricing. Every price listed on our storefront is in Indian Rupees (₹) with all applicable taxes clearly factored in — no surprises at checkout.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((t) => (
            <div
              key={t.title}
              className={`relative bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                t.popular
                  ? 'border-[#721B29] shadow-md ring-1 ring-[#721B29]/20'
                  : 'border-[#EAE4D9] shadow-xs hover:border-[#721B29]/40'
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#721B29] text-[#E6C280] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#242120]">
                    {t.title}
                  </h3>
                  <p className="font-sans text-xl sm:text-2xl font-bold text-[#721B29] mt-1">
                    {t.range}
                  </p>
                </div>

                <p className="text-xs text-[#736B63] leading-relaxed">
                  {t.description}
                </p>

                <div className="pt-2 border-t border-[#F4EFE6] space-y-2">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-[#242120]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={`/shop?budgetTier=${t.tierKey}`}
                  className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    t.popular
                      ? 'bg-[#721B29] text-white hover:bg-[#852031]'
                      : 'bg-[#FAF8F3] border border-[#D9CEBF] text-[#242120] hover:bg-[#F4EFE6]'
                  }`}
                >
                  <span>Shop Tier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Guarantee Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE4D9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FDF5F0] text-[#721B29] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#242120]">
                Price Transparency Guarantee
              </h4>
              <p className="text-xs text-[#736B63] leading-relaxed mt-0.5">
                All prices shown across our catalog are final retail prices. Zero platform fees, zero payment processing markups.
              </p>
            </div>
          </div>

          <Link
            to="/shop"
            className="px-5 py-2.5 bg-[#721B29] text-white text-xs font-semibold rounded-lg hover:bg-[#852031] transition-colors flex-shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E6C280]" />
            <span>Browse Full Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
