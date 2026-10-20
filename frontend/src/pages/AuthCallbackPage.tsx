import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getAndClearAuthReturnUrl } from '../utils/authNavigation';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * AuthCallbackPage — finishes Google/Supabase OAuth and returns the shopper
 * to the page they started from. Renders nothing while succeeding so there is
 * no intermediate "Signing you in…" screen.
 *
 * Relies on supabase-js `detectSessionInUrl` (default) for PKCE exchange —
 * do NOT call exchangeCodeForSession here or the code can be consumed twice.
 */
export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useStore();
  const [errorMsg, setErrorMsg] = useState('');

  const loginRef = useRef(loginWithGoogle);
  const navigateRef = useRef(navigate);
  loginRef.current = loginWithGoogle;
  navigateRef.current = navigate;

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setErrorMsg('Authentication service is not configured. Please check environment variables.');
      return;
    }

    let done = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let pollId: ReturnType<typeof setInterval>;

    const fail = (msg: string) => {
      if (done) return;
      done = true;
      clearTimeout(timeoutId);
      clearInterval(pollId);
      console.error('[AuthCallback] Failed:', msg);
      setErrorMsg(msg);
    };

    const succeed = (session: {
      user: { id: string; email?: string; user_metadata?: Record<string, unknown> };
    }) => {
      if (done) return;
      done = true;
      clearTimeout(timeoutId);
      clearInterval(pollId);

      const user = session.user;
      const meta = user.user_metadata || {};
      const displayName =
        (meta.full_name as string) ||
        (meta.name as string) ||
        user.email?.split('@')[0] ||
        'Customer';

      // Hydrate user + merge guest cart before leaving this route
      loginRef.current({
        id: user.id,
        name: displayName,
        email: user.email || '',
        avatar: (meta.avatar_url as string) || (meta.picture as string) || undefined,
      });

      const destination = getAndClearAuthReturnUrl();
      // Replace so Back doesn't return to /auth/callback
      navigateRef.current(destination, { replace: true });
    };

    const params = new URLSearchParams(window.location.search);
    const urlError = params.get('error_description') || params.get('error');
    if (urlError) {
      fail(`OAuth provider error: ${urlError}`);
      return;
    }

    // Session is established by supabase-js parsing ?code= (PKCE) or hash tokens.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        succeed(session);
      }
    });

    const tryExistingSession = () => {
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          // Don't fail hard — onAuthStateChange may still deliver the session.
          console.warn('[AuthCallback] getSession:', error.message);
          return;
        }
        if (data?.session?.user) {
          succeed(data.session);
        }
      });
    };

    tryExistingSession();
    // Cover the brief window while detectSessionInUrl finishes exchanging the code
    pollId = setInterval(tryExistingSession, 300);

    timeoutId = setTimeout(() => {
      fail(
        'Sign-in timed out. Please try again, or verify the redirect URL includes /auth/callback in the Supabase dashboard.'
      );
    }, 15000);

    return () => {
      done = true;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
      clearInterval(pollId);
    };
  }, []);

  // Success path: render nothing — shopper should already be navigating away
  if (!errorMsg) {
    return null;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-[#FAF8F3]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-[#EAE4D9] text-center space-y-4">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-[#8C8276]">
          The Western Store • Kurukshetra
        </p>
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
      </div>
    </div>
  );
};
