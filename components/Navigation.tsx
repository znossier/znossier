'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { navigationItems } from '@/lib/mock-data';
import { smoothScrollTo, smoothScrollToTop } from '@/lib/utils';
import { EASE_PRECISION, MOTION } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const FAVICON_SRC = '/favicon-B.png';

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    y: -24,
    clipPath: 'inset(0 0 100% 0)',
  },
  open: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
  },
};

const mobileMenuTransition = {
  duration: MOTION.duration.menu,
  ease: EASE_PRECISION,
};

const mobileMenuReducedVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

function NavLinkItem({
  item,
  isActive,
  onClick,
}: {
  item: (typeof navigationItems)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <a
      href={item.href}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'nav-desktop-link relative inline-flex h-6 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        isActive && 'nav-link-active'
      )}
    >
      <span className="nav-desktop-link-label">{item.label}</span>
    </a>
  );
}

export function Navigation() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);

      if (window.scrollY < 120) {
        setActiveSection('');
        return;
      }

      const footer = document.getElementById('footer');
      const scrollPosition = window.scrollY + window.innerHeight * 0.45;

      // Footer is not a nav destination — clear selection so About doesn't stay highlighted
      if (footer && scrollPosition >= footer.offsetTop) {
        setActiveSection('');
        return;
      }

      const sections = navigationItems.map((item) => item.href.substring(1));

      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = document.getElementById(sections[i]);
        if (!section) continue;

        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const getFocusableElements = () => {
      const panel = menuPanelRef.current;
      if (!panel) return [];
      return Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    };

    const focusFirstElement = () => {
      const [first] = getFocusableElements();
      first?.focus();
    };

    const focusFrame = requestAnimationFrame(focusFirstElement);

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current?.contains(event.target as Node)) return;
      setMobileMenuOpen(false);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
    document.body.classList.add('mobile-menu-open');

    const toggleButton = menuToggleRef.current;

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
      document.body.classList.remove('mobile-menu-open');
      toggleButton?.focus();
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId);
    setMobileMenuOpen(false);
  };

  const navShellClass = cn(
    'editorial-nav-shell',
    !scrolled && !mobileMenuOpen && 'editorial-nav-shell--clear-until-scroll'
  );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-foreground focus:px-4 focus:py-2 focus:text-background focus:outline-none"
      >
        Skip to main content
      </a>

      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.button
            type="button"
            key="mobile-menu-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.duration.overlay }}
            className="fixed inset-0 z-40 bg-background/60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          'nav-chrome-blur-veil',
          !scrolled && !mobileMenuOpen && 'nav-chrome-blur-veil--clear'
        )}
        aria-hidden
      />

      <nav ref={navRef} aria-label="Main navigation" className="fixed inset-x-0 top-0 z-50">
        <div className={navShellClass}>
          <div className="site-shell">
            <div className="nav-bar-row">
              <a
                href="#home"
                onClick={(event) => {
                  event.preventDefault();
                  smoothScrollToTop();
                }}
                className="nav-file-link inline-flex min-h-12 items-center gap-[var(--grid-unit)] transition-opacity duration-200 hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label="Zeina Nossier — go to home"
              >
                <Image
                  src={FAVICON_SRC}
                  alt=""
                  width={64}
                  height={64}
                  className="h-12 w-12 shrink-0"
                  aria-hidden="true"
                  priority
                />
                <span className="nav-file-name hidden sm:inline">Zeina Nossier</span>
              </a>

              <div className="nav-bar-links">
                {navigationItems.map((item) => {
                  const sectionId = item.href.substring(1);
                  const isActive = activeSection === sectionId;

                  return (
                    <NavLinkItem
                      key={item.href}
                      item={item}
                      isActive={isActive}
                      onClick={() => handleNavClick(sectionId)}
                    />
                  );
                })}
              </div>

              <div className="lg:hidden">
                <button
                  ref={menuToggleRef}
                  type="button"
                  className="flat-control flat-control-icon inline-flex h-12 w-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label="Toggle navigation menu"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {mobileMenuOpen ? (
                      <motion.svg
                        key="close"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        initial={{ opacity: 0, rotate: -16, scale: 0.92 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 16, scale: 0.92 }}
                        transition={{ duration: MOTION.duration.hover, ease: 'easeOut' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                      </motion.svg>
                    ) : (
                      <motion.svg
                        key="menu"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        initial={{ opacity: 0, rotate: 16, scale: 0.92 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -16, scale: 0.92 }}
                        transition={{ duration: MOTION.duration.hover, ease: 'easeOut' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                ref={menuPanelRef}
                initial="closed"
                animate="open"
                exit="closed"
                variants={reducedMotion ? mobileMenuReducedVariants : mobileMenuVariants}
                transition={
                  reducedMotion ? { duration: 0 } : mobileMenuTransition
                }
                className="mobile-menu-panel origin-top transform-gpu will-change-[clip-path,transform,opacity] max-h-[calc(100svh-var(--chrome-top))] overflow-y-auto lg:hidden"
              >
                <nav
                  aria-label="Mobile navigation"
                  className="site-shell py-[var(--grid-unit)] pb-[calc(var(--grid-unit)+env(safe-area-inset-bottom,0px))]"
                >
                  <div className="border-b border-border/70 pb-[var(--grid-unit)]">
                    <span className="type-label text-muted">Menu</span>
                  </div>
                  <div className="mt-[var(--grid-unit)] flex flex-col gap-[var(--grid-unit)]">
                    {navigationItems.map((item) => {
                      const sectionId = item.href.substring(1);
                      const isActive = activeSection === sectionId;

                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={(event) => {
                            event.preventDefault();
                            handleNavClick(sectionId);
                          }}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'footer-link flex min-h-12 w-full items-center justify-between px-[var(--grid-unit)] py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                            isActive && 'nav-link-active'
                          )}
                        >
                          <span>{item.label}</span>
                          <span aria-hidden>→</span>
                        </a>
                      );
                    })}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}
