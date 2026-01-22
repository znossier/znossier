'use client';

import { mockAbout } from '@/lib/mock-data';
import { smoothScrollTo } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

function ExperienceItem({ 
  item, 
  index, 
  isExpanded, 
  onToggle 
}: { 
  item: typeof mockAbout.experience[0] & { description?: string }; 
  index: number; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative pb-4 mb-4 last:mb-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Separator line with hover animation */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border overflow-hidden">
        <motion.div
          className="h-full bg-foreground/40"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? '100%' : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      <button
        onClick={onToggle}
        className="w-full text-left group focus:outline-none p-2 -m-2"
        aria-expanded={isExpanded}
        aria-controls={`experience-details-${index}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-base md:text-lg font-semibold text-foreground group-hover:text-link transition-colors mb-1">
              {item.role}
            </h4>
            <p className="text-sm text-foreground/70 mb-1">{item.company}</p>
            <p className="text-xs text-foreground/60">{item.period}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-foreground/40 group-hover:text-foreground transition-colors flex-shrink-0 mt-1"
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {isExpanded && item.description && (
            <motion.div
              id={`experience-details-${index}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
              role="region"
              aria-live="polite"
            >
              <p className="text-sm text-foreground/70 leading-relaxed pt-3">
                {item.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section ref={sectionRef} id="about" className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative bg-background z-20">
      <div className="mx-auto max-w-7xl w-full">
        {/* Header - Sticky with left column */}
        <div className="lg:sticky lg:top-20 lg:z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-10 lg:bg-background lg:pb-4"
          >
            <div className="flex items-center gap-4 md:gap-6">
              {/* Horizontal line on left */}
              <div className="w-12 md:w-16 border-t border-border"></div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                About Me
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left Column - Sticky with header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                {mockAbout.name}
              </h3>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                {mockAbout.bio}
              </p>
              <a
                href="#footer"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('footer', 100);
                }}
                className="inline-block text-sm font-medium text-foreground/70 hover:text-foreground hover-underline transition-all duration-200 focus:outline-none px-2 py-1"
                aria-label="Scroll to contact section"
              >
                Contact me →
              </a>
            </motion.div>

            {/* Right Column - Scrolls independently */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="space-y-1"
            >
              {/* Removed "Experience" subtitle */}
              {mockAbout.experience.map((item, index) => (
                <ExperienceItem
                  key={index}
                  item={item}
                  index={index}
                  isExpanded={expandedItems.has(index)}
                  onToggle={() => toggleItem(index)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
