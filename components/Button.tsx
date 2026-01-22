'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, href, className = '', variant = 'primary' }: ButtonProps) {
  const baseClasses = 'px-8 py-3 border border-foreground/20 rounded-full text-foreground hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-200 text-base font-medium inline-block text-center';
  
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
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="inline-block">
      {content}
    </button>
  );
}
