import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const FAVICON = "/favicon-B.png";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Zeina Nossier",
    template: "%s | Zeina Nossier",
  },
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
    title: "Zeina Nossier",
    description: "Crafting Simple, Effective Designs for Meaningful Experiences. UI/UX & Product Designer based in Cairo, EG.",
    images: [
      {
        url: "/zeina-photo.jpg",
        width: 1200,
        height: 630,
        alt: "Zeina Nossier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeina Nossier",
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
    icon: [{ url: FAVICON, sizes: "64x64", type: "image/png" }],
    apple: [{ url: FAVICON, sizes: "64x64", type: "image/png" }],
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
      "https://github.com/znossier",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
