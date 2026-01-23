'use client';

import { mockServices } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

function ServiceCard({ 
  service, 
  index,
  total 
}: { 
  service: typeof mockServices[0]; 
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px', amount: 0.2 });

  // Higher z-index for later cards so they cover earlier ones
  // Card 0 (first) has z-index 1, Card 1 has z-index 2, etc.
  const zIndex = index + 1;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={{ 
        zIndex,
        position: 'sticky',
        // Each card sticks at a different top position, so they stack
        top: `${20 + index * 10}px`,
      }}
      className="mb-4"
    >
      <div className="border-t border-border pt-4 pb-4 hover:border-foreground/40 transition-all duration-200 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
          {/* Number on top - small font */}
          <div className="text-xs md:text-sm font-medium text-foreground/60">
            {service.number}
          </div>
          
          {/* Service name and description */}
          <div className="flex-1">
            <h4 className="text-lg md:text-xl font-semibold text-foreground mb-1">
              {service.title}
            </h4>
            <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
              {service.description}
            </p>
          </div>
          
          {/* Image */}
          <div className="aspect-[16/9] md:aspect-[4/3] bg-accent/10 relative overflow-hidden rounded-md">
            <div className="w-full h-full flex items-center justify-center text-4xl text-foreground/30">
              {service.number}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="services" className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative bg-background z-20">
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
              Services
            </h2>
          </div>
        </motion.div>

        <div className="relative" style={{ minHeight: `${mockServices.length * 250}px` }}>
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
