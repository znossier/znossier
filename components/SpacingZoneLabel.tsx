'use client';

import { cn } from '@/lib/utils';
import { getSpacingLabelMode, type SpacingRect } from '@/lib/spacing-metrics';
import type { MeasurementColor } from '@/components/MeasurementLabel';

function labelColor(kind: SpacingRect['kind']): MeasurementColor {
  return kind === 'gutter' ? 'cyan' : 'magenta';
}

export function SpacingZoneLabel({ rect }: { rect: SpacingRect }) {
  const mode = getSpacingLabelMode(rect);
  if (mode === 'hidden') return null;

  const color = labelColor(rect.kind);
  /* Figma spacing fills: numeric only — never append px */
  const label = String(rect.size);

  return (
    <div className="spacing-zone-label" aria-hidden>
      <span
        className={cn(
          'spacing-zone-label-text',
          color === 'cyan' ? 'spacing-zone-label-text--cyan' : 'spacing-zone-label-text--magenta'
        )}
      >
        {label}
      </span>
    </div>
  );
}
