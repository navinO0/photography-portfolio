'use client';

import React, { useEffect } from 'react';
import { applyDynamicThemeToDocument, getSsrThemeCss } from '@/lib/theme-utils';

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
    applyDynamicThemeToDocument(primaryColor, secondaryColor, accentColor, fontFamily);
  }, [primaryColor, secondaryColor, accentColor, fontFamily]);

  const cssString = getSsrThemeCss(primaryColor, secondaryColor, accentColor, fontFamily);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssString }} />
      {children}
    </>
  );
}
