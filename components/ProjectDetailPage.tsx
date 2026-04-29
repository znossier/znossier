'use client';

import type {
  Project,
  ProjectSection,
  ProjectSectionBlock,
} from '@/lib/projects';
import type { ContactContent } from '@/lib/site-content';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Footer } from './Footer';
import { useEffect, useState } from 'react';

const STICKY_TOP = 'calc(var(--chrome-top) + 1rem)';
const PAGE_TOP_PADDING = 'calc(var(--chrome-top) + 2rem)';
const SECTION_SCROLL_MARGIN = 'calc(var(--chrome-top) + 2.5rem)';
const REVEAL_EASE = [0.44, 0, 0.56, 1] as const;

type RevealDirection = 'up' | 'left' | 'right';

function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [disableReveal, setDisableReveal] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setDisableReveal(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  if (shouldReduceMotion || disableReveal) {
    return <div className={className}>{children}</div>;
  }

  const initial =
    direction === 'left'
        ? { opacity: 0.001, x: -20, y: 0 }
        : direction === 'right'
          ? { opacity: 0.001, x: 20, y: 0 }
          : { opacity: 0.001, x: 0, y: 24 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -10% 0px' }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        delay,
        ease: REVEAL_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DetailNav() {
  return (
    <nav
      aria-label="Project navigation"
      className="fixed inset-x-0 top-[var(--ribbon-height)] z-50 border-b border-border/60 bg-background/90 backdrop-blur-[8px]"
      style={{ height: 'var(--detail-nav-height)' }}
    >
      <div className="site-shell h-full">
        <div className="site-grid h-full items-center">
          <Link
            href="/"
            className="[grid-column:1/span_3] inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground/72 transition-colors hover:text-link sm:[grid-column:1/span_2] sm:text-sm sm:tracking-[0.18em] lg:[grid-column:1/span_2]"
            aria-label="Back to home"
          >
            <span aria-hidden>/</span>
            <span>Home</span>
          </Link>

          <div className="hidden items-center justify-center gap-6 md:flex md:[grid-column:3/span_4] lg:[grid-column:9/span_8] lg:gap-8">
            <Link
              href="/#works"
              className="editorial-kicker text-foreground/58 transition-colors hover:text-link"
            >
              Works
            </Link>
            <Link
              href="/#expertise"
              className="editorial-kicker text-foreground/58 transition-colors hover:text-link"
            >
              Expertise
            </Link>
            <Link
              href="/#about"
              className="editorial-kicker text-foreground/58 transition-colors hover:text-link"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MetaItem({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <div className="min-w-0">
      <p className="editorial-kicker text-foreground/46">
        {label}
      </p>
      <p className="mt-1 break-words text-sm leading-relaxed tracking-[-0.03em] text-foreground md:text-base lg:text-right">
        {value}
      </p>
    </div>
  );
}

function DetailSectionHeading({ title }: { title: string }) {
  return (
    <div
      className="self-start lg:sticky"
      style={{ top: STICKY_TOP }}
    >
      <div className="relative flex min-w-0 items-center gap-4 overflow-hidden md:gap-5">
        <div className="absolute inset-x-0 inset-y-[-0.55rem] z-0 bg-background md:inset-y-[-0.65rem]" aria-hidden />
        <div className="relative z-10 shrink-0">
          <div className="absolute -inset-x-4 inset-y-[-0.55rem] bg-background md:-inset-x-5 md:inset-y-[-0.65rem]" aria-hidden />
          <div className="relative flex items-center gap-4 pe-4 md:gap-5 md:pe-5">
            <span className="shrink-0 font-mono text-[1.05rem] font-bold leading-none text-foreground/78 md:text-[1.15rem]" aria-hidden>
              /
            </span>
            <h2 className="editorial-kicker shrink-0 text-foreground/58">
              {title}
            </h2>
          </div>
        </div>
        <div className="editorial-rule relative z-10 min-w-0 flex-1" aria-hidden />
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="site-shell">
      <div className="editorial-rule w-full" />
    </div>
  );
}

function SectionBlocks({
  blocks,
  projectTitle,
}: {
  blocks: ProjectSectionBlock[];
  projectTitle: string;
}) {
  return (
    <div className="grid w-full grid-cols-6 gap-y-8 md:grid-cols-8 lg:flex lg:flex-col lg:gap-8">
      {blocks.map((block, index) => {
        const blockKey =
          block.type === 'heading' || block.type === 'paragraph'
            ? `${block.type}-${index}-${block.text?.slice(0, 30) ?? ''}`
            : block.type === 'image'
              ? `image-${index}-${block.src}`
              : `twoImages-${index}-${block.left.src}-${block.right.src}`;

        if (block.type === 'heading') {
          return (
            <h3
              key={blockKey}
              className="[grid-column:1/span_5] font-mono text-[1.25rem] font-bold uppercase leading-[1] tracking-[-0.035em] text-foreground md:[grid-column:1/span_6] md:text-[1.65rem]"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <p
              key={blockKey}
              className="[grid-column:2/span_5] max-w-[52rem] whitespace-pre-line text-sm leading-relaxed tracking-[-0.03em] text-foreground/70 md:[grid-column:2/span_7] md:text-base"
            >
              {block.text}
            </p>
          );
        }

        if (block.type === 'image') {
          return (
            <div
              key={blockKey}
              className="grid-edge-frame relative aspect-[1.52222/1] w-full overflow-hidden border border-border/85 bg-foreground/5 [grid-column:1/span_6] md:col-span-full"
            >
              <Image
                src={block.src}
                alt={block.alt ?? `${projectTitle} project image`}
                fill
                className="object-cover"
                sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), 71vw"
              />
            </div>
          );
        }

        return (
          <div
            key={blockKey}
            className="grid grid-cols-1 gap-4 [grid-column:1/span_6] md:col-span-full md:grid-cols-2 lg:[grid-template-columns:repeat(17,minmax(0,1fr))] lg:gap-x-0"
          >
            <div className="grid-edge-frame relative aspect-[1.52222/1] w-full overflow-hidden border border-border/85 bg-foreground/5 lg:[grid-column:1/span_8]">
              <Image
                src={block.left.src}
                alt={block.left.alt ?? `${projectTitle} project image`}
                fill
                className="object-cover"
                sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 48px) / 2), 35vw"
              />
            </div>
            <div className="grid-edge-frame relative aspect-[1.52222/1] w-full overflow-hidden border border-border/85 bg-foreground/5 lg:[grid-column:10/span_8]">
              <Image
                src={block.right.src}
                alt={block.right.alt ?? `${projectTitle} project image`}
                fill
                className="object-cover"
                sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 48px) / 2), 35vw"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProjectDetailPage({
  project,
  contact,
}: {
  project: Project;
  contact: ContactContent;
}) {
  const sections: ProjectSection[] =
    project.sections && project.sections.length > 0
      ? project.sections
      : [
          {
            id: 'project-details',
            title: 'Project Details',
            content: project.description,
          },
        ];

  const nextWork = project.nextWork?.published ? project.nextWork : null;
  const nextWorkImage = nextWork?.coverImage ?? nextWork?.image;

  return (
    <>
      <DetailNav />

      <main
        id="main-content"
        role="main"
        className="min-h-screen bg-background text-foreground"
        style={{ paddingTop: PAGE_TOP_PADDING }}
      >
        <section className="w-full">
          <div className="site-shell pb-14 md:pb-24">
            <div className="site-grid gap-y-8 md:gap-y-10">
              <Reveal className="[grid-column:1/span_6] lg:[grid-column:1/span_15]" direction="left">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <h1 className="text-[clamp(2.25rem,12vw,4.25rem)] font-semibold leading-[0.96] tracking-[-0.052em] text-foreground md:text-[clamp(2.75rem,7vw,4.25rem)]">
                      {project.title}
                    </h1>
                    <div className="max-w-[52rem] space-y-4">
                      <p className="text-sm leading-relaxed tracking-[-0.03em] text-foreground/70 md:text-base">
                        {project.description}
                      </p>
                      {project.date ? (
                        <span className="editorial-kicker inline-flex w-fit border border-border/85 px-3 py-2 text-foreground/58">
                          {project.date}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal
                className="[grid-column:2/span_5] grid grid-cols-2 gap-4 rounded-none border-y border-border/75 py-4 sm:[grid-column:2/span_6] lg:[grid-column:17/span_8] lg:grid-cols-1 lg:justify-items-end lg:border-0 lg:py-0"
                direction="right"
                delay={0.1}
              >
                <MetaItem label="Client" value={project.client} />
                <MetaItem label="Role" value={project.role} />
                <MetaItem label="Service" value={project.service} />
              </Reveal>

              {project.coverImage ? (
                <Reveal className="[grid-column:1/span_6] sm:col-span-full lg:[grid-column:1/span_24]" delay={0.15}>
                  <div className="grid-edge-frame relative h-[15rem] w-full overflow-hidden border border-border/85 bg-foreground/5 sm:h-[24rem] lg:h-[37.5rem]">
                    <Image
                      src={project.coverImage}
                      alt={`${project.title} cover image`}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), min(100vw - 64px, 88rem)"
                    />
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>

        <Divider />

        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`section-${section.id}`}
            className="w-full"
            style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }}
          >
            <div className="site-shell py-12 md:py-20">
              <div className="site-grid gap-y-8 lg:gap-y-0">
                <div className="[grid-column:1/span_5] sm:[grid-column:1/span_6] lg:[grid-column:1/span_6]">
                  <DetailSectionHeading title={section.title} />
                </div>

                <Reveal
                  className="[grid-column:1/span_6] flex flex-col gap-6 md:gap-8 sm:col-span-full lg:[grid-column:8/span_17]"
                  delay={index * 0.05}
                >
                  <div className="sr-only">
                    <h2 id={`section-${section.id}`}>{section.title}</h2>
                  </div>

                  {section.blocks && section.blocks.length > 0 ? (
                    <SectionBlocks
                      blocks={section.blocks}
                      projectTitle={project.title}
                    />
                  ) : (
                    <div className="grid grid-cols-6 md:grid-cols-8 lg:block">
                      <p className="[grid-column:2/span_5] max-w-[52rem] whitespace-pre-line text-sm leading-relaxed tracking-[-0.03em] text-foreground/70 md:[grid-column:2/span_7] md:text-base">
                        {section.content ?? project.description}
                      </p>
                    </div>
                  )}
                </Reveal>
              </div>
            </div>

            {index < sections.length - 1 ? <Divider /> : null}
          </section>
        ))}

        <Divider />

        <section className="w-full">
          <div className="site-shell py-12 md:py-20">
            {nextWork ? (
              <Link href={`/works/${nextWork.slug}`} className="group block">
                <div className="site-grid items-center gap-y-8">
                  <Reveal className="[grid-column:1/span_6] sm:col-span-full lg:[grid-column:1/span_10]">
                    <div className="grid-edge-frame relative aspect-[1.42857/1] w-full overflow-hidden border border-border/85 bg-foreground/5">
                      {nextWorkImage ? (
                        <Image
                          src={nextWorkImage}
                          alt={`${nextWork.title} preview`}
                          fill
                          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
                          sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), 38vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-foreground/5 text-5xl">
                          {nextWork.emoji}
                        </div>
                      )}
                    </div>
                  </Reveal>

                  <Reveal
                    className="[grid-column:2/span_5] flex min-w-0 flex-col gap-4 sm:[grid-column:2/span_7] lg:[grid-column:13/span_12]"
                    delay={0.08}
                  >
                    <span className="editorial-kicker inline-flex w-fit border border-border/85 px-3 py-2 text-foreground/58">
                      Next work
                    </span>
                    <h2 className="text-[clamp(2.1rem,4.4vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-foreground transition-opacity duration-300 group-hover:opacity-80">
                      {nextWork.title}
                    </h2>
                    <p className="max-w-[44rem] text-sm leading-relaxed tracking-[-0.03em] text-foreground/70 md:text-base">
                      {nextWork.description}
                    </p>
                  </Reveal>
                </div>
              </Link>
            ) : (
              <Reveal className="site-grid gap-y-4">
                <div className="[grid-column:2/span_5] sm:[grid-column:2/span_7] lg:[grid-column:13/span_12]">
                  <span className="editorial-kicker inline-flex w-fit border border-border/85 px-3 py-2 text-foreground/58">
                    Browse more
                  </span>
                  <div className="mt-4">
                    <Link
                      href="/#works"
                      className="text-[clamp(2rem,4vw,2.5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-foreground transition-opacity hover:opacity-80"
                    >
                      Explore all works
                    </Link>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        <Footer contact={contact} />
      </main>
    </>
  );
}
