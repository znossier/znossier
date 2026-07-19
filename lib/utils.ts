import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Reads computed --scroll-offset-nav (includes nav + ruler on desktop). */
export function getScrollOffsetNav(): number {
  if (typeof window === 'undefined') return 96;
  const styles = getComputedStyle(document.documentElement);
  const raw = styles.getPropertyValue('--scroll-offset-nav').trim();
  if (!raw) return 96;

  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;top:${raw}`;
  document.body.appendChild(probe);
  const px = probe.offsetTop;
  probe.remove();
  return px > 0 ? px : 96;
}

export function smoothScrollTo(elementId: string, offset?: number) {
  const resolvedOffset = offset ?? getScrollOffsetNav();
  const element = document.getElementById(elementId);
  if (element) {
    if (typeof window !== 'undefined' && window.lenis) {
      window.lenis.scrollTo(element, {
        offset: -resolvedOffset,
        duration: 1.2,
      });
    } else {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - resolvedOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}

export function smoothScrollToTop() {
  if (typeof window !== 'undefined' && window.lenis) {
    window.lenis.scrollTo(0, { duration: 1.2 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
