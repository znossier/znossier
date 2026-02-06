'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ThemeToggleVariant = 'switch' | 'fab';

export function ThemeToggle({ variant = 'switch' }: { variant?: ThemeToggleVariant }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';
  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  if (!mounted) {
    if (variant === 'fab') {
      return (
        <div
          className="fixed bottom-6 right-6 z-40 md:hidden w-12 h-12 rounded-full bg-white shadow-xl"
          aria-hidden
        />
      );
    }
    return (
      <div className="w-14 h-7 rounded-full border border-foreground/20 bg-background relative">
        <span className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-foreground/20" />
      </div>
    );
  }

  if (variant === 'fab') {
    return (
      <button
        onClick={toggle}
        className={`fixed bottom-6 right-6 z-40 md:hidden w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
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
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full border border-foreground/20 bg-background transition-all duration-200 ease-in-out hover:border-foreground/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="Toggle theme"
      role="switch"
      aria-checked={isDark}
    >
      {/* Toggle track */}
      <div className="absolute inset-0 rounded-full bg-foreground/5 transition-colors duration-300" />
      
      {/* Toggle thumb */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-foreground transition-all duration-300 ease-in-out ${
          isDark ? 'left-7' : 'left-1'
        }`}
      >
        {/* Icon inside thumb */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isDark ? (
            // Moon icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3 text-background"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          ) : (
            // Sun icon - simple and clear
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3 text-background"
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
        </div>
      </div>
    </button>
  );
}
