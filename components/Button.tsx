'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
  'aria-label'?: string;
}

const variantClasses = {
  primary:
    'border border-current/42 text-foreground hover:border-foreground hover:bg-foreground hover:text-background dark:hover:border-link/55 dark:hover:bg-link/12 dark:hover:text-link',
  secondary:
    'border border-border bg-[var(--surface-elevated)] text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-200 dark:hover:border-link/40 dark:hover:bg-link/12 dark:hover:text-link',
};

export function Button({ children, onClick, href, className, variant = 'primary', 'aria-label': ariaLabel }: ButtonProps) {
  const baseClasses = cn(
    'inline-flex min-h-12 items-center justify-center px-5 py-3 text-center text-[0.78rem] font-mono font-medium uppercase tracking-[0.22em] rounded-none bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200',
    variantClasses[variant]
  );

  const content = (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      className={cn(baseClasses, className)}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block" aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block" aria-label={ariaLabel}>
      {content}
    </button>
  );
}
