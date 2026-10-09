import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Mail, Lock, User, Loader2, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const SignupPage: React.FC = () => {
  const { loginWithGoogle, currentUser } = useStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (currentUser) {
    navigate('/account/orders', { replace: true });
    return null;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Authentication service is currently offline. Please try again shortly.');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim() || 'Store Customer',
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setSuccessMessage('Account registered successfully! Logging you in...');
        loginWithGoogle({
          id: data.user.id,
          name: fullName.trim() || email.split('@')[0],
          email: email.trim(),
        });
        setTimeout(() => {
          navigate('/account/orders', { replace: true });
        }, 1200);
      }
    } catch (err: any) {
      console.error('[Signup Error]', err);
      setErrorMessage(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF8F3]">
      <SEOHead
        title="Create Account"
        description="Register for an account with The Western Store Kurukshetra for faster checkout, order tracking, and exclusive previews."
        canonical="/signup"
      />

      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[#EAE4D9] space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#FDF5F0] text-[#721B29] rounded-xl flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#242120]">
            Create an Account
          </h1>
          <p className="text-xs text-[#736B63]">
            Join The Western Store community for exclusive collections and rapid order tracking
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#8C8276] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C8276] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ritu Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded-lg text-xs text-[#242120] placeholder-[#A89F91] focus:outline-none focus:border-[#721B29] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#8C8276] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C8276] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded-lg text-xs text-[#242120] placeholder-[#A89F91] focus:outline-none focus:border-[#721B29] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#8C8276] mb-1.5">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C8276] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded-lg text-xs text-[#242120] placeholder-[#A89F91] focus:outline-none focus:border-[#721B29] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#721B29] hover:bg-[#852031] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#EAE4D9]">
          <p className="text-xs text-[#736B63]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#721B29] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
