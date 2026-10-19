"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ArrowLeft,
  Store,
  ChevronRight,
  Activity,
  ShieldCheck,
  X,
  PlusCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/adminDashboard", icon: LayoutDashboard },
  { label: "Products", href: "/adminDashboard/products", icon: Package },
  { label: "Orders", href: "/adminDashboard/orders", icon: ShoppingCart },
  {
    label: "Add Product",
    href: "/adminDashboard/addProduct",
    icon: PlusCircle,
  },
  { label: "Users & Sellers", href: "/adminDashboard/users", icon: Users },
  {
    label: "Verify Shops",
    href: "/adminDashboard/verify-shops",
    icon: ShieldCheck,
  },
  { label: "Settings", href: "/adminDashboard/settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Route change hole mobile-e automatic drawer close hobe
  useEffect(() => {
    onClose?.();
  }, [pathname, onClose]);

  // Drawer open thakle body scroll prevent hobe
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key press korle mobile drawer close hobe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Dark Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar / Drawer Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-purple-100 bg-white text-slate-700 select-none shadow-sm transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-purple-100 px-6">
          <Link
            href="/adminDashboard"
            className="flex items-center gap-3 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 transition-transform duration-300 group-hover:scale-105">
              <Store className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  ven<span className="text-purple-600">Raz</span>
                </span>
                <span className="rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-[9px] font-bold text-purple-700">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-purple-900/40 font-medium">
                Enterprise Control
              </p>
            </div>
          </Link>

          {/* Close Button for Mobile Drawer */}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-purple-50 hover:text-purple-600 md:hidden transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-purple-900/40">
              Management
            </p>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/adminDashboard"
                    ? pathname === "/adminDashboard"
                    : pathname.startsWith(item.href);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-purple-50 text-purple-700 border border-purple-200/80 shadow-sm shadow-purple-500/5 font-bold"
                        : "text-slate-600 hover:bg-purple-50/60 hover:text-purple-700"
                    }`}
                  >
                    {/* Left Active Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-purple-600" />
                    )}

                    <Icon
                      className={`h-4 w-4 transition-colors duration-200 ${
                        isActive
                          ? "text-purple-600"
                          : "text-slate-400 group-hover:text-purple-600"
                      }`}
                    />

                    <span className="flex-1">{item.label}</span>

                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-purple-600" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Live System Status Widget */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600" />
                </span>
                <span className="text-xs font-bold text-slate-800">
                  Store Status
                </span>
              </div>
              <Activity className="h-3.5 w-3.5 text-purple-400" />
            </div>

            <p className="mt-1.5 text-[11px] text-slate-500">
              All services operating smoothly.
            </p>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="border-t border-purple-100 p-4 space-y-3">
          <Link
            href="/userDashboard"
            className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="flex-1">Seller Dashboard</span>
          </Link>

          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-500">
              <ShieldCheck className="h-3 w-3 text-purple-600" /> v1.0.0
            </span>
            <span className="font-medium text-slate-400">venRaz Platform</span>
          </div>
        </div>
      </aside>
    </>
  );
}
