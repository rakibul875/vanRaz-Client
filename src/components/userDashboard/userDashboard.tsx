import React from "react";
// import all things which are needed
import {
  User,
  Store,
  PlusCircle,
  ArrowRight,
  ShoppingBag,
  Heart,
  Clock,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";
import { Shop } from "../../../types";
import { ShopStatusBadge } from "../shopStatusBadge";
import Image from "next/image";

interface UserDashboardViewProps {
  shop?: Shop | null;
  onCreateShopClick?: () => void;
  onOpenSellerDashboard?: () => void;
  onEditShop?: () => void;
  onOpenCloudinarySettings?: () => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  shop,
  onCreateShopClick,
  onOpenSellerDashboard,
  onEditShop,
  onOpenCloudinarySettings,
}) => {
  const formatCurrency = (val?: number) => {
    const numericValue =
      typeof val === "number" && Number.isFinite(val) ? val : 0;
    return `৳${numericValue.toLocaleString()}`;
  };

  return (
    <div id="user-dashboard-view" className="space-y-6 max-w-5xl mx-auto">
      {/* User Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/20">
              SH
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Shamsul Haque
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                Member 2
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              webdevlopershamsul@gmail.com • Customer & Merchant Account
            </p>
          </div>
        </div>

        {/* User Summary Stats */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Orders Placed
            </span>
            <span className="text-lg font-bold text-slate-800">8 orders</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Wishlist
            </span>
            <span className="text-lg font-bold text-slate-800">14 items</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Reward Points
            </span>
            <span className="text-lg font-bold text-indigo-600">650 pts</span>
          </div>
        </div>
      </div>

      {/* Primary Flow Callout: User Dashboard -> My Shop -> Create Shop */}
      <div className="rounded-2xl bg-linear-to-r from-indigo-50/80 to-sky-50/80 border border-indigo-100 p-4 text-xs text-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <span className="px-2 py-1 bg-white rounded-lg border border-indigo-200 shadow-2xs font-semibold text-indigo-700">
            User Dashboard
          </span>
          <ArrowRight size={14} className="text-indigo-400" />
          <span className="px-2 py-1 bg-white rounded-lg border border-indigo-200 shadow-2xs font-semibold text-indigo-700">
            My Shop
          </span>
          <ArrowRight size={14} className="text-indigo-400" />
          <span className="px-2 py-1 bg-indigo-600 text-white rounded-lg shadow-2xs font-semibold">
            {shop ? "Seller Dashboard" : "Create Shop"}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenCloudinarySettings}
          className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold underline self-start sm:self-auto"
        >
          Configure Cloudinary CDN
        </button>
      </div>

      {/* MY SHOP SECTION */}
      <div
        id="my-shop-section"
        className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Store size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Shop</h2>
              <p className="text-xs text-slate-500">
                Manage your vendor storefront, monitor status, and access seller
                dashboard
              </p>
            </div>
          </div>

          <button
            type="button"
            id="user-dashboard-create-shop-btn"
            onClick={onCreateShopClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <PlusCircle size={15} />
            <span>{shop ? "Create Another Shop" : "Create Shop"}</span>
          </button>
        </div>

        {shop ? (
          /* Active Shop Card */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 md:p-6 transition-all hover:border-indigo-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <Image
                  src={shop.logoUrl}
                  alt={shop.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base md:text-lg font-bold text-slate-900">
                      {shop.name}
                    </h3>
                    <ShopStatusBadge status={shop.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xl">
                    {shop.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                    <span>
                      Category: <strong>{shop.category}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Products: <strong>{shop.totalProducts}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Total Sales:{" "}
                      <strong>{formatCurrency(shop.totalSales)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                <button
                  type="button"
                  id="open-seller-dashboard-btn"
                  onClick={onOpenSellerDashboard}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
                >
                  <Store size={15} />
                  <span>Open Seller Dashboard</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Empty State: Prompt to Create Shop */
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Store size={28} />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              You don't have an active shop yet
            </h3>

            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              Launch your vendor storefront today. Upload your brand logo and
              banner with Cloudinary, set up your shop profile, and start
              selling.
            </p>
            <button
              type="button"
              id="empty-state-create-shop-btn"
              onClick={onCreateShopClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
            >
              <PlusCircle size={16} />
              <span>Create Shop Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Buyer Quick Orders info to demonstrate full User Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <ShoppingBag size={16} className="text-slate-600" />
            <span>My Buyer Purchases</span>
          </h3>
          <p className="text-xs text-slate-500">
            Track your customer orders placed across other vendor shops on the
            platform.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-amber-500" />
            <span>Seller Privileges</span>
          </h3>
          <p className="text-xs text-slate-500">
            Zero setup fee, Cloudinary CDN asset hosting, real-time analytics,
            and automated payouts.
          </p>
        </div>
      </div>
    </div>
  );
};
