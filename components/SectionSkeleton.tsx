import { Section } from '@/components/Section';
import { cn } from '@/lib/utils';

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('skeleton-block', className)} aria-hidden />;
}

function SkeletonHeading({ className }: { className?: string }) {
  return (
    <div className={cn('mb-8 flex items-center gap-4 lg:mb-10', className)}>
      <SkeletonBlock className="h-6 w-40 sm:h-7 sm:w-52" />
    </div>
  );
}

export function WorksSkeleton() {
  return (
    <Section id="works-skeleton" variant="canvas" aria-hidden>
      <div className="site-shell">
        <SkeletonHeading />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-[26rem] w-full sm:h-[30rem] md:h-[34rem]" />
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ServicesSkeleton() {
  return (
    <Section id="expertise-skeleton" variant="canvas" aria-hidden>
      <div className="site-shell">
        <SkeletonHeading />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-[220px] w-full md:h-[320px]" />
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ProcessSkeleton() {
  return (
    <Section id="process-skeleton" variant="canvas" aria-hidden>
      <div className="site-shell">
        <SkeletonHeading />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-[420px] w-[17rem] flex-shrink-0 sm:w-[22rem]" />
          ))}
        </div>
      </div>
    </Section>
  );
}

export function TechStackSkeleton() {
  return (
    <Section id="tech-stack-skeleton" variant="canvas" aria-hidden>
      <div className="site-shell">
        <SkeletonHeading />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-20 w-20 flex-shrink-0 sm:h-24 sm:w-24 md:h-28 md:w-28" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function AboutSkeleton() {
  return (
    <Section id="about-skeleton" variant="canvas" aria-hidden>
      <div className="site-shell">
        <SkeletonHeading />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-3">
            <SkeletonBlock className="h-36 w-36 rounded-full" />
            <SkeletonBlock className="h-5 w-2/3" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function FooterSkeleton() {
  return (
    <footer className="section section--footer" aria-hidden>
      <div className="site-shell">
        <div className="footer-figma site-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="footer-figma-cell col-span-full lg:[grid-column:span_8]">
              <SkeletonBlock className="h-[var(--grid-unit)] w-24" />
              <SkeletonBlock className="h-[var(--grid-unit)] w-32" />
              <SkeletonBlock className="h-[var(--grid-unit)] w-28" />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
