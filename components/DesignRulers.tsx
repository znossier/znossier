'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MeasurementLabel } from '@/components/MeasurementLabel';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useRulerInteraction, type RulerTargetBounds } from '@/hooks/useRulerInteraction';
import { useScrollOffset, useShellInlineStart } from '@/hooks/useScrollOffset';
import { EASE_PRECISION, MOTION } from '@/lib/motion';
import { cn } from '@/lib/utils';

const TICK_INTERVAL = 8;
const LABEL_INTERVAL = 128;
const RULER_LENGTH = 4000;

function RulerTicks({
  orientation,
  scrollOffset,
  originOffset,
}: {
  orientation: 'horizontal' | 'vertical';
  scrollOffset: number;
  originOffset: number;
}) {
  const isHorizontal = orientation === 'horizontal';
  const length = isHorizontal ? RULER_LENGTH : 3000;
  const ticks: React.ReactNode[] = [];

  for (let i = 0; i <= length; i += TICK_INTERVAL) {
    const isMajor = i % 64 === 0;
    const documentPosition = originOffset + i;
    const hasLabel = i % LABEL_INTERVAL === 0;

    ticks.push(
      <div
        key={i}
        className="absolute"
        style={
          isHorizontal
            ? {
                left: documentPosition,
                top: 0,
                width: 1,
                height: isMajor ? 10 : 5,
                backgroundColor: 'var(--utility-cyan)',
                opacity: isMajor ? 0.72 : 0.44,
              }
            : {
                top: documentPosition,
                left: 0,
                height: 1,
                width: isMajor ? 10 : 5,
                backgroundColor: 'var(--utility-cyan)',
                opacity: isMajor ? 0.72 : 0.44,
              }
        }
      >
        {hasLabel && isHorizontal && (
          <span
            className="measurement-text ruler-tick-label ruler-tick-label--horizontal absolute whitespace-nowrap text-[var(--utility-cyan)]"
            style={{ opacity: 0.82 }}
          >
            {i}
          </span>
        )}
        {hasLabel && !isHorizontal && (
          <span
            className="measurement-text ruler-tick-label ruler-tick-label--vertical absolute whitespace-nowrap text-[var(--utility-cyan)]"
            style={{ opacity: 0.82 }}
          >
            {i}
          </span>
        )}
      </div>
    );
  }

  const transform = isHorizontal
    ? `translateX(${-scrollOffset}px)`
    : `translateY(${-scrollOffset}px)`;

  return (
    <div
      className="relative"
      style={{
        transform,
        width: isHorizontal ? originOffset + length : 'var(--ruler-size)',
        height: isHorizontal ? 'var(--ruler-size)' : originOffset + length,
      }}
    >
      {ticks}
    </div>
  );
}

function RulerEdgeMarkers({
  orientation,
  scrollOffset,
  target,
}: {
  orientation: 'horizontal' | 'vertical';
  scrollOffset: number;
  target: RulerTargetBounds;
}) {
  const isHorizontal = orientation === 'horizontal';
  const positions = isHorizontal
    ? [
        { key: 'left', value: target.left, emphasis: true },
        { key: 'right', value: target.right, emphasis: true },
      ]
    : [
        { key: 'top', value: target.top, emphasis: true },
        { key: 'bottom', value: target.bottom, emphasis: true },
      ];

  const transform = isHorizontal
    ? `translateX(${-scrollOffset}px)`
    : `translateY(${-scrollOffset}px)`;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-visible"
      style={{ transform }}
      aria-hidden
    >
      {positions.map(({ key, value, emphasis }) => (
        <div
          key={key}
          className={cn('ruler-edge-marker absolute', emphasis && 'ruler-edge-marker--emphasis')}
          style={
            isHorizontal
              ? {
                  left: value,
                  top: 0,
                  width: 1,
                  height: 'var(--ruler-size)',
                }
              : {
                  top: value,
                  left: 0,
                  height: 1,
                  width: 'var(--ruler-size)',
                }
          }
        />
      ))}
      {isHorizontal && (
        <>
          <MeasurementLabel
            value={target.width}
            color="cyan"
            variant="tooltip"
            visible
            className="ruler-target-label ruler-target-label--horizontal absolute"
            style={{ left: (target.left + target.right) / 2, top: 'calc(100% + 2px)' }}
          />
        </>
      )}
      {!isHorizontal && (
        <MeasurementLabel
          value={target.height}
          color="cyan"
          variant="tooltip"
          visible
          className="ruler-target-label ruler-target-label--vertical absolute"
          style={{ top: (target.top + target.bottom) / 2, left: 'calc(100% + 2px)' }}
        />
      )}
    </div>
  );
}

