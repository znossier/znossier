'use client';

import { Section } from '@/components/Section';
import { SectionLayout } from '@/components/SectionLayout';
import { GridCell } from '@/components/GridCell';
import { navigationItems } from '@/lib/mock-data';
import type { ContactContent } from '@/lib/site-content';
import { smoothScrollTo, smoothScrollToTop, cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Figma footer Nav Link — 14px mono semibold, dotted underline on hover */
const footerLinkClass =
  'footer-link relative z-[1] inline-flex min-h-[var(--grid-unit)] items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function Footer({ contact }: { contact: ContactContent }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <Section id="footer" variant="footer" className="footer-section py-0">
      <SectionLayout sectionId="footer">
        <div className="site-section-grid footer-grid">
          <GridCell
            section="footer"
            cell="utilitySpacerLeft"
            className="footer-cell footer-cell--spacer"
            aria-hidden
          >
            {null}
          </GridCell>

          <GridCell
            section="footer"
            cell="utilitySpacerRight"
            className="footer-cell footer-cell--spacer"
            aria-hidden
          >
            {null}
          </GridCell>

          <GridCell section="footer" cell="utility" className="footer-cell footer-cell--utility">
            <button
              type="button"
              onClick={smoothScrollToTop}
              data-cursor="navigate"
              className={cn(footerLinkClass, 'footer-link--stretch w-full justify-between gap-[var(--grid-unit)]')}
            >
              <span>Back to top</span>
              <span aria-hidden className="footer-figma-arrow">
                ↑
              </span>
            </button>
          </GridCell>

          <GridCell section="footer" cell="nav" className="footer-cell" as="section">
            <h3 className="footer-figma-heading">Navigation</h3>
            <nav aria-label="Footer navigation">
              <ul className="footer-figma-stack">
                {navigationItems.map((item) => {
                  const sectionId = item.href.replace(/^#/, '');

                  if (isHome) {
                    return (
                      <li key={item.href}>
                        <a
                          href={`#${sectionId}`}
                          data-cursor="navigate"
                          onClick={(event) => {
                            event.preventDefault();
                            smoothScrollTo(sectionId);
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
                      <Link
                        href={{ pathname: '/', hash: sectionId }}
                        data-cursor="navigate"
                        className={footerLinkClass}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </GridCell>

          <GridCell section="footer" cell="contact" className="footer-cell" as="section">
            <h3 className="footer-figma-heading">Contact</h3>
            <ul className="footer-figma-stack">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  data-cursor="link"
                  className={cn(footerLinkClass, 'max-w-full')}
                  aria-label={`Email: ${contact.email}`}
                >
                  <span className="footer-link-email">{contact.email}</span>
                </a>
              </li>
              {contact.phone ? (
                <li>
                  <a
                    href={`tel:${contact.phone}`}
                    data-cursor="link"
                    className={cn(footerLinkClass, 'max-w-full')}
                    aria-label={`Phone: ${contact.phone}`}
                  >
                    {contact.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </GridCell>

          <GridCell section="footer" cell="connect" className="footer-cell" as="section">
            <h3 className="footer-figma-heading">Connect</h3>
            <ul className="footer-figma-stack">
              {contact.socialLinks.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className={footerLinkClass}
                    aria-label={social.platform}
                  >
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </GridCell>
        </div>
      </SectionLayout>
    </Section>
  );
}
