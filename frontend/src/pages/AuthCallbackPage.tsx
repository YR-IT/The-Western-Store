import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getAndClearAuthReturnUrl } from '../utils/authNavigation';
import { Loader2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * AuthCallbackPage — PKCE + Implicit flow handler
 *
 * Handles OAuth callback from Supabase/Google and directly redirects the user
 * back to where their sign-in originated (product page, cart, checkout, etc.)
 * with zero awkward lag or intermediate redirects.
 */
export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useStore();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setStatus('error');
      setErrorMsg('Authentication service is not configured. Please check environment variables.');
      return;
    }

    let done = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const succeed = (session: { user: { id: string; email?: string; user_metadata?: any } }) => {
      if (done) return;
      done = true;
      clearTimeout(timeoutId);

      const user = session.user;
      const meta = user.user_metadata || {};
      const displayName =
        meta.full_name || meta.name || user.email?.split('@')[0] || 'Customer';

      loginWithGoogle({
        id: user.id,
        name: displayName,
        email: user.email || '',
        avatar: meta.avatar_url || meta.picture || undefined,
      });

      // Retrieve where the customer initiated sign in (cart, product, checkout, etc.)
      const destination = getAndClearAuthReturnUrl();
      console.log('[AuthCallback] Successfully authenticated. Direct redirect to:', destination);

      // Instantly land back on original location, replacing callback page from history
      navigate(destination, { replace: true });
    };

    const fail = (msg: string) => {
      if (done) return;
      done = true;
      clearTimeout(timeoutId);
      console.error('[AuthCallback] Failed:', msg);
      setStatus('error');
      setErrorMsg(msg);
    };

    // ── 1. Subscribe to auth state change (catches PKCE token exchange) ──
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        succeed(session);
      }
    });

    // ── 2. Handle PKCE authorization code if present ─────────────────────
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const urlError = params.get('error_description') || params.get('error');

    if (urlError) {
      fail(`OAuth provider error: ${urlError}`);
    } else if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (error) {
            fail(`Verification failed: ${error.message}`);
          } else if (data?.session?.user) {
            succeed(data.session);
          }
        })
        .catch((err) => fail(err.message || 'Failed to exchange verification code.'));
    } else {
      // ── 3. Check existing active session (implicit or already resolved) ─
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          fail(error.message);
        } else if (data?.session?.user) {
          succeed(data.session);
        }
      });
    }

    // ── 4. Safety net timeout ─────────────────────────────────────────────
    timeoutId = setTimeout(() => {
      fail(
        'Sign-in timed out. Please check your internet connection or verify redirect URLs in Supabase dashboard.'
      );
    }, 12000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [loginWithGoogle, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-[#FAF8F3]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-[#EAE4D9] text-center space-y-4">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-[#8C8276]">
          The Western Store • Kurukshetra
        </p>

        {status === 'loading' && (
          <div className="py-6 space-y-4">
            <div className="w-12 h-12 bg-[#FDF5F0] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Loader2 className="w-6 h-6 text-[#721B29] animate-spin" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#242120]">Signing you in…</h2>
              <p className="text-xs text-[#736B63] mt-1">Taking you right back to your shopping</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="py-2 space-y-4">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#242120]">Sign-In Unsuccessful</h2>
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 text-left mt-3">
                {errorMsg}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="px-4 py-2 bg-[#721B29] hover:bg-[#852031] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/', { replace: true })}
                className="px-4 py-2 bg-[#FAF8F3] hover:bg-[#F2ECE1] border border-[#D9CEBF] text-[#242120] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Store</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
