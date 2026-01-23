'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
  'aria-label'?: string;
}

export function Button({ children, onClick, href, className = '', variant = 'primary', 'aria-label': ariaLabel }: ButtonProps) {
  const baseClasses = 'px-8 py-3 border border-foreground/20 rounded-full text-foreground hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-200 text-base font-medium inline-block text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  
  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={baseClasses + ' ' + className}
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
