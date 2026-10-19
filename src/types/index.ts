export type ShopStatus = 
  | 'Draft' 
  | 'Pending' 
  | 'Approved' 
  | 'Rejected' 
  | 'Active' 
  | 'Suspended';

export type ShopCategory = 
  | 'Fashion & Apparel'
  | 'Electronics & Gadgets'
  | 'Health & Beauty'
  | 'Home & Living'
  | 'Groceries & Gourmet'
  | 'Artisanal & Crafts'
  | 'Sports & Outdoors'
  | 'Books & Stationery'
  | 'Jewelry & Accessories';

export interface Shop {
  id: string;
  name: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  category: ShopCategory;
  phone: string;
  address: string;
  status: ShopStatus;
  statusReason?: string;
  createdAt: string;
  updatedAt: string;
  sellerName: string;
  sellerEmail: string;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  rating: number;
  reviewCount: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  salesCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  totalAmount: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
}
