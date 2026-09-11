import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { X, Lock, ShieldCheck, Sparkles, CheckCircle2, UserCheck, AlertCircle, Mail, User, KeyRound, Loader2 } from 'lucide-react';

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

  const [customerTab, setCustomerTab] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Customer Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  if (!isAuthModalOpen) return null;

  // Supabase Email & Password Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || 'Valued Customer',
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setSuccessMessage('Account created successfully! Check your email if confirmation is required.');
          loginWithGoogle({
            id: data.user.id,
            name: fullName.trim() || 'Valued Customer',
            email: email.trim(),
          });
          setTimeout(() => setIsAuthModalOpen(false), 1500);
          return;
        }
      }

      // Local Fallback if Supabase credentials not set
      loginWithGoogle({
        name: fullName.trim() || 'Valued Customer',
        email: email.trim(),
      });
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Supabase Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.user) {
          const userMeta = data.user.user_metadata || {};
          loginWithGoogle({
            id: data.user.id,
            name: userMeta.full_name || userMeta.name || email.split('@')[0],
            email: data.user.email || email.trim(),
          });
          setIsAuthModalOpen(false);
          return;
        }
      }

      // Local Fallback
      loginWithGoogle({
        name: email.split('@')[0] || 'Valued Customer',
        email: email.trim(),
      });
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Supabase Google OAuth
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
      } catch (err: any) {
        console.warn('[Supabase Auth] OAuth redirect notice:', err.message);
      }
    }

    loginWithGoogle({
      name: 'Valued Customer',
      email: 'customer@example.com',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Customer`,
    });
    setIsAuthModalOpen(false);
  };

  // Admin Server Login
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const success = await loginAsAdmin(adminEmail, adminPassword);
      if (success) {
        setView('admin');
        setIsAuthModalOpen(false);
      } else {
        setErrorMessage('Invalid admin credentials. Please verify server environment keys.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#FDFBF7] border border-[#E5DFD3] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EAE4D9] flex items-center justify-between bg-[#F8F5EE]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#721B29] leading-tight">
              {authModalMode === 'customer'
                ? customerTab === 'signin'
                  ? 'Customer Sign In'
                  : 'Create Customer Account'
                : 'Boutique Admin Access'}
            </h3>
            <p className="text-[11px] text-[#736B63] font-medium">
              The Western Store • Kurukshetra
            </p>
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

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-5 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {authModalMode === 'customer' ? (
            <div className="space-y-5">
              {/* Customer Sign In / Sign Up Sub-tabs */}
              <div className="grid grid-cols-2 p-1 bg-[#FAF8F3] border border-[#EAE4D9] rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerTab('signin');
                    setErrorMessage('');
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    customerTab === 'signin'
                      ? 'bg-white text-[#721B29] shadow-xs font-bold'
                      : 'text-[#736B63] hover:text-[#242120]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerTab('signup');
                    setErrorMessage('');
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    customerTab === 'signup'
                      ? 'bg-white text-[#721B29] shadow-xs font-bold'
                      : 'text-[#736B63] hover:text-[#242120]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Email Form */}
              <form onSubmit={customerTab === 'signin' ? handleEmailSignIn : handleEmailSignUp} className="space-y-3.5">
                {customerTab === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-[#4A453E] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Priya Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-[#E3DCCE] rounded-lg focus:outline-none focus:border-[#721B29] bg-[#FAF8F3] pl-9"
                      />
                      <User className="w-4 h-4 text-[#A39B8F] absolute left-3 top-2.5" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-[#E3DCCE] rounded-lg focus:outline-none focus:border-[#721B29] bg-[#FAF8F3] pl-9"
                    />
                    <Mail className="w-4 h-4 text-[#A39B8F] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-[#E3DCCE] rounded-lg focus:outline-none focus:border-[#721B29] bg-[#FAF8F3] pl-9"
                    />
                    <Lock className="w-4 h-4 text-[#A39B8F] absolute left-3 top-2.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#721B29] hover:bg-[#52131D] text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : customerTab === 'signin' ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Sign In with Email</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Register Account</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#EAE4D9]"></div>
                <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-[#8C8276]">Or continue with</span>
                <div className="flex-grow border-t border-[#EAE4D9]"></div>
              </div>

              {/* Official Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-gray-800 font-semibold text-xs flex items-center justify-center gap-3 shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span>Google OAuth Login</span>
              </button>

              <div className="pt-2 text-center border-t border-[#EAE4D9]">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('admin')}
                  className="text-xs text-[#736B63] hover:text-[#721B29] font-medium hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
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
                  Enter your administrative credentials to manage store orders and catalog.
                </p>
              </div>

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
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#721B29] hover:bg-[#52131D] text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Login to Admin Panel</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center border-t border-[#EAE4D9]">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('customer')}
                  className="text-xs text-[#736B63] hover:text-[#721B29] font-medium hover:underline cursor-pointer"
                >
                  ← Back to Customer Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
