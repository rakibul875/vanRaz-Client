"use client";

import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Heart,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="relative overflow-hidden border-b border-purple-100/60 dark:border-purple-950/40 bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-950 pb-20 pt-28">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-purple-200/30 dark:bg-purple-900/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-purple-300/20 dark:bg-purple-800/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200/60 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 shadow-sm">
                <ShoppingBag className="h-4 w-4" />
                About VenRaz
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Multi-Vendor E-Commerce
                <span className="block bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 dark:from-purple-400 dark:via-purple-300 dark:to-purple-500 bg-clip-text text-transparent">
                  Made Simple & Seamless
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                Welcome to VenRaz, a next-generation multi-vendor e-commerce
                platform. We connect independent merchants, verified vendors,
                and buyers in one unified marketplace.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-purple-600/25 transition hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 shadow-sm transition hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-purple-100/50 dark:bg-purple-900/10 blur-2xl pointer-events-none" />

                <div className="relative rounded-[2rem] bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-900 dark:to-purple-950 p-8 shadow-2xl shadow-purple-900/20">
                  <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors duration-300">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900 text-purple-600 dark:text-purple-400">
                      <ShoppingBag className="h-10 w-10" />
                    </div>

                    <h3 className="mt-6 text-center text-xl font-extrabold text-slate-900 dark:text-white">
                      Your Premier Multi-Vendor
                    </h3>

                    <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
                      E-Commerce Marketplace Partner
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 p-4 text-center">
                        <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                          10K+
                        </p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Products
                        </p>
                      </div>

                      <div className="rounded-2xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 p-4 text-center">
                        <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                          5K+
                        </p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Happy Shoppers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          OUR STORY
      ========================= */}
      <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Visual Grid */}
            <div className="relative order-2 lg:order-1">
              <div className="rounded-3xl border border-purple-100/80 dark:border-purple-950/60 bg-gradient-to-b from-purple-50/40 to-white dark:from-purple-950/20 dark:to-slate-900 p-6 sm:p-10 shadow-sm">
                <div className="grid grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-purple-100/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                      Verified Vendors
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Safe & trustworthy merchants
                    </p>
                  </div>

                  <div className="mt-8 rounded-2xl border border-purple-100/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                      <Truck className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                      Fast Shipping
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Quick doorstep delivery
                    </p>
                  </div>

                  <div className="-mt-4 rounded-2xl border border-purple-100/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                      <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                      Customer First
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Your satisfaction guaranteed
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-100/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                      <Award className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                      Top Quality
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Curated product options
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                Our Story
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                Building a Better{" "}
                <span className="bg-gradient-to-r from-purple-700 to-purple-600 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
                  Marketplace Ecosystem
                </span>
              </h2>

              <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                VenRaz was founded to bridge the gap between shoppers seeking
                high-quality, authentic products and top-tier independent
                sellers looking for a performant platform to scale.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                By providing powerful seller dashboards and intuitive discovery
                tools for buyers, we facilitate smooth transactions, transparent
                order tracking, and a diverse range of merchandise.
              </p>

              <div className="mt-8 space-y-3.5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Verified multi-vendor catalog with rigorous seller standards
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Encrypted checkout & reliable payment gateways
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Real-time order tracking and dispatch updates
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Dedicated support for buyers and merchants alike
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          WHY CHOOSE US
      ========================= */}
      <section className="bg-slate-100/60 dark:bg-slate-900/50 py-20 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Why VenRaz
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Why Choose Our Platform?
            </h2>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              We focus on providing an intuitive, safe, and modern multi-vendor
              experience for everyone.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="rounded-2xl border border-purple-100/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-xl hover:shadow-purple-600/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                <ShoppingBag className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                Vast Catalog
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Explore a diverse inventory of verified merchandise across
                dozens of popular categories.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-purple-100/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-xl hover:shadow-purple-600/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                Secure Checkout
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Your transactions and financial details are protected with
                robust, modern security protocols.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-purple-100/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-xl hover:shadow-purple-600/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                <Truck className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                Reliable Logistics
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                We coordinate with merchant dispatch networks to ensure prompt
                delivery right to your door.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-purple-100/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-xl hover:shadow-purple-600/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                <Users className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                Seller Empowerment
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                We equip sellers with dedicated analytics and management tools
                to deliver superior customer service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          MISSION SECTION
      ========================= */}
      <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 dark:from-purple-950 dark:via-purple-900 dark:to-slate-950 px-6 py-16 text-white shadow-xl shadow-purple-900/10 sm:px-12">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
              <Sparkles className="h-6 w-6 text-purple-300" />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
              Our Core Mission
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-purple-100/90 sm:text-base">
              To build an inclusive e-commerce platform that connects vendors
              and buyers through reliable technology, transparent communication,
              and exceptional marketplace experiences.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white dark:bg-purple-700 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-white shadow-md transition hover:bg-purple-50 dark:hover:bg-purple-600"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          CTA SECTION
      ========================= */}
      <section className="border-t border-purple-100 dark:border-purple-950/60 py-16 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Ready to Start Shopping?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Discover thousands of products from verified vendors on VenRaz
            today.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-purple-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-purple-600/25 transition hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
            >
              Shop Catalog
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 shadow-sm transition hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
