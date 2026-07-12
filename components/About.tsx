'use client';

import {
  isExperienceGroup,
  type AboutContent,
  type ExperienceGroup,
  type ExperienceItem,
  type ExperienceRole,
} from '@/lib/site-content';
import { smoothScrollTo } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, memo, useRef } from 'react';
import { Button } from '@/components/Button';
import { Section } from '@/components/Section';
import { SectionLayout } from '@/components/SectionLayout';
import { SectionHeading } from '@/components/SectionHeading';
import { SpacingGuide } from '@/components/SpacingGuide';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { Reveal } from '@/components/Reveal';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { gridSpans } from '@/lib/grid-spans';
import { EASE_PRECISION, MOTION, REVEAL_VIEWPORT, transitionHover } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Image from 'next/image';

/** LinkedIn-style icon badge for company logos. Uses img to avoid Next.js Image cache serving wrong asset. */
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

/** Plus icon that rotates 45° to become X when expanded */
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
    <div
      className="mb-0 border-b border-border/85 bg-transparent px-4 py-4 last:border-b-0 md:px-5"
    >
      <div className="mb-4 flex items-center gap-3">
        {group.logo ? (
          <CompanyLogo src={group.logo} alt={group.company} />
        ) : (
          <div className="h-9 w-9 flex-shrink-0" aria-hidden />
        )}
        <div className="min-w-0">
          <p className="type-meta">
            Current Company
          </p>
          <h4 className="type-heading mt-1">
            {group.company}
          </h4>
        </div>
      </div>

      <div className="relative min-w-0">
        {group.roles.length > 1 && (
          <div
            className="absolute left-[7px] top-[0.55rem] bottom-[0.55rem] w-px bg-border/75"
            aria-hidden
          />
        )}
        {group.roles.map((role, roleIndex) => (
          <div key={`${group.company}-${role.role}-${role.period}`} className="flex gap-4 pb-6 last:pb-0">
            <div className="relative w-3.5 shrink-0" aria-hidden>
              <span className="absolute left-1/2 top-[0.55rem] h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 border border-subtle bg-canvas" />
            </div>
            <div className="min-w-0 flex-1">
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
        ))}
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
          <h5 className="type-heading transition-colors group-hover:text-link">
            {role.role}
          </h5>
          <p className="sr-only">{company}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-faint">
          <span className="type-meta max-sm:whitespace-normal sm:whitespace-nowrap">
            {role.period}
          </span>
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
                role.description && (
                  <p className="type-body pt-3">
                    {role.description}
                  </p>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );

  if (!hasContent) {
    return (
      <div style={{ overflowAnchor: 'none' }}>
        {rowContent}
      </div>
    );
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
  const rowClassName = 'mb-0 border-b border-border/85 bg-transparent px-4 py-4 last:border-b-0 md:px-5';

  const rowContent = (
    <>
      <div className="grid grid-cols-[2.5rem_1fr] items-start gap-x-3 gap-y-2 sm:grid-cols-[2.5rem_1fr_auto]">
        {item.logo ? <CompanyLogo src={item.logo} alt={item.company} /> : <div className="w-10 flex-shrink-0" aria-hidden />}
        <div className="min-w-0">
          <h4 className="type-heading transition-colors group-hover:text-link">
            {item.role}
          </h4>
          <p className="type-body mt-0.5">{item.company}</p>
        </div>
        <div className="col-start-2 flex shrink-0 items-center gap-2 text-faint sm:col-start-3 sm:row-start-1">
          <span className="type-meta max-sm:whitespace-normal sm:whitespace-nowrap">
            {item.period}
          </span>
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
                <ul className="type-body space-y-1.5 pt-3 pl-[52px]">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-[3px] w-[3px] flex-shrink-0 rounded-full bg-foreground/40" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                item.description && (
                  <p className="type-body pt-3 pl-[52px]">
                    {item.description}
                  </p>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );

  if (reducedMotion) {
    const staticRow = (
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
    return staticRow;
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

  return (
    <Section id="about" variant="subtle" className="lg:min-h-screen">
      <SectionLayout boundaries={HOME_SECTION_BOUNDARIES.about}>
        <SpacingGuide
          showGaps
          showGutters
          showLabels
          sectionBoundaries={HOME_SECTION_BOUNDARIES.about}
          className="site-section-grid min-h-0"
        >
          <div className={cn('flex flex-col gap-6 lg:gap-8', gridSpans.about.intro)}>
            <Reveal>
              <div className="section-heading-sticky lg:sticky lg:self-start lg:[top:calc(var(--chrome-top)+1rem)]">
                <SectionHeading kicker="05 — Profile" surfaceClassName="section-heading-sticky">About Me</SectionHeading>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <WorkspaceFrame
                inspectMode="hover"
                showSpacing
                showPadding
                panelClassName="grid grid-cols-6 gap-x-3 gap-y-5 p-4 sm:gap-6 sm:p-6"
              >
                <div className="[grid-column:1/span_6] w-full sm:[grid-column:1/span_2] sm:self-stretch">
                  <WorkspaceFrame
                    inspectMode="hover"
                    variant="bare"
                    panelClassName="surface-raised relative h-44 w-full overflow-hidden border border-subtle sm:h-full sm:min-h-44"
                  >
                    {about.image && (
                      <Image
                        src={about.image}
                        alt="Portrait of Zeina Nossier"
                        fill
                        className="object-cover"
                        sizes="(max-width: 639px) calc(100vw - 4rem), 144px"
                      />
                    )}
                  </WorkspaceFrame>
                </div>
                <div className="[grid-column:1/span_6] min-w-0 space-y-4 sm:[grid-column:3/span_4]">
                  <h3 className="type-title-sm">{about.name}</h3>
                  <p className="type-body">{about.bioShort ?? about.bio}</p>
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
          </div>

          <Reveal delay={0.1} className={gridSpans.about.experience}>
            <WorkspaceFrame inspectMode="hover" panelClassName="space-y-0 p-0">
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
        </SpacingGuide>
      </SectionLayout>
    </Section>
  );
}
