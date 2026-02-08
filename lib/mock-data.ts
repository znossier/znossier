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

export interface ProcessStep {
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

export interface TechStackItem {
  id: string;
  name: string;
  logo: string; // SVG path or image URL
  category?: string;
  url?: string;
  /** When true, logo is shown black in light mode and white in dark mode */
  monochrome?: boolean;
  /** Optional class for logo wrapper (e.g. brand color filter) */
  logoClassName?: string;
  /** Optional scale (0–1) for this logo only; default uses global LOGO_BOX_SCALE */
  logoScale?: number;
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
    id: 'product-ux-design',
    title: 'Product & UX Design',
    description:
      'End-to-end product design grounded in user research, problem definition, and iterative testing. I turn insights into clear, usable experiences that balance user needs, business goals, and technical constraints.',
    number: '01',
  },
  {
    id: 'ui-design-systems',
    title: 'UI Design & Design Systems',
    description:
      'Creating intuitive interfaces, component libraries, and scalable design systems that keep products consistent and easy to build.',
    number: '02',
  },
  {
    id: 'ecommerce-web',
    title: 'E-commerce & Web Experiences',
    description:
      'Designing high-converting websites and e-commerce experiences (Shopify and custom builds) with a strong focus on usability, performance, and conversion.',
    number: '03',
  },
  {
    id: 'visual-brand-design',
    title: 'Visual & Brand Design for Digital Products',
    description:
      'Supporting products with strong visual identity, layout, and brand consistency across digital touchpoints.',
    number: '04',
  },
];

export const mockProcessSteps: ProcessStep[] = [
  {
    id: 'discover',
    title: 'DISCOVER',
    description:
      'I start by understanding the problem space—diving into user needs, business goals, and market context through research, stakeholder interviews, and competitive analysis.',
    number: '01',
  },
  {
    id: 'define',
    title: 'DEFINE',
    description:
      'I translate insights into clear goals and define the product vision. This includes personas, user journeys, and problem statements to align the team and guide design decisions.',
    number: '02',
  },
  {
    id: 'ideate',
    title: 'IDEATE',
    description:
      'I explore solutions through ideation, wireframes, and prototypes—iterating based on feedback to validate concepts before moving into high-fidelity design.',
    number: '03',
  },
  {
    id: 'design',
    title: 'DESIGN',
    description:
      'I bring concepts to life through high-fidelity design, interaction detailing, and design systems—ensuring consistency, accessibility, and visual impact.',
    number: '04',
  },
  {
    id: 'deliver-iterate',
    title: 'DELIVER & ITERATE',
    description:
      'I collaborate closely with developers to hand off and support implementation. After launch, I track usage, gather feedback, and iterate to refine the experience.',
    number: '05',
  },
];

export interface ExperienceRole {
  role: string;
  period: string;
  description?: string;
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
}

export type ExperienceEntry = ExperienceGroup | ExperienceItem;

export function isExperienceGroup(entry: ExperienceEntry): entry is ExperienceGroup {
  return 'roles' in entry && Array.isArray(entry.roles);
}

