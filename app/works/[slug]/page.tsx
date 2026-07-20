import { notFound } from 'next/navigation';
import { getPublishedProjectBySlug, getPublishedProjects } from '@/lib/projects';
import { ProjectDetailPage } from '@/components/ProjectDetailPage';
import { getContactContent } from '@/lib/site-content';
import type { Metadata } from 'next';

const BASE_URL = 'https://znossier.com';
const META_DESC_MAX_LENGTH = 160;

function truncateMetaDescription(text: string, maxLen: number = META_DESC_MAX_LENGTH): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3).trimEnd() + '...';
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: 'Project not found' };
  const title = project.title;
  const description = truncateMetaDescription(project.description);
  const canonical = `${BASE_URL}/works/${slug}`;
  // Fall back to the site's real shared OG asset, not a per-project photo path that
  // was never added to /public.
  const ogImage = project.coverImage ?? project.image ?? '/og-image.jpg';
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, contact] = await Promise.all([
    getPublishedProjectBySlug(slug),
    getContactContent(),
  ]);
  if (!project) notFound();
  return <ProjectDetailPage project={project} contact={contact} />;
}
