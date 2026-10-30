import React, { useState, useRef, useId } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
const BACKEND_URL =
  rawBackendUrl ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://the-western-store.onrender.com');

async function fileToBase64(file: File): Promise<string> {
  // FileReader avoids spreading large typed arrays into String.fromCharCode,
  // which throws "Maximum call stack size exceeded" on real camera photos.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',').pop() || '' : result;
      if (!base64) {
        reject(new Error('Could not read the selected image file.'));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.readAsDataURL(file);
  });
}

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

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUploading(true);
    setProgress(10);

    try {
      let file = rawFile;
      if (rawFile.type.startsWith('image/')) {
        file = await compressAndResizeImage(rawFile, 2560, 2560, 0.92);
      }
      setProgress(35);

      const adminToken = sessionStorage.getItem('tws_admin_token');
      if (!adminToken) {
        throw new Error('Admin session expired. Please log in again before uploading.');
      }

      const fileBase64 = await fileToBase64(file);
      setProgress(55);

      // Upload through the backend so ImageKit private-key signing stays server-side.
      const uploadRes = await fetch(`${BACKEND_URL}/api/imagekit/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          fileBase64,
          fileName: file.name || rawFile.name || 'upload.jpg',
          folder,
          tags,
        }),
      });

      setProgress(85);

      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) {
        throw new Error(
          uploadData.error ||
            uploadData.message ||
            `ImageKit upload failed (${uploadRes.status}).`
        );
      }

      const finalUrl = uploadData.url || '';
      if (!finalUrl) {
        throw new Error('Upload succeeded but ImageKit did not return a file URL.');
      }

      setProgress(100);
      setSuccessMsg('Uploaded to ImageKit successfully!');

      const callback = onUploadSuccess || onSuccess;
      if (typeof callback === 'function') {
        callback(finalUrl);
      }

      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('[ImageKit Uploader]', err);
      setErrorMsg(
        err.message ||
          'Upload failed. Check your admin login and ImageKit setup, then try again.'
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
        disabled={isUploading}
      />

      <div className="flex items-center gap-3">
        <label
          htmlFor={uniqueInputId}
          className={`px-3.5 py-2 rounded-sm text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
            isUploading
              ? 'bg-[#EAE4D9] text-[#736B63] border-[#D9CEBF] cursor-not-allowed pointer-events-none'
              : 'bg-[#721B29] text-white hover:bg-[#852031] border-[#721B29] shadow-xs cursor-pointer'
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

      {isUploading && (
        <div className="w-full bg-[#EAE4D9] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#721B29] h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

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
