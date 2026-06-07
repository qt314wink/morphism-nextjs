'use client';

import { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { useParticleBurst } from '@/hooks/useParticleBurst';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CircularKeyProps {
  char: string;
  angle: number;
  radius: number;
  color: string;
  isHovered: boolean;
  isTicking: boolean;
  onType: (char: string) => void;
}

export function CircularKey({
  char,
  angle,
  radius,
  color,
  isHovered,
  isTicking,
  onType,
}: CircularKeyProps) {
  const keyRef = useRef<HTMLButtonElement>(null);
  const { trigger: haptic } = useHaptic();
  const { burstFromElement } = useParticleBurst();
  const reducedMotion = useReducedMotion();

  const size = 44;
  const hoverOffset = isHovered ? 14 : 0;
  const x = 250 + Math.cos(angle) * (radius + hoverOffset) - size / 2;
  const y = 250 + Math.sin(angle) * (radius + hoverOffset) - size / 2;

  const handleClick = useCallback(() => {
    haptic('light');
    onType(char);
    if (keyRef.current) {
      burstFromElement(keyRef.current, { color, count: 8 });
    }
  }, [char, color, onType, haptic, burstFromElement]);

  return (
    <button
      ref={keyRef}
      type="button"
      className={cn(
        'absolute flex items-center justify-center',
        'rounded-full border-none outline-none cursor-pointer',
        'font-bold font-mono text-white select-none',
        'focus-visible:ring-2 focus-visible:ring-white/50'
      )}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: isTicking
          ? 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0.5))'
          : `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color}, black 20%))`,
        boxShadow: isHovered
          ? `0 0 24px ${color}50, 0 10px 30px rgba(0,0,0,0.35), inset 0 2px 6px rgba(255,255,255,0.35)`
          : isTicking
            ? `0 0 16px rgba(255,255,255,0.6), 0 4px 12px rgba(0,0,0,0.2)`
            : `0 4px 12px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.2)`,
        transform: `scale(${isHovered ? 1.3 : isTicking ? 1.2 : 1})`,
        transition: reducedMotion
          ? 'none'
          : 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease, background 0.1s ease',
        zIndex: isHovered ? 20 : isTicking ? 15 : 1,
        fontSize: isHovered ? 18 : 14,
        color: isTicking ? '#1a1a2e' : 'white',
        textShadow: isHovered ? `0 0 8px ${color}` : 'none',
      }}
      onClick={handleClick}
      aria-label={`Type ${char}`}
    >
      {char}
    </button>
  );
}
