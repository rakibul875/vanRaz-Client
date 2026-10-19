"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  images?: string[];
  price: number;
  discount?: number;
  stock?: number;
  brand?: string;
  rating?: number;
  totalReviews?: number;
  soldCount?: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const image = product.images?.[0] || "/placeholder.svg";

  const hasDiscount =
    typeof product.discount === "number" && product.discount > 0;

  const finalPrice =
    product.isFlashSale && typeof product.flashSalePrice === "number"
      ? product.flashSalePrice
      : product.price;

  const oldPrice = hasDiscount ? product.price : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-purple-100/80 bg-white shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 sm:rounded-3xl">
      <Link href={`/products/${product._id}`} className="flex flex-1 flex-col">
        {/* Product Image Box */}
        <div className="relative aspect-square w-full flex-shrink-0 overflow-hidden bg-purple-50/30 p-2 sm:p-4">
          <Image
            src={image}
            alt={product.name || "Product"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain rounded-xl transition-transform duration-300 group-hover:scale-105 sm:rounded-2xl"
          />

          {/* Discount Badge */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 sm:top-3 sm:left-3">
            {hasDiscount && (
              <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:px-2.5 sm:py-1 sm:text-xs">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Flash Sale / Featured Badges */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 sm:top-3 sm:right-3">
            {product.isFlashSale ? (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:px-2.5 sm:py-1 sm:text-xs">
                Flash
              </span>
            ) : product.isFeatured ? (
              <span className="rounded-full bg-purple-900 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:px-2.5 sm:py-1 sm:text-xs">
                Featured
              </span>
            ) : null}
          </div>
        </div>

        {/* Card Body */}
        <div className="flex w-full flex-grow flex-col justify-between gap-2 p-3 sm:gap-4 sm:p-5">
          <div className="w-full space-y-1 sm:space-y-2">
            {/* Brand + Rating */}
            <div className="flex w-full items-center justify-between gap-1">
              <span className="truncate text-[10px] font-medium tracking-wider text-gray-500 uppercase sm:text-xs">
                {product.brand || "VenRaz"}
              </span>

              <span className="flex flex-shrink-0 items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 sm:text-xs">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {product.rating ?? 4.8}
              </span>
            </div>

            {/* Product Name */}
            <h3 className="line-clamp-2 pt-0.5 text-xs font-semibold leading-snug text-gray-900 transition-colors group-hover:text-purple-600 sm:text-base sm:font-bold">
              {product.name}
            </h3>

            {/* Reviews */}
            {typeof product.totalReviews === "number" && (
              <p className="text-[10px] text-gray-400 sm:text-xs">
                {product.totalReviews} reviews
              </p>
            )}
          </div>

          {/* Footer & Add to Cart */}
          <div className="mt-auto w-full border-t border-purple-50 pt-2 sm:pt-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-3">
              {/* Price */}
              <div className="flex items-baseline gap-1.5 sm:flex-col sm:gap-0">
                <span className="text-sm font-extrabold text-gray-900 sm:text-xl">
                  ${finalPrice.toFixed(2)}
                </span>
                {oldPrice !== undefined && (
                  <span className="text-[10px] text-gray-400 line-through sm:text-xs">
                    ${oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`group/btn relative overflow-hidden flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 sm:px-4 sm:py-2.5 ${
                  added
                    ? "bg-emerald-600"
                    : "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                } disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none`}
                aria-label="Add to cart"
              >
                {added ? (
                  <>
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    {/* Animated Shopping Bag Icon (Moves bottom -> top fast on hover) */}
                    <div className="grid place-items-center h-4 w-0 group-hover/btn:w-4 opacity-0 group-hover/btn:opacity-100 translate-y-3 group-hover/btn:translate-y-0 transition-all duration-150 ease-out">
                      <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>

                    <span className="hidden xs:inline sm:inline">
                      Add to Cart
                    </span>
                    <span className="xs:hidden sm:hidden">Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
