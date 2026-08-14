import { getBookingsAdmin, getAvailabilities } from '@/services/booking.service';
import { Calendar, Clock, CheckCircle2, XCircle, MapPin, Mail, Phone, User } from 'lucide-react';

export default async function AdminBookingsPage() {
  const [bookings, availabilities] = await Promise.all([
    getBookingsAdmin(),
    getAvailabilities(),
  ]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-1">
          Calendar & Reservations
        </span>
        <h1 className="text-3xl font-serif font-light text-slate-100">
          Bookings & Date Availability
        </h1>
      </div>

      {/* Bookings Table / Cards */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
        <h3 className="text-xl font-serif text-slate-100 mb-6">
          Inquiry Booking Queue ({bookings.length})
        </h3>

        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-serif text-slate-100">{b.name}</h4>
                  <span className="px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {b.eventType}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    {b.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    {b.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {new Date(b.eventDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {b.location}
                  </span>
                </div>
                {b.message && (
                  <p className="text-xs text-slate-400 font-light italic pt-2">
                    "{b.message}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-mono text-amber-400 block">{b.budgetRange}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">Status: {b.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
