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
import { EASE_PRECISION, MOTION, REVEAL_VIEWPORT, transitionHover } from '@/lib/motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { mediaQueries } from '@/lib/breakpoints';
import { cn } from '@/lib/utils';

const ProjectCard = memo(function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, REVEAL_VIEWPORT);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const supportsHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = useReducedMotion();

  const href = getProjectHref(project);
  const cardHref = href || '#';
  const isExternalLink = project.linkMode === 'external' && !!project.externalUrl;
  const hasValidLink = !!href;
  const linkVariant = isExternalLink ? 'external' : 'case-study';
  const previewImage = project.coverImage ?? project.image;
  const imageAvailable = !!previewImage && !imageError;
  const categoriesLabel = project.categories.join(' / ');
  const showPreviewCopy = isHovered || !supportsHover;
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
      {imageAvailable && (
        <div className="project-preview-frame relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={
                reducedMotion
                  ? { scale: 1, filter: 'blur(0px)' }
                  : {
                      scale: showPreviewCopy ? 1.01 : 1,
                      filter: showPreviewCopy && supportsHover ? 'blur(3px)' : 'blur(0px)',
                    }
              }
              transition={transitionHover}
            >
              <Image
                src={previewImage}
                alt={`${project.title} project preview`}
                fill
                className="object-cover project-cover-image"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            </motion.div>
          </div>

          <motion.div
            initial={false}
            animate={
              reducedMotion
                ? { opacity: showPreviewCopy ? 1 : 0, y: 0 }
                : {
                    opacity: showPreviewCopy ? 1 : 0,
                    y: showPreviewCopy ? 0 : 8,
                  }
            }
            transition={transitionHover}
            className="project-preview-overlay pointer-events-none absolute inset-0 z-10 flex items-end p-[var(--grid-unit)]"
            aria-hidden="true"
          >
            <p className="project-preview-copy type-body-lg line-clamp-4 max-w-[28rem] sm:line-clamp-none">
              {project.description}
            </p>
          </motion.div>
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
    <div className="grid grid-cols-1 gap-[calc(var(--grid-unit)*3)] pt-[var(--frame-tab-offset)] lg:grid-cols-2">
      {visibleProjects.length === 0 && (
        <div className="flex min-h-[calc(var(--grid-unit)*16)] flex-col items-start justify-center gap-[var(--grid-unit)] border border-dashed border-[var(--figma-panel-border)] p-[calc(var(--grid-unit)*2)] lg:col-span-2">
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
        <div className={cn('flex justify-center lg:col-span-2')}>
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
          scrollable
          panelLabel="Selected works"
        >
          {panel}
        </SectionStickyShell>
      </Section>
    </>
  );
}
