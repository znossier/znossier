'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Inspectable } from '@/components/Inspectable';
import { cn } from '@/lib/utils';
import { EASE_PRECISION, MOTION } from '@/lib/motion';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'inverted';
  inspectable?: boolean;
  showSpacing?: boolean;
  'aria-label'?: string;
}

const variantClasses = {
  primary: 'flat-control inline-flex',
  secondary: 'flat-control inline-flex',
  accent: 'flat-control flat-control-accent inline-flex',
  inverted: 'flat-control flat-control-inverted inline-flex focus-visible:ring-offset-transparent',
};

function ButtonInner({
  children,
  onClick,
  href,
  className,
  variant = 'primary',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = cn(
    // Figma Button 352:408: h-48, callers set on-grid width (Hero View Work = 120 / 5U).
    // Always single-line — never wrap the label to 2 lines.
    'type-button inline-flex h-12 min-h-12 max-h-12 items-center justify-center whitespace-nowrap px-4 py-3 text-center transition-[border-color,background-color,color] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    variantClasses[variant],
    className
  );

  const motionProps = {
    transition: { duration: MOTION.duration.hover, ease: EASE_PRECISION },
    className: classes,
    'aria-label': ariaLabel,
  };

  if (href) {
    return (
      <motion.a href={href} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...motionProps}>
      {children}
    </motion.button>
  );
}

export function Button({
  inspectable = false,
  showSpacing = true,
  ...props
}: ButtonProps) {
  if (inspectable) {
    return (
      <Inspectable showSpacing={showSpacing} showDimensions persistent={false}>
        <ButtonInner {...props} />
      </Inspectable>
    );
  }

  return <ButtonInner {...props} />;
}
