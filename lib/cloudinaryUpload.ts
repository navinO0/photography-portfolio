/**
 * Smart Cloudinary Image Uploader
 * 1. Checks if image has already been uploaded (SHA-256 fingerprint deduplication). Reuses existing Cloudinary asset URL if present.
 * 2. Tries original uncompressed file first.
 * 3. If upload fails (large file size / network payload limit), automatically compresses image by 10% per retry.
 * 4. Triggers toaster notification callbacks for progress updates.
 */

export interface UploadStatusCallback {
  (message: string, type: 'info' | 'success' | 'warning' | 'error'): void;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dzapdxkgc';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'demo_store';

/**
 * Computes a unique SHA-256 fingerprint hash for a File
 */
async function computeFileSHA256(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return `sha256_${file.size}_${hashHex}`;
  } catch {
    return `file_${file.name}_${file.size}_${file.lastModified}`;
  }
}

/**
 * Gets cached Cloudinary URL for a given file fingerprint key
 */
function getCachedUpload(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const cacheStr = localStorage.getItem('cloudinary_upload_cache');
    if (cacheStr) {
      const cache = JSON.parse(cacheStr);
      return cache[key] || null;
    }
  } catch {
    // Ignore local storage error
  }
  return null;
}

/**
 * Saves Cloudinary URL to local storage cache for deduplication
 */
function setCachedUpload(key: string, url: string) {
  if (typeof window === 'undefined') return;
  try {
    const cacheStr = localStorage.getItem('cloudinary_upload_cache');
    const cache = cacheStr ? JSON.parse(cacheStr) : {};
    cache[key] = url;
    localStorage.setItem('cloudinary_upload_cache', JSON.stringify(cache));
  } catch {
    // Ignore local storage error
  }
}

/**
 * Helper to compress a File using HTML5 Canvas to JPEG at specified quality (0.0 to 1.0)
 */
async function compressFileToBlob(file: File, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Scale down extreme resolution images (> 3840px) if needed
      const maxDim = 3840;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas compression failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Uploads file to Cloudinary with smart deduplication & compression retries
 */
export async function uploadToCloudinaryWithRetry(
  file: File,
  onStatus?: UploadStatusCallback
): Promise<string> {
  // Check if image already exists in Cloudinary upload cache
  const fileHashKey = await computeFileSHA256(file);
  const existingUrl = getCachedUpload(fileHashKey);
  if (existingUrl) {
    onStatus?.(`Image already exists in Cloudinary library! Reusing existing asset URL.`, 'info');
    return existingUrl;
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const qualities = [1.0, 0.9, 0.8, 0.7]; // 100% original -> 90% -> 80% -> 70%

  for (let attempt = 0; attempt < qualities.length; attempt++) {
    const quality = qualities[attempt];
    const isOriginal = attempt === 0;

    if (isOriginal) {
      onStatus?.(`Uploading original image (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`, 'info');
    } else {
      const compressionPct = Math.round((1 - quality) * 100);
      onStatus?.(
        `Large file detected. Compressing by ${compressionPct}% (Attempt #${attempt + 1})...`,
        'warning'
      );
    }

    try {
      let fileToUpload: Blob | File = file;

      // Compress if not original attempt
      if (!isOriginal) {
        fileToUpload = await compressFileToBlob(file, quality);
      }

      const formData = new FormData();
      formData.append('file', fileToUpload, file.name);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) {
          // Cache the Cloudinary URL for deduplication
          setCachedUpload(fileHashKey, data.secure_url);
          onStatus?.(`Image successfully uploaded to Cloudinary!`, 'success');
          return data.secure_url;
        }
      }

      const errText = await res.text();
      console.warn(`Cloudinary upload attempt #${attempt + 1} failed:`, errText);
    } catch (err: any) {
      console.warn(`Upload attempt #${attempt + 1} exception:`, err);
    }
  }

  onStatus?.(`Upload failed after 3 compression retries. Please select a smaller image file.`, 'error');
  throw new Error('Cloudinary upload failed after multiple compression attempts');
}
