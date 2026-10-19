export interface CatalogProduct {
  _id: string;
  name: string;
  slug: string;
  ownerId?: string;
  description: string;
  images?: string[];
  price: number;
  discount?: number;
  stock: number;
  brand?: string;
  category?: string | { _id?: string; name?: string };
  categoryId?: string;
  shop?: string;
  rating: number;
  totalReviews: number;
  soldCount: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  createdAt: string;
}

export const MOCK_PRODUCTS: CatalogProduct[] = [
  {
    _id: "prod-1",
    name: "Samsung Galaxy Watch6 Aluminum Smart Watch",
    slug: "samsung-galaxy-watch6",
    description:
      "Advanced sleep coaching, ECG monitoring, personalized HR zones, and sapphire crystal glass display.",
    images: ["/placeholder.svg"],
    price: 289.99,
    discount: 15,
    stock: 45,
    brand: "Samsung",
    category: "Smart Watches",
    shop: "shop-1",
    rating: 4.8,
    totalReviews: 128,
    soldCount: 340,
    isFeatured: true,
    isFlashSale: true,
    flashSalePrice: 245.99,
    createdAt: "2026-08-15T10:00:00Z",
  },
  {
    _id: "prod-2",
    name: "Beat True Wireless Noise Cancelling Earbuds",
    slug: "beat-true-wireless-earbuds",
    description:
      "Custom acoustic platform delivers rich, immersive sound. Active noise cancelling and transparency mode.",
    images: ["/placeholder.svg"],
    price: 189.99,
    discount: 20,
    stock: 60,
    brand: "Beats",
    category: "Audio & Headphones",
    shop: "shop-2",
    rating: 4.7,
    totalReviews: 95,
    soldCount: 512,
    isFeatured: true,
    isFlashSale: true,
    flashSalePrice: 151.99,
    createdAt: "2026-08-20T10:00:00Z",
  },
  {
    _id: "prod-3",
    name: "Ultra HD 4K Action Camera Waterproof",
    slug: "ultra-hd-4k-action-camera",
    description:
      "Capture stunning 4K video at 60fps with advanced electronic image stabilization and waterproof casing.",
    images: ["/placeholder.svg"],
    price: 129.99,
    discount: 10,
    stock: 25,
    brand: "GoCam",
    category: "Cameras & Drones",
    shop: "shop-1",
    rating: 4.5,
    totalReviews: 64,
    soldCount: 180,
    isFeatured: true,
    isFlashSale: false,
    createdAt: "2026-08-22T10:00:00Z",
  },
  {
    _id: "prod-4",
    name: "Ergonomic Mechanical Gaming Keyboard RGB",
    slug: "ergonomic-mechanical-gaming-keyboard",
    description:
      "Linear red switches, customizable per-key RGB backlighting, aircraft-grade aluminum frame.",
    images: ["/placeholder.svg"],
    price: 89.99,
    discount: 0,
    stock: 80,
    brand: "LogiTech",
    category: "Computer Accessories",
    shop: "shop-3",
    rating: 4.9,
    totalReviews: 210,
    soldCount: 890,
    isFeatured: false,
    isFlashSale: false,
    createdAt: "2026-08-25T10:00:00Z",
  },
  {
    _id: "prod-5",
    name: "Precision Optical Wireless Gaming Mouse",
    slug: "precision-optical-wireless-mouse",
    description:
      "Ultra-lightweight 58g chassis, 26K DPI optical sensor, zero latency wireless connectivity.",
    images: ["/placeholder.svg"],
    price: 69.99,
    discount: 12,
    stock: 50,
    brand: "Razer",
    category: "Computer Accessories",
    shop: "shop-3",
    rating: 4.6,
    totalReviews: 88,
    soldCount: 420,
    isFeatured: true,
    isFlashSale: true,
    flashSalePrice: 61.59,
    createdAt: "2026-08-28T10:00:00Z",
  },
  {
    _id: "prod-6",
    name: "Portable Bluetooth 360 Speaker Waterproof",
    slug: "portable-bluetooth-360-speaker",
    description:
      "Bold 360-degree sound with deep bass. IP67 waterproof and dustproof with up to 15 hours battery.",
    images: ["/placeholder.svg"],
    price: 119.99,
    discount: 25,
    stock: 35,
    brand: "JBL",
    category: "Audio & Headphones",
    shop: "shop-2",
    rating: 4.8,
    totalReviews: 174,
    soldCount: 650,
    isFeatured: true,
    isFlashSale: true,
    flashSalePrice: 89.99,
    createdAt: "2026-09-01T10:00:00Z",
  },
  {
    _id: "prod-7",
    name: "Fast Charging 20000mAh Power Bank PD 65W",
    slug: "fast-charging-20000mah-power-bank",
    description:
      "High-power 65W USB-C output suitable for laptops, tablets, and fast smartphone replenishment.",
    images: ["/placeholder.svg"],
    price: 49.99,
    discount: 0,
    stock: 120,
    brand: "Anker",
    category: "Gadgets & Accessories",
    shop: "shop-1",
    rating: 4.9,
    totalReviews: 320,
    soldCount: 1400,
    isFeatured: false,
    isFlashSale: false,
    createdAt: "2026-09-02T10:00:00Z",
  },
  {
    _id: "prod-8",
    name: "Smart Fitness Tracker Band with Heart Rate Monitor",
    slug: "smart-fitness-tracker-band",
    description:
      "OLED color touch display, 24/7 continuous health tracking, 14-day battery life, 5ATM water resistance.",
    images: ["/placeholder.svg"],
    price: 39.99,
    discount: 15,
    stock: 90,
    brand: "Xiaomi",
    category: "Smart Watches",
    shop: "shop-1",
    rating: 4.4,
    totalReviews: 82,
    soldCount: 760,
    isFeatured: true,
    isFlashSale: false,
    createdAt: "2026-09-03T10:00:00Z",
  },
];
