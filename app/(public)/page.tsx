import HeroSection from '@/components/public/HeroSection';
import FeaturedStories from '@/components/public/FeaturedStories';
import PackagesImageShowcase from '@/components/public/PackagesImageShowcase';
import StudioPhilosophy from '@/components/public/StudioPhilosophy';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import BookingForm from '@/components/public/BookingForm';
import { getTenantSettings } from '@/services/settings.service';
import { getFeaturedProjects } from '@/services/portfolio.service';
import { getPublishedTestimonials, getActiveServices } from '@/services/booking.service';

export const revalidate = 60; // ISR 60s

export default async function HomePage() {
  const [settings, featuredProjects, testimonials, services] = await Promise.all([
    getTenantSettings(),
    getFeaturedProjects(),
    getPublishedTestimonials(),
    getActiveServices(),
  ]);

  return (
    <>
      {/* 1. Fullscreen Hero Banner with Configurable Layout & Overlay */}
      <HeroSection
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        mediaUrl={settings.heroMediaUrl || undefined}
        contentPosition={settings.heroContentPosition}
        gradientIntensity={settings.heroGradientIntensity}
        ctaPrimaryText={settings.heroCtaPrimaryText}
        ctaSecondaryText={settings.heroCtaSecondaryText}
      />

      {/* 2. Featured Horizontal Scroll Stories */}
      {featuredProjects.length > 0 && (
        <FeaturedStories projects={featuredProjects} />
      )}

      {/* 3. Handcrafted Photography Packages Showcase (Details Overlaid On Image Posters) */}
      {services.length > 0 && (
        <PackagesImageShowcase services={services} />
      )}

      {/* 5. Studio Philosophy & Photographer Bio */}
      <StudioPhilosophy
        photographerName={settings.photographerName}
        photographerTitle={settings.photographerTitle}
        bio={settings.bio}
      />

      {/* 6. Testimonials Showcase */}
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}

      {/* 7. Interactive Booking Experience CTA */}
      <section className="bg-slate-950 py-8 sm:py-14 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6 text-center mb-6 sm:mb-10">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-4">
            06 / Commission Your Story
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-slate-100 mb-4">
            Reserve Your Celebration Date
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto font-light">
            We limit our calendar to 15 destination weddings per year to ensure absolute devotion to every narrative.
          </p>
        </div>

        <BookingForm whatsappNumber={settings.whatsapp} />
      </section>
    </>
  );
}
