type HeroPortraitFocusStop = {
  minWidth: number;
  x: number;
  y: number;
};

export const heroPortraitFocusStops: HeroPortraitFocusStop[] = [
  { minWidth: 1280, x: 66, y: 38 },
  { minWidth: 1024, x: 62, y: 38 },
  { minWidth: 768, x: 58, y: 38 },
  { minWidth: 640, x: 54, y: 36 },
  { minWidth: 0, x: 50, y: 36 },
];

export function getHeroPortraitFocus(viewportWidth: number) {
  return heroPortraitFocusStops.find((stop) => viewportWidth >= stop.minWidth) ?? heroPortraitFocusStops.at(-1)!;
}

export function getHeroPortraitObjectPosition(viewportWidth: number) {
  const focus = getHeroPortraitFocus(viewportWidth);
  return `${focus.x}% ${focus.y}%`;
}
