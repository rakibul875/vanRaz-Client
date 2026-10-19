import React from "react";
import Link from "next/link";
import { ShoppingBag, SearchX, PackageX, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  type?: "cart" | "search" | "general";
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  type = "general",
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto">
      <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 flex items-center justify-center text-purple-400 shadow-inner">
        {type === "cart" && <ShoppingBag className="w-12 h-12 stroke-[1.5]" />}
        {type === "search" && <SearchX className="w-12 h-12 stroke-[1.5]" />}
        {type === "general" && <PackageX className="w-12 h-12 stroke-[1.5]" />}
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-8 max-w-sm leading-relaxed">
        {description}
      </p>

      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-purple-500 hover:bg-black text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-red-500/20 transition-all duration-200"
        >
          {actionText || "Continue Shopping"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {onAction && !actionHref && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-purple-500 hover:bg-black text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-red-500/20 transition-all duration-200"
        >
          {actionText || "Action"}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
