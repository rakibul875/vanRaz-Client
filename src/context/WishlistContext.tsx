"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useSession } from "@/lib/auth-client";
import { useToast } from "./ToastContext";

export interface WishlistProduct {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discount?: number;
  flashSalePrice?: number;
  isFlashSale?: boolean;
  stock?: number;
  brand?: string;
}

interface WishlistContextType {
  items: WishlistProduct[];
  loading: boolean;
  isLoaded: boolean;
  pendingId: string | null;
  isAuthenticated: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const extractProducts = (json: unknown): WishlistProduct[] => {
  const data = (json as Record<string, unknown> | null)?.data as
    | Record<string, unknown>
    | null
    | undefined;

  if (Array.isArray(data?.productIds)) {
    return (data.productIds as WishlistProduct[]).filter(
      (product): product is WishlistProduct => Boolean(product),
    );
  }

  return [];
};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const token = session?.session?.token;
  const isAuthenticated = !!session?.user;
  const { success, error, info } = useToast();

  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }, [token]);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      setIsLoaded(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to load wishlist: ${res.status}`);
      }

      setItems(extractProducts(await res.json()));
    } catch (err) {
      console.error("Wishlist loading failed:", err);
      setItems([]);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  }, [token, getAuthHeaders]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refresh]);

  const isWishlisted = useCallback(
    (productId: string) => {
      return items.some((item) => item._id === productId);
    },
    [items],
  );

  const toggleWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isAuthenticated) {
        info(
          "Please sign in to save items to your wishlist.",
          "Sign In Required",
        );
        return false;
      }

      if (pendingId) return false;

      setPendingId(productId);

      const currentlyWishlisted = items.some(
        (item) => item._id === productId,
      );

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`,
          {
            method: currentlyWishlisted ? "DELETE" : "POST",
            headers: getAuthHeaders(),
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error(`Failed to update wishlist: ${res.status}`);
        }

        if (currentlyWishlisted) {
          setItems((prev) => prev.filter((item) => item._id !== productId));
          success("Item removed from your wishlist.", "Wishlist Updated");
        } else {
          setItems(extractProducts(await res.json()));
          success("Item added to your wishlist.", "Wishlist Updated");
        }

        return !currentlyWishlisted;
      } catch (err) {
        console.error("Wishlist toggle failed:", err);
        error("Could not update your wishlist. Please try again.", "Error");
        return false;
      } finally {
        setPendingId(null);
      }
    },
    [isAuthenticated, pendingId, items, getAuthHeaders, success, error, info],
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (!isAuthenticated || pendingId) return;

      setPendingId(productId);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error(`Failed to remove item: ${res.status}`);
        }

        setItems(extractProducts(await res.json()));
        success("Item removed from your wishlist.", "Wishlist Updated");
      } catch (err) {
        console.error("Wishlist remove failed:", err);
        error("Could not remove the item. Please try again.", "Error");
      } finally {
        setPendingId(null);
      }
    },
    [isAuthenticated, pendingId, getAuthHeaders, success, error],
  );

  const value = useMemo(
    () => ({
      items,
      loading,
      isLoaded,
      pendingId,
      isAuthenticated,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      refresh,
    }),
    [
      items,
      loading,
      isLoaded,
      pendingId,
      isAuthenticated,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      refresh,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}