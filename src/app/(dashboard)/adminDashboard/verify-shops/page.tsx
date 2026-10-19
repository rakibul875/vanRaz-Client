"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Store,
  Phone,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  Ban,
  AlertTriangle,
  FileText,
  Clock,
} from "lucide-react";
import {
  fetchAdminShopsAPI,
  approveShopAPI,
  rejectShopAPI,
  updateShopStatusAPI,
} from "@/services/adminService";
import { useSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ShopData {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  phone: string;
  status: string;
  rejectionReason?: string;
  rating?: number;
  createdAt: string;
}

interface VerificationResult {
  status: "approved" | "rejected" | "needs_review";
  trustScore: number;
  enhancedData: { shopName: string; description: string; tags: string[] };
  feedback: { reason: string; issuesFound: string[] };
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; icon: React.ElementType }
> = {
  pending: {
    bg: "bg-amber-50 border border-amber-200",
    text: "text-amber-700",
    icon: ShieldAlert,
  },
  approved: {
    bg: "bg-red-50 border border-red-200",
    text: "text-red-700",
    icon: ShieldCheck,
  },
  active: {
    bg: "bg-red-50 border border-red-200",
    text: "text-red-700",
    icon: ShieldCheck,
  },
  rejected: {
    bg: "bg-rose-50 border border-rose-200",
    text: "text-rose-700",
    icon: ShieldX,
  },
  draft: {
    bg: "bg-slate-100 border border-slate-200",
    text: "text-slate-700",
    icon: ShieldAlert,
  },
  suspended: {
    bg: "bg-red-100 border border-red-200",
    text: "text-red-800",
    icon: Ban,
  },
};

export default function VerifyShopsPage() {
  const [shops, setShops] = useState<ShopData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<ShopData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [verification, setVerification] = useState<VerificationResult | null>(
    null,
  );
  const [verifying, setVerifying] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Moderation Modal State
  const [modalAction, setModalAction] = useState<{
    type: "APPROVE" | "REJECT" | "SUSPEND" | "REACTIVATE";
    shop: ShopData;
  } | null>(null);
  const [reasonInput, setReasonInput] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchShops = async () => {
    setLoading(true);
    try {
      const { shops } = await fetchAdminShopsAPI();
      setShops(shops);
    } catch (err) {
      console.warn("Failed to fetch shops from backend:", err);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const runVerification = async (shop: ShopData) => {
    setSelectedShop(shop);
    setVerifying(true);
    setVerification(null);
    try {
      if (API_URL) {
        const res = await fetch(`${API_URL}/shops/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shopName: shop.name,
            description: shop.description,
            address: shop.phone || "",
            phone: shop.phone,
            ownerName: shop.ownerId,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.data) {
          throw new Error(json?.message || "Verification failed");
        }
        setVerification(json.data);
        return;
      }
      throw new Error("Verification service unavailable");
    } catch (err) {
      console.warn("AI verification failed:", err);
      showToast(
        "Verification service unavailable. Please try again later.",
        "error",
      );
    } finally {
      setVerifying(false);
    }
  };

  const { data: session } = useSession();
  const token = session?.session?.token;

  const updateShopStatus = async (
    shopId: string,
    newStatus: string,
    reason?: string,
  ) => {
    setActionLoading(shopId);
    try {
      if (newStatus === "approved" || newStatus === "active") {
        await approveShopAPI(shopId, token);
      } else if (newStatus === "rejected") {
        await rejectShopAPI(
          shopId,
          reason || "Rejected by administrator.",
          token,
        );
      } else {
        await updateShopStatusAPI(
          shopId,
          newStatus,
          reason || "",
          token,
        );
      }
    } catch (err) {
      console.warn("Backend update error:", err);
      showToast("Failed to update shop status.", "error");
    }

    setShops((prev) =>
      prev.map((s) =>
        s._id === shopId
          ? { ...s, status: newStatus, rejectionReason: reason || "" }
          : s,
      ),
    );
    if (selectedShop?._id === shopId) {
      setSelectedShop((prev) =>
        prev
          ? { ...prev, status: newStatus, rejectionReason: reason || "" }
          : null,
      );
    }
    setActionLoading(null);
  };

  // Modal Handlers
  const handleOpenModal = (
    type: "APPROVE" | "REJECT" | "SUSPEND" | "REACTIVATE",
    shop: ShopData,
  ) => {
    setModalAction({ type, shop });
    setReasonInput(
      type === "REJECT"
        ? "Failed verification checks and invalid trade registration."
        : type === "SUSPEND"
          ? "Suspended due to policy violation or fulfillment complaints."
          : "",
    );
  };

  const handleConfirmModalAction = async () => {
    if (!modalAction) return;
    const { type, shop } = modalAction;

    if (type === "APPROVE") {
      await updateShopStatus(shop._id, "approved");
      showToast(`Shop "${shop.name}" has been APPROVED!`);
    } else if (type === "REJECT") {
      if (!reasonInput.trim()) {
        showToast("Please provide a rejection reason.", "error");
        return;
      }
      await updateShopStatus(shop._id, "rejected", reasonInput.trim());
      showToast(`Shop "${shop.name}" has been REJECTED.`);
    } else if (type === "SUSPEND") {
      if (!reasonInput.trim()) {
        showToast("Please provide a suspension reason.", "error");
        return;
      }
      await updateShopStatus(shop._id, "suspended", reasonInput.trim());
      showToast(`Shop "${shop.name}" is now SUSPENDED.`);
    } else if (type === "REACTIVATE") {
      await updateShopStatus(shop._id, "approved");
      showToast(`Shop "${shop.name}" has been REACTIVATED.`);
    }

    setModalAction(null);
    setReasonInput("");
  };

  const pendingShops = shops.filter((s) => s.status === "pending");
  const activeShops = shops.filter(
    (s) => s.status === "active" || s.status === "approved",
  );
  const suspendedShops = shops.filter((s) => s.status === "suspended");
  const rejectedShops = shops.filter((s) => s.status === "rejected");

  const filteredShops = shops.filter((s) => {
    if (activeTab === "pending") return s.status === "pending";
    if (activeTab === "active")
      return s.status === "active" || s.status === "approved";
    if (activeTab === "suspended") return s.status === "suspended";
    if (activeTab === "rejected") return s.status === "rejected";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold shadow-lg transition-all ${
            toastMessage.type === "success"
              ? "bg-slate-900 text-white border border-slate-700"
              : "bg-purple-500 text-white border border-purple-700"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 size={16} className="text-purple-400" />
          ) : (
            <AlertTriangle size={16} className="text-white" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-purple-500" />
            Shop Moderation & Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review pending registrations, evaluate trust score, approve, reject,
            or manage active/suspended vendor shops
          </p>
        </div>
        <button
          type="button"
          onClick={fetchShops}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-colors"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin text-purple-500" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab("pending")}
          className={`rounded-2xl border p-5 shadow-sm cursor-pointer transition-all ${
            activeTab === "pending"
              ? "border-amber-400 bg-amber-50/40 ring-1 ring-amber-400/30"
              : "border-slate-200/80 bg-white hover:border-amber-200"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Pending Review
          </p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {pendingShops.length}
          </p>
        </div>

        <div
          onClick={() => setActiveTab("active")}
          className={`rounded-2xl border p-5 shadow-sm cursor-pointer transition-all ${
            activeTab === "active"
              ? "border-purple-500 bg-red-50/40 ring-1 ring-red-500/30"
              : "border-slate-200/80 bg-white hover:border-red-200"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Active Shops
          </p>
          <p className="text-2xl font-extrabold text-purple-500 mt-1">
            {activeShops.length}
          </p>
        </div>

        <div
          onClick={() => setActiveTab("suspended")}
          className={`rounded-2xl border p-5 shadow-sm cursor-pointer transition-all ${
            activeTab === "suspended"
              ? "border-slate-700 bg-slate-100 ring-1 ring-slate-700/30"
              : "border-slate-200/80 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Suspended
          </p>
          <p className="text-2xl font-extrabold text-slate-700 mt-1">
            {suspendedShops.length}
          </p>
        </div>

        <div
          onClick={() => setActiveTab("ALL")}
          className={`rounded-2xl border p-5 shadow-sm cursor-pointer transition-all ${
            activeTab === "ALL"
              ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900/20"
              : "border-slate-200/80 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Shops
          </p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {shops.length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { key: "ALL", label: `All Shops (${shops.length})` },
          { key: "pending", label: `Pending Review (${pendingShops.length})` },
          { key: "active", label: `Active & Approved (${activeShops.length})` },
          { key: "suspended", label: `Suspended (${suspendedShops.length})` },
          { key: "rejected", label: `Rejected (${rejectedShops.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key
                ? "bg-purple-500 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shop List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
            Showing {filteredShops.length} of {shops.length} Shops
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-xs shadow-sm">
              No shops found under {activeTab} filter.
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredShops.map((shop) => {
                const style = STATUS_STYLES[shop.status] || STATUS_STYLES.draft;
                const StatusIcon = style.icon;
                const isSelected = selectedShop?._id === shop._id;

                return (
                  <button
                    key={shop._id}
                    type="button"
                    onClick={() => runVerification(shop)}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all shadow-sm ${
                      isSelected
                        ? "border-purple-500 bg-red-50/40 ring-1 ring-red-500/20"
                        : "border-slate-200 bg-white hover:border-red-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {shop.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {shop.category}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${style.bg} ${style.text}`}
                      >
                        <StatusIcon size={10} />
                        {shop.status}
                      </span>
                    </div>

                    {shop.status === "pending" && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-purple-500 font-semibold">
                        <Eye size={12} />
                        Click to review & verify
                      </div>
                    )}

                    {shop.status === "suspended" && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-purple-700 font-semibold">
                        <Ban size={12} />
                        Suspended Store
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Verification Detail Panel */}
        <div className="lg:col-span-2">
          {!selectedShop ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
              <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                <Store className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-base font-bold text-slate-800">
                Select a shop to review & moderate
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Click any shop from the left list to review documents, trust
                score, and take moderation actions
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-5 shadow-sm">
              {/* Shop Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedShop.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedShop.category} &middot; Owner:{" "}
                    <span className="font-medium text-slate-700">
                      {selectedShop.ownerId}
                    </span>
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    STATUS_STYLES[selectedShop.status]?.bg || ""
                  } ${STATUS_STYLES[selectedShop.status]?.text || ""}`}
                >
                  {selectedShop.status}
                </span>
              </div>

              {/* Status Reason Alert if rejected or suspended */}
              {selectedShop.rejectionReason && (
                <div
                  className={`rounded-xl p-3.5 border text-xs flex items-start gap-2.5 ${
                    selectedShop.status === "suspended"
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  <AlertTriangle
                    size={15}
                    className="shrink-0 mt-0.5 text-purple-500"
                  />
                  <div>
                    <span className="font-bold">
                      {selectedShop.status === "suspended"
                        ? "Suspension Reason: "
                        : "Rejection Reason: "}
                    </span>
                    {selectedShop.rejectionReason}
                  </div>
                </div>
              )}

              {/* Shop Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Phone Contact
                  </p>
                  <p className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                    <Phone size={13} className="text-slate-400" />
                    {selectedShop.phone || "Not provided"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Registration Date
                  </p>
                  <p className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400" />
                    {new Date(selectedShop.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Description & Business Details
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedShop.description || "No description provided."}
                </p>
              </div>

              {/* Verification Loading */}
              {verifying && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                    <span className="text-xs font-semibold">
                      Running AI verification & compliance check...
                    </span>
                  </div>
                </div>
              )}

              {/* Verification Result */}
              {verification && !verifying && (
                <div className="space-y-4">
                  {/* Trust Score */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Marketplace Trust Score
                      </p>
                      <span
                        className={`text-lg font-extrabold ${
                          verification.trustScore >= 80
                            ? "text-purple-500"
                            : verification.trustScore >= 50
                              ? "text-amber-600"
                              : "text-purple-500"
                        }`}
                      >
                        {verification.trustScore}/100
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          verification.trustScore >= 80
                            ? "bg-purple-500"
                            : verification.trustScore >= 50
                              ? "bg-amber-500"
                              : "bg-purple-500"
                        }`}
                        style={{ width: `${verification.trustScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      {verification.feedback.reason}
                    </p>
                  </div>

                  {/* Issues */}
                  {verification.feedback.issuesFound.length > 0 && (
                    <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
                      <p className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2">
                        Issues Found
                      </p>
                      <ul className="space-y-1.5">
                        {verification.feedback.issuesFound.map((issue, i) => (
                          <li
                            key={i}
                            className="text-xs text-purple-500 flex items-start gap-2"
                          >
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Enhanced Data */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Enhanced Profile Data
                    </p>
                    <div>
                      <p className="text-[10px] text-slate-500 mb-0.5">
                        Shop Name
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {verification.enhancedData.shopName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 mb-0.5">
                        Optimized Description
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {verification.enhancedData.description}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 mb-1">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {verification.enhancedData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-md bg-white text-slate-800 text-[10px] font-semibold border border-slate-200 shadow-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons: Pending Moderation & Active/Suspended Controls */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200">
                {/* When Pending: Approve or Reject Modal */}
                {selectedShop.status === "pending" && (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading === selectedShop._id}
                      onClick={() => handleOpenModal("APPROVE", selectedShop)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-500 text-white shadow-sm transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} />
                      Approve Shop
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === selectedShop._id}
                      onClick={() => handleOpenModal("REJECT", selectedShop)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-sm transition-all disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Reject with Reason
                    </button>
                  </>
                )}

                {/* When Active/Approved: Suspend Control */}
                {(selectedShop.status === "active" ||
                  selectedShop.status === "approved") && (
                  <button
                    type="button"
                    disabled={actionLoading === selectedShop._id}
                    onClick={() => handleOpenModal("SUSPEND", selectedShop)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-purple-500 border border-rose-200 shadow-sm transition-all disabled:opacity-50"
                  >
                    <Ban size={14} />
                    Suspend Store
                  </button>
                )}

                {/* When Suspended: Reactivate Control */}
                {selectedShop.status === "suspended" && (
                  <button
                    type="button"
                    disabled={actionLoading === selectedShop._id}
                    onClick={() => handleOpenModal("REACTIVATE", selectedShop)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-500 hover:purple-500 text-white shadow-sm transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} />
                    Reactivate Store
                  </button>
                )}

                {/* When Rejected: Allow Re-review */}
                {selectedShop.status === "rejected" && (
                  <button
                    type="button"
                    disabled={actionLoading === selectedShop._id}
                    onClick={() => handleOpenModal("APPROVE", selectedShop)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-sm transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} />
                    Re-Approve Shop
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Moderation Modal (Approve / Reject with Reason / Suspend / Reactivate) */}
      {modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  modalAction.type === "APPROVE" ||
                  modalAction.type === "REACTIVATE"
                    ? "bg-red-50 text-purple-500 border border-red-200"
                    : "bg-rose-50 text-purple-500 border border-rose-200"
                }`}
              >
                {modalAction.type === "APPROVE" ||
                modalAction.type === "REACTIVATE" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <AlertTriangle size={20} />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalAction.type === "APPROVE" &&
                    "Approve Shop Registration"}
                  {modalAction.type === "REJECT" && "Reject Shop Registration"}
                  {modalAction.type === "SUSPEND" && "Suspend Vendor Shop"}
                  {modalAction.type === "REACTIVATE" &&
                    "Reactivate Vendor Shop"}
                </h3>
                <p className="text-xs text-slate-500">
                  Target Store:{" "}
                  <span className="font-semibold text-slate-800">
                    {modalAction.shop.name}
                  </span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {modalAction.type === "APPROVE" &&
                "Are you sure you want to approve this shop? Once approved, the vendor can start listing merchandise on VenRaz."}
              {modalAction.type === "REJECT" &&
                "Please specify the rejection reason below. This will be recorded and communicated to the seller."}
              {modalAction.type === "SUSPEND" &&
                "Please provide a reason for suspending this shop. Their listings will be temporarily hidden from the public marketplace."}
              {modalAction.type === "REACTIVATE" &&
                "Are you sure you want to restore and reactivate this vendor shop?"}
            </p>

            {(modalAction.type === "REJECT" ||
              modalAction.type === "SUSPEND") && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Reason for{" "}
                  {modalAction.type === "REJECT" ? "Rejection" : "Suspension"}{" "}
                  <span className="text-purple-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Enter specific policy violation or document issue..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setModalAction(null);
                  setReasonInput("");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmModalAction}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-colors ${
                  modalAction.type === "APPROVE" ||
                  modalAction.type === "REACTIVATE"
                    ? "bg-purple-500 hover:purple-500"
                    : "bg-slate-900 hover:bg-black"
                }`}
              >
                {modalAction.type === "APPROVE" && "Confirm Approval"}
                {modalAction.type === "REJECT" && "Confirm Rejection"}
                {modalAction.type === "SUSPEND" && "Confirm Suspension"}
                {modalAction.type === "REACTIVATE" && "Confirm Reactivation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
