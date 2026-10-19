"use client";

import {
  AdminUser,
  AdminProduct,
  AdminOrder,
  UserRole,
  UserStatus,
  AdminProductStatus,
  AdminOrderStatus,
} from "@/types/admin";

type AdminProductRaw = Record<string, unknown>;
type AdminOrderRaw = Record<string, unknown>;
type AdminUserRaw = Record<string, unknown>;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getAuthHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const resolvedToken =
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("adminToken")
      : null);
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }
  return headers;
}

async function handleErrorResponse(
  res: Response,
  fallback: string,
): Promise<never> {
  let message = fallback;
  try {
    const json = await res.json();
    if (json && typeof json.message === "string" && json.message) {
      message = json.message;
    }
  } catch {
    // Response had no JSON body
  }
  throw new Error(message);
}

function toDateString(value: unknown): string {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function toTitleCase(value: unknown): string {
  const str = String(value ?? "").toLowerCase();
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

// ============================================================================
// ADMIN DASHBOARD STATISTICS
// GET /api/v1/admin/dashboard-stats
// ============================================================================

export interface AdminDashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalShops: number;
  pendingShopsCount: number;
  totalProducts: number;
  pendingProductsCount: number;
  totalOrders: number;
  processingOrdersCount: number;
  isLiveFromBackend: true;
}

export async function fetchAdminDashboardStatsAPI(
  token?: string,
): Promise<AdminDashboardStats> {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
    method: "GET",
    headers: getAuthHeaders(token),
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch admin dashboard stats");
  }
  const json = await res.json();
  const data = (json?.data ?? {}) as Record<string, unknown>;
  return {
    totalRevenue: Number(data.totalRevenue ?? 0),
    totalUsers: Number(data.totalUsers ?? 0),
    totalShops: Number(data.totalShops ?? 0),
    pendingShopsCount: Number(data.pendingShops ?? 0),
    totalProducts: Number(data.totalProducts ?? 0),
    pendingProductsCount: Number(data.pendingProducts ?? 0),
    totalOrders: Number(data.totalOrders ?? 0),
    processingOrdersCount: 0,
    isLiveFromBackend: true,
  };
}

// ============================================================================
// MONTHLY REVENUE CHART
// GET /api/v1/admin/dashboard-chart
// ============================================================================

export interface AdminRevenueChartPoint {
  month: string;
  revenue: number;
  orders: number;
}

