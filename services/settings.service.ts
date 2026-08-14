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
    philosophyTag: flags.philosophyTag || '04 / STUDIO PHILOSOPHY',
    philosophyQuote: flags.philosophyQuote || '"We don\'t take photographs; we document unscripted emotional history."',
    philosophyBody: flags.philosophyBody || settings.bio || 'We craft cinematic visual legacies for royalty, luxury weddings, high fashion, and monumental lifetime celebrations worldwide.',
    philosophySubbody: flags.philosophySubbody || 'Every framing is meticulously composed using natural daylight, directional shadow, and authentic cinematic storytelling. Whether high on the cliffs of Amalfi or inside candlelit Parisian châteaux, our mission remains unchanged: crafting heirloom imagery that elevates life\'s most sacred chapters into pure art.',
    philosophyImage: flags.philosophyImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    philosophyAwardTitle: flags.philosophyAwardTitle || 'Top 10 Global Masters',
    philosophyAwardSub: flags.philosophyAwardSub || 'Recognized by Vogue Weddings & International Photography Guild.',
    philosophyCred1Title: flags.philosophyCred1Title || 'Global Travel',
    philosophyCred1Sub: flags.philosophyCred1Sub || 'Available across Europe, USA & Asia',
    philosophyCred2Title: flags.philosophyCred2Title || 'Medium Format',
    philosophyCred2Sub: flags.philosophyCred2Sub || 'Hasselblad & Leica glass quality',
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
    ...(inputData.philosophyTag !== undefined ? { philosophyTag: inputData.philosophyTag } : {}),
    ...(inputData.philosophyQuote !== undefined ? { philosophyQuote: inputData.philosophyQuote } : {}),
    ...(inputData.philosophyBody !== undefined ? { philosophyBody: inputData.philosophyBody } : {}),
    ...(inputData.philosophySubbody !== undefined ? { philosophySubbody: inputData.philosophySubbody } : {}),
    ...(inputData.philosophyImage !== undefined ? { philosophyImage: inputData.philosophyImage } : {}),
    ...(inputData.philosophyAwardTitle !== undefined ? { philosophyAwardTitle: inputData.philosophyAwardTitle } : {}),
    ...(inputData.philosophyAwardSub !== undefined ? { philosophyAwardSub: inputData.philosophyAwardSub } : {}),
    ...(inputData.philosophyCred1Title !== undefined ? { philosophyCred1Title: inputData.philosophyCred1Title } : {}),
    ...(inputData.philosophyCred1Sub !== undefined ? { philosophyCred1Sub: inputData.philosophyCred1Sub } : {}),
    ...(inputData.philosophyCred2Title !== undefined ? { philosophyCred2Title: inputData.philosophyCred2Title } : {}),
    ...(inputData.philosophyCred2Sub !== undefined ? { philosophyCred2Sub: inputData.philosophyCred2Sub } : {}),
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
