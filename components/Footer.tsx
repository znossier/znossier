'use client';

import { Section } from '@/components/Section';
import { SectionLayout } from '@/components/SectionLayout';
import { navigationItems } from '@/lib/mock-data';
import { layoutClass } from '@/lib/grid-layout';
import type { ContactContent } from '@/lib/site-content';
import { smoothScrollTo, smoothScrollToTop, cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Same hover/press chrome as top nav — never selected in the footer. */
const footerLinkClass =
  'footer-link nav-desktop-link relative z-[1] inline-flex h-[var(--grid-unit)] items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/**
 * Figma footer 407:1586 on the site 24-col grid:
 * empty 1–8 | empty 9–16 | back to top 17–24
 * Navigation 1–8 | Contact 9–16 | Connect 17–24
 */
export function Footer({ contact }: { contact: ContactContent }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <Section id="footer" variant="footer" className="footer-section py-0">
      <SectionLayout sectionId="footer">
        <div className="footer-figma site-grid">
          <div
            className={cn(
              'footer-figma-cell footer-figma-cell--empty footer-figma-cell--rule-x footer-figma-cell--rule-y',
              layoutClass('footer', 'utilitySpacerLeft')
            )}
            aria-hidden
          />
          <div
            className={cn(
              'footer-figma-cell footer-figma-cell--empty footer-figma-cell--rule-x footer-figma-cell--rule-y',
              layoutClass('footer', 'utilitySpacerRight')
            )}
            aria-hidden
          />

          <div
            className={cn(
              'footer-figma-cell footer-figma-cell--utility',
              layoutClass('footer', 'utility')
            )}
          >
            <button
              type="button"
              onClick={smoothScrollToTop}
              data-cursor="navigate"
              className={cn(footerLinkClass, 'footer-link--back w-full justify-between gap-[var(--grid-unit)]')}
            >
              <span className="nav-desktop-link-label">Back to top</span>
              <span aria-hidden className="footer-figma-arrow">
                ↑
              </span>
            </button>
          </div>

          <section
            className={cn(
              'footer-figma-cell footer-figma-cell--rule-y footer-figma-cell--nav',
              layoutClass('footer', 'nav')
            )}
            aria-labelledby="footer-nav-heading"
          >
            <h3 id="footer-nav-heading" className="footer-figma-heading">
              Navigation
            </h3>
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
                          <span className="nav-desktop-link-label">{item.label}</span>
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
                        <span className="nav-desktop-link-label">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </section>

          <section
            className={cn(
              'footer-figma-cell footer-figma-cell--rule-y',
              layoutClass('footer', 'contact')
            )}
            aria-labelledby="footer-contact-heading"
          >
            <h3 id="footer-contact-heading" className="footer-figma-heading">
              Contact
            </h3>
            <ul className="footer-figma-stack">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  data-cursor="link"
                  className={cn(footerLinkClass, 'max-w-full')}
                  aria-label={`Email: ${contact.email}`}
                >
                  <span className="nav-desktop-link-label footer-link-email">{contact.email}</span>
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
                    <span className="nav-desktop-link-label">{contact.phone}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </section>

          <section
            className={cn(
              'footer-figma-cell footer-figma-cell--rule-x-top',
              layoutClass('footer', 'connect')
            )}
            aria-labelledby="footer-connect-heading"
          >
            <h3 id="footer-connect-heading" className="footer-figma-heading">
              Connect
            </h3>
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
                    <span className="nav-desktop-link-label">{social.platform}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </SectionLayout>
    </Section>
  );
}
