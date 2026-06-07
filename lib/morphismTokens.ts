import type { MorphismVariant } from '@/types';

interface VariantTokens {
  surface: string;
  border: string;
  shadowIdle: string;
  shadowHover: string;
  shadowPressed: string;
  radius: string;
  focusRing: string;
  motionCharacter: string;
}

export const MORPHISM_TOKENS: Record<MorphismVariant, VariantTokens> = {
  clay: {
    surface: 'var(--clay-surface, linear-gradient(145deg, #c084fc, #7c3aed))',
    border: 'none',
    shadowIdle: 'var(--clay-shadow-idle)',
    shadowHover: 'var(--clay-shadow-hover)',
    shadowPressed: 'var(--clay-shadow-pressed)',
    radius: '1.5rem',
    focusRing: 'var(--focus-ring)',
    motionCharacter: 'spring-bouncy',
  },
  silicon: {
    surface: 'var(--silicon-surface)',
    border: 'var(--silicon-border)',
    shadowIdle: 'var(--silicon-specular)',
    shadowHover:
      'inset 0 1px 0 rgba(255,255,255,0.2), inset 1px 0 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.2)',
    shadowPressed:
      'inset 0 2px 4px rgba(0,0,0,0.3), inset 1px 0 0 rgba(255,255,255,0.05)',
    radius: 'var(--silicon-radius)',
    focusRing: '0 0 0 2px rgba(200,200,210,0.6)',
    motionCharacter: 'silicon-flicker',
  },
  glass: {
    surface: 'var(--glass-bg)',
    border: 'var(--glass-border)',
    shadowIdle: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
    shadowHover: '0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)',
    shadowPressed: '0 4px 16px rgba(0,0,0,0.08), inset 0 2px 4px rgba(0,0,0,0.1)',
    radius: '1.5rem',
    focusRing: '0 0 0 3px rgba(255,255,255,0.3)',
    motionCharacter: 'glass-shimmer',
  },
  gel: {
    surface: 'var(--gel-bulge)',
    border: '1px solid rgba(255,255,255,0.25)',
    shadowIdle: 'var(--gel-surface-tension), 0 8px 24px rgba(0,0,0,0.15)',
    shadowHover:
      'var(--gel-surface-tension), 0 12px 32px rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.1)',
    shadowPressed:
      'inset 0 3px 8px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.1)',
    radius: '20px',
    focusRing: '0 0 0 3px rgba(45, 212, 191, 0.5)',
    motionCharacter: 'gel-pulse',
  },
  paper: {
    surface: 'var(--paper-bg)',
    border: '1px solid rgba(0,0,0,0.06)',
    shadowIdle: 'var(--paper-inset), 0 2px 8px rgba(0,0,0,0.04)',
    shadowHover:
      'var(--paper-inset), 0 6px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
    shadowPressed: 'inset 0 2px 6px rgba(0,0,0,0.1)',
    radius: '2px',
    focusRing: '0 0 0 3px rgba(42, 37, 32, 0.3)',
    motionCharacter: 'paper-rustle',
  },
};

export function getVariantTokens(variant: MorphismVariant): VariantTokens {
  return MORPHISM_TOKENS[variant];
}
