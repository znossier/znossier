/**
 * Canonical Tailwind grid-column spans for home sections (desktop lg+).
 * Must stay aligned with HOME_SECTION_BOUNDARIES in lib/grid.ts.
 */

export const gridSpans = {
  hero: {
    copy: 'col-span-full sm:[grid-column:1/span_4] lg:[grid-column:1/span_8]',
    portrait: 'col-span-full lg:[grid-column:11/span_14]',
    scrollHint: 'col-span-full lg:[grid-column:17/span_8] lg:justify-self-end lg:self-end',
  },
  works: {
    heading: 'col-span-full',
    cardLeft: 'col-span-full lg:[grid-column:1/span_11]',
    cardRight: 'col-span-full lg:[grid-column:14/span_11]',
    loadMore: 'col-span-full lg:[grid-column:12/span_2]',
  },
  expertise: {
    heading: 'col-span-full lg:[grid-column:1/span_5]',
    cards: 'col-span-full lg:[grid-column:7/span_18]',
  },
  about: {
    intro: 'col-span-full lg:[grid-column:1/span_11]',
    experience: 'col-span-full lg:[grid-column:14/span_11]',
  },
  footer: {
    utility: 'col-span-full lg:[grid-column:17/span_8] lg:row-start-1',
    nav: 'col-span-full lg:[grid-column:1/span_8] lg:row-start-2',
    contact: 'col-span-full lg:[grid-column:9/span_8] lg:row-start-2',
    connect: 'col-span-full lg:[grid-column:17/span_8] lg:row-start-2',
  },
  nav: {
    logo: 'col-span-1 lg:[grid-column:1/span_2]',
    links: 'hidden lg:flex lg:[grid-column:9/span_8]',
    controls: 'col-start-6 sm:col-start-8 lg:[grid-column:21/span_4]',
  },
} as const;
