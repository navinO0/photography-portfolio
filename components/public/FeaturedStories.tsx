'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Calendar, ChevronLeft, ChevronRight, Grid, LayoutList } from 'lucide-react';
import TiltCard3D from '../animations/TiltCard3D';
import { getOptimizedImageUrl } from '@/lib/image-optimization';

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  location?: string | null;
  eventDate?: Date | null;
  coverImage: string;
  category: { name: string };
}

interface FeaturedStoriesProps {
  projects: ProjectItem[];
}

export default function FeaturedStories({ projects }: FeaturedStoriesProps) {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'filmstrip'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Extract unique category names
  const categories = ['ALL', ...Array.from(new Set(projects.map((p) => p.category.name)))];

  const filteredProjects = selectedCategory === 'ALL'
    ? projects
    : projects.filter((p) => p.category.name === selectedCategory);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -480, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 480, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-slate-950 text-slate-100 overflow-hidden py-10 sm:py-16 border-t border-slate-900 w-full cv-auto">
      {/* Section Header */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400">
                01 / Curated Visual Portfolio
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-light text-slate-100 tracking-wide">
              Featured Stories
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-900 rounded-none border border-slate-800 shrink-0">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`px-3 py-1.5 rounded-none text-[10px] uppercase font-mono tracking-widest transition-all flex items-center gap-1.5 ${
                  layoutMode === 'grid'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>3-Column Grid</span>
              </button>
              <button
                onClick={() => setLayoutMode('filmstrip')}
                className={`px-3 py-1.5 rounded-none text-[10px] uppercase font-mono tracking-widest transition-all flex items-center gap-1.5 ${
                  layoutMode === 'filmstrip'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Filmstrip</span>
              </button>
            </div>

            {layoutMode === 'filmstrip' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={scrollLeft}
                  className="w-10 h-10 rounded-none border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-amber-400 hover:text-amber-400 flex items-center justify-center transition-all"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-10 h-10 rounded-none border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-amber-400 hover:text-amber-400 flex items-center justify-center transition-all"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            <Link
              href="/portfolio"
              className="text-xs uppercase tracking-[0.2em] text-amber-400 hover:text-amber-300 flex items-center gap-2 font-mono group"
            >
              <span>View All ({projects.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-none text-[10px] sm:text-xs uppercase tracking-[0.2em] font-mono whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold shadow-md'
                  : 'border-slate-800/80 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Masterpieces' : cat}
            </button>
          ))}
        </div>
      </div>

      {layoutMode === 'grid' ? (
        /* Dynamic 3-Column Luxury Portfolio Grid (Full-bleed Edge-to-Edge on Mobile) */
        <div className="w-full max-w-[1920px] mx-auto px-0 sm:px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredProjects.map((proj, idx) => {
            // Elegant aspect ratio variations for masonry feel
            const aspectRatios = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[16/11]'];
            const aspectClass = aspectRatios[idx % aspectRatios.length];

            return (
              <TiltCard3D
                key={proj.id}
                dataCursorImg={proj.coverImage}
                className={`group relative overflow-hidden bg-slate-900 border border-slate-800/90 rounded-none shadow-2xl hover:border-amber-500/70 transition-all duration-700 ${aspectClass}`}
              >
                <Link href={`/portfolio/${proj.slug}`} className="block w-full h-full relative overflow-hidden">
                  {/* Image */}
                  {proj.coverImage && (
                    /* eslint-disable-next-app-element */
                    <img
                      src={getOptimizedImageUrl(proj.coverImage, 'balanced')}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="eager"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

                  {/* Top Category Badge */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
                    <span className="px-3 py-1.5 rounded-none bg-slate-950/90 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-amber-300 border border-amber-500/30 font-mono font-medium shadow-lg inline-block">
                      {proj.category.name}
                    </span>
                  </div>

                  {/* Geometric Corner Accent */}
                  <div className="absolute top-4 right-4 w-5 h-5 border-r border-t border-amber-400/80 z-20 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 w-5 h-5 border-l border-b border-amber-400/80 z-20 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Card Bottom Content */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20">
                    <div className="flex items-center gap-3 text-[10px] sm:text-xs text-slate-300 font-mono mb-2">
                      {proj.location && (
                        <span className="flex items-center gap-1 bg-slate-950/90 px-2 py-0.5 border border-slate-800/80">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{proj.location}</span>
                        </span>
                      )}
                      {proj.eventDate && (
                        <span className="flex items-center gap-1 bg-slate-950/90 px-2 py-0.5 border border-slate-800/80">
                          <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                          {new Date(proj.eventDate).getFullYear()}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white group-hover:text-amber-200 transition-colors leading-snug mb-3 font-light">
                      {proj.title}
                    </h3>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 group-hover:bg-amber-500 text-amber-300 group-hover:text-slate-950 text-xs uppercase tracking-[0.2em] font-mono border border-amber-500/40 group-hover:border-amber-400 transition-all duration-300 font-bold shadow-md">
                      <span>Explore Story</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </TiltCard3D>
            );
          })}
        </div>
      ) : (
        /* Pure CSS Horizontal Scroll Filmstrip Container */
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-4 md:px-12 flex gap-6 md:gap-8 pb-4"
        >
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="w-[85vw] sm:w-[480px] md:w-[560px] shrink-0 snap-start group relative overflow-hidden rounded-none bg-slate-900 border border-slate-800 shadow-2xl"
              data-cursor-img={proj.coverImage}
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                {proj.coverImage && (
                  /* eslint-disable-next-app-element */
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                  <span className="px-3 py-1 rounded-none bg-black/80 backdrop-blur-md text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-300 border border-amber-500/30 font-mono">
                    {proj.category.name}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
                  <div className="flex items-center gap-3 text-[10px] sm:text-xs text-slate-200 font-mono mb-1.5 sm:mb-2">
                    {proj.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {proj.location}
                      </span>
                    )}
                    {proj.eventDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {new Date(proj.eventDate).getFullYear()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-serif text-white group-hover:text-amber-300 transition-colors leading-tight mb-3 sm:mb-4">
                    {proj.title}
                  </h3>
                  <Link
                    href={`/portfolio/${proj.slug}`}
                    className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 group-hover:underline font-mono"
                  >
                    <span>View Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
