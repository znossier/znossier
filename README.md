# Zeina Nossier Portfolio

Personal portfolio site — designed and developed by Zeina Nossier.

A modern portfolio website built with Next.js, TypeScript, Tailwind CSS, and Sanity CMS. Live at [znossier.com](https://znossier.com).

## Features

- 🌓 Light/Dark mode toggle
- 📱 Fully responsive design
- 🎯 Smooth scroll navigation
- 🚀 Optimized performance with Next.js
- 📝 CMS-driven content (Sanity)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Geist
- **CMS**: Sanity (optional)
- **Theme**: next-themes

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

The site works with mock data by default. To use Sanity CMS:

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

The site will automatically use Sanity data when configured, otherwise it falls back to mock data.

## Project Structure

```
znossier/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Main page
│   ├── works/[slug]/      # Project detail pages
│   ├── sitemap.ts         # Sitemap
│   ├── robots.ts          # Robots.txt
│   └── api/               # API routes
│       └── sanity/        # Sanity CMS
├── components/            # React components
│   ├── Navigation.tsx     # Header navigation
│   ├── Hero.tsx           # Hero section
│   ├── About.tsx          # About section
│   ├── Works.tsx          # Projects section
│   ├── Services.tsx       # Services section
│   ├── Process.tsx        # Process section
│   ├── TechStack.tsx      # Tech stack
│   ├── Footer.tsx         # Footer (includes contact)
│   ├── ThemeToggle.tsx    # Theme toggle
│   ├── ProjectDetailPage.tsx
│   └── ...
├── hooks/                 # React hooks
├── lib/                   # Utilities & data
│   ├── mock-data.ts       # Mock data
│   ├── sanity.ts          # Sanity client
│   ├── sanity-queries.ts  # Sanity queries
│   ├── theme.tsx          # Theme provider
│   ├── utils.ts           # Helper functions
│   └── ...
├── sanity/                # Sanity schemas
│   └── schemas/
└── docs/                  # Setup & deployment docs
    ├── DEPLOYMENT.md
    ├── VERCEL_SETUP.md
    └── ...
```

## Customization

### Colors

Edit `app/globals.css` to change the color scheme:
- Light mode background: `#FAFAFA`
- Dark mode background: `#1A1A1A`
- Accent color: `#6B7987`
- Link color: `#3E99F3`

### Content

Update content in `lib/mock-data.ts` or through Sanity CMS.

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for the full deployment guide. For Vercel-specific steps, see [docs/VERCEL_SETUP.md](docs/VERCEL_SETUP.md).

The site can also be deployed to any platform that supports Next.js (Netlify, AWS Amplify, Railway, etc.).

## License

Private project — All rights reserved. Zeina Nossier.
