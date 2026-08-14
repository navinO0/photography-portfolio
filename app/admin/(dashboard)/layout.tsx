import { getAdminSession } from '@/services/auth.service';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Camera, LayoutDashboard, Image as ImageIcon, Calendar, Settings, LogOut, ArrowUpRight } from 'lucide-react';
import { ToastProvider } from '@/components/ui/Toast';
import DynamicThemeProvider from '@/components/providers/DynamicThemeProvider';
import { getTenantSettings } from '@/services/settings.service';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const settings = await getTenantSettings();

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects & Galleries', href: '/admin/projects', icon: ImageIcon },
    { name: 'Bookings & Dates', href: '/admin/bookings', icon: Calendar },
    { name: 'Studio Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <DynamicThemeProvider
      primaryColor={settings.primaryColor}
      secondaryColor={settings.secondaryColor}
      accentColor={settings.accentColor}
      fontFamily={settings.fontFamily}
    >
      <ToastProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full border border-amber-500/40 flex items-center justify-center bg-slate-950">
                <Camera className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-serif tracking-widest text-slate-100 uppercase block">
                  Studio CMS
                </span>
                <span className="text-[9px] uppercase tracking-widest text-amber-400 font-mono block">
                  {session.name}
                </span>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-none border border-transparent hover:border-slate-800 text-xs uppercase tracking-widest font-mono text-slate-300 hover:bg-slate-800 hover:text-amber-300 transition-colors"
                >
                  <item.icon className="w-4 h-4 text-amber-400" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between text-xs text-slate-400 hover:text-amber-300 font-mono transition-colors"
            >
              <span>View Live Site</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </Link>

            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-none text-xs uppercase tracking-widest font-mono text-rose-400 hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">{children}</main>
      </div>
    </ToastProvider>
  </DynamicThemeProvider>
  );
}
