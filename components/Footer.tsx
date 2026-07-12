'use client';

import { Section } from '@/components/Section';
import { SectionLayout } from '@/components/SectionLayout';
import { SpacingGuide } from '@/components/SpacingGuide';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { gridSpans } from '@/lib/grid-spans';
import { navigationItems } from '@/lib/mock-data';
import type { ContactContent } from '@/lib/site-content';
import { smoothScrollTo, smoothScrollToTop, cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const footerLinkClass =
  'type-label inline-flex min-h-11 items-center py-2 text-secondary transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const footerCellClass = 'footer-cell col-span-full';

export function Footer({ contact }: { contact: ContactContent }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId);
  };

  return (
    <Section
      id="footer"
      variant="footer"
      className="pb-[var(--mobile-bottom-controls)] lg:pb-0"
      inspectOnEnter
    >
      <SectionLayout boundaries={HOME_SECTION_BOUNDARIES.footer}>
        <SpacingGuide
          showGaps
          showGutters
          showLabels
          sectionBoundaries={HOME_SECTION_BOUNDARIES.footer}
          className="site-section-grid footer-grid"
        >
          <div className={cn(footerCellClass, 'footer-cell--utility', gridSpans.footer.utility)}>
            <button
              type="button"
              onClick={smoothScrollToTop}
              className={`${footerLinkClass} inline-flex w-full items-center justify-between gap-3`}
            >
              <span>Back to top</span>
              <span aria-hidden>↑</span>
            </button>
          </div>

          <section className={cn(footerCellClass, 'footer-cell--split', gridSpans.footer.nav)}>
            <h3 className="type-meta mb-5">Navigation</h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-3">
                {navigationItems.map((item) => {
                  const sectionId = item.href.substring(1);

                  if (isHome) {
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={(event) => {
                            event.preventDefault();
                            handleNavClick(sectionId);
                          }}
                          className={footerLinkClass}
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href}>
                      <Link href={`/${item.href}`} className={footerLinkClass}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </section>

          <section className={cn(footerCellClass, 'footer-cell--split', gridSpans.footer.contact)}>
            <h3 className="type-meta mb-5">Contact</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="type-label break-words text-secondary transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Email: ${contact.email}`}
              >
                {contact.email}
              </a>
              {contact.phone ? (
                <a
                  href={`tel:${contact.phone}`}
                  className="type-label break-words text-secondary transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`Phone: ${contact.phone}`}
                >
                  {contact.phone}
                </a>
              ) : null}
              {contact.address ? <p className="type-body break-words">{contact.address}</p> : null}
            </div>
          </section>

          <section className={cn(footerCellClass, 'footer-cell--split', gridSpans.footer.connect)}>
            <h3 className="type-meta mb-5">Connect</h3>
            <ul className="flex flex-col gap-3">
              {contact.socialLinks.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLinkClass}
                    aria-label={social.platform}
                  >
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </SpacingGuide>
      </SectionLayout>
    </Section>
  );
}
