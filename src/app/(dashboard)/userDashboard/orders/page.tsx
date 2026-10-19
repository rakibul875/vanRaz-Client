"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Package,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  ShoppingBag,
  Loader2,
  RefreshCw,
  PackageX,
  AlertCircle,
} from "lucide-react";
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
  paymentMethod?: string;
  status: string;
  isCancelled?: boolean;
  createdAt: string;
}

type FetchState = "loading" | "error" | "ready";

const statusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const statusTone = (status: string) => {
  const s = status.toLowerCase();

  if (s === "delivered") {
    return {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      pulse: false,
    };
  }

  if (s === "cancelled") {
    return {
      badge: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
      pulse: false,
    };
  }

  if (s === "shipped" || s === "out_for_delivery") {
    return {
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
      pulse: true,
    };
  }

  return {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    pulse: true,
  };
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const orderItemCount = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + (item.quantity || 1), 0);

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [state, setState] = useState<FetchState>("loading");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    (async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`,
          {
            signal: controller.signal,
            headers: await authHeaders(),
          },
        );

        if (!active) return;

        const json = res.data;

        if (json && Array.isArray(json.data)) {
          setOrders(json.data as Order[]);
          setState("ready");
        } else {
          throw new Error("Invalid response");
        }
      } catch {
        if (active) setState("error");
      }
    })();

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [refreshKey]);

  const retry = useCallback(() => {
    setState("loading");
    setRefreshKey((key) => key + 1);
  }, []);

  const delivered = orders.filter(
    (o) => o.status.toLowerCase() === "delivered",
  ).length;

  const pending = orders.filter((o) => {
    const status = o.status.toLowerCase();
    return status !== "delivered" && status !== "cancelled";
  }).length;

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              <ShoppingBag className="h-4 w-4" />
              Purchase History
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Track and manage your recent purchases.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-600">
            <Package className="h-4 w-4 text-slate-500" />
            {state === "ready" ? `${orders.length} total orders` : "Loading..."}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Orders */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {state === "ready" ? orders.length : "—"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  All purchases
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Delivered */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Delivered
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {state === "ready" ? delivered : "—"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Successfully completed
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Active Orders
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {state === "ready" ? pending : "—"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Currently processing
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Container */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Recent Orders
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                View details and track your purchases
              </p>
            </div>

            <div className="hidden rounded-lg border border-slate-200 bg-slate-50 p-2 sm:flex">
              <ShoppingBag className="h-4 w-4 text-slate-500" />
            </div>
          </div>

          {/* Error */}
          {state === "error" && (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertCircle className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900">
                Unable to load orders
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Something went wrong while loading your order history.
              </p>

              <button
                onClick={retry}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {state === "ready" && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <PackageX className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                No orders yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                You haven&apos;t placed any orders yet. Browse our products and
                make your first purchase.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Start Shopping
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Loading */}
          {state === "loading" && (
            <div className="flex flex-col items-center justify-center px-6 py-20">
              <Loader2 className="h-7 w-7 animate-spin text-slate-400" />

              <p className="mt-3 text-sm text-slate-500">
                Loading your orders...
              </p>
            </div>
          )}

          {/* Desktop Table */}
          {state === "ready" && orders.length > 0 && (
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50/70">
                    <tr>
                      <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Order
                      </th>

                      <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Date
                      </th>

                      <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Items
                      </th>

                      <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Total
                      </th>

                      <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => {
                      const tone = statusTone(order.status);
                      const items = orderItemCount(order.items);

                      return (
                        <tr
                          key={order._id}
                          className="transition-colors hover:bg-slate-50/70"
                        >
                          {/* Order */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
                                <Package className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="font-mono text-sm font-semibold text-slate-900">
                                  {order.trackingId}
                                </p>

                                <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
                                  {order.items[0]?.product?.name || "Purchase"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-5 text-sm text-slate-500">
                            {formatDate(order.createdAt)}
                          </td>

                          {/* Items */}
                          <td className="px-6 py-5">
                            <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {items} {items === 1 ? "item" : "items"}
                            </span>
                          </td>

                          {/* Total */}
                          <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                            ${order.totalAmount.toFixed(2)}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold ${tone.badge}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${tone.dot} ${
                                  tone.pulse ? "animate-pulse" : ""
                                }`}
                              />

                              {statusLabel(order.status)}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-5 text-right">
                            <Link
                              href={`/userDashboard/orders/${order._id}`}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile Cards */}
          {state === "ready" && orders.length > 0 && (
            <div className="divide-y divide-slate-100 md:hidden">
              {orders.map((order) => {
                const tone = statusTone(order.status);
                const items = orderItemCount(order.items);

                return (
                  <div key={order._id} className="p-4">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                        <Package className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-mono text-sm font-semibold text-slate-900">
                              {order.trackingId}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold ${tone.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${tone.dot}`}
                            />

                            {statusLabel(order.status)}
                          </span>
                        </div>

                        <p className="mt-3 truncate text-xs text-slate-500">
                          {order.items[0]?.product?.name || "Purchase"}
                        </p>

                        <div className="mt-4 flex items-end justify-between gap-3">
                          <div className="flex gap-7">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Total
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-900">
                                ${order.totalAmount.toFixed(2)}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Items
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-900">
                                {items}
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/userDashboard/orders/${order._id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {state === "ready" && orders.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-3.5">
              <p className="text-center text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {orders.length}
                </span>{" "}
                recent {orders.length === 1 ? "order" : "orders"}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
