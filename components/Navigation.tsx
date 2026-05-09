'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { navigationItems } from '@/lib/mock-data';
import { useHasMounted } from '@/hooks/useHasMounted';
import { ThemeToggle } from './ThemeToggle';
import { smoothScrollTo, smoothScrollToTop } from '@/lib/utils';
import { cn } from '@/lib/utils';

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
  ease: [0.32, 0.72, 0, 1] as const,
};

export function Navigation() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const mounted = useHasMounted();
  const navRef = useRef<HTMLElement>(null);
  const isDarkTheme = mounted ? resolvedTheme === 'dark' : true;

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
    smoothScrollTo(sectionId, 112);
    setMobileMenuOpen(false);
  };

  const iconSrc = isDarkTheme ? '/favicon-dark.svg' : '/favicon-light.svg';

  const desktopLinkClass = (isActive: boolean) =>
    cn(
      'editorial-kicker inline-flex items-center gap-1 px-2 py-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2',
      scrolled
        ? 'text-foreground/72 hover:text-link focus-visible:ring-offset-background'
        : isDarkTheme
          ? 'text-white/72 hover:text-link focus-visible:ring-offset-transparent'
          : 'text-foreground/78 hover:text-link focus-visible:ring-offset-background',
      isActive && 'text-link'
    );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-foreground focus:px-4 focus:py-2 focus:text-background focus:outline-none"
      >
        Skip to main content
      </a>

      <nav ref={navRef} aria-label="Main navigation" className="fixed inset-x-0 top-[var(--ribbon-height)] z-50">
        <div
          className={cn(
            'transition-[background-color,border-color,box-shadow] duration-300',
            scrolled || mobileMenuOpen ? 'editorial-nav-shell' : 'bg-transparent'
          )}
        >
          <div className="mx-auto w-full max-w-[var(--site-max-width)] px-[var(--site-padding-inline)] lg:px-0">
            <div className="site-grid h-[var(--nav-shell-height)] items-center gap-y-0">
              <a
                href="#home"
                onClick={(event) => {
                  event.preventDefault();
                  smoothScrollToTop();
                }}
                className="col-span-1 inline-flex h-9 w-9 items-center justify-center transition-opacity duration-200 hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 md:[grid-column:1/span_1] lg:[grid-column:1/span_2]"
                aria-label="Zeina Nossier - Go to home"
              >
                <Image
                  src={iconSrc}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </a>

              <div className="hidden items-center justify-center gap-6 md:flex md:[grid-column:3/span_4] md:gap-6 lg:[grid-column:9/span_8] lg:gap-8 xl:gap-10">
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
                      className={desktopLinkClass(isActive)}
                    >
                      <span
                        className={cn(
                          'inline-block w-2 text-center transition-opacity duration-200',
                          isActive ? 'opacity-100' : 'opacity-0'
                        )}
                        aria-hidden
                      >
                        /
                      </span>
                      <span>{item.label}</span>
                      <span
                        className={cn(
                          'inline-block w-2 text-center transition-opacity duration-200',
                          isActive ? 'opacity-100' : 'opacity-0'
                        )}
                        aria-hidden
                      >
                        /
                      </span>
                    </a>
                  );
                })}
              </div>

              <div className="col-start-6 flex items-center justify-end gap-3 md:[grid-column:8/span_1] lg:[grid-column:21/span_4]">
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>

                <button
                  type="button"
                  className={cn(
                    'flex h-11 w-11 items-center justify-center border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 md:hidden',
                    scrolled
                      ? 'border-border bg-[var(--surface-elevated)] text-foreground hover:border-link/55 hover:bg-link/8 hover:text-link focus-visible:ring-offset-background'
                      : isDarkTheme
                        ? 'border-white/22 bg-black/18 text-white hover:border-link/55 hover:bg-link/12 hover:text-link focus-visible:ring-offset-transparent'
                        : 'border-foreground/16 bg-white/56 text-foreground backdrop-blur-md hover:border-foreground/38 hover:bg-white/72 hover:text-foreground focus-visible:ring-offset-background'
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

          <AnimatePresence initial={false}>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileMenuVariants}
                transition={mobileMenuTransition}
                className={cn(
                  'origin-top transform-gpu will-change-[clip-path,transform,opacity] max-h-[calc(100svh-var(--chrome-top))] overflow-y-auto border-t shadow-[0_20px_44px_rgba(0,0,0,0.16)] md:hidden',
                  scrolled || mobileMenuOpen
                    ? 'border-border bg-[color:color-mix(in_srgb,var(--surface-chrome)_94%,white_6%)]'
                    : isDarkTheme
                      ? 'border-white/14 bg-[#0b0b0b]/96'
                      : 'border-border bg-[color:color-mix(in_srgb,var(--background)_94%,white_6%)]'
                )}
                role="menu"
              >
                <div className="site-shell py-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <div className="border-b border-border/70 pb-3">
                    <span className="editorial-kicker text-foreground/52">Menu</span>
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
                            'editorial-kicker flex min-h-12 items-center justify-between border px-4 py-3 tracking-[0.18em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2',
                            scrolled
                              ? 'border-border text-foreground/78 hover:border-link/50 hover:bg-link/7 hover:text-link focus-visible:ring-offset-background'
                              : isDarkTheme
                                ? 'border-white/14 text-white/76 hover:border-link/55 hover:text-link focus-visible:ring-offset-transparent'
                                : 'border-border text-foreground/78 hover:border-foreground/38 hover:bg-foreground/4 hover:text-foreground focus-visible:ring-offset-background',
                            isActive && (scrolled ? 'border-link text-link' : 'border-link text-link')
                          )}
                        >
                          <span className="inline-flex items-center gap-2">
                            {isActive ? <span aria-hidden>/</span> : null}
                            <span>{item.label}</span>
                            {isActive ? <span aria-hidden>/</span> : null}
                          </span>
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
