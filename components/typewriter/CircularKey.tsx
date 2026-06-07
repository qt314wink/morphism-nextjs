'use client';

import { useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { useParticleBurst } from '@/hooks/useParticleBurst';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getVariantTokens } from '@/lib/morphismTokens';
import type { MorphismVariant } from '@/types';

interface CircularKeyProps {
  char: string;
  angle: number;
  radius: number;
  color: string;
  onType: (char: string) => void;
  variant?: MorphismVariant;
}

export function CircularKey({
  char,
  angle,
  radius,
  color,
  onType,
  variant = 'clay',
}: CircularKeyProps) {
  const keyRef = useRef<HTMLButtonElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const { trigger: haptic } = useHaptic();
  const { burstFromElement } = useParticleBurst();
  const reducedMotion = useReducedMotion();
  const tokens = getVariantTokens(variant);

  const centerX = 250;
  const centerY = 250;
  const x = centerX + Math.cos(angle) * radius - 28;
  const y = centerY + Math.sin(angle) * radius - 28;

  const handleClick = useCallback(() => {
    setIsPressed(true);
    haptic('light');
    onType(char);
    if (keyRef.current) {
      burstFromElement(keyRef.current, { color, count: 8 });
    }
    setTimeout(() => setIsPressed(false), 150);
  }, [char, color, onType, haptic, burstFromElement]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: 56,
    height: 56,
    borderRadius: '50%',
    boxShadow: isPressed ? tokens.shadowPressed : tokens.shadowIdle,
    transform: isPressed ? 'scale(0.9)' : undefined,
    transition: reducedMotion ? 'none' : 'box-shadow 0.15s ease',
  };

  if (variant === 'clay') {
    baseStyle.background = isPressed
      ? `linear-gradient(145deg, color-mix(in srgb, ${color} 80%, black), color-mix(in srgb, ${color} 60%, black))`
      : `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 80%, black))`;
    baseStyle.filter = isPressed ? 'brightness(0.85)' : undefined;
  } else if (variant === 'silicon') {
    baseStyle.backgroundImage = `${tokens.surface}, var(--silicon-grain)`;
    baseStyle.border = tokens.border;
  } else if (variant === 'glass') {
    baseStyle.background = tokens.surface;
    baseStyle.backdropFilter = 'var(--glass-blur)';
    baseStyle.border = tokens.border;
  } else if (variant === 'gel') {
    baseStyle.background = `${tokens.surface}, ${color}`;
    baseStyle.border = tokens.border;
  } else if (variant === 'paper') {
    baseStyle.background = tokens.surface;
    baseStyle.color = 'var(--paper-text)';
    baseStyle.border = tokens.border;
  }

  return (
    <button
      ref={keyRef}
      type="button"
      role="button"
      tabIndex={0}
      aria-label={`Type ${char}`}
      className={cn(
        'flex items-center justify-center',
        'font-bold text-lg font-mono text-white',
        'border-none outline-none cursor-pointer',
        'select-none hover:scale-110 hover:z-50',
        'focus-visible:ring-2 focus-visible:ring-offset-2'
      )}
      style={baseStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={(e) => {
        if (!reducedMotion) {
          e.currentTarget.style.boxShadow = `${isPressed ? tokens.shadowPressed : tokens.shadowIdle}, ${tokens.focusRing}`;
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = isPressed ? tokens.shadowPressed : tokens.shadowIdle;
      }}
    >
      <span
        className={cn(
          'absolute pointer-events-none font-extrabold text-4xl',
          'transition-all duration-300',
          isPressed ? 'opacity-100 -translate-y-20 scale-150' : 'opacity-0 translate-y-0 scale-50'
        )}
        style={{
          color: 'white',
          textShadow: `0 0 30px ${color}, 0 0 60px ${color}`,
        }}
      >
        {char}
      </span>

      <span className="relative z-10">{char}</span>
    </button>
  );
}
