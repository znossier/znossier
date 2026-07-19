import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const OG_IMAGE = "/og-image.jpg";

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
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Zeina Nossier — UI/UX & Product Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeina Nossier",
    description: "Crafting Simple, Effective Designs for Meaningful Experiences. UI/UX & Product Designer based in Cairo, EG.",
    images: [OG_IMAGE],
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
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-B.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
    image: "https://znossier.com/og-image.jpg",
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
        <Script
          id="boot-loader-fouc"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=sessionStorage.getItem('zn-boot-seen')==='1';var n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];var r=n?n.type==='reload':false;if(!s||r)document.documentElement.setAttribute('data-boot','pending');}catch(e){document.documentElement.setAttribute('data-boot','pending');}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
