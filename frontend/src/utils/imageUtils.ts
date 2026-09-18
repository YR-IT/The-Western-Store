/**
 * Utility helpers for image URL optimization, client-side compression,
 * and graceful fallback handling across The Western Store application.
 */

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

export const FALLBACK_CATEGORY_IMAGE =
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80';

/**
 * Transforms ImageKit, Unsplash, or CDN image URLs to use optimal width,
 * quality, and modern format (WebP/AVIF) transformations.
 * This prevents 400 Bad Request errors from unconstrained high-res DSLR photos (>25MP).
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width: number = 1000,
  quality: number = 85
): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  const cleanUrl = url.trim();

  // 1. ImageKit CDN URL transformation
  if (cleanUrl.includes('ik.imagekit.io')) {
    try {
      // Matches https://ik.imagekit.io/<endpoint-id>/[optional tr:.../]<rest-of-path>
      const match = cleanUrl.match(/^(https?:\/\/ik\.imagekit\.io\/[^/]+)(?:\/tr:[^/]+)?(\/.*)$/);
      if (match) {
        const baseUrl = match[1];
        const restPath = match[2];
        return `${baseUrl}/tr:w-${width},q-${quality},f-auto${restPath}`;
      }
    } catch {
      return cleanUrl;
    }
  }

  // 2. Unsplash transformation
  if (cleanUrl.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(cleanUrl);
      urlObj.searchParams.set('w', String(width));
      urlObj.searchParams.set('q', String(quality));
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      return urlObj.toString();
    } catch {
      return cleanUrl;
    }
  }

  return cleanUrl;
}

/**
 * Resizes and compresses heavy DSLR or high-resolution smartphone photos (>25MP / >10MB)
 * on the client-side before sending them to the ImageKit upload endpoint.
 * This guarantees lightning-fast uploads and prevents ImageKit 25MP resolution limit errors.
 */
export async function compressAndResizeImage(
  file: File,
  maxWidth = 2048,
  maxHeight = 2048,
  quality = 0.88
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
