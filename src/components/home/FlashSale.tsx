"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Check,
  Flame,
  Heart,
  ArrowLeftRight,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

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
  flashSalePrice?: number;
};

type HomeSectionsData = {
  featured?: Product[];
  flashSale?: Product[];
  topRated?: Product[];
  mostSelling?: Product[];
  newArrivals?: Product[];
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: HomeSectionsData | Product[];
};

/* =========================================================
   FALLBACK IMAGE & HELPERS
   ========================================================= */

const FALLBACK_IMAGE = "/placeholder.svg";
const SALE_END_DATE = "2026-12-12T23:59:59";

function getProductImage(images?: string[]): string {
  const image = images?.[0];

  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (
    image.includes("example.com") ||
    image.includes("placehold.co") ||
    image.includes("placeholder")
  ) {
    return FALLBACK_IMAGE;
  }

  return image;
}

function getCountdown(targetDate: string) {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function getOldPrice(price: number, discount?: number) {
  if (!discount || discount <= 0 || discount >= 100) {
    return price;
  }
  return price / (1 - discount / 100);
}

function getRatingStars(rating = 0) {
  const roundedRating = Math.round(rating);
  return Array.from({ length: 5 }, (_, index) =>
    index < roundedRating ? "★" : "☆",
  );
}

/* =========================================================
   PRODUCT CARD COMPONENT
   ========================================================= */

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const { isWishlisted, toggleWishlist, pendingId, isAuthenticated } =
    useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const rating = Number(product.rating ?? 0);
  const stock = Number(product.stock ?? 0);
  const price = Number(product.flashSalePrice ?? product.price ?? 0);

  const oldPrice =
    product.flashSalePrice !== undefined && product.flashSalePrice !== null
      ? Number(product.price ?? 0)
      : getOldPrice(price, product.discount);

  const image = getProductImage(product.images);
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
    if (adding || added) return;
    setAdding(true);
    await addToCart(product, 1);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md shadow-purple-900/5 border border-purple-100"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative mx-2 mt-2 flex h-[243px] items-center justify-center overflow-hidden rounded-lg bg-[#FAF5FF]">
        <Image
          src={image}
          alt={product.name || "Product image"}
          fill
          className="h-[190px] w-[230px] object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized={
            image.startsWith("http://") || image.startsWith("https://")
          }
        />

        {/* DISCOUNT BADGE */}
        {product.discount !== undefined && product.discount > 0 && (
          <span className="absolute left-0 top-0 rounded-br-[16px] rounded-tl-[7px] bg-[#7E22CE] px-3 py-1 text-[14px] font-bold text-white shadow-sm">
            -{product.discount}%
          </span>
        )}

        {/* ACTION BUTTONS */}
        <div className="absolute right-3 top-3 flex translate-x-10 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleToggleWishlist}
            disabled={wishlistPending}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-colors ${
              wishlisted
                ? "bg-[#7E22CE] text-white"
                : "bg-white text-purple-900 hover:bg-[#7E22CE] hover:text-white"
            }`}
          >
            {wishlistPending ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Heart size={17} className={wishlisted ? "fill-current" : ""} />
            )}
          </motion.button>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/compare"
              aria-label="Compare product"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-purple-900 shadow-md transition-colors hover:bg-[#7E22CE] hover:text-white"
            >
              <ArrowLeftRight size={17} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/products/${product._id}`}
              aria-label="Quick view"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-purple-900 shadow-md transition-colors hover:bg-[#7E22CE] hover:text-white"
            >
              <Eye size={17} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <h3 className="min-h-[52px] text-[16px] font-semibold leading-[1.45] text-purple-950">
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
            className="flex gap-[1px] text-[19px] leading-none text-purple-600"
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
            <del className="text-[14px] text-purple-300">
              ${oldPrice.toFixed(2)}
            </del>
          )}
        </div>

        {/* STOCK STATUS */}
        <div className="mt-4 flex items-center gap-1.5 text-[13px]">
          <Check
            size={15}
            strokeWidth={1.8}
            className={stock > 0 ? "text-purple-600" : "text-rose-500"}
          />
          <span
            className={
              stock > 0 ? "text-purple-600 font-medium" : "text-rose-500"
            }
          >
            {stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
          {stock > 0 && (
            <span className="text-purple-950">{stock} Products</span>
          )}
        </div>

        {/* ADD TO CART BUTTON */}
        <motion.button
          whileTap={stock > 0 ? { scale: 0.98 } : {}}
          type="button"
          disabled={stock <= 0 || adding}
          onClick={handleAddToCart}
          className={`mt-5 flex h-[48px] w-full items-center justify-center rounded-lg border bg-transparent text-[15px] font-semibold uppercase transition-all duration-300 ${
            stock <= 0
              ? "cursor-not-allowed border-purple-200 text-purple-300"
              : added
                ? "border-purple-700 bg-[#7E22CE] text-white"
                : "border-purple-200 text-purple-900 hover:border-[#7E22CE] hover:bg-[#7E22CE] hover:text-white"
          }`}
        >
          {adding ? (
            <Loader2 size={18} className="animate-spin" />
          ) : added ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center"
            >
              <Check size={18} className="mr-1.5" />
              Added
            </motion.div>
          ) : stock <= 0 ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingBag size={18} className="mr-1.5" />
              Add To Cart
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* =========================================================
   MAIN FLASH SALE COMPONENT
   ========================================================= */

export default function FlashSale() {
  const swiperRef = useRef<SwiperType | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  /* FETCH FLASH SALE PRODUCTS */
  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const response = await fetch(`${apiUrl}/products/flash-sale`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        if (!result.success) {
          throw new Error(
            result.message || "Failed to load flash sale products",
          );
        }

        const data = result.data;
        let flashSaleProducts: Product[] = [];

        if (Array.isArray(data)) {
          flashSaleProducts = data;
        } else if (data && typeof data === "object") {
          flashSaleProducts = data.flashSale ?? [];
        }

        setProducts(flashSaleProducts);
      } catch (err: unknown) {
        console.warn("Flash Sale API call issue:", err);
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, []);

  /* COUNTDOWN TIMER */
  // useEffect(() => {
  //   setMounted(true);
  //   setTime(getCountdown(SALE_END_DATE));

  //   const interval = window.setInterval(() => {
  //     setTime(getCountdown(SALE_END_DATE));
  //   }, 1000);

  //   return () => window.clearInterval(interval);
  // }, []);

  return (
    <section className="overflow-hidden bg-[#FAF5FF] dark:bg-[#0b1325] rounded-2xl dark:text-white py-[60px] md:py-[70px]">
      <div className="mx-auto w-full max-w-[1860px] px-5 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-7 xl:flex-row xl:items-center">
          <div>
            <h2 className="text-[30px] font-bold leading-none text-purple-950 dark:text-white sm:text-[34px] md:text-[38px]">
              Flash Sale Today
            </h2>
            <div className="relative mt-5 h-[2px] w-[250px] bg-purple-200 sm:w-[308px]">
              <span className="absolute left-0 top-0 h-[2px] bg-[#7E22CE] sm:w-[172px]" />
            </div>
          </div>

          {/* TIMER & LINK */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div>
                <Flame
                  size={27}
                  strokeWidth={2.5}
                  className="fill-[#7E22CE] text-[#7E22CE] sm:h-[30px] sm:w-[30px]"
                />
              </div>
              <span className="text-[15px] font-semibold text-[#7E22CE] sm:text-[18px]">
                Hurry up! Sale end in:
              </span>
            </div>

            {/* COUNTDOWN BOXES WITH MOTION */}
            {[
              { label: "Days", val: time.days },
              { label: "Hours", val: time.hours },
              { label: "Mins", val: time.minutes },
              { label: "Secs", val: time.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex h-[52px] w-[57px] flex-col items-center justify-center rounded-lg bg-[#7E22CE] text-white shadow-md shadow-purple-300"
              >
                <AnimatePresence mode="popLayout">
                  <span className="text-[17px] font-bold leading-none">
                    {mounted ? String(unit.val).padStart(2, "0") : "00"}
                  </span>
                </AnimatePresence>
                <span className="mt-1 text-[12px]">{unit.label}</span>
              </div>
            ))}

            <Link
              href="/shop"
              className="ml-1 text-[16px] font-semibold text-purple-950 transition-colors hover:text-[#7E22CE] sm:text-[18px]"
            >
              Explore All
            </Link>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div>
              <Loader2 size={32} className="text-[#7E22CE]" />
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-rose-500">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-md bg-purple-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-[#7E22CE]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && products.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-lg text-purple-400">
              No flash sale products found.
            </p>
          </div>
        )}

        {/* SLIDER CONTENT */}
        {!loading && !error && products.length > 0 && (
          <div className="relative mt-8">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={1}
              spaceBetween={16}
              loop={products.length >= 7}
              speed={600}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 16 },
                480: { slidesPerView: 1, spaceBetween: 18 },
                640: { slidesPerView: 2, spaceBetween: 18 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 22 },
                1280: { slidesPerView: 5, spaceBetween: 22 },
                1536: { slidesPerView: 6, spaceBetween: 24 },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product._id} className="h-auto">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* PREVIOUS ARROW */}
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => swiperRef.current?.slidePrev()}
              className="group absolute left-[-18px] top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-purple-200 bg-white shadow-md transition-all duration-300 hover:bg-purple-950 md:flex lg:left-[-22px]"
            >
              <ChevronLeft
                size={26}
                strokeWidth={2}
                className="text-purple-950 transition-colors group-hover:text-white"
              />
            </button>

            {/* NEXT ARROW */}
            <button
              type="button"
              aria-label="Next products"
              onClick={() => swiperRef.current?.slideNext()}
              className="group absolute right-[-18px] top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-purple-200 bg-white shadow-md transition-all duration-300 hover:bg-purple-950 md:flex lg:right-[-22px]"
            >
              <ChevronRight
                size={26}
                strokeWidth={2}
                className="text-purple-950 transition-colors group-hover:text-white"
              />
            </button>
          </div>
        )}

        {/* MOBILE EXPLORE LINK */}
        <div className="mt-7 text-center md:hidden">
          <Link
            href="/shop"
            className="text-[17px] font-semibold text-purple-950 transition-colors hover:text-[#7E22CE]"
          >
            Explore All
          </Link>
        </div>
      </div>
    </section>
  );
}
