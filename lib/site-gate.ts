/**
 * Production gate — when true, the public site shows only the boot loader
 * then an under-construction empty screen (no portfolio UI).
 *
 * Override with NEXT_PUBLIC_SITE_GATE:
 *   - "construction" → force on (local preview)
 *   - "open"         → force off (even on Vercel production)
 * Default: on when NEXT_PUBLIC_VERCEL_ENV === "production"
 */
export function isSiteUnderConstruction(): boolean {
  const gate = process.env.NEXT_PUBLIC_SITE_GATE;
  if (gate === 'open') return false;
  if (gate === 'construction') return true;
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
}
