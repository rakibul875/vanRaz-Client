import { CloudinaryConfig, CloudinaryUploadResponse } from "../../types";


const STORAGE_KEY = 'member2_cloudinary_config';

// Default config or fallback
export const getCloudinaryConfig = (): CloudinaryConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read Cloudinary config from localStorage', e);
  }

  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
    apiKey: '',
  };
};

export const saveCloudinaryConfig = (config: CloudinaryConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Cloudinary config', e);
  }
};

interface UploadResult {
  url: string;
  publicId?: string;
  isCloudinary: boolean;
  error?: string;
}

interface RelayedUploadResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    secure_url?: string;
    public_id?: string;
    provider?: string;
  };
}

/**
 * Upload a file through the app's own backend, which relays it to Cloudinary
 * server-side. This avoids browser/AV network blocks on api.cloudinary.com
 * (e.g. "ERR_CONNECTION_TIMED_OUT" caused by antivirus content blockers).
 */
function uploadViaBackend(file: File, onProgress?: (progress: number) => void): Promise<UploadResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return Promise.reject(new Error('NEXT_PUBLIC_API_URL is not configured'));
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'venraz/products');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${apiUrl}/upload`, true);
    xhr.timeout = 60000;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json: RelayedUploadResponse = JSON.parse(xhr.responseText);
          if (json.success && json.data?.secure_url) {
            resolve({
              url: json.data.secure_url,
              publicId: json.data.public_id,
              isCloudinary: json.data.secure_url.includes("cloudinary.com"),
            });
            return;
          }
          reject(new Error(json.message || 'Upload failed'));
        } catch (e) {
          reject(e);
        }
      } else {
        let message = `Upload failed with status ${xhr.status}`;
        try {
          const errObj = JSON.parse(xhr.responseText);
          message = errObj.message || errObj.error || message;
        } catch {
          // ignore
        }
        reject(new Error(message));
      }
    };

    xhr.onerror = () => reject(new Error('Network error reaching upload server'));
    xhr.ontimeout = () => reject(new Error('Upload request timed out'));

    xhr.send(formData);
  });
}

/**
 * Upload an image file to Cloudinary via the backend relay first (avoids
 * browser/antivirus blocks on api.cloudinary.com). Falls back to a direct
 * Cloudinary upload, and finally to a base64 DataURL for local preview.
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const config = getCloudinaryConfig();

  // 1. Preferred path: route through our own backend (server → Cloudinary).
  try {
    return await uploadViaBackend(file, onProgress);
  } catch (err) {
    console.warn('Backend relay upload failed, trying direct Cloudinary:', (err as Error)?.message);
  }

  // 2. If cloud name and upload preset are configured, attempt real Cloudinary upload
  if (config.cloudName && config.uploadPreset) {
    try {
      const url = `https://api.cloudinary.com/v1_1/${config.cloudName.trim()}/image/upload`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', config.uploadPreset.trim());
      console.log(url);
      // Use XMLHttpRequest to track progress
      return await new Promise<UploadResult>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.timeout = 30000;

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
            // Return optimized secure url
            resolve({
              url: response.secure_url,
              publicId: response.public_id,
              isCloudinary: true,
            });
          } else {
            let errMsg = `Upload failed with status ${xhr.status}`;
            try {
              const errObj = JSON.parse(xhr.responseText);
              if (errObj.error && errObj.error.message) {
                errMsg = errObj.error.message;
              }
            } catch {
              // ignore
            }
            console.warn('Cloudinary upload error, falling back to local preview:', errMsg);
            // Fallback to local DataURL
            readFileAsDataUrl(file).then((dataUrl) => {
              resolve({
                url: dataUrl,
                isCloudinary: false,
                error: `Cloudinary error: ${errMsg}. Local preview saved instead.`,
              });
            });
          }
        };

        xhr.ontimeout = () => {
          console.warn('Cloudinary upload timed out, falling back to local preview');
          readFileAsDataUrl(file).then((dataUrl) => {
            resolve({
              url: dataUrl,
              isCloudinary: false,
              error: 'Cloudinary upload timed out. Local preview saved instead.',
            });
          });
        };

        xhr.onerror = () => {
          console.warn('Cloudinary network error, falling back to local preview');
          readFileAsDataUrl(file).then((dataUrl) => {
            resolve({
              url: dataUrl,
              isCloudinary: false,
              error: 'Network error reaching Cloudinary. Local preview saved instead.',
            });
          });
        };

        xhr.send(formData);
      });
    } catch (err: unknown) {
      console.error('Exception during Cloudinary upload:', err);
      const dataUrl = await readFileAsDataUrl(file);
      return {
        url: dataUrl,
        isCloudinary: false,
        error: err instanceof Error ? err.message : 'Upload exception. Local preview used.',
      };
    }
  }

  // 3. If no Cloudinary config is set, simulate smooth upload progress and return Data URL
  if (onProgress) {
    for (let p = 10; p <= 100; p += 30) {
      onProgress(p);
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  const dataUrl = await readFileAsDataUrl(file);
  return {
    url: dataUrl,
    isCloudinary: false,
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}