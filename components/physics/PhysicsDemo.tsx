'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MorphPanel } from '@/components/MorphPanel';

import { usePhysicsSpring } from '@/hooks/usePhysicsSpring';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface DemoCardProps {
  title: string;
  description: string;
  color: string;
  demoType: 'puff' | 'squish' | 'swell' | 'bounce';
}

function DemoCard({ title, description, color, demoType }: DemoCardProps) {
  const demoRef = useRef<HTMLDivElement>(null);
  const spring = usePhysicsSpring({ stiffness: 300, damping: 20, mass: 0.8 });
  const reducedMotion = useReducedMotion();
  const [isInteracting, setIsInteracting] = useState(false);

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

  const handleInteraction = useCallback(() => {
    if (reducedMotion) return;
    setIsInteracting(true);

    switch (demoType) {
      case 'puff':
        spring.setTarget(1.3);
        setTimeout(() => spring.setTarget(1), 400);
        break;
      case 'squish':
        if (demoRef.current) {
          demoRef.current.style.borderRadius = '30%';
        }
        spring.setTarget(0.5);
        setTimeout(() => {
          spring.setTarget(1);
          if (demoRef.current) {
            demoRef.current.style.borderRadius = '1rem';
          }
        }, 300);
        break;
      case 'swell':
        if (demoRef.current) {
          demoRef.current.style.filter = 'brightness(1.3)';
          demoRef.current.style.boxShadow = `0 0 50px ${color}80, 0 0 100px ${color}40`;
        }
        spring.setTarget(1.15);
        setTimeout(() => {
          spring.setTarget(1);
          if (demoRef.current) {
            demoRef.current.style.filter = 'brightness(1)';
            demoRef.current.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }
        }, 300);
        break;
      case 'bounce':
        spring.setTarget(1.1);
        setTimeout(() => spring.setTarget(1), 200);
        break;
    }

    setTimeout(() => setIsInteracting(false), 600);
  }, [demoType, spring, color, reducedMotion]);

  return (
    <MorphPanel variant="glass" className="text-center cursor-pointer" onClick={handleInteraction}>
      <div
        ref={demoRef}
        className={cn(
          'w-20 h-20 mx-auto mb-4 rounded-2xl shadow-lg',
          isInteracting && 'cursor-wait'
        )}
        style={{
          background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color}, black 30%))`,
          transform: reducedMotion ? 'scale(1)' : undefined,
        }}
      />
      <h3 className="text-white font-bold mb-1 capitalize">{title}</h3>
      <p className="text-white/50 text-xs">{description}</p>
    </MorphPanel>
  );
}

export function PhysicsDemo() {
  const [damping, setDamping] = useState(0.5);
  const demoRef = useRef<HTMLButtonElement>(null);
  const spring = usePhysicsSpring({ stiffness: 200, damping: 20, mass: 1 });
  const reducedMotion = useReducedMotion();

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

  const testDamping = useCallback(() => {
    if (reducedMotion) return;
    const stiffness = 1 - damping;
    spring.updateConfig({
      stiffness: 300 * stiffness + 50,
      damping: 30 * damping + 5,
      mass: 1,
    });
    spring.setTarget(0.8);
    setTimeout(() => spring.setTarget(1), 100);
  }, [damping, spring, reducedMotion]);

  const demos: DemoCardProps[] = [
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
          <DemoCard key={demo.title} {...demo} />
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
