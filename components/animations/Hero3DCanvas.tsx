'use client';

import React from 'react';

export default function Hero3DCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 opacity-60">
      {/* Subtle Matrix Ambient Ambient Particle Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]" />
    </div>
  );
}
