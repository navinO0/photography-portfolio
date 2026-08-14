'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  MapPin,
  Star,
  RefreshCw,
  X,
  UploadCloud,
} from 'lucide-react';
import { uploadToCloudinaryWithRetry } from '@/lib/cloudinaryUpload';
import { useToast } from '@/components/ui/Toast';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PortfolioImage {
  id: string;
  imageUrl: string;
  altText?: string | null;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  description?: string | null;
  location?: string | null;
  layoutMode: string;
  featured: boolean;
  isPublished: boolean;
  category: Category;
  images: PortfolioImage[];
}

interface AdminProjectsManagerProps {
  initialProjects: Project[];
  categories: Category[];
}

export default function AdminProjectsManager({
  initialProjects,
  categories,
}: AdminProjectsManagerProps) {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeUploadProjectId, setActiveUploadProjectId] = useState<string | null>(null);
  const [editingImageItem, setEditingImageItem] = useState<{ projectId: string; image: PortfolioImage } | null>(null);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategoryId, setNewCategoryId] = useState(categories[0]?.id || '');
  const [newCoverImage, setNewCoverImage] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newLayoutMode, setNewLayoutMode] = useState('editorial');
  const [newFeatured, setNewFeatured] = useState(false);
  const [newIsPublished, setNewIsPublished] = useState(true);
  const [galleryInputs, setGalleryInputs] = useState<string[]>(['']);

  // Edit Project Form State
  const [editTitle, setEditTitle] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editLayoutMode, setEditLayoutMode] = useState('editorial');
  const [editFeatured, setEditFeatured] = useState(false);
  const [editIsPublished, setEditIsPublished] = useState(true);

  // Edit Individual Work Image State
  const [editWorkUrl, setEditWorkUrl] = useState('');
  const [uploadingWorkReplace, setUploadingWorkReplace] = useState(false);

  // Loading / Uploading states
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingEditCover, setUploadingEditCover] = useState(false);
  const [uploadingGalleryIdx, setUploadingGalleryIdx] = useState<number | null>(null);
  const [uploadingQuickWork, setUploadingQuickWork] = useState(false);

  const handleOpenEditModal = (proj: Project) => {
    setEditingProject(proj);
    setEditTitle(proj.title);
    setEditCategoryId(proj.category.id);
    setEditCoverImage(proj.coverImage);
    setEditDescription(proj.description || '');
    setEditLocation(proj.location || '');
    setEditLayoutMode(proj.layoutMode || 'editorial');
    setEditFeatured(proj.featured);
    setEditIsPublished(proj.isPublished);
  };

  // Cloudinary Upload for New Project Cover Image
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadToCloudinaryWithRetry(file, (msg, type) => showToast(msg, type));
      setNewCoverImage(url);
    } catch (err: any) {
      showToast(err.message || 'Cover image upload failed.', 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  // Cloudinary Upload for Edit Project Cover Image
  const handleEditCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingEditCover(true);
    try {
      const url = await uploadToCloudinaryWithRetry(file, (msg, type) => showToast(msg, type));
      setEditCoverImage(url);
    } catch (err: any) {
      showToast(err.message || 'Cover image upload failed.', 'error');
    } finally {
      setUploadingEditCover(false);
    }
  };

  // Cloudinary Direct Multi-File Upload for Gallery Work Items (With Duplicate Check)
  const handleGalleryFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingGalleryIdx(index);
    try {
      showToast(`Processing ${files.length} file(s)...`, 'info');
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinaryWithRetry(files[i], (msg, type) => showToast(msg, type));
        uploadedUrls.push(url);
      }

      setGalleryInputs((prev) => {
        const copy = [...prev];
        copy[index] = uploadedUrls[0];
        if (uploadedUrls.length > 1) {
          copy.push(...uploadedUrls.slice(1));
        }
        return copy;
      });

      showToast(`Successfully processed ${files.length} image(s)!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Work image upload failed.', 'error');
    } finally {
      setUploadingGalleryIdx(null);
    }
  };

  // Quick Work Multi-File Upload for existing project (With Duplicate Detection)
  const handleQuickWorkFileUpload = async (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingQuickWork(true);
    showToast(`Processing ${files.length} photo(s)...`, 'info');

    try {
      const newImages: PortfolioImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinaryWithRetry(files[i], (msg, type) => showToast(msg, type));

        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'addImage',
            projectId,
            imageUrl: url,
          }),
        });

        const data = await res.json();
        if (res.ok && data.image) {
          newImages.push(data.image);
        }
      }

      if (newImages.length > 0) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, images: [...p.images, ...newImages] } : p
          )
        );
        showToast(`Added ${newImages.length} photo(s) to project gallery!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Upload failed.', 'error');
    } finally {
      setUploadingQuickWork(false);
    }
  };

  // Work Image Replace File Upload
  const handleReplaceWorkFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingImageItem) return;

    setUploadingWorkReplace(true);
    try {
      const url = await uploadToCloudinaryWithRetry(file, (msg, type) => showToast(msg, type));
      setEditWorkUrl(url);
    } catch (err: any) {
      showToast(err.message || 'Image upload failed.', 'error');
    } finally {
      setUploadingWorkReplace(false);
    }
  };

  const handleUpdateSingleWorkImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImageItem || !editWorkUrl.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateImage',
          imageId: editingImageItem.image.id,
          imageUrl: editWorkUrl.trim(),
        }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingImageItem.projectId
              ? {
                  ...p,
                  images: p.images.map((img) =>
                    img.id === editingImageItem.image.id ? { ...img, imageUrl: editWorkUrl.trim() } : img
                  ),
                }
              : p
          )
        );
        setEditingImageItem(null);
        showToast('Work image updated successfully!', 'success');
      } else {
        showToast('Failed to update work image.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating work image.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddGalleryInput = () => {
    setGalleryInputs((prev) => [...prev, '']);
  };

  const handleGalleryInputChange = (index: number, value: string) => {
    setGalleryInputs((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCategoryId || !newCoverImage) {
      showToast('Please provide a Title, Category, and Cover Image URL.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const validGalleryImages = galleryInputs.filter((url) => url.trim().length > 0);
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          categoryId: newCategoryId,
          coverImage: newCoverImage,
          description: newDescription,
          location: newLocation,
          layoutMode: newLayoutMode,
          featured: newFeatured,
          isPublished: newIsPublished,
          galleryImages: validGalleryImages,
        }),
      });

      const data = await res.json();
      if (res.ok && data.project) {
        setProjects((prev) => [data.project, ...prev]);
        setShowCreateModal(false);
        showToast('Portfolio project & works published successfully!', 'success');

        setNewTitle('');
        setNewCoverImage('');
        setNewDescription('');
        setNewLocation('');
        setGalleryInputs(['']);
      } else {
        showToast(data.error || 'Failed to create portfolio project.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProject.id,
          title: editTitle,
          categoryId: editCategoryId,
          coverImage: editCoverImage,
          description: editDescription,
          location: editLocation,
          layoutMode: editLayoutMode,
          featured: editFeatured,
          isPublished: editIsPublished,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const selectedCategory = categories.find((c) => c.id === editCategoryId) || editingProject.category;

        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingProject.id
              ? {
                  ...p,
                  title: editTitle,
                  categoryId: editCategoryId,
                  category: selectedCategory,
                  coverImage: editCoverImage,
                  description: editDescription,
                  location: editLocation,
                  layoutMode: editLayoutMode,
                  featured: editFeatured,
                  isPublished: editIsPublished,
                }
              : p
          )
        );
        setEditingProject(null);
        showToast('Portfolio project updated successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to update portfolio project.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update project.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio project?')) return;

    try {
      const res = await fetch(`/api/admin/projects?projectId=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showToast('Portfolio project deleted.', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteImage = async (projectId: string, imageId: string) => {
    try {
      const res = await fetch(`/api/admin/projects?imageId=${imageId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? { ...p, images: p.images.filter((img) => img.id !== imageId) }
              : p
          )
        );
        showToast('Work image deleted from gallery.', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-none shadow-xl">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-amber-400 block mb-1">
            Studio Portfolio & Cloudinary Work Upload
          </span>
          <h2 className="text-xl font-serif text-slate-100">
            Portfolio Projects ({projects.length})
          </h2>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-none bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-amber-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Portfolio Project</span>
        </button>
      </div>

      {/* Create Portfolio Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-none w-full max-w-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-serif text-slate-100">
                  Add Portfolio Project & Cloudinary Works
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-amber-400 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Royal Jaipur Palace Wedding"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-none focus:border-amber-400 font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                    Category *
                  </label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono rounded-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Feature Image File / URL Uploader */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-amber-400 mb-2 flex items-center justify-between">
                    <span>Cover Feature Image *</span>
                    {uploadingCover && <span className="text-[10px] text-amber-400 animate-pulse">Uploading Cloudinary...</span>}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newCoverImage}
                      onChange={(e) => setNewCoverImage(e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono rounded-none focus:border-amber-400"
                    />
                    <label className="px-3 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center shrink-0">
                      {uploadingCover ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      <input type="file" accept="image/*" className="hidden" onChange={handleCoverFileUpload} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                    Event Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Udaipur, Rajasthan"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                  Project Description & Editorial Notes
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the mood, lighting setup, and fine art story..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-none focus:border-amber-400"
                />
              </div>

              {/* Dynamic Gallery Work Upload Section with Cloudinary */}
              <div className="bg-slate-950 border border-slate-800 p-6 space-y-4 rounded-none">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-widest text-amber-400 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload High-Res Work Images (Cloudinary Smart Cache)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddGalleryInput}
                    className="text-[10px] uppercase font-mono tracking-widest text-slate-300 hover:text-amber-400 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Another Image Field</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                  {galleryInputs.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleGalleryInputChange(idx, e.target.value)}
                        placeholder={`Gallery Work #${idx + 1} Image URL`}
                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono rounded-none"
                      />
                      <label className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs uppercase font-mono tracking-widest cursor-pointer flex items-center gap-1.5 shrink-0 border border-slate-700">
                        {uploadingGalleryIdx === idx ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        ) : (
                          <UploadCloud className="w-3.5 h-3.5" />
                        )}
                        <span>Upload File</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleGalleryFileUpload(idx, e)}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout Mode & Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                    Gallery Layout Mode
                  </label>
                  <select
                    value={newLayoutMode}
                    onChange={(e) => setNewLayoutMode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono rounded-none"
                  >
                    <option value="editorial">Magazine Editorial</option>
                    <option value="masonry">Asymmetrical Masonry</option>
                    <option value="filmstrip">Horizontal Filmstrip</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={newFeatured}
                    onChange={(e) => setNewFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded-none cursor-pointer"
                  />
                  <label htmlFor="featuredToggle" className="text-xs uppercase font-mono text-slate-300 cursor-pointer">
                    Feature on Home Page
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="publishedToggle"
                    checked={newIsPublished}
                    onChange={(e) => setNewIsPublished(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded-none cursor-pointer"
                  />
                  <label htmlFor="publishedToggle" className="text-xs uppercase font-mono text-slate-300 cursor-pointer">
                    Publish Live
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 rounded-none border border-slate-800 text-slate-400 text-xs uppercase tracking-widest hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-none bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:brightness-110 shadow-xl disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{submitting ? 'Creating Project...' : 'Save & Publish Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Portfolio Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-none w-full max-w-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-serif text-slate-100">
                  Edit Portfolio Project: {editingProject.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-amber-400 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-none focus:border-amber-400 font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                    Category *
                  </label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono rounded-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Feature Image File / URL Uploader */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-amber-400 mb-2 flex items-center justify-between">
                    <span>Cover Feature Image *</span>
                    {uploadingEditCover && (
                      <span className="text-[10px] text-amber-400 animate-pulse">
                        Uploading Cloudinary...
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={editCoverImage}
                      onChange={(e) => setEditCoverImage(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono rounded-none focus:border-amber-400"
                    />
                    <label className="px-3 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center shrink-0">
                      {uploadingEditCover ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleEditCoverFileUpload}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                    Event Location
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                  Project Description & Editorial Notes
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-none focus:border-amber-400"
                />
              </div>

              {/* Layout Mode & Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                    Gallery Layout Mode
                  </label>
                  <select
                    value={editLayoutMode}
                    onChange={(e) => setEditLayoutMode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono rounded-none"
                  >
                    <option value="editorial">Magazine Editorial</option>
                    <option value="masonry">Asymmetrical Masonry</option>
                    <option value="filmstrip">Horizontal Filmstrip</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="editFeaturedToggle"
                    checked={editFeatured}
                    onChange={(e) => setEditFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded-none cursor-pointer"
                  />
                  <label
                    htmlFor="editFeaturedToggle"
                    className="text-xs uppercase font-mono text-slate-300 cursor-pointer"
                  >
                    Feature on Home Page
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="editPublishedToggle"
                    checked={editIsPublished}
                    onChange={(e) => setEditIsPublished(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded-none cursor-pointer"
                  />
                  <label
                    htmlFor="editPublishedToggle"
                    className="text-xs uppercase font-mono text-slate-300 cursor-pointer"
                  >
                    Publish Live
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-6 py-3 rounded-none border border-slate-800 text-slate-400 text-xs uppercase tracking-widest hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-none bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:brightness-110 shadow-xl disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{submitting ? 'Updating Project...' : 'Update & Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Single Work Image Modal */}
      {editingImageItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-none w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-serif text-slate-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Edit / Replace Work Image</span>
              </h3>
              <button
                onClick={() => setEditingImageItem(null)}
                className="text-slate-400 hover:text-amber-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSingleWorkImage} className="space-y-4">
              <div className="aspect-video relative overflow-hidden bg-slate-950 border border-slate-800">
                {/* eslint-disable-next-app-element */}
                <img
                  src={editWorkUrl || editingImageItem.image.imageUrl}
                  alt="Work Item"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                  Image URL / Upload File
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editWorkUrl}
                    onChange={(e) => setEditWorkUrl(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono rounded-none"
                  />
                  <label className="px-3 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center shrink-0">
                    {uploadingWorkReplace ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleReplaceWorkFileUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingImageItem(null)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 text-xs uppercase font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs uppercase font-mono hover:bg-amber-400"
                >
                  Save Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile: 2 Cards Per Row Zig-Zag Layout | Desktop: Original 3-Column Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-[1px] sm:gap-8 items-start">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            className={`bg-slate-900/90 border border-slate-800 rounded-none overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-2xl group ${
              idx % 2 === 1 ? 'mt-4 md:mt-0' : 'mt-0'
            }`}
          >
            <div>
              {/* Cover Image Header with Direct Edit Button Overlay */}
              <div className="aspect-[16/10] relative overflow-hidden bg-slate-950">
                {/* eslint-disable-next-app-element */}
                <img
                  src={proj.coverImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Direct Edit Button Overlay */}
                <button
                  onClick={() => handleOpenEditModal(proj)}
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-none bg-slate-950/80 backdrop-blur-md border border-amber-500/50 text-amber-400 text-[10px] uppercase font-mono tracking-widest flex items-center gap-1.5 hover:bg-amber-500 hover:text-slate-950 transition-all z-10 shadow-lg"
                  title="Edit Portfolio Project Details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Portfolio</span>
                </button>

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-none text-[9px] uppercase font-mono tracking-widest ${
                      proj.isPublished
                        ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950/90 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {proj.isPublished ? 'Published' : 'Draft'}
                  </span>
                  {proj.featured && (
                    <span className="p-1 rounded-none bg-amber-500 text-slate-950">
                      <Star className="w-3 h-3 fill-slate-950" />
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] uppercase font-mono text-amber-400">
                  <span>{proj.category.name}</span>
                  {proj.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {proj.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Info Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-serif text-slate-100 group-hover:text-amber-300 transition-colors">
                    {proj.title}
                  </h3>
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="text-slate-500 hover:text-amber-400 p-1 shrink-0"
                    title="Edit Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {proj.description && (
                  <p className="text-xs text-slate-400 font-light line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                {/* Work Images Gallery Summary */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{proj.images.length} High-Res Works</span>
                    </span>
                    <button
                      onClick={() =>
                        setActiveUploadProjectId(
                          activeUploadProjectId === proj.id ? null : proj.id
                        )
                      }
                      className="text-[10px] uppercase font-mono tracking-widest text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Work File</span>
                    </button>
                  </div>

                  {/* Inline Direct Cloudinary File Upload Box if Active */}
                  {activeUploadProjectId === proj.id && (
                    <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-none space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">
                          Cloudinary Direct Work File Upload
                        </span>
                        {uploadingQuickWork && (
                          <span className="text-[10px] font-mono text-amber-300 animate-pulse flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Compressing & Uploading...</span>
                          </span>
                        )}
                      </div>

                      <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 border border-dashed border-amber-500/50 hover:border-amber-400 text-slate-200 text-xs font-mono uppercase tracking-widest cursor-pointer hover:bg-slate-800 transition-all">
                        <UploadCloud className="w-4 h-4 text-amber-400" />
                        <span>Select & Upload Image File</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleQuickWorkFileUpload(proj.id, e)}
                        />
                      </label>
                    </div>
                  )}

                  {/* Scrollable Container with Custom Scrollbar for Unlimited Gallery Works */}
                  {proj.images.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto pr-1 space-y-2 border border-slate-800/80 p-2 bg-slate-950/60 rounded-none">
                      <div className="grid grid-cols-2 gap-[1px]">
                        {proj.images.map((img) => (
                          <div
                            key={img.id}
                            className="relative group/thumb aspect-square w-full rounded-none border border-slate-800 bg-slate-950 overflow-hidden shadow-md"
                          >
                            {/* eslint-disable-next-app-element */}
                            <img
                              src={img.imageUrl}
                              alt="Work"
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                            />
                            {/* Dual Hover Controls: Edit Work Image + Delete Work Image */}
                            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingImageItem({ projectId: proj.id, image: img });
                                  setEditWorkUrl(img.imageUrl);
                                }}
                                className="w-7 h-7 bg-amber-950 border border-amber-500 text-amber-300 flex items-center justify-center hover:bg-amber-900 transition-colors"
                                title="Edit Work Image"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteImage(proj.id, img.id)}
                                className="w-7 h-7 bg-rose-950 border border-rose-500 text-rose-300 flex items-center justify-center hover:bg-rose-900 transition-colors"
                                title="Delete Work Image"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-slate-500 italic py-2">
                      No works uploaded yet. Click Upload Work File to add images.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className="p-6 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Mode: {proj.layoutMode}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(proj)}
                  className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 border border-amber-500/40 transition-all font-bold"
                  title="Edit Portfolio Project & Content"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Portfolio</span>
                </button>
                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1.5"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
