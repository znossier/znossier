'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type ThemeToggleVariant = 'switch' | 'fab';

export function ThemeToggle({ variant = 'switch' }: { variant?: ThemeToggleVariant }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';
  const isOn = theme === 'light'; // ON = light, OFF = dark (dark remains default)
  const toggle = () => setTheme(isOn ? 'dark' : 'light');

  if (!mounted) {
    if (variant === 'fab') {
      return (
        <div
          className="fixed z-40 md:hidden w-12 h-12 rounded-full bg-white shadow-xl bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))]"
          aria-hidden
        />
      );
    }
    return (
      <div
        className="relative w-[120px] h-[32px] rounded-full bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A] border border-black/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        aria-hidden
      >
        <span className="absolute left-[4px] top-1/2 w-[56px] h-[24px] -translate-y-1/2 rounded-full bg-white border border-black/20 shadow-[0_10px_24px_rgba(0,0,0,0.35)]" />
      </div>
    );
  }

  if (variant === 'fab') {
    return (
      <button
        onClick={toggle}
        className={`fixed z-40 md:hidden w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] ${
          isDark
            ? 'bg-white text-[#1A1A1A] hover:bg-gray-100 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-white'
            : 'bg-[#1A1A1A] text-white hover:bg-[#333] focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-[#FAFAFA]'
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            aria-hidden
          >
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="relative w-[120px] h-[32px] rounded-full flex items-center overflow-hidden border border-black/80 bg-gradient-to-r from-[#0F0F0F] to-[#1A1A1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="Toggle theme (ON = light, OFF = dark)"
      role="switch"
      aria-checked={isOn}
    >
      {/* ON label (left) – fades out as thumb covers it */}
      <motion.span
        className="absolute left-[12px] top-1/2 -translate-y-1/2 font-mono text-[11px] font-bold uppercase tracking-wider select-none pointer-events-none"
        animate={{
          opacity: isOn ? 0 : 1,
          scale: isOn ? 0.92 : 1,
        }}
        transition={{ duration: 0.26, ease: [0.33, 1, 0.68, 1] }}
        style={{ color: 'rgba(255,255,255,0.92)' }}
        aria-hidden
      >
        ON
      </motion.span>

      {/* OFF label (right) – fades in as thumb leaves */}
      <motion.span
        className="absolute right-[12px] top-1/2 -translate-y-1/2 font-mono text-[11px] font-bold uppercase tracking-wider select-none pointer-events-none"
        animate={{
          opacity: isOn ? 1 : 0.28,
          scale: isOn ? 1 : 0.92,
        }}
        transition={{ duration: 0.26, ease: [0.33, 1, 0.68, 1], delay: isOn ? 0.04 : 0 }}
        style={{ color: isOn ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)' }}
        aria-hidden
      >
        OFF
      </motion.span>

      {/* Thumb: smooth spring with slight overshoot, shadow follows state */}
      <motion.div
        className="absolute left-[4px] top-1/2 h-[24px] w-[56px] -translate-y-1/2 rounded-full flex items-center justify-center font-mono text-[11px] font-bold uppercase tracking-wider border border-black/20 bg-white text-black overflow-hidden"
        animate={{
          x: isOn ? 0 : 56,
          scale: 1,
          boxShadow: isOn
            ? '0 10px 28px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.12)'
            : '0 8px 22px rgba(0,0,0,0.32), 0 2px 6px rgba(0,0,0,0.1)',
        }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 26,
          mass: 0.6,
        }}
      >
        {/* Thumb label with subtle pop when state changes */}
        <motion.span
          key={isOn ? 'on' : 'off'}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1], delay: 0.06 }}
          className="block"
        >
          {isOn ? 'ON' : 'OFF'}
        </motion.span>
      </motion.div>
    </motion.button>
  );
}
