import { client } from './sanity';
import { mockAbout, mockContact, mockServices, type ServiceVisual } from './mock-data';

export type { ServiceVisual };

export interface Service {
  id: string;
  title: string;
  description: string;
  number: string;
  visual?: ServiceVisual;
}

export interface ExperienceRole {
  role: string;
  period: string;
  description?: string;
  bullets?: string[];
}

export interface ExperienceGroup {
  company: string;
  logo?: string;
  roles: ExperienceRole[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description?: string;
  logo?: string;
  bullets?: string[];
}

export type ExperienceEntry = ExperienceGroup | ExperienceItem;

export interface AboutContent {
  name: string;
  title: string;
  location?: string;
  bio: string;
  tagline?: string;
  bioShort?: string;
  heroHeadline?: string;
  heroSubhead?: string;
  heroSupport?: string;
  experience: ExperienceEntry[];
  image?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface ContactContent {
  email: string;
  phone?: string;
  address?: string;
  socialLinks: SocialLink[];
}

type RawService = {
  _id: string;
  title?: string;
  description?: string;
  number?: string | null;
};

type RawExperienceRole = {
  role?: string | null;
  period?: string | null;
  description?: string | null;
  bullets?: string[] | null;
};

type RawExperienceEntry = {
  entryType?: 'group' | 'single' | null;
  company?: string | null;
  logo?: string | null;
  role?: string | null;
  period?: string | null;
  description?: string | null;
  bullets?: string[] | null;
  roles?: RawExperienceRole[] | null;
};

type RawAbout = {
  name?: string;
  title?: string;
  location?: string | null;
  bio?: string;
  tagline?: string | null;
  bioShort?: string | null;
  heroHeadline?: string | null;
  heroSubhead?: string | null;
  heroSupport?: string | null;
  image?: string | null;
  experience?: RawExperienceEntry[] | null;
};

type RawContact = {
  email?: string;
  phone?: string | null;
  address?: string | null;
  socialLinks?: Array<{
    platform?: string | null;
    url?: string | null;
    icon?: string | null;
  }> | null;
};

function padServiceNumber(value: number) {
  return value.toString().padStart(2, '0');
}

function normalizeService(raw: RawService, index: number): Service | null {
  const title = raw.title?.trim();
  const description = raw.description?.trim();

  if (!title || !description) {
    return null;
  }

  return {
    id: raw._id,
    title,
    description,
    number: raw.number?.trim() || padServiceNumber(index + 1),
  };
}

function normalizeExperienceRole(raw: RawExperienceRole): ExperienceRole | null {
  const role = raw.role?.trim();
  const period = raw.period?.trim();

  if (!role || !period) {
    return null;
  }

  return {
    role,
    period,
    description: raw.description?.trim() || undefined,
    bullets: raw.bullets?.filter(Boolean) || undefined,
  };
}

function normalizeExperienceEntry(raw: RawExperienceEntry): ExperienceEntry | null {
  const company = raw.company?.trim();
  if (!company) {
    return null;
  }

  const roles = raw.roles
    ?.map(normalizeExperienceRole)
    .filter((role): role is ExperienceRole => Boolean(role));

  if (raw.entryType === 'group' || (roles && roles.length > 0)) {
    if (!roles || roles.length === 0) {
      return null;
    }

    return {
      company,
      logo: raw.logo?.trim() || undefined,
      roles,
    };
  }

  const role = raw.role?.trim();
  const period = raw.period?.trim();

  if (!role || !period) {
    return null;
  }

  return {
    role,
    company,
    period,
    description: raw.description?.trim() || undefined,
    logo: raw.logo?.trim() || undefined,
    bullets: raw.bullets?.filter(Boolean) || undefined,
  };
}

function normalizeAbout(raw: RawAbout): AboutContent | null {
  const name = raw.name?.trim();
  const title = raw.title?.trim();
  const bio = raw.bio?.trim();

  if (!name || !title || !bio) {
    return null;
  }

  return {
    name,
    title,
    location: raw.location?.trim() || undefined,
    bio,
    tagline: raw.tagline?.trim() || undefined,
    bioShort: raw.bioShort?.trim() || undefined,
    heroHeadline: raw.heroHeadline?.trim() || undefined,
    heroSubhead: raw.heroSubhead?.trim() || undefined,
    heroSupport: raw.heroSupport?.trim() || undefined,
    image: raw.image || undefined,
    experience:
      raw.experience
        ?.map(normalizeExperienceEntry)
        .filter((entry): entry is ExperienceEntry => Boolean(entry)) || [],
  };
}

function normalizeContact(raw: RawContact): ContactContent | null {
  const email = raw.email?.trim();
  if (!email) {
    return null;
  }

  return {
    email,
    phone: raw.phone?.trim() || undefined,
    address: raw.address?.trim() || undefined,
    socialLinks:
      raw.socialLinks?.flatMap((item) => {
        const platform = item.platform?.trim();
        const url = item.url?.trim();

        return platform && url
          ? [
              {
                platform,
                url,
                icon: item.icon?.trim() || undefined,
              },
            ]
          : [];
      }) || [],
  };
}

export function isExperienceGroup(entry: ExperienceEntry): entry is ExperienceGroup {
  return 'roles' in entry && Array.isArray(entry.roles);
}

export async function getServicesContent(): Promise<Service[]> {
  if (!client) {
    return mockServices;
  }

  try {
    const services = await client.fetch<RawService[]>(
      `*[_type == "service"] | order(order asc, _createdAt asc) {
        _id,
        title,
        description,
        number
      }`
    );

    const normalized = services
      .map((service, index) => normalizeService(service, index))
      .filter((service): service is Service => Boolean(service));

    return normalized.length > 0 ? normalized : mockServices;
  } catch (error) {
    console.error('Error fetching services from Sanity:', error);
    return mockServices;
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  if (!client) {
    return mockAbout;
  }

  try {
    const about = await client.fetch<RawAbout | null>(
      `*[_type == "about"][0] {
        name,
        title,
        location,
        bio,
        tagline,
        bioShort,
        heroHeadline,
        heroSubhead,
        heroSupport,
        "image": image.asset->url,
        "experience": experience[]{
          entryType,
          company,
          "logo": logo.asset->url,
          role,
          period,
          description,
          bullets,
          roles[]{
            role,
            period,
            description,
            bullets
          }
        }
      }`
    );

    const normalized = about ? normalizeAbout(about) : null;
    return normalized || mockAbout;
  } catch (error) {
    console.error('Error fetching about from Sanity:', error);
    return mockAbout;
  }
}

export async function getContactContent(): Promise<ContactContent> {
  if (!client) {
    return mockContact;
  }

  try {
    const contact = await client.fetch<RawContact | null>(
      `*[_type == "contact"][0] {
        email,
        phone,
        address,
        socialLinks[]{
          platform,
          url,
          icon
        }
      }`
    );

    const normalized = contact ? normalizeContact(contact) : null;
    return normalized || mockContact;
  } catch (error) {
    console.error('Error fetching contact from Sanity:', error);
    return mockContact;
  }
}
