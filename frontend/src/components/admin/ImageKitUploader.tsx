import React, { useState, useRef, useId } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { compressAndResizeImage } from '../../utils/imageUtils';

interface ImageKitUploaderProps {
  onUploadSuccess?: (url: string) => void;
  onSuccess?: (url: string) => void;
  folder?: string;
  tags?: string[];
  buttonText?: string;
  className?: string;
  accept?: string;
}

const rawBackendUrl = ((import.meta as any).env?.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');
const BACKEND_URL = rawBackendUrl || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000' : '');

export const ImageKitUploader: React.FC<ImageKitUploaderProps> = ({
  onUploadSuccess,
  onSuccess,
  folder = '/products',
  tags,
  buttonText = 'Upload Image to ImageKit CDN',
  className = '',
  accept,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uniqueInputId = useId();

  const resolvedAccept = accept || (folder.includes('video') ? 'video/*' : 'image/*');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    // Reset feedback states
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUploading(true);
    setProgress(15);

    try {
      // Resize & optimize high-res camera photos before upload so they never exceed ImageKit MP limits
      let file = rawFile;
      if (rawFile.type.startsWith('image/')) {
        file = await compressAndResizeImage(rawFile, 2560, 2560, 0.92);
      }
      setProgress(30);

      const adminSecretToUse =
        sessionStorage.getItem('tws_admin_secret') ||
        ((import.meta as any).env?.VITE_ADMIN_SECRET) ||
        'westernstore_admin_2026';

      // Step 1: Fetch authentication params from Express backend
      const authRes = await fetch(`${BACKEND_URL}/api/imagekit/auth`, {
        headers: {
          'x-admin-secret': adminSecretToUse,
        },
      });

      if (!authRes.ok) {
        const errorData = await authRes.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            'Failed to get upload signature from server. Ensure backend server is running.'
        );
      }

      const authData = await authRes.json();
      const { token, expire, signature, publicKey } = authData;

      setProgress(50);

      // Step 2: Prepare FormData for ImageKit Upload API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name || 'upload');
      formData.append('token', token);
      formData.append('expire', String(expire));
      formData.append('signature', signature);
      formData.append('folder', folder);
      if (tags && tags.length > 0) {
        formData.append('tags', tags.join(','));
      }
      if (publicKey) formData.append('publicKey', publicKey);

      setProgress(75);

      // Step 3: Upload directly to ImageKit upload endpoint
      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      setProgress(90);

      if (!uploadRes.ok) {
        const errJson = await uploadRes.json().catch(() => ({}));
        throw new Error(errJson.message || 'ImageKit upload request failed.');
      }

      const uploadData = await uploadRes.json();
      setProgress(100);

      const finalUrl = uploadData.url || '';
      setSuccessMsg('Uploaded to ImageKit successfully!');

      const callback = onUploadSuccess || onSuccess;
      if (typeof callback === 'function') {
        callback(finalUrl);
      }

      // Clear file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('[ImageKit Uploader]', err);
      setErrorMsg(
        err.message ||
          'Upload failed. Please verify ImageKit credentials in backend/.env or use URL input.'
      );
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setSuccessMsg(null);
        setProgress(0);
      }, 3500);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={resolvedAccept}
        onChange={handleFileChange}
        className="hidden"
        id={uniqueInputId}
      />

      <div className="flex items-center gap-3">
        <label
          htmlFor={uniqueInputId}
          className={`px-3.5 py-2 rounded-sm text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
            isUploading
              ? 'bg-[#EAE4D9] text-[#736B63] border-[#D9CEBF] cursor-not-allowed'
              : 'bg-[#721B29] text-white hover:bg-[#852031] border-[#721B29] shadow-xs'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#721B29]" />
              <span>Uploading to ImageKit... ({progress}%)</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>{buttonText}</span>
            </>
          )}
        </label>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="w-full bg-[#EAE4D9] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#721B29] h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Feedback Messages */}
      {successMsg && (
        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-sm text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-start gap-1.5 text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-sm text-[11px]">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">ImageKit Upload Note:</p>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
};
