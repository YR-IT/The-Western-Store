/**
 * Cashfree Payments Web SDK v3 Loader & Types
 * Dynamically loads https://sdk.cashfree.com/js/v3/cashfree.js on demand
 */

export interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: '_modal' | '_self' | '_top' | '_blank';
  returnUrl?: string;
}

export interface CashfreeCheckoutResult {
  error?: {
    message?: string;
    code?: string;
    type?: string;
  };
  redirect?: boolean;
  paymentDetails?: {
    paymentMessage?: string;
  };
}

export interface CashfreeInstance {
  checkout: (options: CashfreeCheckoutOptions) => Promise<CashfreeCheckoutResult>;
}

declare global {
  interface Window {
    Cashfree?: (config: { mode: 'sandbox' | 'production' }) => CashfreeInstance;
  }
}

let cashfreeScriptLoadingPromise: Promise<boolean> | null = null;
let cachedCashfreeInstance: CashfreeInstance | null = null;

export const loadCashfreeScript = (): Promise<boolean> => {
  if (typeof window === 'undefined') return Promise.resolve(false);

  if (window.Cashfree) {
    return Promise.resolve(true);
  }

  if (cashfreeScriptLoadingPromise) {
    return cashfreeScriptLoadingPromise;
  }

  cashfreeScriptLoadingPromise = new Promise((resolve) => {
    const existingScript = document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('❌ Failed to load Cashfree Web SDK script.');
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return cashfreeScriptLoadingPromise;
};

export const getCashfreeInstance = async (
  mode?: 'sandbox' | 'production'
): Promise<CashfreeInstance | null> => {
  const loaded = await loadCashfreeScript();
  if (!loaded || !window.Cashfree) {
    return null;
  }
  const configuredMode = import.meta.env.VITE_CASHFREE_MODE?.toLowerCase();
  const resolvedMode: 'sandbox' | 'production' =
    mode ||
    (configuredMode === 'production'
      ? 'production'
      : configuredMode === 'sandbox'
      ? 'sandbox'
      : import.meta.env.PROD
      ? 'production'
      : 'sandbox');

  if (!cachedCashfreeInstance) {
    cachedCashfreeInstance = window.Cashfree({ mode: resolvedMode });
  }
  return cachedCashfreeInstance;
};
