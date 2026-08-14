'use client';

import React, { useState } from 'react';
import { THEME_PRESETS, ThemePreset } from '@/lib/themes';
import { Palette, Check, Sun, Moon, Sparkles } from 'lucide-react';

interface ThemePresetsSelectorProps {
  initialPrimary: string;
  initialSecondary: string;
  initialAccent: string;
  initialFont: string;
  onApplyTheme: (preset: ThemePreset) => void;
}

export default function ThemePresetsSelector({
  initialPrimary,
  initialSecondary,
  initialAccent,
  initialFont,
  onApplyTheme,
}: ThemePresetsSelectorProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'dark' | 'light'>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    const match = THEME_PRESETS.find((p) => p.primaryColor.toLowerCase() === initialPrimary.toLowerCase());
    return match ? match.id : 'amber-nocturne';
  });

  const handleSelect = (preset: ThemePreset) => {
    setSelectedPresetId(preset.id);
    onApplyTheme(preset);
  };

  const filteredPresets = THEME_PRESETS.filter((p) => {
    if (filterMode === 'dark') return p.mode === 'dark';
    if (filterMode === 'light') return p.mode === 'light';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-slate-100">15 Studio Theme Presets (Dark & Light)</h3>
            <p className="text-xs text-slate-400 font-mono">
              Instantly transform your site with luxury dark and light color palettes
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-none shrink-0">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest flex items-center gap-1.5 transition-all ${
              filterMode === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All ({THEME_PRESETS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('dark')}
            className={`px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest flex items-center gap-1.5 transition-all ${
              filterMode === 'dark'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark ({THEME_PRESETS.filter((p) => p.mode === 'dark').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('light')}
            className={`px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest flex items-center gap-1.5 transition-all ${
              filterMode === 'light'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light ({THEME_PRESETS.filter((p) => p.mode === 'light').length})</span>
          </button>
        </div>
      </div>

      {/* Theme Presets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {filteredPresets.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const isLightMode = preset.mode === 'light';

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset)}
              className={`p-4 rounded-none border text-left transition-all relative group flex flex-col justify-between h-44 ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500 shadow-2xl'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Mode Badge */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[8px] uppercase font-mono px-2 py-0.5 border ${
                    isLightMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {isLightMode ? '☀️ Light' : '🌙 Dark'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-200 block mb-1 line-clamp-1">
                  {preset.name}
                </span>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              {/* Color Swatches */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                {preset.previewColors.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 rounded-none border border-white/30 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={`Color ${idx + 1}: ${color}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
