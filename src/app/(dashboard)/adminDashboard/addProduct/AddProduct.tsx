"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { generateAIDescription } from "@/services/ai.service";
import { useSession } from "@/lib/auth-client";
import { uploadToCloudinary } from "@/services/cloudinary";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  X,
  Package,
  Tag,
  DollarSign,
  Percent,
  Layers,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ICategory {
  _id: string;
  name: string;
}

interface UploadedImage {
  id: string;
  previewUrl: string;
  url?: string;
  publicId?: string;
  uploading: boolean;
  progress: number;
  error?: string;
}

let imageCounter = 0;
const nextImageId = () => `img_${Date.now()}_${imageCounter++}`;

export const AddProductForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashSalePrice, setFlashSalePrice] = useState("");
  const [flashSaleEndDate, setFlashSaleEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const { data: session } = useSession();
  const token = session?.session.token;
  const shopId = session?.session.userId;

  useEffect(() => {
    axios
      .get(`${API_URL}/categories`)
      .then((res) => res.data?.data ?? res.data ?? [])
      .then((data: ICategory[]) => setCategories(data))
      .catch(() => console.error("Failed to load categories"));
  }, []);

  // AI Description & Auto Category
  const handleAIGenerate = async () => {
    if (!name.trim()) return toast.info("প্রোডাক্টের নাম লিখুন!");
    setAiLoading(true);
    try {
      const res = await generateAIDescription({
        title: name,
        category,
        language: "bn",
      });
      if (res.data) {
        setDescription(res.data.description);
        if (res.data.suggestedCategory && !category)
          setCategory(res.data.suggestedCategory);
        toast.success("AI বিবরণ তৈরি হয়েছে!");
      }
    } catch {
      toast.error("AI জেনারেট করতে ব্যর্থ হয়েছে!");
    } finally {
      setAiLoading(false);
    }
  };

  // Upload a single selected file to Cloudinary and store the returned URL
  const uploadImage = async (id: string, file: File) => {
    try {
      const result = await uploadToCloudinary(file, (progress) => {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, uploading: true, progress } : img,
          ),
        );
      });

      if (!result.url) {
        throw new Error(result.error || "Upload failed");
      }

      setImages((prev) =>
        prev.map((img) => {
          if (img.id !== id) return img;
          URL.revokeObjectURL(img.previewUrl);
          return {
            ...img,
            url: result.url,
            publicId: result.publicId,
            previewUrl: result.url,
            uploading: false,
            progress: 100,
          };
        }),
      );
    } catch (err) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                uploading: false,
                error:
                  err instanceof Error
                    ? err.message
                    : "Upload failed. Please try again.",
              }
            : img,
        ),
      );
    }
  };

  // Handle file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";

    if (files.length === 0) return;

    const newImages: UploadedImage[] = files.map((file) => ({
      id: nextImageId(),
      previewUrl: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
    }));

    setImages((prev) => [...prev, ...newImages]);

    newImages.forEach((image, index) => {
      void uploadImage(image.id, files[index]);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target && !target.url) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const uploadedCount = images.filter(
    (img) => !img.uploading && !img.error && img.url,
  ).length;
  const pendingCount = images.filter((img) => img.uploading).length;

  // Submit Product
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const readyImages = images.filter(
      (img) => !img.uploading && !img.error && img.url,
    );

    if (readyImages.length === 0) {
      return toast.warn("কমপক্ষে একটি ছবি আপলোড হওয়া দরকার!");
    }

    if (images.some((img) => img.uploading)) {
      return toast.warn("ছবিগুলো এখনো আপলোড হচ্ছে, একটু অপেক্ষা করুন...");
    }

    setLoading(true);

    const payload = {
      name,
      category,
      brand,
      shopId,
      price: Number(price),
      discount: Number(discount),
      stock: Number(stock),
      description,
      isFeatured,
      isFlashSale,
      flashSalePrice: isFlashSale ? Number(flashSalePrice) : undefined,
      flashSaleEndDate: isFlashSale ? flashSaleEndDate : undefined,
      images: readyImages.map((img) => img.url as string),
    };

    try {
      const res = await axios.post(`${API_URL}/products`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        toast.success("প্রোডাক্ট সফলভাবে যোগ হয়েছে!");
        window.location.reload();
      } else {
        throw new Error(res.data?.message || "Failed to create product");
      }
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "প্রোডাক্ট অ্যাড করতে সমস্যা হয়েছে!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleSubmitProduct}
        className="space-y-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Title Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 text-purple-600">
            <Package className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Inventory Management
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
            Add New Product
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Fill in the detailed information to publish a new item to your store
            catalog.
          </p>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Product Name <span className="text-purple-600">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Premium Wireless Noise-Canceling Headphones"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10"
          />
        </div>

        {/* Product Images Drag & Drop Area */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Product Images <span className="text-purple-600">*</span>
          </label>

          <div className="mt-1.5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/30 p-6 text-center transition hover:border-purple-400 hover:bg-purple-50/60">
            <input
              type="file"
              multiple
              accept="image/*"
              id="product-images"
              onChange={handleImageSelect}
              className="hidden"
            />
            <label
              htmlFor="product-images"
              className="flex cursor-pointer flex-col items-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 shadow-sm">
                <Upload className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700">
                Click to upload{" "}
                <span className="font-normal text-slate-500">
                  or drag and drop
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-400">
                PNG, JPG, WEBP up to 10MB each (Auto Cloudinary Upload)
              </p>
            </label>
          </div>

          {/* Upload Status Bar */}
          {images.length > 0 && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-semibold text-purple-700">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  {uploadedCount} uploaded
                </span>
                {pendingCount > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {pendingCount} uploading...
                  </span>
                )}
                {images.some((img) => img.error) && (
                  <span className="flex items-center gap-1 text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {images.filter((img) => img.error).length} failed
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs"
                >
                  <Image
                    src={img.previewUrl}
                    alt="Product preview"
                    width={200}
                    height={200}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Uploading Overlay */}
                  {img.uploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-900/60 text-white backdrop-blur-xs">
                      <span className="text-xs font-bold">{img.progress}%</span>
                      <div className="h-1.5 w-3/4 overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full bg-purple-400 transition-all duration-200"
                          style={{ width: `${img.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Failed Banner */}
                  {!img.uploading && img.error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-rose-600/80 p-1 text-center text-[10px] font-bold text-white">
                      Failed
                    </div>
                  )}

                  {/* Uploaded Badge */}
                  {!img.uploading && !img.error && img.url && (
                    <div className="absolute left-1.5 top-1.5 rounded-md bg-purple-600/90 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white shadow-sm backdrop-blur-xs">
                      Done
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => removeImage(img.id)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-rose-500 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Category <span className="text-purple-600">*</span>
            </label>
            <div className="relative mt-1.5">
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Tag className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Brand
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Sony, Apple, Nike"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10"
            />
          </div>
        </div>

        {/* Price, Discount & Stock */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Price ($) <span className="text-purple-600">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10"
              />
              <DollarSign className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Discount (%)
            </label>
            <div className="relative mt-1.5">
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="10"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10"
              />
              <Percent className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Stock Quantity <span className="text-purple-600">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10"
              />
              <Layers className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* AI Generator Panel */}
        <div className="flex flex-col gap-3 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                AI Description Assistant
              </p>
              <p className="text-[11px] text-slate-500">
                Automatically generate selling copy & auto-pick category.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={aiLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-50"
          >
            {aiLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI Generate
              </>
            )}
          </button>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a clear and engaging product description..."
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-800 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10"
          />
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded-md border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-xs font-bold text-slate-800">
              Featured Product
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={isFlashSale}
              onChange={(e) => setIsFlashSale(e.target.checked)}
              className="h-4 w-4 rounded-md border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Flash Sale Campaign
            </span>
          </label>
        </div>

        {/* Flash Sale Options */}
        {isFlashSale && (
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Flash Sale Price ($)
              </label>
              <input
                type="number"
                value={flashSalePrice}
                onChange={(e) => setFlashSalePrice(e.target.value)}
                placeholder="120"
                className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Flash Sale End Date
              </label>
              <input
                type="datetime-local"
                value={flashSaleEndDate}
                onChange={(e) => setFlashSaleEndDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing & Uploading...
            </>
          ) : (
            <>
              <Package className="h-5 w-5" />
              Publish Product
            </>
          )}
        </button>
      </form>
    </div>
  );
};
