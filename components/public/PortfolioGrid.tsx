'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Grid, Box, Camera, Sparkles } from 'lucide-react';
import ParallaxImage from '../animations/ParallaxImage';
import TiltCard3D from '../animations/TiltCard3D';
import ThreeGalleryShowcase from './ThreeGalleryShowcase';
import { getOptimizedImageUrl } from '@/lib/image-optimization';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  location?: string | null;
  category: { name: string; slug: string };
  layoutMode?: string;
}

interface PortfolioGridProps {
  categories: Category[];
  projects: Project[];
}

export default function PortfolioGrid({ categories, projects }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category.slug === activeCategory);

  // Clean, luxury 3-column grid layout aspect ratios (alternating portrait & editorial aspect ratios)
  const getCardAspect = (index: number) => {
    const pattern = index % 6;
    if (pattern === 0) return 'aspect-[4/5]';
    if (pattern === 1) return 'aspect-[3/4]';
    if (pattern === 2) return 'aspect-[4/5]';
    if (pattern === 3) return 'aspect-[3/4]';
    if (pattern === 4) return 'aspect-[4/5]';
    return 'aspect-[3/4]';
  };

  return (
    <section className="bg-slate-950 py-4 sm:py-12 text-slate-100 border-t border-slate-900 w-full overflow-hidden cv-auto">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12">
        {/* Section Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sm:mb-12 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400">
                03 / Master Archive
              </span>
              {/* 2D / 3D Mode Switcher */}
              <div className="flex items-center p-1 bg-slate-900 rounded-none border border-slate-800 shrink-0">
                <button
                  onClick={() => setViewMode('2d')}
                  className={`px-3 py-1.5 rounded-none text-[10px] uppercase font-mono tracking-widest transition-all flex items-center gap-1.5 ${
                    viewMode === '2d'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Grid className="w-3 h-3" />
                  <span>Gallery Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1.5 rounded-none text-[10px] uppercase font-mono tracking-widest transition-all flex items-center gap-1.5 ${
                    viewMode === '3d'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Box className="w-3 h-3" />
                  <span>3D Pavilion</span>
                </button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light text-slate-100">
              Selected Works & Portfolio
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-none text-xs uppercase tracking-[0.2em] font-mono whitespace-nowrap transition-all border shrink-0 ${
                activeCategory === 'all'
                  ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold shadow-md'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              All Works ({projects.length})
            </button>

            {categories.map((cat) => {
              const count = projects.filter((p) => p.category.slug === cat.slug).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-none text-xs uppercase tracking-[0.2em] font-mono whitespace-nowrap transition-all border shrink-0 ${
                    activeCategory === cat.slug
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold shadow-md'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Display Mode */}
        {viewMode === '3d' ? (
          <ThreeGalleryShowcase projects={filteredProjects} />
        ) : (
          /* Clean 3-Column Luxury Portfolio Grid (Full-Bleed Edge-to-Edge on Mobile) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 -mx-4 sm:mx-0">
            {filteredProjects.map((proj, idx) => (
              <TiltCard3D
                key={proj.id}
                dataCursorImg={proj.coverImage}
                className={`group relative overflow-hidden bg-slate-900 border border-slate-800/90 rounded-none transition-all duration-700 hover:border-amber-500/70 shadow-2xl ${getCardAspect(
                  idx
                )}`}
              >
                <Link href={`/portfolio/${proj.slug}`} className="block w-full h-full relative overflow-hidden">
                  <ParallaxImage
                    src={getOptimizedImageUrl(proj.coverImage, 'balanced')}
                    alt={proj.title}
                    className="w-full h-full group-hover:scale-108 transition-transform duration-1000 ease-out"
                  />

                  {/* Corner Accents */}
                  <div className="absolute top-4 left-4 w-5 h-5 border-l border-t border-amber-400/80 z-20 opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 w-5 h-5 border-r border-t border-amber-400/80 z-20 opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                  <div className="absolute bottom-4 left-4 w-5 h-5 border-l border-b border-amber-400/80 z-20 opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                  <div className="absolute bottom-4 right-4 w-5 h-5 border-r border-b border-amber-400/80 z-20 opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />

                  {/* Gradient Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                  {/* Top-Left Category Badge */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
                    <span className="px-3 py-1.5 rounded-none bg-slate-950/80 backdrop-blur-md text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-amber-300 border border-amber-500/30 font-mono font-medium shadow-lg inline-block">
                      {proj.category.name}
                    </span>
                  </div>

                  {/* Top-Right Action Arrow & Frame Badge */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-[9px] uppercase font-mono text-amber-400">
                      <Camera className="w-3 h-3" />
                      <span>FRAME 0{idx + 1}</span>
                    </span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-none bg-slate-950/80 backdrop-blur-md border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 transform group-hover:-translate-y-1 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-400 font-mono">
                        {proj.location || 'Studio Exclusive'}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white group-hover:text-amber-200 transition-colors leading-snug line-clamp-2 font-light">
                      {proj.title}
                    </h3>
                  </div>
                </Link>
              </TiltCard3D>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
