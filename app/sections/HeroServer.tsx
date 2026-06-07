import { Sparkles } from 'lucide-react';

export function HeroServer() {
  return (
    <header className="relative z-10 pt-20 pb-12 text-center px-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-6">
        <Sparkles className="w-4 h-4 text-pink-400" aria-hidden="true" />
        <span className="text-sm text-white/70">ClayForge v2.0</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6 font-sans">
        ClayForge
      </h1>

      <p className="text-xl text-white/70 max-w-2xl mx-auto">
        Production-ready multi-variant morphism UI library with physics-driven
        animation, multi-sensory interaction, and full accessibility compliance.
      </p>
    </header>
  );
}
