'use client';

import { cn } from '@/lib/utils';

type Corner = 'tl' | 'tr' | 'bl' | 'br';

function cornerPosition(corner: Corner, placement: 'outside' | 'inside') {
  if (placement === 'inside') {
    switch (corner) {
      case 'tl':
        return 'left-0 top-0 -translate-x-1/2 -translate-y-1/2';
      case 'tr':
        return 'right-0 top-0 translate-x-1/2 -translate-y-1/2';
      case 'bl':
        return 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2';
      case 'br':
        return 'right-0 bottom-0 translate-x-1/2 translate-y-1/2';
    }
  }

  switch (corner) {
    case 'tl':
      return '-left-[7px] -top-[7px]';
    case 'tr':
      return '-right-[7px] -top-[7px]';
    case 'bl':
      return '-left-[7px] -bottom-[7px]';
    case 'br':
      return '-right-[7px] -bottom-[7px]';
  }
}

export function CornerMarker({
  corner,
  className,
  placement = 'outside',
}: {
  corner: Corner;
  className?: string;
  placement?: 'outside' | 'inside';
}) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute z-20 block h-[14px] w-[14px]',
        cornerPosition(corner, placement),
        className,
      )}
      aria-hidden
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
    </span>
  );
}

export function FrameCorners({
  className = '',
  placement = 'outside',
}: {
  className?: string;
  placement?: 'outside' | 'inside';
}) {
  return (
    <>
      <CornerMarker corner="tl" className={className} placement={placement} />
      <CornerMarker corner="tr" className={className} placement={placement} />
      <CornerMarker corner="bl" className={className} placement={placement} />
      <CornerMarker corner="br" className={className} placement={placement} />
    </>
  );
}
