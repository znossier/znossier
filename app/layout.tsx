import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeina Nossier - UI/UX & Product Designer",
  description: "Crafting Simple, Effective Designs for Meaningful Experiences. UI/UX & Product Designer based in Cairo, EG.",
  metadataBase: new URL("https://znossier.com"),
  keywords: [
    "UI/UX Designer",
    "Product Designer",
    "Cairo",
    "Egypt",
    "Design Portfolio",
    "User Experience Design",
    "User Interface Design",
    "Digital Design",
    "Web Design",
    "Graphic Design",
    "Zeina Nossier",
  ],
  authors: [{ name: "Zeina Nossier" }],
  creator: "Zeina Nossier",
  publisher: "Zeina Nossier",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://znossier.com",
    siteName: "Zeina Nossier Portfolio",
    title: "Zeina Nossier - UI/UX & Product Designer",
    description: "Crafting Simple, Effective Designs for Meaningful Experiences. UI/UX & Product Designer based in Cairo, EG.",
    images: [
      {
        url: "/zeina-photo.jpg",
        width: 1200,
        height: 630,
        alt: "Zeina Nossier - UI/UX & Product Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeina Nossier - UI/UX & Product Designer",
    description: "Crafting Simple, Effective Designs for Meaningful Experiences. UI/UX & Product Designer based in Cairo, EG.",
    images: ["/zeina-photo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      // Primary fallback for mobile, scrapers, link previews (Vercel, Slack, etc.)
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      // SVG for desktop browsers that support it
      { url: "/favicon-light.svg", media: "(prefers-color-scheme: light)", type: "image/svg+xml" },
      { url: "/favicon-dark.svg", media: "(prefers-color-scheme: dark)", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://znossier.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Zeina Nossier",
    jobTitle: "UI/UX & Product Designer",
    description: "Crafting Simple, Effective Designs for Meaningful Experiences. UI/UX & Product Designer based in Cairo, EG.",
    url: "https://znossier.com",
    image: "https://znossier.com/zeina-photo.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cairo",
      addressCountry: "EG",
    },
    sameAs: [
      "https://linkedin.com/in/zeinanossier",
      "https://behance.net/zeinanossier",
      "https://github.com/z-nossier",
    ],
    email: "zeina.nossier@gmail.com",
    knowsAbout: [
      "User Experience Design",
      "User Interface Design",
      "Product Design",
      "Graphic Design",
      "Web Design",
      "Digital Design",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <SmoothScroll>
            <Cursor />
            {children}
          </SmoothScroll>
          <ThemeToggle variant="fab" />
        </ThemeProvider>
      </body>
    </html>
  );
}
