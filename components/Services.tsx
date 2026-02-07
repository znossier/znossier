'use client';

import { mockServices } from '@/lib/mock-data';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const NAV_HEIGHT_PX = 80;

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
  const stickyTop = NAV_HEIGHT_PX + index * 10;

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
      <div className="border-t border-border pt-4 pb-4 hover:border-foreground/40 transition-all duration-200 bg-background md:h-[320px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch md:h-full">
          {/* Left ~2/3: number on top, then title and description stacked with same left alignment */}
          <div className="md:col-span-2 flex flex-col justify-center space-y-3 md:space-y-4 py-2 text-left">
            <div className="text-xs md:text-sm font-medium text-foreground/60">
              {service.number}
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-foreground">
              {service.title}
            </h4>
            <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
              {service.description}
            </p>
          </div>
          {/* Right ~1/3: placeholder image — fixed height so all cards match; same width as text above on mobile */}
          <div className="min-h-[140px] md:min-h-0 md:h-full rounded-lg overflow-hidden bg-accent/10 flex items-center justify-center">
            <span className="text-3xl md:text-4xl text-foreground/30" aria-hidden>
              {service.number}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="expertise" className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative bg-background z-20">
      <div className="mx-auto max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-12"
        >
          <div className="flex items-center gap-4 md:gap-6">
            {/* Horizontal line on left */}
            <div className="w-12 md:w-16 border-t border-border"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Expertise
            </h2>
          </div>
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
