'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterScreenProps {
  text: string;
}

export function TypewriterScreen({ text }: TypewriterScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [text]);

  const displayText = text.slice(-80);

  return (
    <div
      className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'w-[280px] h-[280px] rounded-full',
        'flex flex-col items-center justify-center',
        'p-10 text-center overflow-hidden',
        'border border-white/15'
      )}
      style={{
        background: 'linear-gradient(145deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
        backdropFilter: 'blur(10px)',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.05)',
      }}
    >
      <div
        className="absolute inset-0 rounded-full animate-screen-rotate pointer-events-none opacity-30"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.03) 60deg, transparent 120deg, rgba(255,255,255,0.03) 180deg, transparent 240deg, rgba(255,255,255,0.03) 300deg, transparent 360deg)',
        }}
      />

      <div
        ref={screenRef}
        className="relative z-10 font-mono text-sm leading-relaxed text-white/80 max-h-[200px] overflow-y-auto w-full break-all"
      >
        {displayText ? (
          displayText.split('').map((char, i) => (
            <span
              key={`${i}-${char}`}
              className="inline-block animate-char-pop"
              style={{ animationDelay: `${i * 0.01}s` }}
            >
              {char}
            </span>
          ))
        ) : (
          <span className="text-white/40">Start typing...</span>
        )}
        <span className="inline-block w-2 h-4 bg-teal-400 animate-cursor-blink ml-0.5 align-middle" />
      </div>
    </div>
  );
}
