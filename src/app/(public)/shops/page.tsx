"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Star,
  X,
  ArrowRight,
} from "lucide-react";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { CatalogProduct } from "@/lib/products/mockCatalog";

const PRODUCTS_PER_PAGE = 12;

// category can be a plain string, a populated { _id, name } object, or missing
function getCategoryLabel(product: CatalogProduct): string {
  if (!product.category) return "";
  if (typeof product.category === "object") {
    return product.category.name || "";
  }
  return product.category;
}

export default function ShopPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Categories list derived from fetched products
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      const label = getCategoryLabel(p);
      if (label) set.add(label);
    }
    return ["All", ...Array.from(set)];
  }, [products]);

  // Fetch all products once from the products API
  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        setLoading(true);

        if (API_URL) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(`${API_URL}/shops`, {
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));

          if (res.ok) {
            const data = await res.json();
            console.log(data);
            const fetched = data?.data;
            if (Array.isArray(fetched) && !cancelled) {
              setProducts(fetched);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Shop backend API fallback triggered:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  // Client-side filter + sort
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          getCategoryLabel(p).toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (p) => getCategoryLabel(p) === selectedCategory,
      );
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    if (minRating) {
      filtered = filtered.filter((p) => p.rating >= Number(minRating));
    }

    const sorted = [...filtered];
    if (sortBy === "price") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "popularity") {
      sorted.sort((a, b) => b.soldCount - a.soldCount);
    } else {
      sorted.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    return sorted;
  }, [
    products,
    search,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("latest");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const productCountByOwner = filteredProducts.reduce<Record<string, number>>(
    (acc, product) => {
      const ownerId = product.ownerId ?? "unknown";

      acc[ownerId] = (acc[ownerId] || 0) + 1;

      return acc;
    },
    {},
  );

  console.log(productCountByOwner);

  return (
    <main className="min-h-screen bg-gray-50 py-10 md:py-16 md:mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Controls Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              All Products & Deals
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Explore our curated store catalog with instant price filters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products..."
                className="w-full text-xs sm:text-sm border border-purple-100 rounded-xl pl-9 pr-4 py-2.5 bg-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
              />
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 bg-white border border-purple-100 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 lg:hidden hover:bg-purple-50/50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Sort products"
              className="bg-white border border-purple-100 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 outline-none focus:border-purple-600 transition-colors"
            >
              <option value="latest">Sort by: Newest</option>
              <option value="popularity">Sort by: Most Popular</option>
              <option value="rating">Sort by: Top Rated</option>
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white border border-purple-100 rounded-2xl p-5 sticky top-24 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-purple-50 pb-3">
              <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Category
              </h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? "bg-purple-600 text-white"
                        : "text-gray-600 hover:bg-purple-50/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-purple-50 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Price Range ($)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Min"
                  className="w-full text-xs border border-purple-100 rounded-lg px-2.5 py-2 outline-none focus:border-purple-600 transition-colors"
                />
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Max"
                  className="w-full text-xs border border-purple-100 rounded-lg px-2.5 py-2 outline-none focus:border-purple-600 transition-colors"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="border-t border-purple-50 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Minimum Rating
              </h4>
              <div className="space-y-2">
                {[4, 3, 2].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === String(rating)}
                      onChange={() => {
                        setMinRating(String(rating));
                        setCurrentPage(1);
                      }}
                      className="accent-purple-600"
                    />
                    <span className="flex items-center text-amber-500 font-bold">
                      {"★".repeat(rating)}
                      <span className="text-gray-300 font-normal">
                        {"☆".repeat(5 - rating)}
                      </span>
                    </span>
                    <span>& up</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : paginatedProducts.length === 0 ? (
              <EmptyState
                type="search"
                title="No Products Found"
                description="We couldn't find any products matching your selected search terms or price filters."
                actionText="Clear All Filters"
                onAction={clearFilters}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => {
                    return (
                      <div
                        key={product._id}
                        className="group bg-white rounded-2xl border border-purple-100 hover:border-purple-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
                      >
                        {/* Image Container */}
                        <div className="relative h-56 bg-purple-50/30 flex items-center justify-center p-4 overflow-hidden">
                          <Image
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.discount && product.discount > 0 && (
                            <span className="absolute top-3 left-3 bg-purple-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                              -{product.discount}%
                            </span>
                          )}
                        </div>

                        {/* Card Info */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400 font-medium">
                                {product.brand || "VenRaz"}
                              </span>
                              <div className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                {product.rating}
                              </div>
                            </div>
                            {/* FIXED: Changed from /product/ to /products/ matching app directory */}

                            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors">
                              {product.name}
                            </h3>
                            <p>Total Products: </p>
                          </div>

                          {/* Price and Visit Shop CTA */}
                          <div className="pt-3 border-t border-purple-50 flex items-center justify-between gap-3">
                            <div>
                              <span className="text-base font-black text-gray-900">
                                ${product?.flashSalePrice || product.price}
                              </span>
                              {product.discount && product.discount > 0 && (
                                <span className="text-xs text-gray-400 line-through block">
                                  ${product.price.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <Link
                              href={`/shop/${product?.ownerId || ""}`}
                              className="group/link inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-purple-600 hover:text-white bg-purple-50 hover:bg-purple-600 border border-purple-100 transition-all duration-200 cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Visit Shop</span>
                              <div className="grid place-items-center h-3.5 w-0 group-hover/link:w-3.5 opacity-0 group-hover/link:opacity-100 translate-y-2 group-hover/link:translate-y-0 transition-all duration-150 ease-out">
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                            currentPage === pageNum
                              ? "bg-purple-600 text-white shadow-sm"
                              : "bg-white border border-purple-100 text-gray-700 hover:bg-purple-50/50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-purple-50 pb-4">
                <h3 className="font-bold text-gray-900 text-base">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Category
                </h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? "bg-purple-600 text-white"
                          : "text-gray-600 hover:bg-purple-50/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="border-t border-purple-50 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Price ($)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Min"
                    className="w-full text-xs border border-purple-100 rounded-lg px-3 py-2 outline-none focus:border-purple-600 transition-colors"
                  />
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Max"
                    className="w-full text-xs border border-purple-100 rounded-lg px-3 py-2 outline-none focus:border-purple-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-purple-50 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-purple-700 transition-colors"
              >
                Apply Filters ({filteredProducts.length} Products)
              </button>
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full bg-purple-50 text-purple-700 py-2.5 rounded-xl font-semibold text-xs hover:bg-purple-100 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
