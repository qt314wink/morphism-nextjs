export interface NoteConfig {
  note: string;
  frequency: number;
  color: string;
  keyboardKey: string;
}

export interface KeyState {
  isPressed: boolean;
  isHovered: boolean;
  velocity: number;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export interface ParticleConfig {
  count: number;
  spread: number;
  decay: number;
  color: string;
}

export interface AudioEnvelope {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export type MorphismVariant = 'clay' | 'glass' | 'silicon' | 'gel' | 'paper';

export interface ClayShadowConfig {
  outerDrop: string;
  innerOcclusion: string;
  innerReflection: string;
  edgeHighlight: string;
}

export interface PopoverPosition {
  x: number;
  y: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

export type HapticPattern = number[];

export interface TypewriterState {
  text: string;
  cursorPosition: number;
  history: string[];
  historyIndex: number;
}
