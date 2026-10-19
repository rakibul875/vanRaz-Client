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

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  discount?: number;
  image: string;
  quantity: number;
  stock?: number;
  brand?: string;
}

export interface ProductInput {
  _id?: string;
  id?: string;
  name?: string;
  price?: number;
  flashSalePrice?: number;
  discount?: number;
  image?: string;
  images?: string[];
  brand?: string;
  stock?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductInput, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, type: "increase" | "decrease") => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  shipping: number;
  discountAmount: number;
  total: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Map backend cart schema ({ product, quantity, price }) to the frontend CartItem shape.
const formatServerItems = (serverItems: unknown[]): CartItem[] =>
  serverItems.map((raw): CartItem => {
    const item = raw as Record<string, unknown>;
    const product =
      typeof item.product === "object" && item.product !== null
        ? (item.product as Record<string, unknown>)
        : {};
    const images = product.images;
    const firstImage = Array.isArray(images) ? images[0] : undefined;
    return {
      id: String(product._id ?? product.id ?? item.product ?? item.id ?? ""),
      name: String(product.name ?? item.name ?? "Product"),
      price: Number(product.flashSalePrice ?? product.price ?? item.price ?? 0),
      image: String(
        firstImage ?? product.image ?? item.image ?? "/placeholder.svg",
      ),
      quantity: Number(item.quantity ?? 1),
      stock: Number(product.stock ?? item.stock ?? 99),
      brand: String(product.brand ?? item.brand ?? ""),
    };
  });

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: session } = useSession();
  const { success, info } = useToast();
  const token = session?.session?.token;
  const isAuthenticated = !!session?.user;

  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    // (headers);
    return headers;
  }, [token]);

  // 1. Load Cart (server-backed only)
  const loadCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          headers: getAuthHeaders(),
          credentials: "include",
        });

        if (res.ok) {
          const responseData = await res.json();
          const serverItems =
            responseData?.data?.items || responseData?.data || [];
          setItems(formatServerItems(serverItems));
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Cart loading failed:", err);
      setItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, [isAuthenticated, getAuthHeaders]);

  useEffect(() => {
    let cancelled = false;

    async function initializeCart() {
      if (!cancelled) {
        await loadCart();
      }
    }

    initializeCart();

    return () => {
      cancelled = true;
    };
  }, [loadCart]);

  // Local in-memory update for guests and as a fallback when the API is down.
  const applyLocalAdd = useCallback((item: CartItem, addedQty: number) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(
          updated[existingIndex].quantity + addedQty,
          item.stock ?? 99,
        );
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  // 2. Add To Cart
  const addToCart = useCallback(
    async (product: ProductInput, quantity: number = 1) => {
      const productId = String(product._id || product.id);
      const name = product.name || "Product";

      const localItem: CartItem = {
        id: productId,
        name,
        price: Number(product.flashSalePrice || product.price || 0),
        discount: product.discount,
        image: product.images?.[0] || product.image || "/placeholder.svg",
        quantity: Math.min(
          quantity,
          typeof product.stock === "number" ? product.stock : 99,
        ),
        stock: typeof product.stock === "number" ? product.stock : 99,
        brand: product.brand || "",
      };

      if (isAuthenticated) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
            method: "POST",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify({ productId, quantity }),
          });

          if (res.ok) {
            await loadCart(); // Refetch database items
            success(`Added "${name}" to your shopping cart!`, "Added to Cart");
            return;
          }
        } catch {
          // Fall through to local fallback below
        }
        applyLocalAdd(localItem, quantity);
        info(`Added "${name}" locally — server sync unavailable.`, "Cart");
      } else {
        applyLocalAdd(localItem, quantity);
        success(`Added "${name}" to your shopping cart!`, "Added to Cart");
      }
    },
    [isAuthenticated, loadCart, getAuthHeaders, applyLocalAdd, success, info],
  );

  // 3. Remove From Cart
  const removeFromCart = useCallback(
    async (id: string) => {
      const itemToRemove = items.find((item) => item.id === id);

      if (isAuthenticated) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`,
            {
              method: "DELETE",
              headers: getAuthHeaders(),
              credentials: "include",
            },
          );

          if (res.ok) {
            await loadCart();
          } else {
            setItems((prev) => prev.filter((item) => item.id !== id));
          }
        } catch {
          setItems((prev) => prev.filter((item) => item.id !== id));
        }
      } else {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }

      if (itemToRemove) {
        info(`Removed "${itemToRemove.name}" from cart.`, "Cart Updated");
      }
    },
    [isAuthenticated, items, loadCart, getAuthHeaders, info],
  );

  // 4. Update Quantity
  const updateQuantity = useCallback(
    async (id: string, type: "increase" | "decrease") => {
      const targetItem = items.find((item) => item.id === id);
      if (!targetItem) return;

      const maxStock = targetItem.stock || 99;
      const newQuantity =
        type === "increase"
          ? Math.min(targetItem.quantity + 1, maxStock)
          : Math.max(targetItem.quantity - 1, 1);

      if (targetItem.quantity === newQuantity) return;

      const applyLocalUpdate = () =>
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item,
          ),
        );

      if (isAuthenticated) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`,
            {
              method: "PATCH",
              headers: getAuthHeaders(),
              credentials: "include",
              body: JSON.stringify({ quantity: newQuantity }),
            },
          );

          if (res.ok) {
            await loadCart();
          } else {
            applyLocalUpdate();
          }
        } catch {
          applyLocalUpdate();
        }
      } else {
        applyLocalUpdate();
      }
    },
    [isAuthenticated, items, loadCart, getAuthHeaders],
  );

  // 5. Clear Cart
  const clearCart = useCallback(async () => {
    if (isAuthenticated && items.length > 0) {
      try {
        for (const item of items) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${item.id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
            credentials: "include",
          });
        }
      } catch {
        // Best-effort: items cleared locally even if server fails
      }
    }
    setItems([]);
  }, [isAuthenticated, items, getAuthHeaders]);

  // 6. Calculations
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal > 100 ? 0 : 15;
  }, [items.length, subtotal]);

  const discountAmount = useMemo(() => 0, []);

  const total = useMemo(
    () => Math.max(0, subtotal + shipping - discountAmount),
    [subtotal, shipping, discountAmount],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        discountAmount,
        total,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
