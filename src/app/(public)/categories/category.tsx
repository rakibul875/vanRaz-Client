"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shirt,
  Smartphone,
  Home,
  Sparkles,
  ShoppingBag,
  Tag,
  RefreshCw,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug?: string;
  icon?: string;
  image?: string;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async (isCancelled?: () => boolean) => {
    setLoading(true);
    try {
      if (!API_URL) {
        if (!isCancelled?.()) {
          setError(
            "API endpoint is not configured. Please set NEXT_PUBLIC_API_URL.",
          );
        }
        return;
      }

      const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to load categories (${res.status})`);
      }

      const result = await res.json();
      const list = result?.data ?? result?.categories ?? [];

      if (!isCancelled?.()) {
        setCategories(Array.isArray(list) ? list : []);
        setError("");
      }
    } catch (err) {
      if (!isCancelled?.()) {
        setError(
          err instanceof Error ? err.message : "Failed to load categories",
        );
      }
    } finally {
      if (!isCancelled?.()) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchCategories(() => cancelled);

    return () => {
      cancelled = true;
    };
  }, [fetchCategories]);

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="relative overflow-hidden border-b border-purple-100/60 dark:border-purple-950/40 bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-950 pb-20 pt-28">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-purple-200/30 dark:bg-purple-900/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-purple-300/20 dark:bg-purple-800/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200/60 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 shadow-sm">
              Explore Collections
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Discover Products by{" "}
              <span className="block bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 dark:from-purple-400 dark:via-purple-300 dark:to-purple-500 bg-clip-text text-transparent">
                Category & Specialty
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              Explore our meticulously organized categories to quickly find
              verified products from trusted vendors across the VenRaz
              multi-vendor marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          CATEGORIES LISTING SECTION
      ========================= */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-purple-100 dark:border-purple-950 pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                Shop By Category
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                All Available Categories
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Select a department below to view corresponding curated
                products.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 transition hover:gap-3 hover:text-purple-700 dark:hover:text-purple-300"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-2xl border border-purple-100 dark:border-purple-950 bg-purple-50/40 dark:bg-purple-950/20 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-purple-100/60 dark:bg-purple-900/40" />
                    <div className="h-8 w-8 rounded-full bg-purple-100/60 dark:bg-purple-900/40" />
                  </div>
                  <div className="mt-8 h-5 w-2/3 rounded bg-purple-100/60 dark:bg-purple-900/40" />
                  <div className="mt-3 h-4 w-5/6 rounded bg-purple-100/40 dark:bg-purple-900/20" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                <Tag className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {error}
              </p>
              <button
                type="button"
                onClick={() => fetchCategories()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 transition hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && categories.length === 0 && (
            <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 py-20 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-400">
                <Tag className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">
                No Categories Found
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                No active product categories are currently available. Check back
                soon!
              </p>
            </div>
          )}

          {/* Categories Grid */}
          {!loading && !error && categories.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group"
                >
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-purple-100/80 dark:border-purple-950/60 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl hover:shadow-purple-600/5">
                    <div>
                      {/* Icon Container & Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900 text-purple-600 dark:text-purple-400 transition-colors duration-300 group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-600">
                          {category.icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={category.icon}
                              alt=""
                              className="h-6 w-6 object-contain"
                            />
                          ) : (
                            <Tag className="h-6 w-6" />
                          )}
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all duration-300 group-hover:bg-purple-50 dark:group-hover:bg-purple-950 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white transition-colors duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {category.name}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                        {category.description ||
                          "Browse top-tier products listed under this category."}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Explore category &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          FEATURED PROMO BANNER
      ========================= */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 dark:from-purple-950 dark:via-purple-900 dark:to-slate-950 text-white shadow-xl shadow-purple-900/10">
            <div className="grid items-center lg:grid-cols-2">
              {/* Content */}
              <div className="p-8 sm:p-12 lg:p-16">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                  <Sparkles className="h-6 w-6 text-purple-300" />
                </div>

                <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
                  Discover Quality Essentials
                  <span className="block text-purple-200">Across VenRaz</span>
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-purple-100/80 sm:text-base">
                  From trendy fashion lines and high-tech gadgets to daily
                  essentials, find top deals directly from verified merchants.
                </p>

                <Link
                  href="/products"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white dark:bg-purple-700 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-white shadow-md transition-all hover:bg-purple-50 dark:hover:bg-purple-600 hover:shadow-lg"
                >
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Right Visual Graphic */}
              <div className="hidden h-full min-h-[360px] items-center justify-center bg-purple-950/40 dark:bg-slate-950/40 p-8 lg:flex">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1">
                    <Shirt className="h-12 w-12 text-purple-200" />
                  </div>

                  <div className="mt-6 flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1">
                    <Smartphone className="h-12 w-12 text-purple-200" />
                  </div>

                  <div className="-mt-6 flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1">
                    <Home className="h-12 w-12 text-purple-200" />
                  </div>

                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1">
                    <ShoppingBag className="h-12 w-12 text-purple-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          BOTTOM CTA
      ========================= */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Looking for something specific?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Browse our complete catalog with advanced filter controls or search
            keywords to locate exact products.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-purple-600/20 transition-all hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
          >
            Browse All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
