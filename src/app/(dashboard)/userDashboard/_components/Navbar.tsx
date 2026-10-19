"use client";

import { authClient } from "@/lib/auth-client";
import { Bell, ChevronDown, Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = authClient.useSession();

  const name = session?.user?.name || "User";
  const email = session?.user?.email || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-purple-100 bg-white/95 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu button */}
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-100 text-gray-600 transition-colors hover:bg-purple-50 hover:text-purple-600 lg:hidden"
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          )}

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-wide text-purple-600 uppercase">
              Dashboard
            </p>

            <h1 className="truncate text-sm font-bold text-gray-900 sm:text-base">
              Welcome back, {name}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-purple-100 text-gray-600 transition-all hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
          >
            <Bell size={18} strokeWidth={1.8} />

            {/* Notification indicator */}
            <span
              aria-hidden="true"
              className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-white bg-purple-600 ring-2 ring-purple-600/20"
            />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-purple-100 sm:block" />

          {/* Profile */}
          <button
            type="button"
            className="group flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-600/30 sm:gap-3 sm:pr-2.5"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-sm font-bold text-white shadow-sm shadow-purple-600/30">
              {initial}
            </div>

            {/* User information */}
            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-[150px] truncate text-sm font-semibold leading-tight text-gray-900 group-hover:text-purple-700">
                {name}
              </p>

              {email && (
                <p className="mt-0.5 max-w-[180px] truncate text-xs leading-tight text-gray-500">
                  {email}
                </p>
              )}
            </div>

            {/* Dropdown indicator */}
            <ChevronDown
              size={16}
              className="hidden text-gray-400 transition-transform duration-200 group-hover:text-purple-600 sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
