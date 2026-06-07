'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MorphPanel } from '@/components/MorphPanel';
import { usePhysicsSpring } from '@/hooks/usePhysicsSpring';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

interface DemoCardProps {
  title: string;
  description: string;
  color: string;
  demoType: 'puff' | 'squish' | 'swell' | 'bounce';
  config: SpringConfig;
}

function DemoCard({ title, description, color, demoType, config }: DemoCardProps) {
  const demoRef = useRef<HTMLDivElement>(null);
  const spring = usePhysicsSpring(config);
  const reducedMotion = useReducedMotion();
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    spring.updateConfig(config);
  }, [config, spring]);

  useEffect(() => {
    spring.setPosition(1);
    spring.setTarget(1);
    const unsubscribe = spring.subscribe((pos) => {
      if (demoRef.current) {
        demoRef.current.style.transform = `scale(${pos})`;
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerPuff = useCallback(() => {
    if (reducedMotion) return;
    spring.setTarget(1.35);
  }, [spring, reducedMotion]);

  const releasePuff = useCallback(() => {
    spring.setTarget(1);
  }, [spring]);

  const triggerSquish = useCallback(() => {
    if (reducedMotion) return;
    if (demoRef.current) {
      demoRef.current.style.borderRadius = '30%';
    }
    spring.setTarget(0.5);
  }, [spring, reducedMotion]);

  const releaseSquish = useCallback(() => {
    spring.setTarget(1);
    if (demoRef.current) {
      demoRef.current.style.borderRadius = '1rem';
    }
  }, [spring]);

  const triggerSwell = useCallback(() => {
    if (reducedMotion) return;
    setIsGlowing(true);
    spring.setTarget(1.08);
  }, [spring, reducedMotion]);

  const releaseSwell = useCallback(() => {
    setIsGlowing(false);
    spring.setTarget(1);
  }, [spring]);

  const triggerBounce = useCallback(() => {
    if (reducedMotion) return;
    spring.setTarget(0.55);
    setTimeout(() => spring.setTarget(1.25), 100);
  }, [spring, reducedMotion]);

  const handleMouseEnter = useCallback(() => {
    if (demoType === 'puff') triggerPuff();
    if (demoType === 'swell') triggerSwell();
  }, [demoType, triggerPuff, triggerSwell]);

  const handleMouseLeave = useCallback(() => {
    if (demoType === 'puff') releasePuff();
    if (demoType === 'squish') releaseSquish();
    if (demoType === 'swell') releaseSwell();
  }, [demoType, releasePuff, releaseSquish, releaseSwell]);

  const handleMouseDown = useCallback(() => {
    if (demoType === 'squish') triggerSquish();
    if (demoType === 'bounce') triggerBounce();
  }, [demoType, triggerSquish, triggerBounce]);

  const handleMouseUp = useCallback(() => {
    if (demoType === 'squish') releaseSquish();
  }, [demoType, releaseSquish]);

  const handleClick = useCallback(() => {
    if (demoType === 'bounce') triggerBounce();
    if (demoType === 'puff') {
      triggerPuff();
      setTimeout(releasePuff, 500);
    }
    if (demoType === 'swell') {
      triggerSwell();
      setTimeout(releaseSwell, 500);
    }
  }, [demoType, triggerBounce, triggerPuff, releasePuff, triggerSwell, releaseSwell]);

  return (
    <MorphPanel variant="glass" className="text-center">
      <div
        className="w-full h-full cursor-pointer select-none py-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`${title} demo`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="w-20 h-20 mx-auto mb-4">
          <div
            ref={demoRef}
            className={cn(
              'w-full h-full rounded-2xl',
              'transition-[filter,box-shadow,border-radius] duration-500 ease-out'
            )}
            style={{
              background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color}, black 30%))`,
              boxShadow: isGlowing
                ? `0 0 16px ${color}30, 0 0 32px ${color}15, 0 4px 12px rgba(0,0,0,0.1)`
                : '0 4px 12px rgba(0,0,0,0.1)',
              filter: isGlowing ? 'brightness(1.06) saturate(1.15)' : 'brightness(1) saturate(1)',
            }}
          />
        </div>
        <h3 className="text-white font-bold mb-1 capitalize">{title}</h3>
        <p className="text-white/50 text-xs">{description}</p>
      </div>
    </MorphPanel>
  );
}

export function PhysicsDemo() {
  const [damping, setDamping] = useState(0.5);
  const sharedConfig = useMemo(
    () => ({
      stiffness: 300,
      damping: 5 + damping * 30,
      mass: 0.8,
    }),
    [damping]
  );

  const demoRef = useRef<HTMLButtonElement>(null);
  const testSpring = usePhysicsSpring(sharedConfig);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    testSpring.updateConfig(sharedConfig);
  }, [sharedConfig, testSpring]);

  useEffect(() => {
    testSpring.setPosition(1);
    testSpring.setTarget(1);
    const unsubscribe = testSpring.subscribe((pos) => {
      if (demoRef.current) {
        demoRef.current.style.transform = `scale(${pos})`;
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const testDamping = useCallback(() => {
    if (reducedMotion) return;
    testSpring.setTarget(0.65);
    setTimeout(() => testSpring.setTarget(1.2), 120);
  }, [testSpring, reducedMotion]);

  const demos: Omit<DemoCardProps, 'config'>[] = [
    { title: 'Puff', description: 'Inflate on hover', color: '#EC4899', demoType: 'puff' },
    { title: 'Squish', description: 'Compress on press', color: '#2DD4BF', demoType: 'squish' },
    { title: 'Swell', description: 'Glow & expand', color: '#FBBF24', demoType: 'swell' },
    { title: 'Bounce', description: 'Elastic spring back', color: '#34D399', demoType: 'bounce' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">Physics States Gallery</h2>
        <p className="text-white/50 text-sm">Interactive demonstrations of each morphic state</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {demos.map((demo) => (
          <DemoCard key={demo.title} {...demo} config={sharedConfig} />
        ))}
      </div>

      <MorphPanel variant="glass" className="mt-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Spring Damping Control</h3>
          <span className="text-white/60 text-sm font-mono">{damping.toFixed(1)}</span>
        </div>

        <input
          type="range"
          min={0.1}
          max={1}
          step={0.1}
          value={damping}
          onChange={(e) => setDamping(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-teal-400"
          aria-label="Spring damping control"
        />

        <div className="flex justify-between text-white/40 text-xs mt-2 font-mono">
          <span>Bouncy (0.1)</span>
          <span>Damped (1.0)</span>
        </div>

        <div className="flex justify-center mt-6">
          <motion.button
            ref={demoRef}
            className={cn(
              'w-24 h-24 rounded-2xl text-2xl font-bold text-white',
              'border-none outline-none cursor-pointer',
              'flex items-center justify-center'
            )}
            style={{
              background:
                'linear-gradient(145deg, #A78BFA, color-mix(in srgb, #A78BFA, black 30%))',
              boxShadow:
                '0 12px 24px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.1), inset 0 4px 8px rgba(255,255,255,0.3)',
            }}
            onClick={testDamping}
            whileTap={reducedMotion ? undefined : { scale: 0.95 }}
            aria-label="Test spring damping"
          >
            Test
          </motion.button>
        </div>
      </MorphPanel>
    </div>
  );
}
