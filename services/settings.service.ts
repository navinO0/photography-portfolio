import { db } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function getTenantSettings() {
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

  // Preserve imageFetchQuality and existing featureFlags safely in JSON
  const mergedFlags = {
    ...existingFlags,
    ...inputFlags,
    ...(inputData.imageFetchQuality ? { imageFetchQuality: inputData.imageFetchQuality } : {}),
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
