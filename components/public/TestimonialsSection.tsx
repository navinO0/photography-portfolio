'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string | null;
  clientImage?: string | null;
  content: string;
  eventType?: string | null;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const active = testimonials[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-slate-950 py-4 sm:py-10 text-slate-100 border-t border-slate-900 overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-2 sm:mb-3">
          05 / Words of Affirmation
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light mb-3 sm:mb-6">
          Client Praise & Legacy Stories
        </h2>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-none p-8 md:p-16 border border-slate-800 relative shadow-2xl">
          <Quote className="w-12 h-12 text-amber-500/20 absolute top-8 left-8" />

          {/* Rating Stars */}
          <div className="flex justify-center gap-1 mb-8">
            {Array.from({ length: active.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Content */}
          <p className="text-lg md:text-2xl font-serif text-slate-200 leading-relaxed font-light mb-10 max-w-3xl mx-auto">
            "{active.content}"
          </p>

          {/* Client Details */}
          <div className="flex flex-col items-center gap-2">
            {active.clientImage && (
              /* eslint-disable-next-app-element */
              <img
                src={active.clientImage}
                alt={active.clientName}
                className="w-14 h-14 rounded-none object-cover border-2 border-amber-400/60 mb-2 shadow-lg"
              />
            )}
            <h4 className="text-base font-serif text-amber-300">{active.clientName}</h4>
            {active.clientRole && (
              <span className="text-xs text-slate-400 font-mono uppercase tracking-widest">
                {active.clientRole}
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-800">
            <span className="text-xs font-mono text-slate-500">
              0{currentIdx + 1} / 0{testimonials.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-none border border-slate-800 flex items-center justify-center text-slate-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-none border border-slate-800 flex items-center justify-center text-slate-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
