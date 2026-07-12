'use client';

import type {
  Project,
  ProjectSection,
  ProjectSectionBlock,
} from '@/lib/projects';
import type { ContactContent } from '@/lib/site-content';
import { navigationItems } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from './Footer';
import { Reveal } from './Reveal';
import { SectionGridLines } from './SectionGridLines';
import { SectionHeading } from './SectionHeading';
import { WorkspaceFrame } from './WorkspaceFrame';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { cn } from '@/lib/utils';

const STICKY_TOP = 'calc(var(--chrome-top) + 1rem)';
const PAGE_TOP_PADDING = 'calc(var(--chrome-top) + 2rem)';
const SECTION_SCROLL_MARGIN = 'calc(var(--chrome-top) + 2.5rem)';

const detailNavLinkClass =
  'type-label inline-flex min-h-11 items-center py-2 text-muted transition-colors duration-200 hover:text-link focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function DetailNav() {
  return (
    <nav
      aria-label="Project navigation"
      className="detail-nav-shell fixed inset-x-0 top-[var(--ribbon-height)] z-50"
      style={{ height: 'var(--detail-nav-height)' }}
    >
      <div className="site-shell h-full">
        <div className="site-grid h-full items-center">
          <Link
            href="/"
            className="type-label col-span-full inline-flex min-h-11 items-center gap-2 text-secondary transition-colors hover:text-link focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:col-span-2 lg:[grid-column:1/span_2]"
            aria-label="Back to home"
          >
            <span>Home</span>
          </Link>

          <div className="hidden items-center justify-center gap-5 lg:flex lg:[grid-column:9/span_8] lg:gap-6">
            {navigationItems.map((item) => (
              <Link key={item.href} href={`/${item.href}`} className={detailNavLinkClass}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileSectionNav({ sections }: { sections: ProjectSection[] }) {
  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Project sections"
      className="sticky top-[var(--chrome-top)] z-40 border-b border-subtle bg-canvas/95 backdrop-blur-sm lg:hidden"
    >
      <div className="site-shell overflow-x-auto">
        <ul className="flex gap-2 py-2">
          {sections.map((section) => (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                className="type-label flat-control inline-flex min-h-11 items-center px-3 py-2 text-secondary transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
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
      <p className="type-meta text-faint">{label}</p>
      <p className="type-body mt-1 break-words lg:text-right">{value}</p>
    </div>
  );
}

function DetailSectionHeading({ title }: { title: string }) {
  return (
    <div className="self-start lg:sticky" style={{ top: STICKY_TOP }}>
      <SectionHeading surfaceClassName="section-heading-sticky bg-canvas">{title}</SectionHeading>
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

function ProjectMediaFrame({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <WorkspaceFrame
      inspectMode="hover"
      frameLabel={label}
      panelClassName={cn(
        'grid-edge-frame media-placeholder-bg relative w-full overflow-hidden p-0',
        className
      )}
    >
      {children}
    </WorkspaceFrame>
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
    <div className="flex w-full flex-col gap-8">
      {blocks.map((block, index) => {
        const blockKey =
          block.type === 'heading' || block.type === 'paragraph'
            ? `${block.type}-${index}-${block.text?.slice(0, 30) ?? ''}`
            : block.type === 'image'
              ? `image-${index}-${block.src}`
              : `twoImages-${index}-${block.left.src}-${block.right.src}`;

        if (block.type === 'heading') {
          return (
            <h3 key={blockKey} className="type-title">
              {block.text}
            </h3>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <p
              key={blockKey}
              className="type-body-lg max-w-[52rem] whitespace-pre-line lg:pl-[calc(var(--site-grid-col-width)*1)]"
            >
              {block.text}
            </p>
          );
        }

        if (block.type === 'image') {
          return (
            <ProjectMediaFrame
              key={blockKey}
              label="media / image"
              className="aspect-[1.52222/1] w-full"
            >
              <Image
                src={block.src}
                alt={block.alt ?? `${projectTitle} project image`}
                fill
                className="object-cover project-cover-image"
                sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), 71vw"
              />
            </ProjectMediaFrame>
          );
        }

        return (
          <div
            key={blockKey}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-x-8"
          >
            <ProjectMediaFrame label="media / left" className="aspect-[1.52222/1] w-full">
              <Image
                src={block.left.src}
                alt={block.left.alt ?? `${projectTitle} project image`}
                fill
                className="object-cover project-cover-image"
                sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 48px) / 2), 35vw"
              />
            </ProjectMediaFrame>
            <ProjectMediaFrame label="media / right" className="aspect-[1.52222/1] w-full">
              <Image
                src={block.right.src}
                alt={block.right.alt ?? `${projectTitle} project image`}
                fill
                className="object-cover project-cover-image"
                sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 48px) / 2), 35vw"
              />
            </ProjectMediaFrame>
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
      <MobileSectionNav sections={sections} />

      <main
        id="main-content"
        role="main"
        className="section section--canvas relative min-h-screen text-primary"
        style={{ paddingTop: PAGE_TOP_PADDING }}
      >
        <SectionGridLines boundaries={HOME_SECTION_BOUNDARIES.detail} />
        <section className="relative z-10 w-full">
          <div className="site-shell pb-14 md:pb-24">
            <div className="site-grid gap-y-8 md:gap-y-10">
              <Reveal className="col-span-full lg:[grid-column:1/span_15]" direction="left">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <h1 className="type-display max-w-none">{project.title}</h1>
                    <div className="max-w-[52rem] space-y-4">
                      <p className="type-body-lg">{project.description}</p>
                      {project.date ? (
                        <span className="type-meta-badge type-meta text-muted">{project.date}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal
                className="col-span-full grid grid-cols-2 gap-4 rounded-none border-y border-subtle py-4 lg:[grid-column:17/span_8] lg:grid-cols-1 lg:justify-items-end lg:border-0 lg:py-0"
                direction="right"
                delay={0.1}
              >
                <MetaItem label="Client" value={project.client} />
                <MetaItem label="Role" value={project.role} />
                <MetaItem label="Service" value={project.service} />
              </Reveal>

              {project.coverImage ? (
                <Reveal className="col-span-full lg:[grid-column:1/span_24]" delay={0.15}>
                  <ProjectMediaFrame
                    label="project / cover"
                    className="h-[15rem] sm:h-[24rem] lg:h-[37.5rem]"
                  >
                    <Image
                      src={project.coverImage}
                      alt={`${project.title} cover image`}
                      fill
                      priority
                      className="object-cover project-cover-image"
                      sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), min(100vw - 64px, 88rem)"
                    />
                  </ProjectMediaFrame>
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
            className="section section--canvas relative z-10 w-full"
            style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }}
          >
            <div className="site-shell py-12 md:py-20">
              <div className="site-grid gap-y-8 lg:gap-y-0">
                <div className="col-span-full lg:[grid-column:1/span_6]">
                  <DetailSectionHeading title={section.title} />
                </div>

                <Reveal
                  className="col-span-full flex flex-col gap-6 md:gap-8 lg:[grid-column:8/span_17]"
                  delay={index * 0.05}
                >
                  <div className="sr-only">
                    <h2 id={`section-${section.id}`}>{section.title}</h2>
                  </div>

                  {section.blocks && section.blocks.length > 0 ? (
                    <SectionBlocks blocks={section.blocks} projectTitle={project.title} />
                  ) : (
                    <p className="type-body-lg max-w-[52rem] whitespace-pre-line lg:pl-[calc(var(--site-grid-col-width)*1)]">
                      {section.content ?? project.description}
                    </p>
                  )}
                </Reveal>
              </div>
            </div>

            {index < sections.length - 1 ? <Divider /> : null}
          </section>
        ))}

        <Divider />

        <section className="section section--canvas relative z-10 w-full">
          <div className="site-shell py-12 md:py-20">
            {nextWork ? (
              <Link href={`/works/${nextWork.slug}`} className="group block">
                <div className="site-grid items-center gap-y-8">
                  <Reveal className="col-span-full lg:[grid-column:1/span_10]">
                    <ProjectMediaFrame label="project / next" className="aspect-[1.42857/1]">
                      {nextWorkImage ? (
                        <Image
                          src={nextWorkImage}
                          alt={`${nextWork.title} preview`}
                          fill
                          className="object-cover project-cover-image transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
                          sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), 38vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl">
                          {nextWork.emoji}
                        </div>
                      )}
                    </ProjectMediaFrame>
                  </Reveal>

                  <Reveal
                    className="col-span-full flex min-w-0 flex-col gap-4 lg:[grid-column:13/span_12]"
                    delay={0.08}
                  >
                    <span className="type-meta-badge type-meta text-muted">Next work</span>
                    <h2 className="type-title transition-opacity duration-300 group-hover:opacity-80">
                      {nextWork.title}
                    </h2>
                    <p className="type-body-lg max-w-[44rem]">{nextWork.description}</p>
                  </Reveal>
                </div>
              </Link>
            ) : (
              <Reveal className="site-grid gap-y-4">
                <div className="col-span-full lg:[grid-column:13/span_12]">
                  <span className="type-meta-badge type-meta text-muted">Browse more</span>
                  <div className="mt-4">
                    <Link
                      href="/#works"
                      className={cn('type-title inline-block transition-opacity hover:opacity-80')}
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