export async function fetchAdminRevenueChartAPI(
  token?: string,
): Promise<{ chart: AdminRevenueChartPoint[] }> {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard-chart`, {
    method: "GET",
    headers: getAuthHeaders(token),
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch revenue chart");
  }
  const json = await res.json();
  const raw = (Array.isArray(json?.data) ? json.data : []) as Array<
    Record<string, unknown>
  >;
  const chart = raw.map((point) => ({
    month: String(point.month ?? ""),
    revenue: Number(point.revenue ?? 0),
    orders: Number(point.orders ?? 0),
  }));
  return { chart };
}

// ============================================================================
// USER MANAGEMENT
// GET /api/v1/admin/users
// PATCH /api/v1/admin/users/:userId/role
// PATCH /api/v1/admin/users/:userId/status
// ============================================================================

export interface AdminUsersFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function fetchAdminUsersAPI(
  filters?: AdminUsersFilters,
  token?: string,
): Promise<{ users: AdminUser[]; total: number }> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.role && filters.role !== "ALL") {
    params.append("role", filters.role.toLowerCase());
  }
  if (filters?.status && filters.status !== "ALL") {
    params.append("status", filters.status.toLowerCase());
  }
  if (filters?.page) params.append("page", String(filters.page));
  params.append("limit", String(filters?.limit ?? 200));

  const res = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(token),
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch users");
  }
  const json = await res.json();
  const rawUsers = (
    Array.isArray(json?.data) ? json.data : []
  ) as AdminUserRaw[];
  const users: AdminUser[] = rawUsers.map((rawUser) => ({
    id: String(rawUser._id ?? rawUser.id ?? ""),
    name: String(rawUser.name ?? "User"),
    email: String(rawUser.email ?? ""),
    phone: String(rawUser.phone ?? ""),
    role: String(rawUser.role ?? "user").toUpperCase() as UserRole,
    status: String(rawUser.status ?? "active").toUpperCase() as UserStatus,
    avatar: String(rawUser.avatar ?? ""),
    joinedDate: toDateString(rawUser.createdAt),
    ordersCount: Number(rawUser.ordersCount ?? 0),
    shopsCount: Number(rawUser.shopsCount ?? 0),
  }));
  return {
    users,
    total: Number(
      (json?.meta as Record<string, unknown>)?.total ?? users.length,
    ),
  };
}

export async function updateUserRoleAPI(
  userId: string,
  newRole: UserRole,
  token?: string,
): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    credentials: "include",
    body: JSON.stringify({ role: newRole.toLowerCase() }),
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to update user role");
  }
  return true;
}

export async function updateUserStatusAPI(
  userId: string,
  newStatus: UserStatus,
  token?: string,
): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    credentials: "include",
    body: JSON.stringify({ status: newStatus.toLowerCase() }),
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to update user status");
  }
  return true;
}

// ============================================================================
// PRODUCT MODERATION
// GET /api/v1/products & GET /api/v1/admin/products/pending
// PATCH /api/v1/admin/products/:productId/approve
// PATCH /api/v1/admin/products/:productId/reject
// ============================================================================

function mapAdminProduct(raw: AdminProductRaw): AdminProduct {
  const seller =
    typeof raw.seller === "object" && raw.seller !== null
      ? (raw.seller as Record<string, unknown>)
      : null;
  const shop =
    typeof raw.shop === "object" && raw.shop !== null
      ? (raw.shop as Record<string, unknown>)
      : null;
  const category =
    typeof raw.category === "object" && raw.category !== null
      ? (raw.category as Record<string, unknown>)
      : null;
  const images = Array.isArray(raw.images) ? (raw.images as unknown[]) : [];
  return {
    id: String(raw._id ?? raw.id ?? ""),
    name: String(raw.name ?? ""),
    sellerName: String(seller?.name ?? "Vendor"),
    shopName: String(shop?.name ?? "VenRaz Store"),
    category: String(category?.name ?? raw.category ?? "General"),
    price: Number(raw.price ?? 0) || 0,
    originalPrice: raw.discount
      ? Math.round(Number(raw.price) * (1 + Number(raw.discount) / 100))
      : undefined,
    stock: Number(raw.stock ?? 0) || 0,
    imageUrl:
      (images.length > 0 && String(images[0])) || String(raw.imageUrl ?? ""),
    status: (raw.status
      ? toTitleCase(raw.status)
      : "Approved") as AdminProductStatus,
    rejectionReason: raw.rejectionReason
      ? String(raw.rejectionReason)
      : undefined,
    createdAt: toDateString(raw.createdAt),
  };
}

export async function fetchAdminProductsAPI(
  token?: string,
): Promise<{ products: AdminProduct[] }> {
  const res = await fetch(`${API_BASE_URL}/products?limit=50`, {
    method: "GET",
  });

  let publicRaw: AdminProductRaw[] = [];
  if (res.ok) {
    const json = await res.json();
    publicRaw = Array.isArray(json?.data)
      ? (json.data as AdminProductRaw[])
      : Array.isArray(json?.data?.products)
        ? (json.data.products as AdminProductRaw[])
        : [];
  } else {
    await handleErrorResponse(res, "Failed to fetch products");
  }

  let pendingRaw: AdminProductRaw[] = [];
  try {
    const pendingRes = await fetch(`${API_BASE_URL}/admin/products/pending`, {
      method: "GET",
      headers: getAuthHeaders(token),
      credentials: "include",
    });
    if (pendingRes.ok) {
      const json = await pendingRes.json();
      pendingRaw = Array.isArray(json?.data)
        ? (json.data as AdminProductRaw[])
        : [];
    }
  } catch {
    // Pending products are optional; ignore failures here
  }

  return {
    products: [...pendingRaw, ...publicRaw].map(mapAdminProduct),
  };
}

export async function approveProductAPI(
  productId: string,
  token?: string,
): Promise<boolean> {
  const res = await fetch(
    `${API_BASE_URL}/admin/products/${productId}/approve`,
    {
      method: "PATCH",
      headers: getAuthHeaders(token),
      credentials: "include",
    },
  );
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to approve product");
  }
  return true;
}

export async function rejectProductAPI(
  productId: string,
  reason: string,
  token?: string,
): Promise<boolean> {
  const res = await fetch(
    `${API_BASE_URL}/admin/products/${productId}/reject`,
    {
      method: "PATCH",
      headers: getAuthHeaders(token),
      credentials: "include",
      body: JSON.stringify({ reason }),
    },
  );
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to reject product");
  }
  return true;
}

// ============================================================================
// ORDER MANAGEMENT
// GET /api/v1/admin/orders
// PATCH /api/v1/admin/orders/:orderId/status
// ============================================================================

let mockAdminOrders: AdminOrder[] | null = null;

function getMockAdminOrders(): AdminOrder[] {
  if (mockAdminOrders) return mockAdminOrders;
  const base: AdminOrder[] = [
    {
      id: "6748f2a11b3c2d4e5f607121",
      orderNumber: "#VR-607121",
      customerName: "Rahim Uddin",
      customerEmail: "rahim@example.com",
      customerPhone: "+8801712345678",
      shippingAddress: "House 12, Road 5, Banani, Dhaka",
      shopName: "TechNest Electronics",
      itemsCount: 2,
      totalAmount: 23500,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "PENDING",
      orderStatus: "Processing",
      courier: "Pathao Courier",
      trackingId: "TRK-4523187",
      estimatedDelivery: new Date(Date.now() + 3 * 86400000)
        .toISOString()
        .split("T")[0],
      orderDate: new Date().toISOString().split("T")[0],
    },
    {
      id: "6748f2a11b3c2d4e5f607122",
      orderNumber: "#VR-607122",
      customerName: "Sadia Rahman",
      customerEmail: "sadia@example.com",
      customerPhone: "+8801812345678",
      shippingAddress: "Flat 4B, Mirpur DOHS, Dhaka",
      shopName: "Fashion Hub BD",
      itemsCount: 3,
      totalAmount: 8900,
      paymentMethod: "Online Payment",
      paymentStatus: "PAID",
      orderStatus: "Shipped",
      orderDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    },
    {
      id: "6748f2a11b3c2d4e5f607123",
      orderNumber: "#VR-607123",
      customerName: "Tanvir Ahmed",
      customerEmail: "tanvir@example.com",
      customerPhone: "+8801912345678",
      shippingAddress: "Road 3, Gulshan 2, Dhaka",
      shopName: "HomeDecor Gallery",
      itemsCount: 1,
      totalAmount: 15400,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "PENDING",
      orderStatus: "Delivered",
      orderDate: new Date(Date.now() - 2 * 86400000)
        .toISOString()
        .split("T")[0],
    },
  ];
  mockAdminOrders = base;
  return base;
}

export function getAdminOrders(): AdminOrder[] {
  return getMockAdminOrders();
}

export async function assignOrderTracking(
  orderId: string,
  courier: string,
  trackingId: string,
  estimatedDelivery?: string,
): Promise<boolean> {
  mockAdminOrders =
    mockAdminOrders?.map((o) =>
      o.id === orderId
        ? {
            ...o,
            courier,
            trackingId,
            estimatedDelivery: estimatedDelivery ?? o.estimatedDelivery,
          }
        : o,
    ) ?? getMockAdminOrders();
  return true;
}

function mapOrderStatus(raw: unknown): AdminOrderStatus {
  const status = String(raw ?? "")
    .toLowerCase()
    .replace(/[_\s]+/g, " ");
  switch (status) {
    case "pending":
    case "confirmed":
    case "processing":
      return "Processing";
    case "shipped":
    case "out for delivery":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Processing";
  }
}

function mapAdminOrder(raw: AdminOrderRaw): AdminOrder {
  const id = String(raw._id ?? raw.id ?? "");
  const user =
    typeof raw.user === "object" && raw.user !== null
      ? (raw.user as Record<string, unknown>)
      : null;
  const shipping =
    typeof raw.shippingAddress === "object" && raw.shippingAddress !== null
      ? (raw.shippingAddress as Record<string, unknown>)
      : null;
  const trackingId = String(raw.trackingId ?? "");
  const paymentRaw = String(raw.paymentMethod ?? "").toLowerCase();
  const items = Array.isArray(raw.items) ? (raw.items as unknown[]) : [];
  const addressParts = [
    String(shipping?.address ?? ""),
    String(shipping?.city ?? ""),
  ]
    .filter(Boolean)
    .join(", ");

  return {
    id,
    orderNumber: trackingId || `#VR-${id.slice(-6).toUpperCase()}`,
    customerName: String(user?.name ?? shipping?.fullName ?? "Guest Customer"),
    customerEmail: String(user?.email ?? raw.guestEmail ?? ""),
    customerPhone: String(user?.phone ?? shipping?.phone ?? ""),
    shippingAddress:
      addressParts || String(raw.shippingAddress ?? "Dhaka, Bangladesh"),
    shopName: String(raw.shopName ?? "VenRaz Store"),
    itemsCount: items.length || Number(raw.itemsCount ?? 1) || 1,
    totalAmount: Number(raw.totalAmount ?? 0),
    paymentMethod:
      paymentRaw === "online"
        ? "Online Payment"
        : paymentRaw === "cash_on_delivery"
          ? "Cash on Delivery"
          : String(raw.paymentMethod ?? "Cash on Delivery"),
    paymentStatus: paymentRaw === "online" ? "PAID" : "PENDING",
    orderStatus: mapOrderStatus(raw.status),
    trackingId,
    orderDate: toDateString(raw.createdAt),
  };
}

