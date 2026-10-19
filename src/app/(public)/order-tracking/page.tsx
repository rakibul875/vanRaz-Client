"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Check,
  ArrowLeft,
} from "lucide-react";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered";

type TrackingStep = {
  status: OrderStatus;
  title: string;
  description: string;
  date?: string;
};

const statusOrder: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const trackingSteps: TrackingStep[] = [
  {
    status: "Pending",
    title: "Order Placed",
    description: "Your order has been received and logged in our system.",
    date: "Just now",
  },
  {
    status: "Confirmed",
    title: "Order Confirmed",
    description: "Seller has accepted and verified the order.",
    date: "Estimated +2 hours",
  },
  {
    status: "Processing",
    title: "Processing & Packaging",
    description: "Items are inspected, packaged, and labeled for dispatch.",
    date: "Estimated next day",
  },
  {
    status: "Shipped",
    title: "Shipped & In Transit",
    description: "Package has departed the distribution hub.",
    date: "Estimated 2 days",
  },
  {
    status: "Out for Delivery",
    title: "Out for Delivery",
    description: "Delivery courier is heading towards your shipping address.",
    date: "Estimated 3 days",
  },
  {
    status: "Delivered",
    title: "Delivered",
    description: "Package handed over to the recipient.",
    date: "Pending delivery",
  },
];

interface OrderCustomer {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
}

interface OrderRecord {
  trackingId: string;
  orderId: string;
  status: OrderStatus;
  total: number;
  customer?: OrderCustomer;
  placedAt: string;
  estimatedDelivery: string;
  createdAt?: string;
}

const formatStatus = (status: string): OrderStatus => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "out_for_delivery":
      return "Out for Delivery";
    case "delivered":
      return "Delivered";
    default:
      return "Processing";
  }
};

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [trackingId, setTrackingId] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const trackOrderById = useCallback(async (idToTrack: string) => {
    const value = idToTrack.trim().toUpperCase();

    if (!value) {
      setError("Please enter a valid tracking ID.");
      setActiveOrder(null);
      return;
    }

    setLoading(true);
    setError("");
    setActiveOrder(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error("API URL is not configured");
      }

      const res = await fetch(
        `${API_URL}/orders/track/${encodeURIComponent(value)}`,
      );

      if (!res.ok) {
        setError(
          `No order found with tracking ID: ${value}.`,
        );
        return;
      }

      const json = await res.json();
      const data = json.data;

      if (!data) {
        setError(`No order found with tracking ID: ${value}.`);
        return;
      }

      setActiveOrder({
        trackingId: data.trackingId,
        orderId: "#" + data.trackingId,
        status: formatStatus(data.status || "processing"),
        total: Number(data.totalAmount ?? 0),
        customer: data.shippingAddress,
        placedAt: data.createdAt
          ? new Date(data.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Today",
        estimatedDelivery: "3 - 5 Business Days",
      });
    } catch (e) {
      console.error("Order tracking failed:", e);
      setError("Could not reach the tracking service. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialId) {
      const timer = setTimeout(() => {
        void trackOrderById(initialId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialId, trackOrderById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void trackOrderById(trackingId);
  };

  const currentStatusIndex = activeOrder
    ? statusOrder.indexOf(activeOrder.status)
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#ff594d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-16 h-16 bg-red-50 text-[#ff594d] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your Tracking ID or Order ID below to get real-time delivery status updates.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. TRK-2026-00125"
              className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-white outline-none focus:border-[#ff594d] shadow-sm uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff594d] hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-md shadow-red-500/20 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>

        {error && (
          <p className="text-xs text-rose-500 font-medium mt-3">{error}</p>
        )}
      </div>

      {/* Order Status Display */}
      {activeOrder && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Tracking Number
                </span>
                <h3 className="text-lg font-black text-slate-900 font-mono">
                  {activeOrder.trackingId}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                  {activeOrder.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 text-xs">
              <div>
                <span className="text-slate-400 font-medium block mb-1">
                  Order Number
                </span>
                <span className="font-bold text-slate-800">
                  {activeOrder.orderId}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block mb-1">
                  Order Placed
                </span>
                <span className="font-bold text-slate-800">
                  {activeOrder.placedAt}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block mb-1">
                  Estimated Delivery
                </span>
                <span className="font-bold text-[#ff594d]">
                  {activeOrder.estimatedDelivery}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Visual Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-8">
              Delivery Timeline Progress
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[15px] sm:before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {trackingSteps.map((step, idx) => {
                const isCompleted = idx <= currentStatusIndex;

                return (
                  <div key={step.status} className="relative flex items-start gap-4">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[27px] sm:-left-[31px] top-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs transition-colors ${
                        isCompleted
                          ? "bg-[#ff594d] text-white ring-4 ring-red-100"
                          : "bg-white border-2 border-slate-300 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    {/* Step details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4
                          className={`text-sm font-bold ${
                            isCompleted ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        {step.date && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            {step.date}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <main className="min-h-screen bg-[#fcfdfd]">
      <Suspense fallback={<div className="p-20 text-center text-slate-400">Loading tracking engine...</div>}>
        <TrackingContent />
      </Suspense>
    </main>
  );
}