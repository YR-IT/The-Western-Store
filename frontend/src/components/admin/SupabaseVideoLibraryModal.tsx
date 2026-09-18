import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Video,
  Trash2,
  Check,
  Copy,
  RefreshCw,
  Sparkles,
  Play,
  Film,
  AlertCircle,
} from 'lucide-react';
import {
  uploadVideoToSupabase,
  listSupabaseVideos,
  deleteSupabaseVideo,
  SupabaseVideoItem,
} from '../../lib/supabaseStorage';
import { isSupabaseConfigured } from '../../lib/supabase';

interface SupabaseVideoLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (url: string) => void;
  currentVideoUrl?: string;
}

export const SupabaseVideoLibraryModal: React.FC<SupabaseVideoLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectVideo,
  currentVideoUrl,
}) => {
  const [videos, setVideos] = useState<SupabaseVideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchVideos = async () => {
    if (!isSupabaseConfigured()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const list = await listSupabaseVideos();
      setVideos(list);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to fetch videos from Supabase Storage.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVideos();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') && !/\.(mp4|webm|mov|ogg|m4v)$/i.test(file.name)) {
      setErrorMsg('Please select a valid video file (.mp4, .webm, .mov)');
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setUploadProgress(20);

    const progressInterval = setInterval(() => {
      setUploadProgress((p) => (p < 85 ? p + 15 : p));
    }, 300);

    try {
      const { url, error } = await uploadVideoToSupabase(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error || !url) {
        setErrorMsg(error || 'Failed to upload video to Supabase Storage.');
      } else {
        setSuccessMsg('Video uploaded to Supabase Storage successfully!');
        setTimeout(() => setSuccessMsg(null), 3500);
        await fetchVideos();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Upload exception.');
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (video: SupabaseVideoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Permanently delete "${video.name}" from Supabase Storage?`)) return;

    const ok = await deleteSupabaseVideo(video.url);
    if (ok) {
      setVideos((prev) => prev.filter((v) => v.id !== video.id));
      setSuccessMsg(`Deleted ${video.name}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setErrorMsg('Failed to delete video. Please check permissions in Supabase.');
    }
  };

  const handleCopy = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E8DFC9] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#EAE4D9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#721B29]/10 border border-[#721B29]/20 flex items-center justify-center text-[#721B29]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#242120] flex items-center gap-2">
                <span>Supabase Video Storage</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Unlimited Free Stream
                </span>
              </h2>
              <p className="text-xs text-[#736B63] mt-0.5">
                Upload & manage raw .mp4 reels without ImageKit transformation caps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchVideos}
              disabled={loading}
              className="p-2 rounded-lg border border-[#D9CEBF] text-[#736B63] hover:text-[#242120] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              title="Refresh Video List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg border border-[#D9CEBF] text-[#736B63] hover:text-[#242120] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload Banner & Status Messages */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#EAE4D9] space-y-3">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Upload Drop Area */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF7F0] border-2 border-dashed border-[#D9CEBF] hover:border-[#721B29]/60 transition-colors">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-white border border-[#EAE4D9] flex items-center justify-center text-[#721B29] shadow-xs shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#242120]">Upload New Video Reel (.mp4, .webm, .mov)</h4>
                <p className="text-[11px] text-[#736B63]">
                  Direct upload to your Supabase <code className="bg-white px-1 py-0.5 rounded text-[10px] font-mono">videos</code> bucket
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,.mp4,.webm,.mov"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="supabase-video-input"
              />
              <label
                htmlFor="supabase-video-input"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
                  uploading
                    ? 'bg-[#721B29]/60 cursor-not-allowed'
                    : 'bg-[#721B29] hover:bg-[#852031] active:scale-98'
                }`}
              >
                <Upload className={`w-4 h-4 ${uploading ? 'animate-bounce' : ''}`} />
                <span>{uploading ? `Uploading (${uploadProgress}%)...` : 'Choose Video File'}</span>
              </label>
            </div>
          </div>

          {uploading && (
            <div className="w-full bg-[#EAE4D9] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#721B29] h-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Video Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {loading && videos.length === 0 ? (
            <div className="py-16 text-center text-[#736B63]">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-3 text-[#B8860B]" />
              <p className="text-xs font-semibold">Loading Supabase videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="py-16 text-center text-[#736B63] bg-white rounded-2xl border border-[#EAE4D9] p-8">
              <Video className="w-12 h-12 mx-auto mb-3 text-[#D9CEBF]" />
              <h3 className="font-serif font-bold text-base text-[#242120]">No Videos in Supabase Storage Yet</h3>
              <p className="text-xs text-[#736B63] max-w-md mx-auto mt-1 mb-4">
                Upload your boutique vertical reels above. They will be stored directly in Supabase and served at full speed with 0 transformation fees.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {videos.map((video) => {
                const isSelected = currentVideoUrl === video.url;

                return (
                  <div
                    key={video.id}
                    onClick={() => {
                      onSelectVideo(video.url);
                      onClose();
                    }}
                    className={`group relative flex flex-col justify-between bg-white rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg ${
                      isSelected
                        ? 'border-[#721B29] ring-2 ring-[#721B29]'
                        : 'border-[#EAE4D9] hover:border-[#721B29]/60'
                    }`}
                  >
                    {/* Video Preview Aspect */}
                    <div className="relative aspect-[9/14] bg-black overflow-hidden flex items-center justify-center">
                      <video
                        src={video.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                      />

                      {/* Hover Play Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white text-[#721B29] flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-[#721B29] ml-0.5" />
                        </div>
                      </div>

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#721B29] text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </div>
                      )}

                      {/* Action Overlay */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90">
                        <button
                          type="button"
                          onClick={(e) => handleCopy(video.url, e)}
                          className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                          title="Copy Public URL"
                        >
                          {copiedUrl === video.url ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(video, e)}
                          className="p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Bottom */}
                    <div className="p-2.5 bg-white border-t border-[#F2ECE0]">
                      <p className="font-bold text-[11px] text-[#242120] truncate" title={video.name}>
                        {video.name.replace(/^reels\//, '').replace(/^\d+_/, '')}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-[#8C8276] mt-0.5">
                        <span>{formatFileSize(video.size)}</span>
                        <span className="text-[#721B29] font-bold group-hover:underline">Select &rarr;</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EAE4D9] flex items-center justify-between text-xs text-[#736B63]">
          <span>{videos.length} videos stored in Supabase</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FAF7F0] border border-[#D9CEBF] hover:bg-[#EAE4D9] text-[#242120] font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
