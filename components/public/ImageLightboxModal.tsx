'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Aperture, ZoomIn, ZoomOut } from 'lucide-react';

export interface LightboxImage {
  id?: string;
  imageUrl: string;
  altText?: string | null;
  title?: string | null;
}

interface ImageLightboxModalProps {
  images: LightboxImage[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageLightboxModal({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageLightboxModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < images.length;
  const currentImage = isOpen ? images[currentIndex] : null;

  // Keyboard navigation & scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || currentIndex === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swiped Left -> Next
        onNavigate((currentIndex + 1) % images.length);
      } else {
        // Swiped Right -> Prev
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
    }
    touchStartX.current = null;
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl select-none animate-in fade-in duration-300"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-slate-950/90 to-transparent">
        {/* Frame Index Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-2.5 py-1 bg-slate-900/90 border border-amber-500/40 text-[9px] sm:text-xs font-mono uppercase tracking-[0.2em] text-amber-400">
            FRAME {String(currentIndex + 1).padStart(2, '0')} // {String(images.length).padStart(2, '0')}
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase tracking-widest">
            <Aperture className="w-3.5 h-3.5 text-amber-400" />
            35MM FINE ART ARCHIVE
          </span>
        </div>

        {/* Action Controls: Zoom, Fullscreen, Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="w-9 h-9 sm:w-10 sm:h-10 border border-slate-800 bg-slate-900/80 hover:border-amber-400 text-slate-300 hover:text-amber-400 flex items-center justify-center transition-colors"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            aria-label="Toggle Zoom"
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex w-10 h-10 border border-slate-800 bg-slate-900/80 hover:border-amber-400 text-slate-300 hover:text-amber-400 items-center justify-center transition-colors"
            title="Toggle Fullscreen Mode"
            aria-label="Toggle Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 border border-amber-500/50 bg-slate-900/90 text-amber-400 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all shadow-lg"
            title="Close Viewer (Esc)"
            aria-label="Close Viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Display Area */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-16 overflow-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* eslint-disable-next-app-element */}
        <img
          src={currentImage.imageUrl}
          alt={currentImage.altText || currentImage.title || 'Full Screen View'}
          className={`max-w-full max-h-[85vh] object-contain shadow-2xl transition-all duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-14 sm:h-14 border border-slate-800 bg-slate-950/80 hover:border-amber-400 text-slate-200 hover:text-amber-400 flex items-center justify-center transition-all backdrop-blur-md shadow-2xl"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <button
            onClick={() => onNavigate((currentIndex + 1) % images.length)}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-14 sm:h-14 border border-slate-800 bg-slate-950/80 hover:border-amber-400 text-slate-200 hover:text-amber-400 flex items-center justify-center transition-all backdrop-blur-md shadow-2xl"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </>
      )}

      {/* Bottom Caption Overlay */}
      {(currentImage.title || currentImage.altText) && (
        <div className="absolute bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent text-center">
          <p className="text-xs sm:text-base font-serif text-slate-200 max-w-xl mx-auto line-clamp-2">
            {currentImage.title || currentImage.altText}
          </p>
        </div>
      )}
    </div>
  );
}
