'use client';

import React from 'react';

export default function Hero3DCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 opacity-40">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl" />
    </div>
  );
}
