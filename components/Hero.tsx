'use client';

import { mockAbout, mockContact } from '@/lib/mock-data';
import { smoothScrollTo } from '@/lib/utils';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

const TILT_MAX = 12;
const springConfig = { damping: 30, stiffness: 400 };

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isTouch, setIsTouch] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Image scales up as you scroll down
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  // Add margin bottom to prevent getting too close to title
  const imageMarginBottom = useTransform(scrollYProgress, [0, 1], ['1rem', '2rem']);

  useEffect(() => {
    const mm = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mm.matches);
    const fn = () => setReduceMotion(mm.matches);
    mm.addEventListener('change', fn);
    return () => mm.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    const check = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(check);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion || isTouch) return;
      setIsHovered(true);
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const x = (e.clientX - rect.left - w / 2) / (w / 2);
      const y = (e.clientY - rect.top - h / 2) / (h / 2);
      const tx = Math.max(-1, Math.min(1, x));
      const ty = Math.max(-1, Math.min(1, y));
      rotateX.set(ty * TILT_MAX);
      rotateY.set(tx * TILT_MAX);
    },
    [reduceMotion, isTouch, rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  const handleMouseEnter = useCallback(() => {
    if (!reduceMotion && !isTouch) setIsHovered(true);
  }, [reduceMotion, isTouch]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="min-h-screen flex items-center pt-20 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-[5]"
    >
      <div className="mx-auto max-w-7xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.div
              ref={imageRef}
              style={{
                scale: imageScale,
                opacity: imageOpacity,
                marginBottom: imageMarginBottom,
                perspective: '1000px',
              }}
              className="relative aspect-[4/3] w-full max-w-md mx-auto lg:mx-0"
            >
              <motion.div
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{
                  scale: reduceMotion ? 1 : isHovered ? 1.02 : 1,
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                style={{
                  rotateX: rotateXSpring,
                  rotateY: rotateYSpring,
                  transformStyle: 'preserve-3d',
                }}
                className={`absolute inset-0 w-full h-full rounded-lg overflow-hidden transition-shadow duration-300 ${
                  isHovered && !reduceMotion && !isTouch
                    ? 'shadow-[0_28px_56px_-12px_rgba(0,0,0,0.22)]'
                    : 'shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]'
                }`}
              >
                {mockAbout.image ? (
                  <Image
                    src={mockAbout.image}
                    alt={`${mockAbout.name}, ${mockAbout.title}`}
                    fill
                    priority
                    className="object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.image-fallback');
                      if (fallback) {
                        (fallback as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-accent/10 rounded-lg flex items-center justify-center text-5xl image-fallback" style={{ display: mockAbout.image ? 'none' : 'flex' }} aria-hidden="true">
                  👩🏻‍💻
                </div>
              </motion.div>
            </motion.div>
            {/* Switched: Name now where job title was */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mt-4">
              Hi, I&apos;m {mockAbout.name.split(' ')[0]}
              <span className="inline-block ml-2 emoji">👩🏻‍💻</span>
            </h1>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-6 text-center lg:text-left relative"
          >
            {/* Switched: Job title now at top */}
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {mockAbout.title}
            </h2>

            <p className="text-sm md:text-base text-foreground/70 max-w-xl leading-relaxed mx-auto lg:mx-0">
              {mockAbout.tagline}
            </p>

            <button
              onClick={() => smoothScrollTo('about', 100)}
              className="px-6 py-2.5 border border-foreground/20 rounded-full text-foreground hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-200 text-sm font-medium focus:outline-none"
              aria-label="Scroll to about section"
            >
              About me ↓
            </button>

            {/* Social Icons */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-6">
              {mockContact.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-link hover:text-link transition-all duration-200"
                  aria-label={social.platform}
                >
                  {social.platform === 'LinkedIn' && (
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )}
                  {social.platform === 'Behance' && (
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4.654 3c.461 0 .887.035 1.278.14.39.07.711.216.996.391s.497.426.641.747c.14.32.216.711.216 1.137 0 .496-.106.922-.356 1.242-.215.32-.566.606-.997.817.606.176 1.067.496 1.348.922s.461.957.461 1.563c0 .496-.105.922-.285 1.278a2.3 2.3 0 0 1-.782.887c-.32.215-.711.39-1.137.496a5.3 5.3 0 0 1-1.278.176L0 12.803V3zm-.285 3.978c.39 0 .71-.105.957-.285.246-.18.355-.497.355-.887 0-.216-.035-.426-.105-.567a1 1 0 0 0-.32-.355 1.8 1.8 0 0 0-.461-.176c-.176-.035-.356-.035-.567-.035H2.17v2.31c0-.005 2.2-.005 2.2-.005zm.105 4.193c.215 0 .426-.035.606-.07.176-.035.356-.106.496-.216s.25-.215.356-.39c.07-.176.14-.391.14-.641 0-.496-.14-.852-.426-1.102-.285-.215-.676-.32-1.137-.32H2.17v2.734h2.305zm6.858-.035q.428.427 1.278.426c.39 0 .746-.106 1.032-.286q.426-.32.53-.64h1.74c-.286.851-.712 1.457-1.278 1.848-.566.355-1.243.566-2.06.566a4.1 4.1 0 0 1-1.527-.285 2.8 2.8 0 0 1-1.137-.782 2.85 2.85 0 0 1-.712-1.172c-.175-.461-.25-.957-.25-1.528 0-.531.07-1.032.25-1.493.18-.46.426-.852.747-1.207.32-.32.711-.606 1.137-.782a4 4 0 0 1 1.493-.285c.606 0 1.137.105 1.598.355.46.25.817.532 1.102.958.285.39.496.851.641 1.348.07.496.105.996.07 1.563h-5.15c0 .58.21 1.11.496 1.396m2.24-3.732c-.25-.25-.642-.391-1.103-.391-.32 0-.566.07-.781.176s-.356.25-.496.39a.96.96 0 0 0-.25.497c-.036.175-.07.32-.07.46h3.196c-.07-.526-.25-.882-.497-1.132zm-3.127-3.728h3.978v.957h-3.978z"/>
                    </svg>
                  )}
                  {social.platform === 'GitHub' && (
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll to see more - fixed at absolute bottom right corner of viewport */}
      <a
        href="#works"
        onClick={(e) => {
          e.preventDefault();
          smoothScrollTo('works', 100);
        }}
        style={{ position: 'fixed' }}
        className="bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8 text-xs text-foreground/50 hover:text-foreground/70 transition-all duration-200 hidden lg:block focus:outline-none underline-animate z-30"
        aria-label="Scroll to works section"
      >
        Scroll to see more ↓
      </a>
    </section>
  );
}
