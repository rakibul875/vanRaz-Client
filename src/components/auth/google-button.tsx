"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

export function GoogleButton({
  loading,
  loadingText,
  children,
  ...rest
}: {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      type={rest.type ?? "button"}
      disabled={loading || rest.disabled}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#DEDACE] bg-white px-4 py-3 text-[15px] font-medium text-[#14181B] transition hover:bg-[#F5F4EF] focus:outline-none focus:ring-4 focus:ring-[#0E1B1B]/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.83h5.39a4.6 4.6 0 0 1-2 3.02v2.49h3.23c1.89-1.74 2.98-4.31 2.98-7.32z"
        />
        <path
          fill="#34A853"
          d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.49c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H1.09v2.57A10 10 0 0 0 10 20z"
        />
        <path
          fill="#FBBC05"
          d="M4.41 11.91a6 6 0 0 1 0-3.82V5.52H1.09a10 10 0 0 0 0 8.96l3.32-2.57z"
        />
        <path
          fill="#EA4335"
          d="M10 3.96c1.47 0 2.79.5 3.83 1.5L16.7 2.6A9.97 9.97 0 0 0 10 0a10 10 0 0 0-8.91 5.52l3.32 2.57C5.2 5.72 7.4 3.96 10 3.96z"
        />
      </svg>
      {loading ? loadingText ?? "Please wait…" : children}
    </button>
  );
}