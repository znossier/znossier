import { client } from './sanity';
import { mockProjects as rawMockProjects, type Project as MockProject } from './mock-data';

export type ProjectLinkMode = 'internal' | 'external';

export interface ProjectSectionBlockHeading {
  type: 'heading';
  text: string;
}

export interface ProjectSectionBlockParagraph {
  type: 'paragraph';
  text: string;
}

export interface ProjectSectionBlockImage {
  type: 'image';
  src: string;
  alt?: string;
}

export interface ProjectSectionBlockTwoImages {
  type: 'twoImages';
  left: { src: string; alt?: string };
  right: { src: string; alt?: string };
}

export type ProjectSectionBlock =
  | ProjectSectionBlockHeading
  | ProjectSectionBlockParagraph
  | ProjectSectionBlockImage
  | ProjectSectionBlockTwoImages;

export interface ProjectSection {
  id: string;
  title: string;
  content?: string;
  blocks?: ProjectSectionBlock[];
}

export interface ProjectSummary {
  slug: string;
  title: string;
  description: string;
  emoji?: string;
  image?: string;
  coverImage?: string;
  published: boolean;
}

export interface Project extends ProjectSummary {
  id: string;
  categories: string[];
  video?: string;
  featured: boolean;
  date?: string;
  client?: string;
  role?: string;
  service?: string;
  linkMode: ProjectLinkMode;
  externalUrl?: string;
  sections?: ProjectSection[];
  nextWork?: ProjectSummary | null;
}

type RawSanityProjectSummary = {
  slug?: string;
  title?: string;
  description?: string;
  emoji?: string;
  image?: string | null;
  coverImage?: string | null;
  published?: boolean;
};

type RawSanityProjectSectionBlock = {
  type?: string | null;
  text?: string | null;
  src?: string | null;
  alt?: string | null;
  left?: { src?: string | null; alt?: string | null } | null;
  right?: { src?: string | null; alt?: string | null } | null;
};

type RawSanityProjectSection = {
  id?: string | null;
  title?: string | null;
  content?: string | null;
  blocks?: RawSanityProjectSectionBlock[] | null;
};

type RawSanityProject = {
  _id: string;
  slug?: string;
  title?: string;
  description?: string;
  emoji?: string;
  categories?: string[];
  image?: string | null;
  coverImage?: string | null;
  video?: string | null;
  featured?: boolean;
  date?: string | null;
  client?: string | null;
  role?: string | null;
  service?: string | null;
  linkMode?: ProjectLinkMode;
  externalUrl?: string | null;
  published?: boolean;
  sections?: RawSanityProjectSection[] | null;
  nextWork?: RawSanityProjectSummary | null;
};

const projectBaseFields = `
  _id,
  title,
  description,
  "slug": slug.current,
  emoji,
  categories,
  "image": coalesce(cardImage.asset->url, image.asset->url, coverImage.asset->url),
  "coverImage": coverImage.asset->url,
  video,
  featured,
  "date": select(
    defined(projectDate.month) && defined(projectDate.year) => projectDate.month + " " + string(projectDate.year),
    date
  ),
  client,
  role,
  service,
  linkMode,
  externalUrl,
  published
`;

const projectSectionFields = `
  "sections": sections[]{
    "id": coalesce(sectionId, _key),
    title,
    content,
    "blocks": blocks[]{
      "type": select(
        _type == "projectSectionHeading" => "heading",
        _type == "projectSectionParagraph" => "paragraph",
        _type == "projectSectionImage" => "image",
        _type == "projectSectionTwoImages" => "twoImages",
        null
      ),
      text,
      alt,
      "src": image.asset->url,
      "left": select(
        _type == "projectSectionTwoImages" => {
          "src": leftImage.asset->url,
          "alt": leftAlt
        }
      ),
      "right": select(
        _type == "projectSectionTwoImages" => {
          "src": rightImage.asset->url,
          "alt": rightAlt
        }
      )
    }
  }
`;

const nextWorkFields = `
  "nextWork": nextProject->{
    title,
    description,
    "slug": slug.current,
    emoji,
    "image": coalesce(cardImage.asset->url, image.asset->url, coverImage.asset->url),
    "coverImage": coverImage.asset->url,
    published
  }
`;

function sanitizeProjectUrl(url?: string | null) {
  const value = url?.trim();
  if (!value || value === '#') {
    return undefined;
  }

  return value;
}

function toSectionId(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'project-section';
}

