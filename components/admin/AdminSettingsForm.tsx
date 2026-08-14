'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemePreset } from '@/lib/themes';
import ThemePresetsSelector from './ThemePresetsSelector';
import { Save, CheckCircle2, RefreshCw, Eye, Sparkles, Calendar, ArrowRight, Layout, Sliders, Zap, Gauge, ImageIcon, Globe, UploadCloud, BookOpen, Quote } from 'lucide-react';
import { uploadToCloudinaryWithRetry } from '@/lib/cloudinaryUpload';
import { useToast } from '@/components/ui/Toast';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface TenantSettingsData {
  photographerName: string;
  photographerTitle: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroMediaUrl?: string;
  heroContentPosition?: string;
  heroGradientIntensity?: string;
  heroCtaPrimaryText?: string;
  heroCtaSecondaryText?: string;
  cardHoverGlow?: boolean;
  imageFetchQuality?: string;
  favicon?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  twitterHandle?: string;
  siteUrl?: string;
  philosophyTag?: string;
  philosophyQuote?: string;
  philosophyBody?: string;
  philosophySubbody?: string;
  philosophyImage?: string;
  philosophyAwardTitle?: string;
  philosophyAwardSub?: string;
  philosophyCred1Title?: string;
  philosophyCred1Sub?: string;
  philosophyCred2Title?: string;
  philosophyCred2Sub?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  featureFlags?: any;
}

interface AdminSettingsFormProps {
  initialSettings: TenantSettingsData;
}

const DEFAULT_INSTAGRAM_POSTS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop',
];

import { applyDynamicThemeToDocument } from '@/lib/theme-utils';

