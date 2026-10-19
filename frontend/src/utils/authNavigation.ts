/**
 * authNavigation.ts
 *
 * Helpers for preserving and restoring the user's origin page across
 * authentication flows (Google OAuth, email sign-in, account creation).
 */

const STORAGE_KEY = 'tws_auth_return_url';
const LAST_PAGE_KEY = 'tws_last_public_page';

const AUTH_PATHS = ['/login', '/signup', '/auth/callback', '/admin/login'];

/**
 * Checks if a path is an authentication or callback route
 */
export function isAuthPath(path?: string | null): boolean {
  if (!path) return false;
  const normalized = path.split('?')[0].split('#')[0].trim().toLowerCase();
  return AUTH_PATHS.some((authPath) => normalized === authPath || normalized.startsWith(`${authPath}/`));
}

/**
 * Validates that a URL is a safe, relative path on the same app.
 * Prevents open redirects (no `//`, `http://`, `https://`, `javascript:`, etc.)
 * and ignores auth routes.
 */
export function sanitizeRedirectPath(raw?: string | null): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();

  // Must be a relative path starting with '/'
  if (!trimmed.startsWith('/')) return null;

  // Disallow protocol-relative (`//`) or backslash tricks (`/\`)
  if (trimmed.startsWith('//') || trimmed.startsWith('/\\')) return null;

  // Disallow any embedded scheme
  if (trimmed.includes('://')) return null;

  // Disallow redirecting back to login/signup/auth-callback
  if (isAuthPath(trimmed)) return null;

  return trimmed;
}

/**
 * Extracts and sanitizes a return target from search params, router state, or last page.
 */
export function resolveReturnUrl(
  searchParamRedirect?: string | null,
  routerStateFrom?: any
): string {
  // 1. Explicit ?redirect= query param
  const fromParam = sanitizeRedirectPath(searchParamRedirect);
  if (fromParam) return fromParam;

  // 2. React Router location state from PrivateRoute (<Navigate state={{ from: location }} />)
  if (routerStateFrom) {
    if (typeof routerStateFrom === 'string') {
      const sanitized = sanitizeRedirectPath(routerStateFrom);
      if (sanitized) return sanitized;
    } else if (typeof routerStateFrom === 'object' && routerStateFrom.pathname) {
      const full = `${routerStateFrom.pathname}${routerStateFrom.search || ''}${routerStateFrom.hash || ''}`;
      const sanitized = sanitizeRedirectPath(full);
      if (sanitized) return sanitized;
    }
  }

  // 3. Last visited public page before entering auth
  const lastPage = getLastPublicPage();
  if (lastPage && lastPage !== '/') return lastPage;

  // 4. Default to store home
  return '/';
}

/**
 * Persists the destination URL before starting an OAuth or login redirect.
 * Uses both sessionStorage and localStorage for resilience across OAuth redirects.
 */
export function saveAuthReturnUrl(targetUrl?: string | null): void {
  let target = sanitizeRedirectPath(targetUrl);

  if (!target) {
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (!isAuthPath(window.location.pathname)) {
      target = sanitizeRedirectPath(currentPath);
    }
  }

  if (!target) {
    target = getLastPublicPage();
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, target);
    localStorage.setItem(STORAGE_KEY, target);
  } catch (err) {
    console.warn('[authNavigation] Failed to write storage:', err);
  }
}

/**
 * Retrieves the saved return destination and clears storage.
 * Falls back to last public page or home ('/').
 */
export function getAndClearAuthReturnUrl(): string {
  let saved: string | null = null;

  try {
    saved = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[authNavigation] Failed to read storage:', err);
  }

  const sanitized = sanitizeRedirectPath(saved);
  if (sanitized) return sanitized;

  const lastPage = getLastPublicPage();
  if (lastPage) return lastPage;

  return '/';
}

/**
 * Track the last non-auth page browsed by the customer.
 */
export function setLastPublicPage(fullPath: string): void {
  const sanitized = sanitizeRedirectPath(fullPath);
  if (!sanitized) return;

  try {
    sessionStorage.setItem(LAST_PAGE_KEY, sanitized);
  } catch {
    // Ignore storage quota or access issues
  }
}

/**
 * Get the last public page browsed.
 */
export function getLastPublicPage(): string {
  try {
    const saved = sessionStorage.getItem(LAST_PAGE_KEY);
    const sanitized = sanitizeRedirectPath(saved);
    if (sanitized) return sanitized;
  } catch {
    // fallback
  }
  return '/';
}
