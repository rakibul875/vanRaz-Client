import { Shop, Product, Order, ShopCategory, ShopStatus } from '../types';

export const SHOP_CATEGORIES: ShopCategory[] = [
  'Fashion & Apparel',
  'Electronics & Gadgets',
  'Health & Beauty',
  'Home & Living',
  'Groceries & Gourmet',
  'Artisanal & Crafts',
  'Sports & Outdoors',
  'Books & Stationery',
  'Jewelry & Accessories',
];

export const PRESET_LOGOS = [
  {
    name: 'Modern Minimal',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Artisan Craft',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Organic Lifestyle',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tech & Gear',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
  },
];

export const PRESET_BANNERS = [
  {
    name: 'Vibrant Storefront',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Minimalist Studio',
    url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Warm Marketplace',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Modern Tech Space',
    url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80',
  },
];

export const STATUS_META: Record<
  ShopStatus,
  {
    label: string;
    description: string;
    badgeClass: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    icon: string;
    actionHint: string;
  }
> = {
  Draft: {
    label: 'Draft',
    description: 'Shop setup is in progress. Your details are saved locally but not submitted to administrators.',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    bgClass: 'bg-slate-50',
    borderClass: 'border-slate-200',
    textClass: 'text-slate-800',
    icon: 'FileText',
    actionHint: 'Submit your shop details when you are ready for admin review.',
  },
  Pending: {
    label: 'Pending Review',
    description: 'Your shop application has been submitted and is currently being verified by our compliance team.',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-300',
    bgClass: 'bg-amber-50/50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    icon: 'Clock',
    actionHint: 'Verification typically takes 24-48 business hours. You will receive an alert once approved.',
  },
  Approved: {
    label: 'Approved',
    description: 'Congratulations! Your shop has been verified and approved by the marketplace moderation team.',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    bgClass: 'bg-emerald-50/50',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-800',
    icon: 'CheckCircle2',
    actionHint: 'Click "Activate Shop" below to make your storefront live to all customers.',
  },
  Active: {
    label: 'Active & Live',
    description: 'Your shop is currently active and publicly visible. Customers can browse and purchase your products.',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-300',
    bgClass: 'bg-teal-50/50',
    borderClass: 'border-teal-200',
    textClass: 'text-teal-800',
    icon: 'Store',
    actionHint: 'Your storefront is accepting live customer orders.',
  },
  Rejected: {
    label: 'Application Rejected',
    description: 'Your shop application was declined. Common reasons include blurry logos or missing store address.',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-300',
    bgClass: 'bg-rose-50/50',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-800',
    icon: 'XCircle',
    actionHint: 'Review administrator notes, update your shop details, and resubmit.',
  },
  Suspended: {
    label: 'Suspended',
    description: 'This shop has been temporarily suspended due to compliance checks, late fulfillment, or policy review.',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-300',
    bgClass: 'bg-purple-50/50',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-800',
    icon: 'AlertTriangle',
    actionHint: 'Contact seller support or submit an appeal to reinstate your seller privileges.',
  },
};

export const INITIAL_SHOP: Shop = {
  id: 'shp_990184',
  name: 'Aura Artisan Crafts',
  logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
  description: 'Handcrafted contemporary ceramics, premium linen textiles, and organic lifestyle home accents crafted by independent artisans.',
  category: 'Artisanal & Crafts',
  phone: '+880 1712-345678',
  address: 'Plot 42, Block D, Banani Avenue, Dhaka 1213, Bangladesh',
  status: 'Active',
  statusReason: 'Verification successfully completed on September 1, 2026.',
  createdAt: '2026-08-28T10:30:00Z',
  updatedAt: '2026-09-02T14:15:00Z',
  sellerName: 'Shamsul Haque',
  sellerEmail: 'webdevlopershamsul@gmail.com',
  totalProducts: 24,
  totalOrders: 148,
  totalSales: 384500, // in local currency BDT or $
  rating: 4.9,
  reviewCount: 92,
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Glazed Terracotta Tea Set',
    category: 'Home & Living',
    price: 3200,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&auto=format&fit=crop&q=80',
    status: 'In Stock',
    salesCount: 42,
  },
  {
    id: 'prod_2',
    name: 'Handwoven Indigo Linen Runner',
    category: 'Artisanal & Crafts',
    price: 1850,
    stock: 24,
    imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=300&auto=format&fit=crop&q=80',
    status: 'In Stock',
    salesCount: 68,
  },
  {
    id: 'prod_3',
    name: 'Sculptural Marble Candleholder',
    category: 'Home & Living',
    price: 2400,
    stock: 4,
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&auto=format&fit=crop&q=80',
    status: 'Low Stock',
    salesCount: 29,
  },
  {
    id: 'prod_4',
    name: 'Raw Silk Cushion Cover (Set of 2)',
    category: 'Fashion & Apparel',
    price: 1600,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80',
    status: 'In Stock',
    salesCount: 35,
  },
  {
    id: 'prod_5',
    name: 'Botanical Ceramic Pour-Over Dripper',
    category: 'Home & Living',
    price: 1450,
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop&q=80',
    status: 'Out of Stock',
    salesCount: 51,
  },
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord_1089',
    orderNumber: '#ORD-2026-981',
    customerName: 'Tanvir Ahmed',
    customerEmail: 'tanvir.ahmed@example.com',
    itemsCount: 3,
    totalAmount: 7450,
    status: 'Processing',
    date: 'Today, 02:40 PM',
  },
  {
    id: 'ord_1088',
    orderNumber: '#ORD-2026-980',
    customerName: 'Farhana Kabir',
    customerEmail: 'farhana.k@example.com',
    itemsCount: 1,
    totalAmount: 3200,
    status: 'Shipped',
    date: 'Today, 11:15 AM',
  },
  {
    id: 'ord_1087',
    orderNumber: '#ORD-2026-979',
    customerName: 'Rashid Chowdhury',
    customerEmail: 'rashid.c@example.com',
    itemsCount: 2,
    totalAmount: 4250,
    status: 'Delivered',
    date: 'Yesterday, 04:30 PM',
  },
  {
    id: 'ord_1086',
    orderNumber: '#ORD-2026-978',
    customerName: 'Samira Hossain',
    customerEmail: 'samira.h@example.com',
    itemsCount: 4,
    totalAmount: 9800,
    status: 'Delivered',
    date: 'Sep 01, 2026',
  },
  {
    id: 'ord_1085',
    orderNumber: '#ORD-2026-977',
    customerName: 'Nayeem Hasan',
    customerEmail: 'nayeem.h@example.com',
    itemsCount: 1,
    totalAmount: 1850,
    status: 'Delivered',
    date: 'Aug 31, 2026',
  },
];
