"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  ArrowLeftRight,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  Watch,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useCart } from "@/context/CartContext";

/* =========================================================
   TYPES
========================================================= */

type Product = {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discount?: number;
  rating?: number;
  stock?: number;
};

type HomeSectionsResponse = {
  success: boolean;
  message?: string;
  data?: {
    featured?: Product[];
    flashSale?: Product[];
    topRated?: Product[];
    mostSelling?: Product[];
    newArrivals?: Product[];
  };
};

/* =========================================================
   FALLBACK IMAGE
========================================================= */

const FALLBACK_IMAGE = "/placeholder.svg";

/* =========================================================
   GET PRODUCT IMAGE
========================================================= */

function getProductImage(images?: string[]) {
  const image = images?.[0];

  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (image.includes("example.com")) {
    return FALLBACK_IMAGE;
  }

  return image;
}

/* =========================================================
   OLD PRICE
========================================================= */

function getOldPrice(price: number, discount?: number) {
  if (!discount || discount <= 0 || discount >= 100) {
    return price;
  }

  return price / (1 - discount / 100);
}

/* =========================================================
   RATING
========================================================= */

function getRatingStars(rating = 0) {
  const rounded = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) => (index < rounded ? "★" : "☆"));
}

/* =========================================================
   PRODUCT CARD
========================================================= */

