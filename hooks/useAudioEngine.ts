'use client';

import { useRef, useCallback, useEffect } from 'react';
import { NOTE_FREQUENCIES } from '@/lib/utils';
import type { AudioEnvelope } from '@/types';

interface ActiveOscillator {
  osc: OscillatorNode;
  gainNode: GainNode;
  filter: BiquadFilterNode;
}

const DEFAULT_ENVELOPE: AudioEnvelope = {
  attack: 0.02,
  decay: 0.3,
  sustain: 0.15,
  release: 0.3,
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export function useAudioEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscillatorsRef = useRef<Map<string, ActiveOscillator>>(new Map());
  const sustainRef = useRef(false);
  const envelopeRef = useRef<AudioEnvelope>(DEFAULT_ENVELOPE);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  }, []);

  const resume = useCallback(async () => {
    const ctx = initAudio();
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume();
    }
  }, [initAudio]);

  const getState = useCallback(() => {
    return audioCtxRef.current?.state ?? 'suspended';
  }, []);

  const playNote = useCallback(
    (note: string, velocity = 0.7) => {
      const ctx = initAudio();
      const freq = NOTE_FREQUENCIES[note];
      if (!freq || !ctx) return;

      if (activeOscillatorsRef.current.has(note)) {
        stopNote(note);
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 4, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);

      const env = envelopeRef.current;
      const now = ctx.currentTime;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(velocity * 0.3, now + env.attack);
      gainNode.gain.exponentialRampToValueAtTime(
        velocity * env.sustain,
        now + env.attack + env.decay
      );

      if (!sustainRef.current) {
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          now + env.attack + env.decay + env.release
        );
      }

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);

      if (!sustainRef.current) {
        osc.stop(now + env.attack + env.decay + env.release + 0.1);
      }

      activeOscillatorsRef.current.set(note, { osc, gainNode, filter });
    },
    [initAudio]
  );

  const stopNote = useCallback((note: string) => {
    const active = activeOscillatorsRef.current.get(note);
    if (active && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      active.gainNode.gain.cancelScheduledValues(now);
      active.gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        now + envelopeRef.current.release
      );
      active.osc.stop(now + envelopeRef.current.release + 0.1);
      activeOscillatorsRef.current.delete(note);
    }
  }, []);

  const setSustain = useCallback((enabled: boolean) => {
    const wasEnabled = sustainRef.current;
    sustainRef.current = enabled;

    // Release all held notes when sustain is turned off
    if (wasEnabled && !enabled) {
      const notes = Array.from(activeOscillatorsRef.current.keys());
      notes.forEach((note) => stopNote(note));
    }
  }, [stopNote]);

  const setEnvelope = useCallback((envelope: Partial<AudioEnvelope>) => {
    envelopeRef.current = { ...envelopeRef.current, ...envelope };
  }, []);

  const playTypeSound = useCallback(() => {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, [initAudio]);

  const playTickSound = useCallback(() => {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }, [initAudio]);

  useEffect(() => {
    return () => {
      activeOscillatorsRef.current.forEach(({ osc }) => {
        try {
          osc.stop();
        } catch {
          /* already stopped */
        }
      });
      audioCtxRef.current?.close();
    };
  }, []);

  return {
    playNote,
    stopNote,
    setSustain,
    setEnvelope,
    playTypeSound,
    playTickSound,
    resume,
    getState,
    isSustaining: () => sustainRef.current,
  };
}
