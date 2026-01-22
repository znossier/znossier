# Zeina Nossier Portfolio

A modern portfolio website built with Next.js, TypeScript, Tailwind CSS, and Sanity CMS.

## Features

- 🎨 Pixel-perfect design matching reference site
- 🌓 Light/Dark mode toggle
- 📱 Fully responsive design
- 🎯 Smooth scroll navigation
- 🚀 Optimized performance with Next.js
- 📝 CMS-driven content (Sanity)

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
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

## Sanity CMS Setup (Optional)

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
│   └── api/               # API routes
├── components/            # React components
│   ├── Navigation.tsx    # Header navigation
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section
│   ├── Works.tsx         # Projects section
│   ├── Services.tsx      # Services section
│   ├── Contact.tsx       # Contact section
│   ├── Footer.tsx        # Footer
│   └── ThemeToggle.tsx   # Theme toggle
├── lib/                  # Utilities
│   ├── mock-data.ts      # Mock data
│   ├── sanity.ts         # Sanity client
│   ├── sanity-queries.ts # Sanity queries
│   ├── theme.tsx         # Theme provider
│   └── utils.ts          # Helper functions
└── sanity/               # Sanity schemas
    └── schemas/          # Content schemas
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

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables if using Sanity
4. Deploy!

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- etc.

## License

Private project - All rights reserved
