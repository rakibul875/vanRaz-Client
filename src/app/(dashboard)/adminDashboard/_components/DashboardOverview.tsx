"use client";

import React from "react";
import Link from "next/link";
import {
  fetchAdminDashboardStatsAPI,
  fetchAdminRevenueChartAPI,
  fetchAdminOrdersAPI,
} from "@/services/adminService";
import { AdminOrder } from "@/types/admin";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronRight,
  Download,
  UserCheck,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors duration-300 group-hover:bg-purple-600 group-hover:text-white">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <h3 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </h3>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function orderStatusClass(status: AdminOrder["orderStatus"]): string {
  switch (status) {
    case "Processing":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Shipped":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Cancelled":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function DashboardOverview() {
  const [dataStats, setDataStats] = React.useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalShops: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingShopsCount: 0,
    pendingProductsCount: 0,
  });
  const [recentOrders, setRecentOrders] = React.useState<AdminOrder[]>([]);
  const [chartData, setChartData] = React.useState<
    { month: string; revenue: number; orders: number }[]
  >([]);
  const [statsLoading, setStatsLoading] = React.useState(true);
  const [ordersLoading, setOrdersLoading] = React.useState(true);
  const [chartLoading, setChartLoading] = React.useState(true);
  const { data: session } = authClient.useSession();
  const token = session?.session?.token;
  React.useEffect(() => {
    async function loadLiveStats() {
      setStatsLoading(true);
      try {
        const live = await fetchAdminDashboardStatsAPI(token);
        setDataStats({
          totalRevenue: live.totalRevenue ?? 0,
          totalUsers: live.totalUsers ?? 0,
          totalShops: live.totalShops ?? 0,
          totalOrders: live.totalOrders ?? 0,
          totalProducts: live.totalProducts ?? 0,
          pendingShopsCount: live.pendingShopsCount ?? 0,
          pendingProductsCount: live.pendingProductsCount ?? 0,
        });
      } catch {
        // keep existing values on failure
      } finally {
        setStatsLoading(false);
      }
    }

    async function loadRecentOrders() {
      setOrdersLoading(true);
      try {
        const { orders } = await fetchAdminOrdersAPI(token);
        setRecentOrders(orders);
      } catch {
        setRecentOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }

    async function loadRevenueChart() {
      setChartLoading(true);
      try {
        const { chart } = await fetchAdminRevenueChartAPI(token);
        setChartData(chart);
      } catch {
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    }

    loadLiveStats();
    loadRevenueChart();
    loadRecentOrders();
  }, [token]);

  const stats: StatCardProps[] = [
    {
      title: "Total Revenue",
      value: `৳${dataStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "from confirmed orders",
    },
    {
      title: "Active Products",
      value: dataStats.totalProducts.toLocaleString(),
      icon: Package,
      description: "products in catalog",
    },
    {
      title: "Total Orders",
      value: dataStats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      description: "all marketplace orders",
    },
    {
      title: "Registered Users & Sellers",
      value: dataStats.totalUsers.toLocaleString(),
      icon: Users,
      description: "active platform accounts",
    },
  ];

  const handleExportReport = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Items",
      "Amount (BDT)",
      "Status",
    ];

    const rows = recentOrders.map((order) => [
      order.orderNumber,
      order.customerName,
      order.customerEmail,
      String(order.itemsCount),
      String(order.totalAmount),
      order.orderStatus,
    ]);

    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const displayedOrders = recentOrders.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-widest text-purple-600">
                Live Overview
              </p>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
              Store Overview
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor your marketplace performance and active metrics in real
              time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected to backend
            </span>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-purple-50/50 hover:border-purple-200 hover:text-purple-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        {statsLoading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl border border-slate-200/80 bg-white"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        )}

        {/* Analytics Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Revenue Overview
                </h2>
                <p className="text-xs text-slate-500">
                  Monthly performance summary
                </p>
              </div>
              <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                ৳{dataStats.totalRevenue.toLocaleString()}
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700">
                YTD
              </span>
            </div>

            {/* Interactive Column Visuals */}
            {chartLoading ? (
              <div className="mt-8 flex h-56 items-end gap-2 border-b border-slate-100 pb-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 animate-pulse rounded-t-md bg-purple-100"
                    style={{ height: `${40 + ((i % 5) * 12)}%` }}
                  />
                ))}
              </div>
            ) : chartData.length === 0 ? (
              <div className="mt-8 flex h-56 items-center justify-center border-b border-slate-100 pb-2">
                <p className="text-xs font-semibold text-slate-400">
                  No revenue data available.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8 flex h-56 items-end gap-2 border-b border-slate-100 pb-2">
                  {chartData.map((item, index) => {
                    const maxRevenue = Math.max(
                      ...chartData.map((point) => point.revenue),
                      1,
                    );
                    const height = Math.max(
                      2,
                      Math.round((item.revenue / maxRevenue) * 100),
                    );
                    return (
                      <div
                        key={index}
                        className="group relative flex h-full flex-1 flex-col justify-end"
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
                          <span className="rounded bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-md whitespace-nowrap">
                            ৳{item.revenue.toLocaleString()}
                          </span>
                        </div>
                        <div
                          style={{ height: `${height}%` }}
                          className={`w-full rounded-t-md transition-all duration-300 ${
                            item.revenue > 0
                              ? "bg-purple-100 group-hover:bg-purple-600"
                              : "bg-slate-100 group-hover:bg-slate-300"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex justify-between text-[11px] font-semibold text-slate-400">
                  {chartData.map((item, index) => (
                    <span key={index}>{item.month}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Platform Health Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Platform Health
              </h2>
              <p className="text-xs text-slate-500">
                System and operation status
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-purple-50/60 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                      <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Store Status
                    </span>
                  </div>
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-bold text-purple-700">
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-amber-50/60 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Pending Sellers
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                    {dataStats.pendingShopsCount} Action Req.
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-rose-50/60 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                      <AlertCircle className="h-5 w-5 text-rose-600" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Pending Product Reviews
                    </span>
                  </div>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                    {dataStats.pendingProductsCount} Pending
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">System Uptime</span>
                <span className="text-slate-900">99.98%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[99.98%] rounded-full bg-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-500">
                Latest transactions completed on your platform
              </p>
            </div>
            <Link
              href="/adminDashboard/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 transition hover:text-purple-700"
            >
              View all orders <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ordersLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-xs font-semibold text-slate-400"
                    >
                      <Loader2 className="mx-auto mb-1 h-5 w-5 animate-spin text-purple-500" />
                      Loading orders...
                    </td>
                  </tr>
                ) : displayedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-xs font-semibold text-slate-400"
                    >
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  displayedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4 text-xs font-bold text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-xs font-bold text-purple-700">
                            {order.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {order.customerName}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-medium text-slate-600">
                          {order.itemsCount} item
                          {order.itemsCount !== 1 ? "s" : ""}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {order.shopName}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-900">
                        ৳{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${orderStatusClass(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Quick Actions
            </h2>
            <p className="text-xs text-slate-500">
              Execute critical management workflows
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleExportReport}
              className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-500/30 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Export Report
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Download recent orders as CSV
                </p>
              </div>
            </button>

            <Link
              href="/adminDashboard/verify-shops"
              className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-500/30 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Approve Sellers
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {dataStats.pendingShopsCount} new seller applications pending
                </p>
              </div>
            </Link>

            <Link
              href="/adminDashboard/products"
              className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-500/30 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Review Products
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {dataStats.pendingProductsCount} products pending review
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
