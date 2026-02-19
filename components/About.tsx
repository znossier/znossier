'use client';

import { mockAbout, isExperienceGroup, type ExperienceGroup, type ExperienceItem, type ExperienceRole } from '@/lib/mock-data';
import { smoothScrollTo } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { SectionHeading } from '@/components/SectionHeading';
import Image from 'next/image';

/** LinkedIn-style icon badge for company logos. Uses img to avoid Next.js Image cache serving wrong asset. */
function CompanyLogo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`relative flex h-9 w-9 flex-shrink-0 overflow-hidden rounded-md border border-border/60 bg-background shadow-sm ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
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

function ExperienceGroupCard({
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative pb-4 mb-4 last:mb-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border overflow-hidden">
        <motion.div
          className="h-full bg-foreground/40"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? '100%' : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />
      </div>

      {/* Same layout as single: each role row = [logo or spacer] + [role + company] + [period + icon]; logo only beside latest role */}
      <div className="space-y-0">
        {group.roles.map((role, roleIndex) => (
          <ExperienceGroupRoleRow
            key={roleIndex}
            role={role}
            roleIndex={roleIndex}
            groupIndex={groupIndex}
            group={group}
            isExpanded={expandedKeys.has(`${groupIndex}-${roleIndex}`)}
            onToggle={() => onToggle(`${groupIndex}-${roleIndex}`)}
            isLast={roleIndex === group.roles.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function ExperienceGroupRoleRow({
  role,
  roleIndex,
  groupIndex,
  group,
  isExpanded,
  onToggle,
  isLast,
}: {
  role: ExperienceRole;
  roleIndex: number;
  groupIndex: number;
  group: ExperienceGroup;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const showLogo = roleIndex === 0;
  const hasContent = (role.bullets && role.bullets.length > 0) || !!role.description;

  const rowContent = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-3 min-w-0">
          {showLogo && group.logo ? (
            <CompanyLogo src={group.logo} alt={group.company} />
          ) : (
            <div className="w-9 flex-shrink-0" aria-hidden />
          )}
          <div className="min-w-0">
            <h4 className="text-base md:text-lg font-semibold text-foreground group-hover:text-link transition-colors mb-1">
              {role.role}
            </h4>
            <p className="text-sm text-foreground/70 capitalize">{group.company}</p>
          </div>
        </div>
        <div
          className="flex flex-col items-end flex-shrink-0 text-foreground/40 gap-2.5"
          aria-hidden="true"
        >
          <span className="text-xs text-foreground/60">{role.period}</span>
          {hasContent && <ExpandIcon isExpanded={isExpanded} />}
        </div>
      </div>

      {hasContent && (
        <div
          id={`experience-details-${groupIndex}-${roleIndex}`}
          role="region"
          aria-live="polite"
          className="grid transition-[grid-template-rows] duration-[250ms] ease-out"
          style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
        >
          <div className="min-h-0 overflow-hidden">
            {role.bullets && role.bullets.length > 0 ? (
              <ul className="pt-3 pl-[52px] space-y-1.5 text-sm text-foreground/70 leading-relaxed">
                {role.bullets.map((bullet, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-2 h-[3px] w-[3px] flex-shrink-0 rounded-full bg-foreground/40" aria-hidden />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : (
              role.description && (
                <p className="text-sm text-foreground/70 leading-relaxed pt-3 pl-[52px]">
                  {role.description}
                </p>
              )
            )}
          </div>
        </div>
      )}
    </>
  );

  if (!hasContent) {
    return (
      <div className={`${isLast ? '' : 'mb-4'} p-2`} style={{ overflowAnchor: 'none' }}>
        {rowContent}
      </div>
    );
  }

  return (
    <div className={isLast ? '' : 'mb-4'} style={{ overflowAnchor: 'none' }}>
      <button
        onClick={onToggle}
        className="w-full text-left group focus:outline-none p-2 -m-2"
        aria-expanded={isExpanded}
        aria-controls={`experience-details-${groupIndex}-${roleIndex}`}
      >
        {rowContent}
      </button>
    </div>
  );
}

function ExperienceSingleItem({
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
  const [isHovered, setIsHovered] = useState(false);
  const hasContent = (item.bullets && item.bullets.length > 0) || !!item.description;

  const rowContent = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-3 min-w-0">
          {item.logo ? <CompanyLogo src={item.logo} alt={item.company} /> : <div className="w-10 flex-shrink-0" aria-hidden />}
          <div className="min-w-0">
            <h4 className="text-base md:text-lg font-semibold text-foreground group-hover:text-link transition-colors mb-1">
              {item.role}
            </h4>
            <p className="text-sm text-foreground/70">{item.company}</p>
          </div>
        </div>
        <div
          className="flex flex-col items-end flex-shrink-0 text-foreground/40 gap-2.5"
          aria-hidden="true"
        >
          <span className="text-xs text-foreground/60">{item.period}</span>
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
                  {item.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex gap-2">
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
        className="relative pb-4 mb-4 last:mb-0 p-2"
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
      className="relative pb-4 mb-4 last:mb-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border overflow-hidden">
        <motion.div
          className="h-full bg-foreground/40"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? '100%' : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />
      </div>

      <button
        onClick={onToggle}
        className="w-full text-left group focus:outline-none p-2 -m-2"
        aria-expanded={isExpanded}
        aria-controls={`experience-details-single-${index}`}
      >
        {rowContent}
      </button>
    </motion.div>
  );
}

export function About() {
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

  const experienceEntries = mockAbout.experience;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative bg-background dark:bg-section-accent z-20"
    >
      <div className="mx-auto max-w-7xl w-full h-full">
        {/* Two columns: title + name/bio/contact (sticky) | experiences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 min-h-0">
          {/* Left Column - Sticky: Section title, Zeina Nossier, bio, Contact */}
          <div className="lg:sticky lg:top-24 lg:self-start flex flex-col gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading>About Me</SectionHeading>
            </motion.div>
            {/* Image and description side by side */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="flex flex-row gap-4 sm:gap-6 items-start"
            >
              {/* Tilting portrait card */}
              <motion.div
                initial={{ opacity: 0, rotateX: 8, rotateY: -6 }}
                whileInView={{ opacity: 1, rotateX: 0, rotateY: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                className="flex-shrink-0"
                style={{ perspective: 900 }}
              >
                <motion.div
                  whileHover={{
                    rotateX: -6,
                    rotateY: 6,
                    rotateZ: -1.5,
                    y: -4,
                    boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className="relative w-28 h-32 sm:w-32 sm:h-36 md:w-36 md:h-40 rounded-2xl overflow-hidden border border-border/80 bg-section-accent/60 dark:bg-background/70"
                >
                  {mockAbout.image && (
                    <Image
                      src={mockAbout.image}
                      alt="Portrait of Zeina Nossier"
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  )}
                </motion.div>
              </motion.div>
              {/* Description next to image */}
              <div className="min-w-0 flex-1 space-y-4 pt-0.5">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {(mockAbout as { bioShort?: string }).bioShort ?? mockAbout.bio}
                </p>
                <Button
                  onClick={() => smoothScrollTo('footer', 100)}
                  className="text-sm px-6 py-2.5 font-mono uppercase tracking-wider"
                  aria-label="Scroll to contact section"
                >
                  Contact me →
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
            className="space-y-1"
          >
            {experienceEntries.map((entry, index) => {
              if (isExperienceGroup(entry)) {
                return (
                  <ExperienceGroupCard
                    key={index}
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
                  key={index}
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
