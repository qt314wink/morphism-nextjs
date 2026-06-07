'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { NOTE_COLORS } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { useParticleBurst } from '@/hooks/useParticleBurst';
import { usePhysicsSpring } from '@/hooks/usePhysicsSpring';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getVariantTokens } from '@/lib/morphismTokens';
import type { MorphismVariant } from '@/types';

interface MorphKeyProps {
  note: string;
  keyboardKey: string;
  isBlack?: boolean;
  onPress: (note: string) => void;
  onRelease: (note: string) => void;
  isSustaining: boolean;
  variant?: MorphismVariant;
}

export function MorphKey({
  note,
  keyboardKey,
  isBlack = false,
  onPress,
  onRelease,
  isSustaining,
  variant = 'clay',
}: MorphKeyProps) {
  const keyRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressedLocal, setIsPressedLocal] = useState(false);
  const { trigger: haptic } = useHaptic();
  const { burstFromElement } = useParticleBurst();
  const reducedMotion = useReducedMotion();
  const color = NOTE_COLORS[note] || '#FF6B9D';
  const tokens = getVariantTokens(variant);

  const spring = usePhysicsSpring({ stiffness: 320, damping: 18, mass: 0.6 });

  useEffect(() => {
    spring.setPosition(1);
    spring.setTarget(1);
    const unsubscribe = spring.subscribe((pos) => {
      if (keyRef.current) {
        keyRef.current.style.transform = `scaleY(${pos})`;
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePress = useCallback(() => {
    setIsPressedLocal(true);
    haptic('clayPress');
    onPress(note);
    spring.setTarget(0.92);
    if (keyRef.current) {
      burstFromElement(keyRef.current, { color, count: 12 });
    }
  }, [note, onPress, haptic, burstFromElement, color, spring]);

  const handleRelease = useCallback(() => {
    setIsPressedLocal(false);
    spring.setTarget(1);
    if (!isSustaining) {
      onRelease(note);
    }
  }, [note, onRelease, isSustaining, spring]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePress();
      }
    },
    [handlePress]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleRelease();
      }
    },
    [handleRelease]
  );

  if (isBlack) {
    return (
      <button
        ref={keyRef}
        type="button"
        role="button"
        aria-pressed={isPressedLocal}
        tabIndex={0}
        aria-label={`${note} sharp key`}
        className={cn(
          'absolute top-0 left-1/2 -translate-x-1/2 z-10',
          'w-10 h-[120px] rounded-b-xl cursor-pointer',
          'flex items-end justify-center pb-3',
          'border-none outline-none select-none'
        )}
        style={{
          background: isPressedLocal
            ? 'linear-gradient(145deg, #1a1a2e, #0f0f1a)'
            : 'linear-gradient(145deg, #2a2a3a, #1a1a2e)',
          boxShadow: isPressedLocal
            ? 'inset 0 4px 8px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)'
            : '0 8px 16px rgba(0,0,0,0.4), inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.05)',
          transform: reducedMotion && isPressedLocal ? 'translateY(1px) scale(0.95)' : undefined,
          transition: reducedMotion ? 'all 0.1s ease' : 'none',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handlePress();
        }}
        onMouseUp={handleRelease}
        onMouseLeave={() => {
          setIsHovered(false);
          handleRelease();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onTouchStart={(e) => {
          e.stopPropagation();
          handlePress();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          handleRelease();
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `${e.currentTarget.style.boxShadow}, ${tokens.focusRing}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = isPressedLocal
            ? 'inset 0 4px 8px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)'
            : '0 8px 16px rgba(0,0,0,0.4), inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.05)';
        }}
      >
        <span className="text-white/50 text-xs font-mono">{note}</span>
      </button>
    );
  }

  return (
    <button
      ref={keyRef}
      type="button"
      role="button"
      aria-pressed={isPressedLocal}
      tabIndex={0}
      aria-label={`${note} key`}
      className={cn(
        'relative flex flex-col items-center justify-end pb-5',
        'w-16 h-[200px] rounded-b-2xl border-none outline-none',
        'cursor-pointer select-none'
      )}
      style={{
        background: isPressedLocal
          ? `linear-gradient(145deg, color-mix(in srgb, ${color} 80%, black), color-mix(in srgb, ${color} 60%, black))`
          : `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 80%, black))`,
        boxShadow: isPressedLocal
          ? `inset 0 4px 12px rgba(0,0,0,0.25), inset 0 2px 6px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.2)`
          : `0 -4px 12px rgba(255,255,255,0.4), 0 12px 24px -4px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.15), inset 0 -6px 16px rgba(0,0,0,0.15), inset 0 6px 16px rgba(255,255,255,0.35), inset 0 1px 2px rgba(255,255,255,0.5)`,
        filter: isHovered && !isPressedLocal ? 'brightness(1.1)' : undefined,
        transform: reducedMotion && isPressedLocal ? 'scaleY(0.92)' : undefined,
        transition: reducedMotion ? 'filter 0.15s ease, box-shadow 0.15s ease' : 'filter 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={() => {
        setIsHovered(false);
        handleRelease();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onFocus={(e) => {
        if (!reducedMotion) {
          e.currentTarget.style.boxShadow = `${e.currentTarget.style.boxShadow}, ${tokens.focusRing}`;
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = isPressedLocal
          ? `inset 0 4px 12px rgba(0,0,0,0.25), inset 0 2px 6px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.2)`
          : `0 -4px 12px rgba(255,255,255,0.4), 0 12px 24px -4px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.15), inset 0 -6px 16px rgba(0,0,0,0.15), inset 0 6px 16px rgba(255,255,255,0.35), inset 0 1px 2px rgba(255,255,255,0.5)`;
      }}
    >
      <span className="absolute top-5 text-white/70 text-xs font-mono">{note}</span>

      <span
        className="absolute bottom-10 w-2 h-2 rounded-full transition-all duration-300"
        style={{
          background: isPressedLocal ? 'white' : 'rgba(255,255,255,0.3)',
          boxShadow: isPressedLocal
            ? `0 0 30px white, 0 0 60px ${color}`
            : '0 0 10px rgba(255,255,255,0.3)',
          transform: isPressedLocal ? 'scale(2)' : 'scale(1)',
        }}
      />

      <span className="relative z-10 text-white font-semibold text-sm">{keyboardKey}</span>

      {isPressedLocal && (
        <span className="absolute inset-0 rounded-[inherit] border-2 border-white/60 animate-ripple-expand pointer-events-none" />
      )}
    </button>
  );
}
