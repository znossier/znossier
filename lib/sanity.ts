import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID;

export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  'production';

export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-22';

export const hasSanityConfig = Boolean(sanityProjectId && sanityDataset);

export const client = hasSanityConfig
  ? createClient({
      projectId: sanityProjectId as string,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      perspective: 'published',
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null;

export function urlFor(source: SanityImageSource) {
  if (!client) return null;
  const builder = imageUrlBuilder(client);
  return builder.image(source);
}
