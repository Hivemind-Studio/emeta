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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PT Emeta Teknologi Indonesia | AI & Enterprise Software",
    template: "%s | PT Emeta Teknologi Indonesia",
  },
  description:
    "Bridging world-class AI and enterprise software with growing organizations and established enterprises across Indonesia.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
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
    <html lang="id" className={`${plusJakarta.variable} ${inter.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
