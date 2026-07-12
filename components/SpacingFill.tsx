'use client';

import { cn } from '@/lib/utils';
import type { SpacingRect } from '@/lib/spacing-metrics';
import { getSpacingFillReveal } from '@/lib/spacing-metrics';
import { SpacingZoneLabel } from '@/components/SpacingZoneLabel';

function fillClass(kind: SpacingRect['kind']) {
  if (kind === 'gutter') return 'spacing-fill-gutter';
  if (kind === 'padding') return 'spacing-fill-padding';
  return 'spacing-fill-gap';
}

export function SpacingFill({
  rect,
  showLabel = true,
  className,
}: {
  rect: SpacingRect;
  showLabel?: boolean;
  className?: string;
}) {
  const { reveal, side } = getSpacingFillReveal(rect);

  return (
    <div
      className={cn('spacing-fill-animate absolute', fillClass(rect.kind), className)}
      data-reveal={reveal}
      data-side={side}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      }}
    >
      {showLabel ? <SpacingZoneLabel rect={rect} /> : null}
    </div>
  );
}

export function SpacingLabelOnly({
  rect,
  className,
}: {
  rect: SpacingRect;
  className?: string;
}) {
  return (
    <div
      className={cn('absolute', className)}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      }}
    >
      <SpacingZoneLabel rect={rect} />
    </div>
  );
}
