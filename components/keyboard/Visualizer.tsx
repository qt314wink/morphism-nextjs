'use client';

import { useRef, useEffect, useCallback } from 'react';
import { NOTE_COLORS, WHITE_NOTES } from '@/lib/utils';

interface VisualizerProps {
  activeNote: string | null;
}

export function Visualizer({ activeNote }: VisualizerProps) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<
    Array<{ index: number; height: number; color: string; delay: number; startTime: number }>
  >([]);

  const scheduleBar = useCallback(
    (index: number, height: number, color: string, delay: number) => {
      const startTime = performance.now() + delay;
      pendingRef.current.push({ index, height, color, delay, startTime });
    },
    []
  );

  useEffect(() => {
    const animate = (now: number) => {
      pendingRef.current = pendingRef.current.filter((item) => {
        const bar = barsRef.current[item.index];
        if (!bar) return false;

        if (now >= item.startTime && now < item.startTime + 200) {
          bar.style.height = `${item.height}px`;
          bar.style.background = `linear-gradient(to top, ${item.color}, color-mix(in srgb, ${item.color} 50%, white))`;
          bar.style.boxShadow = `0 0 10px ${item.color}`;
          return true;
        }

        if (now >= item.startTime + 200) {
          bar.style.height = '4px';
          bar.style.background = `linear-gradient(to top, ${NOTE_COLORS[WHITE_NOTES[item.index % WHITE_NOTES.length]]}, color-mix(in srgb, ${NOTE_COLORS[WHITE_NOTES[item.index % WHITE_NOTES.length]]} 50%, white))`;
          bar.style.boxShadow = '';
          return false;
        }

        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!activeNote) return;

    const noteIndex = WHITE_NOTES.indexOf(activeNote.replace('#', ''));
    if (noteIndex === -1) return;

    const targetIndex = Math.floor(noteIndex * 2.5);
    const color = NOTE_COLORS[activeNote] || NOTE_COLORS['C'];

    barsRef.current.forEach((_, i) => {
      const distance = Math.abs(i - targetIndex);
      const height = Math.max(4, 60 - distance * 8);
      const delay = distance * 30;
      scheduleBar(i, height, color, delay);
    });
  }, [activeNote, scheduleBar]);

  return (
    <div className="flex items-end justify-center gap-1 h-[60px] mb-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            barsRef.current[i] = el;
          }}
          className="w-1.5 rounded-full transition-all duration-100"
          style={{
            height: 4,
            background: `linear-gradient(to top, ${NOTE_COLORS[WHITE_NOTES[i % WHITE_NOTES.length]]}, color-mix(in srgb, ${NOTE_COLORS[WHITE_NOTES[i % WHITE_NOTES.length]]} 50%, white))`,
          }}
        />
      ))}
    </div>
  );
}
