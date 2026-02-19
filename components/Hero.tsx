'use client';

import { mockAbout } from '@/lib/mock-data';
import { SocialLinks } from '@/components/SocialLinks';
import { smoothScrollTo } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button';

const SCROLL_THRESHOLD_PX = 50; // Same as nav bar – name disappears here when nav name appears

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [nameVisible, setNameVisible] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const handleScroll = () => {
      setNameVisible(window.scrollY <= SCROLL_THRESHOLD_PX);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Zoom/parallax: background scales up as you scroll
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const nameLine = 'Zeina Nossier';
  const titleLine = 'Product + UX Designer';

  return (
    <section
      ref={sectionRef}
      id="home"
      className="min-h-screen flex items-center pt-20 pb-10 sm:pb-14 md:pb-20 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-[5] overflow-hidden"
    >
      {/* Full-viewport dimmed photo background with zoom/parallax */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ scale: bgScale }}
      >
        {mockAbout.image ? (
          <Image
            src={mockAbout.image}
            alt=""
            fill
            priority
            className="object-cover object-[45%_50%] sm:object-[52%_50%] md:object-[58%_50%] lg:object-[65%_50%] xl:object-[72%_50%]"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-accent/20" aria-hidden />
        )}
        {/* Light mode needs stronger *left* contrast; keep dark mode as-is */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/35 dark:from-black/75 dark:via-black/55 dark:to-black/30"
          aria-hidden
        />
      </motion.div>

      {/* Content overlay - lead with what you do, keep name subtle */}
      <div className="mx-auto max-w-7xl w-full relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center">
        <div className="sm:col-span-5 md:col-span-5 lg:col-span-5 xl:col-span-4 flex flex-col gap-4 sm:gap-5 md:gap-6 text-left max-w-2xl">
          <h1 className="sr-only">{mockAbout.name} — {mockAbout.title}</h1>

          {/* Name headline – hidden as soon as user scrolls and name appears in nav */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: nameVisible ? 1 : 0,
              y: nameVisible ? 0 : 12,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase pointer-events-none"
          >
            {nameLine}
          </motion.h2>

          {/* Job title under name */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-mono text-sm sm:text-base uppercase tracking-widest text-white/80"
          >
            {titleLine}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1"
          >
            <Button
              onClick={() => smoothScrollTo('works', 100)}
              className="text-sm px-6 py-2.5 font-mono uppercase tracking-wider text-white border-white/30 hover:border-white/60 hover:bg-white/10 focus-visible:ring-offset-transparent"
              aria-label="Scroll to works section"
            >
              View work ↓
            </Button>
            <SocialLinks inverted />
          </motion.div>
        </div>
      </div>

      {/* Scroll to see more */}
      <a
        href="#works"
        onClick={(e) => {
          e.preventDefault();
          smoothScrollTo('works', 100);
        }}
        style={{ position: 'fixed' }}
        className="bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white/80 transition-all duration-200 hidden lg:block focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded underline-animate z-30"
        aria-label="Scroll to works section"
      >
        Scroll to see more ↓
      </a>
    </section>
  );
}
