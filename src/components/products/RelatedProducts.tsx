"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

interface RelatedProductsProps {
  productId: string;
  categoryId?: string;
  categoryName?: string;
}

interface RelatedProduct {
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
  category?: string | { _id?: string; name?: string };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RelatedProducts({
  productId,
  categoryId,
  categoryName,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRelated = async () => {
      setLoading(true);
      try {
        const category = categoryId || categoryName || "";
        let list: RelatedProduct[] = [];

        if (API_URL && category) {
          const res = await fetch(
            `${API_URL}/products?category=${encodeURIComponent(category)}&limit=9`,
            { cache: "no-store" },
          );
          if (res.ok) {
            const result = await res.json();
            list = result?.data?.products || result?.products || [];
          }
        }

        if (cancelled) return;

        // Fallback: match mock catalog by category label
        // if (!list.length && categoryName) {
        //   list = MOCK_PRODUCTS.filter((p) => {
        //     const label =
        //       typeof p.category === "object" ? p.category?.name : p.category;
        //     return label && label.toLowerCase() === categoryName.toLowerCase();
        //   });
        // }

        setProducts(list.filter((p) => String(p._id) !== String(productId)));
      } catch (err) {
        console.error("Related products fetch error:", err);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRelated();

    return () => {
      cancelled = true;
    };
  }, [productId, categoryId, categoryName]);

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            Related Products
          </h2>
          {categoryName && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              You might also like these
            </p>
          )}
        </div>
        <Link
          href={`/products?category=${encodeURIComponent(categoryName || "")}`}
          className="group/link inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors shrink-0"
        >
          <span>View All</span>
          <div className="grid place-items-center h-4 w-0 group-hover/link:w-4 opacity-0 group-hover/link:opacity-100 translate-y-3 group-hover/link:translate-y-0 transition-all duration-150 ease-out">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-purple-50/50 border border-purple-100 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-purple-100 rounded-3xl bg-purple-50/10">
          <Loader2 className="w-8 h-8 text-purple-300 animate-spin" />
          <p className="mt-3 text-xs sm:text-sm text-gray-500">
            No related products found right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
