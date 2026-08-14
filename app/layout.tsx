import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lumina Studios | Luxury Destination Wedding & Editorial Photography',
  description: 'World-class cinematic photography studio specializing in luxury weddings, fashion campaigns, fine art portraits, and editorial stories.',
  keywords: ['photography', 'wedding photographer', 'luxury wedding', 'fashion photographer', 'editorial photography', 'destination wedding'],
  openGraph: {
    title: 'Lumina Studios | Luxury Photography',
    description: 'Cinematic photography for extraordinary moments.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