function RulerCursorReadout({
  orientation,
  scrollOffset,
  documentPosition,
  label,
  visible,
}: {
  orientation: 'horizontal' | 'vertical';
  scrollOffset: number;
  documentPosition: number;
  label: string | number;
  visible: boolean;
}) {
  if (!visible) return null;

  const isHorizontal = orientation === 'horizontal';
  const transform = isHorizontal
    ? `translateX(${-scrollOffset}px)`
    : `translateY(${-scrollOffset}px)`;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-visible"
      style={{ transform }}
      aria-hidden
    >
      <div
        className={cn(
          'ruler-cursor-indicator absolute',
          isHorizontal ? 'ruler-cursor-indicator--horizontal' : 'ruler-cursor-indicator--vertical'
        )}
        style={
          isHorizontal
            ? { left: documentPosition, top: 0, height: 'var(--ruler-size)' }
            : { top: documentPosition, left: 0, width: 'var(--ruler-size)' }
        }
      />
      <MeasurementLabel
        value={label}
        color="cyan"
        variant="tooltip"
        visible
        className={cn(
          'ruler-cursor-readout absolute',
          isHorizontal ? 'ruler-cursor-readout--horizontal' : 'ruler-cursor-readout--vertical'
        )}
        style={
          isHorizontal
            ? {
                left: documentPosition,
                top: 'calc(100% + 1px)',
                transform: 'translateX(-50%)',
              }
            : {
                top: documentPosition,
                left: 'calc(100% + 1px)',
                transform: 'translateY(-50%)',
              }
        }
      />
    </div>
  );
}

function SectionBandMarkers({
  scrollOffset,
  bands,
}: {
  scrollOffset: number;
  bands: Array<{ id: string; top: number }>;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-visible"
      style={{ transform: `translateY(${-scrollOffset}px)` }}
      aria-hidden
    >
      {bands.map((band) => (
        <div
          key={band.id}
          className="ruler-section-band absolute"
          style={{ top: band.top, left: 0, width: 'var(--ruler-size)' }}
          title={band.id}
        />
      ))}
    </div>
  );
}

function RulerCrosshair({
  cursor,
  target,
  visible,
  reducedMotion,
  rulerSize,
  verticalTrackTop,
}: {
  cursor: { clientX: number; clientY: number };
  target: RulerTargetBounds | null;
  visible: boolean;
  reducedMotion: boolean;
  rulerSize: number;
  verticalTrackTop: number;
}) {
  if (!visible) return null;

  const { clientX, clientY } = cursor;
  const horizontalSpan = Math.max(0, clientX - rulerSize);
  const verticalSpan = Math.max(0, clientY - verticalTrackTop);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      initial={false}
      animate={{ opacity: 1 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: MOTION.duration.overlay, ease: EASE_PRECISION }
      }
    >
      <div
        className="ruler-crosshair ruler-crosshair--horizontal absolute left-0 top-0"
        style={{
          transform: `translate3d(${rulerSize}px, ${clientY}px, 0) scaleX(${horizontalSpan})`,
          transformOrigin: '0 50%',
          width: 1,
        }}
      />
      <div
        className="ruler-crosshair ruler-crosshair--vertical absolute left-0 top-0"
        style={{
          transform: `translate3d(${clientX}px, ${verticalTrackTop}px, 0) scaleY(${verticalSpan})`,
          transformOrigin: '50% 0',
          height: 1,
        }}
      />

      {target && (
        <>
          <div
            className="ruler-target-guide ruler-target-guide--horizontal absolute"
            style={{ top: target.top - window.scrollY, left: rulerSize, right: 0 }}
          />
          <div
            className="ruler-target-guide ruler-target-guide--horizontal absolute"
            style={{ top: target.bottom - window.scrollY, left: rulerSize, right: 0 }}
          />
          <div
            className="ruler-target-guide ruler-target-guide--vertical absolute"
            style={{
              left: target.left - window.scrollX,
              top: verticalTrackTop,
              bottom: 0,
            }}
          />
          <div
            className="ruler-target-guide ruler-target-guide--vertical absolute"
            style={{
              left: target.right - window.scrollX,
              top: verticalTrackTop,
              bottom: 0,
            }}
          />
        </>
      )}
    </motion.div>
  );
}

