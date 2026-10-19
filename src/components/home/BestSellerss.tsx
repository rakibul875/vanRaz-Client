"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  data?: HomeSectionsData;
};

type Category = {
  id: string;
  name: string;
  products: Product[];
};

/* =========================================================
   FALLBACK IMAGE
   ========================================================= */

const FALLBACK_IMAGE = "/placeholder.svg";

/* =========================================================
   PRODUCT IMAGE HELPER
   ========================================================= */

function getProductImage(images?: string[]) {
  const image = images?.[0];

  if (!image || image.includes("example.com")) {
    return FALLBACK_IMAGE;
  }

  return image;
}

/* =========================================================
   OLD PRICE CALCULATION
   ========================================================= */

function getOldPrice(price: number, discount?: number) {
  if (!discount || discount <= 0 || discount >= 100) {
    return price;
  }

  return price / (1 - discount / 100);
}

/* =========================================================
   PRODUCT CARD COMPONENT (WHITE & PURPLE)
   ========================================================= */

function ProductCard({ product }: { product: Product }) {
  const price = Number(product.price || 0);
  const rating = Number(product.rating || 0);
  const oldPrice = getOldPrice(price, product.discount);

  const initialImage = getProductImage(product.images);
  const [imgSrc, setImgSrc] = useState(initialImage);

  useEffect(() => {
    setImgSrc(initialImage);
  }, [initialImage]);

  return (
    <div className="group flex min-h-[190px] items-center gap-4 rounded-2xl border border-purple-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5 sm:gap-6 md:gap-8 dark:border-purple-900/40 dark:bg-slate-900">
      {/* Product Image Wrapper */}
      <div className="relative flex h-[130px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-purple-50/70 sm:h-[145px] sm:w-[145px] dark:bg-slate-800">
        <Image
          src={imgSrc}
          alt={product.name || "Product image"}
          width={150}
          height={150}
          unoptimized={imgSrc.startsWith("http")}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="h-[105px] w-[105px] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105 sm:h-[120px] sm:w-[120px] md:h-[125px] md:w-[125px]"
        />
      </div>

      {/* Product Information */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {/* Name */}
        <h3 className="line-clamp-2 max-w-[330px] text-[14px] font-semibold leading-[1.55] text-purple-950 sm:text-[15px] dark:text-purple-100">
          <Link
            href={`/shop-details/${product._id}`}
            className="transition-colors hover:text-purple-600 dark:hover:text-purple-400"
          >
            {product.name}
          </Link>
        </h3>

        {/* Rating Stars */}
        <div className="mt-2 flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center text-[16px] leading-none text-amber-400 sm:text-[18px]"
            aria-label={`Rated ${rating} out of 5`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index}>{index < Math.round(rating) ? "★" : "☆"}</span>
            ))}
          </div>

          <span className="text-[12px] font-medium text-purple-900/60 sm:text-[13px] dark:text-purple-300/60">
            ({rating.toFixed(1)})
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
          <span className="text-[17px] font-bold text-purple-950 sm:text-[20px] dark:text-white">
            ${price.toFixed(2)}
          </span>

          {product.discount && product.discount > 0 ? (
            <del className="text-[13px] font-medium text-purple-400/70 sm:text-[14px] dark:text-slate-500">
              ${oldPrice.toFixed(2)}
            </del>
          ) : null}
        </div>

        {/* Stock */}
        <div className="mt-2 text-[12px] font-semibold text-emerald-600 sm:mt-3 sm:text-[13px] dark:text-emerald-400">
          {product.stock && product.stock > 0
            ? `In Stock • ${product.stock} available`
            : "Out of Stock"}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON COMPONENT
   ========================================================= */

function ProductSkeleton() {
  return (
    <div className="flex min-h-[190px] animate-pulse items-center gap-4 rounded-2xl border border-purple-100 bg-white p-4 sm:gap-6 dark:border-purple-900/30 dark:bg-slate-900">
      <div className="h-[130px] w-[120px] shrink-0 rounded-xl bg-purple-100/60 sm:h-[145px] sm:w-[145px] dark:bg-slate-800" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-3/4 rounded bg-purple-100/60 dark:bg-slate-800" />
        <div className="h-3 w-1/2 rounded bg-purple-100/60 dark:bg-slate-800" />
        <div className="h-5 w-1/3 rounded bg-purple-100/60 dark:bg-slate-800" />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN BEST SELLERS COMPONENT
   ========================================================= */

export default function BestSellers() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("best-deals");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     FETCH API DATA
     ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const response = await fetch(`${apiUrl}/products/home-sections`);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to load products");
        }

        const data = result.data || {};

        const dynamicCategories: Category[] = [
          {
            id: "best-deals",
            name: "Best Deals",
            products: data.featured || [],
          },
          {
            id: "phones",
            name: "Phones & Tablets",
            products: data.mostSelling || [],
          },
          {
            id: "laptops",
            name: "Laptops & Computers",
            products: data.newArrivals || [],
          },
          {
            id: "video",
            name: "Video & Audios",
            products: data.topRated || [],
          },
          {
            id: "accessories",
            name: "Accessories",
            products: data.flashSale || [],
          },
          {
            id: "cameras",
            name: "Cameras",
            products: data.featured || [],
          },
        ];

        if (isMounted) {
          setCategories(dynamicCategories);
        }
      } catch (err: unknown) {
        console.error("Best Sellers Error:", err);
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load products.",
          );
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategory =
    categories.find((category) => category.id === activeTab) || categories[0];

  return (
    <section className="w-full overflow-hidden bg-purple-50/40 py-12 lg:py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-[1860px] px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          {/* Title */}
          <div className="relative shrink-0">
            <h2 className="text-[32px] font-bold leading-tight tracking-tight text-purple-950 sm:text-[40px] dark:text-purple-100">
              Best Sellers
            </h2>
            <div className="relative mt-3 h-[2.5px] w-[237px] bg-purple-100 dark:bg-slate-800">
              <span className="absolute left-0 top-0 h-[2.5px] w-[173px] bg-purple-600" />
            </div>
          </div>

          {/* Category Tabs */}
          <div
            className="flex flex-wrap items-center justify-start gap-2.5 xl:justify-end"
            role="tablist"
          >
            {categories.map((category) => {
              const isActive = activeTab === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(category.id)}
                  className={`rounded-xl border px-4 py-2.5 text-[14px] font-semibold whitespace-nowrap transition-all duration-200 sm:text-[15px] ${
                    isActive
                      ? "border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-500/20"
                      : "border-purple-100 bg-white text-purple-950 hover:border-purple-300 hover:text-purple-600 dark:border-purple-900/40 dark:bg-slate-900 dark:text-purple-100"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-6 text-center dark:border-purple-900/40 dark:bg-purple-950/20">
            <div>
              <p className="text-base font-medium text-purple-900 dark:text-purple-200">
                {error}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          (!activeCategory || activeCategory.products.length === 0) && (
            <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-white p-6 text-center dark:border-purple-900/40 dark:bg-slate-900">
              <p className="text-sm font-medium text-purple-900/60 dark:text-purple-300/60">
                No products found for this section.
              </p>
            </div>
          )}

        {/* Product Grid */}
        {!loading &&
          !error &&
          activeCategory &&
          activeCategory.products.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:grid-cols-3">
              {activeCategory.products.slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
      </div>
    </section>
  );
}
