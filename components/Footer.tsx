'use client';

import { SectionGridLines } from '@/components/SectionGridLines';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { navigationItems } from '@/lib/mock-data';
import type { ContactContent } from '@/lib/site-content';
import { smoothScrollTo, smoothScrollToTop } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};

const footerLinkClass =
  'text-sm font-mono uppercase tracking-[0.14em] sm:tracking-[0.18em] text-foreground/72 transition-colors duration-200 hover:text-link focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:text-link';

const footerTopCellClass =
  'relative z-10 h-full border-x border-border/90 bg-footer px-5 py-5 dark:bg-background md:px-6 md:py-6 lg:bg-transparent lg:dark:bg-transparent';

const footerPanelClass =
  'grid-edge-frame relative z-10 isolate h-full border-x border-b border-border/90 bg-footer px-5 py-5 dark:bg-background md:px-6 md:py-6 lg:bg-transparent lg:dark:bg-transparent';

export function Footer({ contact }: { contact: ContactContent }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId, 96);
  };

  return (
    <footer id="footer" className="relative z-20 border-t border-border/90 bg-footer pb-[var(--mobile-bottom-controls)] dark:bg-background md:pb-0">
      <SectionGridLines boundaries={HOME_SECTION_BOUNDARIES.footer} />
      <div className="mx-auto w-full max-w-[var(--site-max-width)] px-[var(--site-padding-inline)] lg:px-0">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="relative z-10"
        >
          <div className="border-b border-border/90">
            <div className="site-grid">
              <motion.div
                variants={itemVariants}
                className={`${footerTopCellClass} [grid-column:1/span_6] sm:[grid-column:1/span_8] lg:[grid-column:17/span_8]`}
              >
                <button
                  type="button"
                  onClick={smoothScrollToTop}
                  className={`${footerLinkClass} inline-flex w-full items-center justify-between gap-3`}
                >
                  <span>Back to top</span>
                  <span aria-hidden>↑</span>
                </button>
              </motion.div>
            </div>
          </div>

          <div className="site-grid gap-y-0">
            <motion.section variants={itemVariants} className={`${footerPanelClass} [grid-column:1/span_6] sm:[grid-column:1/span_8] lg:[grid-column:1/span_8]`}>
              <h3 className="mb-5 text-xs font-mono font-semibold uppercase tracking-[0.24em] text-foreground/52">
                Navigation
              </h3>
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
            </motion.section>

            <motion.section variants={itemVariants} className={`${footerPanelClass} [grid-column:1/span_6] sm:[grid-column:1/span_8] lg:[grid-column:9/span_8]`}>
              <h3 className="mb-5 text-xs font-mono font-semibold uppercase tracking-[0.24em] text-foreground/52">
                Contact
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="break-words text-[0.75rem] font-mono uppercase tracking-[0.04em] text-foreground/74 transition-colors duration-200 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[375px]:text-sm sm:tracking-[0.12em] dark:hover:text-link"
                  aria-label={`Email: ${contact.email}`}
                >
                  {contact.email}
                </a>
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="break-words text-[0.75rem] font-mono uppercase tracking-[0.04em] text-foreground/74 transition-colors duration-200 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[375px]:text-sm sm:tracking-[0.12em] dark:hover:text-link"
                    aria-label={`Phone: ${contact.phone}`}
                  >
                    {contact.phone}
                  </a>
                ) : null}
                {contact.address ? (
                  <p className="break-words text-sm font-mono uppercase tracking-[0.08em] text-foreground/62 sm:tracking-[0.12em]">
                    {contact.address}
                  </p>
                ) : null}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className={`${footerPanelClass} [grid-column:1/span_6] sm:[grid-column:1/span_8] lg:[grid-column:17/span_8]`}>
              <h3 className="mb-5 text-xs font-mono font-semibold uppercase tracking-[0.24em] text-foreground/52">
                Connect
              </h3>
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
            </motion.section>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
