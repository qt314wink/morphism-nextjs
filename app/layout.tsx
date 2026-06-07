import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ToastProvider } from '@/components/morphism/Toast';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ClayForge — Morphism UI Design System',
  description:
    'Production-ready multi-variant morphism UI library with physics-driven animation, multi-sensory interaction, and full accessibility compliance.',
  keywords: [
    'UI design',
    'morphism',
    'claymorphism',
    'glassmorphism',
    'physics',
    'animation',
    'design system',
  ],
  openGraph: {
    title: 'ClayForge — Morphism UI Design System',
    description:
      'Production-ready multi-variant morphism UI library with physics-driven animation.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClayForge — Morphism UI Design System',
    description:
      'Production-ready multi-variant morphism UI library with physics-driven animation.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
