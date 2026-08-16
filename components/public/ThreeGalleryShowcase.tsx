'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowLeft, ArrowRight, RotateCw, Layers } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  location?: string | null;
  category: { name: string };
}

interface ThreeGalleryShowcaseProps {
  projects: Project[];
}

export default function ThreeGalleryShowcase({ projects }: ThreeGalleryShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!autoRotate || !projects || projects.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRotate, projects]);

  if (!projects || projects.length === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const activeProject = projects[activeIndex];

  return (
    <div className="relative w-full min-h-[440px] sm:min-h-[750px] bg-slate-950 rounded-none overflow-hidden border-y border-slate-800/80 shadow-2xl py-4 sm:py-12 flex flex-col justify-between my-2 sm:my-4">
      {/* 3D Header Overlay */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 flex items-center justify-between z-20 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-none border border-amber-500/40 bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-lg shrink-0">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-mono text-amber-400 block">
              3D Exhibition
            </span>
            <h3 className="text-sm sm:text-xl font-serif text-slate-100 line-clamp-1">Visual Pavilion</h3>
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-none text-[9px] sm:text-xs font-mono uppercase tracking-widest border transition-all flex items-center gap-1.5 ${
              autoRotate
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{autoRotate ? 'Auto Spin ON' : 'Auto Spin OFF'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-none border border-slate-800 bg-slate-900/80 text-slate-200 hover:border-amber-400 hover:text-amber-400 flex items-center justify-center transition-colors"
              aria-label="Previous Slide"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-none border border-slate-800 bg-slate-900/80 text-slate-200 hover:border-amber-400 hover:text-amber-400 flex items-center justify-center transition-colors"
              aria-label="Next Slide"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Perspective Mobile Touch Canvas Container */}
      <div className="relative w-full h-[280px] sm:h-[480px] flex items-center justify-center perspective-[1000px] sm:perspective-[1400px] overflow-hidden my-1 sm:my-2">
        {projects.map((proj, idx) => {
          const offset = idx - activeIndex;
          const absOffset = Math.abs(offset);
          const isCurrent = idx === activeIndex;

          let transform = 'scale(0.6) translateZ(-400px)';
          let opacity = 0;
          let zIndex = 0;

          if (isCurrent) {
            transform = 'translateZ(0px) rotateY(0deg) scale(1.02)';
            opacity = 1;
            zIndex = 30;
          } else if (offset === 1 || (offset === -(projects.length - 1))) {
            transform = 'translateX(160px) sm:translateX(320px) translateZ(-160px) rotateY(-25deg) scale(0.82)';
            opacity = 0.7;
            zIndex = 20;
          } else if (offset === -1 || (offset === (projects.length - 1))) {
            transform = 'translateX(-160px) sm:translateX(-320px) translateZ(-160px) rotateY(25deg) scale(0.82)';
            opacity = 0.7;
            zIndex = 20;
          } else if (absOffset === 2) {
            transform = `translateX(${offset > 0 ? '280px' : '-280px'}) translateZ(-300px) rotateY(${offset > 0 ? '-35deg' : '35deg'}) scale(0.65)`;
            opacity = 0.35;
            zIndex = 10;
          }

          return (
            <div
              key={proj.id}
              onClick={() => setActiveIndex(idx)}
              style={{
                transform,
                opacity,
                zIndex,
                transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="absolute w-[230px] sm:w-[420px] aspect-[3/4] sm:aspect-[4/5] bg-slate-900 border border-slate-800 rounded-none overflow-hidden cursor-pointer shadow-2xl group"
            >
              {/* eslint-disable-next-app-element */}
              <img
                src={proj.coverImage}
                alt={proj.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 z-10">
                <span className="text-[9px] uppercase font-mono text-white block mb-0.5">
                  {proj.category.name}
                </span>
                <h4 className="text-sm sm:text-lg font-serif text-slate-100 tracking-wide line-clamp-1">
                  {proj.title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Full-Width Footer Bar */}
      {activeProject && (
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 z-20 mt-2 sm:mt-4">
          <div className="bg-slate-900/90 backdrop-blur-xl p-3.5 sm:p-6 rounded-none border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono text-amber-400 block mb-0.5">
                0{activeIndex + 1} / 0{projects.length} • {activeProject.category.name}
              </span>
              <h4 className="text-base sm:text-2xl font-serif text-slate-100 line-clamp-1">
                {activeProject.title}
              </h4>
            </div>

            <Link
              href={`/portfolio/${activeProject.slug}`}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-3.5 rounded-none bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-semibold text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all shrink-0"
            >
              <span>Explore Narrative</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
