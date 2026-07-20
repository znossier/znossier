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

export type SpacingLabelMode = 'inline' | 'hidden';

const LABEL_MIN_SIZE = 8;
const LABEL_MIN_ALONG = 20;
const LABEL_MIN_CROSS = 14;

function zoneFitsLabel(rect: SpacingRect): boolean {
  if (rect.size < LABEL_MIN_SIZE) return false;

  const along = rect.axis === 'horizontal' ? rect.width : rect.height;
  const cross = rect.axis === 'horizontal' ? rect.height : rect.width;

  return along >= LABEL_MIN_ALONG && cross >= LABEL_MIN_CROSS;
}

export function getSpacingLabelMode(rect: SpacingRect): SpacingLabelMode {
  if (!zoneFitsLabel(rect)) return 'hidden';

  // Vertical gaps/padding (stack spacing): show `Npx`. Horizontal row gaps: fill only.
  if (rect.axis === 'horizontal') return 'hidden';

  return 'inline';
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

function offsetGapRects(
  rects: SpacingRect[],
  element: HTMLElement,
  root: HTMLElement
): SpacingRect[] {
  const elementRect = element.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const dx = elementRect.left - rootRect.left;
  const dy = elementRect.top - rootRect.top;

  return rects.map((rect) => ({
    ...rect,
    x: rect.x + dx,
    y: rect.y + dy,
  }));
}

function measureNestedLayoutGaps(container: HTMLElement): SpacingRect[] {
  const gaps: SpacingRect[] = [];
  const elements = container.querySelectorAll<HTMLElement>('*');

  for (const element of elements) {
    if (element.dataset.spacingOverlay === 'true') continue;

    const styles = window.getComputedStyle(element);
    if (styles.display.includes('flex')) {
      gaps.push(
        ...offsetGapRects(
          measureFlexGaps(element, element.getBoundingClientRect(), styles),
          element,
          container
        )
      );
    } else if (styles.display === 'grid' || styles.display === 'inline-grid') {
      gaps.push(
        ...offsetGapRects(
          measureGridGaps(element, element.getBoundingClientRect()),
          element,
          container
        )
      );
    }
  }

  return gaps;
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

  const innerHeight = Math.max(0, height - paddingTop - paddingBottom);

  if (paddingRight > 0 && innerHeight > 0) {
    rects.push({
      x: width - paddingRight,
      y: paddingTop,
      width: paddingRight,
      height: innerHeight,
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

  if (paddingLeft > 0 && innerHeight > 0) {
    rects.push({
      x: 0,
      y: paddingTop,
      width: paddingLeft,
      height: innerHeight,
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
  const styles = window.getComputedStyle(container);
  const metrics = measureElement(container);
  const display = styles.display;
  const width = container.clientWidth;
  const height = container.clientHeight;

  const rects = measurePaddingRects(
    width,
    height,
    metrics.paddingTop,
    metrics.paddingRight,
    metrics.paddingBottom,
    metrics.paddingLeft
  );

  if (display.includes('flex')) {
    rects.push(...measureFlexGaps(container, container.getBoundingClientRect(), styles));
  } else if (display === 'grid' || display === 'inline-grid') {
    rects.push(...measureGridGaps(container, container.getBoundingClientRect()));
  }

  rects.push(...measureNestedLayoutGaps(container));
  rects.push(...measureGridGutterRects(width, height, gutters));

  // Figma Intro: row (horizontal-axis) gap fills extend up through the stack gap
  // above so magenta bands overlap / compound at the T-junctions.
  return extendRowGapsIntoStackGaps(rects);
}

/**
 * Stretch each horizontal-axis gap upward into any stack gap that sits flush
 * above it (same column range). Produces the darker 24×24 overlap squares in
 * Figma spacing inspect (e.g. Hero Intro between role → actions → buttons).
 */
function extendRowGapsIntoStackGaps(rects: SpacingRect[]): SpacingRect[] {
  const stackGaps = rects.filter((rect) => rect.kind === 'gap' && rect.axis === 'vertical');
  if (stackGaps.length === 0) return rects;

  return rects.map((rect) => {
    if (rect.kind !== 'gap' || rect.axis !== 'horizontal') return rect;

    const above = stackGaps.find(
      (stack) =>
        Math.abs(stack.y + stack.height - rect.y) <= 1 &&
        stack.x <= rect.x + 1 &&
        stack.x + stack.width >= rect.x + rect.width - 1
    );
    if (!above) return rect;

    return {
      ...rect,
      y: above.y,
      height: rect.height + above.height,
    };
  });
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
