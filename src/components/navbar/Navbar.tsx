"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Heart,
  Sun,
  Moon,
  Search,
  Sparkles,
} from "lucide-react";

import { authClient, signOut, useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { SearchBar } from "@/components/SearchBar";
import CartDrawer from "@/components/navbar/CartDrawer";
import { useTheme } from "next-themes";

const ADMIN_EMAIL = "fhlimon6@gmail.com";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();
  const { totalItems } = useCart();

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // --------------------------------------------------
  // Active route
  // --------------------------------------------------

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  };

  // --------------------------------------------------
  // Close dropdown when clicking outside
  // --------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --------------------------------------------------
  // Navbar scroll effect
  // --------------------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --------------------------------------------------
  // Close mobile menu
  // --------------------------------------------------

  const closeMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  // --------------------------------------------------
  // Cart
  // --------------------------------------------------

  const toggleCartDrawer = () => {
    setDropdownOpen(false);
    setCartOpen((prev) => !prev);
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      await authClient.signOut();
    }

    closeMenu();
    router.push("/");
  };

  // --------------------------------------------------
  // Dashboard route
  // --------------------------------------------------

  const getDashboardRoute = () => {
    if (
      session?.user?.email === ADMIN_EMAIL ||
      session?.user?.role === "admin"
    ) {
      return "/adminDashboard";
    }

    return "/userDashboard";
  };

  // --------------------------------------------------
  // Navigation links
  // --------------------------------------------------

  const navLinks = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Products",
      href: "/products",
    },
    {
      name: "Shops",
      href: "/shops",
    },
    {
      name: "Categories",
      href: "/categories",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contacts",
    },
  ];

  return (
    <>
      <nav
        className={`
          fixed inset-x-0 top-0 z-50
          transition-all duration-300 
          ${scrolled ? "px-3 pt-3 sm:px-5 lg:px-8" : "px-0 pt-0"}
        `}
      >
        <div
          className={`
            mx-auto
            max-w-full
            transition-all duration-300
            ${
              scrolled
                ? `
                  rounded-2xl
                  border
                  border-purple-100/80
                  bg-white/90
                  shadow-[0_10px_40px_rgba(88,28,135,0.10)]
                  backdrop-blur-xl
                  dark:border-slate-800
                  dark:bg-slate-950/90
                `
                : `
                  border-b
                  border-slate-100
                  bg-white/95
                  dark:border-slate-800
                  dark:bg-slate-950/95
                `
            }
          `}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-[72px] items-center justify-between gap-4">
              {/* =====================================================
                  LOGO
              ====================================================== */}

              <Link
                href="/"
                onClick={closeMenu}
                className="group flex shrink-0 items-center gap-2.5"
              >
                <div
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-purple-600
                    to-fuchsia-600
                    text-white
                    shadow-lg
                    shadow-purple-500/20
                    transition-all duration-300
                    group-hover:scale-105
                    group-hover:shadow-purple-500/30
                  "
                >
                  <Sparkles className="h-5 w-5" />
                </div>

                <div className="leading-none">
                  <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    Ven
                    <span className="bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                      Raz Store
                    </span>
                  </span>

                  <p className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-400 sm:block">
                    Marketplace
                  </p>
                </div>
              </Link>

              {/* =====================================================
                  DESKTOP NAVIGATION
              ====================================================== */}

              <div className="hidden items-center md:flex">
                <div
                  className="
                    flex items-center gap-1
                    rounded-2xl
                    border border-slate-100
                    bg-slate-50/80
                    p-1.5
                    dark:border-slate-800
                    dark:bg-slate-900/80
                  "
                >
                  {navLinks.map((link) => {
                    const active = isActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`
                          relative
                          rounded-xl
                          px-3.5
                          py-2.5
                          text-sm
                          font-semibold
                          transition-all
                          duration-200
                          lg:px-4
                          ${
                            active
                              ? `
                                bg-white
                                text-purple-600
                                shadow-sm
                                dark:bg-slate-800
                                dark:text-purple-400
                              `
                              : `
                                text-slate-600
                                hover:bg-white
                                hover:text-purple-600
                                dark:text-slate-300
                                dark:hover:bg-slate-800
                                dark:hover:text-purple-400
                              `
                          }
                        `}
                      >
                        {link.name}

                        {active && (
                          <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-purple-600 dark:bg-purple-400" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* =====================================================
                  DESKTOP SEARCH
              ====================================================== */}

              <div className="hidden min-w-0 flex-1 lg:block lg:max-w-sm xl:max-w-md">
                <div className="px-3">
                  <SearchBar />
                </div>
              </div>

              {/* =====================================================
                  DESKTOP ACTIONS
              ====================================================== */}

              <div className="hidden shrink-0 items-center gap-1.5 md:flex lg:gap-2">
                {/* Theme */}

                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  className="
                    group
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    border border-transparent
                    text-slate-600
                    transition-all duration-200
                    hover:border-purple-100
                    hover:bg-purple-50
                    hover:text-purple-600
                    dark:text-slate-300
                    dark:hover:border-slate-700
                    dark:hover:bg-slate-800
                    dark:hover:text-purple-400
                  "
                >
                  {isDark ? (
                    <Sun className="h-[18px] w-[18px] text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
                  ) : (
                    <Moon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-rotate-12" />
                  )}
                </button>

                {/* Cart */}

                <button
                  type="button"
                  onClick={toggleCartDrawer}
                  aria-label="Shopping cart"
                  className={`
                    relative
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    border
                    transition-all duration-200
                    ${
                      isActive("/carts")
                        ? `
                          border-purple-200
                          bg-purple-50
                          text-purple-600
                          dark:border-purple-900
                          dark:bg-purple-950/40
                          dark:text-purple-400
                        `
                        : `
                          border-transparent
                          text-slate-600
                          hover:border-purple-100
                          hover:bg-purple-50
                          hover:text-purple-600
                          dark:text-slate-300
                          dark:hover:border-slate-700
                          dark:hover:bg-slate-800
                          dark:hover:text-purple-400
                        `
                    }
                  `}
                >
                  <ShoppingCart className="h-[19px] w-[19px]" />

                  {totalItems > 0 && (
                    <span
                      className="
                        absolute
                        -right-1
                        -top-1
                        flex
                        min-h-[18px]
                        min-w-[18px]
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-r
                        from-purple-600
                        to-fuchsia-600
                        px-1
                        text-[10px]
                        font-bold
                        text-white
                        shadow-md
                        shadow-purple-500/30
                        ring-2
                        ring-white
                        dark:ring-slate-950
                      "
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </button>

                {/* Divider */}

                <div className="mx-1 h-7 w-px bg-slate-200 dark:bg-slate-800" />

                {/* =====================================================
                    AUTH
                ====================================================== */}

                {!session ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className={`
                        flex items-center gap-2
                        rounded-xl
                        px-3.5
                        py-2.5
                        text-sm
                        font-semibold
                        transition-all
                        ${
                          isActive("/login")
                            ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                            : "text-slate-600 hover:bg-slate-50 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                        }
                      `}
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden xl:inline">Login</span>
                    </Link>

                    <Link
                      href="/register"
                      className="
                        rounded-xl
                        bg-gradient-to-r
                        from-purple-600
                        to-fuchsia-600
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-lg
                        shadow-purple-500/20
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:shadow-xl
                        hover:shadow-purple-500/25
                      "
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="
                        group
                        flex
                        items-center
                        gap-2.5
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        py-1.5
                        pl-1.5
                        pr-3
                        transition-all
                        hover:border-purple-200
                        hover:bg-purple-50/50
                        dark:border-slate-800
                        dark:bg-slate-900
                        dark:hover:border-purple-900
                        dark:hover:bg-slate-800
                      "
                    >
                      <Image
                        src={
                          session?.user?.image ||
                          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
                        }
                        width={36}
                        height={36}
                        alt={session?.user?.name || "User avatar"}
                        className="
                          h-9
                          w-9
                          rounded-lg
                          object-cover
                          ring-2
                          ring-purple-100
                          dark:ring-purple-900/50
                        "
                      />

                      <div className="hidden text-left lg:block">
                        <p className="max-w-[100px] truncate text-xs font-bold text-slate-900 dark:text-white">
                          {session?.user?.name}
                        </p>

                        <p className="text-[10px] text-slate-400">Account</p>
                      </div>

                      <ChevronDown
                        className={`
                          h-4
                          w-4
                          text-slate-400
                          transition-transform
                          duration-200
                          ${dropdownOpen ? "rotate-180 text-purple-500" : ""}
                        `}
                      />
                    </button>

                    {/* =====================================================
                        USER DROPDOWN
                    ====================================================== */}

                    {dropdownOpen && (
                      <div
                        className="
                          absolute
                          right-0
                          top-[calc(100%+10px)]
                          w-64
                          overflow-hidden
                          rounded-2xl
                          border
                          border-slate-100
                          bg-white
                          shadow-2xl
                          shadow-slate-900/10
                          ring-1
                          ring-black/5
                          animate-in
                          fade-in
                          slide-in-from-top-2
                          duration-200
                          dark:border-slate-800
                          dark:bg-slate-900
                          dark:shadow-black/30
                        "
                      >
                        {/* User information */}

                        <div
                          className="
                            border-b
                            border-slate-100
                            bg-gradient-to-br
                            from-purple-50
                            via-white
                            to-fuchsia-50
                            p-4
                            dark:border-slate-800
                            dark:from-purple-950/40
                            dark:via-slate-900
                            dark:to-fuchsia-950/30
                          "
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={
                                session?.user?.image ||
                                "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
                              }
                              width={44}
                              height={44}
                              alt={session?.user?.name || "User avatar"}
                              className="
                                h-11
                                w-11
                                rounded-xl
                                object-cover
                                ring-2
                                ring-purple-200
                                dark:ring-purple-800
                              "
                            />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                {session?.user?.name}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                {session?.user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Dashboard */}

                        <div className="p-2">
                          <Link
                            href={getDashboardRoute()}
                            onClick={closeMenu}
                            className={`
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-2.5
                              text-sm
                              font-semibold
                              transition
                              ${
                                isActive(getDashboardRoute())
                                  ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                              }
                            `}
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                              <LayoutDashboard className="h-4 w-4" />
                            </span>
                            Dashboard
                          </Link>

                          {/* Profile */}

                          <Link
                            href="/profile"
                            onClick={closeMenu}
                            className={`
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-2.5
                              text-sm
                              font-semibold
                              transition
                              ${
                                isActive("/profile")
                                  ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                              }
                            `}
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              <User className="h-4 w-4" />
                            </span>
                            Profile
                          </Link>

                          {/* Wishlist */}

                          <Link
                            href="/userDashboard/wishList"
                            onClick={closeMenu}
                            className={`
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-2.5
                              text-sm
                              font-semibold
                              transition
                              ${
                                isActive("/userDashboard/wishList")
                                  ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                              }
                            `}
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-500 dark:bg-pink-950/30 dark:text-pink-400">
                              <Heart className="h-4 w-4" />
                            </span>
                            Wishlist
                          </Link>
                        </div>

                        {/* Logout */}

                        <div className="border-t border-slate-100 p-2 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-2.5
                              text-left
                              text-sm
                              font-semibold
                              text-red-500
                              transition
                              hover:bg-red-50
                              dark:hover:bg-red-950/30
                            "
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-950/30">
                              <LogOut className="h-4 w-4" />
                            </span>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* =====================================================
                  MOBILE ACTIONS
              ====================================================== */}

              <div className="flex items-center gap-1.5 md:hidden">
                {/* Mobile cart */}

                <button
                  type="button"
                  onClick={toggleCartDrawer}
                  aria-label="Shopping cart"
                  className="
                    relative
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    text-slate-700
                    transition
                    hover:bg-purple-50
                    hover:text-purple-600
                    dark:text-slate-300
                    dark:hover:bg-slate-800
                    dark:hover:text-purple-400
                  "
                >
                  <ShoppingCart className="h-[19px] w-[19px]" />

                  {totalItems > 0 && (
                    <span
                      className="
                        absolute
                        -right-0.5
                        -top-0.5
                        flex
                        min-h-[17px]
                        min-w-[17px]
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-r
                        from-purple-600
                        to-fuchsia-600
                        px-1
                        text-[9px]
                        font-bold
                        text-white
                        ring-2
                        ring-white
                        dark:ring-slate-950
                      "
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </button>

                {/* Mobile theme */}

                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    text-slate-700
                    transition
                    hover:bg-purple-50
                    hover:text-purple-600
                    dark:text-slate-300
                    dark:hover:bg-slate-800
                    dark:hover:text-purple-400
                  "
                >
                  {isDark ? (
                    <Sun className="h-[18px] w-[18px] text-amber-400" />
                  ) : (
                    <Moon className="h-[18px] w-[18px]" />
                  )}
                </button>

                {/* Menu */}

                <button
                  type="button"
                  onClick={() => setIsOpen((prev) => !prev)}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    bg-gradient-to-r
                    from-purple-600
                    to-fuchsia-600
                    text-white
                    shadow-lg
                    shadow-purple-500/20
                    transition-all
                    duration-200
                    hover:scale-105
                  "
                >
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================
              MOBILE MENU
          ========================================================== */}

          {isOpen && (
            <div
              className="
                border-t
                border-slate-100
                bg-white
                dark:border-slate-800
                dark:bg-slate-950
                md:hidden
              "
            >
              <div className="space-y-2 px-4 py-4 sm:px-6">
                {/* Mobile search */}

                <div className="relative pb-2">
                  <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <SearchBar />
                </div>

                {/* Navigation */}

                <div className="space-y-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                        className={`
                          flex
                          items-center
                          justify-between
                          rounded-xl
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          transition
                          ${
                            active
                              ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                              : "text-slate-600 hover:bg-slate-50 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-purple-400"
                          }
                        `}
                      >
                        {link.name}

                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Cart */}

                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    setCartOpen(true);
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-purple-100
                    bg-purple-50/60
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-purple-700
                    transition
                    hover:bg-purple-100
                    dark:border-purple-900/50
                    dark:bg-purple-950/30
                    dark:text-purple-300
                    dark:hover:bg-purple-950/50
                  "
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5" />

                    <span>Shopping Cart</span>
                  </div>

                  {totalItems > 0 && (
                    <span
                      className="
                        flex
                        h-6
                        min-w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-purple-600
                        px-1.5
                        text-[10px]
                        font-bold
                        text-white
                      "
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </button>

                {/* Logged in */}

                {session && (
                  <div className="space-y-1 border-t border-slate-100 pt-3 dark:border-slate-800">
                    {/* Dashboard */}

                    <Link
                      href={getDashboardRoute()}
                      onClick={closeMenu}
                      className={`
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        transition
                        ${
                          isActive(getDashboardRoute())
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                            : "text-slate-600 hover:bg-purple-50 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-purple-400"
                        }
                      `}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>

                    {/* Profile */}

                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className={`
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        transition
                        ${
                          isActive("/profile")
                            ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                            : "text-slate-600 hover:bg-slate-50 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-purple-400"
                        }
                      `}
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>

                    {/* Wishlist */}

                    <Link
                      href="/userDashboard/wishList"
                      onClick={closeMenu}
                      className={`
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        transition
                        ${
                          isActive("/userDashboard/wishList")
                            ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                            : "text-slate-600 hover:bg-slate-50 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-purple-400"
                        }
                      `}
                    >
                      <Heart className="h-5 w-5" />
                      Wishlist
                    </Link>
                  </div>
                )}

                {/* Authentication */}

                <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                  {!session ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-slate-200
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-slate-700
                          transition
                          hover:border-purple-200
                          hover:bg-purple-50
                          hover:text-purple-600
                          dark:border-slate-700
                          dark:text-slate-300
                          dark:hover:bg-slate-800
                          dark:hover:text-purple-400
                        "
                      >
                        <User className="h-4 w-4" />
                        Login
                      </Link>

                      <Link
                        href="/register"
                        onClick={closeMenu}
                        className="
                          flex
                          items-center
                          justify-center
                          rounded-xl
                          bg-gradient-to-r
                          from-purple-600
                          to-fuchsia-600
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-white
                          shadow-lg
                          shadow-purple-500/20
                        "
                      >
                        Register
                      </Link>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-red-500
                        transition
                        hover:bg-red-100
                        dark:bg-red-950/30
                        dark:hover:bg-red-950/50
                      "
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* =============================================================
          CART DRAWER
      ============================================================= */}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
