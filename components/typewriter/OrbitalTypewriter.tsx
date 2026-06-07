'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { CircularKey } from './CircularKey';
import { TypewriterScreen } from './TypewriterScreen';
import { MorphButton } from '@/components/MorphButton';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useHaptic } from '@/hooks/useHaptic';
import { usePhysicsSpring } from '@/hooks/usePhysicsSpring';
import { NOTE_COLORS, WHITE_NOTES } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const TYPEWRITER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function OrbitalTypewriter() {
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tickIndex, setTickIndex] = useState<number | null>(null);

  const rotationSpring = usePhysicsSpring({ stiffness: 80, damping: 8, mass: 2 });
  const dialRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dragStartAngleRef = useRef(0);
  const rotationAtDragStartRef = useRef(0);
  const lastTickIndexRef = useRef<number | null>(null);
  const tickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);

  const { playTypeSound, playTickSound, resume } = useAudioEngine();
  const { trigger: haptic } = useHaptic();
  const reducedMotion = useReducedMotion();

  const radius = 200;
  const angleStep = (Math.PI * 2) / TYPEWRITER_CHARS.length;

  // Apply rotation directly to the ring ref to avoid re-rendering children every frame
  useEffect(() => {
    const unsubscribe = rotationSpring.subscribe((rotation) => {
      if (ringRef.current && !reducedMotion) {
        ringRef.current.style.transform = `rotate(${rotation}rad)`;
      }

      const N = TYPEWRITER_CHARS.length;
      const rawIndex = -rotation / angleStep;
      const topIndex = ((Math.round(rawIndex) % N) + N) % N;

      if (lastTickIndexRef.current !== null && lastTickIndexRef.current !== topIndex) {
        playTickSound();
        haptic('light');
        setTickIndex(topIndex);
        if (tickTimeoutRef.current) clearTimeout(tickTimeoutRef.current);
        tickTimeoutRef.current = setTimeout(() => setTickIndex((prev) => (prev === topIndex ? null : prev)), 100);
      }
      lastTickIndexRef.current = topIndex;
    });
    return () => {
      unsubscribe();
      if (tickTimeoutRef.current) clearTimeout(tickTimeoutRef.current);
    };
  }, [rotationSpring, playTickSound, haptic, angleStep, reducedMotion]);

  const getAngleFromPoint = useCallback((clientX: number, clientY: number) => {
    const rect = dialRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx);
  }, []);

  const findHoveredIndex = useCallback(
    (clientX: number, clientY: number) => {
      const angle = getAngleFromPoint(clientX, clientY);
      const rotation = rotationSpring.getState().position;
      const relativeAngle = angle - rotation;

      let closestIndex = 0;
      let closestDist = Infinity;

      for (let i = 0; i < TYPEWRITER_CHARS.length; i++) {
        const charAngle = i * angleStep - Math.PI / 2;
        let diff = Math.abs(relativeAngle - charAngle);
        while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
        if (diff < closestDist) {
          closestDist = diff;
          closestIndex = i;
        }
      }

      return closestDist < 0.35 ? closestIndex : null;
    },
    [getAngleFromPoint, rotationSpring, angleStep]
  );

  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      lastTickIndexRef.current = null;
      const angle = getAngleFromPoint(clientX, clientY);
      dragStartAngleRef.current = angle;
      rotationAtDragStartRef.current = rotationSpring.getState().position;
      resume();
    },
    [getAngleFromPoint, rotationSpring, resume]
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (isDraggingRef.current) {
        const angle = getAngleFromPoint(clientX, clientY);
        const delta = angle - dragStartAngleRef.current;
        const newRotation = rotationAtDragStartRef.current + delta;
        rotationSpring.setPosition(newRotation);
        rotationSpring.setTarget(newRotation);
      } else {
        setHoveredIndex(findHoveredIndex(clientX, clientY));
      }
    },
    [getAngleFromPoint, rotationSpring, findHoveredIndex]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const rotation = rotationSpring.getState().position;
    const N = TYPEWRITER_CHARS.length;
    const rawIndex = -rotation / angleStep;
    const topIndex = ((Math.round(rawIndex) % N) + N) % N;

    setText((prev) => prev + TYPEWRITER_CHARS[topIndex]);
    playTypeSound();
    haptic('medium');

    rotationSpring.setTarget(0);
  }, [rotationSpring, angleStep, playTypeSound, haptic]);

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientX, e.clientY);
    },
    [handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
    },
    [handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    },
    [handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Global mouse up to catch drags that leave the dial
  useEffect(() => {
    if (!isDragging) return;
    const onGlobalMouseUp = () => handleDragEnd();
    window.addEventListener('mouseup', onGlobalMouseUp);
    return () => window.removeEventListener('mouseup', onGlobalMouseUp);
  }, [isDragging, handleDragEnd]);

  const handleClear = useCallback(() => {
    setText('');
    haptic('medium');
  }, [haptic]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orbital-typewriter.txt';
    a.click();
    URL.revokeObjectURL(url);
    haptic('success');
  }, [text, haptic]);

  const handleSpeak = useCallback(() => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text || 'Hello from the orbital typewriter');
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  }, [text]);

  // Keyboard support (direct typing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      if (TYPEWRITER_CHARS.includes(char)) {
        setText((prev) => prev + char);
        playTypeSound();
        haptic('light');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playTypeSound, haptic]);

  return (
    <div className="max-w-2xl mx-auto select-none">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">Radial Dial Typewriter</h2>
        <p className="text-white/50 text-sm">
          Drag to wind the dial, release to type. Or just use your keyboard.
        </p>
      </div>

      <div
        ref={dialRef}
        className="relative w-[500px] h-[500px] mx-auto touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-white/10"
          style={{
            boxShadow:
              'inset 0 0 60px rgba(255,255,255,0.05), 0 0 80px rgba(255,255,255,0.03)',
          }}
        />

        {/* Selection indicator at 12 o'clock */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div
            className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white/70"
            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}
          />
        </div>

        {/* Inner glow */}
        <div
          className="absolute inset-5 rounded-full animate-ring-pulse pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Rotating ring with keys */}
        <div ref={ringRef} className="absolute inset-0">
          {TYPEWRITER_CHARS.split('').map((char, i) => {
            const angle = i * angleStep - Math.PI / 2;
            return (
              <CircularKey
                key={char}
                char={char}
                angle={angle}
                radius={radius}
                color={NOTE_COLORS[WHITE_NOTES[i % WHITE_NOTES.length]]}
                isHovered={hoveredIndex === i}
                isTicking={tickIndex === i}
                onType={(c) => {
                  setText((prev) => prev + c);
                  playTypeSound();
                  haptic('light');
                }}
              />
            );
          })}
        </div>

        <TypewriterScreen text={text} />
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <MorphButton variant="clay" color="#FB7185" onClick={handleClear} size="sm">
          Clear
        </MorphButton>
        <MorphButton variant="clay" color="#FBBF24" onClick={handleDownload} size="sm">
          Export
        </MorphButton>
        <MorphButton variant="clay" color="#34D399" onClick={handleSpeak} size="sm">
          Speak
        </MorphButton>
      </div>
    </div>
  );
}
