import { getProjectBySlug, getRelatedProjects } from '@/services/portfolio.service';
import { getTenantSettings } from '@/services/settings.service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, ArrowLeft, Sparkles, Camera, Aperture, MessageCircle } from 'lucide-react';
import ParallaxImage from '@/components/animations/ParallaxImage';
import TextReveal from '@/components/animations/TextReveal';
import ProjectGalleryShowcase from '@/components/public/ProjectGalleryShowcase';
import { getOptimizedImageUrl } from '@/lib/image-optimization';

interface ProjectStoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectStoryPage({ params }: ProjectStoryPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const [settings, related] = await Promise.all([
    getTenantSettings(),
    getRelatedProjects(project.id, project.categoryId),
  ]);

  return (
    <article className="bg-slate-950 min-h-screen text-slate-100 pb-10 sm:pb-24 w-full overflow-hidden">
      {/* Cinematic Full-Bleed Hero Poster Section */}
      <section className="relative w-full h-[70vh] sm:h-[85vh] min-h-[480px] overflow-hidden border-b border-slate-900 mb-6 sm:mb-16">
        {/* Parallax Background Cover Image */}
        <div className="absolute inset-0">
          <ParallaxImage
            src={getOptimizedImageUrl(project.coverImage, 'max-quality')}
            alt={project.title}
            className="w-full h-full object-cover scale-105"
          />
          {/* Multi-layer Gradient Dark Overlay for Maximum Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
          <div className="absolute inset-0 bg-slate-950/20" />
        </div>

        {/* Back to Portfolio Link - Floating Top Left */}
        <div className="absolute top-20 sm:top-28 left-4 sm:left-12 z-30">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-none bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-mono text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-all shadow-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>Back to Portfolio</span>
          </Link>
        </div>

        {/* Hero Overlay Content directly on the Poster */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-8 sm:pb-16 px-4 sm:px-12 md:px-16 max-w-[1920px] mx-auto">
          <div className="max-w-4xl space-y-2.5 sm:space-y-4">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-none border border-amber-500/40 bg-slate-950/80 backdrop-blur-md shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-mono text-amber-300">
                {project.category.name}
              </span>
            </div>

            {/* Project Title */}
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-light text-slate-100 leading-tight drop-shadow-2xl">
              {project.title}
            </h1>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[10px] sm:text-xs text-slate-200 font-mono pt-1">
              {project.location && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {project.location}
                </span>
              )}
              {project.eventDate && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 shadow-md">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {new Date(project.eventDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 shadow-md">
                <Aperture className="w-3.5 h-3.5" />
                35MM FILM ARCHIVE
              </span>
            </div>
          </div>
        </div>

        {/* Luxury Corner Border Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 sm:w-14 sm:h-14 border-l-2 border-t-2 border-amber-400/80 z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-14 sm:h-14 border-r-2 border-b-2 border-amber-400/80 z-30 pointer-events-none" />
      </section>

      {/* Story Text Narrative */}
      {project.description && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-6 sm:mb-20">
          <TextReveal>
            <div className="text-sm sm:text-lg md:text-xl font-serif leading-relaxed text-slate-300 font-light space-y-3 sm:space-y-6">
              <p>{project.description}</p>
            </div>
          </TextReveal>
        </section>
      )}

      {/* Creative Magazine Storybook Gallery Showcase */}
      <section className="w-full max-w-[1920px] mx-auto px-0.5 sm:px-3 md:px-6 mb-6 sm:mb-16">
        <div className="flex items-center justify-between mb-3 sm:mb-8 px-4 sm:px-0">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono text-amber-400">
            Visual Storybook Gallery
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase font-mono text-slate-500">
            01 // {project.images.length} ARCHIVAL FRAMES
          </span>
        </div>

        {/* Mobile: Dynamic 2-Cards & Single Portrait/Landscape Editorial Grid | Desktop: Masonry Columns with Fullscreen Lightbox */}
        <ProjectGalleryShowcase images={project.images} projectTitle={project.title} />
      </section>

      {/* Booking CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-10 sm:mb-24 text-center">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-none p-5 sm:p-14 border border-amber-500/30 shadow-2xl">
          <h3 className="text-xl sm:text-4xl font-serif font-light mb-2 sm:mb-4">
            Inspired by this celebration?
          </h3>
          <p className="text-slate-400 text-[11px] sm:text-sm font-light mb-5 sm:mb-8 max-w-md mx-auto">
            Let us craft a bespoke photography package for your upcoming event.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="/booking"
              className="px-6 py-3.5 sm:px-8 sm:py-4 rounded-none bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-medium text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl"
            >
              Inquire About Your Date
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp}?text=Hi!%20I%20loved%20the%20${encodeURIComponent(project.title)}%20story.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 sm:px-8 sm:py-4 rounded-none bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-medium text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </section>

      {/* Related Stories */}
      {related.length > 0 && (
        <section className="w-full max-w-[1920px] mx-auto px-4 md:px-8 pt-8 sm:pt-16 border-t border-slate-900">
          <h4 className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono text-amber-400 mb-4 sm:mb-8">
            Related Visual Sagas
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[1px] sm:gap-6">
            {related.map((rel, idx) => (
              <Link
                key={rel.id}
                href={`/portfolio/${rel.slug}`}
                className={`group rounded-none overflow-hidden bg-slate-900 border border-slate-800/80 block hover:border-amber-500/60 transition-all shadow-2xl relative ${
                  idx % 2 === 1 ? 'mt-5 md:mt-0' : 'mt-0'
                }`}
              >
                <div className="aspect-[4/5] md:aspect-[16/10] relative overflow-hidden">
                  {/* eslint-disable-next-app-element */}
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-6 sm:left-6 sm:right-6">
                    <span className="text-[7px] sm:text-[10px] uppercase font-mono text-amber-400 block mb-0.5">
                      {rel.category.name}
                    </span>
                    <h5 className="text-xs sm:text-2xl font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-snug line-clamp-2 font-normal">
                      {rel.title}
                    </h5>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
