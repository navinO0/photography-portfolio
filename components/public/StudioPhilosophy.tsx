'use client';

import ParallaxImage from '../animations/ParallaxImage';
import TextReveal from '../animations/TextReveal';
import { Award, Camera, Globe } from 'lucide-react';

interface StudioPhilosophyProps {
  photographerName?: string;
  photographerTitle?: string;
  bio?: string;
}

export default function StudioPhilosophy({
  photographerName = 'Elena Vance & Marcus Thorne',
  photographerTitle = 'Master Fine Art & Editorial Photographers',
  bio = 'We craft cinematic visual legacies for royalty, luxury weddings, high fashion, and monumental lifetime celebrations worldwide.',
}: StudioPhilosophyProps) {
  return (
    <section className="bg-slate-950 py-4 sm:py-10 text-slate-100 border-t border-slate-900 overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-10 items-center">
        {/* Visual Composition */}
        <div className="relative">
          <div className="rounded-none overflow-hidden shadow-2xl border border-slate-800 aspect-[4/5] relative z-10">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"
              alt="Photographer at Work"
              className="w-full h-full"
            />
          </div>
          {/* Overlay Floating Card */}
          <div className="absolute -bottom-8 -right-8 z-20 bg-slate-900/90 backdrop-blur-xl p-6 rounded-none border border-amber-500/30 max-w-xs shadow-2xl hidden sm:block">
            <Award className="w-8 h-8 text-amber-400 mb-3" />
            <p className="text-xs uppercase tracking-widest text-amber-300 font-mono mb-1">
              Top 10 Global Masters
            </p>
            <p className="text-xs text-slate-400 font-light">
              Recognized by Vogue Weddings & International Photography Guild.
            </p>
          </div>
        </div>

        {/* Narrative & Philosophy */}
        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-4">
            04 / Studio Philosophy
          </span>
          <TextReveal>
            <h2 className="text-3xl md:text-5xl font-serif font-light leading-tight mb-8">
              "We don't take photographs; we document unscripted emotional history."
            </h2>
          </TextReveal>

          <TextReveal delay={0.2}>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-light">
              {bio}
            </p>
          </TextReveal>

          <TextReveal delay={0.3}>
            <p className="text-slate-400 text-sm leading-relaxed mb-10 font-light">
              Every framing is meticulously composed using natural daylight, directional shadow, and authentic cinematic storytelling. Whether high on the cliffs of Amalfi or inside candlelit Parisian châteaux, our mission remains unchanged: crafting heirloom imagery that elevates life's most sacred chapters into pure art.
            </p>
          </TextReveal>

          {/* Credentials Grid */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-900">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-widest text-slate-200 font-mono">Global Travel</h4>
                <p className="text-xs text-slate-400 font-light">Available across Europe, USA & Asia</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-widest text-slate-200 font-mono">Medium Format</h4>
                <p className="text-xs text-slate-400 font-light">Hasselblad & Leica glass quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
