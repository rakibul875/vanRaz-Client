"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingCart,
  Check,
} from "lucide-react";

import "swiper/css";
import { Button } from "@heroui/react";
import { useCart } from "@/context/CartContext";

type Product = {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discount?: number;
  rating?: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: {
    featured: Product[];
    flashSale: Product[];
    topRated: Product[];
    mostSelling: Product[];
    newArrivals: Product[];
  };
};

/* =========================================================
   PRODUCT IMAGE HELPER
   ========================================================= */

const getProductImage = (images?: string[]) => {
  const image = images?.[0];

  if (!image || image.includes("example.com")) {
    return "/placeholder.svg";
  }

  return image;
};

/* =========================================================
   RATING STARS
   ========================================================= */

const getRatingStars = (rating = 0) => {
  const roundedRating = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) =>
    index < roundedRating ? "★" : "☆",
  ).join("");
};

/* =========================================================
   INDIVIDUAL PRODUCT CARD COMPONENT
   ========================================================= */

function FeaturedProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const rating = product.rating ?? 0;
  const imageUrl = getProductImage(product.images);

  const handleAddToCart = async () => {
    if (adding || added) return;
    setAdding(true);
    await addToCart(product, 1);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="m-4 flex min-h-[500px] flex-col items-center rounded-2xl border border-purple-100 bg-white p-6 shadow-md shadow-purple-900/5 sm:p-8 dark:border-purple-900/40 dark:bg-slate-900 md:flex-row md:p-[25px]">
      {/* IMAGE */}
      <div className="relative h-full w-full shrink-0 overflow-hidden rounded-xl bg-purple-50/70 dark:bg-slate-800 md:h-[450px] md:w-[53%]">
        <Image
          src={imageUrl}
          alt={product.name || "Product image"}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 53vw, 450px"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          priority={false}
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col justify-center pl-7 md:pl-10">
        {/* Product Name */}
        <h3 className="max-w-[350px] text-[19px] font-bold leading-[1.45] text-purple-950 dark:text-purple-100 md:text-[23px]">
          <Link
            href={`/shop-details/${product._id}`}
            className="transition-colors hover:text-purple-600 dark:hover:text-purple-400"
          >
            {product.name}
          </Link>
        </h3>

        {/* RATING */}
        <div className="mt-3 flex flex-wrap items-center gap-3 md:gap-4">
          <span
            className="whitespace-nowrap text-[18px] tracking-[1px] text-amber-400 md:text-[20px]"
            aria-label={`Rated ${rating} out of 5`}
          >
            {getRatingStars(rating)}
          </span>

          <span className="whitespace-nowrap text-[13px] text-purple-900/60 dark:text-purple-300/60 md:text-[14px]">
            ({rating} rating)
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[19px] font-bold text-purple-950 dark:text-purple-100 md:text-[21px]">
            ${Number(product.price || 0).toFixed(2)}
          </span>

          {product.discount && product.discount > 0 && (
            <del className="text-[13px] text-purple-900/40 dark:text-purple-300/40 md:text-[14px]">
              ${(product.price / (1 - product.discount / 100)).toFixed(2)}
            </del>
          )}
        </div>

        {/* ADD TO CART BUTTON (With Loading & Bottom-to-Top Hover Effect) */}
        <Button
          onClick={handleAddToCart}
          isDisabled={adding}
          className="group/btn relative mt-8 flex h-[51px] w-full items-center justify-center overflow-hidden rounded-xl bg-purple-950 px-6 text-[14px] font-bold uppercase tracking-wide text-white shadow-lg shadow-gray-500 transition-all duration-300 hover:bg-purple-600 disabled:opacity-70 md:px-7 dark:bg-purple-600 dark:hover:bg-purple-500"
        >
          {/* 1. Loading State */}
          {adding ? (
            <div className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span>ADDING...</span>
            </div>
          ) : added ? (
            /* 2. Success State */
            <div className="flex items-center gap-2 text-emerald-300">
              <Check size={18} />
              <span>ADDED!</span>
            </div>
          ) : (
            /* 3. Normal State + Bottom to Top Animation */
            <>
              {/* Default Text (Slides Up) */}
              <span className="transition-transform duration-300 ease-out group-hover/btn:-translate-y-12">
                ADD TO CART
              </span>

              {/* Hover Icon + Text (Slides Up from Bottom) */}
              <span className="absolute flex translate-y-12 items-center justify-center gap-2 transition-transform duration-300 ease-out group-hover/btn:translate-y-0">
                <ShoppingCart size={18} />
                <span>ADD TO CART</span>
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN FEATURED PRODUCTS SECTION
   ========================================================= */

export default function FeaturedProducts() {
  const swiperRef = useRef<SwiperType | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* FETCH FEATURED PRODUCTS */
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured in .env.local",
          );
        }

        const response = await fetch(`${apiUrl}/products/home-sections`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch products. Status: ${response.status}`,
          );
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to load featured products.",
          );
        }

        setProducts(result.data?.featured || []);
      } catch (error) {
        console.error("Featured Products Error:", error);

        setError("Failed to load featured products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  /* LOADING STATE */
  if (loading) {
    return (
      <section
        id="shop-sec"
        className="w-full overflow-hidden bg-purple-50/40 py-10 dark:bg-slate-950 md:py-14"
      >
        <div className="mx-auto w-full max-w-[1800px] px-7 md:px-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="inline-block px-0.5 pt-1 text-[30px] font-bold leading-[1.15] text-purple-950 dark:text-purple-100 md:text-[40px]">
                Featured Products
              </h2>

              <div className="h-[2.5px] w-[172px] bg-purple-600" />
            </div>

            <Link
              href="/shop"
              className="mb-3 hidden text-[18px] font-semibold text-purple-950 transition-colors hover:text-purple-600 dark:text-purple-200 dark:hover:text-purple-400 md:block md:text-[23px]"
            >
              Explore All
            </Link>
          </div>

          <div className="h-[1px] w-full bg-purple-100 dark:bg-purple-900/40" />

          <div className="flex min-h-[500px] items-center justify-center">
            <p className="text-lg text-purple-900/60 dark:text-purple-300/60">
              Loading products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* MAIN RENDER */
  return (
    <section
      id="shop-sec"
      className="w-full overflow-hidden bg-purple-50/40 py-10 dark:bg-slate-950 md:py-14"
    >
      <div className="mx-auto w-full max-w-[1800px] px-7 md:px-10">
        {/* HEADER */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="inline-block px-0.5 pt-1 text-[30px] font-bold leading-[1.15] text-purple-950 dark:text-purple-100 md:text-[40px]">
              Featured Products
            </h2>

            <div className="h-[2.5px] w-[172px] bg-purple-600" />
          </div>

          <Link
            href="/shop"
            className="mb-3 hidden text-[18px] font-semibold text-purple-950 transition-colors hover:text-purple-600 dark:text-purple-200 dark:hover:text-purple-400 md:block md:text-[23px]"
          >
            Explore All
          </Link>
        </div>

        {/* Purple Header Line */}
        <div className="h-[1px] w-full bg-purple-100 dark:bg-purple-900/40" />

        {/* ERROR STATE */}
        {error && (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-rose-500">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && products.length === 0 && (
          <div className="flex min-h-[500px] items-center justify-center">
            <p className="text-lg text-purple-900/60 dark:text-purple-300/60">
              No featured products found.
            </p>
          </div>
        )}

        {/* SLIDER */}
        {!error && products.length > 0 && (
          <div className="relative mt-8">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={1}
              spaceBetween={24}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 1 },
                1200: { slidesPerView: 2 },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product._id}>
                  <FeaturedProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* PREVIOUS BUTTON */}
            <button
              type="button"
              aria-label="Previous product"
              onClick={() => swiperRef.current?.slidePrev()}
              className="group absolute -left-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-purple-100 bg-white shadow-md shadow-purple-900/10 transition-all duration-300 hover:bg-purple-600 dark:border-purple-800 dark:bg-slate-800 dark:hover:bg-purple-600 md:flex"
            >
              <ChevronLeft
                size={24}
                strokeWidth={2.5}
                className="text-purple-950 transition-colors group-hover:text-white dark:text-purple-100"
              />
            </button>

            {/* NEXT BUTTON */}
            <button
              type="button"
              aria-label="Next product"
              onClick={() => swiperRef.current?.slideNext()}
              className="group absolute -right-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-purple-100 bg-white shadow-md shadow-purple-900/10 transition-all duration-300 hover:bg-purple-600 dark:border-purple-800 dark:bg-slate-800 dark:hover:bg-purple-600 md:flex"
            >
              <ChevronRight
                size={24}
                strokeWidth={2.5}
                className="text-purple-950 transition-colors group-hover:text-white dark:text-purple-100"
              />
            </button>
          </div>
        )}

        {/* MOBILE EXPLORE */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/shop"
            className="text-base font-semibold text-purple-950 hover:text-purple-600 dark:text-purple-200"
          >
            Explore All
          </Link>
        </div>
      </div>
    </section>
  );
}
