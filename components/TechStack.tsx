'use client';

import { SectionHeading } from '@/components/SectionHeading';
import { mockTechStack } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/** Single scale for every logo so they all render the same size */
const LOGO_BOX_SCALE = 0.82;

interface LogoCardProps {
  item: (typeof mockTechStack)[0];
  reduceMotion: boolean;
}

function LogoCard({ item, reduceMotion }: LogoCardProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardHover = () => {
    requestAnimationFrame(() => {
      const label = labelRef.current;
      const card = cardRef.current;
      if (!label || !card) return;
      const cardRect = card.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const labelParent = label.parentElement;
      const parentRect = labelParent?.getBoundingClientRect();
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TechStack.tsx:handleCardHover',message:'hover dimensions',data:{name:item.name,labelWidth:labelRect.width,cardWidth:cardRect.width,parentWidth:parentRect?.width,labelScrollWidth:label.scrollWidth,labelClientWidth:label.clientWidth},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
    });
  };

  return (
    <div
      className="group flex flex-shrink-0 px-2"
      title={item.name}
      onMouseEnter={handleCardHover}
    >
      <motion.div
        ref={cardRef}
        className="relative flex h-24 w-24 flex-col rounded-lg border border-border/60 bg-background transition-[box-shadow,border-color] duration-300 ease-out hover:border-border md:h-28 md:w-28 md:rounded-xl lg:h-32 lg:w-32"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        whileHover={
          reduceMotion
            ? undefined
            : { scale: 1.05, boxShadow: '0 8px 20px -4px rgba(0,0,0,0.25), 0 4px 8px -2px rgba(0,0,0,0.15)' }
        }
      >
        {/* Desktop: logo centered; hover = smooth push-up + label fade-in. Mobile: logo + label block centered. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="flex w-full flex-col items-center transition-transform duration-200 ease-out md:group-hover:-translate-y-1.5"
          >
            {item.logo ? (
              <div
                className="relative flex aspect-square h-9 w-9 shrink-0 items-center justify-center md:h-11 md:w-11 lg:h-12 lg:w-12 max-h-full max-w-full"
              >
                <div
                  className="relative aspect-square shrink-0"
                  style={{
                    width: `${((item.logoScale ?? 1) * LOGO_BOX_SCALE * 100).toFixed(0)}%`,
                    height: `${((item.logoScale ?? 1) * LOGO_BOX_SCALE * 100).toFixed(0)}%`,
                  }}
                >
                  <div
                    className={`relative h-full w-full ${item.monochrome ? 'dark:invert' : ''} ${item.logoClassName ?? ''}`}
                  >
                    <Image
                      src={item.logo}
                      alt={item.name}
                      fill
                      className="object-contain aspect-square"
                      sizes="(max-width: 768px) 48px, (max-width: 1024px) 56px, 64px"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-sm font-medium text-foreground/60">
                {item.name.charAt(0)}
              </span>
            )}
            {/* Up to 2 lines everywhere so names like Figma / TypeScript show in full; ellipsis only if longer */}
            <span
              ref={labelRef}
              className="mt-1 w-full min-w-0 px-1 text-center text-[10px] font-medium text-foreground/70 line-clamp-2 md:absolute md:left-0 md:right-0 md:top-full md:mt-1.5 md:px-2 md:text-xs md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100"
              aria-hidden
            >
              {item.name}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface MarqueeRowProps {
  items: typeof mockTechStack;
  direction: 'left' | 'right';
  reduceMotion: boolean;
}

function MarqueeRow({ items, direction, reduceMotion }: MarqueeRowProps) {
  const duplicated = [...items, ...items];
  const animationClass =
    direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="tech-stack-marquee-row relative overflow-hidden py-3 md:py-6">
      <div className={`flex w-max flex-nowrap ${animationClass}`}>
        {duplicated.map((item, index) => (
          <LogoCard
            key={`${item.id}-${index}`}
            item={item}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const mid = Math.ceil(mockTechStack.length / 2);
  const row1 = mockTechStack.slice(0, mid);
  const row2 = mockTechStack.slice(mid);

  return (
    <section
      id="tech-stack"
      className="relative z-20 bg-background px-4 py-16 sm:px-6 lg:px-8 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-12"
        >
          <SectionHeading>Tech Stack</SectionHeading>
        </motion.div>

        <div className="space-y-0 md:space-y-1">
          <MarqueeRow items={row1} direction="left" reduceMotion={reduceMotion} />
          <MarqueeRow items={row2} direction="right" reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  );
}
