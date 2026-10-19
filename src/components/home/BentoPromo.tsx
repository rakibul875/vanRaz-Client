"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowUpRight, Star, Flame } from "lucide-react";
import { motion } from "framer-motion";

const PRODUCTS = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80",
    alt: "Audio Device",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80",
    alt: "Earbuds",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=300&q=80",
    alt: "Smart Headset",
  },
];

const AVATARS = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    alt: "User 1",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    alt: "User 2",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    alt: "User 3",
  },
];

export default function BentoPromoSection() {
  return (
    <section className="w-full bg-purple-50/50 py-12 transition-colors duration-300 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* ================= CARD 1: MORE PRODUCTS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="relative flex flex-col justify-between rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md dark:border-purple-900/40 dark:bg-slate-900 md:col-span-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-purple-950 dark:text-purple-100">
                  More Products
                </h3>
                <p className="mt-1 text-sm font-medium text-purple-700/70 dark:text-purple-300/70">
                  460 plus items
                </p>
              </div>

              {/* Heart Badge */}
              <button
                type="button"
                aria-label="Add to favorites"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50 text-purple-600 transition-all hover:bg-purple-100 active:scale-95 dark:bg-purple-950/60 dark:text-purple-300"
              >
                <Heart className="h-5 w-5 fill-purple-600 dark:fill-purple-300" />
              </button>
            </div>

            {/* Product Thumbnails */}
            <div className="mt-8 flex items-center justify-between gap-3">
              {PRODUCTS.map((item) => (
                <div
                  key={item.id}
                  className="relative flex aspect-square flex-1 items-center justify-center overflow-hidden rounded-2xl bg-purple-50/80 dark:bg-purple-950/40"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 30vw, 10vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ================= CARD 2: DOWNLOADS & REVIEWS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="relative flex flex-col items-center justify-between rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md dark:border-purple-900/40 dark:bg-slate-900 md:col-span-3"
          >
            {/* User Avatars */}
            <div className="flex -space-x-2 overflow-hidden">
              {AVATARS.map((avatar) => (
                <Image
                  key={avatar.id}
                  width={48}
                  height={48}
                  className="inline-block h-12 w-12 rounded-full border-2 border-white object-cover ring-2 ring-purple-100 dark:border-slate-900 dark:ring-purple-900/50"
                  src={avatar.src}
                  alt={avatar.alt}
                />
              ))}
            </div>

            {/* Purple Stats Circle */}
            <div className="my-5 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-purple-700 to-purple-500 text-white shadow-lg shadow-purple-500/25">
              <span className="text-2xl font-black leading-tight">5m+</span>
              <span className="text-[11px] font-medium opacity-90">
                Downloads
              </span>
            </div>

            {/* Review Badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50/60 px-4 py-1.5 shadow-sm dark:border-purple-900/50 dark:bg-purple-950/50">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-purple-950 dark:text-purple-200">
                4.6 reviews
              </span>
            </div>
          </motion.div>

          {/* ================= CARD 3: FEATURED BANNER ================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="relative flex min-h-[220px] overflow-hidden rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md dark:border-purple-900/40 dark:bg-slate-900 md:col-span-5"
          >
            {/* Left Column Content */}
            <div className="z-10 flex w-1/2 flex-col justify-between pr-2">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/80 bg-purple-50/80 px-3 py-1 backdrop-blur-md dark:border-purple-800 dark:bg-purple-950/80">
                  <Flame className="h-3.5 w-3.5 fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400" />
                  <span className="text-xs font-semibold text-purple-900 dark:text-purple-200">
                    Popular
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold leading-snug tracking-tight text-purple-950 dark:text-purple-100">
                  Listening Has Been Released
                </h3>
              </div>

              {/* Overlapping Audio Avatars */}
              <div className="mt-4 flex -space-x-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white ring-2 ring-purple-100 dark:border-slate-900 dark:ring-purple-900/50">
                  <Image
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80"
                    alt="Audio Gear"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white ring-2 ring-purple-100 dark:border-slate-900 dark:ring-purple-900/50">
                  <Image
                    src="https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=150&q=80"
                    alt="Headphones"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column Image & Overlay Action */}
            <div className="relative w-1/2 overflow-hidden rounded-2xl bg-purple-50 dark:bg-purple-950/40">
              <Image
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
                alt="Product in Hand"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-500 hover:scale-105"
              />

              {/* Arrow Link Button */}
              <Link
                href="/shop"
                aria-label="Explore Product"
                className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-purple-950 shadow-md transition-transform hover:scale-110 active:scale-95 dark:bg-purple-950 dark:text-purple-100"
              >
                <ArrowUpRight className="h-5 w-5" />
              </Link>

              {/* Rating Chip */}
              <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 backdrop-blur-md shadow-sm dark:bg-slate-900/90">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-purple-950 dark:text-purple-100">
                  4.7
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
