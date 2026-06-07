'use client';

import { useRef, useCallback, useEffect } from 'react';

interface SpringState {
  position: number;
  velocity: number;
  target: number;
}

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  precision?: number;
}

const DEFAULT_CONFIG: SpringConfig = {
  stiffness: 300,
  damping: 30,
  mass: 1,
  precision: 0.001,
};

export function usePhysicsSpring(config: Partial<SpringConfig> = {}) {
  const springConfig = useRef<SpringConfig>({ ...DEFAULT_CONFIG, ...config });
  const stateRef = useRef<SpringState>({ position: 0, velocity: 0, target: 0 });
  const rafRef = useRef<number | null>(null);
  const callbacksRef = useRef<Set<(pos: number, vel: number) => void>>(new Set());

  const animate = useCallback(() => {
    const { stiffness, damping, mass, precision } = springConfig.current;
    const state = stateRef.current;

    // Damped harmonic oscillator: F = -kx - cv
    const displacement = state.position - state.target;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * state.velocity;
    const acceleration = (springForce + dampingForce) / mass;

    // Semi-implicit Euler integration
    state.velocity += acceleration * 0.016; // ~60fps
    state.position += state.velocity * 0.016;

    // Notify subscribers
    callbacksRef.current.forEach(cb => cb(state.position, state.velocity));

    // Continue if not settled
    if (Math.abs(displacement) > (precision || 0.001) || Math.abs(state.velocity) > 0.01) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const setTarget = useCallback((target: number) => {
    stateRef.current.target = target;
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const setPosition = useCallback((position: number) => {
    stateRef.current.position = position;
    stateRef.current.velocity = 0;
  }, []);

  const subscribe = useCallback((callback: (pos: number, vel: number) => void) => {
    callbacksRef.current.add(callback);
    return () => {
      callbacksRef.current.delete(callback);
    };
  }, []);

  const updateConfig = useCallback((newConfig: Partial<SpringConfig>) => {
    springConfig.current = { ...springConfig.current, ...newConfig };
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    setTarget,
    setPosition,
    subscribe,
    updateConfig,
    getState: () => ({ ...stateRef.current }),
  };
}