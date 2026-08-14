'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 1024 ||
        window.matchMedia('(pointer: coarse)').matches;

      setEnabled(!isTouch);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('[data-cursor], a, button, input, select');

      if (interactiveEl) {
        setIsHovered(true);
        const cursorData = interactiveEl.getAttribute('data-cursor');
        const imgData = interactiveEl.getAttribute('data-cursor-img');
        if (cursorData) setCursorText(cursorData);
        if (imgData) setPreviewImage(imgData);
      } else {
        setIsHovered(false);
        setCursorText('');
        setPreviewImage(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <div className="hidden lg:block">
      {/* Outer Glow Ring / Image Preview */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: previewImage ? 160 : isHovered ? 64 : 16,
          height: previewImage ? 200 : isHovered ? 64 : 16,
          borderRadius: previewImage ? '12px' : '9999px',
          backgroundColor: previewImage ? 'transparent' : isHovered ? 'rgba(217, 119, 6, 0.25)' : 'rgba(255, 255, 255, 0.75)',
          border: previewImage ? '2px solid rgba(245, 158, 11, 0.8)' : isHovered ? '1px solid rgba(245, 158, 11, 0.8)' : 'none',
          backdropFilter: isHovered && !previewImage ? 'blur(4px)' : 'none',
          boxShadow: previewImage ? '0 20px 40px rgba(0,0,0,0.6)' : isHovered ? '0 0 20px rgba(245,158,11,0.4)' : 'none',
        }}
      >
        {previewImage ? (
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={previewImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : cursorText ? (
          <span className="text-[10px] uppercase tracking-widest font-semibold text-amber-300 px-2 text-center select-none">
            {cursorText}
          </span>
        ) : null}
      </motion.div>
    </div>
  );
}
