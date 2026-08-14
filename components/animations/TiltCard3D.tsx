'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number;
  dataCursorImg?: string;
  enableGlow?: boolean;
}

export default function TiltCard3D({
  children,
  className = '',
  maxRotate = 15,
  dataCursorImg,
  enableGlow = true,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxRotate, -maxRotate]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxRotate, maxRotate]), springConfig);

  const glareX = useTransform(x, [0, 1], ['0%', '100%']);
  const glareY = useTransform(y, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable mouse effects on mobile touch screens (< 768px)
    if (typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)) {
      return;
    }
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const posX = (e.clientX - rect.left) / rect.width;
    const posY = (e.clientY - rect.top) / rect.height;
    x.set(posX);
    y.set(posY);
  };

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)) {
      return;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
      data-cursor-img={dataCursorImg}
    >
      {/* Background Outer Glow Effect (Desktop Only) */}
      {enableGlow && isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="absolute -inset-1.5 -z-10 rounded-none pointer-events-none blur-lg opacity-80 hidden md:block"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, var(--primary-color, #f59e0b) 0%, var(--accent-color, #fbbf24) 40%, transparent 80%)`,
          }}
        />
      )}

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative rounded-none overflow-hidden transition-shadow duration-500"
      >
        {children}

        {/* Dynamic 3D Radial Glare & Hover Accent Layer (Desktop Only) */}
        {enableGlow && isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-30 opacity-45 mix-blend-screen rounded-none transition-opacity duration-300 hidden md:block"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.7) 0%, var(--primary-color, #f59e0b) 35%, transparent 75%)`,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
