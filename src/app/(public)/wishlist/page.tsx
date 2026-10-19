"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Loader2,
  LogIn,
  ShoppingCart,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { useWishlist, WishlistProduct } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { data: session } = useSession();
  const token = session?.session?.token;
  const { addToCart } = useCart();
  const { items: wishlist, loading, pendingId, removeFromWishlist } =
    useWishlist();

  const handleRemove = (productId: string) => {
    void removeFromWishlist(productId);
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
    <div className="min-h-screen bg-[#fcfdfd] pb-16 pt-10 md:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#ff594d]/10 px-3 py-1 text-xs font-bold text-[#ff594d]">
              <Heart className="h-3.5 w-3.5 fill-current" />
              YOUR FAVORITES
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              My Wishlist
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {token
                ? loading
                  ? "Loading..."
                  : `${wishlist.length} ${wishlist.length === 1 ? "item" : "items"} saved`
                : "Sign in to see the items you saved."}
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Not Signed In */}
        {!token && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff594d]/10">
              <LogIn className="h-8 w-8 text-[#ff594d]" />
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                Sign in to view your wishlist
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Save products you love and find them here anytime.
              </p>
            </div>

            <Link
              href="/login"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#ff594d] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#ff594d]/20 transition hover:bg-black"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </div>
        )}

        {/* Loading */}
        {token && loading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-16 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff594d]" />
            <p className="text-sm font-semibold">Loading your wishlist...</p>
          </div>
        )}

        {/* Products */}
        {token && !loading && wishlist.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((item) => {
              const price = finalPrice(item);
              const hasDiscount =
                typeof item.discount === "number" && item.discount > 0;
              const available = inStock(item);
              const image = item.images?.[0];
              const isRemoving = pendingId === item._id;

              return (
                <div
                  key={item._id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#ff594d]/30 hover:shadow-xl"
                >
                  <div className="relative p-4">
                    {/* Image */}
                    <Link
                      href={`/products/${item._id}`}
                      className="relative mb-4 block flex h-44 items-center justify-center overflow-hidden rounded-xl bg-[#f3f6f5]"
                    >
                      {image ? (
                        <Image
                          src={image}
                          alt={item.name}
                          fill
                          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized={
                            image.startsWith("http://") ||
                            image.startsWith("https://")
                          }
                        />
                      ) : (
                        <span className="text-xs font-medium text-slate-400">
                          Product Image
                        </span>
                      )}

                      {/* Remove */}
                      <button
                        type="button"
                        aria-label="Remove from wishlist"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(item._id);
                        }}
                        disabled={isRemoving}
                        className="absolute right-3 top-3 z-10 rounded-full border border-slate-100 bg-white/90 p-2 shadow-sm backdrop-blur transition-all hover:scale-110 hover:bg-rose-500 hover:text-white disabled:opacity-50"
                      >
                        {isRemoving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>

                      {/* Stock Badge */}
                      <div className="absolute left-3 top-3">
                        {available ? (
                          <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/20">
                            In Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-800/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                            Sold Out
                          </span>
                        )}
                      </div>

                      {/* Discount Badge */}
                      {hasDiscount && (
                        <span className="absolute bottom-3 left-3 rounded-full bg-[#ff594d] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          -{item.discount}% OFF
                        </span>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff594d]">
                        {item.brand || "VenRaz"}
                      </p>

                      <Link href={`/products/${item._id}`} className="block">
                        <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-[#ff594d]">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-black text-[#ff594d]">
                            ${price.toFixed(2)}
                          </p>
                          {hasDiscount && (
                            <p className="text-xs text-slate-400 line-through">
                              ${item.price.toFixed(2)}
                            </p>
                          )}
                        </div>

                        <span className="text-xs font-medium text-slate-400">
                          Free shipping
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        disabled={!available}
                        onClick={() => handleAddToCart(item)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#ff594d] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {available ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {token && !loading && wishlist.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
            <Heart className="h-10 w-10 text-slate-300" />
            <p className="text-base font-bold text-slate-900">
              Your wishlist is empty.
            </p>
            <p className="text-sm text-slate-500">
              Got your eye on something? Save it here and it will show up below.
            </p>

            <Link
              href="/shop"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#ff594d] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#ff594d]/20 transition hover:bg-black"
            >
              Continue Shopping <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}