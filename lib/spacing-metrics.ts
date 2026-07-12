export type SpacingRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  kind: 'padding' | 'gap' | 'gutter';
  size: number;
  axis: 'horizontal' | 'vertical';
  side?: 'top' | 'right' | 'bottom' | 'left';
};

export type SpacingLabelMode = 'inline' | 'tooltip' | 'hidden';
export type SpacingLabelPlacement = 'center' | 'above' | 'below' | 'left' | 'right';

const LABEL_MIN_SIZE = 8;
const LABEL_MIN_DIMENSION = 10;
const INLINE_MIN_WIDTH = 28;
const INLINE_MIN_HEIGHT = 18;
const GAP_INLINE_MIN_ALONG = 12;

export function getSpacingLabelMode(rect: SpacingRect): SpacingLabelMode {
  if (rect.size < LABEL_MIN_SIZE) {
    return 'hidden';
  }

  if (rect.kind === 'gutter') {
    const along = rect.width;
    const cross = rect.height;
    if (along >= 8 && cross >= LABEL_MIN_DIMENSION) {
      return 'inline';
    }
    if (along >= LABEL_MIN_SIZE && cross >= LABEL_MIN_DIMENSION) {
      return 'tooltip';
    }
    return 'hidden';
  }

  if (rect.kind === 'gap') {
    const along = rect.axis === 'horizontal' ? rect.width : rect.height;
    const cross = rect.axis === 'horizontal' ? rect.height : rect.width;
    if (along >= GAP_INLINE_MIN_ALONG && cross >= LABEL_MIN_DIMENSION) {
      return 'inline';
    }
    if (along >= LABEL_MIN_SIZE && cross >= LABEL_MIN_DIMENSION) {
      return 'tooltip';
    }
    return 'hidden';
  }

  if (rect.width < LABEL_MIN_DIMENSION || rect.height < LABEL_MIN_DIMENSION) {
    return 'hidden';
  }

  if (rect.width >= INLINE_MIN_WIDTH && rect.height >= INLINE_MIN_HEIGHT) {
    return 'inline';
  }

  return 'tooltip';
}

export function getSpacingLabelPlacement(rect: SpacingRect): SpacingLabelPlacement {
  if (rect.kind === 'gap') {
    return 'center';
  }

  if (getSpacingLabelMode(rect) === 'inline') return 'center';

  if (rect.kind === 'padding') {
    if (rect.side === 'top') return 'above';
    if (rect.side === 'bottom') return 'below';
    if (rect.side === 'left') return 'left';
    if (rect.side === 'right') return 'right';
  }

  if (rect.axis === 'horizontal') {
    return rect.height >= rect.width ? 'right' : 'above';
  }

  return rect.width >= rect.height ? 'below' : 'right';
}

export type GridGutter = {
  start: number;
  end: number;
  columns: number;
};

export type ElementMetrics = {
  width: number;
  height: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  gap: number;
  rowGap: number;
  columnGap: number;
};

function parsePx(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function isLayoutChild(element: Element): element is HTMLElement {
  return element instanceof HTMLElement && element.dataset.spacingOverlay !== 'true';
}

type ChildBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function getChildBoxes(container: HTMLElement, containerRect: DOMRect): ChildBox[] {
  return Array.from(container.children)
    .filter(isLayoutChild)
    .map((child) => {
      const rect = child.getBoundingClientRect();
      return {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        right: rect.right - containerRect.left,
        bottom: rect.bottom - containerRect.top,
      };
    })
    .filter((box) => box.right > box.left && box.bottom > box.top);
}

function pushHorizontalGap(gaps: SpacingRect[], a: ChildBox, b: ChildBox) {
  const gapWidth = b.left - a.right;
  if (gapWidth < 1) return;

  gaps.push({
    x: a.right,
    y: Math.min(a.top, b.top),
    width: gapWidth,
    height: Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top),
    kind: 'gap',
    size: Math.round(gapWidth),
    axis: 'horizontal',
  });
}

