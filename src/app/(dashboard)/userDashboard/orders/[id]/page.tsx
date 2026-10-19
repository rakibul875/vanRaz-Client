"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  CreditCard,
  Calendar,
  ArrowLeft,
  Package,
  CheckCircle2,
  MapPin,
  Copy,
  Sparkles,
  Loader2,
  AlertCircle,
  Home,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import axios from "axios";
import { authHeaders } from "@/lib/core/orders";

interface OrderItem {
  product?: {
    _id: string;
    name?: string;
    price?: number;
    images?: string[];
    brand?: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  trackingId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  paymentMethod?: string;
  status: string;
  isCancelled?: boolean;
  createdAt: string;
}

type FetchState = "loading" | "error" | "ready";

const statusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const paymentLabel = (method?: string) =>
  method === "online" ? "Online Payment" : "Cash on Delivery";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const { success, error } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<FetchState>("loading");
  const [copyText, setCopyText] = useState("Copy");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`,
          {
            signal: controller.signal,
            headers: await authHeaders()
          },
        );
        const json = res.data
        if (!active) return;

        if (json && json.data) {
          setOrder(json.data as Order);
          setState("ready");
        } else {
          throw new Error("Order not found");
        }
      } catch {
        if (active) setState("error");
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [params.id]);

  const handleCopyTracking = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.trackingId);
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy"), 1500);
    } catch {
      error("Failed to copy tracking ID.");
    }
  };

  const handleCancelOrder = async () => {
    if (!order || isCancelling) return;
    setIsCancelling(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      const json = res.ok ? await res.json() : null;

      if (res.ok && json?.data) {
        success("Order cancelled successfully.");
        setOrder(json.data as Order);
      } else {
        error(json?.message || "Failed to cancel order.");
      }
    } catch {
      error("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const cancelled = order?.status === "cancelled";

  const stepActive = (index: number) => {
    if (!order || cancelled) return false;
    const s = order.status;
    if (index === 0) return true;
    if (index === 1) return ["shipped", "out_for_delivery", "delivered"].includes(s);
    return s === "delivered";
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (state === "error" || !order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-background text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div>
          <p className="text-lg font-black">Order not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This order could not be loaded or doesn&apos;t belong to you.
          </p>
        </div>
        <Link
          href="/userDashboard/orders"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const inTransit = ["shipped", "out_for_delivery", "delivered"].includes(order.status);

  return (
    <div className="min-h-screen space-y-7 bg-background">
      {/* Back */}
      <Link
        href="/userDashboard/orders"
        className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border bg-card transition-all group-hover:-translate-x-1 group-hover:border-primary/40 group-hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
        </span>
        Back to Orders
      </Link>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" />
              Order Tracking
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Order Details<span className="text-primary">.</span>
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Order ID{" "}
              <span className="font-mono font-bold text-foreground">
                #{order.trackingId}
              </span>
            </p>
          </div>

          {cancelled ? (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-bold text-rose-500 shadow-sm shadow-rose-500/10">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              {statusLabel(order.status)}
            </div>
          ) : (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-500 shadow-sm shadow-blue-500/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
              </span>
              {statusLabel(order.status)}
            </div>
          )}

          {!cancelled && (
            <button
              onClick={handleCancelOrder}
              disabled={!["pending", "confirmed"].includes(order.status) || isCancelling}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-sm font-bold text-rose-500 transition-all hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-rose-500/5 disabled:hover:text-rose-500"
            >
              {isCancelling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-bold">Delivery Status</h2>
            <p className="text-xs text-muted-foreground">
              {cancelled
                ? "This order was cancelled"
                : inTransit
                  ? "Your package is on the way"
                  : "Your order is being processed"}
            </p>
          </div>

          <Package className="h-5 w-5 text-primary" />
        </div>

        <div className="relative grid grid-cols-3 gap-2">
          <div
            className={`absolute left-[16%] right-[16%] top-5 h-0.5 ${
              cancelled
                ? "bg-muted"
                : "bg-gradient-to-r from-emerald-500 via-blue-500 to-muted"
            }`}
          />

          {[
            { label: "Ordered", icon: CheckCircle2 },
            { label: "In Transit", icon: Truck },
            { label: "Delivered", icon: MapPin },
          ].map((step, index) => {
            const Icon = step.icon;
            const active = stepActive(index);

            return (
              <div
                key={step.label}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-card shadow-sm ${
                    active
                      ? "bg-primary text-primary-foreground shadow-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span
                  className={`text-[11px] font-bold ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
            <Calendar className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Order Date
          </p>

          <p className="mt-1 font-bold">{formatDate(order.createdAt)}</p>
        </div>

        <div className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CreditCard className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="font-bold">
              {order.paymentMethod === "online" ? "Paid" : "Pay on Delivery"}
            </span>
            {order.paymentMethod === "online" && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            )}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {paymentLabel(order.paymentMethod)}
          </p>
        </div>

        <div className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Truck className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tracking ID
          </p>

          <div className="mt-1 flex items-center gap-2">
            <p className="font-mono text-sm font-bold">{order.trackingId}</p>

            <button
              onClick={handleCopyTracking}
              aria-label="Copy tracking ID"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="mt-1 text-xs text-blue-500">{copyText} tracking ID</p>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Shipping Address
              </p>
              <p className="font-bold">
                {order.shippingAddress.fullName || "Customer"}
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {order.shippingAddress.address},{" "}
            {order.shippingAddress.city} — {order.shippingAddress.phone}
          </p>
        </div>
      )}

      {/* Products */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-bold">Products</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {order.items.length} items in this order
            </p>
          </div>

          <Package className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Quantity</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4 text-right">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {order.items.map((item, index) => {
                const product = item.product as
                  | { _id?: string; name?: string; images?: string[]; brand?: string }
                  | undefined;
                const image = product?.images?.[0];
                const name = product?.name || "Product";
                const lineTotal = (item.quantity || 1) * item.price;

                return (
                  <tr
                    key={product?._id || `${item.price}-${index}`}
                    className="group transition-colors hover:bg-muted/20"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                            <Package className="h-5 w-5" />
                          </div>
                        )}

                        <div>
                          <span className="font-bold">{name}</span>
                          {product?.brand && (
                            <p className="text-[11px] text-muted-foreground">
                              {product.brand}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5 font-medium text-muted-foreground">
                      ×{item.quantity}
                    </td>

                    <td className="px-5 py-5 font-medium">
                      ${item.price.toFixed(2)}
                    </td>

                    <td className="px-5 py-5 text-right font-bold">
                      ${lineTotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y md:hidden">
          {order.items.map((item, index) => {
            const product = item.product as
              | { _id?: string; name?: string; images?: string[] }
              | undefined;
            const image = product?.images?.[0];
            const name = product?.name || "Product";
            const lineTotal = (item.quantity || 1) * item.price;

            return (
              <div key={product?._id || `${item.price}-${index}`} className="p-4">
                <div className="flex gap-3">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={name}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-tight">{name}</p>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Qty: ×{item.quantity}
                      </span>

                      <span className="font-bold">${lineTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="relative overflow-hidden border-t bg-gradient-to-r from-primary/[0.06] via-background to-blue-500/[0.06] p-5 sm:p-6">
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Total
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Including all applicable charges
              </p>
            </div>

            <span className="text-2xl font-black tracking-tight text-primary sm:text-3xl">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}