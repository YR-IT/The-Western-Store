import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { ShopByCategory } from './components/ShopByCategory';
import { ProductSection } from './components/ProductSection';
import { ShopByBudget } from './components/ShopByBudget';
import { EditorialLookbook } from './components/EditorialLookbook';
import { TrustStrip } from './components/TrustStrip';
import { Testimonials } from './components/Testimonials';
import { InstagramFeed } from './components/InstagramFeed';
import { Footer } from './components/Footer';

// Modals and Secondary Views
import { ProductListingPage } from './components/ProductListingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { WishlistPage } from './components/WishlistPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { AdminPanel } from './components/AdminPanel';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppCheckoutModal } from './components/WhatsAppCheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SizeChartModal } from './components/SizeChartModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { STORE_INFO } from './data/mockData';
import { MessageCircle } from 'lucide-react';

const StorefrontContent: React.FC = () => {
  const {
    currentView,
    products,
    setSelectedCategory,
    setView,
    homeSections,
    quickViewProduct,
    isSearchOpen,
    isAuthModalOpen,
    isCheckoutModalOpen,
    isSizeChartOpen,
  } = useStore();

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // If in admin view, render admin panel full-width
  if (currentView === 'admin') {
    return (
      <motion.div
        key="admin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <AdminPanel />
      </motion.div>
    );
  }

  // Filter products for homepage sections
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
        return <ShopByCategory key={sec.id} />;
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
            onViewAll={() => {
              setSelectedCategory('All');
              setView('plp');
            }}
          />
        );
      case 'budget-edit':
        return <ShopByBudget key={sec.id} />;
      case 'best-sellers':
        return (
          <ProductSection
            key={sec.id}
            id="best-sellers"
            tagline={sec.tagline || 'Most Loved in Haryana'}
            title={sec.title || 'Best Sellers'}
            subtitle={sec.subtitle || 'Customer favorites repeatedly restocked due to overwhelming demand.'}
            products={bestSellers}
            scrollable={true}
            onViewAll={() => {
              setSelectedCategory('All');
              setView('plp');
            }}
          />
        );
      case 'lookbook':
        return (
          <React.Fragment key={sec.id}>
            <EditorialLookbook />
            <TrustStrip />
          </React.Fragment>
        );
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
                  {sec.subtitle && <p className="text-xs sm:text-sm text-gray-200 font-light max-w-lg mx-auto">{sec.subtitle}</p>}
                  {sec.buttonText && (
                    <button
                      type="button"
                      onClick={() => {
                        if (sec.buttonLink === 'plp') {
                          setSelectedCategory('All');
                          setView('plp');
                        } else {
                          window.open(`https://wa.me/${STORE_INFO.whatsappNumber}`, '_blank');
                        }
                      }}
                      className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95"
                    >
                      <span>{sec.buttonText}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#242120] flex flex-col selection:bg-[#721B29] selection:text-white w-full relative">
      {/* 1. Scrolling Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Header with Category Nav */}
      <Header />

      {/* Main View Router with Smooth Fade-in Transition */}
      <main className={`flex-1 w-full ${currentView !== 'home' ? 'pt-[98px] sm:pt-[114px]' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full"
          >
            {currentView === 'home' && (
              <>{activeSections.map((sec) => renderSection(sec))}</>
            )}

            {currentView === 'plp' && <ProductListingPage />}
            {currentView === 'pdp' && <ProductDetailPage />}
            {currentView === 'cart' && <CartPage />}
            {currentView === 'wishlist' && <WishlistPage />}
            {currentView === 'track-order' && <OrderTrackingPage />}
            {currentView === 'order-history' && <OrderHistoryPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 12. Footer */}
      <Footer />

      {/* Global Modals & Drawers — wrapped in AnimatePresence for exit animations */}
      <CartDrawer />

      <AnimatePresence>
        {isCheckoutModalOpen && <WhatsAppCheckoutModal />}
      </AnimatePresence>

      <AnimatePresence>
        {quickViewProduct && <QuickViewModal />}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && <SearchModal />}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthModalOpen && <AuthModal />}
      </AnimatePresence>

      <AnimatePresence>
        {isSizeChartOpen && <SizeChartModal />}
      </AnimatePresence>

      {/* Floating WhatsApp Quick-Chat button for mobile & desktop */}
      <a
        id="floating-whatsapp-btn"
        href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Hi%20The%20Western%20Store%20Kurukshetra!%20I%20have%20an%20inquiry%20about%20your%20clothing%20collection.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group cursor-pointer"
        aria-label="Chat with store stylist on WhatsApp"
        title="Live Kurukshetra Store Assistance"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold pr-1">
          Chat with Us
        </span>
      </a>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}
