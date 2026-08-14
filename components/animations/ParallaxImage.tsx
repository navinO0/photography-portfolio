'use client';

import { useEffect, useRef } from 'react';
import { gsap } from './gsap';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  dataCursorImg?: string;
}

export default function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 0.2,
  dataCursorImg,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imgRef.current) return;

    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 1024 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouch) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const img = imgRef.current;
      if (!container || !img) return;

      gsap.fromTo(
        img,
        { scale: 1.15, yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${className}`}
      data-cursor-img={dataCursorImg || src}
    >
      {/* eslint-disable-next-app-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 will-change-transform transform-gpu"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