export const mockAbout = {
  name: 'Zeina Nossier',
  title: 'UI/UX & Product Designer',
  bio: 'Designer focused on creating intuitive interfaces and thoughtful user experiences. I work across the entire design process, from initial research to final implementation.',
  tagline: 'UI/UX & Product Designer based in Cairo, EG.',
  heroHeadline: 'Product design that turns complexity into clarity.',
  heroSubhead: 'Zeina Nossier — Product & UX Designer',
  heroSupport: 'End-to-end from research to high-fidelity.',
  experience: [
    {
      company: 'noon',
      logo: '/logos/noon.png',
      roles: [
        {
          role: 'Product Designer II',
          period: 'Jan 2026 - Present',
          description:
            "Designed internal tools for noon minutes' Commercial & Instock Squad, improving efficiency and aligning UX with business needs. Created user flows, wireframes, and high-fidelity UIs to streamline inventory, pricing, and product import processes. Collaborated cross-functionally with developers and product managers to deliver scalable solutions. Contributed to internal design systems and usability audits for workflow optimization.",
        },
        {
          role: 'Product Designer',
          period: 'Jul 2024 - Jan 2026',
          description:
            "Designed internal tools for noon minutes' Commercial & Instock Squad, improving efficiency and aligning UX with business needs. Created user flows, wireframes, and high-fidelity UIs to streamline inventory, pricing, and product import processes. Collaborated cross-functionally with developers and product managers to deliver scalable solutions. Contributed to internal design systems and usability audits for workflow optimization.",
        },
      ],
    } as ExperienceGroup,
    {
      role: 'Graphic & Web Designer',
      company: 'Bespoke Furniture',
      period: 'Jun 2021 - Jul 2024',
      logo: '/logos/bespoke.png',
      description:
        "Led a brand identity refresh, modernizing the company's visuals across print and digital platforms. Designed catalogs, brochures, and social content; contributed to UX and layout of the website redesign. Developed and designed the full company website and e-commerce shop, focusing on user experience, visual clarity, and responsive design.",
    } as ExperienceItem,
    {
      role: 'Undergraduate Teaching Assistant',
      company: 'The American University in Cairo (AUC)',
      period: 'Sep - Dec 2022',
      logo: '/logos/auc.png',
      description:
        "Assisted the Design Principles & Practices (DPP) course for the Fall 2022 semester; managing the organization and digital filing of student submissions, streamlining the grading process for the professor. Served as the primary liaison between the professor and students, effectively communicating course updates, concepts, and resolving inquiries.",
    } as ExperienceItem,
    {
      role: 'Summer Intern',
      company: 'Microsoft',
      period: 'Jun - Aug 2017',
      logo: '/logos/microsoft.png',
      description:
        "Participated in a high school tech internship focused on exploring programming (C++/Java) and basic app logic. Built small-scale tools like calculators while learning development environments and code structure. Delivered weekly demos and attended Microsoft's DigiGirlz workshops, sparking a long-term interest in digital design and tech innovation.",
    } as ExperienceItem,
  ] as ExperienceEntry[],
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
  { label: 'Expertise', href: '#expertise' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
];

export const mockTechStack: TechStackItem[] = [
  {
    id: 'figma',
    name: 'Figma',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    category: 'Design',
    url: 'https://www.figma.com',
  },
  {
    id: 'html5',
    name: 'HTML',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    category: 'Development',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  },
  {
    id: 'css3',
    name: 'CSS',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    category: 'Development',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    category: 'Development',
    url: 'https://www.typescriptlang.org',
  },
  {
    id: 'react',
    name: 'React',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    category: 'Development',
    url: 'https://react.dev',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    logo: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/cursor.svg',
    category: 'Development',
    url: 'https://cursor.sh',
    monochrome: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg',
    category: 'Productivity',
    url: 'https://www.notion.so',
  },
  {
    id: 'framer',
    name: 'Framer',
    logo: '/framer-logo.svg',
    category: 'Prototyping',
    url: 'https://www.framer.com',
  },
  {
    id: 'sql',
    name: 'SQL',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    category: 'Database',
    url: 'https://www.mysql.com',
  },
  {
    id: 'adobe-xd',
    name: 'Adobe XD',
    logo: '/adobe-xd.svg',
    category: 'Design',
    url: 'https://www.adobe.com/products/xd.html',
  },
  {
    id: 'adobe-photoshop',
    name: 'Photoshop',
    logo: '/adobe-photoshop.svg',
    category: 'Design',
    url: 'https://www.adobe.com/products/photoshop.html',
  },
  {
    id: 'adobe-illustrator',
    name: 'Illustrator',
    logo: '/adobe-illustrator.svg',
    category: 'Design',
    url: 'https://www.adobe.com/products/illustrator.html',
  },
  {
    id: 'adobe-indesign',
    name: 'InDesign',
    logo: '/adobe-indesign.svg',
    category: 'Design',
    url: 'https://www.adobe.com/products/indesign.html',
  },
  {
    id: 'adobe-after-effects',
    name: 'After Effects',
    logo: '/adobe-after-effects.svg',
    category: 'Design',
    url: 'https://www.adobe.com/products/aftereffects.html',
  },
  {
    id: 'github',
    name: 'GitHub',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    category: 'Version Control',
    url: 'https://github.com',
    monochrome: true,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
    category: 'Development',
    url: 'https://vercel.com',
    monochrome: true,
    logoScale: 0.78,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    logo: '/shopify-logo.svg',
    category: 'E-commerce',
    url: 'https://www.shopify.com',
  },
];
