'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Grid, List } from 'lucide-react';
import TiltCard3D from '../animations/TiltCard3D';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
}

interface CategoryDiscoveryProps {
  categories: Category[];
}

export default function CategoryDiscovery({ categories }: CategoryDiscoveryProps) {
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('grid');
  const [hoveredImage, setHoveredImage] = useState<string | null>(
    categories[0]?.coverImage || null
  );

  return (
    <section className="relative bg-slate-950 py-4 sm:py-10 text-slate-100 border-t border-slate-900 overflow-hidden w-full">
      {/* Background Hover Cover Image for List view */}
      {viewStyle === 'list' && (
        <div className="absolute inset-0 z-0">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                hoveredImage === cat.coverImage ? 'opacity-25' : 'opacity-0'
              }`}
            >
              {cat.coverImage && (
                /* eslint-disable-next-app-element */
                <img
                  src={cat.coverImage}
                  alt={cat.name}
                  className="w-full h-full object-cover filter brightness-75 scale-105"
                />
              )}
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950" />
        </div>
      )}

      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header Inspired by Luxury Editorial Design */}
        <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-6 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-none border border-amber-500/30 bg-slate-900/60 mb-3 sm:mb-4">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-mono text-amber-400">
              Our Fine Art Portfolio
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light text-slate-100 mb-3">
            Every Story, Emotion & Celebration
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed font-serif max-w-xl mx-auto">
            Explore our visual archives across luxury destination weddings, fine art portraits, pre-wedding sagas, and high-fashion editorial campaigns.
          </p>

          {/* Grid / List Switcher */}
          <div className="flex justify-center mt-5 sm:mt-6">
            <div className="flex items-center p-1 bg-slate-900 rounded-none border border-slate-800">
              <button
                onClick={() => setViewStyle('grid')}
                className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-none text-[9px] sm:text-[10px] uppercase font-mono tracking-widest transition-all flex items-center gap-1.5 ${
                  viewStyle === 'grid'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>2-Column Grid</span>
              </button>
              <button
                onClick={() => setViewStyle('list')}
                className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-none text-[9px] sm:text-[10px] uppercase font-mono tracking-widest transition-all flex items-center gap-1.5 ${
                  viewStyle === 'list'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Editorial List</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Luxury Tile Grid */}
        {viewStyle === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 -mx-4 sm:mx-0">
            {categories.map((cat) => (
              <TiltCard3D
                key={cat.id}
                dataCursorImg={cat.coverImage || undefined}
                className="group relative overflow-hidden bg-slate-900 border-y sm:border border-slate-800 rounded-none transition-all duration-500 hover:border-amber-500/70 flex flex-col"
              >
                <Link href={`/portfolio?category=${cat.slug}`} className="w-full h-full flex flex-col">
                  {/* Clean Category Photography Window */}
                  <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-slate-950">
                    {cat.coverImage && (
                      /* eslint-disable-next-app-element */
                      <img
                        src={cat.coverImage}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    )}
                  </div>

                  {/* Compact Content Below Image */}
                  <div className="p-4 sm:p-4.5 bg-slate-900 flex flex-col justify-center border-t border-slate-800/80 group-hover:bg-slate-950 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1 text-[10px] sm:text-xs text-amber-400 font-mono">
                      <span>EXPLORE COLLECTION</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base sm:text-lg font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-snug line-clamp-1 font-normal">
                        {cat.name}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </TiltCard3D>
            ))}
          </div>
        ) : (
          /* Editorial List View */
          <div className="divide-y divide-slate-800/80 max-w-5xl mx-auto px-2">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                onMouseEnter={() => cat.coverImage && setHoveredImage(cat.coverImage)}
                className="py-6 sm:py-8 group flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 transition-all"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="text-xs sm:text-sm font-mono text-amber-500/60 group-hover:text-amber-400">
                    0{idx + 1}
                  </span>
                  <Link href={`/portfolio?category=${cat.slug}`}>
                    <h3 className="text-xl sm:text-3xl md:text-4xl font-serif text-slate-200 group-hover:text-amber-300 group-hover:translate-x-3 transition-all duration-300">
                      {cat.name}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                  <p className="text-xs text-slate-400 max-w-md font-light hidden lg:block">
                    {cat.description}
                  </p>
                  <Link
                    href={`/portfolio?category=${cat.slug}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-none border border-slate-800 flex items-center justify-center text-slate-400 group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shrink-0 ml-auto md:ml-0"
                  >
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
