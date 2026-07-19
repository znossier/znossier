import dynamic from 'next/dynamic';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { getFeaturedProjects } from '@/lib/projects';
import {
  getAboutContent,
  getContactContent,
  getServicesContent,
} from '@/lib/site-content';
import {
  WorksSkeleton,
  ServicesSkeleton,
  ProcessSkeleton,
  TechStackSkeleton,
  AboutSkeleton,
  FooterSkeleton,
} from '@/components/SectionSkeleton';

const Works = dynamic(() => import('@/components/Works').then((m) => ({ default: m.Works })), {
  ssr: true,
  loading: () => <WorksSkeleton />,
});
const Services = dynamic(() => import('@/components/Services').then((m) => ({ default: m.Services })), {
  ssr: true,
  loading: () => <ServicesSkeleton />,
});
const Process = dynamic(() => import('@/components/Process').then((m) => ({ default: m.Process })), {
  ssr: true,
  loading: () => <ProcessSkeleton />,
});
const TechStack = dynamic(() => import('@/components/TechStack').then((m) => ({ default: m.TechStack })), {
  ssr: true,
  loading: () => <TechStackSkeleton />,
});
const About = dynamic(() => import('@/components/About').then((m) => ({ default: m.About })), {
  ssr: true,
  loading: () => <AboutSkeleton />,
});
const Footer = dynamic(() => import('@/components/Footer').then((m) => ({ default: m.Footer })), {
  ssr: true,
  loading: () => <FooterSkeleton />,
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
