'use client';

import type {
  Project,
  ProjectSection,
  ProjectSectionBlock,
} from '@/lib/mock-data';
import { getProjectBySlug } from '@/lib/mock-data';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { Footer } from './Footer';

const NAV_HEIGHT_PX = 80;

function DetailNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg md:text-xl font-bold text-foreground hover:text-foreground/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded no-underline transition-colors"
            aria-label="Zeina Nossier - Back to home"
          >
            <span className="text-foreground/60 mr-1" aria-hidden>
              ←
            </span>
            <span>Zeina Nossier</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8" role="list">
              <Link
                href="/#works"
                className="text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/10 rounded-full px-3 py-1.5 transition-colors"
              >
                Works
              </Link>
              <Link
                href="/#expertise"
                className="text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/10 rounded-full px-3 py-1.5 transition-colors"
              >
                Expertise
              </Link>
              <Link
                href="/#about"
                className="text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/10 rounded-full px-3 py-1.5 transition-colors"
              >
                About
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

const STICKY_SECTION_MIN_HEIGHT_PX = 320;

function StickySectionTitle({
  section,
  index,
}: {
  section: ProjectSection;
  index: number;
}) {
  const stickyTop = NAV_HEIGHT_PX + index * 10;
  return (
    <div
      style={{
        position: 'sticky',
        top: `${stickyTop}px`,
        zIndex: index + 1,
        minHeight: STICKY_SECTION_MIN_HEIGHT_PX,
      }}
      className="pt-6 first:pt-0 flex flex-col"
    >
      <div className="border-t border-border pt-4">
        <h2 className="text-sm font-medium text-foreground/80 uppercase tracking-wider">
          {section.title}
        </h2>
      </div>
    </div>
  );
}

function SectionBlocks({ blocks }: { blocks: ProjectSectionBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          return (
            <h3
              key={i}
              className="text-xl md:text-2xl font-bold text-foreground mt-8 first:mt-0"
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === 'paragraph') {
          return (
            <p
              key={i}
              className="text-foreground/80 leading-relaxed whitespace-pre-line"
            >
              {block.text}
            </p>
          );
        }
        if (block.type === 'image') {
          return (
            <div key={i} className="relative aspect-video w-full overflow-hidden rounded-lg bg-foreground/5">
              <Image
                src={block.src}
                alt={block.alt ?? ''}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 75vw"
              />
            </div>
          );
        }
        if (block.type === 'twoImages') {
          return (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-foreground/5">
                <Image
                  src={block.left.src}
                  alt={block.left.alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-foreground/5">
                <Image
                  src={block.right.src}
                  alt={block.right.alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export function ProjectDetailPage({ project }: { project: Project }) {
  const sections =
    project.sections && project.sections.length > 0
      ? project.sections
      : [
          {
            id: 'details',
            title: 'Project Details',
            content: project.description,
          } as ProjectSection,
        ];

  const nextWork = project.nextWorkSlug
    ? getProjectBySlug(project.nextWorkSlug)
    : null;

  return (
    <>
      <DetailNav />
      <main
        id="main-content"
        className="pt-20 min-h-screen bg-background"
        role="main"
      >
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Header: title + description (left), date + metadata (right) */}
          <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
            <div className="lg:col-span-7">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {project.title}
              </h1>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-6">
              {project.date && (
                <span className="text-xs font-medium text-foreground/60 bg-foreground/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {project.date}
                </span>
              )}
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                {project.client && (
                  <div>
                    <span className="text-foreground/50 uppercase tracking-wider block mb-1">
                      Client
                    </span>
                    <span className="text-foreground font-medium">
                      {project.client}
                    </span>
                  </div>
                )}
                {project.role && (
                  <div>
                    <span className="text-foreground/50 uppercase tracking-wider block mb-1">
                      Role
                    </span>
                    <span className="text-foreground font-medium">
                      {project.role}
                    </span>
                  </div>
                )}
                {project.service && (
                  <div>
                    <span className="text-foreground/50 uppercase tracking-wider block mb-1">
                      Service
                    </span>
                    <span className="text-foreground font-medium">
                      {project.service}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Cover image */}
          {project.coverImage && (
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-foreground/5 mb-12">
              <Image
                src={project.coverImage}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          )}

          {/* Divider between cover and first section */}
          <div className="border-t border-border mb-12 lg:mb-16" />

          {/* Two-column: sticky section titles (left) + section content (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-3 min-h-full">
              <div className="min-h-full space-y-0">
                {sections.map((section, index) => (
                  <StickySectionTitle
                    key={section.id}
                    section={section}
                    index={index}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-9 space-y-16 md:space-y-20">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`section-${section.id}`}
                  className="scroll-mt-28"
                >
                  <h2
                    id={`section-${section.id}`}
                    className="text-xl md:text-2xl font-bold text-foreground mb-6"
                  >
                    {section.title}
                  </h2>
                  {section.blocks && section.blocks.length > 0 ? (
                    <SectionBlocks blocks={section.blocks} />
                  ) : (
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                      {section.content ?? project.description}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>

          {/* Divider before Next work */}
          <div className="border-t border-border my-16 lg:my-20" />

          {/* Next work / Browse more */}
          <section className="mb-16 lg:mb-20">
            <p className="text-xs font-medium text-foreground/50 uppercase tracking-widest mb-6">
              Next work
            </p>
            {nextWork ? (
              <Link
                href={`/works/${nextWork.id}`}
                className="group block p-6 md:p-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors border border-border/50"
              >
                <span className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-foreground/90">
                  {nextWork.title}
                </span>
                <p className="mt-2 text-foreground/70">
                  {nextWork.description}
                </p>
                <span className="inline-block mt-4 text-sm font-medium text-foreground/80 group-hover:underline">
                  View project →
                </span>
              </Link>
            ) : null}
            <div className="mt-8">
              <Link
                href="/#works"
                className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Explore all works
              </Link>
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
