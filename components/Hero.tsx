'use client';

import { Button } from '@/components/Button';
import { useHasMounted } from '@/hooks/useHasMounted';
import { SocialLinks } from '@/components/SocialLinks';
import { getHeroPortraitObjectPosition } from '@/lib/hero-portrait';
import type { AboutContent, ContactContent } from '@/lib/site-content';
import { smoothScrollTo } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Hero({
  about,
  contact,
}: {
  about: AboutContent;
  contact: ContactContent;
}) {
  const { resolvedTheme } = useTheme();
  const mounted = useHasMounted();
  const isDark = mounted ? resolvedTheme === 'dark' : true;
  const [viewportWidth, setViewportWidth] = useState(1280);
  const portraitObjectPosition = getHeroPortraitObjectPosition(viewportWidth);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);

    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);

    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  return (
    <section
      id="home"
      className="relative inset-x-0 top-0 z-[5] flex min-h-[100svh] items-center overflow-hidden pb-24 pt-[calc(var(--chrome-top)+1.25rem)] sm:pt-[calc(var(--chrome-top)+1.75rem)] md:pb-16 lg:fixed lg:min-h-screen lg:pb-10 lg:pt-24 xl:pb-16"
    >
      <div className="absolute inset-0 -z-10">
        {about.image ? (
          <div className="hero-blueprint-shell absolute inset-0 overflow-hidden" aria-hidden>
            <Image
              src={about.image}
              alt=""
              fill
              priority
              className="hero-blueprint-image object-cover"
              style={{ objectPosition: portraitObjectPosition }}
              sizes="100vw"
            />
            <div className="hero-blueprint-vignette absolute inset-0" />
          </div>
        ) : (
          <div className="h-full w-full bg-accent/20" aria-hidden />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(90deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 34%, rgba(5,5,5,0.34) 58%, rgba(5,5,5,0.08) 78%, rgba(5,5,5,0) 100%)'
              : 'linear-gradient(90deg, rgba(241,243,246,0.72) 0%, rgba(241,243,246,0.52) 28%, rgba(241,243,246,0.22) 52%, rgba(241,243,246,0.05) 76%, rgba(241,243,246,0) 100%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[30vh]"
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(0deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.1) 52%, rgba(0,0,0,0) 100%)'
              : 'linear-gradient(0deg, rgba(231,234,238,0.72) 0%, rgba(238,241,245,0.18) 44%, rgba(241,243,246,0) 100%)',
          }}
          aria-hidden
        />
        {about.image ? (
          <>
            <div className="hero-blueprint-grid absolute inset-0" aria-hidden />
            <div className="hero-blueprint-frame absolute" aria-hidden />
            <div className="hero-blueprint-mark hero-blueprint-mark-z absolute" aria-hidden>Z</div>
            <div className="hero-blueprint-mark hero-blueprint-mark-n absolute" aria-hidden>N</div>
          </>
        ) : null}
      </div>

      <div className="site-shell relative z-10 site-grid min-h-[calc(100svh-var(--chrome-top)-7rem)] w-full items-end pb-2 sm:items-center lg:min-h-[calc(100vh-8rem)] lg:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="[grid-column:1/span_5] max-w-[22rem] pb-3 sm:max-w-[22rem] sm:[grid-column:1/span_4] md:[grid-column:1/span_4] lg:[grid-column:1/span_7] lg:pb-0"
        >
          <h1 className="sr-only">
            {about.name} — {about.title}
          </h1>

          <div className="space-y-4 sm:space-y-5">
            <h2 className={`max-w-[8ch] text-[clamp(2.65rem,14vw,4.15rem)] font-bold uppercase leading-[0.9] tracking-[-0.055em] sm:text-[clamp(3rem,9vw,4.15rem)] lg:text-[clamp(2.3rem,5.8vw,4.15rem)] ${isDark ? 'text-white' : 'text-foreground'}`}>
              {about.name}
            </h2>

            <p className={`editorial-kicker ${isDark ? 'text-white/76' : 'text-foreground/66'}`}>
              {about.title}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 sm:flex-nowrap sm:gap-4">
              <Button
                onClick={() => smoothScrollTo('works', 96)}
                className={`min-h-10 px-4 py-2 text-[0.68rem] tracking-[0.18em] ${
                  isDark
                    ? 'border-white/30 text-white hover:border-link/65 hover:bg-link/14 hover:text-link focus-visible:ring-offset-transparent'
                    : 'border-link bg-link text-white hover:border-link hover:bg-link/88 hover:text-white'
                }`}
                aria-label="Scroll to works section"
              >
                View Work
              </Button>
              <SocialLinks socialLinks={contact.socialLinks} inverted={isDark} className="origin-left shrink-0 scale-[0.84] sm:scale-90" />
            </div>
          </div>
        </motion.div>

        <a
          href="#works"
          onClick={(event) => {
            event.preventDefault();
            smoothScrollTo('works', 96);
          }}
          className={`editorial-kicker absolute bottom-0 right-0 hidden items-center gap-2 text-right transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 lg:inline-flex ${
            isDark
              ? 'text-white/62 hover:text-white focus-visible:ring-offset-transparent'
              : 'text-foreground/58 hover:text-foreground focus-visible:ring-offset-background'
          }`}
          aria-label="Scroll to works section"
        >
          Scroll to see more
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 5v13m0 0l-5-5m5 5l5-5" />
          </svg>
        </a>
      </div>
    </section>
  );
}
