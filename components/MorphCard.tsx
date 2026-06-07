'use client';

import { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { getVariantTokens } from '@/lib/morphismTokens';
import type { MorphismVariant } from '@/types';

interface MorphCardProps {
  children: React.ReactNode;
  variant: MorphismVariant;
  color?: string;
  squircle?: boolean;
  tilt?: boolean;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

export function MorphCard({
  children,
  variant,
  color = '#D6A2FF',
  squircle = false,
  tilt = false,
  className,
  onClick,
  'aria-label': ariaLabel,
}: MorphCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tokens = getVariantTokens(variant);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!tilt || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    },
    [tilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }
  }, []);

  const baseStyle: React.CSSProperties = {
    borderRadius: squircle ? '40% / 60%' : tokens.radius,
    boxShadow: tokens.shadowIdle,
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  };

  if (variant === 'clay') {
    baseStyle.background = color;
  } else if (variant === 'silicon') {
    baseStyle.backgroundImage = `${tokens.surface}, var(--silicon-grain)`;
    baseStyle.border = tokens.border;
  } else if (variant === 'glass') {
    baseStyle.background = tokens.surface;
    baseStyle.backdropFilter = 'var(--glass-blur)';
    baseStyle.WebkitBackdropFilter = 'var(--glass-blur)';
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
    <div
      ref={cardRef}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      className={cn(
        'relative p-8 cursor-pointer',
        'transition-all duration-300',
        className
      )}
      style={baseStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `${tokens.shadowIdle}, ${tokens.focusRing}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = tokens.shadowIdle;
      }}
    >
      {variant === 'clay' && (
        <div
          className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none rounded-t-[inherit]"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
          }}
        />
      )}

      {variant === 'glass' && (
        <div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none animate-glass-shimmer"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
        />
      )}

      {variant === 'silicon' && (
        <div
          className="absolute inset-0 pointer-events-none animate-silicon-flicker rounded-[inherit]"
          style={{ background: 'var(--silicon-grain)' }}
        />
      )}

      {variant === 'gel' && (
        <div
          className="absolute inset-0 pointer-events-none animate-gel-pulse rounded-[inherit]"
          style={{ background: 'var(--gel-bulge)' }}
        />
      )}

      {variant === 'paper' && (
        <div
          className="absolute inset-0 pointer-events-none animate-paper-rustle opacity-40 rounded-[inherit]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
