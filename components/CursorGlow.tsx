'use client';

import { useRef, useEffect } from 'react';
import { usePhysicsSpring } from '@/hooks/usePhysicsSpring';

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const springX = usePhysicsSpring({ stiffness: 180, damping: 22, mass: 1.2 });
  const springY = usePhysicsSpring({ stiffness: 180, damping: 22, mass: 1.2 });

  useEffect(() => {
    if ('ontouchstart' in window) return;

    const glow = glowRef.current;
    if (!glow) return;

    springX.setPosition(0);
    springX.setTarget(0);
    springY.setPosition(0);
    springY.setTarget(0);

    const unsubscribeX = springX.subscribe((pos) => {
      glow.style.left = `${pos}px`;
    });

    const unsubscribeY = springY.subscribe((pos) => {
      glow.style.top = `${pos}px`;
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ('ontouchstart' in window) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      springX.setTarget(e.clientX);
      springY.setTarget(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleVisibility = () => {
      if (document.hidden) {
        // Springs will naturally settle when RAF stops being called
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [springX, springY]);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <div
      ref={glowRef}
      className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-50"
      style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
    />
  );
}
