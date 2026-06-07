'use client';

import { useCallback, useRef, useEffect } from 'react';
import type { ParticleConfig } from '@/types';

interface Particle {
  element: HTMLDivElement;
  inUse: boolean;
}

const POOL_SIZE = 30;

export function useParticleBurst() {
  const poolRef = useRef<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-50';
    container.setAttribute('aria-hidden', 'true');
    container.setAttribute('role', 'presentation');
    document.body.appendChild(container);
    containerRef.current = container;

    // Pre-allocate pool
    for (let i = 0; i < POOL_SIZE; i++) {
      const element = document.createElement('div');
      element.className = 'absolute rounded-full pointer-events-none';
      element.style.display = 'none';
      container.appendChild(element);
      poolRef.current.push({ element, inUse: false });
    }

    return () => {
      container.remove();
      poolRef.current = [];
    };
  }, []);

  const burstFromElement = useCallback(
    (element: HTMLElement, config?: Partial<ParticleConfig>) => {
      const {
        count = 12,
        spread = 140,
        decay = 0.6,
        color = '#FF6B9D',
      } = config ?? {};

      const rect = element.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      let spawned = 0;
      for (let i = 0; i < poolRef.current.length && spawned < count; i++) {
        const particle = poolRef.current[i];
        if (particle.inUse) continue;

        particle.inUse = true;
        spawned++;

        const angle = (Math.PI * 2 * spawned) / count;
        const velocity = spread * 0.5 + Math.random() * spread * 0.5;
        const size = 4 + Math.random() * 4;

        const el = particle.element;
        el.style.display = 'block';
        el.style.left = `${cx}px`;
        el.style.top = `${cy}px`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.background = color;
        el.style.boxShadow = `0 0 10px ${color}`;
        el.style.opacity = '1';
        el.style.transform = 'translate(0, 0) scale(1)';
        el.style.transition = 'none';

        // Force reflow
        void el.offsetWidth;

        const duration = (decay + Math.random() * 0.3) * 1000;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        el.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
        el.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
        el.style.opacity = '0';

        setTimeout(() => {
          el.style.display = 'none';
          particle.inUse = false;
        }, duration);
      }
    },
    []
  );

  return { burstFromElement };
}
