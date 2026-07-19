'use client';

import { Section } from '@/components/Section';
import { navigationItems } from '@/lib/mock-data';
import type { ContactContent } from '@/lib/site-content';
import { smoothScrollTo, smoothScrollToTop, cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Figma Nav Link 352:211 — 14px mono semibold, tracking 1px, uppercase */
const footerLinkClass =
  'footer-link relative z-[1] inline-flex h-[var(--grid-unit)] items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/**
 * Figma footer 407:1586 — full-bleed black 3×2 table:
 * empty | empty | back to top (96px)
 * Navigation | Contact | Connect
 * Left inset 24px; cell pad + stack gap 24px.
 */
export function Footer({ contact }: { contact: ContactContent }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <Section id="footer" variant="footer" className="footer-section py-0">
      <div className="footer-figma">
        <div className="footer-figma-grid">
          <div className="footer-figma-cell footer-figma-cell--empty" aria-hidden />
          <div className="footer-figma-cell footer-figma-cell--empty" aria-hidden />

          <div className="footer-figma-cell footer-figma-cell--utility">
            <button
              type="button"
              onClick={smoothScrollToTop}
              data-cursor="navigate"
              className={cn(footerLinkClass, 'footer-link--back w-full justify-between gap-[var(--grid-unit)]')}
            >
              <span>Back to top</span>
              <span aria-hidden className="footer-figma-arrow">
                ↑
              </span>
            </button>
          </div>

          <section className="footer-figma-cell" aria-labelledby="footer-nav-heading">
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
          </section>

          <section className="footer-figma-cell" aria-labelledby="footer-contact-heading">
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
          </section>

          <section className="footer-figma-cell" aria-labelledby="footer-connect-heading">
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
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Section>
  );
}
