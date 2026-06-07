'use client';

import { useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { useParticleBurst } from '@/hooks/useParticleBurst';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getVariantTokens } from '@/lib/morphismTokens';
import type { MorphismVariant } from '@/types';

interface MorphButtonProps {
  children: React.ReactNode;
  variant: MorphismVariant;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'default' | 'squircle' | 'circular';
  onClick?: () => void;
  className?: string;
  liquidFill?: boolean;
  ripple?: boolean;
  magnetic?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

export function MorphButton({
  children,
  variant,
  color = '#C084FC',
  size = 'md',
  shape = 'default',
  onClick,
  className,
  liquidFill = false,
  ripple = true,
  magnetic = false,
  disabled = false,
  'aria-label': ariaLabel,
}: MorphButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const { trigger: haptic } = useHaptic();
  const { burstFromElement } = useParticleBurst();
  const reducedMotion = useReducedMotion();
  const rippleIdRef = useRef(0);
  const tokens = getVariantTokens(variant);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const shapeClasses = {
    default: 'rounded-2xl',
    squircle: 'rounded-[30%_30%_30%_30%_/_50%_50%_50%_50%]',
    circular: 'rounded-full w-16 h-16 p-0 flex items-center justify-center',
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      setIsPressed(true);
      haptic('clayPress');

      if (ripple && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = ++rippleIdRef.current;
        setRipples((prev) => [...prev, { id, x, y }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }
    },
    [disabled, haptic, ripple]
  );

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (buttonRef.current) {
      burstFromElement(buttonRef.current, { color, count: 8 });
    }
    onClick?.();
  }, [disabled, onClick, burstFromElement, color]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!magnetic || !buttonRef.current || isPressed) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      buttonRef.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    },
    [magnetic, isPressed]
  );

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false);
    if (buttonRef.current) {
      buttonRef.current.style.transform = '';
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsPressed(true);
        haptic('clayPress');
      }
    },
    [haptic]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsPressed(false);
        handleClick();
      }
    },
    [handleClick]
  );

  const baseStyle: React.CSSProperties = {
    borderRadius: tokens.radius,
    boxShadow: isPressed ? tokens.shadowPressed : tokens.shadowIdle,
    transition: reducedMotion ? 'none' : 'box-shadow 0.2s ease',
  };

  if (variant === 'clay') {
    baseStyle.background = `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 80%, black))`;
    baseStyle.transform = isPressed ? 'translateY(4px) scale(0.92)' : undefined;
    baseStyle.filter = isPressed ? 'brightness(0.9) saturate(1.2)' : undefined;
  } else if (variant === 'silicon') {
    baseStyle.backgroundImage = `${tokens.surface}, var(--silicon-grain)`;
    baseStyle.border = tokens.border;
    baseStyle.transform = isPressed ? 'translateY(1px) scale(0.98)' : undefined;
  } else if (variant === 'glass') {
    baseStyle.background = tokens.surface;
    baseStyle.backdropFilter = 'var(--glass-blur)';
    baseStyle.WebkitBackdropFilter = 'var(--glass-blur)';
    baseStyle.border = tokens.border;
    baseStyle.transform = isPressed ? 'scale(0.97)' : undefined;
  } else if (variant === 'gel') {
    baseStyle.background = `${tokens.surface}, ${color}`;
    baseStyle.border = tokens.border;
    baseStyle.transform = isPressed ? 'scale(0.97)' : undefined;
  } else if (variant === 'paper') {
    baseStyle.background = tokens.surface;
    baseStyle.color = 'var(--paper-text)';
    baseStyle.border = tokens.border;
    baseStyle.transform = isPressed ? 'scale(0.98)' : undefined;
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'relative overflow-hidden border-none outline-none cursor-pointer select-none',
        'font-semibold',
        sizeClasses[size],
        shapeClasses[shape],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={baseStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      disabled={disabled}
      onFocus={(e) => {
        if (!reducedMotion) {
          e.currentTarget.style.boxShadow = `${isPressed ? tokens.shadowPressed : tokens.shadowIdle}, ${tokens.focusRing}`;
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = isPressed ? tokens.shadowPressed : tokens.shadowIdle;
      }}
    >
      {variant === 'glass' && !reducedMotion && (
        <div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none animate-glass-shimmer"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
        />
      )}

      {variant === 'silicon' && !reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none animate-silicon-flicker"
          style={{ background: 'var(--silicon-grain)' }}
        />
      )}

      {variant === 'gel' && !reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none animate-gel-pulse"
          style={{ background: 'var(--gel-bulge)' }}
        />
      )}

      {variant === 'paper' && !reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none animate-paper-rustle opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      )}

      {liquidFill && variant === 'clay' && (
        <span
          className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent transition-all duration-500 ease-out"
          style={{
            transform: isPressed ? 'translateY(0)' : 'translateY(100%)',
            borderRadius: 'inherit',
          }}
        />
      )}

      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full border-2 border-white/60 animate-ripple-expand pointer-events-none"
          style={{
            left: r.x,
            top: r.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
