'use client';

import {
  isExperienceGroup,
  type AboutContent,
  type ExperienceGroup,
  type ExperienceItem,
  type ExperienceRole,
} from '@/lib/site-content';
import { smoothScrollTo, cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, memo, useRef } from 'react';
import { Button } from '@/components/Button';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { Section } from '@/components/Section';
import { SectionStickyShell } from '@/components/SectionStickyShell';
import { SectionLayout } from '@/components/SectionLayout';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { GridCell } from '@/components/GridCell';
import { layoutClass } from '@/lib/grid-layout';
import { EASE_PRECISION, MOTION, REVEAL_VIEWPORT, transitionHover } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { mediaQueries } from '@/lib/breakpoints';
import Image from 'next/image';

function CompanyLogo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`relative flex h-9 w-9 flex-shrink-0 overflow-hidden border border-subtle bg-panel/80 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" width={36} height={36} loading="lazy" />
    </div>
  );
}

function ExpandIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <motion.span
      animate={{ rotate: isExpanded ? 45 : 0 }}
      transition={transitionHover}
      className="inline-flex"
      aria-hidden
    >
      <Plus size={16} strokeWidth={2} />
    </motion.span>
  );
}

const ExperienceGroupCard = memo(function ExperienceGroupCard({
  group,
  groupIndex,
  expandedKeys,
  onToggle,
}: {
  group: ExperienceGroup;
  groupIndex: number;
  expandedKeys: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="site-cell-pad mb-0 border-b border-border/85 bg-transparent last:border-b-0">
      <div className="mb-4 flex items-center gap-4">
        {group.logo ? (
          <CompanyLogo src={group.logo} alt={group.company} />
        ) : (
          <div className="h-9 w-9 flex-shrink-0" aria-hidden />
        )}
        <div className="min-w-0">
          <p className="type-meta">Current Company</p>
          <h4 className="type-heading mt-1">{group.company}</h4>
        </div>
      </div>

      <div className="experience-timeline min-w-0">
        {group.roles.map((role, roleIndex) => {
          const isFirst = roleIndex === 0;
          const isLast = roleIndex === group.roles.length - 1;

          return (
            <div
              key={`${group.company}-${role.role}-${role.period}`}
              className={cn('experience-timeline-item', isFirst && 'experience-timeline-item--first')}
            >
              <div className="experience-timeline-rail" aria-hidden>
                <span className="experience-timeline-node" />
                {!isLast ? <span className="experience-timeline-line experience-timeline-line--after" /> : null}
              </div>
              <div className="experience-timeline-content">
                <ExperienceGroupRoleRow
                  role={role}
                  roleIndex={roleIndex}
                  groupIndex={groupIndex}
                  company={group.company}
                  isExpanded={expandedKeys.has(`${groupIndex}-${roleIndex}`)}
                  onToggle={() => onToggle(`${groupIndex}-${roleIndex}`)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

function ExperienceGroupRoleRow({
  role,
  roleIndex,
  groupIndex,
  company,
  isExpanded,
  onToggle,
}: {
  role: ExperienceRole;
  roleIndex: number;
  groupIndex: number;
  company: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const hasContent = (role.bullets && role.bullets.length > 0) || !!role.description;

  const rowContent = (
    <>
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
        <div className="min-w-0 flex-1 basis-[9rem]">
          <h5 className="type-heading">{role.role}</h5>
          <p className="sr-only">{company}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-muted">
          <span className="type-meta max-sm:whitespace-normal sm:whitespace-nowrap text-muted">{role.period}</span>
          {hasContent && <ExpandIcon isExpanded={isExpanded} />}
        </div>
      </div>

      {hasContent && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`experience-details-${groupIndex}-${roleIndex}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: MOTION.duration.overlay, ease: EASE_PRECISION }}
              className="overflow-hidden"
              role="region"
              aria-live="polite"
            >
              {role.bullets && role.bullets.length > 0 ? (
                <ul className="type-body space-y-1.5 pt-3">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-[3px] w-[3px] flex-shrink-0 rounded-full bg-foreground/40" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                role.description && <p className="type-body pt-3">{role.description}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );

  if (!hasContent) {
    return <div style={{ overflowAnchor: 'none' }}>{rowContent}</div>;
  }

  return (
    <div style={{ overflowAnchor: 'none' }}>
      <button
        onClick={onToggle}
        className="min-h-12 w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-expanded={isExpanded}
        aria-controls={`experience-details-${groupIndex}-${roleIndex}`}
      >
        {rowContent}
      </button>
    </div>
  );
}

const ExperienceSingleItem = memo(function ExperienceSingleItem({
  item,
  index,
  isExpanded,
  onToggle,
}: {
  item: ExperienceItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, REVEAL_VIEWPORT);
  const hasContent = (item.bullets && item.bullets.length > 0) || !!item.description;
  const rowClassName = 'site-cell-pad mb-0 border-b border-border/85 bg-transparent last:border-b-0';

  const rowContent = (
    <>
      <div className="grid grid-cols-[calc(var(--grid-unit)*2)_1fr] items-start gap-x-[var(--grid-unit)] gap-y-[var(--grid-unit)] sm:grid-cols-[calc(var(--grid-unit)*2)_1fr_auto]">
        {item.logo ? <CompanyLogo src={item.logo} alt={item.company} /> : <div className="w-[calc(var(--grid-unit)*2)] flex-shrink-0" aria-hidden />}
        <div className="min-w-0">
          <h4 className="type-heading">{item.role}</h4>
          <p className="type-body mt-0">{item.company}</p>
        </div>
        <div className="col-start-2 flex shrink-0 items-center gap-[var(--grid-unit)] text-muted sm:col-start-3 sm:row-start-1">
          <span className="type-meta max-sm:whitespace-normal sm:whitespace-nowrap text-muted">{item.period}</span>
          {hasContent && <ExpandIcon isExpanded={isExpanded} />}
        </div>
      </div>

      {hasContent && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`experience-details-single-${index}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: MOTION.duration.overlay, ease: EASE_PRECISION }}
              className="overflow-hidden"
              role="region"
              aria-live="polite"
            >
              {item.bullets && item.bullets.length > 0 ? (
                <ul className="type-body space-y-[var(--grid-unit)] pt-[var(--grid-unit)] pl-[calc(var(--grid-unit)*3)]">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-[var(--grid-unit)]">
                      <span className="mt-[calc(var(--grid-unit)/2)] h-[3px] w-[3px] flex-shrink-0 rounded-full bg-foreground/40" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                item.description && <p className="type-body pt-[var(--grid-unit)] pl-[calc(var(--grid-unit)*3)]">{item.description}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );

  if (reducedMotion) {
    return (
      <div className={rowClassName}>
        {!hasContent ? (
          rowContent
        ) : (
          <button
            onClick={onToggle}
            className="min-h-12 w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-expanded={isExpanded}
            aria-controls={`experience-details-single-${index}`}
          >
            {rowContent}
          </button>
        )}
      </div>
    );
  }

  const motionProps = {
    ref: rowRef,
    initial: { opacity: 0, y: 10 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    transition: {
      duration: MOTION.duration.reveal,
      delay: index * MOTION.duration.stagger,
      ease: EASE_PRECISION,
    },
    className: rowClassName,
  } as const;

  if (!hasContent) {
    return <motion.div {...motionProps}>{rowContent}</motion.div>;
  }

  return (
    <motion.div {...motionProps}>
      <button
        onClick={onToggle}
        className="min-h-12 w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-expanded={isExpanded}
        aria-controls={`experience-details-single-${index}`}
      >
        {rowContent}
      </button>
    </motion.div>
  );
});

export function About({ about }: { about: AboutContent }) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setExpandedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const experienceEntries = about.experience;
  const isDesktop = useMediaQuery(mediaQueries.lg);

  const panel = (
    <div className="site-section-grid min-h-0 gap-y-[calc(var(--grid-unit)*2)]">
      <GridCell
        section="about"
        cell="intro"
        className="flex flex-col gap-[calc(var(--grid-unit)*2)] lg:self-start"
      >
        <Reveal delay={0.06}>
          <WorkspaceFrame
            inspectMode="hover"
            inspectDepth="full"
            frameLabel="ABOUT-ME"
            showMeasurementLines
            measurementPlacement="outside"
            variant="figma"
            panelClassName="grid grid-cols-6 gap-[var(--grid-unit)] p-[var(--grid-unit)]"
            className="overflow-visible"
          >
            <div className="[grid-column:1/span_6] w-full sm:[grid-column:1/span_2] sm:self-stretch">
              <div className="relative h-[calc(var(--grid-unit)*8)] w-full overflow-hidden sm:h-full sm:min-h-[calc(var(--grid-unit)*8)]">
                {about.image && (
                  <Image
                    src={about.image}
                    alt="Portrait of Zeina Nossier"
                    fill
                    className="object-cover"
                    sizes="(max-width: 639px) calc(100vw - 48px), 192px"
                  />
                )}
              </div>
            </div>
            <div className="[grid-column:1/span_6] min-w-0 space-y-[var(--grid-unit)] sm:[grid-column:3/span_4]">
              <h3 className="type-title">{about.name}</h3>
              <p className="type-body text-secondary">{about.bioShort ?? about.bio}</p>
              <Button
                onClick={() => smoothScrollTo('footer')}
                variant="primary"
                aria-label="Scroll to contact section"
              >
                Contact Me <span className="ms-1" aria-hidden>→</span>
              </Button>
            </div>
          </WorkspaceFrame>
        </Reveal>
      </GridCell>

      <Reveal delay={0.1} className={layoutClass('about', 'experience')}>
        <WorkspaceFrame
          inspectMode="hover"
          inspectDepth="full"
          frameLabel="Experience"
          showMeasurementLines
          measurementPlacement="outside"
          variant="figma"
          panelClassName="overflow-hidden"
          className="overflow-visible"
        >
          {experienceEntries.map((entry, index) => {
            if (isExperienceGroup(entry)) {
              return (
                <ExperienceGroupCard
                  key={`group-${entry.company}`}
                  group={entry}
                  groupIndex={index}
                  expandedKeys={expandedKeys}
                  onToggle={toggleItem}
                />
              );
            }
            const expandedKey = `s-${index}`;
            return (
              <ExperienceSingleItem
                key={`single-${entry.role}-${entry.period}`}
                item={entry}
                index={index}
                isExpanded={expandedKeys.has(expandedKey)}
                onToggle={() => toggleItem(expandedKey)}
              />
            );
          })}
        </WorkspaceFrame>
      </Reveal>
    </div>
  );

  if (!isDesktop) {
    return (
      <Section id="about" variant="canvas" inspectOnEnter>
        <SectionLayout sectionId="about">
          <div className="section-figma-stack">
            <Reveal>
              <SectionHeading title="05 - About Me" />
            </Reveal>
            <div className="section-figma-panel">{panel}</div>
          </div>
        </SectionLayout>
      </Section>
    );
  }

  return (
    <Section id="about" variant="canvas" inspectOnEnter className="section--sticky-lock py-0">
      <SectionStickyShell
        sectionId="about"
        title="05 - About Me"
        panelClassName="section-sticky-panel--scroll"
        panelLabel="About me"
      >
        {panel}
      </SectionStickyShell>
    </Section>
  );
}
