import React, { useState } from "react";

import {
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Edit3,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Plus,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Layers,
  Filter,
  Search,
  Eye,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Order, Product, Shop, ShopStatus } from "../../types";
import { ShopStatusAlert } from "./shopStatusAlert";

import Image from "next/image";
import { ShopStatusBadge } from "./shopStatusBadge";

interface SellerDashboardViewProps {
  shop?: Shop;
  products?: Product[];
  orders?: Order[];
  onStatusChange?: (status: ShopStatus) => void;
  onEditShop?: () => void;
  onAddProduct?: () => void;
  onOpenCloudinarySettings?: () => void;
  onNavigateToUserDashboard?: () => void;
}

export const SellerDashboardView: React.FC<SellerDashboardViewProps> = ({
  shop,
  products = [],
  orders = [],
  onStatusChange,
  onEditShop,
  onAddProduct,
  onOpenCloudinarySettings,
  onNavigateToUserDashboard,
}) => {
  const safeShop = shop ?? ({} as Shop);
  const safeProducts = products ?? [];
  const safeOrders = orders ?? [];

  const handleStatusChange = (newStatus: ShopStatus) => {
    onStatusChange?.(newStatus);
  };

  // (safeOrders);

  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Format currency
  const formatCurrency = (val?: number) => {
    const numericValue =
      typeof val === "number" && Number.isFinite(val) ? val : 0;



    return `$${numericValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  const formatDate = (dateValue?: string) => {
    if (!dateValue) return "Not set";

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return "Not set";

    return parsedDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredProducts = safeProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && p.status === statusFilter;
  });

  return (
    <div id="seller-dashboard-container" className="space-y-6">
      {/* 1. Shop Status Alert with Testing Bar */}
      <ShopStatusAlert
        currentStatus={safeShop.status}
        statusReason={safeShop.statusReason}
        onStatusChange={handleStatusChange}
        onEditShop={onEditShop}
      />

      {/* 2. Shop Overview (Banner + Logo + Identity) */}
      <div
        id="shop-overview-header"
        className="relative bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
      >
        {/* Banner */}
        <div className="relative h-48 md:h-60 w-full bg-slate-200 overflow-hidden">
          <Image
            src={safeShop.bannerUrl}
            alt={`${safeShop.name} banner`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            width={800}
            height={300}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />

          {/* Quick Banner Action */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              id="edit-banner-btn"
              onClick={onEditShop}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-all"
            >
              <Edit3 size={13} />
              <span>Edit Store Branding</span>
            </button>
          </div>
        </div>

        {/* Header Profile Content */}
        <div className="px-6 md:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 md:-mt-20 mb-4">
            {/* Logo and Name */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                <Image
                  src={safeShop.logoUrl}
                  alt={`${safeShop.name} logo`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  width={128}
                  height={128}
                />
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                    {safeShop.name}
                  </h1>
                  <ShopStatusBadge status={safeShop.status} size="md" />
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <ShieldCheck size={13} />
                    Verified Merchant
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>{safeShop.category}</span>
                  <span>•</span>
                  <span>Store ID: {safeShop.id}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    {safeShop.rating} ({safeShop.reviewCount} reviews)
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
              <button
                id="edit-shop-info-btn"
                onClick={onEditShop}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-colors"
              >
                <Edit3 size={14} />
                <span>Edit Shop</span>
              </button>
              <button
                id="add-product-quick-btn"
                onClick={onAddProduct}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                <Plus size={15} />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Metrics: Total Products, Total Orders, Total Sales, Shop Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Sales */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Sales
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(safeShop.totalSales)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
              <ArrowUpRight size={14} />
              <span>+18.4% from last month</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 2: Total Orders */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {safeShop.totalOrders}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="font-semibold text-amber-600">12 Pending</span>
              <span>•</span>
              <span className="text-emerald-600">136 Delivered</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 3: Total Products */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Package size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {safeProducts.length}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="text-emerald-600 font-medium">
                {safeProducts.filter((p) => p.status === "In Stock").length} In
                Stock
              </span>
              <span>•</span>
              <span className="text-rose-600 font-medium">
                {
                  safeProducts.filter(
                    (p) =>
                      p.status === "Low Stock" || p.status === "Out of Stock",
                  ).length
                }{" "}
                Low/Out
              </span>
            </div>
          </div>
        </motion.div>

        {/* Metric 4: Shop Status Widget */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Shop Status
            </span>
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <Store size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <ShopStatusBadge status={safeShop.status} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-2 truncate">
              {safeShop.status === "Active"
                ? "Accepting orders nationwide"
                : safeShop.statusReason || "Status managed"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* 4. Shop Information Card */}
      <div
        id="shop-information-card"
        className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Store size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Shop Information
              </h2>
              <p className="text-xs text-slate-500">
                Official business profile, credentials, and contact coordinates
              </p>
            </div>
          </div>

          <button
            id="edit-shop-info-card-btn"
            onClick={onEditShop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            <Edit3 size={13} />
            <span>Update Info</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          {/* Shop Description */}
          <div className="lg:col-span-3 bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Store Description
            </span>
            <p className="text-slate-700 text-sm leading-relaxed">
              {safeShop.description}
            </p>
          </div>

          {/* Contact Phone */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
              <Phone size={16} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                Phone Number
              </span>
              <span className="font-semibold text-slate-800">
                {safeShop.phone}
              </span>
              <p className="text-[11px] text-emerald-600 mt-0.5">
                Verified for SMS dispatch
              </p>
            </div>
          </div>

          {/* Shop Address */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
              <MapPin size={16} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                Store / Warehouse Address
              </span>
              <span className="font-semibold text-slate-800 leading-snug block">
                {safeShop.address}
              </span>
            </div>
          </div>

          {/* Category & Established */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
              <Calendar size={16} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                Seller Registration
              </span>
              <span className="font-semibold text-slate-800">
                {formatDate(safeShop.createdAt)}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Seller: {safeShop.sellerName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Tabs: Overview / Products / Orders */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-6">
            <button
              id="tab-overview-btn"
              onClick={() => setActiveTab("overview")}
              className={`py-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Shop Overview
            </button>
            <button
              id="tab-products-btn"
              onClick={() => setActiveTab("products")}
              className={`py-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "products"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Products Catalog</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600">
                {safeProducts.length}
              </span>
            </button>
            <button
              id="tab-orders-btn"
              onClick={() => setActiveTab("orders")}
              className={`py-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "orders"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Recent Orders</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600">
                {safeOrders.length}
              </span>
            </button>
          </div>

          {activeTab === "products" && (
            <button
              id="add-product-tab-header-btn"
              onClick={onAddProduct}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs"
            >
              <Plus size={14} />
              <span>Add Product</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Products in Shop */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-500" />
                      <span>Top Performing Products</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("products")}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {safeProducts.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {product.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-900">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-medium">
                            {product.salesCount} sold
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Customer Orders */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <ShoppingBag size={16} className="text-indigo-600" />
                      <span>Recent Store Orders</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {safeOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {order.customerName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {order.orderNumber} • {order.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-900">
                            {formatCurrency(order.totalAmount)}
                          </p>
                          <span
                            className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}

          {activeTab === "products" && (
            <div className="space-y-4">
              {/* Filter and Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
                  >
                    <option value="all">All Inventory</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Sales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Image
                              width={40}
                              height={40}
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />

                            <span className="font-semibold text-slate-900 line-clamp-1">
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {p.category}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {formatCurrency(p.price)}
                        </td>

                        <td className="px-4 py-3 font-mono">{p.stock} units</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              p.status === "In Stock"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : p.status === "Low Stock"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          {p.salesCount} sold
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}

          {activeTab === "orders" && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {safeOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-semibold text-indigo-600">
                        {o.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {o.customerName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {o.customerEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{o.itemsCount} items</td>
                      <td className="px-4 py-3 text-slate-500">{o.date}</td>

                      <td className="px-4 py-3 font-bold text-slate-900">
                        {formatCurrency(o.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            o.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : o.status === "Shipped"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
