"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, ArrowLeft, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { CatalogProduct } from "@/lib/products/mockCatalog";
import { Button } from "@heroui/react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function ShopDetailPage() {
  const { id: shopId } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  // console.log(shopId);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  console.log(products);

  useEffect(() => {
    if (!shopId) return;

    let cancelled = false;

    async function loadShopProducts() {
      try {
        setLoading(true);

        if (API_URL) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const res = await fetch(
            `${API_URL}/shops/my-shop/${shopId}`,
            {},
          ).finally(() => clearTimeout(timeoutId));

          if (res.ok) {
            const data = await res.json();
            const fetched = data?.data?.products;

            console.log("Products:", fetched);
            if (Array.isArray(fetched) && !cancelled) {
              setProducts(fetched);
              return;
            }
          }
        }

        if (!cancelled) {
          setProducts([]);
        }
      } catch (err) {
        console.warn("Shop products API fallback:", err);
        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadShopProducts();

    return () => {
      cancelled = true;
    };
  }, [shopId, API_URL]);

  const handleAddToCart = (e: React.MouseEvent, product: CatalogProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 md:py-16 md:mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Products
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Shop Products
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            All curated products available from this shop.
          </p>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <EmptyState
            type="search"
            title="No Products Found"
            description="This shop does not have any active products listed right now."
            actionText="Browse All Products"
            actionHref="/shop"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => {
              const displayPrice = product.flashSalePrice || product.price;
              const isAdded = addedIds[product._id];

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl border border-purple-100 hover:border-purple-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-80 bg-purple-50/30 flex items-center justify-center p-4 overflow-hidden">
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
                      <Link href={`/product/${product._id}`}>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-3 border-t border-purple-50 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-base font-black text-gray-900">
                          ${displayPrice.toFixed(2)}
                        </span>
                        {product.discount && product.discount > 0 && (
                          <span className="text-xs text-gray-400 line-through block">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <Button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                          isAdded
                            ? "bg-green-600 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
