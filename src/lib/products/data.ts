import { MOCK_PRODUCTS } from "./mockCatalog";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  images?: string[];

  price: number;
  discount?: number;
  stock?: number;
  brand?: string;

  rating?: number;
  totalReviews?: number;
  soldCount?: number;

  status?: string;

  isFeatured?: boolean;
  isFlashSale?: boolean;

  flashSalePrice?: number;
  flashSaleEndDate?: string;
}

export interface HomeSections {
  featured: Product[];
  flashSale: Product[];
  topRated: Product[];
  mostSelling: Product[];
  newArrivals: Product[];
}

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
}

export const getProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  minPrice = "",
  maxPrice = "",
  sort = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}) => {
  const fallbackData = {
    products: [],
    totalPages: 1,
    totalProducts: 0,
    categories: [],
  };

  try {
    if (!API) {
      return fallbackData;
    }

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API}/products?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) {
      return fallbackData;
    }

    const response = await res.json();
    const data = response?.data;

    return {
      totalPages: data?.totalPages || 1,
      products: data?.products || [],
      totalProducts: data?.totalProducts || 0,
      categories: data?.categories || [],
    };
  } catch {
    return fallbackData;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    if (!API) {
      return [];
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API}/categories`, {
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) {
      return [];
    }

    const response = await res.json();
    const list = response?.data ?? response?.categories ?? [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const getHomeSections = async (): Promise<HomeSections> => {
  const fallbackData: HomeSections = {
    featured: MOCK_PRODUCTS.filter((p) => p.isFeatured),
    flashSale: MOCK_PRODUCTS.filter((p) => p.isFlashSale),
    topRated: [...MOCK_PRODUCTS]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4),
    mostSelling: [...MOCK_PRODUCTS]
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 4),
    newArrivals: [...MOCK_PRODUCTS].reverse().slice(0, 4),
  };

  try {
    if (!API) {
      return fallbackData;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout for resilience

    const res = await fetch(`${API}/products/home-sections`, {
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) {
      return fallbackData;
    }

    const response = await res.json();
    const data = response?.data;

    return {
      featured: data?.featured?.length ? data.featured : fallbackData.featured,
      flashSale: data?.flashSale?.length
        ? data.flashSale
        : fallbackData.flashSale,
      topRated: data?.topRated?.length ? data.topRated : fallbackData.topRated,
      mostSelling: data?.mostSelling?.length
        ? data.mostSelling
        : fallbackData.mostSelling,
      newArrivals: data?.newArrivals?.length
        ? data.newArrivals
        : fallbackData.newArrivals,
    };
  } catch {
    // Graceful fallback if backend is offline
    return fallbackData;
  }
};
