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
        /* Dynamic 3-Column Luxury Portfolio Grid */
        <div className="w-full max-w-[1920px] mx-auto px-0 sm:px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((proj) => {
            return (
              <TiltCard3D
                key={proj.id}
                dataCursorImg={proj.coverImage}
                className="group relative overflow-hidden bg-slate-900 border-y sm:border border-slate-800/90 rounded-none hover:border-amber-500/70 transition-all duration-500 flex flex-col"
              >
                <Link href={`/portfolio/${proj.slug}`} className="w-full h-full flex flex-col">
                  {/* Large Photography Showcase Window (Aspect 3/4 on mobile for increased height) */}
                  <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-slate-950">
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

                    {/* Top Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-black/85 backdrop-blur-md text-[9px] uppercase tracking-[0.25em] text-white border border-amber-500/40 font-mono font-medium inline-block">
                        {proj.category.name}
                      </span>
                    </div>

                    {/* Subtle Corner Accent */}
                    <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-amber-400/60 z-20 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Compact Minimalist Content Section Below Image */}
                  <div className="p-4 sm:p-4.5 bg-slate-900 flex flex-col justify-center border-t border-slate-800/80 group-hover:bg-slate-950 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1 text-[10px] sm:text-xs text-amber-400 font-mono">
                      <span className="truncate">{proj.location || 'Studio Exclusive'}</span>
                      {proj.eventDate && <span>{new Date(proj.eventDate).getFullYear()}</span>}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base sm:text-lg font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-snug line-clamp-1 font-normal">
                        {proj.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform" />
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
              className="w-[85vw] sm:w-[420px] md:w-[460px] shrink-0 snap-start group relative overflow-hidden rounded-none bg-slate-900 border border-slate-800 flex flex-col"
              data-cursor-img={proj.coverImage}
            >
              <Link href={`/portfolio/${proj.slug}`} className="w-full h-full flex flex-col">
                {/* Large Photography Window */}
                <div className="w-full aspect-[4/3] sm:aspect-[4/5] relative overflow-hidden bg-slate-950">
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

                  {/* Top Category Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/85 backdrop-blur-md text-[9px] uppercase tracking-[0.25em] text-white border border-amber-500/40 font-mono font-medium shadow-lg inline-block">
                      {proj.category.name}
                    </span>
                  </div>
                </div>

                {/* Compact Content Below Image */}
                <div className="p-4 sm:p-4.5 bg-slate-900 flex flex-col justify-center border-t border-slate-800/80">
                  <div className="flex items-center justify-between gap-2 mb-1 text-[10px] sm:text-xs text-amber-400 font-mono">
                    <span className="truncate">{proj.location || 'Studio Exclusive'}</span>
                    {proj.eventDate && <span>{new Date(proj.eventDate).getFullYear()}</span>}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-snug line-clamp-1 font-normal">
                      {proj.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
