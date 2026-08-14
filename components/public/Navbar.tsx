'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Menu, X, Calendar, Phone } from 'lucide-react';
import MagneticButton from '../animations/MagneticButton';

interface NavbarProps {
  photographerName?: string;
  whatsappNumber?: string;
}

export default function Navbar({
  photographerName = 'Lumina Studios',
  whatsappNumber = '15552345678',
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Services', href: '/services' },
    { name: 'Booking', href: '/booking' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-in-out border-none ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-md py-2.5 sm:py-3 shadow-xl'
            : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-4 sm:py-6'
        }`}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3" data-cursor="LUMINA">
            <div
              className={`w-10 h-10 rounded-none border border-amber-500/50 flex items-center justify-center transition-all ${
                scrolled ? 'bg-slate-900/60' : 'bg-black/60'
              } group-hover:border-amber-400 group-hover:scale-105`}
            >
              <Camera className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span
                className={`text-xl font-serif tracking-widest transition-colors uppercase block ${
                  scrolled ? 'text-slate-100 hover:text-amber-400' : 'text-white hover:text-amber-300 drop-shadow'
                }`}
              >
                {photographerName}
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-amber-400 font-mono block">
                Fine Art Photography
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs uppercase tracking-[0.2em] transition-colors py-1 ${
                    isActive
                      ? 'text-amber-400 font-bold'
                      : scrolled
                      ? 'text-slate-300 hover:text-amber-400'
                      : 'text-white/90 hover:text-amber-300'
                  }`}
                  data-cursor={link.name}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 rounded-none" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello!%20I%20would%20like%20to%20inquire%20about%20a%20photography%20session.`}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs uppercase tracking-widest flex items-center gap-2 transition-colors px-3 py-2 font-mono ${
                scrolled ? 'text-slate-300 hover:text-amber-400' : 'text-white/90 hover:text-amber-300'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>WhatsApp</span>
            </a>

            <MagneticButton dataCursor="BOOK NOW">
              <Link
                href="/booking"
                className="relative group px-5 py-2.5 rounded-none border border-amber-400 bg-amber-500 hover:bg-amber-400 overflow-hidden flex items-center gap-2 transition-all shadow-md"
              >
                <Calendar className="w-3.5 h-3.5 text-black group-hover:rotate-12 transition-transform shrink-0" />
                <span className="text-xs uppercase tracking-widest text-black font-bold font-mono">
                  Book Session
                </span>
              </Link>
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 ${scrolled ? 'text-slate-100' : 'text-white'} hover:text-amber-400`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-center items-center p-8 md:hidden">
          <nav className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif tracking-widest text-slate-200 hover:text-amber-400 transition-colors uppercase"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-6 px-8 py-3 rounded-none bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-semibold tracking-widest uppercase text-sm shadow-xl"
            >
              Book Your Date
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
