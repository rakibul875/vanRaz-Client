"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Star,
  Minus,
  Plus,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import EmptyState from "@/components/common/EmptyState";
import ReviewsSection from "@/components/products/ReviewsSection";
import RelatedProducts from "@/components/products/RelatedProducts";
import { trackCategoryVisit } from "@/utils/categoryTracker";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  image?: string;
  images?: string[];
  category?: string | { _id?: string; name?: string; [key: string]: unknown };
  brand?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  totalReviews?: number;
};

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        if (API_URL) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const res = await fetch(`${API_URL}/products/${id}`, {
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));

          if (res.ok) {
            const data = await res.json();
            const productData = data?.data || data;

            if (productData && productData._id) {
              setProduct(productData);
              const img =
                productData.images?.[0] ||
                productData.image ||
                "/placeholder.svg";
              setSelectedImage(img);
              return;
            }
          }
        }

        setProduct(null);
      } catch (err) {
        console.error("Product fetch error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, API_URL]);

  useEffect(() => {
    const cat =
      typeof product?.category === "object" && product?.category !== null
        ? product.category._id
        : typeof product?.category === "string"
          ? product.category
          : undefined;
    if (cat) {
      trackCategoryVisit(cat);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!product || buying) return;
    setBuying(true);
    try {
      await addToCart(product, quantity);
      router.push("/checkout");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 animate-pulse md:grid-cols-2">
            <div className="h-[450px] rounded-3xl bg-purple-100/40" />
            <div className="space-y-6">
              <div className="h-8 w-3/4 rounded bg-purple-100/40" />
              <div className="h-6 w-1/3 rounded bg-purple-100/40" />
              <div className="h-24 w-full rounded bg-purple-100/40" />
              <div className="h-12 w-1/2 rounded bg-purple-100/40" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white py-20">
        <EmptyState
          type="general"
          title="Product Not Found"
          description="The product you are looking for might have been removed or is temporarily unavailable."
          actionText="Back to Products"
          actionHref="/products"
        />
      </main>
    );
  }

  const finalPrice = product.discountPrice || product.price;
  const isOutOfStock = product.stock === 0;

  const categoryObj =
    typeof product.category === "object" && product.category !== null
      ? (product.category as { _id?: string; name?: string })
      : null;
  const categoryId =
    categoryObj?._id ||
    (typeof product.category === "string" ? product.category : undefined);
  const categoryName =
    categoryObj?.name ||
    (typeof product.category === "string" ? product.category : undefined);
  const reviewCount = product.reviews || product.totalReviews || 0;

  return (
    <main className="min-h-screen bg-[#FAF5FF] dark:bg-[#0b1325] pt-10 pb-16 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 transition hover:text-purple-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-2">
          {/* Gallery Image */}
          <div className="flex flex-col items-center">
            <div className="relative aspect-square max-h-[500px] w-full max-w-[500px] overflow-hidden rounded-2xl border border-purple-100 bg-purple-50/30 p-8 flex items-center justify-center">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt={product.name}
                width={500}
                height={500}
                priority
                className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Brand */}
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold tracking-wider text-purple-700 uppercase">
                  {product.brand || "VenRaz Original"}
                </span>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating || 0}</span>
                  <span className="text-xs text-gray-400">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="mb-4 text-2xl font-extrabold leading-snug text-gray-900 sm:text-3xl">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-3xl font-black text-purple-600 sm:text-4xl">
                  ${finalPrice.toFixed(2)}
                </span>
                {product.discount && product.discount > 0 && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isOutOfStock
                      ? "bg-red-50 text-red-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                </span>
              </div>

              {/* Description */}
              <p className="mb-8 border-t border-purple-100 pt-6 text-xs sm:text-sm leading-relaxed text-gray-600">
                {product.description ||
                  "No description provided for this product."}
              </p>

              {/* Trust Badges */}
              <div className="mb-8 grid grid-cols-3 gap-3 border-y border-purple-100 py-5 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="mb-1 h-5 w-5 text-purple-600" />
                  <span className="text-[11px] font-medium text-gray-600">
                    Fast Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="mb-1 h-5 w-5 text-purple-600" />
                  <span className="text-[11px] font-medium text-gray-600">
                    Authentic Guarantee
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="mb-1 h-5 w-5 text-purple-600" />
                  <span className="text-[11px] font-medium text-gray-600">
                    7 Days Return
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity Control */}
              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-purple-100 bg-purple-50/30">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-3 text-gray-700 transition hover:bg-purple-100/50 disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 text-xs sm:text-sm font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={isOutOfStock}
                  className="p-3 text-gray-700 transition hover:bg-purple-100/50 disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`group/btn relative overflow-hidden flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-xl py-4 px-6 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 ${
                    added
                      ? "bg-emerald-600"
                      : "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                  } disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none`}
                >
                  {added ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <div className="grid place-items-center h-5 w-0 group-hover/btn:w-5 opacity-0 group-hover/btn:opacity-100 translate-y-3 group-hover/btn:translate-y-0 transition-all duration-150 ease-out">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <span>
                        Add to Cart (${(finalPrice * quantity).toFixed(2)})
                      </span>
                    </>
                  )}
                </button>

                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || buying}
                  className="group/btn relative overflow-hidden flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-xl bg-purple-900 py-4 px-6 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-purple-900/20 transition-all duration-200 hover:bg-purple-950 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                >
                  {buying ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Redirecting...</span>
                    </>
                  ) : (
                    <>
                      <div className="grid place-items-center h-5 w-0 group-hover/btn:w-5 opacity-0 group-hover/btn:opacity-100 translate-y-3 group-hover/btn:translate-y-0 transition-all duration-150 ease-out">
                        <Zap className="h-5 w-5" />
                      </div>
                      <span>
                        Buy Now (${(finalPrice * quantity).toFixed(2)})
                      </span>
                    </>
                  )}
                </button>
              </div>

              {added && (
                <div className="pt-2">
                  <Link
                    href="/cart"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 underline"
                  >
                    View Shopping Cart & Checkout &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews + Related Products */}
        <ReviewsSection
          productId={product._id}
          initialRating={product.rating}
          initialTotalReviews={reviewCount}
        />

        <RelatedProducts
          productId={product._id}
          categoryId={categoryId}
          categoryName={categoryName}
        />
      </div>
    </main>
  );
}
