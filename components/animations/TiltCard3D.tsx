'use client';

import React from 'react';

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
  dataCursorImg,
}: TiltCard3DProps) {
  return (
    <div
      className={`relative ${className}`}
      data-cursor-img={dataCursorImg}
    >
      <div className="w-full h-full relative rounded-none overflow-hidden">
        {children}
      </div>
    </div>
  );
}
