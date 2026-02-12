'use client';

import { mockAbout, isExperienceGroup, type ExperienceGroup, type ExperienceItem, type ExperienceRole } from '@/lib/mock-data';
import { smoothScrollTo } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { SectionHeading } from '@/components/SectionHeading';

/** LinkedIn-style icon badge for company logos. Uses img to avoid Next.js Image cache serving wrong asset. */
function CompanyLogo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  // #region agent log
  if (typeof fetch !== 'undefined') {
    fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'About.tsx:CompanyLogo',
        message: 'CompanyLogo render',
        data: { src, alt },
        timestamp: Date.now(),
        hypothesisId: 'H4',
      }),
    }).catch(() => {});
  }
  // #endregion
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

function ExperienceRoleRow({
  role,
  index,
  isExpanded,
  onToggle,
  showLogo,
  logo,
  company,
  isInGroup,
}: {
  role: ExperienceRole;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  showLogo: boolean;
  logo?: string;
  company: string;
  isInGroup: boolean;
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

      <button
        onClick={onToggle}
        className="w-full text-left group focus:outline-none p-2 -m-2"
        aria-expanded={isExpanded}
        aria-controls={`experience-details-${index}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-start gap-3 min-w-0">
            {showLogo && logo ? (
              <CompanyLogo src={logo} alt={company} />
            ) : (
              <div className="w-10 flex-shrink-0" aria-hidden />
            )}
            <div className="min-w-0">
              <h4 className="text-base md:text-lg font-semibold text-foreground group-hover:text-link transition-colors mb-1">
                {role.role}
              </h4>
              {!isInGroup && <p className="text-sm text-foreground/70">{company}</p>}
            </div>
          </div>
          <div
            className="flex flex-col items-end flex-shrink-0 text-foreground/40 group-hover:text-foreground transition-colors gap-2.5"
            aria-hidden="true"
          >
            <span className="text-xs text-foreground/60">{role.period}</span>
            <ExpandIcon isExpanded={isExpanded} />
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && role.description && (
            <motion.div
              id={`experience-details-${index}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
              role="region"
              aria-live="polite"
            >
              <p className="text-sm text-foreground/70 leading-relaxed pt-3 pl-[52px]">
                {role.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
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
  // #region agent log
  if (typeof fetch !== 'undefined') {
    fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'About.tsx:ExperienceGroupCard',
        message: 'ExperienceGroupCard render',
        data: { groupIndex, company: group.company, logo: group.logo },
        timestamp: Date.now(),
        hypothesisId: 'H3',
      }),
    }).catch(() => {});
  }
  // #endregion
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, delay: groupIndex * 0.05 }}
      className="relative mb-8"
    >
      {/* Single header: logo + company name, no card, no extra lines */}
      <div className="flex items-center gap-2.5 mb-3">
        {group.logo && <CompanyLogo src={group.logo} alt={group.company} />}
        <span className="text-sm font-medium text-foreground/80 capitalize">{group.company}</span>
      </div>
      {/* Role rows use same style as other experiences; no left border, no repeated logo */}
      <div className="space-y-0">
        {group.roles.map((role, roleIndex) => (
          <ExperienceRoleRow
            key={roleIndex}
            role={role}
            index={roleIndex}
            isExpanded={expandedKeys.has(`${groupIndex}-${roleIndex}`)}
            onToggle={() => onToggle(`${groupIndex}-${roleIndex}`)}
            showLogo={false}
            logo={group.logo}
            company={group.company}
            isInGroup={true}
          />
        ))}
      </div>
    </motion.div>
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
            className="flex flex-col items-end flex-shrink-0 text-foreground/40 group-hover:text-foreground transition-colors gap-2.5"
            aria-hidden="true"
          >
            <span className="text-xs text-foreground/60">{item.period}</span>
            <ExpandIcon isExpanded={isExpanded} />
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && item.description && (
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
              <p className="text-sm text-foreground/70 leading-relaxed pt-3 pl-[52px]">
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
      className="min-h-screen py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative bg-background z-20"
    >
      <div className="mx-auto max-w-7xl w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 min-h-0">
          {/* Left Column - Sticky */}
          <div className="lg:sticky lg:top-24 lg:self-start flex flex-col gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading>About Me</SectionHeading>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                {mockAbout.name}
              </h3>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                {mockAbout.bio}
              </p>
              <Button
                onClick={() => smoothScrollTo('footer', 100)}
                className="text-sm px-6 py-2.5"
                aria-label="Scroll to contact section"
              >
                Contact me →
              </Button>
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
              // #region agent log
              const isGroup = isExperienceGroup(entry);
              const company = entry.company;
              const logo = 'logo' in entry ? entry.logo : undefined;
              if (typeof fetch !== 'undefined') {
                fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    location: 'About.tsx:experienceEntries.map',
                    message: 'entry at index',
                    data: { index, isGroup, company, logo },
                    timestamp: Date.now(),
                    hypothesisId: 'H1',
                  }),
                }).catch(() => {});
              }
              // #endregion
              if (isGroup) {
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
