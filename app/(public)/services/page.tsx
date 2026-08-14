import { getActiveServices } from '@/services/booking.service';
import { getTenantSettings } from '@/services/settings.service';
import { getProjectsByCategory } from '@/services/portfolio.service';
import Link from 'next/link';
import { Check, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';
import MagneticButton from '@/components/animations/MagneticButton';

export default async function ServicesPage() {
  const [services, settings, projects] = await Promise.all([
    getActiveServices(),
    getTenantSettings(),
    getProjectsByCategory('all'),
  ]);

  // Take top cover images for the visual treasures grid
  const galleryPhotos = projects.map((p) => p.coverImage).slice(0, 6);

  return (
    <div className="bg-slate-950 min-h-screen pt-28 sm:pt-32 pb-24 text-slate-100 w-full overflow-hidden">
      {/* Services Banner Header */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 mb-12 sm:mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none border border-amber-500/30 bg-slate-900/60 mb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-amber-400">
            Services & Investment
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-light mb-4 sm:mb-6 text-slate-100">
          Handcrafted Photography Packages
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
          Bespoke commissions tailored for discerning clientele, destination celebrations, cultural heritage sagas, fine art portraits, and high fashion editorial productions.
        </p>
      </div>

      {/* Services Grid - 2px Side Padding on Mobile Screen */}
      <div className="w-full max-w-[1920px] mx-auto px-0.5 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 mb-20 sm:mb-24">
        {services.map((srv) => {
          const featuresList = (srv.features as string[]) || [];
          return (
            <div
              key={srv.id}
              className="bg-slate-900/60 backdrop-blur-xl rounded-none p-5 sm:p-8 border border-slate-800 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl group overflow-hidden"
            >
              <div>
                {/* Edge-to-Edge Image Header on Mobile Devices */}
                {srv.image && (
                  <div className="rounded-none overflow-hidden aspect-[16/9] mb-6 border-b sm:border border-slate-800 -mx-5 -mt-5 sm:mx-0 sm:mt-0">
                    {/* eslint-disable-next-app-element */}
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-serif text-slate-100 mb-2">{srv.name}</h3>
                {srv.priceStarting && (
                  <span className="text-[10px] sm:text-xs font-mono text-amber-400 uppercase tracking-widest block mb-4">
                    Starting from {srv.priceStarting}
                  </span>
                )}
                <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">
                  {srv.description}
                </p>

                <ul className="space-y-3 pt-6 border-t border-slate-800/80 mb-8">
                  {featuresList.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-light">
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <MagneticButton dataCursor="RESERVE">
                <Link
                  href="/booking"
                  className="w-full py-3.5 rounded-none bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-[0.2em] text-center transition-all block shadow-lg"
                >
                  Commission Package
                </Link>
              </MagneticButton>
            </div>
          );
        })}
      </div>

      {/* Bespoke Quote Banner */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-20 sm:mb-28">
        <div className="bg-slate-900/60 rounded-none p-8 sm:p-12 border border-slate-800 shadow-2xl">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-serif text-slate-200 mb-3">
            To turn all your memories into a lifetime
          </h3>
          <p className="text-xs text-slate-400 font-light mb-8 max-w-md mx-auto leading-relaxed">
            We regularly structure customized multi-day commercial shoots, private island galas, multi-location destination weddings, and tailored heirloom options.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto px-8 py-3.5 rounded-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Book an Appointment</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp}?text=Hi!%20I%20need%20a%20custom%20bespoke%20photography%20quote.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-slate-300 hover:text-amber-400 font-mono border border-slate-800 px-6 py-3.5 rounded-none bg-slate-950"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Director</span>
            </a>
          </div>
        </div>
      </div>

      {/* All Visual Treasures Archive - Edge-to-Edge Image Grid on Mobile */}
      <section className="w-full max-w-[1920px] mx-auto px-0 sm:px-8">
        <div className="text-center mb-8 px-4">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono text-amber-400">
            All Visual Treasures Archive
          </span>
        </div>

        {/* Mobile: 2-Cards Per Row Zig-Zag Layout | Desktop: Original Multi-Column Treasury Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-[1px] sm:gap-3 px-1 sm:px-0">
          {galleryPhotos.map((photo, idx) => (
            <div
              key={idx}
              className={`aspect-square relative overflow-hidden bg-slate-900 border border-slate-800/80 group rounded-none shadow-2xl hover:border-amber-500/60 transition-all duration-500 ${
                idx % 2 === 1 ? 'mt-5 sm:mt-0' : 'mt-0'
              }`}
            >
              {/* eslint-disable-next-app-element */}
              <img
                src={photo}
                alt="Archive Treasury"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Corner Frame Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-amber-400/80 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-amber-400/80 z-20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

              {/* Frame Index Overlay */}
              <div className="absolute top-1.5 left-1.5 sm:top-4 sm:left-4 z-20">
                <span className="px-1.5 py-0.5 sm:px-3 sm:py-1 bg-slate-950/80 backdrop-blur-md text-[7px] sm:text-[9px] uppercase font-mono text-amber-400 border border-amber-500/30">
                  TREASURY 0{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
