# Zeina Nossier Portfolio

Personal portfolio site — designed and developed by Zeina Nossier.

A modern, dark-only portfolio website built with Next.js, TypeScript, Tailwind CSS, and Sanity CMS, styled after a Figma design-canvas workspace (rulers, grid overlay, inspect frames, custom cursor). Live at [znossier.com](https://znossier.com).

## Features

- 🎨 Figma-workspace visual identity (grid rulers, inspect frames, contextual cursor)
- 📱 Fully responsive design with a dedicated mobile "present mode" (chrome hidden, content-first)
- 🎯 Smooth scroll navigation (Lenis, auto-disabled under `prefers-reduced-motion`)
- 🚀 Optimized performance with Next.js (dynamic imports, skeleton loading states)
- 📝 CMS-driven content (Sanity), with local mock-data fallback if Sanity is unreachable
- ♿ Accessibility-hardened: focus trap/restore on mobile nav, AA-contrast text tokens, reduced-motion support throughout

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion, Lenis (smooth scroll)
- **Font**: Geist, Geist Mono, Oswald
- **CMS**: Sanity (optional — falls back to mock data when not configured)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Optional Setup

### Sanity CMS

The site is designed to be CMS-driven via Sanity. Without a configured Sanity project, content-heavy sections (About, Services, Contact) fall back to local mock data in `lib/mock-data.ts`, and the Works section falls back to a small set of local placeholder projects so the layout is never empty. To use Sanity CMS:

1. Create a Sanity project at [sanity.io](https://sanity.io)
2. Get your project ID and dataset name
3. Create a `.env.local` file:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

4. Install Sanity CLI and initialize:
```bash
npm install -g @sanity/cli
sanity init
```

5. Import the schemas from `sanity/schemas/` into your Sanity Studio

6. Deploy your Sanity Studio:
```bash
sanity deploy
```

The site automatically uses Sanity data when configured (env vars present and reachable), otherwise it falls back to local mock data.

## Project Structure

```
znossier/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout, metadata, favicon/OG wiring
│   ├── page.tsx           # Main page (dynamic-imports below-the-fold sections)
│   ├── not-found.tsx      # On-brand 404 page
│   ├── error.tsx          # On-brand route error boundary
│   ├── works/[slug]/      # Project detail pages
│   ├── sitemap.ts         # Sitemap
│   ├── robots.ts          # Robots.txt (disallows /studio, /api)
│   ├── icon.png / apple-icon.png  # File-convention favicons
│   └── api/               # API routes
│       └── sanity/        # Sanity CMS
├── components/            # React components
│   ├── AppShell.tsx       # Cursor, rulers, grid overlay, smooth scroll wiring
│   ├── Navigation.tsx     # Header navigation (desktop tabs + mobile menu)
│   ├── Hero.tsx           # Hero section
│   ├── About.tsx          # About section
│   ├── Works.tsx          # Projects section
│   ├── Services.tsx       # Services section
│   ├── Process.tsx        # Process section
│   ├── TechStack.tsx      # Tech stack marquee
│   ├── Footer.tsx         # Footer (includes contact)
│   ├── SectionSkeleton.tsx # Loading-state skeletons for dynamic sections
│   ├── WorkspaceFrame.tsx # Figma-style inspect frame (core visual primitive)
│   ├── ProjectDetailPage.tsx
│   └── ...
├── hooks/                 # React hooks
├── lib/                   # Utilities & data
│   ├── mock-data.ts       # Mock data (About/Services/Contact/TechStack fallback)
│   ├── projects.ts        # Sanity project fetching + local fallback projects
│   ├── site-content.ts    # Sanity content fetching (About/Services/Contact)
│   ├── sanity.ts          # Sanity client
│   ├── motion.ts          # Shared Framer Motion duration/easing tokens
│   ├── utils.ts           # Helper functions
│   └── ...
├── sanity/                # Sanity schemas
│   └── schemas/
└── docs/                  # Setup & deployment docs
    ├── DEPLOYMENT.md
    ├── VERCEL_SETUP.md
    ├── QA_REPORT.md
    └── ...
```

## Customization

### Colors & Theme

The site is dark-only by design (no light mode / theme toggle). Edit the CSS custom properties in `app/globals.css` (`:root`) to change the palette:
- Background: `--background` (`#0a0a0a`)
- Foreground/text: `--foreground` (`#f0ece4`)
- Accent (cyan): `--utility-cyan` (`#58bfe8`)
- Utility/debug (magenta, spacing-guide only): `--utility-magenta`

### Content

Update content in `lib/mock-data.ts` (fallback data), or through Sanity CMS via the schemas in `sanity/schemas/`.

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for the full deployment guide. For Vercel-specific steps, see [docs/VERCEL_SETUP.md](docs/VERCEL_SETUP.md).

The site can also be deployed to any platform that supports Next.js (Netlify, AWS Amplify, Railway, etc.).

## License

Private project — All rights reserved. Zeina Nossier.
