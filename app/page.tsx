import dynamic from 'next/dynamic';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { getFeaturedProjects } from '@/lib/projects';
import {
  getAboutContent,
  getContactContent,
  getServicesContent,
} from '@/lib/site-content';

const Works = dynamic(() => import('@/components/Works').then((m) => ({ default: m.Works })), {
  ssr: true,
  loading: () => <section className="min-h-[40vh] bg-background" aria-hidden />,
});
const Services = dynamic(() => import('@/components/Services').then((m) => ({ default: m.Services })), {
  ssr: true,
  loading: () => <section className="min-h-[40vh] bg-section-accent" aria-hidden />,
});
const Process = dynamic(() => import('@/components/Process').then((m) => ({ default: m.Process })), {
  ssr: true,
  loading: () => <section className="min-h-[40vh] bg-background" aria-hidden />,
});
const TechStack = dynamic(() => import('@/components/TechStack').then((m) => ({ default: m.TechStack })), {
  ssr: true,
  loading: () => <section className="min-h-[40vh] bg-section-accent" aria-hidden />,
});
const About = dynamic(() => import('@/components/About').then((m) => ({ default: m.About })), {
  ssr: true,
  loading: () => <section className="min-h-[40vh] bg-background" aria-hidden />,
});
const Footer = dynamic(() => import('@/components/Footer').then((m) => ({ default: m.Footer })), {
  ssr: true,
  loading: () => <footer className="min-h-[20vh] bg-footer" aria-hidden />,
});

export default async function Home() {
  const projects = await getFeaturedProjects();
  const [about, contact, services] = await Promise.all([
    getAboutContent(),
    getContactContent(),
    getServicesContent(),
  ]);

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen" role="main">
        <Hero about={about} contact={contact} />
        <Works projects={projects} />
        <Services services={services} />
        <Process />
        <TechStack />
        <About about={about} />
        <Footer contact={contact} />
      </main>
    </>
  );
}
