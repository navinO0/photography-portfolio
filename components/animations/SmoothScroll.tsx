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

    // Temporarily set HTML scrollBehavior to 'auto' to ensure an instant snap to top
    const htmlEl = document.documentElement;
    const originalBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';

    // Reset window and document body scroll positions immediately to 0
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Reset scroll position of any internal scrollable containers (e.g., admin content main panel)
    const containers = document.querySelectorAll<HTMLElement>(
      'main, [data-scroll-container], .overflow-y-auto, .overflow-auto, .overflow-y-scroll'
    );
    containers.forEach((container) => {
      container.scrollTop = 0;
      container.scrollLeft = 0;
    });

    // Restore CSS scrollBehavior and refresh GSAP ScrollTrigger after layout update
    const animationFrameId = requestAnimationFrame(() => {
      htmlEl.style.scrollBehavior = originalBehavior;
      ScrollTrigger.refresh();
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
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




