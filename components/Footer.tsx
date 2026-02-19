'use client';

import { mockAbout, mockContact, navigationItems } from '@/lib/mock-data';
import { SocialLinks } from '@/components/SocialLinks';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LinkSwap } from '@/components/LinkSwap';
import { smoothScrollTo } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const navLinkClass =
  'text-sm font-mono uppercase tracking-wider text-foreground/70 hover:text-foreground transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded';

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId, 100);
  };

  return (
    <footer id="footer" className="bg-section-accent dark:bg-background relative z-20 border-t border-foreground/20">
      {/* Grid corner + at top-left of footer content */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 relative">
        <span className="absolute left-4 sm:left-6 top-0 -translate-y-1/2 text-xs font-mono leading-none text-foreground/40" aria-hidden>+</span>
        <span className="absolute right-4 sm:right-6 top-0 -translate-y-1/2 text-xs font-mono leading-none text-foreground/40" aria-hidden>+</span>
        {/* Main Footer Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="py-12 md:py-16 lg:py-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16">
            {/* Navigation Section */}
            <motion.section
              variants={itemVariants}
              className="flex flex-col min-w-0 md:col-span-4"
            >
              <h3 className="text-xs font-mono font-medium text-foreground/50 mb-4 uppercase tracking-widest">
                Navigation
              </h3>
              <nav aria-label="Footer navigation">
                <ul className="flex flex-col gap-3">
                  {navigationItems.map((item) => {
                    const sectionId = item.href.substring(1);
                    if (isHome) {
                      return (
                        <li key={item.href}>
                          <LinkSwap
                            as="a"
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavClick(sectionId);
                            }}
                            className={navLinkClass}
                          >
                            {item.label}
                          </LinkSwap>
                        </li>
                      );
                    }
                    return (
                      <li key={item.href}>
                        <Link href={`/${item.href}`} className={navLinkClass}>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.section>

            {/* Contact Section */}
            <motion.section 
              variants={itemVariants} 
              className="flex flex-col min-w-0 md:col-span-4"
            >
              <h3 className="text-xs font-mono font-medium text-foreground/50 mb-4 uppercase tracking-widest">
                Contact
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${mockContact.email}`}
                  className="inline-flex items-center gap-2.5 text-sm font-mono text-foreground/70 hover:text-foreground transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded w-fit"
                  aria-label={`Email: ${mockContact.email}`}
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0 self-center"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <LinkSwap as="span">{mockContact.email}</LinkSwap>
                </a>
                <a
                  href="tel:+20122009325"
                  className="inline-flex items-center gap-2.5 text-sm font-mono text-foreground/70 hover:text-foreground transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded w-fit"
                  aria-label="Phone: +20122009325"
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0 self-center"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <LinkSwap as="span">+20122009325</LinkSwap>
                </a>
                <p className="inline-flex items-center gap-2.5 text-sm font-mono text-foreground/70 leading-relaxed">
                  <svg
                    className="w-4 h-4 flex-shrink-0 self-center"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Cairo, EG
                </p>
              </div>
            </motion.section>

            {/* Social Links Section */}
            <motion.section 
              variants={itemVariants} 
              className="flex flex-col min-w-0 md:col-span-4"
            >
              <h3 className="text-xs font-mono font-medium text-foreground/50 mb-4 uppercase tracking-widest">
                Connect
              </h3>
              <SocialLinks />
            </motion.section>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
