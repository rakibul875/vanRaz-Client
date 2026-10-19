"use client"
import React, { useState } from 'react';

import { X, Plus, Package, DollarSign } from 'lucide-react';
import { Product } from '../../types';
import { ImageUploader } from './imageUploader';

interface AddProductModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAddProduct?: (product: Product) => void;
  onOpenCloudinarySettings?: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onOpenCloudinarySettings,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Home & Living');
  const [price, setPrice] = useState('2500');
  const [stock, setStock] = useState('15');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numPrice = parseFloat(price) || 0;
    const numStock = parseInt(stock, 10) || 0;

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: name.trim(),
      category,
      price: numPrice,
      stock: numStock,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      status: numStock === 0 ? 'Out of Stock' : numStock < 5 ? 'Low Stock' : 'In Stock',
      salesCount: 0,
    };

    onAddProduct?.(newProd);
    setName('');
    onClose?.();
  };

  return (
    <div
      id="add-product-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div
        id="add-product-modal-card"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Add New Product</h3>
          </div>
          <button
            type="button"
            id="close-add-product-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title</label>
            <input
              type="text"
              id="product-title-input"
              placeholder="e.g., Handcrafted Ceramic Bowl"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Price (৳ / $)</label>
              <input
                type="number"
                id="product-price-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock</label>
              <input
                type="number"
                id="product-stock-input"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800"
            >
              <option value="Home & Living">Home & Living</option>
              <option value="Artisanal & Crafts">Artisanal & Crafts</option>
              <option value="Fashion & Apparel">Fashion & Apparel</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Electronics & Gadgets">Electronics & Gadgets</option>
            </select>
          </div>

          <ImageUploader
            label="Product Image"
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            aspectRatio="square"
            onOpenCloudinarySettings={onOpenCloudinarySettings}
            idPrefix="product-image"
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-new-product-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              <Plus size={14} />
              Add to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
