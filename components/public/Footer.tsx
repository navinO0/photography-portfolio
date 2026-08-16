'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Camera, Mail, Phone, MapPin, ArrowUpRight, Share2, Video, Globe } from 'lucide-react';

interface FooterProps {
  photographerName?: string;
  photographerTitle?: string;
  bio?: string;
  phone?: string;
  email?: string;
  address?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  instagramPosts?: string[];
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer({
  photographerName = 'Lumina Studios',
  photographerTitle = 'Fine Art & Cinematic Photographer',
  bio = 'Crafting timeless visual stories for extraordinary moments across the globe.',
  phone = '+1 (555) 892-4011',
  email = 'concierge@luminastudios.com',
  address = '740 Park Avenue, Studio 12B, New York, NY 10021',
  instagramUrl = 'https://instagram.com',
  facebookUrl = 'https://facebook.com',
  youtubeUrl = 'https://youtube.com',
  instagramPosts,
}: FooterProps) {
  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({});

  // Only consider posts if provided as non-empty string URLs
  const rawPosts = Array.isArray(instagramPosts)
    ? instagramPosts.filter((url) => typeof url === 'string' && url.trim().length > 0)
    : [];

  const handleImageError = (idx: number) => {
    setFailedIndices((prev) => ({ ...prev, [idx]: true }));
  };

  const validPosts = rawPosts
    .map((url, idx) => ({ url, idx }))
    .filter((item) => !failedIndices[item.idx]);

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 relative overflow-hidden">
      {/* 1. Get In Touch Callout Section */}
      <div className="py-8 sm:py-12 border-b border-slate-900 text-center bg-slate-950/80 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 block mb-2 sm:mb-3">
            Get In Touch
          </span>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light text-slate-100 mb-4 sm:mb-6">
            Let's craft memories that last a lifetime
          </h3>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 sm:px-10 sm:py-4 rounded-none border border-slate-300/40 text-slate-100 hover:border-amber-400 hover:text-amber-400 font-mono text-xs uppercase tracking-[0.25em] transition-all"
          >
            CONTACT US
          </Link>
        </div>
      </div>

      {/* 2. Instagram Showcase Feed Grid (Only shown if valid provided images exist and load successfully) */}
      {validPosts.length > 0 && (
        <div className="py-6 sm:py-10 border-b border-slate-900">
          <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8">
            <div className="text-center mb-4 sm:mb-6">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.3em] font-mono text-amber-400 hover:text-amber-300 inline-flex items-center gap-2"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>FOLLOW US ON INSTAGRAM</span>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {validPosts.map((post) => (
                <a
                  key={post.idx}
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden bg-slate-900 border border-slate-800 rounded-none block"
                >
                  {/* eslint-disable-next-app-element */}
                  <img
                    src={post.url}
                    alt={`Instagram Post Preview ${post.idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={() => handleImageError(post.idx)}
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-400">
                    <InstagramIcon className="w-6 h-6" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* 3. Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-8 sm:py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 sm:mb-10">
          {/* Brand Col */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-none border border-amber-500/40 flex items-center justify-center bg-slate-900">
                <Camera className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-xl font-serif tracking-widest text-slate-100 uppercase block">
                  {photographerName}
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-amber-500/80 font-mono block">
                  {photographerTitle}
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-6 font-light">
              {bio}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-none border border-slate-800 flex items-center justify-center text-slate-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
                aria-label="Instagram"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-none border border-slate-800 flex items-center justify-center text-slate-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
                aria-label="Facebook"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-none border border-slate-800 flex items-center justify-center text-slate-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
                aria-label="YouTube"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-amber-400 font-mono mb-6">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              {['Home', 'Portfolio', 'Services', 'Booking', 'Contact', 'Admin Portal'].map((item) => {
                const href = item === 'Home' ? '/' : item === 'Admin Portal' ? '/admin/login' : `/${item.toLowerCase()}`;
                return (
                  <li key={item}>
                    <Link
                      href={href}
                      className="hover:text-amber-300 transition-colors flex items-center gap-1 group"
                    >
                      <span>{item}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-amber-400 font-mono mb-6">
              Specialties
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Destination Weddings', slug: 'royal-weddings' },
                { name: 'Pre-Wedding Stories', slug: 'pre-weddings' },
                { name: 'Traditional Ceremonies', slug: 'traditional-weddings' },
                { name: 'Fine Art Portraits', slug: 'portraits' },
                { name: 'Haute Fashion', slug: 'fashion' },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/portfolio?category=${cat.slug}`}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-amber-400 font-mono mb-6">
              Concierge Studio
            </h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-amber-300 transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-amber-300 transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-light gap-4">
          <p>© {new Date().getFullYear()} {photographerName}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Powered by Multi-Tenant Luxury Engine</span>
            <span className="w-1 h-1 rounded-none bg-amber-500" />
            <Link href="/admin/login" className="hover:text-amber-400 transition-colors underline">
              Admin CMS
            </Link>
          </p>
        </div>

        {/* Demo Website Disclaimer */}
        <div className="mt-6 pt-4 border-t border-slate-900/80 text-center">
          <p className="text-[9px] sm:text-xs text-slate-400 font-mono leading-relaxed max-w-3xl mx-auto px-4">
            <span className="text-amber-400 font-semibold uppercase tracking-wider">Disclaimer:</span> This is a demonstration website. The content used on this website is for demo purposes only. If it violates any guidelines, please <Link href="/contact" className="text-amber-400 underline hover:text-amber-300">contact us</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
