import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function smoothScrollTo(elementId: string, offset: number = 80) {
  const element = document.getElementById(elementId);
  if (element) {
    // Check if Lenis is available (client-side)
    if (typeof window !== 'undefined' && window.lenis) {
      window.lenis.scrollTo(element, {
        offset: -offset,
        duration: 1.2,
      });
    } else {
      // Fallback to native smooth scroll
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}

export function smoothScrollToTop() {
  if (typeof window === 'undefined') return;

  if (window.lenis) {
    window.lenis.scrollTo(0, {
      duration: 1.2,
    });
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
