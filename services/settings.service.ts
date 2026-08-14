import { db } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { unstable_noStore as noStore } from 'next/cache';

export async function getTenantSettings() {
  noStore();
  const tenantId = getTenantId();
  
  let settings = await db.tenantSettings.findUnique({
    where: { tenantId },
  });

  if (!settings) {
    // Fallback default settings if missing
    settings = await db.tenantSettings.create({
      data: {
        tenantId,
        photographerName: 'Lumina Studios',
        photographerTitle: 'Cinematic & Fine Art Photography',
        heroTitle: 'WE CAPTURE THE MOMENTS YOU NEVER WANT TO FORGET.',
        heroSubtitle: 'Luxury cinematic photography for destination weddings, fashion, and monument celebrations.',
        heroContentPosition: 'bottom-left',
        heroGradientIntensity: 'heavy',
        heroCtaPrimaryText: 'View Our Work',
        heroCtaSecondaryText: 'Book Your Date',
        cardHoverGlow: true,
      },
    });
  }

  const flags = (settings.featureFlags as Record<string, any>) || {};

  return {
    ...settings,
    imageFetchQuality: flags.imageFetchQuality || 'balanced',
    seoKeywords: flags.seoKeywords || 'photography, luxury wedding, fashion photographer, editorial photography, destination wedding, fine art portraits',
    ogImage: flags.ogImage || settings.heroMediaUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    twitterHandle: flags.twitterHandle || '@luminastudios',
    siteUrl: flags.siteUrl || 'https://luminastudios.com',
  };
}

const VALID_SETTING_KEYS = new Set([
  'logo',
  'favicon',
  'primaryColor',
  'secondaryColor',
  'accentColor',
  'fontFamily',
  'photographerName',
  'photographerTitle',
  'bio',
  'phone',
  'whatsapp',
  'email',
  'address',
  'socialInstagram',
  'socialFacebook',
  'socialYoutube',
  'heroTitle',
  'heroSubtitle',
  'heroMediaUrl',
  'heroContentPosition',
  'heroGradientIntensity',
  'heroCtaPrimaryText',
  'heroCtaSecondaryText',
  'cardHoverGlow',
  'seoTitle',
  'seoDescription',
  'featureFlags',
]);

export async function updateTenantSettings(inputData: Record<string, any>) {
  const tenantId = getTenantId();

  // Retrieve existing settings to preserve featureFlags
  const existing = await db.tenantSettings.findUnique({
    where: { tenantId },
  });

  const existingFlags = (existing?.featureFlags as Record<string, any>) || {};
  const inputFlags = (inputData.featureFlags as Record<string, any>) || {};

  // Preserve imageFetchQuality, SEO fields and existing featureFlags safely in JSON
  const mergedFlags = {
    ...existingFlags,
    ...inputFlags,
    ...(inputData.imageFetchQuality !== undefined ? { imageFetchQuality: inputData.imageFetchQuality } : {}),
    ...(inputData.seoKeywords !== undefined ? { seoKeywords: inputData.seoKeywords } : {}),
    ...(inputData.ogImage !== undefined ? { ogImage: inputData.ogImage } : {}),
    ...(inputData.twitterHandle !== undefined ? { twitterHandle: inputData.twitterHandle } : {}),
    ...(inputData.siteUrl !== undefined ? { siteUrl: inputData.siteUrl } : {}),
  };

  const payload: Record<string, any> = {};

  for (const [key, val] of Object.entries(inputData)) {
    if (VALID_SETTING_KEYS.has(key)) {
      payload[key] = val;
    }
  }

  payload.featureFlags = mergedFlags;

  return db.tenantSettings.upsert({
    where: { tenantId },
    update: payload,
    create: {
      tenantId,
      ...payload,
    },
  });
}
