import BookingForm from '@/components/public/BookingForm';
import { getTenantSettings } from '@/services/settings.service';

export default async function BookingPage() {
  const settings = await getTenantSettings();

  return (
    <div className="bg-slate-950 min-h-screen pt-32 pb-24 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-4">
          Reserve Your Event
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-light mb-6">
          Book Your Date & Experience
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-light max-w-2xl mx-auto">
          Complete the multi-step inquiry form below to check date availability and receive custom pricing packages directly from our studio concierge.
        </p>
      </div>

      <BookingForm whatsappNumber={settings.whatsapp} />
    </div>
  );
}
