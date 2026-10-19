"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, PackageSearch } from "lucide-react";

interface SearchProduct {
  _id: string;
  name: string;
  images?: string[];
  image?: string;
  price: number;
  discount?: number;
  isFlashSale?: boolean;
  flashSalePrice?: number;
}

const API = process.env.NEXT_PUBLIC_API_URL;

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close the modal on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Clear pending debounce timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    const keyword = value.trim();
    if (!keyword) {
      setProducts([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);
    timerRef.current = setTimeout(async () => {
      try {
        if (!API) {
          setProducts([]);
          return;
        }
        const res = await fetch(
          `${API}/products?search=${encodeURIComponent(keyword)}&limit=6`,
        );
        const json = await res.json();
        setProducts(json?.data?.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const clearSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQuery("");
    setProducts([]);
    setLoading(false);
    setOpen(false);
  };

  const finalPrice = (p: SearchProduct) =>
    p.isFlashSale && typeof p.flashSalePrice === "number"
      ? p.flashSalePrice
      : p.price;

  const hasResults = products.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none  absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search products..."
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-[#ff594d] focus:bg-white focus:ring-2 focus:ring-[#ff594d]/20"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Modal dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8">
              <Loader2 className="h-5 w-5 animate-spin text-[#ff594d]" />
              <span className="text-sm text-gray-500">Searching...</span>
            </div>
          ) : query.trim() && hasResults ? (
            <>
              <ul className="max-h-80 overflow-y-auto">
                {products.map((p) => (
                  <li key={p._id}>
                    <Link
                      href={`/products/${p._id}`}
                      onClick={clearSearch}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={p.images?.[0] || p.image || "/placeholder.svg"}
                          alt={p.name || "Product"}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {p.name}
                        </p>
                        <p className="text-sm font-bold text-[#ff594d]">
                          ${finalPrice(p).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/products?search=${encodeURIComponent(query.trim())}`}
                onClick={clearSearch}
                className="block border-t border-gray-100 px-4 py-3 text-center text-sm font-semibold text-[#ff594d] transition hover:bg-gray-50"
              >
                View all results
              </Link>
            </>
          ) : (
            !loading && (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <PackageSearch className="h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-600">
                  No products found
                </p>
                <p className="text-xs text-gray-400">
                  Try a different search keyword.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
