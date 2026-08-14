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

  // Layout ratio calculator restoring original desktop layout + mobile 2-card & single portrait/landscape breaks
  const getLayoutClasses = (index: number) => {
    const pattern = index % 7;
    const zigZagMobile = 'mt-0';

    switch (pattern) {
      case 0:
        return `col-span-2 md:col-span-2 lg:col-span-2 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] mt-0`;
      case 1:
        return `col-span-1 md:col-span-1 lg:col-span-1 aspect-[3/4] sm:aspect-[2/3] mt-0`;
      case 2:
        return `col-span-1 md:col-span-1 lg:col-span-1 aspect-[3/4] sm:aspect-[1/1] ${zigZagMobile}`;
      case 3:
        return `col-span-2 md:col-span-2 lg:col-span-2 aspect-[4/5] sm:aspect-[16/10] mt-0`;
      case 4:
        return `col-span-1 md:col-span-1 lg:col-span-1 aspect-[3/4] mt-0`;
      case 5:
        return `col-span-2 md:col-span-2 lg:col-span-3 aspect-[16/9] sm:aspect-[21/9] mt-0`;
      case 6:
        return `col-span-1 md:col-span-1 lg:col-span-1 aspect-[3/4] sm:aspect-[4/3] ${zigZagMobile}`;
      default:
        return `col-span-1 md:col-span-1 lg:col-span-1 aspect-[3/4] sm:aspect-[4/5] ${zigZagMobile}`;
    }
  };

  return (
    <section className="bg-slate-950 py-2 sm:py-10 text-slate-100 border-t border-slate-900 w-full overflow-hidden cv-auto">
      <div className="w-full max-w-[1920px] mx-auto px-0.5 sm:px-8 md:px-12">
        {/* Section Header & View Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 sm:gap-6 mb-2 sm:mb-6 px-1.5 sm:px-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-3">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono text-amber-400">
                03 / Portfolio Archive
              </span>
              {/* 2D / 3D View Mode Switcher */}
              <div className="flex items-center p-0.5 sm:p-1 bg-slate-900 rounded-none border border-slate-800">
                <button
                  onClick={() => setViewMode('2d')}
                  className={`px-2 sm:px-3 py-1 rounded-none text-[8px] sm:text-[10px] uppercase font-mono tracking-widest transition-all flex items-center gap-1 sm:gap-1.5 ${
                    viewMode === '2d'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Grid className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Mosaic Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-2 sm:px-3 py-1 rounded-none text-[8px] sm:text-[10px] uppercase font-mono tracking-widest transition-all flex items-center gap-1 sm:gap-1.5 ${
                    viewMode === '3d'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Box className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>3D Pavilion</span>
                </button>
              </div>
            </div>

            <h2 className="text-xl sm:text-4xl md:text-5xl font-serif font-light">
              Selected Works & Portfolio
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scrollbar-none [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 pt-1 w-full md:w-auto -mx-1.5 px-1.5 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-none text-[10px] sm:text-xs uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-900/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
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
                  className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-none text-[10px] sm:text-xs uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                    activeCategory === cat.slug
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-900/30'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
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
          /* Mobile: 2 Cards Per Row with Zig-Zag Layout | Desktop: Original Editorial Mosaic Grid */
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 [grid-auto-flow:dense] gap-1.5 sm:gap-6 md:gap-8">
            {filteredProjects.map((proj, idx) => (
              <TiltCard3D
                key={proj.id}
                dataCursorImg={proj.coverImage}
                className={`group relative overflow-hidden bg-slate-900 border border-slate-800/80 rounded-none transition-all duration-500 hover:border-amber-500/70 shadow-2xl ${getLayoutClasses(
                  idx
                )}`}
              >
                <Link href={`/portfolio/${proj.slug}`} className="block w-full h-full relative">
                  <ParallaxImage
                    src={getOptimizedImageUrl(proj.coverImage, 'balanced')}
                    alt={proj.title}
                    className="w-full h-full"
                  />

                  {/* High-Fashion Editorial Corner Accent */}
                  <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2 border-amber-400/80 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2 border-amber-400/80 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

                  {/* Gradient Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  {/* Top-Right Action Arrow & Frame Index Metadata */}
                  <div className="absolute top-1.5 right-1.5 sm:top-6 sm:right-6 z-20 flex items-center gap-1 sm:gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-[9px] uppercase font-mono text-amber-400">
                      <Camera className="w-3 h-3" />
                      <span>FRAME 0{idx + 1}</span>
                    </span>
                    <div className="w-5 h-5 sm:w-10 sm:h-10 rounded-none bg-slate-950/80 backdrop-blur-md border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      <ArrowUpRight className="w-3 h-3 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-6 sm:left-6 sm:right-6 z-20">
                    <div className="flex items-center gap-1 mb-0.5 sm:mb-1.5">
                      <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                      <span className="text-[7px] sm:text-[10px] uppercase tracking-wider text-amber-400 font-mono truncate">
                        {proj.category.name}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-2xl md:text-3xl font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-snug line-clamp-2 font-normal">
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
