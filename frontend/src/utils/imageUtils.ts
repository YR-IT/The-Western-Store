/**
 * Utility helpers for image URL optimization, client-side compression,
 * and graceful fallback handling across The Western Store application.
 */

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

export const FALLBACK_CATEGORY_IMAGE =
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80';

/**
 * Returns an ImageKit or CDN image URL with smart, visually-lossless compression.
 *
 * Strategy:
 *  - quality 90  → indistinguishable from original to human eye, ~50% smaller
 *  - f-auto      → ImageKit serves WebP/AVIF automatically (~30% extra saving)
 *  - width 1920  → covers full HD & most retina displays; pass a larger value
 *                  (e.g. 3840) for hero banners that need 4K sharpness
 *
 * Net effect: an 8 MB upload becomes ~1–2 MB on the wire — well within
 * ImageKit's 20 GB/month free bandwidth for 400–500 daily users.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width: number = 1920,
  quality: number = 90
): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  const cleanUrl = url.trim();

  // 1. ImageKit CDN URL — strip any stale tr: segment, then apply our
  //    smart transformation: width cap, q-90, and auto WebP/AVIF format.
  if (cleanUrl.includes('ik.imagekit.io')) {
    try {
      const stripped = cleanUrl.replace(/\/tr:[^/]+/, '');
      // Insert transformation right after the endpoint root
      // e.g. https://ik.imagekit.io/abc/products/img.jpg
      //   -> https://ik.imagekit.io/abc/tr:w-1920,q-90,f-auto/products/img.jpg
      const match = stripped.match(/^(https?:\/\/ik\.imagekit\.io\/[^/]+)(\/.*)?$/);
      if (match) {
        const base = match[1];
        const rest = match[2] || '';
        return `${base}/tr:w-${width},q-${quality},f-auto${rest}`;
      }
      return stripped;
    } catch {
      return cleanUrl;
    }
  }

  // 2. Unsplash — high quality, auto format
  if (cleanUrl.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(cleanUrl);
      urlObj.searchParams.set('w', String(width));
      urlObj.searchParams.set('q', String(quality));
      urlObj.searchParams.set('auto', 'format');
      return urlObj.toString();
    } catch {
      return cleanUrl;
    }
  }

  return cleanUrl;
}

/**
 * Compresses and resizes images client-side before uploading to ImageKit.
 *
 * Settings chosen for "visually lossless" output:
 *  - maxWidth / maxHeight: 3840px  → full 4K resolution, nothing is ever cropped
 *  - quality: 0.92                 → JPEG 92% is indistinguishable from original
 *                                    at normal viewing distances, but ~50% smaller
 *
 * An 8 MB phone photo typically comes out at 1.5–3 MB after this step,
 * keeping ImageKit bandwidth well within the 20 GB/month free limit.
 * SVG and GIF files are passed through untouched.
 */
export async function compressAndResizeImage(
  file: File,
  maxWidth = 3840,
  maxHeight = 3840,
  quality = 0.92
): Promise<File> {
  // If not an image or SVG/GIF, return as is
  if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Only scale down if image exceeds max dimension
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image smoothed
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Create a clean filename replacing extension with .jpg if converted
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            const newFile = new File([blob], `${originalName}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve(newFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}
