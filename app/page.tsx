import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Works } from '@/components/Works';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen" role="main">
        <Hero />
        <Works />
        <Services />
        <About />
        <Footer />
      </main>
    </>
  );
}
