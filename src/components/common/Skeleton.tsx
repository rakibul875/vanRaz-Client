import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden h-full flex flex-col w-full animate-pulse">
      {/* Image Skeleton */}
      <div className="h-64 w-full bg-slate-200" />
      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4 w-full">
        <div className="space-y-3 w-full">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-12" />
          </div>
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded w-20" />
          <div className="h-8 bg-slate-200 rounded-lg w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 animate-pulse">
      <div className="w-20 h-20 bg-slate-200 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-1/4" />
        <div className="h-4 bg-slate-200 rounded w-16" />
      </div>
      <div className="w-24 h-8 bg-slate-200 rounded-lg" />
      <div className="w-16 h-5 bg-slate-200 rounded" />
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-48 mb-6" />
        <CartItemSkeleton />
        <CartItemSkeleton />
        <CartItemSkeleton />
      </div>
      <div className="bg-slate-100 rounded-2xl p-6 h-80 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-36" />
        <div className="space-y-2 pt-4">
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
        </div>
        <div className="h-12 bg-slate-300 rounded-xl mt-6" />
      </div>
    </div>
  );
}
