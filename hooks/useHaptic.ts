'use client';

import { useCallback } from 'react';
import type { HapticPattern } from '@/types';

const PATTERNS = {
  light: [10] as HapticPattern,
  medium: [20, 30, 20] as HapticPattern,
  heavy: [50, 100, 50] as HapticPattern,
  clayPress: [10, 20, 10] as HapticPattern,
  toggle: [20] as HapticPattern,
  success: [30, 50, 30] as HapticPattern,
};

export function useHaptic() {
  const trigger = useCallback((pattern: keyof typeof PATTERNS | HapticPattern = 'light') => {
    if (!navigator.vibrate) return;

    const hapticPattern = Array.isArray(pattern) ? pattern : PATTERNS[pattern];
    navigator.vibrate(hapticPattern);
  }, []);

  return { trigger };
}