function pushVerticalGap(gaps: SpacingRect[], a: ChildBox, b: ChildBox) {
  const gapHeight = b.top - a.bottom;
  if (gapHeight < 1) return;

  gaps.push({
    x: Math.min(a.left, b.left),
    y: a.bottom,
    width: Math.max(a.right, b.right) - Math.min(a.left, b.left),
    height: gapHeight,
    kind: 'gap',
    size: Math.round(gapHeight),
    axis: 'vertical',
  });
}

function measureFlexGaps(
  container: HTMLElement,
  containerRect: DOMRect,
  styles: CSSStyleDeclaration
): SpacingRect[] {
  const direction = styles.flexDirection;
  const isRow = direction.startsWith('row');
  const boxes = getChildBoxes(container, containerRect);
  if (boxes.length < 2) return [];

  const gaps: SpacingRect[] = [];

  if (isRow) {
    const sorted = [...boxes].sort((left, right) => left.left - right.left);
    for (let index = 0; index < sorted.length - 1; index += 1) {
      pushHorizontalGap(gaps, sorted[index], sorted[index + 1]);
    }
    return gaps;
  }

  const sorted = [...boxes].sort((left, right) => left.top - right.top);
  for (let index = 0; index < sorted.length - 1; index += 1) {
    pushVerticalGap(gaps, sorted[index], sorted[index + 1]);
  }

  return gaps;
}

function groupIntoRows(boxes: ChildBox[], threshold = 8): ChildBox[][] {
  if (boxes.length === 0) return [];

  const sorted = [...boxes].sort((left, right) => left.top - right.top);
  const rows: ChildBox[][] = [[sorted[0]]];

  for (let index = 1; index < sorted.length; index += 1) {
    const box = sorted[index];
    const currentRow = rows[rows.length - 1];
    const rowTop = Math.min(...currentRow.map((item) => item.top));
    const rowBottom = Math.max(...currentRow.map((item) => item.bottom));

    if (box.top >= rowBottom - threshold || Math.abs(box.top - rowTop) <= threshold) {
      currentRow.push(box);
    } else {
      rows.push([box]);
    }
  }

  return rows;
}

function measureGridGaps(container: HTMLElement, containerRect: DOMRect): SpacingRect[] {
  const boxes = getChildBoxes(container, containerRect);
  if (boxes.length < 2) return [];

  const gaps: SpacingRect[] = [];
  const rows = groupIntoRows(boxes);

  for (const row of rows) {
    const sorted = [...row].sort((left, right) => left.left - right.left);
    for (let index = 0; index < sorted.length - 1; index += 1) {
      pushHorizontalGap(gaps, sorted[index], sorted[index + 1]);
    }
  }

  for (let index = 0; index < rows.length - 1; index += 1) {
    const currentRow = rows[index];
    const nextRow = rows[index + 1];
    const currentBottom = Math.max(...currentRow.map((item) => item.bottom));
    const nextTop = Math.min(...nextRow.map((item) => item.top));
    const gapHeight = nextTop - currentBottom;
    if (gapHeight < 1) continue;

    gaps.push({
      x: Math.min(...currentRow.map((item) => item.left), ...nextRow.map((item) => item.left)),
      y: currentBottom,
      width:
        Math.max(...currentRow.map((item) => item.right), ...nextRow.map((item) => item.right)) -
        Math.min(...currentRow.map((item) => item.left), ...nextRow.map((item) => item.left)),
      height: gapHeight,
      kind: 'gap',
      size: Math.round(gapHeight),
      axis: 'vertical',
    });
  }

  return gaps;
}

