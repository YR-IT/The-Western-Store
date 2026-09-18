import { supabase, isSupabaseConfigured } from './supabase';

export interface SupabaseVideoItem {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  size: number;
}

const BUCKET_NAME = 'videos';

/**
 * Upload a video file to Supabase Storage 'videos' bucket
 */
export async function uploadVideoToSupabase(
  file: File,
  customName?: string
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { url: null, error: 'Supabase is not configured in .env' };
  }

  try {
    const cleanFileName = (customName || file.name)
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/-+/g, '-');
    const timestamp = Date.now();
    const filePath = `reels/${timestamp}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '31536000', // 1 year cache
        upsert: true,
        contentType: file.type || 'video/mp4',
      });

    if (uploadError) {
      console.error('[Supabase Storage] Upload error:', uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    console.error('[Supabase Storage] Upload exception:', err);
    return { url: null, error: err?.message || 'Failed to upload video.' };
  }
}

/**
 * List all uploaded videos from Supabase Storage 'videos' bucket
 */
export async function listSupabaseVideos(): Promise<SupabaseVideoItem[]> {
  if (!isSupabaseConfigured() || !supabase) return [];

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('reels', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.warn('[Supabase Storage] List error:', error.message);
      // Fallback: Check root folder
      const { data: rootData } = await supabase.storage.from(BUCKET_NAME).list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (!rootData) return [];
      return rootData
        .filter((f) => f.name !== '.emptyFolderPlaceholder' && !f.id?.startsWith('folder-'))
        .map((f) => {
          const { data: pubUrl } = supabase.storage.from(BUCKET_NAME).getPublicUrl(f.name);
          return {
            id: f.id || f.name,
            name: f.name,
            url: pubUrl.publicUrl,
            createdAt: f.created_at || new Date().toISOString(),
            size: f.metadata?.size || 0,
          };
        });
    }

    if (!data) return [];

    return data
      .filter((f) => f.name !== '.emptyFolderPlaceholder')
      .map((f) => {
        const { data: pubUrl } = supabase.storage.from(BUCKET_NAME).getPublicUrl(`reels/${f.name}`);
        return {
          id: f.id || f.name,
          name: f.name,
          url: pubUrl.publicUrl,
          createdAt: f.created_at || new Date().toISOString(),
          size: f.metadata?.size || 0,
        };
      });
  } catch (err) {
    console.error('[Supabase Storage] List exception:', err);
    return [];
  }
}

/**
 * Delete a video from Supabase Storage 'videos' bucket
 */
export async function deleteSupabaseVideo(fileNameOrUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    let filePath = fileNameOrUrl;
    if (fileNameOrUrl.includes(`/${BUCKET_NAME}/`)) {
      const parts = fileNameOrUrl.split(`/${BUCKET_NAME}/`);
      if (parts[1]) filePath = decodeURIComponent(parts[1]);
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    if (error) {
      console.warn('[Supabase Storage] Delete error:', error.message);
      // Try with /reels prefix if not present
      if (!filePath.startsWith('reels/')) {
        await supabase.storage.from(BUCKET_NAME).remove([`reels/${filePath}`]);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase Storage] Delete exception:', err);
    return false;
  }
}
