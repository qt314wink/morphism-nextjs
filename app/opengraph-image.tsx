import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ClayForge — Morphism UI Design System';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          padding: 64,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '24px',
              background: 'linear-gradient(145deg, #C084FC, #7c3aed)',
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.6),
                0 8px 24px rgba(0,0,0,0.18),
                inset 0 -2px 6px rgba(0,0,0,0.12),
                inset 0 2px 8px rgba(255,255,255,0.35),
                0 1px 0 rgba(255,255,255,0.4),
                0 0 40px rgba(139,92,246,0.08)
              `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 40, color: 'white' }}>C</span>
          </div>
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          ClayForge
        </h1>

        <p
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Multi-variant morphism UI library with physics-driven animation
        </p>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 40,
          }}
        >
          {['Clay', 'Glass', 'Silicon', 'Gel', 'Paper'].map((tag) => (
            <span
              key={tag}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: 18,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
