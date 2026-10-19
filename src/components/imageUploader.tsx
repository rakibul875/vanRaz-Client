"use client";
import React, { useState, useRef } from "react";
import {
  uploadToCloudinary,
  getCloudinaryConfig,
} from "../services/cloudinary";
import {
  Upload,
  X,
  Check,
  Cloud,
  Sparkles,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: "square" | "banner";
  presets?: { name: string; url: string }[];
  onOpenCloudinarySettings?: () => void;
  idPrefix: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  sublabel,
  value,
  onChange,
  aspectRatio = "square",
  presets,
  onOpenCloudinarySettings,
  idPrefix,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState<{
    type: "idle" | "cloudinary" | "local" | "error";
    message?: string;
  }>({
    type: value
      ? value.includes("cloudinary.com")
        ? "cloudinary"
        : "local"
      : "idle",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const config = getCloudinaryConfig();
  const hasCloudinarySetup = !!(config.cloudName && config.uploadPreset);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus({ type: "idle" });

    try {
      const result = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      onChange(result.url);

      if (result.isCloudinary) {
        setUploadStatus({
          type: "cloudinary",
          message: "Uploaded directly to Cloudinary!",
        });
      } else {
        setUploadStatus({
          type: "local",
          message:
            result.error || "Preview loaded (Cloudinary not configured).",
        });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadStatus({
        type: "error",
        message: err?.message || "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setUploadStatus({
        type: "local",
        message: "Image loaded from custom URL",
      });
      setShowUrlInput(false);
      setCustomUrl("");
    }
  };

  const isBanner = aspectRatio === "banner";

  return (
    <div id={`${idPrefix}-uploader-container`} className="space-y-2">
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-slate-800">
            {label}
          </label>
          {sublabel && <p className="text-[11px] text-slate-500">{sublabel}</p>}
        </div>

        <div className="flex items-center gap-1 text-xs">
          {presets && presets.length > 0 && (
            <button
              type="button"
              id={`${idPrefix}-preset-toggle-btn`}
              onClick={() => setShowPresets(!showPresets)}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 px-2 py-0.5 rounded-md hover:bg-indigo-50 font-medium transition-colors"
            >
              <Sparkles size={12} />
              <span>Presets</span>
            </button>
          )}

          <button
            type="button"
            id={`${idPrefix}-url-toggle-btn`}
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-800 px-2 py-0.5 rounded-md hover:bg-slate-100 font-medium transition-colors"
          >
            <LinkIcon size={12} />
            <span>URL</span>
          </button>
        </div>
      </div>

      {/* Preset selector drawer */}
      {showPresets && presets && (
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
              Select Preset {isBanner ? "Banner" : "Logo"}:
            </span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                id={`${idPrefix}-preset-${idx}`}
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                  setUploadStatus({
                    type: "local",
                    message: `Selected: ${preset.name}`,
                  });
                }}
                className={`group relative overflow-hidden rounded-lg border border-slate-200 hover:border-indigo-500 transition-all text-left ${value === preset.url ? "ring-2 ring-indigo-600" : ""
                  }`}
              >
                <div
                  className={`w-full overflow-hidden bg-slate-100 ${isBanner ? "h-14" : "h-16"
                    }`}
                >
                  <Image
                    src={preset.url}
                    alt={preset.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-1 bg-white">
                  <p className="text-[10px] font-medium text-slate-700 truncate">
                    {preset.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom URL Input */}
      {showUrlInput && (
        <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
          <input
            type="url"
            id={`${idPrefix}-url-input`}
            placeholder="Paste image URL (https://...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="submit"
            id={`${idPrefix}-url-submit-btn`}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium hover:bg-slate-900 transition-colors"
          >
            Apply
          </button>
        </form>
      )}

      {/* Main Upload Box / Preview Area */}
      <input
        ref={fileInputRef}
        type="file"
        id={`${idPrefix}-file-input`}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {value ? (
        /* Image Preview Box */
        <div
          id={`${idPrefix}-preview-box`}
          className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 group ${isBanner ? "h-40 w-full" : "h-32 w-32"
            }`}
        >
          <Image
            src={value}
            alt={label}
            width={400}
            height={400}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Hover Overlay with Change / Delete */}
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              id={`${idPrefix}-change-btn`}
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 shadow-md transition-transform hover:scale-105"
              title="Replace image"
            >
              <RefreshCw size={16} />
            </button>
            <button
              type="button"
              id={`${idPrefix}-remove-btn`}
              onClick={() => {
                onChange("");
                setUploadStatus({ type: "idle" });
              }}
              className="p-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white shadow-md transition-transform hover:scale-105"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>

          {/* Cloudinary indicator badge */}
          <div className="absolute bottom-2 left-2 pointer-events-none">
            {value.includes("cloudinary.com") ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-500/90 text-white shadow-xs backdrop-blur-xs">
                <Cloud size={10} />
                Cloudinary
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900/70 text-white shadow-xs backdrop-blur-xs">
                Image Set
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          id={`${idPrefix}-dropzone`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition-all duration-200 flex flex-col items-center justify-center ${isBanner ? "h-36 w-full" : "h-32 w-full max-w-xs"
            } ${isDragOver
              ? "border-sky-500 bg-sky-50/50"
              : "border-slate-200 hover:border-sky-400 bg-slate-50/50 hover:bg-slate-50"
            }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-sky-600" />
              <p className="text-xs font-semibold text-slate-700">
                Uploading to Cloudinary... ({uploadProgress}%)
              </p>
              <div className="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-600 h-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div className="p-2 rounded-xl bg-white shadow-xs text-sky-600 border border-slate-100">
                <Upload size={18} />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Click to upload {label}
              </p>
              <p className="text-[11px] text-slate-400">
                Drag & drop or PNG, JPG, WEBP up to 5MB
              </p>
              <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-sky-600 font-medium">
                <Cloud size={11} />
                <span>Cloudinary Upload</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status banner / feedback */}
      {uploadStatus.message && (
        <div
          className={`flex items-center justify-between text-[11px] p-2 rounded-lg ${uploadStatus.type === "cloudinary"
              ? "bg-sky-50 text-sky-800 border border-sky-200"
              : uploadStatus.type === "error"
                ? "bg-rose-50 text-rose-800 border border-rose-200"
                : "bg-slate-100 text-slate-700"
            }`}
        >
          <div className="flex items-center gap-1.5">
            {uploadStatus.type === "cloudinary" ? (
              <Check size={12} className="text-sky-600" />
            ) : uploadStatus.type === "error" ? (
              <AlertCircle size={12} className="text-rose-600" />
            ) : (
              <Cloud size={12} className="text-slate-500" />
            )}
            <span>{uploadStatus.message}</span>
          </div>

          {!hasCloudinarySetup && onOpenCloudinarySettings && (
            <button
              type="button"
              onClick={onOpenCloudinarySettings}
              className="text-sky-600 hover:text-sky-800 underline font-medium ml-2"
            >
              Configure Cloudinary
            </button>
          )}
        </div>
      )}
    </div>
  );
};