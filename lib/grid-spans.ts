/**
 * Tailwind grid-column classes for home sections — literal strings so the JIT
 * scanner can see them. Must stay aligned with HOME_LAYOUTS in lib/grid-layout.ts
 * (enforced by `npm run validate:grid`).
 */
export const gridSpans = {
  hero: {
    copy: 'col-span-full sm:[grid-column:1/span_4] lg:[grid-column:1/span_8]',
    portrait: 'col-span-full lg:[grid-column:11/span_14] w-full min-w-0',
    scrollHint:
      'col-span-full lg:[grid-column:1/span_8] lg:row-start-2 scroll-hint type-meta hidden lg:inline-flex items-center justify-start gap-2 self-end text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
  },
  works: {
    heading: 'col-span-full',
    cardLeft: 'col-span-full lg:[grid-column:1/span_11]',
    cardRight: 'col-span-full lg:[grid-column:14/span_11]',
    loadMore: 'col-span-full lg:[grid-column:12/span_2]',
  },
  expertise: {
    heading: 'col-span-full lg:[grid-column:1/span_24]',
    cards: 'col-span-full lg:[grid-column:1/span_24]',
  },
  about: {
    intro: 'col-span-full lg:[grid-column:1/span_11]',
    experience: 'col-span-full lg:[grid-column:14/span_11]',
  },
  footer: {
    utilitySpacerLeft: 'col-span-full lg:[grid-column:1/span_8] lg:row-start-1',
    utilitySpacerRight: 'col-span-full lg:[grid-column:9/span_8] lg:row-start-1',
    utility: 'col-span-full lg:[grid-column:17/span_8] lg:row-start-1',
    nav: 'col-span-full lg:[grid-column:1/span_8] lg:row-start-2',
    contact: 'col-span-full lg:[grid-column:9/span_8] lg:row-start-2',
    connect: 'col-span-full lg:[grid-column:17/span_8] lg:row-start-2',
  },
  nav: {
    logo: 'col-span-1 lg:[grid-column:1/span_2] justify-self-start',
    links:
      'col-span-full lg:[grid-column:15/span_6] hidden lg:flex items-center justify-end gap-[calc(var(--grid-unit)*2)]',
    controls: 'col-start-6 flex items-center justify-end gap-3 sm:col-start-8 lg:[grid-column:21/span_4]',
  },
} as const;
