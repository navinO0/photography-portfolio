'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  number?: string;
  message?: string;
}

export default function WhatsAppButton({
  number = '15552345678',
  message = 'Hello Lumina Studios! I would like to inquire about booking a photography session.',
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-none border border-emerald-400 shadow-2xl transition-all duration-300 hover:scale-105"
      aria-label="Direct WhatsApp Inquiry"
      data-cursor="WHATSAPP"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-none animate-ping" />
      </div>
      <span className="text-xs uppercase tracking-widest font-bold text-white font-mono hidden sm:inline-block">
        WhatsApp Concierge
      </span>
    </a>
  );
}
