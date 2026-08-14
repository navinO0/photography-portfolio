'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Sparkles, UploadCloud, RefreshCw, Layers, DollarSign, ListChecks } from 'lucide-react';
import { uploadToCloudinaryWithRetry } from '@/lib/cloudinaryUpload';
import { useToast } from '@/components/ui/Toast';

interface PackageItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceStarting?: string | null;
  features?: any;
  image?: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface AdminPackagesManagerProps {
  initialServices: PackageItem[];
}

export default function AdminPackagesManager({ initialServices }: AdminPackagesManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [services, setServices] = useState<PackageItem[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    priceStarting: '',
    description: '',
    image: '',
    displayOrder: 0,
    isActive: true,
    features: [''] as string[],
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      priceStarting: '',
      description: '',
      image: '',
      displayOrder: services.length,
      isActive: true,
      features: ['Full Day Coverage', 'High-Res Digital Files', 'Online Gallery'],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: PackageItem) => {
    setEditingId(item.id);
    let parsedFeatures: string[] = [];
    if (Array.isArray(item.features)) {
      parsedFeatures = item.features;
    } else if (typeof item.features === 'string') {
      try {
        parsedFeatures = JSON.parse(item.features);
      } catch {
        parsedFeatures = [item.features];
      }
    }

    setFormData({
      name: item.name,
      priceStarting: item.priceStarting || '',
      description: item.description,
      image: item.image || '',
      displayOrder: item.displayOrder,
      isActive: item.isActive,
      features: parsedFeatures.length > 0 ? parsedFeatures : [''],
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      showToast('Uploading cover image to Cloudinary...', 'info');
      const url = await uploadToCloudinaryWithRetry(file, (msg, type) => {
        showToast(msg, type);
      });
      setFormData((prev) => ({ ...prev, image: url }));
      showToast('Cover image uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...formData.features];
    updated[index] = val;
    setFormData({ ...formData, features: updated });
  };

  const addFeatureInput = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureInput = (index: number) => {
    const updated = formData.features.filter((_, idx) => idx !== index);
    setFormData({ ...formData, features: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      showToast('Package name and description are required.', 'error');
      return;
    }

    setLoading(true);
    const cleanFeatures = formData.features.map((f) => f.trim()).filter(Boolean);

    try {
      if (editingId) {
        // Update package
        const res = await fetch(`/api/admin/services/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            priceStarting: formData.priceStarting,
            image: formData.image,
            displayOrder: Number(formData.displayOrder),
            isActive: formData.isActive,
            features: cleanFeatures,
          }),
        });

        if (res.ok) {
          showToast('Package updated successfully!', 'success');
          setIsModalOpen(false);
          router.refresh();
        } else {
          showToast('Failed to update package.', 'error');
        }
      } else {
        // Create new package
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            priceStarting: formData.priceStarting,
            image: formData.image,
            displayOrder: Number(formData.displayOrder),
            isActive: formData.isActive,
            features: cleanFeatures,
          }),
        });

        if (res.ok) {
          showToast('New photography package created!', 'success');
          setIsModalOpen(false);
          router.refresh();
        } else {
          showToast('Failed to create package.', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('Package deleted successfully.', 'success');
        setServices((prev) => prev.filter((s) => s.id !== id));
        router.refresh();
      } else {
        showToast('Failed to delete package.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting package.', 'error');
    }
  };

  const handleToggleActive = async (item: PackageItem) => {
    const updatedStatus = !item.isActive;
    try {
      const res = await fetch(`/api/admin/services/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });

      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === item.id ? { ...s, isActive: updatedStatus } : s))
        );
        showToast(
          `Package "${item.name}" is now ${updatedStatus ? 'ACTIVE' : 'INACTIVE'}.`,
          'info'
        );
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-amber-400">
              Studio Offerings & Pricing
            </span>
          </div>
          <h1 className="text-3xl font-serif text-slate-100 font-light">
            Photography Packages Manager
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Create, update, or reorganize photography service packages and pricing tiers for prospective clients
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-widest flex items-center justify-center gap-2 border border-amber-400 shadow-lg shadow-amber-950/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((pkg) => {
          let featureArray: string[] = [];
          if (Array.isArray(pkg.features)) {
            featureArray = pkg.features;
          } else if (typeof pkg.features === 'string') {
            try {
              featureArray = JSON.parse(pkg.features);
            } catch {
              featureArray = [pkg.features];
            }
          }

          return (
            <div
              key={pkg.id}
              className={`bg-slate-900 border ${
                pkg.isActive ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
              } p-6 flex flex-col justify-between space-y-6 relative group hover:border-amber-500/50 transition-all shadow-xl`}
            >
              {/* Cover Image Thumbnail */}
              {pkg.image ? (
                <div className="aspect-[16/9] w-full bg-slate-950 overflow-hidden relative border border-slate-800">
                  {/* eslint-disable-next-app-element */}
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-black/80 backdrop-blur-md border border-amber-500/30 text-[9px] font-mono text-amber-400 uppercase">
                    Order #{pkg.displayOrder}
                  </span>
                </div>
              ) : (
                <div className="aspect-[16/9] w-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 text-xs font-mono">
                  No Cover Image
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-serif text-slate-100 font-normal leading-snug">
                    {pkg.name}
                  </h3>
                  <button
                    onClick={() => handleToggleActive(pkg)}
                    className={`px-2.5 py-1 text-[9px] uppercase font-mono tracking-wider shrink-0 flex items-center gap-1.5 border ${
                      pkg.isActive
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {pkg.isActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-slate-500" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>

                {pkg.priceStarting && (
                  <div className="text-amber-400 font-mono text-sm font-bold flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    <span>{pkg.priceStarting}</span>
                  </div>
                )}

                <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-3">
                  {pkg.description}
                </p>

                {/* Features List */}
                {featureArray.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Included Highlights:
                    </span>
                    <ul className="space-y-1">
                      {featureArray.slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-none bg-amber-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                      {featureArray.length > 4 && (
                        <li className="text-[10px] font-mono text-amber-400/80 italic pt-0.5">
                          +{featureArray.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Package</span>
                </button>

                <button
                  onClick={() => handleDelete(pkg.id, pkg.name)}
                  className="py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 border border-rose-800/50 transition-colors"
                  title="Delete Package"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {services.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 p-12 text-center space-y-4">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-xl font-serif text-slate-200">No Packages Created Yet</h3>
          <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
            Get started by adding your studio's first photography package or pricing tier.
          </p>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-widest inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Package</span>
          </button>
        </div>
      )}

      {/* Modal / Slide Drawer for Package Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-slate-100">
                    {editingId ? 'Edit Package' : 'Create New Package'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Configure package title, pricing starting rate, features, and cover image
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-2"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Destination Wedding"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                    Price Starting Rate
                  </label>
                  <input
                    type="text"
                    value={formData.priceStarting}
                    onChange={(e) => setFormData({ ...formData, priceStarting: e.target.value })}
                    placeholder="e.g. Starting from $4,500"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of what is included in this photography package..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono leading-relaxed"
                />
              </div>

              {/* Cover Image URL & File Upload */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2 flex items-center justify-between">
                  <span>Cover Image URL / Cloudinary Upload</span>
                  {uploadingImage && (
                    <span className="text-[10px] text-amber-400 animate-pulse font-mono">Uploading Cloudinary...</span>
                  )}
                </label>
                <div className="flex items-center gap-3">
                  {formData.image ? (
                    /* eslint-disable-next-app-element */
                    <img
                      src={formData.image}
                      alt="Cover Preview"
                      className="w-14 h-10 rounded-none border border-amber-500/50 object-cover shrink-0 bg-slate-950"
                    />
                  ) : (
                    <div className="w-14 h-10 rounded-none border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-500 text-[10px] font-mono shrink-0">
                      IMG
                    </div>
                  )}
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload image"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
                  />
                  <label className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-widest cursor-pointer flex items-center justify-center shrink-0 border border-amber-400 transition-colors">
                    {uploadingImage ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Included Features Bullet List */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-widest text-amber-400 font-mono flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    <span>Included Package Features / Deliverables</span>
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureInput}
                    className="text-[10px] uppercase font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Bullet Point</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder="e.g. 10 Hours Continuous Coverage, 2 Lead Photographers"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureInput(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                    Display Order Position
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded-none cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs uppercase font-mono text-slate-200 cursor-pointer">
                    Visible & Active on Website
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-mono uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-widest border border-amber-400 shadow-md transition-all flex items-center gap-2"
                >
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingId ? 'Save Package Changes' : 'Create Package'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
