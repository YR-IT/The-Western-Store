import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { saveAuthReturnUrl } from '../../utils/authNavigation';

interface GoogleSignInButtonProps {
  /** Label shown on button. Defaults to "Continue with Google" */
  label?: string;
  /** Explicit return destination after login completes (defaults to current page or last browsed) */
  returnUrl?: string;
  /** Called when an error occurs during the OAuth redirect initiation */
  onError?: (msg: string) => void;
  /** Extra CSS classes */
  className?: string;
}

/**
 * Initiates the Supabase Google OAuth flow.
 * On success, the user is redirected to /auth/callback where the session is
 * finalised and the app state is hydrated, then returned smoothly to their prior page.
 */
export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  label = 'Continue with Google',
  returnUrl,
  onError,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading) return;

    try {
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Authentication service is not configured.');
      }

      setLoading(true);

      // Persist origin page (cart, product, checkout, etc.) before leaving for Google
      saveAuthReturnUrl(
        returnUrl ||
          `${window.location.pathname}${window.location.search}${window.location.hash}`
      );

      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: false,
          queryParams: {
            // Ask Google to always show the account picker
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;
      // Browser is now navigating away to Google — no further action needed.
    } catch (err: any) {
      console.error('[Google OAuth Error]', err);
      setLoading(false);
      onError?.(err.message || 'Failed to start Google sign-in. Please try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border border-[#D9CEBF] hover:border-[#721B29] rounded-lg text-xs font-semibold text-[#242120] shadow-xs transition-all hover:shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#721B29]" />
      ) : (
        /* Official Google "G" SVG icon */
        <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      <span>{loading ? 'Redirecting to Google…' : label}</span>
    </button>
  );
};
