'use client';

import { clsx } from 'clsx';

type LinkSwapBaseProps = {
  children: React.ReactNode;
  className?: string;
};

type LinkSwapAsAnchor = LinkSwapBaseProps & {
  as: 'a';
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  'aria-current'?: 'page';
  role?: string;
};

type LinkSwapAsSpan = LinkSwapBaseProps & {
  as?: 'span';
  href?: never;
  onClick?: never;
  'aria-current'?: never;
  role?: never;
};

export type LinkSwapProps = LinkSwapAsAnchor | LinkSwapAsSpan;

export function LinkSwap(props: LinkSwapProps) {
  const { children, className } = props;

  const swapStructure = (
    <span className="link-swap-track">
      <span className="link-swap-visible">{children}</span>
      <span className="link-swap-hidden" aria-hidden>
        {children}
      </span>
    </span>
  );

  if (props.as === 'a') {
    const { href, onClick, 'aria-current': ariaCurrent, role } = props;
    return (
      <a
        href={href}
        onClick={onClick}
        className={clsx('link-swap', className)}
        aria-current={ariaCurrent}
        role={role}
      >
        {swapStructure}
      </a>
    );
  }

  return <span className={clsx('link-swap', className)}>{swapStructure}</span>;
}