function formatProjectDate(dateValue?: string | null) {
  if (!dateValue) {
    return undefined;
  }

  if (/^[A-Z][a-z]{2}\s+\d{4}$/.test(dateValue.trim())) {
    return dateValue.trim();
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function normalizeBlocks(blocks?: RawSanityProjectSectionBlock[] | null): ProjectSectionBlock[] | undefined {
  if (!blocks?.length) {
    return undefined;
  }

  const normalized: ProjectSectionBlock[] = [];

  for (const block of blocks) {
    if (block.type === 'heading' || block.type === 'paragraph') {
      const text = block.text?.trim();
      if (text) {
        normalized.push({ type: block.type, text });
      }

      continue;
    }

    if (block.type === 'image') {
      const src = block.src?.trim();
      if (src) {
        normalized.push({
          type: 'image',
          src,
          alt: block.alt?.trim() || undefined,
        });
      }

      continue;
    }

    if (block.type === 'twoImages') {
      const leftSrc = block.left?.src?.trim();
      const rightSrc = block.right?.src?.trim();

      if (leftSrc && rightSrc) {
        normalized.push({
          type: 'twoImages',
          left: {
            src: leftSrc,
            alt: block.left?.alt?.trim() || undefined,
          },
          right: {
            src: rightSrc,
            alt: block.right?.alt?.trim() || undefined,
          },
        });
      }
    }
  }

  return normalized.length > 0 ? normalized : undefined;
}

function normalizeSections(sections?: RawSanityProjectSection[] | null): ProjectSection[] | undefined {
  if (!sections?.length) {
    return undefined;
  }

  const normalized = sections.flatMap((section, index) => {
    const title = section.title?.trim();
    if (!title) {
      return [];
    }

    const blocks = normalizeBlocks(section.blocks);
    const content = section.content?.trim() || undefined;

    return [
      {
        id: toSectionId(section.id?.trim() || title || `section-${index + 1}`),
        title,
        content,
        blocks,
      },
    ];
  });

  return normalized.length > 0 ? normalized : undefined;
}

function normalizeSummary(summary?: RawSanityProjectSummary | null): ProjectSummary | null {
  if (!summary?.title || !summary.slug) {
    return null;
  }

  return {
    slug: summary.slug,
    title: summary.title,
    description: summary.description?.trim() || '',
    emoji: summary.emoji?.trim() || undefined,
    image: summary.image || undefined,
    coverImage: summary.coverImage || undefined,
    published: Boolean(summary.published),
  };
}

function normalizeProject(project: RawSanityProject): Project | null {
  const title = project.title?.trim();
  const slug = project.slug?.trim() || project._id;

  if (!title) {
    return null;
  }

  const linkMode: ProjectLinkMode = project.linkMode === 'external' ? 'external' : 'internal';
  const nextWork = normalizeSummary(project.nextWork);

  return {
    id: slug,
    slug,
    title,
    description: project.description?.trim() || '',
    emoji: project.emoji?.trim() || undefined,
    categories: project.categories?.filter(Boolean) || [],
    image: project.image || undefined,
    coverImage: project.coverImage || undefined,
    video: project.video || undefined,
    featured: Boolean(project.featured),
    date: formatProjectDate(project.date),
    client: project.client?.trim() || undefined,
    role: project.role?.trim() || undefined,
    service: project.service?.trim() || undefined,
    linkMode,
    externalUrl: sanitizeProjectUrl(project.externalUrl),
    published: linkMode === 'internal' ? Boolean(project.published) : false,
    sections: normalizeSections(project.sections),
    nextWork: nextWork?.published ? nextWork : null,
  };
}

function fromMockProject(mock: MockProject): Project {
  return {
    id: mock.id,
    slug: mock.id,
    title: mock.title,
    description: mock.description,
    emoji: mock.emoji,
    categories: mock.categories,
    image: mock.image,
    coverImage: mock.coverImage,
    video: mock.video,
    featured: mock.featured,
    date: mock.date,
    client: mock.client,
    role: mock.role,
    service: mock.service,
    linkMode: 'external',
    externalUrl: sanitizeProjectUrl(mock.link),
    published: false,
  };
}

/** Local fallback used only when Sanity is unreachable or has no featured projects yet. */
const mockFeaturedProjects: Project[] = rawMockProjects
  .filter((project) => project.featured)
  .map(fromMockProject);

export function getProjectHref(project: Project) {
  if (project.linkMode === 'external') {
    return project.externalUrl;
  }

  return project.published ? `/works/${project.slug}` : undefined;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!client) {
    return mockFeaturedProjects;
  }

  try {
    const projects = await client.fetch<RawSanityProject[]>(
      `*[_type == "project" && featured == true] | order(order asc, _createdAt desc) {
        ${projectBaseFields}
      }`
    );

    const normalized = projects
      .map(normalizeProject)
      .filter((project): project is Project => Boolean(project));

    return normalized.length > 0 ? normalized : mockFeaturedProjects;
  } catch (error) {
    console.error('Error fetching featured projects from Sanity:', error);
    return mockFeaturedProjects;
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!client) {
    return [];
  }

  try {
    const projects = await client.fetch<RawSanityProject[]>(
      `*[_type == "project" && linkMode == "internal" && published == true] | order(order asc, _createdAt desc) {
        ${projectBaseFields}
      }`
    );

    const normalized = projects
      .map(normalizeProject)
      .filter((project): project is Project => Boolean(project));

    return normalized;
  } catch (error) {
    console.error('Error fetching published projects from Sanity:', error);
    return [];
  }
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  if (!client) {
    return null;
  }

  try {
    const project = await client.fetch<RawSanityProject | null>(
      `*[_type == "project" && linkMode == "internal" && published == true && slug.current == $slug][0] {
        ${projectBaseFields},
        ${projectSectionFields},
        ${nextWorkFields}
      }`,
      { slug }
    );

    const normalized = project ? normalizeProject(project) : null;
    return normalized;
  } catch (error) {
    console.error('Error fetching project by slug from Sanity:', error);
    return null;
  }
}
