'use client';

import { cn } from '@/lib/utils';
import { getVariantTokens } from '@/lib/morphismTokens';
import type { MorphismVariant } from '@/types';

interface MorphPanelProps {
  children: React.ReactNode;
  variant: MorphismVariant;
  className?: string;
  blur?: number;
  shimmer?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function MorphPanel({
  children,
  variant,
  className,
  blur = 20,
  shimmer = true,
  onClick,
}: MorphPanelProps) {
  const tokens = getVariantTokens(variant);

  const baseStyle: React.CSSProperties = {
    borderRadius: tokens.radius,
    boxShadow: tokens.shadowIdle,
  };

  if (variant === 'glass') {
    baseStyle.background = tokens.surface;
    baseStyle.backdropFilter = `blur(${blur}px) saturate(180%)`;
    baseStyle.WebkitBackdropFilter = `blur(${blur}px) saturate(180%)`;
    baseStyle.border = tokens.border;
  } else if (variant === 'silicon') {
    baseStyle.backgroundImage = `${tokens.surface}, var(--silicon-grain)`;
    baseStyle.border = tokens.border;
  } else if (variant === 'clay') {
    baseStyle.background = 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))';
    baseStyle.border = '1px solid rgba(255,255,255,0.1)';
  } else if (variant === 'gel') {
    baseStyle.background = tokens.surface;
    baseStyle.border = tokens.border;
  } else if (variant === 'paper') {
    baseStyle.background = tokens.surface;
    baseStyle.color = 'var(--paper-text)';
    baseStyle.border = tokens.border;
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden p-8',
        onClick && 'cursor-pointer',
        className
      )}
      style={baseStyle}
      onClick={onClick}
      onFocus={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = `${tokens.shadowIdle}, ${tokens.focusRing}`;
        }
      }}
      onBlur={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = tokens.shadowIdle;
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      {variant === 'glass' && shimmer && (
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
