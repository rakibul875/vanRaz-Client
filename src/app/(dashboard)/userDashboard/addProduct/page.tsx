"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PackagePlus,
  Store,
  AlertCircle,
  Loader2,
  Check,
  X,
  Wand2,
  Tag,
  Layers,
  DollarSign,
  Boxes,
  PlusCircle,
  Sparkles,
  Rocket,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ImageUploader } from "@/components/imageUploader";
import { generateAIDescription } from "@/services/ai.service";
import { useToast } from "@/context/ToastContext";

interface CategoryItem {
  _id: string;
  name: string;
  slug?: string;
}

interface MyShop {
  _id: string;
  ownerId: string;
  name: string;
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const slugifyName = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const inputCls = (hasError: boolean) =>
  `w-full border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
    hasError
      ? "border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
  }`;

export default function AddProductPage() {
  const { data: session } = authClient.useSession();
  const token = session?.session?.token;
  const userId = session?.user?.id;
  const { success, error: showError } = useToast();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [shop, setShop] = useState<MyShop | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingShop, setLoadingShop] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  console.log(shop);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    brand: "",
    price: "",
    discount: "0",
    stock: "",
    category: "",
    description: "",
    isFeatured: false,
    isFlashSale: false,
    flashSalePrice: "",
    flashSaleEndDate: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [pendingImage, setPendingImage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!API_URL) {
        if (!cancelled) setLoadingCategories(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
        const json = await res.json();
        const list = json?.data ?? json ?? [];
        if (!cancelled && Array.isArray(list)) setCategories(list);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!API_URL || !token || !userId) {
        if (!cancelled) setLoadingShop(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/shops/my-shop/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (res.status === 404) {
          if (!cancelled) setShop(null);
          return;
        }
        if (!res.ok) {
          throw new Error(`Failed to load shop: ${res.status}`);
        }
        const json = await res.json();
        console.log(json);
        if (!cancelled) setShop(json?.data?.shop ?? null);
      } catch (err) {
        console.error("Failed to load my shop:", err);
      } finally {
        if (!cancelled) setLoadingShop(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, userId]);

  const selectedCategory = useMemo(
    () => categories.find((c) => c._id === formData.category),
    [categories, formData.category],
  );

  const updateField = (
    field: keyof typeof formData,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && typeof value === "string" && !prev.slug) {
        next.slug = slugifyName(value);
      }
      return next;
    });
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!session?.user)
      newErrors.api = "You must be logged in to add a product.";
    if (!shop) newErrors.api = "Create a shop first before adding products.";
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!(formData.slug.trim() || slugifyName(formData.name)))
      newErrors.slug = "Slug is required";
    if (!formData.category) newErrors.category = "Select a category";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Enter a valid price";
    if (formData.stock === "" || Number(formData.stock) < 0)
      newErrors.stock = "Stock must be 0 or more";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (images.length === 0)
      newErrors.images = "Add at least one product image";
    if (formData.isFlashSale) {
      if (!formData.flashSalePrice || Number(formData.flashSalePrice) <= 0)
        newErrors.flashSalePrice = "Enter a flash sale price";
      if (!formData.flashSaleEndDate)
        newErrors.flashSaleEndDate = "Set a flash sale end date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAIGenerate = async () => {
    if (!formData.name.trim()) {
      showError(
        "Type a product name first so AI can write a description.",
        "AI Generator",
      );
      return;
    }
    setAiLoading(true);
    try {
      const res = await generateAIDescription({
        title: formData.name.trim(),
        category: selectedCategory?.name ?? "",
        language: "en",
      });
      const generated = res?.data?.description || res?.description;
      if (generated) {
        setFormData((prev) => ({ ...prev, description: generated }));
        success("AI description generated.", "AI Generator");
      } else {
        showError(
          "AI returned an empty description. Please try again.",
          "AI Generator",
        );
      }
    } catch (err) {
      console.error("AI generate error:", err);
      showError("Failed to generate description with AI.", "AI Generator");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddPendingImage = () => {
    if (pendingImage.trim() && !images.includes(pendingImage.trim())) {
      setImages((prev) => [...prev, pendingImage.trim()]);
      if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
    }
    setPendingImage("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const slug =
        formData.slug.trim().toLowerCase() || slugifyName(formData.name);
      const payload = {
        name: formData.name.trim(),
        slug,
        description: formData.description.trim(),
        images,
        price: Number(formData.price),
        discount: Number(formData.discount) || 0,
        stock: Number(formData.stock),
        category: formData.category,
        shop: shop!.ownerId,
        seller: userId!,
        brand: formData.brand.trim(),
        isFeatured: formData.isFeatured,
        isFlashSale: formData.isFlashSale,
        flashSalePrice: formData.isFlashSale
          ? Number(formData.flashSalePrice)
          : undefined,
        flashSaleEndDate: formData.isFlashSale
          ? new Date(formData.flashSaleEndDate).toISOString()
          : undefined,
      };

      const res = await fetch(`${API_URL}/products/seller/create-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || json.success === false) {
        const message =
          json.error || json.message || `API returned status ${res.status}`;
        throw new Error(message);
      }

      success(json.message || "Product created successfully!", "Product Added");

      setFormData({
        name: "",
        slug: "",
        brand: "",
        price: "",
        discount: "0",
        stock: "",
        category: "",
        description: "",
        isFeatured: false,
        isFlashSale: false,
        flashSalePrice: "",
        flashSaleEndDate: "",
      });
      setImages([]);
      setPendingImage("");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create product. Please try again.";
      console.error("Create product error:", err);
      showError(message, "Error");
      setErrors((prev) => ({ ...prev, api: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCategories || loadingShop) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-[#6B7268]">
        <Loader2 className="h-6 w-6 animate-spin text-[#C08A3E]" />
        <p className="text-sm">Loading your seller workspace...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#DEDACE] bg-white px-6 py-20 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F2EC] text-[#C08A3E]">
          <Store size={26} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0E1B1B]">
            You need a shop to add products
          </h2>
          <p className="mt-1 max-w-md text-sm text-[#6B7268]">
            Create a vendor storefront first, then you can start listing
            products on the marketplace.
          </p>
        </div>
        <Link
          href="/userDashboard/createShop"
          className="inline-flex items-center gap-2 rounded-lg bg-[#C08A3E] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#A8762F]"
        >
          <PlusCircle size={14} />
          Create My Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0E1B1B] text-[#C08A3E]">
            <PackagePlus className="h-5 w-5" />
          </div>
          <div className="h-px w-10 bg-[#C08A3E]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A9E96]">
            Merchant Center
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#0E1B1B] sm:text-3xl">
              Add a new product
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6B7268]">
              List a product from your shop. Once created, it goes through
              review before appearing to customers.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#DEDACE] bg-white px-3.5 py-2 text-xs font-semibold text-[#0E1B1B] shadow-sm">
            <Store size={14} className="text-[#C08A3E]" />
            {shop.name}
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        {errors.api && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-0.5 text-xs text-red-600">{errors.api}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* Left rail / progress hint */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="border-l-2 border-slate-200 pl-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C08A3E]">
                  Listing
                </p>
                <h2 className="mt-2 text-lg font-bold text-[#0E1B1B]">
                  Product details
                </h2>
                <p className="mt-2 text-xs leading-5 text-[#6B7268]">
                  Fill in accurate details so customers can find and trust your
                  product.
                </p>
              </div>

              <div className="mt-8 space-y-5 pl-5">
                {[
                  { n: "01", label: "Basics" },
                  { n: "02", label: "Media" },
                  { n: "03", label: "Promotions" },
                  { n: "04", label: "Publish" },
                ].map((step, idx) => (
                  <div key={step.n} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        idx === 0
                          ? "bg-[#0E1B1B] text-white"
                          : "border border-slate-200 text-slate-400"
                      }`}
                    >
                      {step.n}
                    </span>
                    <span
                      className={`text-xs ${
                        idx === 0
                          ? "font-semibold text-slate-700"
                          : "font-medium text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main form */}
          <div className="space-y-6">
            {/* ───── Basics ───── */}
            <section className="border border-[#DEDACE] bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#DEDACE] px-5 py-5 sm:px-7">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F2EC] text-[#C08A3E]">
                  <Tag size={15} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0E1B1B]">Basics</h2>
                  <p className="text-xs text-[#6B7268]">
                    Name, price, stock & category
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-7">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Product name <span className="ml-1 text-[#C08A3E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wireless Noise-Canceling Headphones"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputCls(!!errors.name)}
                  />
                  {errors.name && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    URL slug <span className="ml-1 text-[#C08A3E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated from name"
                    value={formData.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className={`${inputCls(!!errors.slug)} font-mono`}
                  />
                  <p className="mt-1 text-[11px] text-[#9A9E96]">
                    Auto-filled from the product name. Keep it lowercase with
                    hyphens.
                  </p>
                  {errors.slug && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" /> {errors.slug}
                    </p>
                  )}
                </div>

                {/* Brand + Category */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      Brand
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sony"
                      value={formData.brand}
                      onChange={(e) => updateField("brand", e.target.value)}
                      className={inputCls(false)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      Category <span className="ml-1 text-[#C08A3E]">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className={inputCls(!!errors.category)}
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {loadingCategories && (
                      <p className="mt-1 text-[11px] text-[#9A9E96]">
                        Loading categories...
                      </p>
                    )}
                    {errors.category && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3" /> {errors.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price, Discount, Stock */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      Price ($) <span className="ml-1 text-[#C08A3E]">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="150"
                        value={formData.price}
                        onChange={(e) => updateField("price", e.target.value)}
                        className={`${inputCls(!!errors.price)} pl-10`}
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3" /> {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={formData.discount}
                      onChange={(e) => updateField("discount", e.target.value)}
                      className={inputCls(false)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      Stock <span className="ml-1 text-[#C08A3E]">*</span>
                    </label>
                    <div className="relative">
                      <Boxes className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="50"
                        value={formData.stock}
                        onChange={(e) => updateField("stock", e.target.value)}
                        className={`${inputCls(!!errors.stock)} pl-10`}
                      />
                    </div>
                    {errors.stock && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3" /> {errors.stock}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description + AI */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-xs font-bold text-slate-700">
                      Description <span className="ml-1 text-[#C08A3E]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={aiLoading}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {aiLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="h-3.5 w-3.5" />
                      )}
                      AI Generate
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    placeholder="Describe the product, its features, materials, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className={`${inputCls(!!errors.description)} resize-none leading-6`}
                  />
                  {errors.description && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" /> {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ───── Media ───── */}
            <section className="border border-[#DEDACE] bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#DEDACE] px-5 py-5 sm:px-7">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F2EC] text-[#C08A3E]">
                  <Layers size={15} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0E1B1B]">Media</h2>
                  <p className="text-xs text-[#6B7268]">
                    Add at least one product image
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="flex items-end gap-4">
                  <div className="w-40 shrink-0">
                    <ImageUploader
                      label="Add image"
                      sublabel="Upload or paste a URL"
                      value={pendingImage}
                      onChange={(url) => setPendingImage(url)}
                      aspectRatio="square"
                      idPrefix="new-product-image"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPendingImage}
                    disabled={!pendingImage.trim()}
                    className="mb-1 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {images.includes(pendingImage.trim()) ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <PlusCircle className="h-3.5 w-3.5" />
                    )}
                    Add to list
                  </button>
                </div>

                {images.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-3 text-xs font-bold text-slate-700">
                      Product images ({images.length})
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {images.map((img, idx) => (
                        <div
                          key={`${img}-${idx}`}
                          className="group relative h-24 w-24 overflow-hidden rounded-xl border border-[#DEDACE] bg-slate-100"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={`Product ${idx + 1}`}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="Remove image"
                          >
                            <X size={16} />
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 rounded bg-[#0E1B1B]/80 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.images && (
                  <p className="mt-3 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" /> {errors.images}
                  </p>
                )}
              </div>
            </section>

            {/* ───── Promotions ───── */}
            <section className="border border-[#DEDACE] bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#DEDACE] px-5 py-5 sm:px-7">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F2EC] text-[#C08A3E]">
                  <Sparkles size={15} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0E1B1B]">
                    Promotions
                  </h2>
                  <p className="text-xs text-[#6B7268]">
                    Optional featured and flash sale settings
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-7">
                <div className="flex flex-wrap gap-6">
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        updateField("isFeatured", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 accent-[#0E1B1B]"
                    />
                    Featured product
                  </label>

                  <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isFlashSale}
                      onChange={(e) =>
                        updateField("isFlashSale", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 accent-[#C08A3E]"
                    />
                    Include in flash sale
                  </label>
                </div>

                {formData.isFlashSale && (
                  <div className="grid grid-cols-1 gap-5 border border-[#EBE8DF] bg-[#F8F7F3] p-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-700">
                        Flash sale price ($){" "}
                        <span className="ml-1 text-[#C08A3E]">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="120"
                        value={formData.flashSalePrice}
                        onChange={(e) =>
                          updateField("flashSalePrice", e.target.value)
                        }
                        className={inputCls(!!errors.flashSalePrice)}
                      />
                      {errors.flashSalePrice && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors.flashSalePrice}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-700">
                        Flash sale end date{" "}
                        <span className="ml-1 text-[#C08A3E]">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.flashSaleEndDate}
                        onChange={(e) =>
                          updateField("flashSaleEndDate", e.target.value)
                        }
                        className={inputCls(!!errors.flashSaleEndDate)}
                      />
                      {errors.flashSaleEndDate && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors.flashSaleEndDate}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.isFeatured && (
                  <div className="flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-xs leading-5">
                      Featured products are highlighted on the home page. Keep
                      inventory and images top quality.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ───── Review ───── */}
            <section className="flex gap-4 border border-[#DEDACE] bg-[#F8F7F3] p-5 sm:p-7">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0E1B1B]">
                  Ready to publish?
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#6B7268]">
                  Your product will be created under{" "}
                  <strong className="text-[#0E1B1B]">{shop.name}</strong> and
                  sent for review before going live.
                </p>
              </div>
            </section>

            {/* ───── Actions ───── */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#DEDACE] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-[#9A9E96]">
                Fields marked <span className="text-[#C08A3E]">*</span> are
                required
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center justify-center gap-3 rounded-lg bg-[#0E1B1B] px-6 py-3.5 text-xs font-bold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating product...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Create product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
