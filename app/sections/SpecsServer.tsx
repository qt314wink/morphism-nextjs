import { MorphPanel } from '@/components/MorphPanel';

export function SpecsServer() {
  return (
    <section className="relative z-10 py-16 px-4" id="specs" aria-labelledby="specs-heading">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="specs-heading" className="text-2xl font-bold text-white mb-2">
            Figma Integration Specs
          </h2>
          <p className="text-white/50 text-sm">Component tokens and design system architecture</p>
        </div>

        <MorphPanel variant="glass">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-bold mb-3">Design Tokens</h4>
                <pre className="bg-black/30 rounded-xl p-4 text-xs font-mono text-green-400 overflow-x-auto">
                  {`Clay/Shadow {
  outer-drop: 0 24px 48px -8px rgba(0,0,0,0.25);
  inner-occlusion: inset 0 -8px 24px rgba(0,0,0,0.12);
  inner-reflection: inset 0 8px 24px rgba(255,255,255,0.55);
  squircle-radius: 40% / 60%;
}`}
                </pre>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">Animation Tokens</h4>
                <pre className="bg-black/30 rounded-xl p-4 text-xs font-mono text-blue-400 overflow-x-auto">
                  {`Spring/Physics {
  bouncy: cubic-bezier(0.34, 1.56, 0.64, 1);
  smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
  duration-fast: 200ms;
  duration-slow: 800ms;
}`}
                </pre>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-white font-bold mb-3">Component Variants</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 mb-2 shadow-lg" />
                  <span className="text-white/80 text-xs">Clay</span>
                </div>
                <div className="text-center">
                  <div className="w-full aspect-square rounded bg-white/10 backdrop-blur-md border border-white/20 mb-2" />
                  <span className="text-white/80 text-xs">Glass</span>
                </div>
                <div className="text-center">
                  <div className="w-full aspect-square rounded bg-gradient-to-br from-gray-700 to-gray-800 mb-2 shadow-md border border-white/10" />
                  <span className="text-white/80 text-xs">Silicon</span>
                </div>
                <div className="text-center">
                  <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-cyan-400/30 to-pink-400/30 backdrop-blur-md border border-cyan-300/30 mb-2" />
                  <span className="text-white/80 text-xs">Gel</span>
                </div>
                <div className="text-center">
                  <div className="w-full aspect-square rounded-sm bg-[#f5f0e8] mb-2 shadow-sm" />
                  <span className="text-white/80 text-xs">Paper</span>
                </div>
              </div>
            </div>
          </div>
        </MorphPanel>
      </div>
    </section>
  );
}
