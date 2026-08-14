import { getAllProjectsAdmin, getCategories } from '@/services/portfolio.service';
import AdminProjectsManager from '@/components/admin/AdminProjectsManager';
import Link from 'next/link';

export default async function AdminProjectsPage() {
  const [projects, categories] = await Promise.all([
    getAllProjectsAdmin(),
    getCategories(),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-1">
            Portfolio Management & Work Upload
          </span>
          <h1 className="text-3xl font-serif font-light text-slate-100">
            Portfolio Projects & Works
          </h1>
        </div>

        <Link
          href="/portfolio"
          target="_blank"
          className="px-6 py-2.5 rounded-none bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-mono uppercase tracking-widest text-slate-200 transition-colors inline-flex items-center gap-2 self-start"
        >
          <span>Preview Live Public Portfolio</span>
        </Link>
      </div>

      <AdminProjectsManager initialProjects={projects as any} categories={categories} />
    </div>
  );
}
