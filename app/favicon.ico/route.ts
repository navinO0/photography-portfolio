import { getTenantSettings } from '@/services/settings.service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getTenantSettings();
    const faviconUrl = settings.favicon;

    if (faviconUrl && (faviconUrl.startsWith('http://') || faviconUrl.startsWith('https://'))) {
      const res = await fetch(faviconUrl);
      if (res.ok) {
        const imageBuffer = await res.arrayBuffer();
        const contentType = res.headers.get('content-type') || 'image/x-icon';
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          },
        });
      }
      return NextResponse.redirect(faviconUrl);
    }
  } catch (error) {
    console.error('Error serving dynamic tenant favicon:', error);
  }

  // High quality SVG favicon fallback
  const svgFallback = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0f172a"/><text x="50" y="68" font-size="55" font-family="serif" font-weight="bold" fill="#f59e0b" text-anchor="middle">L</text></svg>`;
  return new NextResponse(svgFallback, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    },
  });
}
