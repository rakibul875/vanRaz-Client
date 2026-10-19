import React, { useState } from 'react';


import { SHOP_CATEGORIES, PRESET_LOGOS, PRESET_BANNERS } from '../data/mockdata';
import { ImageUploader } from "../components/imageUploader";
import { X, Save, Store, Layers, MapPin, Phone } from 'lucide-react';
import { Shop, ShopCategory } from '../../types';

interface EditShopModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  shop?: Shop;
  onSave?: (updatedShop: Shop) => void;
  onOpenCloudinarySettings?: () => void;
}

export const EditShopModal: React.FC<EditShopModalProps> = ({
  isOpen,
  onClose,
  shop,
  onSave,
  onOpenCloudinarySettings,
}) => {
  const [formData, setFormData] = useState({
    name: shop?.name ?? '',
    logoUrl: shop?.logoUrl ?? '',
    bannerUrl: shop?.bannerUrl ?? '',
    description: shop?.description ?? '',
    category: shop?.category ?? SHOP_CATEGORIES[0],
    phone: shop?.phone ?? '',
    address: shop?.address ?? '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shop) {
      onClose?.();
      return;
    }

    onSave?.({
      ...shop,
      name: formData.name,
      logoUrl: formData.logoUrl,
      bannerUrl: formData.bannerUrl,
      description: formData.description,
      category: formData.category,
      phone: formData.phone,
      address: formData.address,
      updatedAt: new Date().toISOString(),
    });

    onClose?.();
  };

  return (
    <div
      id="edit-shop-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="edit-shop-modal-card"
        className="relative w-full max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto my-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Store size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Edit Shop Information</h3>
              <p className="text-xs text-slate-500">Update your branding, contact, and category</p>
            </div>
          </div>
          <button
            type="button"
            id="close-edit-shop-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Shop Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ShopCategory })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {SHOP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* Media uploader */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <ImageUploader
              label="Shop Logo"
              sublabel="Cloudinary upload (Square 1:1)"
              value={formData.logoUrl}
              onChange={(url) => setFormData({ ...formData, logoUrl: url })}
              aspectRatio="square"
              presets={PRESET_LOGOS}
              onOpenCloudinarySettings={onOpenCloudinarySettings}
              idPrefix="edit-shop-logo"
            />

            <ImageUploader
              label="Shop Banner"
              sublabel="Cloudinary upload (Wide 3:1)"
              value={formData.bannerUrl}
              onChange={(url) => setFormData({ ...formData, bannerUrl: url })}
              aspectRatio="banner"
              presets={PRESET_BANNERS}
              onOpenCloudinarySettings={onOpenCloudinarySettings}
              idPrefix="edit-shop-banner"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Store Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="cancel-edit-shop-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-edit-shop-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <Save size={14} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
