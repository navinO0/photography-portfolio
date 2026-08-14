import { getTenantSettings } from '@/services/settings.service';
import { Mail, Phone, MapPin, MessageCircle, Clock, Sparkles } from 'lucide-react';

export default async function ContactPage() {
  const settings = await getTenantSettings();

  return (
    <div className="bg-slate-950 min-h-screen pt-32 pb-24 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-4">
          Concierge & Headquarters
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-light mb-6">
          Get in Touch
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-light max-w-2xl mx-auto">
          We welcome inquiries for worldwide destination weddings, editorial shoots, and studio visits by appointment.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Contact Info Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-800 space-y-8 shadow-2xl">
          <div className="flex items-center gap-3 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Studio Headquarters</span>
          </div>

          <h2 className="text-3xl font-serif text-slate-100">
            {settings.photographerName}
          </h2>

          <ul className="space-y-6 text-sm font-light text-slate-300">
            <li className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              <div>
                <strong className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-1">
                  Studio Address
                </strong>
                <span>{settings.address}</span>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              <div>
                <strong className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-1">
                  Telephone Concierge
                </strong>
                <a href={`tel:${settings.phone}`} className="hover:text-amber-400 transition-colors">
                  {settings.phone}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              <div>
                <strong className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-1">
                  Direct Email
                </strong>
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition-colors">
                  {settings.email}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              <div>
                <strong className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-1">
                  Office Hours
                </strong>
                <span>Monday — Saturday: 09:00 - 19:00 EST</span>
              </div>
            </li>
          </ul>

          <div className="pt-6 border-t border-slate-800">
            <a
              href={`https://wa.me/${settings.whatsapp}?text=Hello!%20I%20want%20to%20connect%20with%20your%20studio.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all shadow-xl"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Instant WhatsApp Concierge</span>
            </a>
          </div>
        </div>

        {/* Quick Message Box */}
        <div className="bg-slate-900/40 rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl">
          <h3 className="text-2xl font-serif text-slate-100 mb-4">Send a Message</h3>
          <p className="text-xs text-slate-400 font-light mb-8">
            Have a quick question? Leave us your details and we will reply promptly.
          </p>

          <form action="/api/contact" method="POST" className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-medium text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
            >
              Send Direct Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
