'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductFormData } from '@/types/product';

interface ProductFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (data: ProductFormData) => void;
  initialData?: Product | null;
}

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'];

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    images: [],
    price: 0,
    discountPercentage: 0,
    category: CATEGORIES[0],
    stock: 0,
    brand: '',
    sizes: [],
    colors: [],
    status: 'ACTIVE',
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        images: [],
        price: 0,
        discountPercentage: 0,
        category: CATEGORIES[0],
        stock: 0,
        brand: '',
        sizes: [],
        colors: [],
        status: 'ACTIVE',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'discountPercentage' 
        ? Number(value) 
        : value,
    }));
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = (type: 'sizes' | 'colors', value: string, setValue: (v: string) => void) => {
    if (value.trim() && !formData[type].includes(value.trim())) {
      setFormData((prev) => ({ ...prev, [type]: [...prev[type], value.trim()] }));
      setValue('');
    }
  };

  const handleRemoveTag = (type: 'sizes' | 'colors', item: string) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((i) => i !== item),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 text-zinc-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Product Name & Brand */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-zinc-400 mb-1">Product Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Brand</label>
              <input
                required
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-400 mb-1">Description</label>
            <textarea
              required
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-zinc-400 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 outline-none focus:border-emerald-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Price, Discount, Stock */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-zinc-400 mb-1">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                required
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Sizes and Colors (Tags) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-zinc-400 mb-1">Sizes (e.g. S, M, XL)</label>
              <div className="flex gap-2">
                <input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 p-2 outline-none"
                  placeholder="Add size"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag('sizes', sizeInput, setSizeInput)}
                  className="px-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.sizes.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-xs flex items-center gap-1">
                    {s}
                    <button type="button" onClick={() => handleRemoveTag('sizes', s)} className="text-red-400 font-bold">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Colors (e.g. Red, Black)</label>
              <div className="flex gap-2">
                <input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 p-2 outline-none"
                  placeholder="Add color"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag('colors', colorInput, setColorInput)}
                  className="px-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.colors.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-xs flex items-center gap-1">
                    {c}
                    <button type="button" onClick={() => handleRemoveTag('colors', c)} className="text-red-400 font-bold">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-zinc-400 mb-1">Images (URLs)</label>
            <div className="flex gap-2">
              <input
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 p-2 outline-none"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
              >
                Add Image
              </button>
            </div>
            <div className="flex gap-2 mt-2 overflow-x-auto py-1">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group w-16 h-16 rounded overflow-hidden border border-zinc-700 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-medium text-white shadow-lg shadow-emerald-900/30"
            >
              {initialData ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}