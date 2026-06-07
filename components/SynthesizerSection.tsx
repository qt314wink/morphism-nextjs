'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { MorphKey } from './MorphKey';
import { Visualizer } from '@/components/keyboard/Visualizer';
import { MorphPanel } from './MorphPanel';
import { MorphButton } from './MorphButton';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { KEYBOARD_MAP, WHITE_NOTES, BLACK_NOTES } from '@/lib/utils';

export function SynthesizerSection() {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [sustain, setSustain] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const { playNote, stopNote, setSustain: setAudioSustain, resume, getState } = useAudioEngine();
  const pressedKeysRef = useRef<Set<string>>(new Set());

  const handlePress = useCallback(
    (note: string) => {
      setActiveNote(note);
      playNote(note);
    },
    [playNote]
  );

  const handleRelease = useCallback(
    (note: string) => {
      setActiveNote(null);
      stopNote(note);
    },
    [stopNote]
  );

  const toggleSustain = useCallback(() => {
    const newSustain = !sustain;
    setSustain(newSustain);
    setAudioSustain(newSustain);
  }, [sustain, setAudioSustain]);

  const activateAudio = useCallback(async () => {
    await resume();
    setAudioReady(true);
  }, [resume]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note && !pressedKeysRef.current.has(note)) {
        pressedKeysRef.current.add(note);
        handlePress(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note) {
        pressedKeysRef.current.delete(note);
        handleRelease(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlePress, handleRelease]);

  useEffect(() => {
    if (getState() === 'running') {
      setAudioReady(true);
    }
  }, [getState]);

  return (
    <MorphPanel variant="glass" className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Claymorphic Synthesizer</h2>
        <p className="text-white/50 text-sm">
          Click keys or use keyboard A-K for white keys, W-U for black
        </p>
      </div>

      <Visualizer activeNote={activeNote} />

      <div className="relative">
        {!audioReady && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
            <MorphButton variant="clay" color="#C084FC" onClick={activateAudio}>
              Activate Audio
            </MorphButton>
          </div>
        )}

        <div className="flex justify-center gap-2 relative">
          {WHITE_NOTES.map((note, i) => (
            <div key={note} className="relative">
              <MorphKey
                note={note}
                keyboardKey={['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'][i]}
                onPress={handlePress}
                onRelease={handleRelease}
                isSustaining={sustain}
              />
              {BLACK_NOTES[i] && (
                <MorphKey
                  note={BLACK_NOTES[i]!}
                  keyboardKey={['W', 'E', '', 'T', 'Y', 'U', ''][i] || ''}
                  isBlack
                  onPress={handlePress}
                  onRelease={handleRelease}
                  isSustaining={sustain}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <MorphButton
          variant="clay"
          color={sustain ? '#34D399' : '#C084FC'}
          onClick={toggleSustain}
          size="sm"
        >
          Sustain: {sustain ? 'ON' : 'OFF'}
        </MorphButton>
        <MorphButton
          variant="clay"
          color="#2DD4BF"
          onClick={() => setActiveNote(null)}
          size="sm"
        >
          Clear Visuals
        </MorphButton>
      </div>
    </MorphPanel>
  );
}
