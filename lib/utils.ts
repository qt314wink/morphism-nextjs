import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export const NOTE_FREQUENCIES: Record<string, number> = {
  C: 261.63, 'C#': 277.18, D: 293.66, 'D#': 311.13,
  E: 329.63, F: 349.23, 'F#': 369.99, G: 392.0,
  'G#': 415.3, A: 440.0, 'A#': 466.16, B: 493.88,
  C5: 523.25,
};

export const NOTE_COLORS: Record<string, string> = {
  C: '#FF6B9D', 'C#': '#FF8FAB', D: '#C084FC', 'D#': '#A78BFA',
  E: '#60A5FA', F: '#2DD4BF', 'F#': '#34D399', G: '#FBBF24',
  'G#': '#F59E0B', A: '#FB7185', 'A#': '#F472B6', B: '#EC4899',
  C5: '#FF6B9D',
};

export const KEYBOARD_MAP: Record<string, string> = {
  a: 'C', w: 'C#', s: 'D', e: 'D#', d: 'E',
  f: 'F', t: 'F#', g: 'G', y: 'G#', h: 'A',
  u: 'A#', j: 'B', k: 'C5',
};

export const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C5'];
export const BLACK_NOTES = ['C#', 'D#', null, 'F#', 'G#', 'A#', null];

export const SPRING_EASINGS = {
  bouncy: [0.34, 1.56, 0.64, 1] as const,
  heavy: [0.68, -0.55, 0.265, 1.55] as const,
  gentle: [0.25, 0.46, 0.45, 0.94] as const,
  elastic: [0.68, -0.6, 0.32, 1.6] as const,
  damped: [0.175, 0.885, 0.32, 1.275] as const,
};

export function getCubicBezier(easing: keyof typeof SPRING_EASINGS): string {
  const [x1, y1, x2, y2] = SPRING_EASINGS[easing];
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}