export function DesignRulers() {
  const pathname = usePathname();
  const mounted = useHasMounted();
  const isHome = pathname === '/';
  const { x: scrollX, y: scrollY } = useScrollOffset();
  const shellInlineStart = useShellInlineStart();
  const [verticalOrigin, setVerticalOrigin] = useState(0);
  const [rulerSize, setRulerSize] = useState(14);
  const [verticalTrackTop, setVerticalTrackTop] = useState(14);

  useEffect(() => {
    const measure = () => {
      const root = document.documentElement;
      const chromeTop = parseFloat(getComputedStyle(root).getPropertyValue('--chrome-top')) || 0;
      const measuredRulerSize =
        parseFloat(getComputedStyle(root).getPropertyValue('--ruler-size')) || 14;
      setRulerSize(measuredRulerSize);
      setVerticalOrigin(chromeTop + measuredRulerSize);
      setVerticalTrackTop(chromeTop + measuredRulerSize);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { cursor, coords, target, sectionBands, interactive, reducedMotion } = useRulerInteraction({
    enabled: mounted && isHome,
    shellInlineStart,
    verticalOrigin,
  });

  if (!mounted || !isHome) return null;

  const showCrosshair = interactive && cursor !== null;
  const showCursorReadout = showCrosshair && coords !== null;
  const docCursorX = coords !== null ? shellInlineStart + coords.x : 0;
  const docCursorY = coords !== null ? verticalOrigin + coords.y : 0;

  return (
    <motion.div
      aria-hidden
      className="design-rulers pointer-events-none fixed inset-0 z-40 hidden lg:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: MOTION.duration.fade, ease: EASE_PRECISION }}
    >
      {showCrosshair && cursor && (
        <RulerCrosshair
          cursor={cursor}
          target={target}
          visible={showCrosshair}
          reducedMotion={reducedMotion}
          verticalTrackTop={verticalTrackTop}
          rulerSize={rulerSize}
        />
      )}

      <div
        className="ruler-origin absolute border-b border-r border-[var(--utility-cyan)]"
        style={{
          top: 'var(--chrome-top)',
          left: 0,
          width: 'var(--ruler-size)',
          height: 'var(--ruler-size)',
        }}
      />

      <div
        className="ruler-track ruler-track-horizontal ruler-track--horizontal absolute overflow-hidden border-b border-[var(--utility-cyan)]"
        style={{
          top: 'var(--chrome-top)',
          left: 'var(--ruler-size)',
          right: 0,
          height: 'var(--ruler-size)',
        }}
      >
        <RulerTicks
          orientation="horizontal"
          scrollOffset={scrollX}
          originOffset={shellInlineStart}
        />
        {target && (
          <RulerEdgeMarkers
            orientation="horizontal"
            scrollOffset={scrollX}
            target={target}
          />
        )}
        {showCursorReadout && coords && (
          <RulerCursorReadout
            orientation="horizontal"
            scrollOffset={scrollX}
            documentPosition={docCursorX}
            label={coords.x}
            visible={showCursorReadout}
          />
        )}
      </div>

      <div
        className="ruler-track ruler-track-vertical ruler-track--vertical absolute overflow-hidden border-r border-[var(--utility-cyan)]"
        style={{
          top: 'calc(var(--chrome-top) + var(--ruler-size))',
          left: 0,
          width: 'var(--ruler-size)',
          bottom: 0,
        }}
      >
        <RulerTicks orientation="vertical" scrollOffset={scrollY} originOffset={verticalOrigin} />
        <SectionBandMarkers scrollOffset={scrollY} bands={sectionBands} />
        {target && (
          <RulerEdgeMarkers
            orientation="vertical"
            scrollOffset={scrollY}
            target={target}
          />
        )}
        {showCursorReadout && coords && (
          <RulerCursorReadout
            orientation="vertical"
            scrollOffset={scrollY}
            documentPosition={docCursorY}
            label={coords.y}
            visible={showCursorReadout}
          />
        )}
      </div>
    </motion.div>
  );
}
