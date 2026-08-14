export function isLightColor(colorHex: string): boolean {
  if (!colorHex) return false;
  const hex = colorHex.replace('#', '');
  if (hex.length < 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150;
}

export function applyDynamicThemeToDocument(
  primaryColor: string = '#f59e0b',
  secondaryColor: string = '#0b0f19',
  accentColor: string = '#fbbf24',
  fontFamily: string = 'Playfair Display, serif'
) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const isLight = isLightColor(secondaryColor);

  root.classList.toggle('light', isLight);
  root.classList.toggle('dark', !isLight);
  root.style.setProperty('color-scheme', isLight ? 'light' : 'dark');

  // Root CSS variables
  root.style.setProperty('--primary-color', primaryColor);
  root.style.setProperty('--secondary-color', secondaryColor);
  root.style.setProperty('--accent-color', accentColor);
  root.style.setProperty('--font-family', fontFamily);

  // Tailwind v4 dynamic token mapping
  root.style.setProperty('--color-primary', primaryColor);
  root.style.setProperty('--color-secondary', secondaryColor);
  root.style.setProperty('--color-accent', accentColor);
  root.style.setProperty('--color-amber-300', accentColor);
  root.style.setProperty('--color-amber-400', primaryColor);
  root.style.setProperty('--color-amber-500', primaryColor);
  root.style.setProperty('--color-amber-600', primaryColor);
  root.style.setProperty('--font-serif', fontFamily);

  const slate100 = isLight ? '#0f172a' : '#f8fafc';
  const slate200 = isLight ? '#1e293b' : '#e2e8f0';
  const slate300 = isLight ? '#334155' : '#cbd5e1';

  root.style.setProperty('--slate-100-color', slate100);
  root.style.setProperty('--slate-200-color', slate200);
  root.style.setProperty('--slate-300-color', slate300);

  if (isLight) {
    root.style.setProperty('--color-slate-950', secondaryColor);
    root.style.setProperty('--color-slate-900', '#ffffff');
    root.style.setProperty('--color-slate-800', '#e2e8f0');
    root.style.setProperty('--color-slate-700', '#cbd5e1');
    root.style.setProperty('--color-slate-600', '#475569');
    root.style.setProperty('--color-slate-500', '#64748b');
    root.style.setProperty('--color-slate-400', '#475569');
    root.style.setProperty('--color-slate-300', '#334155');
    root.style.setProperty('--color-slate-200', '#1e293b');
    root.style.setProperty('--color-slate-100', '#0f172a');
    root.style.setProperty('--color-slate-50', '#020617');
  } else {
    root.style.setProperty('--color-slate-950', secondaryColor);
    root.style.setProperty('--color-slate-900', '#0f172a');
    root.style.setProperty('--color-slate-800', '#1e293b');
    root.style.setProperty('--color-slate-700', '#334155');
    root.style.setProperty('--color-slate-600', '#475569');
    root.style.setProperty('--color-slate-500', '#64748b');
    root.style.setProperty('--color-slate-400', '#94a3b8');
    root.style.setProperty('--color-slate-300', '#cbd5e1');
    root.style.setProperty('--color-slate-200', '#e2e8f0');
    root.style.setProperty('--color-slate-100', '#f8fafc');
    root.style.setProperty('--color-slate-50', '#ffffff');
  }
}

export function getSsrThemeCss(
  primaryColor: string = '#f59e0b',
  secondaryColor: string = '#0b0f19',
  accentColor: string = '#fbbf24',
  fontFamily: string = 'Playfair Display, serif'
): string {
  const isLight = isLightColor(secondaryColor);
  const slate100 = isLight ? '#0f172a' : '#f8fafc';
  const slate200 = isLight ? '#1e293b' : '#e2e8f0';
  const slate300 = isLight ? '#334155' : '#cbd5e1';

  return `
    :root {
      color-scheme: ${isLight ? 'light' : 'dark'};
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

      --font-serif: ${fontFamily};

      --slate-100-color: ${slate100};
      --slate-200-color: ${slate200};
      --slate-300-color: ${slate300};

      --color-slate-950: ${secondaryColor};
      --color-slate-900: ${isLight ? '#ffffff' : '#0f172a'};
      --color-slate-800: ${isLight ? '#e2e8f0' : '#1e293b'};
      --color-slate-700: ${isLight ? '#cbd5e1' : '#334155'};
      --color-slate-600: ${isLight ? '#475569' : '#475569'};
      --color-slate-500: ${isLight ? '#64748b' : '#64748b'};
      --color-slate-400: ${isLight ? '#475569' : '#94a3b8'};
      --color-slate-300: ${slate300};
      --color-slate-200: ${slate200};
      --color-slate-100: ${slate100};
      --color-slate-50: ${isLight ? '#020617' : '#ffffff'};
    }
  `;
}
