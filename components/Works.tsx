'use client';

import { Button } from '@/components/Button';
import { FrameCorners } from '@/components/FrameCorners';
import { SectionGridLines } from '@/components/SectionGridLines';
import { SectionHeading } from '@/components/SectionHeading';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { getProjectHref, type Project } from '@/lib/projects';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { memo, useRef, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ProjectCard = memo(function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px', amount: 0.18 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const supportsHover = useMediaQuery('(hover: hover) and (pointer: fine)');

  const href = getProjectHref(project);
  const cardHref = href || '#';
  const isExternalLink = project.linkMode === 'external' && !!project.externalUrl;
  const hasValidLink = !!href;
  const linkLabel = isExternalLink ? 'External Link' : 'Case Study';
  const previewImage = project.coverImage ?? project.image;
  const imageAvailable = !!previewImage && !imageError;
  const categoriesLabel = project.categories.join(' / ');
  const showPreviewCopy = isHovered || !supportsHover;

  const cardContent = (
    <div className="relative h-full w-full">
      <FrameCorners className="project-card-corners text-foreground/70" placement="outside" />
      <div className="editorial-panel surface-raised relative flex h-full w-full min-h-[27rem] flex-col overflow-visible px-4 py-4 dark:bg-background sm:min-h-[29rem] md:min-h-[32rem] md:px-5 md:py-5">
        {imageAvailable && (
          <div className="project-preview-frame relative aspect-[4/3] border border-border/90">

            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: showPreviewCopy ? 1.015 : 1,
                  filter: showPreviewCopy && supportsHover ? 'blur(5px)' : 'blur(0px)',
                }}
                transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Image
                  src={previewImage}
                  alt={`${project.title} project preview`}
                  fill
                  className="object-cover [filter:contrast(1.03)_brightness(1.01)] dark:[filter:contrast(1.01)_brightness(0.99)]"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              </motion.div>
            </div>

            <motion.div
              initial={false}
              animate={{
                opacity: showPreviewCopy ? 1 : 0,
                y: showPreviewCopy ? 0 : 10,
              }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="project-preview-overlay pointer-events-none absolute inset-0 flex items-end p-4 sm:p-5"
              aria-hidden="true"
            >
              <p className="project-preview-copy line-clamp-4 max-w-[28rem] text-sm leading-relaxed sm:line-clamp-none sm:text-[0.95rem]">
                {project.description}
              </p>
            </motion.div>
          </div>
        )}

        <div className="mt-4 grid min-h-[4.75rem] grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3">
          <div className="min-w-0">
            <h3 className="project-card-title text-[1.24rem] font-semibold leading-[0.98] tracking-[-0.04em] text-foreground sm:text-[1.42rem]">
              {project.title}
            </h3>
            <p className="editorial-kicker mt-2 text-foreground/58">{categoriesLabel}</p>
          </div>

          {hasValidLink && (
            <span className="project-card-open editorial-kicker mt-1 shrink-0 justify-self-end whitespace-nowrap text-right text-foreground/56">
              {linkLabel}
            </span>
          )}
        </div>

        {!imageAvailable && project.description && (
          <p className="mt-5 line-clamp-5 text-sm leading-relaxed text-foreground/72">
            {project.description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 0.48, delay: index * 0.06 }}
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
          aria-label={`View project: ${project.title}`}
        >
          {cardContent}
        </a>
      ) : hasValidLink ? (
        <Link
          href={cardHref}
          className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          data-project-card="interactive"
          aria-label={`View project: ${project.title}`}
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
      <section
        id="works"
        className="relative z-20 border-t border-border/90 bg-section-accent py-[var(--mobile-section-padding)] md:py-20 lg:py-24 dark:bg-background"
      >
        <SectionGridLines boundaries={HOME_SECTION_BOUNDARIES.works} />
        <div className="relative z-10 mx-auto w-full max-w-[var(--site-max-width)] px-[var(--site-padding-inline)] lg:px-0">
          <div className="site-section-grid">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45 }}
              className="[grid-column:1/span_5] lg:col-span-full"
            >
              <SectionHeading surfaceClassName="bg-section-accent dark:bg-background">Selected Works</SectionHeading>
            </motion.div>
          </div>

          <div className="site-grid mt-10 auto-rows-fr gap-y-10 md:mt-14 md:gap-y-12">
            {visibleProjects.map((project, index) => (
              <div
                key={project.id}
                className={index % 2 === 0 ? '[grid-column:1/span_6] lg:[grid-column:1/span_11]' : '[grid-column:2/span_5] lg:[grid-column:14/span_11]'}
              >
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="site-grid mt-12 md:mt-14">
              <div className="[grid-column:2/span_4] lg:[grid-column:12/span_2]">
                <Button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, projects.length))}
                  variant="secondary"
                  className="surface-raised w-full shadow-[0_16px_30px_rgba(17,17,17,0.08)] dark:bg-section-accent dark:shadow-[0_12px_26px_rgba(0,0,0,0.22)]"
                  aria-label={`Show ${Math.min(LOAD_MORE_COUNT, projects.length - visibleCount)} more projects`}
                >
                  Show More
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
