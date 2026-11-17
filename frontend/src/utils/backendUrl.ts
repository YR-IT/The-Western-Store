/**
 * Resolves the canonical backend API URL.
 * Prefers explicit environment variable; otherwise falls back to localhost on local dev,
 * or the live production Render backend when hosted on Vercel or custom domain.
 */
export function getBackendUrl(): string {
  const envUrl = ((import.meta as any).env?.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');
  if (envUrl) return envUrl;

  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local'))
  ) {
    return 'http://localhost:4000';
  }

  return 'https://the-western-store.onrender.com';
}
