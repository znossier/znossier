'use client';

import { ProjectCardLinkLabel } from '@/components/ProjectCardLinkLabel';
import { Button } from '@/components/Button';
import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import { SectionLayout } from '@/components/SectionLayout';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { gridSpans } from '@/lib/grid-spans';
import { getProjectHref, type Project } from '@/lib/projects';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { SpacingGuide } from '@/components/SpacingGuide';
import { memo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { EASE_PRECISION, MOTION, REVEAL_VIEWPORT, transitionHover } from '@/lib/motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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

  const cardContent = (
    <WorkspaceFrame
      inspectMode="hover"
      showSpacing
      showPadding
      panelClassName="relative flex h-full w-full min-h-[25rem] flex-col px-4 py-4 sm:min-h-[29rem] md:min-h-[32rem] md:px-5 md:py-5"
      className="relative h-full w-full"
    >
      {imageAvailable && (
        <div className="project-preview-frame relative aspect-[4/3] border border-subtle">
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
            className="project-preview-overlay pointer-events-none absolute inset-0 flex items-end p-4 sm:p-5"
            aria-hidden="true"
          >
            <p className="project-preview-copy type-body-lg line-clamp-4 max-w-[28rem] sm:line-clamp-none">
              {project.description}
            </p>
          </motion.div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-x-4">
          <h3 className="project-card-title type-title min-w-0 flex-1">{project.title}</h3>
          {hasValidLink && <ProjectCardLinkLabel variant={linkVariant} />}
        </div>
        <p className="type-label min-w-0">{categoriesLabel}</p>
      </div>

      {!imageAvailable && project.description && (
        <p className="type-body mt-5 line-clamp-5">{project.description}</p>
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

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <>
      <div className="hidden h-screen lg:block" aria-hidden="true" />
      <Section id="works" variant="subtle">
        <SectionLayout boundaries={HOME_SECTION_BOUNDARIES.works}>
          <SpacingGuide
            showGaps
            showGutters
            showLabels
            sectionBoundaries={HOME_SECTION_BOUNDARIES.works}
            className="site-section-grid auto-rows-fr"
          >
            <Reveal flashGuides className={gridSpans.works.heading}>
              <SectionHeading kicker="01 — Projects" surfaceClassName="section-heading-sticky">
                Selected Works
              </SectionHeading>
            </Reveal>

            {visibleProjects.map((project, index) => (
              <div
                key={project.id}
                className={index % 2 === 0 ? gridSpans.works.cardLeft : gridSpans.works.cardRight}
              >
                <ProjectCard project={project} index={index} />
              </div>
            ))}

            {hasMore && (
              <div className={gridSpans.works.loadMore}>
                <Button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, projects.length))}
                  variant="secondary"
                  inspectable
                  className="w-full"
                  aria-label={`Show ${Math.min(LOAD_MORE_COUNT, projects.length - visibleCount)} more projects`}
                >
                  Show More
                </Button>
              </div>
            )}
          </SpacingGuide>
        </SectionLayout>
      </Section>
    </>
  );
}
