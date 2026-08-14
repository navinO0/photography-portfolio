import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import SmoothScroll from '@/components/animations/SmoothScroll';
import CustomCursor from '@/components/animations/CustomCursor';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import DynamicThemeProvider from '@/components/providers/DynamicThemeProvider';
import { getTenantSettings } from '@/services/settings.service';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getTenantSettings();

  const featureFlags = (settings.featureFlags || {}) as Record<string, any>;
  const instagramPosts = featureFlags.instagramPosts as string[] | undefined;

  return (
    <DynamicThemeProvider
      primaryColor={settings.primaryColor}
      secondaryColor={settings.secondaryColor}
      accentColor={settings.accentColor}
      fontFamily={settings.fontFamily}
    >
      <SmoothScroll>
        <CustomCursor />
        <Navbar
          photographerName={settings.photographerName}
          whatsappNumber={settings.whatsapp}
        />
        <main className="min-h-screen">{children}</main>
        <Footer
          photographerName={settings.photographerName}
          photographerTitle={settings.photographerTitle}
          bio={settings.bio}
          phone={settings.phone}
          email={settings.email}
          address={settings.address}
          instagramUrl={settings.socialInstagram || undefined}
          facebookUrl={settings.socialFacebook || undefined}
          youtubeUrl={settings.socialYoutube || undefined}
          instagramPosts={instagramPosts}
        />
        <WhatsAppButton number={settings.whatsapp} />
      </SmoothScroll>
    </DynamicThemeProvider>
  );
}
