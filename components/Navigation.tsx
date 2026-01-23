'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { navigationItems } from '@/lib/mock-data';
import { ThemeToggle } from './ThemeToggle';
import { smoothScrollTo } from '@/lib/utils';

export function Navigation() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // If at the top (hero section), clear active section
      if (window.scrollY < 100) {
        setActiveSection('');
        return;
      }

      // Update active section based on scroll position
      const sections = navigationItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          
          // Only activate if we're actually in the section (not just past its top)
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on navigation item
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = () => setMobileMenuOpen(false);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId, 100);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:outline-none"
      >
        Skip to main content
      </a>
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Glass effect background that expands to edges on scroll */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            scrolled
              ? 'bg-background/20 backdrop-blur-xl'
              : 'bg-transparent'
          }`}
        />
        
        {/* Content container - padding decreases on scroll to align with section content */}
        <div ref={navContainerRef} className={`relative mx-auto max-w-7xl w-full transition-all duration-300 ${
          scrolled ? 'px-4 sm:px-6 lg:px-8' : 'px-6 lg:px-10 xl:px-12'
        }`}>
          <div className="flex items-center justify-between h-20">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 text-lg md:text-xl font-bold text-foreground hover:text-foreground/80 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
              aria-label="Zeina Nossier - Go to home"
            >
              {mounted && (
                <Image
                  src={theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg'}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
              {!mounted && (
                <div className="w-6 h-6 bg-foreground/20 rounded flex-shrink-0" aria-hidden="true" />
              )}
              <span className="underline-animate">Zeina Nossier</span>
            </a>

            <div className="flex items-center gap-6">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8" role="list">
                {navigationItems.map((item) => {
                  const sectionId = item.href.substring(1);
                  const isActive = activeSection === sectionId;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(sectionId);
                      }}
                      role="listitem"
                      aria-current={isActive ? 'page' : undefined}
                      className={`text-sm font-medium transition-all duration-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded px-2 py-1 ${
                        isActive
                          ? 'text-foreground cursor-default'
                          : 'text-foreground/60 hover:text-foreground underline-animate'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-foreground transition-all" aria-hidden="true" />
                      )}
                    </a>
                  );
                })}
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                className="md:hidden p-2 rounded text-foreground hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
              role="menu"
            >
              <div className="flex flex-col py-4">
                {navigationItems.map((item) => {
                  const sectionId = item.href.substring(1);
                  const isActive = activeSection === sectionId;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(sectionId);
                      }}
                      role="menuitem"
                      aria-current={isActive ? 'page' : undefined}
                      className={`px-6 py-3 text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded ${
                        isActive
                          ? 'text-foreground bg-foreground/5'
                          : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
