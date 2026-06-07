/**
 * Named color-mix utilities to eliminate inline repetition.
 * All values use srgb color space.
 */

export function mixBlack(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${100 - percent}%, black)`;
}

export function mixWhite(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${100 - percent}%, white)`;
}

export function claySurface(color: string): string {
  return `linear-gradient(145deg, ${color}, ${mixBlack(color, 20)})`;
}

export function claySurfacePressed(color: string): string {
  return `linear-gradient(145deg, ${mixBlack(color, 20)}, ${mixBlack(color, 40)})`;
}

export function barGradient(color: string): string {
  return `linear-gradient(to top, ${color}, ${mixWhite(color, 50)})`;
}

export function glowShadow(color: string, alpha: number): string {
  return `0 0 30px ${color}, 0 0 60px rgba(${hexToRgb(color)}, ${alpha})`;
}

/** Convert 6-digit hex to comma-separated rgb values for rgba() usage. */
function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}