export function ProductCard({ product }: { product: Product }) {
  const rating = product.rating ?? 0;
  const stock = product.stock ?? 0;
  const router = useRouter();
  const price = Number(product.price || 0);
  const { addToCart } = useCart();
  const oldPrice = getOldPrice(price, product.discount);

  // State for Add To Cart loading & success feedback
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const image = getProductImage(product.images);

  const { isWishlisted, toggleWishlist, pendingId, isAuthenticated } =
    useWishlist();

  const wishlisted = isWishlisted(product._id);
  const wishlistPending = pendingId === product._id;

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    void toggleWishlist(product._id);
  };

  const handleAddToCart = async () => {
    if (adding || added || stock <= 0) return;
    setAdding(true);
    await addToCart(product, 1);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-purple-100 bg-white p-4 shadow-sm shadow-purple-900/5 transition-shadow hover:shadow-md hover:shadow-purple-950/10"
    >
      {/* =================================================
          IMAGE & BADGES
      ================================================= */}
      <div className="relative flex h-[230px] items-center justify-center overflow-hidden rounded-lg bg-[#FAF5FF]">
        <Image
          src={image}
          alt={product.name || "Product image"}
          fill
          className="h-[200px] w-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* DISCOUNT */}
        {product.discount !== undefined && product.discount > 0 && (
          <span className="absolute left-0 top-0 rounded-br-xl bg-[#7E22CE] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            -{product.discount}%
          </span>
        )}

        {/* =================================================
            ACTION BUTTONS (WISHLIST / COMPARE / QUICK VIEW)
        ================================================= */}
        <div className="absolute right-3 top-3 flex translate-x-10 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          {/* Wishlist */}
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleToggleWishlist}
            disabled={wishlistPending}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-colors ${
              wishlisted
                ? "bg-[#7E22CE] text-white"
                : "bg-white text-purple-950 hover:bg-[#7E22CE] hover:text-white"
            }`}
          >
            {wishlistPending ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Heart size={17} className={wishlisted ? "fill-current" : ""} />
            )}
          </button>

          {/* Compare */}
          <Link
            href="/compare"
            aria-label="Compare product"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-purple-950 shadow-md transition hover:bg-[#7E22CE] hover:text-white"
          >
            <ArrowLeftRight size={17} />
          </Link>

          {/* Quick View */}
          <Link href={`/products/${product._id}`}>
            <button
              type="button"
              aria-label="Quick view"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-purple-950 shadow-md transition hover:bg-[#7E22CE] hover:text-white"
            >
              <Eye size={17} />
            </button>
          </Link>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}
      <div className="flex flex-1 flex-col pt-4">
        {/* PRODUCT NAME */}
        <h3 className="min-h-[48px] text-[15px] font-semibold leading-6 text-purple-950">
          <Link
            href={`/shop-details/${product._id}`}
            className="transition-colors hover:text-[#7E22CE]"
          >
            {product.name}
          </Link>
        </h3>

        {/* RATING */}
        <div className="mt-2 flex items-center gap-3">
          <div
            className="flex gap-[1px] text-[16px] leading-none text-amber-500"
            aria-label={`Rated ${rating} out of 5`}
          >
            {getRatingStars(rating).map((star, index) => (
              <span key={index}>{star}</span>
            ))}
          </div>
          <span className="text-[13px] text-purple-400">({rating})</span>
        </div>

        {/* PRICE */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[17px] font-bold text-purple-950">
            ${price.toFixed(2)}
          </span>

          {product.discount !== undefined && product.discount > 0 && (
            <del className="text-[13px] text-purple-300">
              ${oldPrice.toFixed(2)}
            </del>
          )}
        </div>

        {/* STOCK STATUS */}
        <div className="mt-3 flex items-center gap-1.5 text-[13px]">
          <Check
            size={15}
            strokeWidth={2}
            className={stock > 0 ? "text-emerald-600" : "text-rose-500"}
          />
          <span className={stock > 0 ? "text-emerald-600" : "text-rose-500"}>
            {stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
          {stock > 0 && <span className="text-purple-950">({stock})</span>}
        </div>

        {/* =================================================
            ADD TO CART BUTTON (With Hover & Loading Effects)
        ================================================= */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || stock <= 0}
          className="group/btn relative mt-5 flex h-10 w-full items-center justify-center overflow-hidden rounded-lg bg-purple-950 text-[13px] font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-300 hover:bg-[#7E22CE] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {/* 1. Loading State */}
          {adding ? (
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Adding...</span>
            </div>
          ) : added ? (
            /* 2. Added Success State */
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Check size={16} />
              <span>Added!</span>
            </div>
          ) : (
            /* 3. Normal State + Bottom to Top Hover Effect */
            <>
              {/* Default Text (Slides up on Hover) */}
              <span className="transition-transform duration-300 ease-out group-hover/btn:-translate-y-10">
                Add To Cart
              </span>

              {/* Hover Cart Icon + Text Container (Slides in from Bottom) */}
              <span className="absolute flex translate-y-10 items-center justify-center gap-2 transition-transform duration-300 ease-out group-hover/btn:translate-y-0">
                <ShoppingCart size={16} />
                <span>Add To Cart</span>
              </span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SmartWatches() {
  /* =======================================================
     STATES
  ======================================================= */

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     SWIPER REF
  ======================================================= */

  const swiperRef = useRef<SwiperType | null>(null);

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const response = await fetch(`${apiUrl}/products/home-sections`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const result: HomeSectionsResponse = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to load products");
        }

        const featuredProducts = result.data?.featured ?? [];

        setProducts(featuredProducts);
      } catch (err) {
        console.error("Smart Watches Error:", err);
        setError("Failed to load smart watch products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section className="overflow-hidden bg-[#FAF5FF] dark:bg-[#0b1325] py-16">
        <div className="mx-auto max-w-[1860px] px-5 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[26px] font-bold text-purple-950 sm:text-[30px]">
              Shop By Smart Watches
            </h2>

            <Link
              href="/shop"
              className="border-b-2 border-purple-700 pb-1 text-[15px] font-semibold text-[#7E22CE]"
            >
              Explore All
            </Link>
          </div>

          <div className="mt-10 flex min-h-[300px] items-center justify-center">
            <p className="text-purple-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <section className="overflow-hidden bg-[#FAF5FF] dark:bg-[#0b1325] py-16">
        <div className="mx-auto max-w-[1860px] px-5 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[26px] font-bold text-purple-950 sm:text-[30px]">
              Shop By Smart Watches
            </h2>

            <Link
              href="/shop"
              className="border-b-2 border-purple-700 pb-1 text-[15px] font-semibold text-[#7E22CE]"
            >
              Explore All
            </Link>
          </div>

          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-rose-500">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-purple-950 px-5 py-2 text-sm font-medium text-white hover:bg-[#7E22CE]"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (products.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF5FF] via-purple-50/30 to-white py-20 dark:from-[#0b1325] dark:via-[#0f1a32] dark:to-[#0b1325]">
        {/* Subtle Background Glow Decorative Elements */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-200/40 blur-3xl dark:bg-purple-900/20" />

        <div className="mx-auto max-w-[1860px] px-6 lg:px-12">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-between gap-4 border-b border-purple-100/80 pb-6 sm:flex-row sm:items-end dark:border-purple-900/30">
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                Next-Gen Wearables
              </span>
              <h2 className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-purple-100 dark:to-purple-300 sm:text-4xl">
                Shop By Smart Watches
              </h2>
            </div>

            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full border border-purple-200/60 bg-white/60 px-5 py-2.5 text-sm font-semibold text-purple-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-purple-400 hover:bg-purple-600 hover:text-white hover:shadow-md dark:border-purple-800/40 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-600 dark:hover:text-white"
            >
              <span>Explore All</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Empty State / Product Area */}
          <div className="mt-12 flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-purple-200/80 bg-white/50 p-8 text-center shadow-sm backdrop-blur-sm dark:border-purple-800/40 dark:bg-purple-950/10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 shadow-inner dark:bg-purple-900/40 dark:text-purple-300">
              <Watch className="h-8 w-8 stroke-[1.5]" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-purple-950 dark:text-purple-100">
              No Smart Watches Available
            </h3>
            <p className="mt-1 max-w-sm text-sm text-purple-600/80 dark:text-purple-300/70">
              We are currently updating our collection. Please check back soon
              for the latest models.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN RETURN
  ======================================================= */

  return (
    <section className="overflow-hidden bg-[#FAF5FF] dark:bg-[#0b1325] py-16 px-4">
      <div className="mx-auto max-w-[1860px] px-5 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          {/* TITLE */}

          <div>
            <h2 className="text-center text-[26px] font-bold leading-tight text-purple-950 sm:text-left sm:text-[30px] dark:text-white">
              Shop By Smart Watches
            </h2>
          </div>

          {/* EXPLORE */}

          <div className="text-center sm:text-right">
            <Link
              href="/shop"
              className="inline-block border-b-2 border-purple-700 pb-1 text-[15px] font-semibold text-[#7E22CE] transition hover:border-purple-950 hover:text-purple-950"
            >
              Explore All
            </Link>
          </div>
        </div>

        {/* BOTTOM LINE */}

        <div className="mt-5 h-px w-full bg-purple-200/80" />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* =================================================
              PRODUCT SLIDER
          ================================================= */}

          <div className="min-w-0 xl:col-span-9 2xl:col-span-10">
            <div className="relative">
              {/* PREVIOUS BUTTON */}

              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous products"
                className="absolute -left-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-purple-200 bg-white text-purple-950 shadow-md transition hover:bg-[#7E22CE] hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>

              {/* NEXT BUTTON */}

              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next products"
                className="absolute -right-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-purple-200 bg-white text-purple-950 shadow-md transition hover:bg-[#7E22CE] hover:text-white"
              >
                <ChevronRight size={20} />
              </button>

              {/* =================================================
                  SWIPER
              ================================================= */}

              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                spaceBetween={20}
                slidesPerView={1}
                loop={products.length > 5}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                  },
                  480: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 18,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  992: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1200: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1300: {
                    slidesPerView: 4,
                    spaceBetween: 22,
                  },
                  1500: {
                    slidesPerView: 5,
                    spaceBetween: 24,
                  },
                }}
                className="!py-3"
              >
                {products.map((product) => (
                  <SwiperSlide key={product._id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* =================================================
              COLLECTION BANNER
          ================================================= */}

          <div className="xl:col-span-3 2xl:col-span-2">
            <div className="group relative h-full min-h-[450px] overflow-hidden rounded-xl border border-purple-100 bg-white shadow-sm shadow-purple-900/5">
              {/* IMAGE */}

              <Image
                src="/assets/collection_1_4.jpg"
                alt="Apple Watch Series 9"
                fill
                sizes="(max-width: 1280px) 100vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-transparent to-purple-950/60" />

              {/* CONTENT */}

              <div className="absolute left-6 top-7 z-10">
                <h3 className="max-w-[220px] text-[22px] font-bold leading-7 text-white">
                  Apple Watch Series 9 GPS 41mm
                </h3>

                <h4 className="mt-3 text-[20px] font-extrabold text-[#C084FC]">
                  30% Off
                </h4>

                <Link
                  href="/shop"
                  className="mt-5 inline-block border-b-2 border-white pb-1 text-sm font-semibold text-white transition hover:border-[#C084FC] hover:text-[#C084FC]"
                >
                  Shop now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
