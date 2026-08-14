'use client';

import React, { useEffect } from 'react';

interface DynamicThemeProviderProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  children: React.ReactNode;
}

export default function DynamicThemeProvider({
  primaryColor = '#f59e0b',
  secondaryColor = '#0f172a',
  accentColor = '#fbbf24',
  fontFamily = 'Playfair Display, serif',
  children,
}: DynamicThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--secondary-color', secondaryColor);
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--font-family', fontFamily);
  }, [primaryColor, secondaryColor, accentColor, fontFamily]);

  return <>{children}</>;
}
