export type UserRole = 'USER' | 'MODERATOR' | 'SELLER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  joinedDate: string;
  ordersCount: number;
  shopsCount?: number;
}

export type AdminShopStatus = 'Pending' | 'Approved' | 'Suspended' | 'Rejected';

export interface AdminShop {
  id: string;
  name: string;
  sellerName: string;
  sellerEmail: string;
  phone: string;
  category: string;
  address: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  status: AdminShopStatus;
  statusReason?: string;
  appliedDate: string;
  totalProducts: number;
  totalSales: number;
  rating: number;
}

export type AdminProductStatus = 'Pending' | 'Approved' | 'Rejected' | 'Hidden';

export interface AdminProduct {
  id: string;
  name: string;
  sellerName: string;
  shopName: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl: string;
  status: AdminProductStatus;
  rejectionReason?: string;
  createdAt: string;
}

export type AdminOrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'PAID' | 'PENDING';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shopName: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: AdminOrderStatus;
  courier?: string;
  trackingId?: string;
  estimatedDelivery?: string;
  orderDate: string;
}
