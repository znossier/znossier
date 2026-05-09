'use client';

import {
  isExperienceGroup,
  type AboutContent,
  type ExperienceGroup,
  type ExperienceItem,
  type ExperienceRole,
} from '@/lib/site-content';
import { smoothScrollTo } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, memo } from 'react';
import { Button } from '@/components/Button';
import { SectionGridLines } from '@/components/SectionGridLines';
import { SectionHeading } from '@/components/SectionHeading';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import Image from 'next/image';

/** LinkedIn-style icon badge for company logos. Uses img to avoid Next.js Image cache serving wrong asset. */
function CompanyLogo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`relative flex h-9 w-9 flex-shrink-0 overflow-hidden border border-border/85 bg-background/80 ${className}`}
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
      transition={{ duration: 0.25, ease: 'easeOut' }}
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
          <p className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-foreground/42">
            Current Company
          </p>
          <h4 className="mt-1 text-base font-semibold leading-tight tracking-[-0.02em] text-foreground">
            {group.company}
          </h4>
        </div>
      </div>

      <div className="min-w-0 border-l border-border/80 pl-4">
        {group.roles.map((role, roleIndex) => (
          <div key={`${group.company}-${role.role}-${role.period}`} className="relative pb-4 last:pb-0">
            <span className="absolute -left-[1.0625rem] top-1.5 h-2 w-2 border border-border bg-background dark:bg-section-accent" aria-hidden />
            <ExperienceGroupRoleRow
              role={role}
              roleIndex={roleIndex}
              groupIndex={groupIndex}
              company={group.company}
              isExpanded={expandedKeys.has(`${groupIndex}-${roleIndex}`)}
              onToggle={() => onToggle(`${groupIndex}-${roleIndex}`)}
            />
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
  const hasContent = (role.bullets && role.bullets.length > 0) || !!role.description;

  const rowContent = (
    <>
      <div className="grid grid-cols-6 items-start gap-x-3">
        <div className="[grid-column:1/span_4] min-w-0">
          <h5 className="mb-1 text-[0.97rem] font-semibold leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-link md:text-[1.04rem]">
            {role.role}
          </h5>
          <p className="sr-only">{company}</p>
        </div>
        <div
          className="[grid-column:5/span_2] flex flex-col items-end gap-2.5 text-foreground/40"
          aria-hidden="true"
        >
          <span className="editorial-kicker max-w-[7.5rem] text-right text-[0.62rem] tracking-[0.14em] text-foreground/44 sm:max-w-none sm:text-[0.72rem] sm:tracking-[0.22em]">{role.period}</span>
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
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
              role="region"
              aria-live="polite"
            >
              {role.bullets && role.bullets.length > 0 ? (
                <ul className="space-y-1.5 pt-3 text-sm leading-relaxed text-foreground/70">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-[3px] w-[3px] flex-shrink-0 rounded-full bg-foreground/40" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                role.description && (
                  <p className="pt-3 text-sm leading-relaxed text-foreground/70">
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
        className="w-full text-left group focus:outline-none"
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
  const hasContent = (item.bullets && item.bullets.length > 0) || !!item.description;

  const rowContent = (
    <>
      <div className="grid grid-cols-6 items-start gap-x-3">
        <div className="[grid-column:1/span_4] flex min-w-0 items-start gap-3">
          {item.logo ? <CompanyLogo src={item.logo} alt={item.company} /> : <div className="w-10 flex-shrink-0" aria-hidden />}
          <div className="min-w-0">
            <h4 className="mb-1 text-[0.97rem] font-semibold leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-link md:text-[1.04rem]">
              {item.role}
            </h4>
            <p className="text-sm text-foreground/70">{item.company}</p>
          </div>
        </div>
        <div
          className="[grid-column:5/span_2] flex flex-col items-end gap-2.5 text-foreground/40"
          aria-hidden="true"
        >
          <span className="editorial-kicker max-w-[7.5rem] text-right text-[0.62rem] tracking-[0.14em] text-foreground/44 sm:max-w-none sm:text-[0.72rem] sm:tracking-[0.22em]">{item.period}</span>
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
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
              role="region"
              aria-live="polite"
            >
              {item.bullets && item.bullets.length > 0 ? (
                <ul className="pt-3 pl-[52px] space-y-1.5 text-sm text-foreground/70 leading-relaxed">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-[3px] w-[3px] flex-shrink-0 rounded-full bg-foreground/40" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                item.description && (
                  <p className="text-sm text-foreground/70 leading-relaxed pt-3 pl-[52px]">
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

  if (!hasContent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="mb-0 border-b border-border/85 bg-transparent px-4 py-4 last:border-b-0 md:px-5"
      >
        {rowContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="mb-0 border-b border-border/85 bg-transparent px-4 py-4 last:border-b-0 md:px-5"
    >
      <button
        onClick={onToggle}
        className="w-full text-left group focus:outline-none"
        aria-expanded={isExpanded}
        aria-controls={`experience-details-single-${index}`}
      >
        {rowContent}
      </button>
    </motion.div>
  );
});

export function About({ about }: { about: AboutContent }) {
  const sectionRef = useRef<HTMLElement>(null);
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
    <section
      ref={sectionRef}
      id="about"
      className="relative z-20 min-h-screen border-t border-border/90 bg-background py-[var(--mobile-section-padding)] md:py-20 lg:py-24 dark:bg-section-accent"
    >
      <SectionGridLines boundaries={HOME_SECTION_BOUNDARIES.about} />
      <div className="relative z-10 mx-auto h-full w-full max-w-[var(--site-max-width)] px-[var(--site-padding-inline)] lg:px-0">
        <div className="site-section-grid min-h-0">
          <div className="[grid-column:1/span_6] flex flex-col gap-6 lg:[grid-column:1/span_11] lg:sticky lg:self-start lg:gap-8 lg:[top:128px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading surfaceClassName="bg-background dark:bg-section-accent">About Me</SectionHeading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="editorial-panel grid grid-cols-6 gap-x-3 gap-y-5 p-4 sm:gap-6 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0, rotateX: 8, rotateY: -6 }}
                whileInView={{ opacity: 1, rotateX: 0, rotateY: 0 }}
                whileHover={{ rotateX: 14, rotateY: -18, rotateZ: 1.4, scale: 1.03 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.48, ease: [0.22, 0.61, 0.36, 1] }}
                className="[grid-column:1/span_6] w-full sm:[grid-column:1/span_2] sm:self-stretch"
                style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
              >
                <div className="surface-chrome relative h-44 w-full overflow-hidden border border-border/90 sm:h-full sm:min-h-44 dark:bg-background/70">
                  {about.image && (
                    <Image
                      src={about.image}
                      alt="Portrait of Zeina Nossier"
                      fill
                      className="object-cover"
                      sizes="(max-width: 639px) calc(100vw - 4rem), 144px"
                    />
                  )}
                </div>
              </motion.div>
              <div className="[grid-column:1/span_6] min-w-0 space-y-4 sm:[grid-column:3/span_4]">
                <h3 className="font-mono text-[1.02rem] font-bold uppercase leading-tight tracking-[0.08em] text-foreground sm:text-[1.18rem]">
                  {about.name}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/84">
                  {about.bioShort ?? about.bio}
                </p>
                <Button
                  onClick={() => smoothScrollTo('footer', 100)}
                  className="min-h-10 w-auto px-4 py-2 text-[0.68rem] tracking-[0.18em]"
                  aria-label="Scroll to contact section"
                >
                  Contact Me <span className="ms-1" aria-hidden>→</span>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Experiences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="[grid-column:1/span_6] editorial-panel surface-raised space-y-0 p-0 dark:bg-section-accent lg:[grid-column:14/span_11]"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
