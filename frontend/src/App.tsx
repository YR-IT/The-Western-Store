import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/routing/ScrollToTop';
import { AdminRoute } from './components/routing/AdminRoute';
import { PrivateRoute } from './components/routing/PrivateRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './components/ProductListingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { WishlistPage } from './components/WishlistPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { ContactPage } from './components/ContactPage';
import { PolicyPage } from './components/PolicyPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { PricingPage } from './pages/PricingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AccountPage } from './pages/AccountPage';
import { FAQPage } from './pages/FAQPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Lazy Loaded Admin Panel
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));

// Global Overlays & Modals
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SizeChartModal } from './components/SizeChartModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { STORE_INFO } from './data/mockData';
import { MessageCircle } from 'lucide-react';
import { setLastPublicPage } from './utils/authNavigation';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRouterNavigate } = useStore();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Track the most recent non-auth store page for seamless return upon login
  useEffect(() => {
    setLastPublicPage(`${location.pathname}${location.search}${location.hash}`);
  }, [location]);

  // Inject the router navigate function into StoreContext once on mount
  useEffect(() => {
    setRouterNavigate(navigate);
  }, [navigate, setRouterNavigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#242120] font-sans antialiased selection:bg-[#721B29] selection:text-white">
      <ScrollToTop />

      {/* Public Header & Announcement Bar */}
      {!isAdminRoute && (
        <>
          <AnnouncementBar />
          <Header />
        </>
      )}

      {/* Main Content & Page Routing */}
      <main className={`flex-1 w-full ${!isAdminRoute ? 'pt-[98px] sm:pt-[114px]' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductListingPage />} />
          <Route path="/collections" element={<ProductListingPage />} />
          <Route path="/category/:slug" element={<ProductListingPage />} />
          <Route path="/collection/:slug" element={<ProductListingPage />} />
          <Route path="/collections/:slug" element={<ProductListingPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route
            path="/account/orders"
            element={
              <PrivateRoute>
                <AccountPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <AccountPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#1A1617] text-[#E6C280] text-sm font-semibold">
                      Loading staff administrative console...
                    </div>
                  }
                >
                  <AdminPanel />
                </Suspense>
              </AdminRoute>
            }
          />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/size-guide" element={<SizeGuidePage />} />
          {/* Razorpay / compliance: dedicated top-level policy & contact URLs */}
          <Route path="/refund-policy" element={<PolicyPage initialTab="returns" />} />
          <Route path="/shipping-policy" element={<PolicyPage initialTab="shipping" />} />
          <Route path="/terms-and-conditions" element={<PolicyPage initialTab="terms" />} />
          <Route path="/privacy-policy" element={<PolicyPage initialTab="privacy" />} />
          <Route path="/contact-us" element={<ContactPage />} />
          {/* Legacy aliases → canonical paths */}
          <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
          <Route path="/policies/refund-policy" element={<Navigate to="/refund-policy" replace />} />
          <Route path="/policies/shipping-policy" element={<Navigate to="/shipping-policy" replace />} />
          <Route path="/policies/terms-and-conditions" element={<Navigate to="/terms-and-conditions" replace />} />
          <Route path="/policies/terms" element={<Navigate to="/terms-and-conditions" replace />} />
          <Route path="/policies/privacy-policy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/policies/:policyType" element={<PolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Public Footer & WhatsApp Help Float */}
      {!isAdminRoute && (
        <>
          <Footer />
          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
              'Hi The Western Store team! I am browsing your online boutique and would love assistance with styles & sizing.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct WhatsApp Concierge"
            className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 group border border-white/20"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span className="text-xs font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
              WhatsApp Help
            </span>
          </a>
        </>
      )}

      {/* Global Interactive Modals */}
      <CartDrawer />
      <QuickViewModal />
      <SizeChartModal />
      <SearchModal />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppLayout />
    </StoreProvider>
  );
}

export default App;
