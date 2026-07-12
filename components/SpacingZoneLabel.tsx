'use client';

import { cn } from '@/lib/utils';
import {
  getSpacingLabelMode,
  getSpacingLabelPlacement,
  type SpacingRect,
} from '@/lib/spacing-metrics';
import { MeasurementLabel, type MeasurementColor } from '@/components/MeasurementLabel';

function labelColor(kind: SpacingRect['kind']): MeasurementColor {
  return kind === 'gutter' ? 'cyan' : 'magenta';
}

const placementClass: Record<ReturnType<typeof getSpacingLabelPlacement>, string> = {
  center: 'spacing-zone-label--center',
  above: 'spacing-zone-label--above',
  below: 'spacing-zone-label--below',
  left: 'spacing-zone-label--left',
  right: 'spacing-zone-label--right',
};

export function SpacingZoneLabel({ rect }: { rect: SpacingRect }) {
  const mode = getSpacingLabelMode(rect);
  if (mode === 'hidden') return null;

  const placement = getSpacingLabelPlacement(rect);
  const color = labelColor(rect.kind);

  if (mode === 'inline') {
    return (
      <span className={cn('spacing-zone-label spacing-zone-label--inline', `spacing-zone-label--${color}`)}>
        {rect.size}
      </span>
    );
  }

  return (
    <MeasurementLabel
      value={rect.size}
      color={color}
      variant="tooltip"
      className={cn('spacing-zone-label--tooltip', placementClass[placement])}
    />
  );
}
