export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  discountPercentage?: number;
  category: string;
  stock: number;
  brand: string;
  sizes: string[];
  colors: string[];
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
  createdAt?: string;
  updatedAt?: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

