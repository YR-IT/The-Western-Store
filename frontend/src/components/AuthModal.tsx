import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { X, Lock, ShieldCheck, Sparkles, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithGoogle,
    loginAsAdmin,
    authModalMessage,
    setView,
  } = useStore();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Customer Google info state
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
      } catch (err) {
        console.warn('[Supabase Auth] OAuth redirect failed, falling back to local session:', err);
      }
    }
    
    loginWithGoogle({
      name: customName.trim() || 'Valued Customer',
      email: customEmail.trim() || 'customer@example.com',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customName || 'Customer')}`,
    });
    setIsAuthModalOpen(false);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const success = await loginAsAdmin(adminEmail, adminPassword);
    if (success) {
      setView('admin');
      setIsAuthModalOpen(false);
    } else {
      setAdminError('Invalid admin credentials. Please check your email and password.');
    }
  };

  const handleQuickAdminLogin = () => {
    setAdminEmail('admin@thewesternstore.com');
    setAdminPassword('admin123');
    loginAsAdmin('admin@thewesternstore.com', 'admin123');
    setView('admin');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#FDFBF7] border border-[#E5DFD3] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EAE4D9] flex items-center justify-between bg-[#F8F5EE]">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#721B29] leading-tight">
                {authModalMode === 'customer' ? 'Customer Sign In' : 'Boutique Admin Access'}
              </h3>
              <p className="text-[11px] text-[#736B63] font-medium">
                The Western Store • Kurukshetra
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-[#736B63] hover:text-[#721B29] rounded-full hover:bg-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Custom Message from Action Trigger */}
        {authModalMessage && (
          <div className="bg-[#721B29]/10 border-b border-[#721B29]/20 px-4 py-2.5 flex items-center gap-2 text-xs font-semibold text-[#721B29]">
            <Sparkles className="w-4 h-4 text-[#B8860B] shrink-0" />
            <span>{authModalMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {authModalMode === 'customer' ? (
            /* CUSTOMER GOOGLE LOGIN */
            <div className="space-y-6 py-2">
              <div className="text-center space-y-1.5">
                <h4 className="font-serif text-xl font-bold text-[#242120]">
                  Sign In to The Western Store
                </h4>
                <p className="text-xs text-[#736B63]">
                  Sync your shopping bag, wishlist, and order status across devices.
                </p>
              </div>

              {/* Official Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-gray-800 font-semibold text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all group active:scale-[0.99]"
              >
                {/* Official Google G Icon SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Account</span>
              </button>

              <div className="pt-2 text-center border-t border-[#EAE4D9]">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('admin')}
                  className="text-xs text-[#736B63] hover:text-[#721B29] font-medium hover:underline flex items-center justify-center gap-1.5 mx-auto"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#721B29]" />
                  <span>Boutique Admin Panel</span>
                </button>
              </div>
            </div>
          ) : (
            /* ADMIN EMAIL & PASSWORD LOGIN */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#721B29] bg-[#721B29]/10 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Boutique Staff Login
                </span>
                <h4 className="font-serif text-lg font-bold text-[#242120]">
                  Admin Dashboard Access
                </h4>
                <p className="text-xs text-[#736B63]">
                  Enter your email and password to manage orders, inventory, and boutique settings.
                </p>
              </div>

              {adminError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#4A453E] mb-1">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@thewesternstore.com"
                  className="w-full px-3.5 py-2 text-xs border border-[#E3DCCE] rounded-lg focus:outline-none focus:border-[#721B29] bg-[#FAF8F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-xs border border-[#E3DCCE] rounded-lg focus:outline-none focus:border-[#721B29] bg-[#FAF8F3] pr-9"
                  />
                  <Lock className="w-4 h-4 text-[#A39B8F] absolute right-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#721B29] hover:bg-[#52131D] text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Login to Admin Panel</span>
              </button>

              <div className="pt-2 text-center border-t border-[#EAE4D9]">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('customer')}
                  className="text-xs text-[#736B63] hover:text-[#721B29] font-medium hover:underline"
                >
                  ← Back to Customer Google Sign-In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
