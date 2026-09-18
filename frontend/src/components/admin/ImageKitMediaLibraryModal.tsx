import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  RefreshCw,
  Trash2,
  Check,
  Image as ImageIcon,
  Folder,
  Layers,
  AlertTriangle,
  Loader2,
  ExternalLink,
  PlusCircle,
  HardDrive,
} from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

export interface ImageKitFile {
  fileId: string;
  name: string;
  filePath: string;
  url: string;
  thumbnailUrl: string;
  fileType: string;
  size: number;
  height: number | null;
  width: number | null;
  createdAt: string;
}

interface ImageKitMediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImages: (urls: string[]) => void;
  currentProductFolder?: string;
  multiple?: boolean;
}

const BACKEND_URL = ((import.meta as any).env?.VITE_BACKEND_URL) || 'http://localhost:4000';

export const ImageKitMediaLibraryModal: React.FC<ImageKitMediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImages,
  currentProductFolder = '/products',
  multiple = true,
}) => {
  const [files, setFiles] = useState<ImageKitFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const adminSecret =
    sessionStorage.getItem('tws_admin_secret') ||
    ((import.meta as any).env?.VITE_ADMIN_SECRET) ||
    'westernstore_admin_2026';

  const fetchMediaLibrary = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/imagekit/files?limit=100`, {
        headers: {
          'x-admin-secret': adminSecret,
        },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to fetch ImageKit media library.');
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        // Filter only images
        const imageFiles = data.files.filter(
          (f: ImageKitFile) =>
            f.fileType === 'image' ||
            /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f.name || f.filePath)
        );
        setFiles(imageFiles);
      }
    } catch (err: any) {
      console.error('[ImageKit Media Library]', err);
      setErrorMsg(err.message || 'Unable to connect to ImageKit media repository.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedUrls([]);
      setDeleteConfirmId(null);
      fetchMediaLibrary();
    }
  }, [isOpen]);

  const handleDeleteFile = async (fileId: string) => {
    setDeletingFileId(fileId);
    try {
      const res = await fetch(`${BACKEND_URL}/api/imagekit/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-secret': adminSecret,
        },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to delete file from ImageKit.');
      }

      // Remove from local list
      const targetFile = files.find((f) => f.fileId === fileId);
      setFiles((prev) => prev.filter((f) => f.fileId !== fileId));
      if (targetFile) {
        setSelectedUrls((prev) => prev.filter((u) => u !== targetFile.url));
      }
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(`Delete Error: ${err.message}`);
    } finally {
      setDeletingFileId(null);
    }
  };

  const toggleSelectUrl = (url: string) => {
    if (!multiple) {
      setSelectedUrls([url]);
      return;
    }
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleConfirmSelection = () => {
    if (selectedUrls.length === 0) return;
    onSelectImages(selectedUrls);
    onClose();
  };

  // Folders list
  const folders = [
    { id: 'all', label: 'All Folders' },
    { id: '/products', label: '/products' },
    { id: '/hero-slides', label: '/hero-slides' },
  ];

  // Filtered files
  const filteredFiles = files.filter((f) => {
    // Folder filter
    if (selectedFolder !== 'all') {
      if (!f.filePath.startsWith(selectedFolder)) return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = f.name?.toLowerCase().includes(q);
      const matchPath = f.filePath?.toLowerCase().includes(q);
      if (!matchName && !matchPath) return false;
    }
    return true;
  });

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#FDFBF7] rounded-2xl shadow-2xl border border-[#EAE4D9] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#EAE4D9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#721B29] text-white flex items-center justify-center shadow-xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#242120]">
                  ImageKit CDN Media Library
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#FAF8F3] border border-[#EAE4D9] text-[#721B29] px-2 py-0.5 rounded-full">
                  {files.length} photos in cloud
                </span>
              </div>
              <p className="text-xs text-[#736B63]">
                Browse existing boutique photos on ImageKit. Select to attach to garment or delete unused photos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchMediaLibrary}
              disabled={isLoading}
              className="p-2 text-[#736B63] hover:text-[#721B29] hover:bg-[#FAF8F3] rounded-md transition-colors cursor-pointer"
              title="Refresh ImageKit Library"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#721B29]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#736B63] hover:text-[#242120] hover:bg-[#FAF8F3] rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Folder Filter Bar */}
        <div className="p-3 sm:p-4 bg-[#FAF8F3] border-b border-[#EAE4D9] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Folder Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {folders.map((folder) => {
              const isActive = selectedFolder === folder.id;
              const countInFolder =
                folder.id === 'all'
                  ? files.length
                  : files.filter((f) => f.filePath.startsWith(folder.id)).length;

              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#721B29] text-white shadow-xs'
                      : 'bg-white border border-[#D9CEBF] text-[#736B63] hover:text-[#242120] hover:border-[#721B29]'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>{folder.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#EAE4D9] text-[#736B63]'
                    }`}
                  >
                    {countInFolder}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#8C8276] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[#8C8276] hover:text-[#242120]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Gallery Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#FDFBF7]">
          {isLoading && files.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#721B29] animate-spin" />
              <p className="text-xs font-semibold text-[#242120]">
                Connecting to ImageKit CDN repository...
              </p>
            </div>
          ) : errorMsg ? (
            <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-xl max-w-md mx-auto space-y-2">
              <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
              <h4 className="font-serif font-bold text-sm text-rose-950">
                Failed to Load Media Library
              </h4>
              <p className="text-xs text-rose-800">{errorMsg}</p>
              <button
                type="button"
                onClick={fetchMediaLibrary}
                className="mt-3 px-4 py-2 bg-rose-700 text-white rounded-sm text-xs font-semibold hover:bg-rose-800"
              >
                Retry Fetch
              </button>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-[#D9CEBF] rounded-2xl bg-white space-y-2">
              <ImageIcon className="w-10 h-10 text-[#8C8276] mx-auto opacity-50" />
              <h4 className="font-serif font-bold text-sm text-[#242120]">
                No photos found in this folder
              </h4>
              <p className="text-xs text-[#736B63] max-w-sm mx-auto">
                {searchQuery
                  ? `No photos matched "${searchQuery}". Try clearing search.`
                  : 'Upload new photos using the uploader button.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3.5">
              {filteredFiles.map((file) => {
                const isSelected = selectedUrls.includes(file.url);
                const isDeleting = deletingFileId === file.fileId;
                const isConfirmingDelete = deleteConfirmId === file.fileId;
                const optimizedThumbnail = getOptimizedImageUrl(file.url, 400, 80);

                return (
                  <div
                    key={file.fileId}
                    className={`relative rounded-xl border-2 overflow-hidden bg-white flex flex-col group transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#721B29] ring-2 ring-[#721B29]/30 shadow-md'
                        : 'border-[#EAE4D9] hover:border-[#721B29]/60 hover:shadow-sm'
                    }`}
                    onClick={() => toggleSelectUrl(file.url)}
                  >
                    {/* Image Stage */}
                    <div className="relative aspect-[3/4] w-full bg-[#FAF8F3] overflow-hidden">
                      <img
                        src={optimizedThumbnail}
                        alt={file.name}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Selection Checkmark Badge */}
                      <div
                        className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#721B29] text-white shadow-xs scale-100'
                            : 'bg-white/80 text-transparent hover:text-gray-400 group-hover:opacity-100 opacity-60'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      {/* Delete button (Top Right) */}
                      <div className="absolute top-2 right-2">
                        {isConfirmingDelete ? (
                          <div
                            className="bg-black/90 text-white rounded-lg p-2 shadow-xl flex flex-col gap-1.5 z-20 animate-in fade-in"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[10px] font-bold text-rose-400 text-center">
                              Delete from CDN?
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => handleDeleteFile(file.fileId)}
                                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-xs flex items-center gap-1 cursor-pointer"
                              >
                                {isDeleting ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  'Yes'
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-[10px] font-medium rounded-xs cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(file.fileId);
                            }}
                            className="p-1.5 bg-white/90 hover:bg-rose-600 text-[#736B63] hover:text-white rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Delete image from ImageKit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-2 border-t border-[#F4EFE6] bg-white">
                      <p className="text-[11px] font-semibold text-[#242120] truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-[#8C8276] mt-0.5 font-mono">
                        <span>{formatFileSize(file.size)}</span>
                        {file.width && file.height && (
                          <span>
                            {file.width}×{file.height}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#EAE4D9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#242120]">
              {selectedUrls.length} photo{selectedUrls.length !== 1 ? 's' : ''} selected
            </span>
            {selectedUrls.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedUrls([])}
                className="text-[11px] text-[#721B29] hover:underline font-medium cursor-pointer ml-2"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#D9CEBF] text-[#242120] rounded-sm text-xs font-medium hover:bg-[#FAF8F3] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={selectedUrls.length === 0}
              onClick={handleConfirmSelection}
              className={`px-5 py-2 rounded-sm text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedUrls.length > 0
                  ? 'bg-[#721B29] text-white hover:bg-[#852031] shadow-sm active:scale-98'
                  : 'bg-[#EAE4D9] text-[#8C8276] cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {selectedUrls.length > 0
                  ? `Add ${selectedUrls.length} Photo${selectedUrls.length > 1 ? 's' : ''} to Garment`
                  : 'Select Photos to Add'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
