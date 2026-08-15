'use client';

import React, { useState, useEffect } from 'react';
import ImageLightboxModal from './ImageLightboxModal';
import { ZoomIn } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/image-optimization';

interface ProjectImage {
  id: string;
  imageUrl: string;
  altText?: string | null;
}

interface ProjectGalleryShowcaseProps {
  images: ProjectImage[];
  projectTitle: string;
}

export default function ProjectGalleryShowcase({
  images,
  projectTitle,
}: ProjectGalleryShowcaseProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!images || images.length === 0) return;
    images.forEach((img) => {
      if (img.imageUrl) {
        const pImg = new Image();
        pImg.src = getOptimizedImageUrl(img.imageUrl, 'balanced');
      }
    });
  }, [images]);

  const lightboxImages = images.map((img) => ({
    id: img.id,
    imageUrl: getOptimizedImageUrl(img.imageUrl, 'max-quality'),
    altText: img.altText || projectTitle,
    title: projectTitle,
  }));

  return (
    <>
      <div className="grid grid-cols-2 sm:block sm:columns-2 lg:columns-3 gap-1 sm:gap-2.5 lg:gap-3 space-y-0 sm:space-y-2.5 lg:space-y-3">
        {images.map((img, idx) => {
          const pattern = idx % 6;
          const mobileLayoutClass =
            pattern === 2
              ? 'col-span-2 aspect-[16/10] sm:aspect-auto mt-0'
              : pattern === 5
              ? 'col-span-2 aspect-[4/5] sm:aspect-auto mt-0'
              : 'col-span-1 aspect-[3/4] sm:aspect-auto mt-0';

          return (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className={`relative group rounded-none overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl transition-all duration-500 hover:border-amber-500/60 mb-1 sm:mb-2.5 lg:mb-3 break-inside-avoid cursor-pointer ${mobileLayoutClass}`}
              data-cursor-img={img.imageUrl}
            >
              {/* eslint-disable-next-app-element */}
              <img
                src={getOptimizedImageUrl(img.imageUrl, 'balanced')}
                alt={img.altText || projectTitle}
                className="w-full h-full sm:h-auto object-cover group-hover:scale-105 transition-transform duration-700 block"
                loading="eager"
              />

              {/* Corner Frame Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2 border-amber-400/80 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2 border-amber-400/80 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

              {/* Magnifying Glass Zoom Icon in Top-Right Corner (No Dimming Overlay) */}
              <div className="absolute top-1.5 right-1.5 sm:top-4 sm:right-4 z-20 pointer-events-none">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-none border border-amber-400/60 bg-slate-950/90 flex items-center justify-center text-amber-400 opacity-80 group-hover:opacity-100 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-400 transition-colors shadow-lg">
                  <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              {/* Subtle Bottom Gradient Overlay for Frame Tag Readability Only */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-40 pointer-events-none" />

              {/* Frame Index Overlay */}
              <div className="absolute top-1.5 left-1.5 sm:top-4 sm:left-4 z-20 pointer-events-none">
                <span className="px-1.5 py-0.5 sm:px-3 sm:py-1 bg-slate-950/90 text-[7px] sm:text-[9px] uppercase font-mono text-amber-400 border border-amber-500/30">
                  FRAME 0{idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Fullscreen Viewer */}
      <ImageLightboxModal
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </>
  );
}
