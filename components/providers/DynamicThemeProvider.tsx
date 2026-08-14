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
  secondaryColor = '#0b0f19',
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

    // Map Tailwind v4 color tokens dynamically so utilities (bg-slate-950, text-amber-400, font-serif) update immediately
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-secondary', secondaryColor);
    root.style.setProperty('--color-accent', accentColor);
    root.style.setProperty('--color-amber-300', accentColor);
    root.style.setProperty('--color-amber-400', primaryColor);
    root.style.setProperty('--color-amber-500', primaryColor);
    root.style.setProperty('--color-amber-600', primaryColor);
    root.style.setProperty('--color-slate-950', secondaryColor);
    root.style.setProperty('--font-serif', fontFamily);
  }, [primaryColor, secondaryColor, accentColor, fontFamily]);

  const cssString = `
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
      --accent-color: ${accentColor};
      --font-family: ${fontFamily};
      --color-primary: ${primaryColor};
      --color-secondary: ${secondaryColor};
      --color-accent: ${accentColor};
      --color-amber-300: ${accentColor};
      --color-amber-400: ${primaryColor};
      --color-amber-500: ${primaryColor};
      --color-amber-600: ${primaryColor};
      --color-slate-950: ${secondaryColor};
      --font-serif: ${fontFamily};
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssString }} />
      {children}
    </>
  );
}
