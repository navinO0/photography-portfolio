import type { Metadata } from 'next';
import { getTenantSettings } from '@/services/settings.service';
import SmoothScroll from '@/components/animations/SmoothScroll';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getTenantSettings();

  const title = settings.seoTitle || `${settings.photographerName || 'Lumina Studios'} | ${settings.photographerTitle || 'Luxury Photography'}`;
  const description = settings.seoDescription || settings.bio || 'World-class cinematic photography studio specializing in luxury weddings, fashion campaigns, fine art portraits, and editorial stories.';
  const favicon = settings.favicon || '/favicon.ico';
  
  const keywordsList = settings.seoKeywords
    ? settings.seoKeywords.split(',').map((k: string) => k.trim())
    : ['photography', 'wedding photographer', 'luxury wedding', 'fashion photographer', 'editorial photography', 'destination wedding'];

  const ogImage = settings.ogImage || settings.heroMediaUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop';
  const siteUrl = settings.siteUrl || 'https://luminastudios.com';
  const twitterHandle = settings.twitterHandle || '@luminastudios';

  return {
    title,
    description,
    keywords: keywordsList,
    authors: [{ name: settings.photographerName || 'Lumina Studios' }],
    metadataBase: new URL(siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`),
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings.photographerName || 'Lumina Studios',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: twitterHandle,
      images: [ogImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

