'use client';

import { ProjectCardLinkLabel } from '@/components/ProjectCardLinkLabel';
import { Button } from '@/components/Button';
import { Section } from '@/components/Section';
import { SectionStickyShell } from '@/components/SectionStickyShell';
import { SectionHeading } from '@/components/SectionHeading';
import { SectionLayout } from '@/components/SectionLayout';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { getProjectHref, type Project } from '@/lib/projects';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { memo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { EASE_PRECISION, MOTION, REVEAL_VIEWPORT } from '@/lib/motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { mediaQueries } from '@/lib/breakpoints';

const ProjectCard = memo(function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, REVEAL_VIEWPORT);
  const [imageError, setImageError] = useState(false);
  const reducedMotion = useReducedMotion();

  const href = getProjectHref(project);
  const cardHref = href || '#';
  const isExternalLink = project.linkMode === 'external' && !!project.externalUrl;
  const hasValidLink = !!href;
  const linkVariant = isExternalLink ? 'external' : 'case-study';
  const previewImage = project.coverImage ?? project.image;
  const imageAvailable = !!previewImage && !imageError;
  const categoriesLabel = project.categories.join(' / ');
  const frameLabel = `PROJECT-${String(index + 1).padStart(2, '0')}`;

  const cardContent = (
    <WorkspaceFrame
      inspectMode="hover"
      inspectDepth="full"
      frameLabel={frameLabel}
      showRestingLabel
      showMeasurementLines
      showSpacing
      showPadding
      showGaps
      measurementPlacement="outside"
      variant="figma"
      panelClassName="site-cell-pad relative flex h-full w-full min-h-0 flex-col gap-[var(--grid-unit)]"
      className="card-lift relative h-full w-full overflow-visible"
    >
      {/* Figma 388:7006 / 402:7472 Project Card: image + title + tags only —
          no description text and no hover-reveal overlay in any Figma state. */}
      {imageAvailable && (
        <div className="project-preview-frame relative overflow-hidden">
          <Image
            src={previewImage}
            alt={`${project.title} project preview`}
            fill
            className="object-cover project-cover-image"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      <div className="flex shrink-0 flex-col gap-[var(--grid-unit)]">
        <div className="flex h-6 items-center justify-between gap-x-[var(--grid-unit)]">
          <h3 className="project-card-title">{project.title}</h3>
          {hasValidLink && <ProjectCardLinkLabel variant={linkVariant} />}
        </div>
        <p className="project-card-tags">{categoriesLabel}</p>
      </div>

      {!imageAvailable && project.description && (
        <p className="type-body line-clamp-5">{project.description}</p>
      )}
    </WorkspaceFrame>
  );

  return (
    <motion.article
      ref={ref}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={reducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: MOTION.duration.reveal,
        delay: reducedMotion ? 0 : index * MOTION.duration.stagger,
        ease: EASE_PRECISION,
      }}
      className="h-full overflow-visible"
    >
      {hasValidLink && isExternalLink ? (
        <a
          href={cardHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          data-project-card="interactive"
          aria-label={`${project.title} — opens external link in new tab`}
        >
          {cardContent}
        </a>
      ) : hasValidLink ? (
        <Link
          href={cardHref}
          className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          data-project-card="interactive"
          aria-label={`View case study: ${project.title}`}
        >
          {cardContent}
        </Link>
      ) : (
        <div className="group block h-full" data-project-card="interactive">
          {cardContent}
        </div>
      )}
    </motion.article>
  );
});

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 4;

export function Works({ projects }: { projects: Project[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const isDesktop = useMediaQuery(mediaQueries.lg);

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  const panel = (
    // Figma 370:203: two fixed 576px (24U) card columns with a 72px (3U) gap,
    // inset 48px (2U) from the section's left edge — not a proportional
    // 11/24-span grid. Below lg it stays a plain single-column stack.
    <div className="grid grid-cols-1 gap-y-[calc(var(--grid-unit)*3)] pt-[var(--frame-tab-clearance)] lg:ml-[calc(var(--grid-unit)*2)] lg:[grid-template-columns:repeat(2,calc(var(--grid-unit)*24))] lg:gap-x-[calc(var(--grid-unit)*3)]">
      {visibleProjects.length === 0 && (
        <div className="flex min-h-[calc(var(--grid-unit)*16)] flex-col items-start justify-center gap-[var(--grid-unit)] border border-dashed border-[var(--figma-panel-border)] p-[calc(var(--grid-unit)*2)] lg:[grid-column:1/-1]">
          <span className="type-label">No projects yet</span>
          <p className="type-body-lg max-w-md text-secondary">
            New case studies are being prepared — check back soon.
          </p>
        </div>
      )}

      {visibleProjects.map((project, index) => (
        <div key={project.id} className="min-w-0">
          <ProjectCard project={project} index={index} />
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center lg:[grid-column:1/-1]">
          <Button
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, projects.length))
            }
            variant="secondary"
            className="min-h-12 min-w-[calc(var(--grid-unit)*7)]"
            aria-label={`Show ${Math.min(LOAD_MORE_COUNT, projects.length - visibleCount)} more projects`}
          >
            View More
          </Button>
        </div>
      )}
    </div>
  );

  if (!isDesktop) {
    return (
      <Section id="works" variant="canvas" inspectOnEnter>
        <SectionLayout sectionId="works">
          <div className="section-figma-stack col-span-full">
            <Reveal>
              <SectionHeading title="01 - Selected works" />
            </Reveal>
            <div className="section-figma-panel">{panel}</div>
          </div>
        </SectionLayout>
      </Section>
    );
  }

  return (
    <>
      {/* Reserves scroll room for the fixed hero — without this, Works covers the hero at scroll 0 */}
      <div className="h-screen" aria-hidden="true" />
      <Section id="works" variant="canvas" inspectOnEnter className="section--sticky-lock py-0">
        <SectionStickyShell
          sectionId="works"
          title="01 - Selected works"
          panelLabel="Selected works"
        >
          {panel}
        </SectionStickyShell>
      </Section>
    </>
  );
}
