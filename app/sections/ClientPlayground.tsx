'use client';

import { useState } from 'react';
import { AmbientBackground } from '@/components/AmbientBackground';
import { CursorGlow } from '@/components/CursorGlow';
import { SynthesizerSection } from '@/components/SynthesizerSection';
import { OrbitalTypewriter } from '@/components/typewriter/OrbitalTypewriter';
import { PhysicsDemo } from '@/components/physics/PhysicsDemo';
import { MorphPanel } from '@/components/MorphPanel';
import { MorphButton } from '@/components/MorphButton';
import { Popover } from '@/components/morphism/Popover';
import { LoadingButton } from '@/components/morphism/LoadingStates';
import { useToast } from '@/components/morphism/Toast';
import { Music, Type, Zap, Info } from 'lucide-react';

export function ClientPlayground() {
  const { addToast } = useToast();
  const [loadingStates, setLoadingStates] = useState({
    button1: false,
    button1Success: false,
    button2: false,
    button2Success: false,
  });

  const simulateLoading = (key: 'button1' | 'button2') => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: true,
      [`${key}Success`]: false,
    }));

    setTimeout(() => {
      setLoadingStates((prev) => ({
        ...prev,
        [key]: false,
        [`${key}Success`]: true,
      }));
      addToast('Operation completed successfully!', 'success', 3000);

      setTimeout(() => {
        setLoadingStates((prev) => ({
          ...prev,
          [`${key}Success`]: false,
        }));
      }, 2000);
    }, 2000);
  };

  return (
    <>
      <AmbientBackground />
      <CursorGlow />

      {/* Hero Actions */}
      <section className="relative z-10 pb-8 px-4">
        <div className="flex gap-4 justify-center flex-wrap">
          <MorphButton
            variant="clay"
            color="#FF6B9D"
            liquidFill
            onClick={() => {
              document.getElementById('synthesizer')?.scrollIntoView({ behavior: 'smooth' });
              addToast('Scrolling to Synthesizer', 'info');
            }}
          >
            <Music className="w-5 h-5" aria-hidden="true" />
            Synthesizer
          </MorphButton>

          <MorphButton
            variant="clay"
            color="#60A5FA"
            onClick={() => {
              document.getElementById('typewriter')?.scrollIntoView({ behavior: 'smooth' });
              addToast('Scrolling to Typewriter', 'info');
            }}
          >
            <Type className="w-5 h-5" aria-hidden="true" />
            Typewriter
          </MorphButton>

          <Popover
            trigger={
              <MorphButton variant="clay" color="#C084FC">
                <Info className="w-5 h-5" aria-hidden="true" />
                Features
              </MorphButton>
            }
            placement="bottom"
          >
            <div className="text-white space-y-2">
              <h4 className="font-bold">Key Features</h4>
              <ul className="text-sm text-white/70 space-y-1">
                <li className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-amber-400" aria-hidden="true" /> Web Audio API
                  Synthesizer
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-emerald-400" aria-hidden="true" /> Physics-based
                  Spring Animations
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-blue-400" aria-hidden="true" /> Haptic Feedback
                  Integration
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-pink-400" aria-hidden="true" /> Particle Burst
                  Effects
                </li>
              </ul>
            </div>
          </Popover>
        </div>
      </section>

      {/* Loading States Demo */}
      <section className="relative z-10 py-8 px-4" aria-labelledby="loading-states-heading">
        <div className="max-w-4xl mx-auto">
          <MorphPanel variant="glass" className="text-center">
            <h3 id="loading-states-heading" className="text-white font-bold text-xl mb-6">
              Morphing Button States
            </h3>
            <div className="flex gap-4 justify-center flex-wrap">
              <LoadingButton
                isLoading={loadingStates.button1}
                isSuccess={loadingStates.button1Success}
                onClick={() => simulateLoading('button1')}
                color="#FF6B9D"
              >
                Submit Form
              </LoadingButton>

              <LoadingButton
                isLoading={loadingStates.button2}
                isSuccess={loadingStates.button2Success}
                onClick={() => simulateLoading('button2')}
                color="#60A5FA"
              >
                Save Changes
              </LoadingButton>

              <MorphButton
                variant="clay"
                color="#34D399"
                onClick={() => addToast('Custom notification message!', 'info')}
              >
                Show Toast
              </MorphButton>

              <MorphButton
                variant="clay"
                color="#FBBF24"
                onClick={() => addToast('Warning: Check your settings', 'warning')}
              >
                Warning
              </MorphButton>

              <MorphButton
                variant="clay"
                color="#FB7185"
                onClick={() => addToast('Error: Something went wrong', 'error')}
              >
                Error
              </MorphButton>
            </div>
          </MorphPanel>
        </div>
      </section>

      {/* Synthesizer Section */}
      <section
        className="relative z-10 py-16 px-4"
        id="synthesizer"
        aria-labelledby="synth-heading"
      >
        <h2 id="synth-heading" className="sr-only">
          Claymorphic Synthesizer
        </h2>
        <SynthesizerSection />
      </section>

      {/* Typewriter Section */}
      <section
        className="relative z-10 py-16 px-4"
        id="typewriter"
        aria-labelledby="typewriter-heading"
      >
        <h2 id="typewriter-heading" className="sr-only">
          Orbital Typewriter
        </h2>
        <OrbitalTypewriter />
      </section>

      {/* Physics Demo Section */}
      <section
        className="relative z-10 py-16 px-4"
        id="physics"
        aria-labelledby="physics-heading"
      >
        <h2 id="physics-heading" className="sr-only">
          Physics States Gallery
        </h2>
        <PhysicsDemo />
      </section>
    </>
  );
}
