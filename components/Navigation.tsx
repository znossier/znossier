'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { navigationItems } from '@/lib/mock-data';
import { gridSpans } from '@/lib/grid-spans';
import { smoothScrollTo, smoothScrollToTop } from '@/lib/utils';
import { EASE_PRECISION } from '@/lib/motion';
import { cn } from '@/lib/utils';
const FAVICON_SRC = '/favicon-B.png';

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    y: -8,
    clipPath: 'inset(0 0 100% 0)',
  },
  open: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
  },
};

const mobileMenuTransition = {
  duration: 0.28,
  ease: EASE_PRECISION,
};

function NavLinkItem({
  item,
  isActive,
  onHeroMedia,
  onClick,
}: {
  item: (typeof navigationItems)[0];
  isActive: boolean;
  onHeroMedia: boolean;
  onClick: () => void;
}) {
  const desktopLinkClass = cn(
    'nav-desktop-link type-label relative inline-flex items-center gap-1 px-2 py-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2',
    onHeroMedia ? 'focus-visible:ring-offset-transparent' : 'focus-visible:ring-offset-background',
    isActive
      ? 'nav-link-active text-link hover:text-primary'
      : onHeroMedia
        ? 'text-on-media-subtle hover:text-primary'
        : 'text-secondary hover:text-primary'
  );

  return (
    <a
      href={item.href}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      aria-current={isActive ? 'page' : undefined}
      className={desktopLinkClass}
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
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);

      if (window.scrollY < 120) {
        setActiveSection('');
        return;
      }

      const sections = navigationItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + window.innerHeight * 0.45;

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

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current?.contains(event.target as Node)) return;
      setMobileMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.body.classList.add('mobile-menu-open');

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId);
    setMobileMenuOpen(false);
  };

  const onHero = !scrolled && !mobileMenuOpen;
  const onHeroMedia = onHero;

  const navShellClass = cn(
    'transition-[background-color,border-color,box-shadow] duration-300',
    scrolled || mobileMenuOpen ? 'editorial-nav-shell' : 'bg-transparent'
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
        )}
      </AnimatePresence>

      <nav ref={navRef} aria-label="Main navigation" className="fixed inset-x-0 top-[var(--ribbon-height)] z-50">
        <div className={navShellClass}>
          <div className="site-shell">
            <div className="site-grid h-[var(--nav-shell-height)] items-center gap-y-0">
              <a
                href="#home"
                onClick={(event) => {
                  event.preventDefault();
                  smoothScrollToTop();
                }}
                className={cn(
                  'inline-flex min-h-11 min-w-11 items-center justify-center transition-opacity duration-200 hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2',
                  gridSpans.nav.logo
                )}
                aria-label="Zeina Nossier - Go to home"
              >
                <Image
                  src={FAVICON_SRC}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </a>

              <div className={cn('items-center justify-center gap-6 lg:gap-8 xl:gap-10', gridSpans.nav.links)}>
                {navigationItems.map((item) => {
                  const sectionId = item.href.substring(1);
                  const isActive = activeSection === sectionId;

                  return (
                    <NavLinkItem
                      key={item.href}
                      item={item}
                      isActive={isActive}
                      onHeroMedia={onHeroMedia}
                      onClick={() => handleNavClick(sectionId)}
                    />
                  );
                })}
              </div>

              <div className={cn('flex items-center justify-end gap-3', gridSpans.nav.controls)}>
                <div className="lg:hidden">
                  <button
                    type="button"
                    className={cn(
                      'flat-control inline-flex h-11 w-11',
                      onHeroMedia
                        ? 'flat-control-inverted focus-visible:ring-offset-transparent'
                        : 'focus-visible:ring-offset-background'
                    )}
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
                          transition={{ duration: 0.16, ease: 'easeOut' }}
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
                          transition={{ duration: 0.16, ease: 'easeOut' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileMenuVariants}
                transition={mobileMenuTransition}
                className="mobile-menu-panel origin-top transform-gpu will-change-[clip-path,transform,opacity] max-h-[calc(100svh-var(--chrome-top))] overflow-y-auto lg:hidden"
                role="menu"
              >
                <div className="site-shell py-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <div className="border-b border-border/70 pb-3">
                    <span className="type-label text-faint">Menu</span>
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
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
                          role="menuitem"
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'type-label flat-control flex min-h-12 items-center justify-between px-4 py-3 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2',
                            onHeroMedia
                              ? 'flat-control-inverted text-on-media-muted hover:text-primary focus-visible:ring-offset-transparent'
                              : 'text-secondary hover:text-primary focus-visible:ring-offset-background',
                            isActive && 'text-link hover:text-primary'
                          )}
                        >
                          <span>{item.label}</span>
                          <span aria-hidden>→</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}
