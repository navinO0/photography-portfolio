'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import MagneticButton from '../animations/MagneticButton';
import TextReveal from '../animations/TextReveal';
import Hero3DCanvas from '../animations/Hero3DCanvas';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  mediaUrl?: string;
  contentPosition?: string;
  gradientIntensity?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop',
];

export default function HeroSection({
  title = 'WE CAPTURE THE MOMENTS YOU NEVER WANT TO FORGET.',
  subtitle = 'Timeless portraits for everlasting memories. Award-winning luxury photography for destination weddings, royal celebrations, and fine art editorial.',
  mediaUrl,
  contentPosition = 'bottom-left',
  gradientIntensity = 'heavy',
  ctaPrimaryText = 'View Our Work',
  ctaSecondaryText = 'Book Your Date',
}: HeroSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const isVideo = (url?: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.endsWith('.mp4') ||
      lower.endsWith('.webm') ||
      lower.endsWith('.mov') ||
      lower.includes('/video') ||
      lower.includes('mixkit')
    );
  };

  useEffect(() => {
    if (mediaUrl && isVideo(mediaUrl)) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [mediaUrl]);

  const activeImages = mediaUrl ? [mediaUrl] : HERO_IMAGES;

  // Vertical alignment on flex-col parent <section>
  const getSectionAlignment = () => {
    switch (contentPosition) {
      case 'center':
        return 'flex-col justify-center items-center';
      case 'bottom-center':
        return 'flex-col justify-end items-center pb-6 sm:pb-20';
      case 'top-left':
        return 'flex-col justify-start items-start pt-24 sm:pt-36 pb-6';
      case 'bottom-left':
      default:
        return 'flex-col justify-end items-start pb-6 sm:pb-20';
    }
  };

  // Text alignment inside the content block
  const getContentChildAlignment = () => {
    switch (contentPosition) {
      case 'center':
      case 'bottom-center':
        return 'items-center text-center mx-auto';
      case 'top-left':
      case 'bottom-left':
      default:
        return 'items-start text-left';
    }
  };

  // Gradient dark overlay intensity calculator (ALWAYS black dark gradient for photo legibility)
  const getGradientOpacity = () => {
    switch (gradientIntensity) {
      case 'subtle':
        return 'from-black/75 via-black/35 to-transparent';
      case 'medium':
        return 'from-black/90 via-black/60 to-black/25';
      case 'heavy':
      default:
        return 'from-black/95 via-black/80 to-black/35';
    }
  };

  return (
    <section className={`relative w-full h-screen min-h-screen flex overflow-hidden bg-black ${getSectionAlignment()}`}>
      {/* 3D Particle Ambient Canvas */}
      <Hero3DCanvas />

      {/* Media Rendering: HTML5 Video vs Image Slideshow */}
      {mediaUrl && isVideo(mediaUrl) ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src={mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
          />
        </div>
      ) : (
        /* Hero Background Slideshow with Slow Ken Burns Effect */
        activeImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === (currentIdx % activeImages.length) ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            {/* eslint-disable-next-app-element */}
            <img
              src={img}
              alt="Hero Visual"
              className="w-full h-full object-cover animate-ken-burns scale-110"
              loading="eager"
            />
          </div>
        ))
      )}

      {/* Dynamic Configurable Gradient Dark Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${getGradientOpacity()} z-10`} />
      <div className={`absolute inset-0 bg-gradient-to-r ${getGradientOpacity()} z-10`} />

      {/* Matrix Code / Coordinates Overlay Top-Right */}
      <div className="absolute top-24 sm:top-28 right-4 md:right-12 z-20 hidden sm:flex flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400/90">
        <span>[SYS.LOC] 40.7128° N, 74.0060° W</span>
        <span>0{(currentIdx % activeImages.length) + 1} // 0{activeImages.length} FRAME_INDEX</span>
        <span className="text-white/70">ISO 100 • 35MM F/1.4</span>
      </div>

      {/* Configurable Hero Content Container */}
      <div className={`relative z-20 w-full max-w-[1920px] px-4 sm:px-12 md:px-16 text-white flex flex-col max-w-2xl pt-20 sm:pt-28 ${getContentChildAlignment()}`}>
        {/* Hero Title */}
        <TextReveal className="mb-2 sm:mb-3">
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-serif font-light tracking-[0.1em] sm:tracking-[0.12em] leading-tight sm:leading-snug text-white uppercase drop-shadow-2xl">
            {title}
          </h1>
        </TextReveal>

        {/* Hero Subtitle */}
        <TextReveal delay={0.2} className="mb-5 sm:mb-6 max-w-lg">
          <p className="text-[11px] sm:text-xs md:text-sm text-white/90 font-light leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
        </TextReveal>

        {/* Hero Configurable CTA Buttons */}
        <TextReveal delay={0.4} className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <MagneticButton dataCursor="EXPLORE" className="w-full sm:w-auto">
            <Link
              href="/portfolio"
              className="w-full sm:w-auto px-5 py-3 rounded-none bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-semibold text-[10px] sm:text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl shadow-amber-900/30 text-center block"
            >
              {ctaPrimaryText}
            </Link>
          </MagneticButton>

          <MagneticButton dataCursor="BOOKING" className="w-full sm:w-auto">
            <Link
              href="/booking"
              className="w-full sm:w-auto px-5 py-3 rounded-none border border-white/30 bg-black/80 hover:border-amber-400 text-white font-medium text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 block"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{ctaSecondaryText}</span>
            </Link>
          </MagneticButton>
        </TextReveal>
      </div>

      {/* Bottom-Right Scroll Indicator */}
      <div className="absolute bottom-12 right-6 sm:right-12 z-20 hidden md:flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
        <span className="text-[9px] uppercase tracking-[0.3em] font-mono text-amber-400">Scroll Down</span>
        <div className="w-4 h-7 rounded-none border border-amber-500/40 flex justify-center p-1">
          <div className="w-1 h-1.5 bg-amber-400 rounded-none animate-bounce" />
        </div>
      </div>
    </section>
  );
}
