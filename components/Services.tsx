'use client';

import { SectionHeading } from '@/components/SectionHeading';
import { SectionGridLines } from '@/components/SectionGridLines';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import type { Service } from '@/lib/site-content';
import { motion, useInView } from 'framer-motion';
import { useRef, memo } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/** Ribbon (top-8) + nav bar height with extra breathing room below the nav */
const NAV_OFFSET_PX = 128;
const CARD_STACK_OFFSET_PX = 14;

const serviceAsciiArt: Record<string, string> = {
  'product-ux-design': [
    '+ USER +----+ MAP +----+ FLOW +',
    '    |          |          |    ',
    '  PAIN       TEST       SHIP   ',
    '    |          |          |    ',
    '    +------ ITERATE -----+    ',
    '              |               ',
    '        JOURNEY SYSTEM        ',
  ].join('\n'),
  'ui-design-systems': [
    '+------------------------+',
    '| BUTTON      TAG        |',
    '|                        |',
    '| INPUT  ______________  |',
    '|                        |',
    '| +------ CARD -------+  |',
    '| | TITLE             |  |',
    '| | BODY COPY         |  |',
    '| +-------------------+  |',
    '+------------------------+',
  ].join('\n'),
  'ecommerce-web': [
    '+-----------------------+',
    '| IMAGE                 |',
    '| PRODUCT CARD          |',
    '| RATING  ****-   $129  |',
    '|                       |',
    '| [ ADD TO CART ]       |',
    '| CHECKOUT / SHIP       |',
    '+-----------------------+',
  ].join('\n'),
  'visual-brand-design': [
    '+------------------------+',
    '| ZN       Aa            |',
    '| MARK     TYPE SYSTEM   |',
    '|                        |',
    '| #DFFF00  #111111       |',
    '| #8A8A8A  #F5F4EF       |',
    '|                        |',
    '| GRID / TYPE / TONE     |',
    '+------------------------+',
  ].join('\n'),
};

const serviceAsciiLabels: Record<string, string> = {
  'product-ux-design': 'Journey Map',
  'ui-design-systems': 'Component Kit',
  'ecommerce-web': 'Commerce UI',
  'visual-brand-design': 'Brand System',
};

function getServiceAsciiArt(service: Service) {
  const byId = serviceAsciiArt[service.id];
  if (byId) return byId;

  const title = service.title.toLowerCase();

  if (title.includes('product') || title.includes('ux')) {
    return serviceAsciiArt['product-ux-design'];
  }

  if (title.includes('ui') || title.includes('system')) {
    return serviceAsciiArt['ui-design-systems'];
  }

  if (title.includes('commerce') || title.includes('web')) {
    return serviceAsciiArt['ecommerce-web'];
  }

  if (title.includes('brand') || title.includes('visual')) {
    return serviceAsciiArt['visual-brand-design'];
  }

  return serviceAsciiArt['product-ux-design'];
}

function getServiceAsciiLabel(service: Service) {
  if (serviceAsciiLabels[service.id]) return serviceAsciiLabels[service.id];

  const title = service.title.toLowerCase();

  if (title.includes('product') || title.includes('ux')) return serviceAsciiLabels['product-ux-design'];
  if (title.includes('ui') || title.includes('system')) return serviceAsciiLabels['ui-design-systems'];
  if (title.includes('commerce') || title.includes('web')) return serviceAsciiLabels['ecommerce-web'];
  if (title.includes('brand') || title.includes('visual')) return serviceAsciiLabels['visual-brand-design'];

  return 'System Diagram';
}

const ServiceCard = memo(function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px', amount: 0.2 });
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const asciiArt = getServiceAsciiArt(service);
  const asciiLabel = getServiceAsciiLabel(service);

  const zIndex = index + 1;
  const stickyTop = NAV_OFFSET_PX + index * CARD_STACK_OFFSET_PX;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={{
        zIndex,
        position: 'sticky',
        top: isDesktop ? `${stickyTop}px` : `calc(var(--chrome-top) + ${12 + index * 10}px)`,
      }}
      className="mb-4 md:mb-5"
    >
      <div className="editorial-panel surface-raised overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.08)] dark:bg-background dark:shadow-[0_12px_28px_rgba(0,0,0,0.18)] md:h-[320px]">
        <div className="relative z-10 grid h-full grid-cols-6 gap-x-3 gap-y-4 p-5 text-left sm:p-6 md:grid-cols-[auto_1fr] md:gap-8 md:p-8">
          <div className="editorial-kicker [grid-column:1/span_2] self-start text-foreground/58 md:[grid-column:auto]">
            {service.number}
          </div>
          <div className="grid h-full min-w-0 [grid-column:2/span_5] grid-cols-1 gap-6 md:[grid-column:auto] lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.58fr)] lg:items-center lg:gap-9">
            <div className="flex h-full min-w-0 flex-col justify-between gap-5">
              <h4 className="font-mono text-[1.42rem] font-bold uppercase leading-[0.98] tracking-[-0.035em] text-foreground sm:text-[1.55rem] md:text-[1.9rem]">
                {service.title}
              </h4>
              <p className="max-w-xl text-sm leading-relaxed text-foreground/78 md:text-base">
                {service.description}
              </p>
            </div>

            {asciiArt ? (
              <div className="ascii-art-shell hidden min-w-0 self-center lg:flex" aria-hidden>
                <div className="ascii-art-header">
                  <span>{asciiLabel}</span>
                  <span>{service.number}</span>
                </div>
                <pre className="ascii-art">{asciiArt}</pre>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export function Services({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="relative z-20 border-t border-border/90 bg-background py-[var(--mobile-section-padding)] md:pt-28 md:pb-20 lg:pt-32 lg:pb-24 dark:bg-section-accent"
    >
      <SectionGridLines boundaries={HOME_SECTION_BOUNDARIES.expertise} />
      <div className="relative z-10 mx-auto w-full max-w-[var(--site-max-width)] px-[var(--site-padding-inline)] lg:px-0">
        <div className="site-section-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="[grid-column:1/span_5] lg:[grid-column:1/span_5]"
          >
            <div
              className="relative z-10 bg-background/92 py-3 backdrop-blur-[2px] dark:bg-section-accent/94 dark:backdrop-blur-0 lg:sticky"
              style={{ top: isDesktop ? NAV_OFFSET_PX : undefined }}
            >
              <SectionHeading surfaceClassName="bg-background dark:bg-section-accent">Expertise</SectionHeading>
            </div>
          </motion.div>

          <div className="relative [grid-column:1/span_6] lg:[grid-column:7/span_18]" style={{ minHeight: `${services.length * (isDesktop ? 348 : 252)}px` }}>
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
