'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowUpRight } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/image-optimization';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  priceStarting?: string | null;
  image?: string | null;
  features?: any;
}

interface PackagesImageShowcaseProps {
  services: ServicePackage[];
}

function PackageCard({
  srv,
  idx,
  bgImage,
  featuresList,
}: {
  srv: ServicePackage;
  idx: number;
  bgImage?: string | null;
  featuresList: string[];
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      key={srv.id}
      className="group relative rounded-none overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-2xl transition-all duration-500 hover:border-amber-500/80 flex flex-col justify-between"
    >
      <div>
        {/* Clean Image Header without Gradient Overlay */}
        {bgImage && !imgError && (
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950 border-b border-slate-800">
            {/* eslint-disable-next-app-element */}
            <img
              src={getOptimizedImageUrl(bgImage, 'balanced')}
              alt={srv.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block"
              onError={() => setImgError(true)}
            />

            {/* Corner Frame Accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-amber-400/80 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-amber-400/80 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

            {/* Overlay Badges */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[8px] sm:text-[10px] uppercase font-mono text-amber-300 border border-amber-500/40">
                PACKAGE 0{idx + 1}
              </span>

              {srv.priceStarting && (
                <span className="px-2.5 py-1 bg-amber-500 text-black font-mono font-bold text-[9px] sm:text-xs uppercase tracking-widest shadow-lg">
                  STARTING {srv.priceStarting}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Card Content Stack */}
        <div className="p-5 sm:p-6 space-y-3">
          {(!bgImage || imgError) && (
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[8px] sm:text-[10px] uppercase font-mono text-amber-300 border border-amber-500/40">
                PACKAGE 0{idx + 1}
              </span>
              {srv.priceStarting && (
                <span className="px-2.5 py-1 bg-amber-500 text-black font-mono font-bold text-[9px] sm:text-xs uppercase tracking-widest shadow-lg">
                  STARTING {srv.priceStarting}
                </span>
              )}
            </div>
          )}

          {/* Package Title */}
          <h3 className="text-lg sm:text-2xl font-serif text-slate-100 font-normal leading-snug">
            {srv.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-3">
            {srv.description}
          </p>

          {/* Feature Highlights Pills */}
          {featuresList.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5 sm:gap-2">
              {featuresList.slice(0, 3).map((feat, fIdx) => (
                <span
                  key={fIdx}
                  className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 text-[9px] sm:text-[10px] font-mono text-slate-200 flex items-center gap-1.5 max-w-full"
                >
                  <Check className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </span>
              ))}
              {featuresList.length > 3 && (
                <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 text-[9px] font-mono text-amber-400">
                  +{featuresList.length - 3} MORE
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="p-5 sm:p-6 pt-0">
        <Link
          href="/booking"
          className="w-full py-3 px-4 rounded-none bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-[0.2em] text-center transition-all flex items-center justify-center gap-2 shadow-xl"
        >
          <span>Commission Package</span>
          <ArrowUpRight className="w-4 h-4 text-black" />
        </Link>
      </div>
    </div>
  );
}

export default function PackagesImageShowcase({ services }: PackagesImageShowcaseProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="bg-slate-950 py-3 sm:py-10 text-slate-100 border-t border-slate-900 w-full overflow-hidden cv-auto">
      <div className="w-full max-w-[1920px] mx-auto px-0.5 sm:px-8 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 mb-3 sm:mb-8 px-2 sm:px-0">
          <div>
            <div className="flex items-center gap-3 mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono text-amber-400">
                02 / Investment & Commissions
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light text-slate-100">
              Handcrafted Photography Packages
            </h2>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-none border border-amber-500/40 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all text-amber-400 shrink-0 self-start md:self-auto"
          >
            <span>View All Packages</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Editorial Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 md:gap-8">
          {services.map((srv, idx) => {
            const bgImage = srv.image || null;
            const featuresList = (Array.isArray(srv.features) ? srv.features : []) as string[];

            return (
              <PackageCard
                key={srv.id}
                srv={srv}
                idx={idx}
                bgImage={bgImage}
                featuresList={featuresList}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
