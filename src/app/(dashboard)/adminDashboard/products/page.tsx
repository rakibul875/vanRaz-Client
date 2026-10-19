"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Store,
} from "lucide-react";
import {
  fetchAdminProductsAPI,
  approveProductAPI,
  rejectProductAPI,
} from "@/services/adminService";
import { AdminProduct } from "@/types/admin";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = authClient.useSession();
  const token = session?.session?.token;

  // Modals
  const [previewProduct, setPreviewProduct] = useState<AdminProduct | null>(
    null,
  );
  const [rejectModalProduct, setRejectModalProduct] =
    useState<AdminProduct | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProducts = async () => {
    try {
      const res = await fetchAdminProductsAPI(token);
      setProducts(res.products);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleApprove = async (product: AdminProduct) => {
    await approveProductAPI(product.id, token);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: "Approved" } : p)),
    );
    showToast(`Product "${product.name}" is now APPROVED & visible to buyers!`);
    if (previewProduct?.id === product.id) {
      setPreviewProduct((prev) =>
        prev ? { ...prev, status: "Approved" } : null,
      );
    }
  };

  const handleOpenReject = (product: AdminProduct) => {
    setRejectModalProduct(product);
    setRejectionReason("");
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalProduct) return;
    if (!rejectionReason.trim()) {
      showToast("Please specify a rejection reason.", "error");
      return;
    }
    await rejectProductAPI(
      rejectModalProduct.id,
      rejectionReason.trim(),
      token,
    );
    setProducts((prev) =>
      prev.map((p) =>
        p.id === rejectModalProduct.id
          ? {
              ...p,
              status: "Rejected",
              rejectionReason: rejectionReason.trim(),
            }
          : p,
      ),
    );
    showToast(`Product "${rejectModalProduct.name}" has been REJECTED.`);
    setRejectModalProduct(null);
    setRejectionReason("");
    if (previewProduct?.id === rejectModalProduct.id) {
      setPreviewProduct((prev) =>
        prev
          ? {
              ...prev,
              status: "Rejected",
              rejectionReason: rejectionReason.trim(),
            }
          : null,
      );
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesTab =
      activeTab === "ALL" ||
      (activeTab === "Pending" && p.status === "Pending") ||
      (activeTab === "Approved" && p.status === "Approved") ||
      (activeTab === "Rejected" && p.status === "Rejected") ||
      (activeTab === "Hidden" && p.status === "Hidden");

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const pendingCount = products.filter((p) => p.status === "Pending").length;
  const approvedCount = products.filter((p) => p.status === "Approved").length;
  const hiddenCount = products.filter((p) => p.status === "Hidden").length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 shadow-2xl shadow-red-500/10 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-purple-500" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-500" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Product Moderation & Approvals
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Audit newly submitted vendor merchandise, verify pricing &
            descriptions, approve compliant goods, and hide flagged listings.
          </p>
        </div>

        {pendingCount > 0 && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-purple-500 self-start shadow-sm">
            <Clock className="h-4 w-4 text-purple-500" />
            <span>{pendingCount} Awaiting Moderation</span>
          </span>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: "All Products", count: products.length },
            { id: "Pending", label: "Pending Approval", count: pendingCount },
            { id: "Approved", label: "Approved", count: approvedCount },
            { id: "Hidden", label: "Hidden / Delisted", count: hiddenCount },
            {
              id: "Rejected",
              label: "Rejected",
              count: products.filter((p) => p.status === "Rejected").length,
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
            placeholder="Search by product, shop, vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm"
          />
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <Package className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">
              No products found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              There are no products matching your selected filter tab.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Product Thumbnail Banner */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-10 w-10 text-slate-300" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm ${
                      product.status === "Approved"
                        ? "bg-red-500 text-white"
                        : product.status === "Pending"
                          ? "bg-amber-500 text-white"
                          : product.status === "Hidden"
                            ? "bg-slate-700 text-white"
                            : "bg-rose-600 text-white"
                    }`}
                  >
                    {product.status === "Approved" && (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {product.status === "Pending" && (
                      <Clock className="h-3 w-3" />
                    )}
                    {product.status === "Hidden" && (
                      <EyeOff className="h-3 w-3" />
                    )}
                    {product.status === "Rejected" && (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span>{product.status}</span>
                  </span>
                </div>

                {/* Price Pill */}
                <div className="absolute bottom-3 right-3 rounded-lg bg-slate-900/80 px-2.5 py-1 text-xs font-black text-white backdrop-blur">
                  ৳{product.price.toLocaleString()}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mt-0.5">
                    {product.name}
                  </h3>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Store className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">
                        {product.shopName}
                      </span>
                    </span>
                    <span>
                      Stock:
                      <strong className="text-slate-800">
                        {product.stock}
                      </strong>
                    </span>
                  </div>

                  {product.rejectionReason && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-700">
                      <span className="font-bold">Rejection Note:</span>{" "}
                      {product.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Moderation Controls Footer */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewProduct(product)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Reject Button */}
                    <button
                      onClick={() => handleOpenReject(product)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all"
                      title="Reject Product"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>

                    {/* Approve Button */}
                    <button
                      onClick={() => handleApprove(product)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                        product.status === "Approved"
                          ? "border border-red-200 bg-red-50 text-purple-500"
                          : "bg-purple-500 text-white hover:bg-red-700"
                      }`}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">
                  {previewProduct.category}
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  {previewProduct.name}
                </h2>
              </div>
              <button
                onClick={() => setPreviewProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="h-56 w-full rounded-xl overflow-hidden bg-slate-100">
              {previewProduct.imageUrl ? (
                <Image
                  src={previewProduct.imageUrl}
                  alt={previewProduct.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-12 w-12 text-slate-300" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-slate-400 font-medium">
                  Selling Price:
                </span>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  ৳{previewProduct.price.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-slate-400 font-medium">
                  Current Stock:
                </span>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  {previewProduct.stock} Units
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
              <p>
                <span className="text-slate-400">Vendor Store:</span>{" "}
                <strong className="text-slate-800">
                  {previewProduct.shopName}
                </strong>
              </p>
              <p>
                <span className="text-slate-400">Seller Name:</span>{" "}
                <strong className="text-slate-800">
                  {previewProduct.sellerName}
                </strong>
              </p>
              <p>
                <span className="text-slate-400">Created At:</span>{" "}
                <strong className="text-slate-800">
                  {previewProduct.createdAt}
                </strong>
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setPreviewProduct(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleOpenReject(previewProduct);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  handleApprove(previewProduct);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-500 hover:bg-red-700 shadow-md shadow-red-500/20"
              >
                Approve Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleConfirmReject}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reject Product Listing
                </h3>
                <p className="text-xs text-slate-500">
                  Target: {rejectModalProduct.name}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rejection Reason (will be emailed to vendor):
              </label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Inappropriate item category, copyright concern, blurry product photos..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalProduct(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
