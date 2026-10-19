import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { HeroCarousel } from '../components/HeroCarousel';
import { ProductSection } from '../components/ProductSection';
import { ShopByBudget } from '../components/ShopByBudget';
import { TrustStrip } from '../components/TrustStrip';
import { Testimonials } from '../components/Testimonials';
import { InstagramFeed } from '../components/InstagramFeed';
import { SEOHead } from '../components/common/SEOHead';

export const HomePage: React.FC = () => {
  const { products, homeSections, categories } = useStore();
  const navigate = useNavigate();

  const newArrivals = products.filter((p) => p.isNew);
  const bestSellers = products.filter((p) => p.isBestSeller);

  // Active home sections sorted by order
  const activeSections = [...homeSections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const renderSection = (sec: any) => {
    switch (sec.type) {
      case 'hero':
        return <HeroCarousel key={sec.id} />;
      case 'categories':
        return categories.length > 0 ? (
          <section key={sec.id} className="py-8 bg-[#FAF8F3] border-b border-[#EAE4D9]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#242120]">
                  {sec.title || 'Curated Boutique Categories'}
                </h2>
                <Link to="/shop" className="text-xs font-semibold text-[#721B29] hover:underline">
                  View All
                </Link>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.slug || c.id}`}
                    className="px-4 py-2 bg-white rounded-full border border-[#D9CEBF] text-xs font-medium text-[#242120] hover:border-[#721B29] hover:text-[#721B29] whitespace-nowrap shadow-xs transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null;
      case 'new-arrivals':
        return (
          <ProductSection
            key={sec.id}
            id="new-arrivals"
            tagline={sec.tagline || 'Fresh Off The Loom'}
            title={sec.title || 'New Arrivals'}
            subtitle={sec.subtitle || 'Latest festive drapes, co-ords, and everyday separates curated for the season.'}
            products={newArrivals}
            scrollable={true}
            onViewAll={() => navigate('/shop')}
          />
        );
      case 'budget-edit':
        return <ShopByBudget key={sec.id} />;
      case 'best-sellers':
        return (
          <ProductSection
            key={sec.id}
            id="best-sellers"
            tagline={sec.tagline || 'Most Loved in Kurukshetra'}
            title={sec.title || 'Best Sellers'}
            subtitle={sec.subtitle || 'Customer favorites repeatedly restocked due to overwhelming demand.'}
            products={bestSellers}
            scrollable={true}
            onViewAll={() => navigate('/shop')}
          />
        );
      case 'lookbook':
      case 'trust':
      case 'trust-strip':
        return <TrustStrip key={sec.id} />;
      case 'testimonials':
        return <Testimonials key={sec.id} />;
      case 'instagram':
        return <InstagramFeed key={sec.id} />;
      case 'custom-banner':
      default:
        return (
          <section key={sec.id} className="py-10 sm:py-14 bg-[#FAF8F3] border-y border-[#EAE4D9]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-2xl overflow-hidden min-h-[280px] sm:min-h-[340px] flex items-center justify-center p-6 sm:p-10 text-center bg-[#241C1D] text-white shadow-xl">
                {sec.images && sec.images[0] && (
                  <img
                    src={sec.images[0]}
                    alt={sec.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-45"
                  />
                )}
                <div className="relative z-10 max-w-2xl space-y-3">
                  {sec.tagline && (
                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#E6C280] bg-[#E6C280]/20 px-3 py-1 rounded-full border border-[#E6C280]/30">
                      {sec.tagline}
                    </span>
                  )}
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">{sec.title}</h2>
                  {sec.subtitle && (
                    <p className="text-xs sm:text-sm text-[#D9CEBF] max-w-lg mx-auto">{sec.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <main>
      <SEOHead
        title="The Western Store | Women's Ethnic Wear Kurukshetra"
        description="Shop handpicked ethnic suits, festive co-ords & designer wear at The Western Store Kurukshetra. Premium fabrics, custom fits & Pan-India delivery."
        keywords="The Western Store Kurukshetra, women boutique Kurukshetra, ethnic suits, festive co-ords, boutique fashion Haryana"
        canonical="/"
      />

      {/* Primary Semantic H1 Heading for SEO & Screen Readers */}
      <h1 className="sr-only">
        The Western Store — Handcrafted Women's Ethnic Wear &amp; Boutique Fashion Kurukshetra
      </h1>

      {activeSections.length > 0 ? (
        activeSections.map(renderSection)
      ) : (
        <>
          <HeroCarousel />
          <ProductSection
            id="new-arrivals"
            tagline="Fresh Off The Loom"
            title="New Arrivals"
            subtitle="Latest festive drapes, co-ords, and everyday separates curated for the season."
            products={newArrivals}
            scrollable={true}
            onViewAll={() => navigate('/shop')}
          />
          <ShopByBudget />
          <ProductSection
            id="best-sellers"
            tagline="Most Loved in Kurukshetra"
            title="Best Sellers"
            subtitle="Customer favorites repeatedly restocked due to overwhelming demand."
            products={bestSellers}
            scrollable={true}
            onViewAll={() => navigate('/shop')}
          />
          <TrustStrip />
          <Testimonials />
          <InstagramFeed />
        </>
      )}
    </main>
  );
};
