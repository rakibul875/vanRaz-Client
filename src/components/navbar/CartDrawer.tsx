"use client";

import React, {
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 100;
const TRANSITION_MS = 300;

const emptySubscribe = () => () => {};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems, total } =
    useCart();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [wasOpen, setWasOpen] = useState(isOpen);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Adjust open/close state during render so the exit transition can finish.
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setMounted(true);
    } else {
      setVisible(false);
    }
  }

  // Slide in on the frame after mount.
  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  // Unmount once the slide-out transition ends.
  useEffect(() => {
    if (!mounted || isOpen) return;
    const timer = setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [mounted, isOpen]);

  // Lock page scroll and close on Escape while the drawer is open.
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, onClose]);

  if (!isClient || !mounted) return null;

  const amountForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-purple-950/40 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Panel */}
      <aside
        className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-slate-900 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-purple-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-[#7E22CE] dark:bg-purple-950/40">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-purple-950 dark:text-white">
                Your Cart
              </h2>
              <p className="text-xs text-purple-900/60 dark:text-slate-400">
                {totalItems} {totalItems === 1 ? "item" : "items"} in cart
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-xl p-2 text-purple-950/70 transition hover:bg-[#FAF5FF] hover:text-[#7E22CE] dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div className="border-b border-purple-100 bg-[#FAF5FF] px-5 py-3 dark:border-slate-800 dark:bg-slate-800/50">
            <p className="mb-2 text-xs font-semibold text-purple-950 dark:text-slate-200">
              {amountForFreeShipping > 0
                ? `Add $${amountForFreeShipping.toFixed(2)} more for free shipping`
                : "You unlocked free shipping!"}
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-purple-100 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-[#7E22CE] transition-all duration-500"
                style={{
                  width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <span className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-[#7E22CE] dark:bg-purple-950/40">
                <ShoppingBag className="h-9 w-9" />
              </span>
              <p className="text-base font-bold text-purple-950 dark:text-white">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-purple-900/60 dark:text-slate-400">
                Browse our latest products and add something you love.
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7E22CE] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-800"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-purple-50 dark:divide-slate-800">
              {items.map((item) => {
                const itemTotal = item.price * item.quantity;
                const isMaxStock =
                  typeof item.stock === "number" &&
                  item.stock > 0 &&
                  item.quantity >= item.stock;

                return (
                  <li
                    key={item.id}
                    className="flex gap-3 px-5 py-4 transition hover:bg-[#FAF5FF]/60 dark:hover:bg-slate-800/40"
                  >
                    <Link
                      href={`/products/${item.id}`}
                      onClick={onClose}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-purple-100 bg-purple-50/40 p-1.5 dark:border-slate-800 dark:bg-slate-800/60"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.id}`}
                            onClick={onClose}
                            className="line-clamp-2 text-sm font-bold text-purple-950 transition hover:text-[#7E22CE] dark:text-white"
                          >
                            {item.name}
                          </Link>
                          {item.brand && (
                            <p className="mt-0.5 truncate text-xs text-purple-900/50 dark:text-slate-400">
                              {item.brand}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name}`}
                          title="Remove item"
                          className="shrink-0 rounded-lg p-1.5 text-purple-900/40 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <div className="flex items-center overflow-hidden rounded-lg border border-purple-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, "decrease")}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="flex h-8 w-8 items-center justify-center text-purple-900/70 transition hover:bg-[#FAF5FF] hover:text-[#7E22CE] disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-purple-950 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, "increase")}
                            disabled={isMaxStock}
                            aria-label={`Increase ${item.name} quantity`}
                            className="flex h-8 w-8 items-center justify-center text-purple-900/70 transition hover:bg-[#FAF5FF] hover:text-[#7E22CE] disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-extrabold text-purple-950 dark:text-white">
                            ${itemTotal.toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-purple-900/50 dark:text-slate-400">
                              ${item.price.toFixed(2)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <footer className="border-t border-purple-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-purple-900/70 dark:text-slate-300">
                Subtotal
              </span>
              <span className="font-bold text-purple-950 dark:text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-purple-900/70 dark:text-slate-300">
                Total
              </span>
              <span className="text-xl font-black text-[#7E22CE]">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/checkout"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#7E22CE] py-3 text-sm font-bold text-white shadow-lg shadow-purple-950/10 transition hover:bg-purple-800"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/carts"
                onClick={onClose}
                className="rounded-xl border border-purple-200 py-3 text-center text-sm font-semibold text-purple-950 transition hover:bg-[#FAF5FF] hover:text-[#7E22CE] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                View Full Cart
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </div>,
    document.body,
  );
}
