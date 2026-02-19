'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationItems } from '@/lib/mock-data';
import { ThemeToggle } from './ThemeToggle';
import { LinkSwap } from './LinkSwap';
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

  /** Navbar background matches the section we're in so the page looks continuous */
  const navBackgroundClass =
    !scrolled
      ? 'bg-transparent'
      : activeSection === 'works' || activeSection === 'process'
        ? 'bg-section-accent dark:bg-background'
        : activeSection === 'expertise' || activeSection === 'about'
          ? 'bg-background dark:bg-section-accent'
          : 'bg-background dark:bg-background';

  /** When mobile menu is open, overlay from top-0 so ribbon + hero don't show through; on hero use solid dark */
  const mobileMenuOverlayClass =
    !scrolled
      ? 'bg-[#0D0D0D]'
      : activeSection === 'works' || activeSection === 'process'
        ? 'bg-section-accent dark:bg-background'
        : activeSection === 'expertise' || activeSection === 'about'
          ? 'bg-background dark:bg-section-accent'
          : 'bg-background dark:bg-background';

  const desktopNav = (
    <motion.div
      key="desktop-nav"
      layout
      initial={false}
      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
      className="hidden md:flex items-center gap-8 h-7"
      role="list"
    >
      {navigationItems.map((item) => {
        const sectionId = item.href.substring(1);
        const isActive = activeSection === sectionId;
        return (
          <LinkSwap
            key={item.href}
            as="a"
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(sectionId);
            }}
            role="listitem"
            aria-current={isActive ? 'page' : undefined}
            className={`nav-desktop-link h-7 flex items-center text-sm font-mono font-medium uppercase tracking-wider transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 w-fit px-3 ${isActive ? 'nav-link-active' : ''} ${
              scrolled
                ? `focus-visible:ring-offset-background ${
                    isActive
                      ? 'text-foreground cursor-default'
                      : 'text-foreground/60 hover:text-foreground'
                  }`
                : `focus-visible:ring-offset-transparent ${
                    isActive
                      ? 'text-white cursor-default'
                      : 'text-white/70 hover:text-white'
                  }`
            }`}
          >
            {item.label}
          </LinkSwap>
        );
      })}
    </motion.div>
  );

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
        className="fixed top-8 left-0 right-0 z-50"
      >
        {/** When mobile menu open: full-viewport overlay from top-0 so ribbon doesn't show through */}
        {mobileMenuOpen && (
          <div
            className={`fixed top-0 left-0 right-0 bottom-0 z-40 md:hidden transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${mobileMenuOverlayClass}`}
            aria-hidden
          />
        )}
        {/** In hero state (not scrolled), we render nav content in an inverted style for readability over the hero image in both themes. */}
        {/* Background: transparent on hero; once scrolled, match current section */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${navBackgroundClass}`}
        />
        
        {/* Same structure as site sections: outer padding, inner max-w-7xl centered */}
        <div ref={navContainerRef} className="relative z-50 w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl w-full flex items-center justify-between h-20">
            {/* Left group: logo always, desktop nav only when at top/hero */}
            <div className="flex items-center gap-6">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('home', 100);
                }}
                className={`flex items-center gap-3 text-lg md:text-xl font-bold transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 rounded no-underline ${
                  scrolled
                    ? 'text-foreground hover:text-foreground focus-visible:ring-offset-background'
                    : 'text-white/90 hover:text-white focus-visible:ring-offset-transparent'
                }`}
                aria-label="Zeina Nossier - Go to home"
                style={{ textDecoration: 'none' }}
              >
                {mounted && (
                  <Image
                    src={
                      scrolled
                        ? theme === 'dark'
                          ? '/favicon-dark.svg'
                          : '/favicon-light.svg'
                        : '/favicon-dark.svg'
                    }
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
                {scrolled && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="whitespace-nowrap uppercase"
                  >
                    Zeina Nossier
                  </motion.span>
                )}
              </a>
              {/* When on hero (not scrolled), keep nav items on the left next to the logo */}
              <AnimatePresence initial={false}>
                {!scrolled && (
                  <motion.div
                    key="nav-left"
                    initial={{ opacity: 0, x: -2 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -1 }}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  >
                    {desktopNav}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right group: when scrolled, nav items move here next to the toggle */}
            <div className="flex items-center gap-6">
              <AnimatePresence initial={false}>
                {scrolled && (
                  <motion.div
                    key="nav-right"
                    initial={{ opacity: 0, x: 2 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 1 }}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  >
                    {desktopNav}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Menu Button */}
              <button
                type="button"
                className={`md:hidden p-2 rounded transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 ${
                  scrolled
                    ? 'text-foreground hover:opacity-70 focus-visible:ring-offset-background'
                    : 'text-white/90 hover:opacity-80 focus-visible:ring-offset-transparent'
                }`}
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

              <div className="hidden md:flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - full width from below nav bar; bg transparent so overlay shows through */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="absolute left-0 right-0 top-20 w-full md:hidden border-t border-white/10 z-50"
            role="menu"
          >
            <div className="flex flex-col py-4">
              {navigationItems.map((item) => {
                const sectionId = item.href.substring(1);
                const isActive = activeSection === sectionId;
                const isHero = !scrolled;
                return (
                  <LinkSwap
                    key={item.href}
                    as="a"
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(sectionId);
                    }}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                    className={`nav-mobile-item mx-4 px-6 py-3 text-base font-mono font-medium uppercase tracking-wider transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full ${
                      isHero
                        ? isActive
                          ? 'text-white bg-white/10'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        : isActive
                          ? 'text-foreground bg-foreground/10'
                          : 'text-foreground/60 hover:text-foreground hover:bg-foreground/10'
                    }`}
                  >
                    {item.label}
                  </LinkSwap>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
