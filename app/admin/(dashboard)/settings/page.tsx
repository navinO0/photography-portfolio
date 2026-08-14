import { getTenantSettings } from '@/services/settings.service';
import AdminSettingsForm from '@/components/admin/AdminSettingsForm';

export default async function AdminSettingsPage() {
  const settings = await getTenantSettings();

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-1">
          Tenant Configuration & Visual Identity
        </span>
        <h1 className="text-3xl font-serif font-light text-slate-100">
          Studio Themes & Hero Settings
        </h1>
      </div>

      <AdminSettingsForm
        initialSettings={{
          photographerName: settings.photographerName || 'Lumina Studios',
          photographerTitle: settings.photographerTitle || 'Cinematic & Fine Art Photography',
          bio: settings.bio || '',
          phone: settings.phone || '',
          whatsapp: settings.whatsapp || '',
          email: settings.email || '',
          heroTitle: settings.heroTitle || '',
          heroSubtitle: settings.heroSubtitle || '',
          heroMediaUrl: settings.heroMediaUrl || '',
          heroContentPosition: settings.heroContentPosition || 'bottom-left',
          heroGradientIntensity: settings.heroGradientIntensity || 'heavy',
          heroCtaPrimaryText: settings.heroCtaPrimaryText || 'View Our Work',
          heroCtaSecondaryText: settings.heroCtaSecondaryText || 'Book Your Date',
          cardHoverGlow: settings.cardHoverGlow !== undefined ? settings.cardHoverGlow : true,
          primaryColor: settings.primaryColor || '#f59e0b',
          secondaryColor: settings.secondaryColor || '#0f172a',
          accentColor: settings.accentColor || '#fbbf24',
          fontFamily: settings.fontFamily || 'Playfair Display, serif',
          favicon: settings.favicon || '',
          seoTitle: settings.seoTitle || '',
          seoDescription: settings.seoDescription || '',
          seoKeywords: settings.seoKeywords || '',
          ogImage: settings.ogImage || '',
          twitterHandle: settings.twitterHandle || '',
          siteUrl: settings.siteUrl || '',
          imageFetchQuality: settings.imageFetchQuality || 'balanced',
          featureFlags: settings.featureFlags || {},
        }}
      />
    </div>
  );
}
