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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-slate-950 text-slate-100 overflow-hidden py-4 sm:py-10 border-t border-slate-900 w-full cv-auto">
      {/* Header & Controls */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 mb-3 sm:mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono text-amber-400">
              01 / Curated Visual Saga
            </span>
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 sm:p-1 bg-slate-900 rounded-none border border-slate-800 shrink-0">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`px-2 sm:px-2.5 py-1 rounded-none text-[8px] sm:text-[10px] uppercase font-mono tracking-wider sm:tracking-widest transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  layoutMode === 'grid'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                <span className="whitespace-nowrap"><span className="hidden sm:inline">2-Column </span>Grid</span>
              </button>
              <button
                onClick={() => setLayoutMode('filmstrip')}
                className={`px-2 sm:px-2.5 py-1 rounded-none text-[8px] sm:text-[10px] uppercase font-mono tracking-wider sm:tracking-widest transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  layoutMode === 'filmstrip'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutList className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                <span className="whitespace-nowrap">Filmstrip</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light text-slate-100">
            Featured Stories
          </h2>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          {layoutMode === 'filmstrip' && (
            /* Scroll Navigation Buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-none border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-amber-400 hover:text-amber-400 flex items-center justify-center transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-none border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-amber-400 hover:text-amber-400 flex items-center justify-center transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

          <Link
            href="/portfolio"
            className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-amber-400 hover:text-amber-300 flex items-center gap-2 font-mono group"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {layoutMode === 'grid' ? (
        /* Mobile: Dynamic 2-Cards & Single Portrait/Landscape Editorial Grid | Desktop: 2-Column Showcase Grid */
        <div className="w-full max-w-[1920px] mx-auto px-1 sm:px-8 md:px-12 grid grid-cols-2 sm:grid-cols-2 gap-[1px] sm:gap-8 md:gap-10">
          {projects.map((proj, idx) => {
            const pattern = idx % 5;
            const cardSpanClass =
              pattern === 2
                ? 'col-span-2 aspect-[16/10] sm:aspect-[16/10] mt-0'
                : 'col-span-1 aspect-[4/5] sm:aspect-[16/10] mt-0';

            return (
              <TiltCard3D
                key={proj.id}
                dataCursorImg={proj.coverImage}
                className={`group relative overflow-hidden bg-slate-900 border border-slate-800/80 rounded-none shadow-2xl hover:border-amber-500/60 transition-all duration-500 ${cardSpanClass}`}
              >
              <Link href={`/portfolio/${proj.slug}`} className="block w-full h-full relative">
                {/* eslint-disable-next-app-element */}
                <img
                  src={getOptimizedImageUrl(proj.coverImage, 'balanced')}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Corner Frame Accents */}
                <div className="absolute top-0 left-0 w-5 h-5 sm:w-8 sm:h-8 border-l-2 border-t-2 border-amber-400/80 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-8 sm:h-8 border-r-2 border-b-2 border-amber-400/80 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-2 left-2 sm:top-6 sm:left-6 z-10 max-w-[90%]">
                  <span className="px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-none bg-slate-950/90 backdrop-blur-md text-[7px] sm:text-[10px] uppercase tracking-wider text-amber-300 border border-amber-500/30 font-mono truncate block">
                    {proj.category.name}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 sm:bottom-6 sm:left-6 sm:right-6 z-10">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[7px] sm:text-xs text-slate-300 font-mono mb-1">
                    {proj.location && (
                      <span className="flex items-center gap-0.5 truncate max-w-[100px] sm:max-w-none">
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{proj.location}</span>
                      </span>
                    )}
                    {proj.eventDate && (
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                        {new Date(proj.eventDate).getFullYear()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-3xl font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-snug mb-1 sm:mb-3 line-clamp-2 font-normal">
                    {proj.title}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-[7px] sm:text-xs uppercase tracking-wider text-amber-400 group-hover:underline font-mono">
                    <span>View Story</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
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
          className="w-full overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-4 sm:px-8 md:px-12 flex gap-4 md:gap-8 pb-4"
        >
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="w-[85vw] sm:w-[480px] md:w-[540px] shrink-0 snap-start group relative overflow-hidden rounded-none bg-slate-900 border border-slate-800"
              data-cursor-img={proj.coverImage}
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                {/* eslint-disable-next-app-element */}
                <img
                  src={proj.coverImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                  <span className="px-3 py-1 rounded-none bg-slate-950/80 backdrop-blur-md text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-300 border border-amber-500/30 font-mono">
                    {proj.category.name}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
                  <div className="flex items-center gap-3 text-[10px] sm:text-xs text-slate-400 font-mono mb-1.5 sm:mb-2">
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
                  <h3 className="text-lg sm:text-2xl font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-tight mb-3 sm:mb-4">
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
