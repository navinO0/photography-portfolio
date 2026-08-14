import { getAllProjectsAdmin } from '@/services/portfolio.service';
import { getBookingsAdmin, getContactInquiriesAdmin } from '@/services/booking.service';
import Link from 'next/link';
import { Image as ImageIcon, Calendar, MessageSquare, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export default async function AdminDashboardOverview() {
  const [projects, bookings, inquiries] = await Promise.all([
    getAllProjectsAdmin(),
    getBookingsAdmin(),
    getContactInquiriesAdmin(),
  ]);

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-2">
          Studio Console
        </span>
        <h1 className="text-3xl font-serif font-light text-slate-100">
          Executive Dashboard Overview
        </h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Total Projects</span>
            <ImageIcon className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-4xl font-serif text-slate-100">{projects.length}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Total Bookings</span>
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-4xl font-serif text-slate-100">{bookings.length}</p>
          <span className="text-[11px] text-amber-400 font-mono mt-1 block">
            {pendingBookings.length} Pending Approval
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Inquiries</span>
            <MessageSquare className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-4xl font-serif text-slate-100">{inquiries.length}</p>
        </div>
      </div>

      {/* Recent Bookings List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif text-slate-100">Recent Reservation Requests</h3>
          <Link
            href="/admin/bookings"
            className="text-xs font-mono uppercase tracking-widest text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Manage All Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono py-6">No booking requests received yet.</p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-serif text-slate-100">{b.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {b.eventType} • {new Date(b.eventDate).toLocaleDateString()} • {b.location}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-amber-300">{b.budgetRange || 'Bespoke'}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-widest ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
