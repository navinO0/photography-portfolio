import { getCategories, getProjectsByCategory } from '@/services/portfolio.service';
import PortfolioGrid from '@/components/public/PortfolioGrid';
import Link from 'next/link';

interface PortfolioPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams;
  const categorySlug = params.category || 'all';

  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjectsByCategory(categorySlug),
  ]);

  return (
    <div className="bg-slate-950 min-h-screen pt-16 sm:pt-32 pb-8 sm:pb-24 text-slate-100">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-3 sm:mb-16 text-center">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-1.5 sm:mb-4">
          Master Portfolio Archive
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif font-light mb-2 sm:mb-6">
          Cinematic Visual Stories
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
          Explore curated series across destination weddings, high fashion editorials, fine art portraiture, and luxury celebrations.
        </p>
      </div>

      {/* Portfolio Grid Component */}
      <PortfolioGrid categories={categories} projects={projects} />
    </div>
  );
}