export default function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingOgImage, setUploadingOgImage] = useState(false);
  const [uploadingPhilosophyImage, setUploadingPhilosophyImage] = useState(false);
  const [formData, setFormData] = useState<TenantSettingsData>({
    heroContentPosition: 'bottom-left',
    heroGradientIntensity: 'heavy',
    heroCtaPrimaryText: 'View Our Work',
    heroCtaSecondaryText: 'Book Your Date',
    cardHoverGlow: true,
    imageFetchQuality: 'balanced',
    ...initialSettings,
  });

  const handleFaviconFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    try {
      showToast('Uploading favicon icon to Cloudinary...', 'info');
      const url = await uploadToCloudinaryWithRetry(file, (msg, type) => {
        showToast(msg, type);
      });
      setFormData((prev) => ({ ...prev, favicon: url }));
      showToast('Favicon icon uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Favicon upload failed.', 'error');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handlePhilosophyImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhilosophyImage(true);
    try {
      showToast('Uploading philosophy portrait image to Cloudinary...', 'info');
      const url = await uploadToCloudinaryWithRetry(file, (msg, type) => {
        showToast(msg, type);
      });
      setFormData((prev) => ({ ...prev, philosophyImage: url }));
      showToast('Philosophy image uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Philosophy image upload failed.', 'error');
    } finally {
      setUploadingPhilosophyImage(false);
    }
  };

  const handleOgImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingOgImage(true);
    try {
      showToast('Uploading social banner image to Cloudinary...', 'info');
      const url = await uploadToCloudinaryWithRetry(file, (msg, type) => {
        showToast(msg, type);
      });
      setFormData((prev) => ({ ...prev, ogImage: url }));
      showToast('Social banner image uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Social banner upload failed.', 'error');
    } finally {
      setUploadingOgImage(false);
    }
  };

  const rawInstagramPosts = initialSettings.featureFlags?.instagramPosts;
  const [instagramPosts, setInstagramPosts] = useState<string[]>(
    Array.isArray(rawInstagramPosts) && rawInstagramPosts.length === 6
      ? rawInstagramPosts
      : DEFAULT_INSTAGRAM_POSTS
  );

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Sync root CSS variables & browser favicon on mount and change
  useEffect(() => {
    applyDynamicThemeToDocument(
      formData.primaryColor,
      formData.secondaryColor,
      formData.accentColor,
      formData.fontFamily
    );

    if (formData.favicon && typeof window !== 'undefined') {
      const links = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      if (links.length > 0) {
        links.forEach((link) => {
          link.href = formData.favicon!;
        });
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = formData.favicon;
        document.head.appendChild(link);
      }
    }
  }, [formData.primaryColor, formData.secondaryColor, formData.accentColor, formData.fontFamily, formData.favicon]);

  const handleApplyTheme = (preset: ThemePreset) => {
    setFormData((prev) => ({
      ...prev,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      fontFamily: preset.fontFamily,
    }));
    applyDynamicThemeToDocument(
      preset.primaryColor,
      preset.secondaryColor,
      preset.accentColor,
      preset.fontFamily
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: val };
      applyDynamicThemeToDocument(
        updated.primaryColor,
        updated.secondaryColor,
        updated.accentColor,
        updated.fontFamily
      );
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      const payload = {
        ...formData,
        featureFlags: {
          ...(initialSettings.featureFlags || {}),
          instagramPosts,
        },
      };

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg(true);
        if (formData.favicon && typeof window !== 'undefined') {
          const links = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
          links.forEach((link) => {
            link.href = formData.favicon!;
          });
        }
        showToast('Studio theme & favicon settings saved successfully!', 'success');
        router.refresh();
        setTimeout(() => setSuccessMsg(false), 5000);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save studio settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Preview position helper
  const getPreviewAlignment = () => {
    switch (formData.heroContentPosition) {
      case 'center':
        return 'items-center text-center mx-auto';
      case 'bottom-center':
        return 'items-center text-center mx-auto';
      case 'top-left':
        return 'items-start text-left';
      case 'bottom-left':
      default:
        return 'items-start text-left';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Live Interactive Real-Time Theme Preview Panel */}
      <div className="bg-slate-900 border border-amber-500/40 rounded-none p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-amber-400 block">
                Live Studio Theme & Hero Preview (Real-Time)
              </span>
              <h3 className="text-base font-serif text-slate-100">
                Visual Identity Preview Card
              </h3>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 border border-emerald-500/30">
            ● Active Live Preview
          </span>
        </div>

        {/* Mock Public Hero Card Styled Dynamically in Real-Time */}
        <div
          className="relative p-6 sm:p-10 rounded-none overflow-hidden border transition-all duration-500 group bg-slate-950"
          style={{
            backgroundColor: formData.secondaryColor,
            borderColor: `${formData.primaryColor}40`,
            boxShadow: formData.cardHoverGlow ? `0 0 40px ${formData.primaryColor}30` : undefined,
          }}
        >
          {/* Always Dark Overlay for Hero Preview legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 z-0 pointer-events-none" />

          <div className={`relative z-10 space-y-4 max-w-xl flex flex-col ${getPreviewAlignment()}`}>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-none border backdrop-blur-md"
              style={{
                borderColor: `${formData.primaryColor}60`,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: formData.primaryColor,
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span className="text-[9px] uppercase tracking-[0.2em] font-mono">
                {formData.photographerName || 'Studio Preset Preview'}
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-xl sm:text-3xl font-light leading-snug tracking-wide uppercase drop-shadow-md"
              style={{
                fontFamily: formData.fontFamily,
                color: '#f8fafc',
              }}
            >
              {formData.heroTitle || 'WE CAPTURE THE MOMENTS YOU NEVER WANT TO FORGET.'}
            </h2>

            {/* Subtitle */}
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {formData.photographerTitle || 'Cinematic & Fine Art Photography'}
            </p>

            {/* Buttons Preview */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                className="px-5 py-2.5 rounded-none font-bold text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2"
                style={{
                  backgroundColor: formData.primaryColor,
                  color: '#020617',
                }}
              >
                <span>{formData.heroCtaPrimaryText || 'View Our Work'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="px-5 py-2.5 rounded-none border text-[10px] uppercase tracking-widest flex items-center gap-2"
                style={{
                  borderColor: `${formData.accentColor}60`,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: formData.accentColor,
                }}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{formData.heroCtaSecondaryText || 'Book Your Date'}</span>
              </button>
            </div>
          </div>

          {/* Configuration Tokens Summary */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400">
            <span>Primary: <strong style={{ color: formData.primaryColor }}>{formData.primaryColor}</strong></span>
            <span>Hover Glow: <strong className="text-emerald-400">{formData.cardHoverGlow ? 'ON' : 'OFF'}</strong></span>
            <span>Position: <strong className="text-amber-400">{formData.heroContentPosition}</strong></span>
            <span>Font: <strong>{formData.fontFamily}</strong></span>
          </div>
        </div>
      </div>

      {/* 10 Theme Presets Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-none p-8">
        <ThemePresetsSelector
          initialPrimary={formData.primaryColor}
          initialSecondary={formData.secondaryColor}
          initialAccent={formData.accentColor}
          initialFont={formData.fontFamily}
          onApplyTheme={handleApplyTheme}
        />
      </div>

      {/* Dedicated Hero Banner Customizer Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-none p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-slate-100">Hero Banner Layout & Overlay Settings</h3>
            <p className="text-xs text-slate-400 font-mono">
              Configure content position, gradient overlay darkness, and call-to-action button labels
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Hero Content Alignment Position
            </label>
            <select
              name="heroContentPosition"
              value={formData.heroContentPosition || 'bottom-left'}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            >
              <option value="bottom-left">Bottom-Left (Classic Editorial)</option>
              <option value="center">Center Centered (Minimal Luxury)</option>
              <option value="bottom-center">Bottom-Center (Cinema Banner)</option>
              <option value="top-left">Top-Left (Modern Magazine)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Gradient Dark Overlay Intensity
            </label>
            <select
              name="heroGradientIntensity"
              value={formData.heroGradientIntensity || 'heavy'}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            >
              <option value="heavy">Heavy (High Contrast Text Readability)</option>
              <option value="medium">Medium (Balanced Warmth)</option>
              <option value="subtle">Subtle (Bright Background Focus)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Primary CTA Button Text
            </label>
            <input
              type="text"
              name="heroCtaPrimaryText"
              value={formData.heroCtaPrimaryText || 'View Our Work'}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Secondary CTA Button Text
            </label>
            <input
              type="text"
              name="heroCtaSecondaryText"
              value={formData.heroCtaSecondaryText || 'Book Your Date'}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
            Hero Background Image / Video Media URL (Optional Override)
          </label>
          <input
            type="text"
            name="heroMediaUrl"
            value={formData.heroMediaUrl || ''}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/... or custom cover URL"
            className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
          />
        </div>
      </div>

      {/* Studio Philosophy & Editorial Narrative Section Customizer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-none p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-8 h-8 rounded-none bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Quote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-slate-100">Studio Philosophy & Editorial Section</h3>
            <p className="text-xs text-slate-400 font-mono">
              Customize the homepage Studio Philosophy quote, storytelling narrative paragraphs, portrait image, and global recognition award text
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Section Tag Badge
            </label>
            <input
              type="text"
              name="philosophyTag"
              value={formData.philosophyTag || '04 / STUDIO PHILOSOPHY'}
              onChange={handleChange}
              placeholder="04 / STUDIO PHILOSOPHY"
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Main Philosophy Quote Heading
            </label>
            <input
              type="text"
              name="philosophyQuote"
              value={formData.philosophyQuote || `"We don't take photographs; we document unscripted emotional history."`}
              onChange={handleChange}
              placeholder={`"We don't take photographs; we document unscripted emotional history."`}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
            Primary Legacy Narrative (Paragraph 1)
          </label>
          <textarea
            name="philosophyBody"
            rows={3}
            value={formData.philosophyBody || formData.bio || ''}
            onChange={handleChange}
            placeholder="We craft cinematic visual legacies for royalty, luxury weddings, high fashion, and monumental lifetime celebrations worldwide."
            className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
            Secondary Storytelling Narrative (Paragraph 2)
          </label>
          <textarea
            name="philosophySubbody"
            rows={3}
            value={formData.philosophySubbody || ''}
            onChange={handleChange}
            placeholder="Every framing is meticulously composed using natural daylight, directional shadow, and authentic cinematic storytelling..."
            className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono leading-relaxed"
          />
        </div>

        {/* Philosophy Portrait Image URL + Cloudinary Upload */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2 flex items-center justify-between">
            <span>Philosophy Portrait Image URL / Upload</span>
            {uploadingPhilosophyImage && (
              <span className="text-[10px] text-amber-400 animate-pulse font-mono">Uploading Cloudinary...</span>
            )}
          </label>
          <div className="flex items-center gap-3">
            {formData.philosophyImage ? (
              /* eslint-disable-next-app-element */
              <img
                src={formData.philosophyImage}
                alt="Philosophy Preview"
                className="w-12 h-14 rounded-none border border-amber-500/50 object-cover shrink-0 bg-slate-950"
              />
            ) : (
              <div className="w-12 h-14 rounded-none border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-500 text-[10px] font-mono shrink-0">
                PORTRAIT
              </div>
            )}
            <input
              type="text"
              name="philosophyImage"
              value={formData.philosophyImage || ''}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/... or custom portrait image URL"
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:border-amber-400 transition-colors"
            />
            <label className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-widest cursor-pointer flex items-center justify-center shrink-0 border border-amber-400 transition-colors">
              {uploadingPhilosophyImage ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhilosophyImageFileUpload}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Floating Award Card Title
            </label>
            <input
              type="text"
              name="philosophyAwardTitle"
              value={formData.philosophyAwardTitle || 'Top 10 Global Masters'}
              onChange={handleChange}
              placeholder="Top 10 Global Masters"
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Floating Award Card Description
            </label>
            <input
              type="text"
              name="philosophyAwardSub"
              value={formData.philosophyAwardSub || 'Recognized by Vogue Weddings & International Photography Guild.'}
              onChange={handleChange}
              placeholder="Recognized by Vogue Weddings..."
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Credential #1 Title
            </label>
            <input
              type="text"
              name="philosophyCred1Title"
              value={formData.philosophyCred1Title || 'Global Travel'}
              onChange={handleChange}
              placeholder="Global Travel"
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Credential #1 Subtitle
            </label>
            <input
              type="text"
              name="philosophyCred1Sub"
              value={formData.philosophyCred1Sub || 'Available across Europe, USA & Asia'}
              onChange={handleChange}
              placeholder="Available across Europe..."
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Credential #2 Title
            </label>
            <input
              type="text"
              name="philosophyCred2Title"
              value={formData.philosophyCred2Title || 'Medium Format'}
              onChange={handleChange}
              placeholder="Medium Format"
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Credential #2 Subtitle
            </label>
            <input
              type="text"
              name="philosophyCred2Sub"
              value={formData.philosophyCred2Sub || 'Hasselblad & Leica glass quality'}
              onChange={handleChange}
              placeholder="Hasselblad & Leica..."
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Image Fetch Quality & Performance Optimization */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-none p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-8 h-8 rounded-none bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-slate-100">Image Fetch Quality & Performance</h3>
            <p className="text-xs text-slate-400 font-mono">
              Optimize image compression and fetch speed to load high-resolution photography instantly without visual quality loss
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Image Fetch Quality Mode
            </label>
            <select
              name="imageFetchQuality"
              value={formData.imageFetchQuality || 'balanced'}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            >
              <option value="ultra-fast">⚡ Ultra-Fast Performance (WebP 75% Auto-Compression - Speed Focus)</option>
              <option value="balanced">✨ Balanced Editorial (WebP 88% - Fast Fetch & High Quality Detail)</option>
              <option value="max-quality">💎 Maximum Lossless Quality (WebP 98% - High Fidelity Raw Detail)</option>
            </select>
          </div>

          <div className="flex flex-col justify-center bg-slate-950 p-4 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-mono text-amber-300">Live WebP CDN Compression</span>
            </div>
            <p className="text-[11px] text-slate-400 font-light">
              Automatically optimizes image fetch payloads across all portfolio galleries for 3x faster rendering on mobile and desktop.
            </p>
          </div>
        </div>
      </div>

      {/* Favicon & Complete SEO Metadata Suite */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-none p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-8 h-8 rounded-none bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-slate-100">Favicon & Full SEO Metadata Suite</h3>
            <p className="text-xs text-slate-400 font-mono">
              Configure browser tab favicon icon, meta titles, social share preview cards, search keywords, and Twitter handles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Favicon URL & Direct File Upload */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2 flex items-center justify-between">
              <span>Favicon Icon URL / Upload</span>
              {uploadingFavicon && (
                <span className="text-[10px] text-amber-400 animate-pulse font-mono">Uploading Cloudinary...</span>
              )}
            </label>
            <div className="flex items-center gap-3">
              {formData.favicon ? (
                /* eslint-disable-next-app-element */
                <img
                  src={formData.favicon}
                  alt="Favicon Preview"
                  className="w-10 h-10 rounded-none border border-amber-500/50 object-cover shrink-0 bg-slate-950 p-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-none border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-500 text-[10px] font-mono shrink-0">
                  ICO
                </div>
              )}
              <input
                type="text"
                name="favicon"
                value={formData.favicon || ''}
                onChange={handleChange}
                placeholder="https://... or custom favicon image URL"
                className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:border-amber-400 transition-colors"
              />
              <label className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-widest cursor-pointer flex items-center justify-center shrink-0 border border-amber-400 transition-colors">
                {uploadingFavicon ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <input
                  type="file"
                  accept="image/*,.ico"
                  className="hidden"
                  onChange={handleFaviconFileUpload}
                />
              </label>
            </div>
          </div>

          {/* Meta Title */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              SEO Meta Title Tag
            </label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle || ''}
              onChange={handleChange}
              placeholder="Lumina Studios | Luxury Destination Wedding & Fine Art Photography"
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
            SEO Meta Description Tag
          </label>
          <textarea
            name="seoDescription"
            rows={3}
            value={formData.seoDescription || ''}
            onChange={handleChange}
            placeholder="Award-winning cinematic photography studio specializing in luxury weddings, fashion campaigns, and editorial portraiture..."
            className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono leading-relaxed"
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
            SEO Keywords (Comma Separated)
          </label>
          <input
            type="text"
            name="seoKeywords"
            value={formData.seoKeywords || ''}
            onChange={handleChange}
            placeholder="photography, luxury wedding, fashion photographer, editorial photography, destination wedding, fine art portraits"
            className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-slate-800/80">
          {/* Social Share OG Image */}
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2 flex items-center justify-between">
              <span>Social Share Banner Image URL (OpenGraph)</span>
              {uploadingOgImage && (
                <span className="text-[10px] text-amber-400 animate-pulse font-mono">Uploading Cloudinary...</span>
              )}
            </label>
            <div className="flex items-center gap-3">
              {formData.ogImage ? (
                /* eslint-disable-next-app-element */
                <img
                  src={formData.ogImage}
                  alt="OG Preview"
                  className="w-16 h-10 rounded-none border border-amber-500/50 object-cover shrink-0 bg-slate-950"
                />
              ) : (
                <div className="w-16 h-10 rounded-none border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-500 text-[10px] font-mono shrink-0">
                  OG
                </div>
              )}
              <input
                type="text"
                name="ogImage"
                value={formData.ogImage || ''}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... for WhatsApp/Facebook social previews"
                className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:border-amber-400 transition-colors"
              />
              <label className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs uppercase font-mono tracking-widest cursor-pointer flex items-center justify-center shrink-0 border border-slate-700 transition-colors">
                {uploadingOgImage ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleOgImageFileUpload}
                />
              </label>
            </div>
          </div>

          {/* Twitter Handle */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Twitter Creator Handle
            </label>
            <input
              type="text"
              name="twitterHandle"
              value={formData.twitterHandle || ''}
              onChange={handleChange}
              placeholder="@luminastudios"
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>
        </div>

        {/* Site Domain / Canonical */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
            Canonical Website Domain URL
          </label>
          <input
            type="text"
            name="siteUrl"
            value={formData.siteUrl || ''}
            onChange={handleChange}
            placeholder="https://luminastudios.com"
            className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
          />
        </div>
      </div>

      {/* Instagram Showcase Feed Posts Editor */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-none p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-8 h-8 rounded-none bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <InstagramIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-slate-100">Instagram Feed Showcase Posts</h3>
            <p className="text-xs text-slate-400 font-mono">
              Customize the 6 featured Instagram post images displayed in the website footer feed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instagramPosts.map((url, idx) => (
            <div key={idx} className="bg-slate-950 p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-amber-400">
                  Instagram Slot 0{idx + 1}
                </span>
                <span className="text-[9px] uppercase font-mono text-slate-500">1:1 Aspect Ratio</span>
              </div>

              {/* Preview Thumbnail */}
              <div className="aspect-square w-full bg-slate-900 border border-slate-800 overflow-hidden relative group">
                {url ? (
                  /* eslint-disable-next-app-element */
                  <img
                    src={url}
                    alt={`Instagram slot ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">
                    No Image URL
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                  Post Image URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const newArr = [...instagramPosts];
                    newArr[idx] = e.target.value;
                    setInstagramPosts(newArr);
                  }}
                  placeholder="https://images.unsplash.com/... or custom post URL"
                  className="w-full px-3 py-2 rounded-none bg-slate-900 border border-slate-800 text-slate-100 text-[11px] font-mono focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Palette & Card Hover Glow Details */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-none p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif text-slate-100">Design Tokens, Glow & Colors</h3>
          {/* Card Hover Glow Configurable Toggle Switch */}
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 border border-slate-800 rounded-none">
            <input
              type="checkbox"
              id="cardHoverGlow"
              name="cardHoverGlow"
              checked={formData.cardHoverGlow}
              onChange={handleChange}
              className="w-4 h-4 accent-amber-500 rounded-none cursor-pointer"
            />
            <label htmlFor="cardHoverGlow" className="text-xs uppercase font-mono text-amber-400 cursor-pointer">
              Enable Card Hover Radial Glow
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Primary Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                className="w-10 h-10 rounded-none bg-slate-950 border border-slate-800 cursor-pointer"
              />
              <input
                type="text"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Secondary Canvas Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleChange}
                className="w-10 h-10 rounded-none bg-slate-950 border border-slate-800 cursor-pointer"
              />
              <input
                type="text"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Glow Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="accentColor"
                value={formData.accentColor}
                onChange={handleChange}
                className="w-10 h-10 rounded-none bg-slate-950 border border-slate-800 cursor-pointer"
              />
              <input
                type="text"
                name="accentColor"
                value={formData.accentColor}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Typography Font Family
            </label>
            <input
              type="text"
              name="fontFamily"
              value={formData.fontFamily}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Studio Information */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-none p-8 space-y-6">
        <h3 className="text-lg font-serif text-slate-100">Studio Identity & Contact</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Photographer / Studio Name
            </label>
            <input
              type="text"
              name="photographerName"
              value={formData.photographerName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Professional Title
            </label>
            <input
              type="text"
              name="photographerTitle"
              value={formData.photographerTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
            Studio Bio & Narrative
          </label>
          <textarea
            rows={3}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Telephone Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              WhatsApp Concierge
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
              Studio Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
            Hero Headline
          </label>
          <input
            type="text"
            name="heroTitle"
            value={formData.heroTitle}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-none bg-slate-950 border border-slate-800 text-slate-100 text-sm"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-4 rounded-none bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-xl disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving Theme Settings...' : 'Save Theme & Branding'}</span>
        </button>

        {successMsg && (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Theme Preset & Hero Settings Saved & Applied Live Site-Wide!</span>
          </div>
        )}
      </div>
    </form>
  );
}