function measurePaddingRects(
  width: number,
  height: number,
  paddingTop: number,
  paddingRight: number,
  paddingBottom: number,
  paddingLeft: number
): SpacingRect[] {
  const rects: SpacingRect[] = [];

  if (paddingTop > 0) {
    rects.push({
      x: 0,
      y: 0,
      width,
      height: paddingTop,
      kind: 'padding',
      size: paddingTop,
      axis: 'vertical',
      side: 'top',
    });
  }

  if (paddingRight > 0) {
    rects.push({
      x: width - paddingRight,
      y: 0,
      width: paddingRight,
      height,
      kind: 'padding',
      size: paddingRight,
      axis: 'horizontal',
      side: 'right',
    });
  }

  if (paddingBottom > 0) {
    rects.push({
      x: 0,
      y: height - paddingBottom,
      width,
      height: paddingBottom,
      kind: 'padding',
      size: paddingBottom,
      axis: 'vertical',
      side: 'bottom',
    });
  }

  if (paddingLeft > 0) {
    rects.push({
      x: 0,
      y: 0,
      width: paddingLeft,
      height,
      kind: 'padding',
      size: paddingLeft,
      axis: 'horizontal',
      side: 'left',
    });
  }

  return rects;
}

export function measureElement(element: HTMLElement): ElementMetrics {
  const rect = element.getBoundingClientRect();
  const styles = window.getComputedStyle(element);

  return {
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    paddingTop: parsePx(styles.paddingTop),
    paddingRight: parsePx(styles.paddingRight),
    paddingBottom: parsePx(styles.paddingBottom),
    paddingLeft: parsePx(styles.paddingLeft),
    gap: parsePx(styles.gap || '0'),
    rowGap: parsePx(styles.rowGap || styles.gap || '0'),
    columnGap: parsePx(styles.columnGap || styles.gap || '0'),
  };
}

export function measureGridGutterRects(
  width: number,
  height: number,
  gutters: GridGutter[]
): SpacingRect[] {
  return gutters
    .filter((gutter) => gutter.end > gutter.start)
    .map((gutter) => {
      const gutterWidth = ((gutter.end - gutter.start) / gutter.columns) * width;
      return {
        x: (gutter.start / gutter.columns) * width,
        y: 0,
        width: gutterWidth,
        height,
        kind: 'gutter' as const,
        size: Math.round(gutterWidth),
        axis: 'horizontal' as const,
      };
    });
}

export function measureSpacingRects(
  container: HTMLElement,
  gutters: GridGutter[] = []
): SpacingRect[] {
  const containerRect = container.getBoundingClientRect();
  const styles = window.getComputedStyle(container);
  const metrics = measureElement(container);
  const display = styles.display;

  const rects = measurePaddingRects(
    containerRect.width,
    containerRect.height,
    metrics.paddingTop,
    metrics.paddingRight,
    metrics.paddingBottom,
    metrics.paddingLeft
  );

  if (display.includes('flex')) {
    rects.push(...measureFlexGaps(container, containerRect, styles));
  } else if (display === 'grid' || display === 'inline-grid') {
    rects.push(...measureGridGaps(container, containerRect));
  }

  rects.push(...measureGridGutterRects(containerRect.width, containerRect.height, gutters));

  return rects;
}

export function getSpacingFillReveal(rect: SpacingRect): {
  reveal: 'x' | 'y';
  side?: SpacingRect['side'];
} {
  if (rect.kind === 'padding') {
    if (rect.side === 'left' || rect.side === 'right') {
      return { reveal: 'x', side: rect.side };
    }
    return { reveal: 'y', side: rect.side ?? 'top' };
  }

  // Horizontal flex/grid gap → vertical strip, reveal top → bottom
  if (rect.axis === 'horizontal') {
    return { reveal: 'y' };
  }

  // Vertical gap → horizontal band, reveal left → right
  return { reveal: 'x' };
}

export function guttersFromBoundaries(
  boundaries: number[],
  columns: number
): GridGutter[] {
  if (boundaries.length < 3) return [];

  const middle = boundaries.slice(1, -1);
  const gutters: GridGutter[] = [];

  if (middle.length === 1) {
    const line = middle[0];
    if (line > 0 && line < columns) {
      gutters.push({ start: line, end: line + 1, columns });
    }
    return gutters;
  }

  for (let index = 0; index < middle.length - 1; index += 2) {
    const start = middle[index];
    const end = middle[index + 1];
    if (end > start) {
      gutters.push({ start, end, columns });
    }
  }

  return gutters;
}
