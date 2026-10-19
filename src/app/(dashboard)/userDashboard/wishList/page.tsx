"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Zap,
  Loader2,
  ArrowUpRight,
  PackageX,
  Trash2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

interface WishlistProduct {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discount?: number;
  flashSalePrice?: number;
  isFlashSale?: boolean;
  stock?: number;
  brand?: string;
}

const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export default function WishlistPage() {
  const { data: session } = useSession();
  const token = session?.session?.token;

  const { addToCart } = useCart();
  const { success, error } = useToast();

  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        throw new Error("API URL is not configured");
      }

      const res = await fetch(`${API_URL}/wishlist`, {
        headers: getAuthHeaders(token),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to load wishlist: ${res.status}`);
      }

      const json = await res.json();

      const products = Array.isArray(json?.data?.productIds)
        ? json.data.productIds
        : [];

      setWishlist(products);
    } catch (err) {
      console.error("Wishlist loading failed:", err);
      error("Could not load your wishlist. Please try again.", "Error");
    } finally {
      setLoading(false);
    }
  }, [token, error]);

  useEffect(() => {
    if (!token) {
      const timeoutId = window.setTimeout(() => {
        setWishlist([]);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      void loadWishlist();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [token, loadWishlist]);

  const handleRemove = async (productId: string) => {
    if (!token || removingId) return;

    const previous = wishlist;

    setRemovingId(productId);

    // Optimistic update
    setWishlist((prev) => prev.filter((item) => item._id !== productId));

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        throw new Error("API URL is not configured");
      }

      const res = await fetch(`${API_URL}/wishlist/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to remove item: ${res.status}`);
      }

      success("Item removed from your wishlist.", "Wishlist Updated");
    } catch (err) {
      console.error("Wishlist remove failed:", err);

      setWishlist(previous);

      error("Could not remove the item. Please try again.", "Error");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (product: WishlistProduct) => {
    addToCart(
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        flashSalePrice: product.flashSalePrice,
        discount: product.discount,
        stock: product.stock,
        images: product.images,
        brand: product.brand,
      },
      1,
    );

    success("Item added to your cart.", "Added to Cart");
  };

  const finalPrice = (product: WishlistProduct): number => {
    if (product.isFlashSale && typeof product.flashSalePrice === "number") {
      return product.flashSalePrice;
    }

    return product.price;
  };

  const inStock = (product: WishlistProduct): boolean =>
    typeof product.stock === "number" ? product.stock > 0 : true;

  return (
    <main className="min-h-screen bg-slate-50/50 px-4 py-8 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
              <Heart className="h-6 w-6 fill-purple-600/10" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                My Wishlist
              </h1>

              <p className="mt-0.5 text-xs text-gray-500">
                Products you&apos;ve saved to purchase later.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-purple-100 bg-purple-50/60 px-4 py-2 text-xs font-semibold text-purple-700 sm:self-center">
            <Heart className="h-4 w-4 fill-purple-600 text-purple-600" />
            <span>
              {loading
                ? "Loading..."
                : `${wishlist.length} ${
                    wishlist.length === 1 ? "saved item" : "saved items"
                  }`}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-purple-100 bg-white px-6 py-20 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />

            <p className="mt-3 text-sm font-medium text-gray-500">
              Loading your saved items...
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && wishlist.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item) => {
              const price = finalPrice(item);
              const available = inStock(item);

              const hasDiscount =
                typeof item.discount === "number" && item.discount > 0;

              const hasFlashSale =
                item.isFlashSale && typeof item.flashSalePrice === "number";

              return (
                <article
                  key={item._id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative">
                      <Link
                        href={`/products/${item._id}`}
                        className="relative block h-60 overflow-hidden bg-purple-50/30"
                      >
                        {item.images?.[0] ? (
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <PackageX className="h-10 w-10 text-purple-200" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                          {available ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 backdrop-blur-sm shadow-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-rose-700 backdrop-blur-sm shadow-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              Out of Stock
                            </span>
                          )}

                          {hasDiscount && (
                            <span className="inline-flex items-center rounded-lg bg-purple-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-purple-600/30">
                              -{item.discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Flash Sale Badge */}
                        {hasFlashSale && (
                          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800 backdrop-blur-sm shadow-sm">
                            <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
                            Flash Sale
                          </span>
                        )}
                      </Link>

                      {/* Quick Delete Button */}
                      <button
                        type="button"
                        aria-label="Remove from wishlist"
                        onClick={() => void handleRemove(item._id)}
                        disabled={removingId === item._id}
                        className="absolute right-3 bottom-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-purple-100 bg-white/90 text-rose-500 backdrop-blur-sm shadow-sm transition-all hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {removingId === item._id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Information */}
                    <div className="p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                        {item.brand || "VenRaz"}
                      </p>

                      <Link href={`/products/${item._id}`}>
                        <h2 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-gray-900 transition-colors hover:text-purple-600">
                          {item.name}
                        </h2>
                      </Link>

                      {/* Price Section */}
                      <div className="mt-4 flex items-baseline justify-between gap-2 border-t border-purple-100/60 pt-3">
                        <div>
                          <p className="text-xl font-extrabold tracking-tight text-gray-900">
                            ${price.toFixed(2)}
                          </p>

                          {(hasDiscount || hasFlashSale) && (
                            <p className="text-xs text-gray-400 line-through">
                              ${item.price.toFixed(2)}
                            </p>
                          )}
                        </div>

                        <span className="text-[11px] font-medium text-emerald-600">
                          Free Shipping
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => handleAddToCart(item)}
                      className="group/btn relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-150 hover:bg-purple-700 shadow-sm shadow-purple-600/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
                    >
                      {available ? (
                        <>
                          {/* Standard Text */}
                          <span className="transition-transform duration-150 group-hover/btn:-translate-y-8">
                            Add to Cart
                          </span>

                          {/* Hover Cart Icon Animation (Bottom to Top) */}
                          <span className="absolute flex items-center justify-center translate-y-8 transition-transform duration-150 ease-out group-hover/btn:translate-y-0">
                            <ShoppingCart className="h-4 w-4" />
                          </span>
                        </>
                      ) : (
                        "Out of Stock"
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && wishlist.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-purple-100 bg-white px-6 py-20 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
              <Heart className="h-8 w-8 stroke-1 fill-purple-600/10" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-sm text-xs leading-5 text-gray-500">
              Explore our catalogue to save your favorite products and purchase
              them later.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-purple-700 shadow-sm shadow-purple-600/20"
            >
              Explore Products
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
