import { MetadataRoute } from 'next';
import { mockProjects } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://znossier.com';

  const projectEntries: MetadataRoute.Sitemap = mockProjects.map((project) => ({
    url: `${baseUrl}/works/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...projectEntries,
  ];
}
