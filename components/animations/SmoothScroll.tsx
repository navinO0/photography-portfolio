'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ScrollTrigger } from './gsap';

function ScrollResetHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Force manual scroll restoration so the browser does not restore previous scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const resetToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Reset scroll position of any internal scrollable containers
      const containers = document.querySelectorAll<HTMLElement>(
        'main, [data-scroll-container], .overflow-y-auto, .overflow-auto, .overflow-y-scroll'
      );
      containers.forEach((container) => {
        container.scrollTop = 0;
        container.scrollLeft = 0;
      });
    };

    // Trigger immediate, double RAF, and delayed resets for guaranteed scroll to top on router transition
    resetToTop();
    const raf1 = requestAnimationFrame(resetToTop);
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(resetToTop));
    const t1 = setTimeout(resetToTop, 20);
    const t2 = setTimeout(resetToTop, 100);
    const t3 = setTimeout(() => {
      resetToTop();
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#top' || hash === '#') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return null;
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollResetHandler />
      </Suspense>
      <div className="smooth-scroll-wrapper">{children}</div>
    </>
  );
}




