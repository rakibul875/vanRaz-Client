"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Truck,
  CheckCircle2,
  XCircle,
  Calendar,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import {
  getAdminOrders,
  assignOrderTracking,
  fetchAdminOrdersAPI,
  updateOrderStatusAPI,
} from "@/services/adminService";
import { AdminOrder, AdminOrderStatus } from "@/types/admin";
import { authClient } from "@/lib/auth-client";

const COURIER_PROVIDERS = [
  "Pathao Courier",
  "Steadfast Courier",
  "RedX Logistics",
  "Paperfly Delivery",
  "eCourier Express",
  "SA Paribahan",
];

function generateTrackingId(): string {
  return `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`;
}

function getDefaultDeliveryDate(): string {
  return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(() => getAdminOrders());
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Selected Order for Details View
  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<AdminOrder | null>(null);

  // Tracking Assignment Modal
  const [trackingModalOrder, setTrackingModalOrder] =
    useState<AdminOrder | null>(null);
  const [selectedCourier, setSelectedCourier] = useState(COURIER_PROVIDERS[0]);
  const [trackingIdInput, setTrackingIdInput] = useState("");
  const [estimatedDeliveryInput, setEstimatedDeliveryInput] = useState("");
  const { data: session } = authClient.useSession();
  const token = session?.session?.token;
  // console.log(orders, token);
  // Toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadOrders = async (token?: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetchAdminOrdersAPI(activeTab, token);
      console.log(res.orders);
      setOrders(res.orders);
    } catch {
      setOrders(getAdminOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(token);
  }, [activeTab, token]);

  useEffect(() => {
    const handleUpdate = () => loadOrders(token);
    window.addEventListener("venraz_admin_data_updated", handleUpdate);
    return () =>
      window.removeEventListener("venraz_admin_data_updated", handleUpdate);
  }, []);

  // Quick Status Transition
  const handleQuickStatusChange = async (
    orderId: string,
    status: AdminOrderStatus,
  ) => {
    try {
      await updateOrderStatusAPI(orderId, status, token);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o)),
      );
      showToast(`Order ${orderId} updated to ${status}.`, "success");
    } catch (err) {
      showToast("Failed to update order status.", "error");
    }
  };

  const handleOpenTrackingModal = (order: AdminOrder) => {
    setTrackingModalOrder(order);
    setSelectedCourier(order.courier || COURIER_PROVIDERS[0]);
    setTrackingIdInput(order.trackingId || generateTrackingId());
    setEstimatedDeliveryInput(
      order.estimatedDelivery || getDefaultDeliveryDate(),
    );
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder) return;
    if (!trackingIdInput.trim()) {
      showToast("Please enter a valid tracking number.", "error");
      return;
    }

    try {
      await assignOrderTracking(
        trackingModalOrder.id,
        selectedCourier,
        trackingIdInput.trim(),
        estimatedDeliveryInput,
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === trackingModalOrder.id
            ? {
                ...o,
                courier: selectedCourier,
                trackingId: trackingIdInput.trim(),
                estimatedDelivery: estimatedDeliveryInput,
              }
            : o,
        ),
      );

      showToast(
        `Assigned ${selectedCourier} tracking ID ${trackingIdInput.trim()} to order ${trackingModalOrder.orderNumber}!`,
        "success",
      );
      setTrackingModalOrder(null);
    } catch {
      showToast("Failed to assign tracking information.", "error");
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "ALL" ||
      (activeTab === "Processing" && order.orderStatus === "Processing") ||
      (activeTab === "Shipped" && order.orderStatus === "Shipped") ||
      (activeTab === "Delivered" && order.orderStatus === "Delivered") ||
      (activeTab === "Cancelled" && order.orderStatus === "Cancelled");

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.trackingId &&
        order.trackingId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const processingCount = orders.filter(
    (o) => o.orderStatus === "Processing",
  ).length;
  const shippedCount = orders.filter((o) => o.orderStatus === "Shipped").length;
  const deliveredCount = orders.filter(
    (o) => o.orderStatus === "Delivered",
  ).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-5 bg-white ${
            toastMessage.type === "success"
              ? "border-emerald-500/30 text-slate-900 shadow-emerald-500/10"
              : "border-red-500/30 text-slate-900 shadow-red-500/10"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <XCircle className="h-5 w-5 text-purple-500" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-purple-500" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Global Order Logistics & Fulfillment
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Monitor central platform orders across all vendor storefronts,
            update delivery stages, and attach third-party courier tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-purple-500 shadow-sm">
            Total Volume: ৳
            {orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: "All Orders", count: orders.length },
            { id: "Processing", label: "Processing", count: processingCount },
            { id: "Shipped", label: "In Transit", count: shippedCount },
            { id: "Delivered", label: "Delivered", count: deliveredCount },
            {
              id: "Cancelled",
              label: "Cancelled",
              count: orders.filter((o) => o.orderStatus === "Cancelled").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-purple-500 text-white shadow-md shadow-red-500/20"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-purple-500"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search order #, customer, phone, TRK ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & Delivery</th>
                <th className="py-3.5 px-4">Vendor Store</th>
                <th className="py-3.5 px-4">Amount & Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4">Courier & Tracking</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-extrabold text-slate-900 text-xs">
                        {order.orderNumber}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>{order.orderDate}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">
                        {order.customerName}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {order.customerPhone}
                      </p>
                      <p
                        className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5"
                        title={order.shippingAddress}
                      >
                        {order.shippingAddress}
                      </p>
                    </td>

                    {/* Store */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold">
                        {order.shopName}
                      </span>
                    </td>

                    {/* Amount & Payment */}
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-slate-900 text-xs">
                        ৳{order.totalAmount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Fulfillment Status */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleQuickStatusChange(
                            order.id,
                            e.target.value as AdminOrderStatus,
                          )
                        }
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          order.orderStatus === "Delivered"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : order.orderStatus === "Shipped"
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : order.orderStatus === "Processing"
                                ? "bg-amber-50 border-amber-200 text-amber-700"
                                : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Courier & Tracking */}
                    <td className="py-3.5 px-4">
                      {order.trackingId ? (
                        <div>
                          <p className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
                            <Truck className="h-3 w-3 text-purple-500" />
                            <span>{order.courier}</span>
                          </p>
                          <p className="font-mono text-[10px] text-purple-500 mt-0.5 font-bold">
                            {order.trackingId}
                          </p>
                          {order.estimatedDelivery && (
                            <p className="text-[9px] text-slate-400">
                              Est: {order.estimatedDelivery}
                            </p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenTrackingModal(order)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-dashed border-red-300 bg-red-50/50 text-purple-500 text-[10px] font-bold hover:bg-red-50 transition-all"
                        >
                          <Truck className="h-3 w-3" />
                          <span>+ Assign Courier</span>
                        </button>
                      )}
                    </td>

                    {/* Action Controls */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenTrackingModal(order)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-purple-500 transition-all"
                          title="Edit Courier Tracking"
                          aria-label="Edit Courier Tracking"
                        >
                          <Truck className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:border-red-200 hover:bg-red-50 hover:text-purple-500 text-slate-700 text-[11px] font-semibold transition-all"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Assignment Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleSaveTracking}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-purple-500">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Courier Tracking Assignment
                  </h3>
                  <p className="text-xs text-slate-500">
                    Order: {trackingModalOrder.orderNumber} (
                    {trackingModalOrder.customerName})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Courier Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Logistics Partner:
              </label>
              <select
                value={selectedCourier}
                onChange={(e) => setSelectedCourier(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-red-500 focus:bg-white focus:outline-none"
              >
                {COURIER_PROVIDERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Tracking ID with quick generate button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Consignment / Tracking Number:
                </label>
                <button
                  type="button"
                  onClick={() => setTrackingIdInput(generateTrackingId())}
                  className="text-[10px] text-purple-500 font-bold flex items-center gap-1 hover:underline"
                >
                  <Sparkles className="h-3 w-3" /> Auto-Generate
                </button>
              </div>
              <input
                type="text"
                required
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                placeholder="e.g. TRK-8923412"
                className="w-full font-mono rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-red-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Estimated Delivery Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Delivery Date:
              </label>
              <input
                type="date"
                value={estimatedDeliveryInput}
                onChange={(e) => setEstimatedDeliveryInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-red-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-500 hover:bg-red-700 shadow-md shadow-red-500/20"
              >
                Save & Dispatch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Order Details Drawer Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">
                  Order Manifest Details
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedOrderDetails.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-slate-400 font-medium">Customer:</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {selectedOrderDetails.customerName}
                </p>
                <p className="text-[11px] text-slate-500">
                  {selectedOrderDetails.customerPhone}
                </p>
                <p className="text-[11px] text-slate-500">
                  {selectedOrderDetails.customerEmail}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-slate-400 font-medium">
                  Fulfillment Status:
                </span>
                <p className="font-extrabold text-slate-900 mt-0.5">
                  {selectedOrderDetails.orderStatus}
                </p>
                <p className="text-[11px] text-slate-500">
                  Shop: {selectedOrderDetails.shopName}
                </p>
                <p className="text-[11px] text-slate-500">
                  Items: {selectedOrderDetails.itemsCount} Qty
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
              <span className="text-slate-400 font-medium">
                Delivery Destination:
              </span>
              <p className="font-medium text-slate-800">
                {selectedOrderDetails.shippingAddress}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Total Bill:</span>
                <p className="text-lg font-black text-slate-900">
                  ৳{selectedOrderDetails.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  {selectedOrderDetails.paymentStatus}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  {selectedOrderDetails.paymentMethod}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = selectedOrderDetails;
                  setSelectedOrderDetails(null);
                  handleOpenTrackingModal(target);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-500 hover:bg-red-700 shadow-md shadow-red-500/20"
              >
                Manage Logistics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
