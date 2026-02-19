'use client';

import { SectionHeading } from '@/components/SectionHeading';
import { mockServices } from '@/lib/mock-data';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/** Ribbon (top-8) + nav bar height so section title sticks below navbar */
const NAV_OFFSET_PX = 112;
/** Space reserved for the sticky section title so it stays visible below the nav */
const TITLE_BLOCK_HEIGHT_PX = 56;
const CARD_STACK_OFFSET_PX = 14;

function ServiceCard({
  service,
  index,
  total,
}: {
  service: (typeof mockServices)[0];
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px', amount: 0.2 });

  const zIndex = index + 1;
  const stickyTop = NAV_OFFSET_PX + TITLE_BLOCK_HEIGHT_PX + index * CARD_STACK_OFFSET_PX;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={{
        zIndex,
        position: 'sticky',
        top: `${stickyTop}px`,
      }}
      className="mb-4"
    >
      <div className="border-t border-border pt-4 pb-4 hover:border-foreground/40 transition-all duration-200 bg-background dark:bg-section-accent md:h-[320px]">
        <div className="flex flex-col justify-center space-y-3 md:space-y-4 py-2 text-left md:h-full">
          <div className="text-xs md:text-sm font-mono font-medium text-foreground/60">
            {service.number}
          </div>
          <h4 className="text-xl md:text-2xl font-bold text-foreground">
            {service.title}
          </h4>
          <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-8 relative bg-background dark:bg-section-accent z-20"
    >
      <div className="mx-auto max-w-7xl w-full">
        {/* Sticky title: stops below navbar, then cards stack underneath */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="sticky z-10 mb-10 md:mb-12 pt-2 pb-2 bg-background dark:bg-section-accent"
          style={{ top: NAV_OFFSET_PX, minHeight: TITLE_BLOCK_HEIGHT_PX }}
        >
          <SectionHeading>Expertise</SectionHeading>
        </motion.div>

        <div className="relative" style={{ minHeight: `${mockServices.length * 340}px` }}>
          {mockServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              total={mockServices.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
