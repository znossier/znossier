/**
 * Mock Data for Portfolio
 * This will be replaced with Sanity CMS queries in Phase 2
 */

export interface Project {
  id: string;
  title: string;
  emoji: string;
  description: string;
  categories: string[];
  image?: string;
  video?: string;
  link?: string;
  featured: boolean;
  date?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  number: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Green Fern',
    emoji: '🌿',
    description: 'A redesign for a fast-growing platform, focusing on improving usability and engagement.',
    categories: ['Zenith'],
    image: '/placeholder-project-1.jpg',
    link: '#',
    featured: true,
    date: 'Feb 3, 2025',
  },
  {
    id: '2',
    title: 'Yellow Flower',
    emoji: '🌼',
    description: 'A complete brand refresh to establish a stronger market presence and differentiate from competitors.',
    categories: ['Nexa'],
    image: '/placeholder-project-2.jpg',
    link: '#',
    featured: true,
    date: 'Jan 27, 2025',
  },
  {
    id: '3',
    title: 'Orange Flower',
    emoji: '🌺',
    description: 'An e-commerce platform redesign aimed at reducing bounce rates and boosting conversions.',
    categories: ['Aether'],
    image: '/placeholder-project-3.jpg',
    link: '#',
    featured: true,
    date: 'Dec 30, 2024',
  },
  {
    id: '4',
    title: 'Purple Flower',
    emoji: '💜',
    description: 'A modular design system to unify and streamline digital product design at scale.',
    categories: ['Horizon'],
    image: '/placeholder-project-4.jpg',
    link: '#',
    featured: true,
    date: 'Dec 20, 2024',
  },
];

export const mockServices: Service[] = [
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Creating visually compelling designs that elevate your brand and captivate your audience.',
    number: '01',
  },
  {
    id: 'lifestyle-photography',
    title: 'Lifestyle Photography',
    description: 'Capturing authentic moments that bring your brand to life.',
    number: '02',
  },
  {
    id: 'digital-design',
    title: 'Digital Design',
    description: 'Intuitive and aesthetically pleasing digital experiences.',
    number: '03',
  },
  {
    id: 'social-media',
    title: 'Social Media Design',
    description: 'Engaging visuals that strengthen your online presence.',
    number: '04',
  },
];

export const mockAbout = {
  name: 'Zeina Nossier',
  title: 'UI/UX & Product Designer',
  bio: 'Designer focused on creating intuitive interfaces and thoughtful user experiences. I work across the entire design process, from initial research to final implementation.',
  tagline: 'UI/UX & Product Designer based in Cairo, EG.',
  experience: [
    {
      role: 'Product Designer',
      company: 'noon',
      period: 'Jul 2024 - Present',
      description:
        "Designed internal tools for noon minutes' Commercial & Instock Squad, improving efficiency and aligning UX with business needs. Created user flows, wireframes, and high-fidelity UIs to streamline inventory, pricing, and product import processes. Collaborated cross-functionally with developers and product managers to deliver scalable solutions. Contributed to internal design systems and usability audits for workflow optimization.",
    },
    {
      role: 'Graphic & Web Designer',
      company: 'Bespoke Furniture',
      period: 'Jun 2021 - Jul 2024',
      description:
        "Led a brand identity refresh, modernizing the company's visuals across print and digital platforms. Designed catalogs, brochures, and social content; contributed to UX and layout of the website redesign. Developed and designed the full company website and e-commerce shop, focusing on user experience, visual clarity, and responsive design.",
    },
    {
      role: 'Undergraduate Teaching Assistant',
      company: 'The American University in Cairo (AUC)',
      period: 'Sep - Dec 2022',
      description:
        "Assisted the Design Principles & Practices (DPP) course for the Fall 2022 semester; managing the organization and digital filing of student submissions, streamlining the grading process for the professor. Served as the primary liaison between the professor and students, effectively communicating course updates, concepts, and resolving inquiries.",
    },
    {
      role: 'Summer Intern',
      company: 'Microsoft',
      period: 'Jun - Aug 2017',
      description:
        "Participated in a high school tech internship focused on exploring programming (C++/Java) and basic app logic. Built small-scale tools like calculators while learning development environments and code structure. Delivered weekly demos and attended Microsoft's DigiGirlz workshops, sparking a long-term interest in digital design and tech innovation.",
    },
  ],
  image: '/zeina-photo.jpg', // Add your photo file to /public/zeina-photo.jpg
};

export const mockContact = {
  email: 'zeina.nossier@gmail.com',
  phone: '123-456-7890',
  address: '123 Sakura Street, New York City, NY, USA',
  socialLinks: [
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/zeinanossier',
      icon: 'linkedin',
    },
    {
      platform: 'Behance',
      url: 'https://behance.net/zeinanossier',
      icon: 'behance',
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/z-nossier',
      icon: 'github',
    },
  ],
};

export const navigationItems = [
  { label: 'Works', href: '#works' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
];
