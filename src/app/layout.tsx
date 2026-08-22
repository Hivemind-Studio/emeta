import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Sora } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora-ui",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Canonical production origin
const SITE_URL = process.env.SITE_URL || "https://emeta.zeabur.app";
const OG_IMAGE = `${SITE_URL}/images/og-cover.jpg`;

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PT Emeta Teknologi Indonesia",
  alternateName: "Emeta",
  url: SITE_URL,
  logo: OG_IMAGE,
  description:
    "AI and enterprise software company serving organizations across Indonesia.",
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ruko WTC Matahari No. 921, Jl. Raya Serpong",
    addressLocality: "Tangerang Selatan",
    addressRegion: "Banten",
    postalCode: "15326",
    addressCountry: "ID",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@emeta.co.id",
    contactType: "sales",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PT Emeta Teknologi Indonesia | AI & Enterprise Software",
    template: "%s | Emeta",
  },
  description:
    "Bridging world-class AI and enterprise software with growing organizations and established enterprises across Indonesia.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "PT Emeta Teknologi Indonesia",
    title: "PT Emeta Teknologi Indonesia | AI & Enterprise Software",
    description:
      "Bridging world-class AI and enterprise software with growing organizations and established enterprises across Indonesia.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "PT Emeta Teknologi Indonesia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Emeta Teknologi Indonesia | AI & Enterprise Software",
    description:
      "Bridging world-class AI and enterprise software with growing organizations and established enterprises across Indonesia.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
