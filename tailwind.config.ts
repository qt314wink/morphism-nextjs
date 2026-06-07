import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        clay: {
          pink: '#FF6B9D',
          purple: '#C084FC',
          blue: '#60A5FA',
          teal: '#2DD4BF',
          amber: '#FBBF24',
          coral: '#FB7185',
          mint: '#34D399',
          lavender: '#A78BFA',
        },
      },
      animation: {
        'aurora': 'aurora 20s ease infinite',
        'ring-pulse': 'ringPulse 4s ease-in-out infinite',
        'cursor-blink': 'cursorBlink 1s step-end infinite',
        'ripple-expand': 'rippleExpand 0.6s ease-out forwards',
        'screen-rotate': 'screenRotate 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glass-shimmer': 'glassShimmer 8s ease-in-out infinite',
        'char-pop': 'charPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'clay-press': 'clayPress 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'silicon-flicker': 'siliconFlicker 3s ease-in-out infinite',
        'gel-pulse': 'gelPulse 3s ease-in-out infinite',
        'paper-rustle': 'paperRustle 4s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        ringPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        rippleExpand: {
          to: { transform: 'scale(3)', opacity: '0' },
        },
        screenRotate: {
          to: { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glassShimmer: {
          '0%': { transform: 'translateX(-100%) rotate(12deg)' },
          '50%': { transform: 'translateX(100%) rotate(12deg)' },
          '100%': { transform: 'translateX(-100%) rotate(12deg)' },
        },
        charPop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        clayPress: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.92) translateY(2px)' },
        },
        siliconFlicker: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.03)' },
        },
        gelPulse: {
          '0%, 100%': { borderRadius: '20px' },
          '50%': { borderRadius: '28px' },
        },
        paperRustle: {
          '0%, 100%': { transform: 'rotate(0deg)', opacity: '1' },
          '25%': { transform: 'rotate(0.3deg)', opacity: '0.98' },
          '75%': { transform: 'rotate(-0.3deg)', opacity: '0.98' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
