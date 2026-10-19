"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Heart,
  Store,
  Settings,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
  PackagePlus,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  role?: "user" | "admin";
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  role = "user",
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Fetch live session details if available
  const { data: session } = authClient.useSession();

  // Lock body scroll on mobile drawer opening
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

  // Handle escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const links = [
    {
      name: "Overview",
      href: "/userDashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Profile",
      href: "/userDashboard/profile",
      icon: User,
    },
    {
      name: "My Orders",
      href: "/userDashboard/orders",
      icon: ShoppingBag,
    },
    {
      name: "My WishList",
      href: "/userDashboard/wishList",
      icon: Heart,
    },
    {
      name: "Create Shop",
      href: "/userDashboard/createShop",
      icon: Store,
    },
    {
      name: "Add Product",
      href: "/userDashboard/addProduct",
      icon: PackagePlus,
    },
  ];

  if (role === "admin") {
    links.push({
      name: "Admin Panel",
      href: "/adminDashboard",
      icon: Settings,
    });
    links.push({
      name: "Verify Shops",
      href: "/adminDashboard/verify-shops",
      icon: ShieldCheck,
    });
  }

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-purple-950/20 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-purple-100 bg-white
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-purple-100 px-5">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-sm font-bold text-white shadow-sm shadow-purple-600/30">
              D
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide text-gray-900">
                Dashboard
              </p>
              <p className="text-[11px] font-medium text-purple-600">
                {role === "admin" ? "Administrator" : "Customer"}
              </p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-purple-50 hover:text-purple-600 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-purple-400">
            Menu
          </p>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;

              const isActive =
                link.href === "/userDashboard" ||
                link.href === "/adminDashboard"
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center gap-3 rounded-xl
                    px-3 py-2.5 text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-purple-600 text-white font-semibold shadow-sm shadow-purple-600/20"
                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-purple-600"
                    }
                  />

                  <span className="flex-1">{link.name}</span>

                  {isActive && (
                    <ChevronRight size={15} className="text-white/70" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section / User Controls */}
        <div className="space-y-3 border-t border-purple-100 p-4">
          {/* Account Details Widget */}
          <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3">
            <p className="text-[11px] font-medium text-gray-500">
              Signed in as
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-purple-900">
              {session?.user?.email ??
                (role === "admin"
                  ? "Administrator Account"
                  : "Customer Account")}
            </p>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="
              group flex w-full items-center gap-3 rounded-xl
              border border-transparent px-3 py-2.5 text-sm font-semibold
              text-rose-600 transition-all duration-200
              hover:border-rose-200 hover:bg-rose-50
              focus:outline-none focus:ring-2 focus:ring-rose-500/20
            "
          >
            <LogOut
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
