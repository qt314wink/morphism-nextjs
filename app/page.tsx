import { HeroServer } from './sections/HeroServer';
import { ClientPlayground } from './sections/ClientPlayground';
import { SpecsServer } from './sections/SpecsServer';
import { FooterServer } from './sections/FooterServer';

export default function Home() {
  return (
    <main id="main-content" className="relative min-h-screen overflow-x-hidden">
      <HeroServer />
      <ClientPlayground />
      <SpecsServer />
      <FooterServer />
    </main>
  );
}
