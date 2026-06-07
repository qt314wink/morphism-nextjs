'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { CircularKey } from './CircularKey';
import { TypewriterScreen } from './TypewriterScreen';
import { MorphButton } from '@/components/MorphButton';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useHaptic } from '@/hooks/useHaptic';
import { NOTE_COLORS, WHITE_NOTES } from '@/lib/utils';

const TYPEWRITER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function OrbitalTypewriter() {
  const [text, setText] = useState('');
  const { playTypeSound } = useAudioEngine();
  const { trigger: haptic } = useHaptic();
  const ringRef = useRef<HTMLDivElement>(null);

  const handleType = useCallback(
    (char: string) => {
      setText((prev) => prev + char);
      playTypeSound();
      haptic('light');
    },
    [playTypeSound, haptic]
  );

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
      const utterance = new SpeechSynthesisUtterance(
        text || 'Hello from the orbital typewriter'
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  }, [text]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      if (TYPEWRITER_CHARS.includes(char)) {
        handleType(char);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleType]);

  const radius = 200;
  const angleStep = (Math.PI * 2) / TYPEWRITER_CHARS.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">Orbital Typewriter</h2>
        <p className="text-white/50 text-sm">Click circular keys or type on your keyboard</p>
      </div>

      <div ref={ringRef} className="relative w-[500px] h-[500px] mx-auto">
        <div
          className="absolute inset-0 rounded-full border-2 border-white/10"
          style={{
            boxShadow:
              'inset 0 0 60px rgba(255,255,255,0.05), 0 0 80px rgba(255,255,255,0.03)',
          }}
        />

        <div
          className="absolute inset-5 rounded-full animate-ring-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />

        <TypewriterScreen text={text} />

        {TYPEWRITER_CHARS.split('').map((char, i) => (
          <CircularKey
            key={char}
            char={char}
            angle={i * angleStep - Math.PI / 2}
            radius={radius}
            color={NOTE_COLORS[WHITE_NOTES[i % WHITE_NOTES.length]]}
            onType={handleType}
          />
        ))}
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