const ADMIN_ORDER_STATUS_FILTERS: Record<string, string[]> = {
  Processing: ["pending", "confirmed", "processing"],
  Shipped: ["shipped", "out_for_delivery"],
  Delivered: ["delivered"],
  Cancelled: ["cancelled"],
};

export async function fetchAdminOrdersAPI(
  statusFilter?: string,
  token?: string,
): Promise<{ orders: AdminOrder[]; total: number }> {
  const params = new URLSearchParams();
  const backendStatuses =
    (statusFilter && ADMIN_ORDER_STATUS_FILTERS[statusFilter]) || [];
  if (backendStatuses.length > 0) {
    params.append("status", backendStatuses.join(","));
  }
  params.append("page", "1");
  params.append("limit", "200");

  const res = await fetch(`${API_BASE_URL}/admin/orders?${params.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(token),
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch orders");
  }
  const json = await res.json();
  const rawOrders = (
    Array.isArray(json?.data) ? json.data : []
  ) as AdminOrderRaw[];
  return {
    orders: rawOrders.map(mapAdminOrder),
    total: Number(
      (json?.meta as Record<string, unknown>)?.total ?? rawOrders.length,
    ),
  };
}

export async function updateOrderStatusAPI(
  orderId: string,
  status: AdminOrderStatus,
  token?: string,
): Promise<boolean> {
  // console.log(token);
  const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    credentials: "include",
    body: JSON.stringify({ status: status.toLowerCase() }),
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to update order status");
  }
  return true;
}

// ============================================================================
// SHOP MODERATION
// GET /api/v1/shops
// PATCH /api/v1/admin/shops/:shopId/approve
// PATCH /api/v1/admin/shops/:shopId/reject
// PATCH /api/v1/shops/update/my-shop/:shopId (suspend / reactivate)
// ============================================================================

export interface AdminShopRecord {
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

export async function fetchAdminShopsAPI(): Promise<{
  shops: AdminShopRecord[];
}> {
  const res = await fetch(`${API_BASE_URL}/shops`, { method: "GET" });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch shops");
  }
  const json = await res.json();
  const shops = (
    Array.isArray(json?.data) ? json.data : []
  ) as AdminShopRecord[];
  return { shops };
}

export async function approveShopAPI(
  shopId: string,
  token?: string,
): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/admin/shops/${shopId}/approve`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to approve shop");
  }
  return true;
}

export async function rejectShopAPI(
  shopId: string,
  reason: string,
  token?: string,
): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/admin/shops/${shopId}/reject`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    credentials: "include",
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to reject shop");
  }
  return true;
}

export async function updateShopStatusAPI(
  shopId: string,
  status: string,
  reason: string,
  token?: string,
): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/shops/update/my-shop/${shopId}`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    credentials: "include",
    body: JSON.stringify({
      status,
      rejectionReason: reason || undefined,
    }),
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to update shop status");
  }
  return true;
}
