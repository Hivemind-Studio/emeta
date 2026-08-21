import Link from "next/link";
import Image from "next/image";
import { brandUrl } from "@/lib/brandAssets";
import type { SiteSettings } from "@/lib/data";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/#about" },
      { label: "Services", href: "/#services" },
      { label: "News & Blogs", href: "/blog" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "WrenAI", href: "/#products" },
      { label: "BarkingDogAI", href: "/#products" },
      { label: "AI Amaze", href: "/#products" },
      { label: "Phison", href: "/#products" },
    ],
  },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.linkedinUrl, label: "LinkedIn" },
    { href: settings.facebookUrl, label: "Facebook" },
    { href: settings.twitterUrl, label: "Twitter" },
    { href: settings.youtubeUrl, label: "YouTube" },
  ];
  return (
    <footer className="bg-brand text-white">
      <div className="container-emeta py-16 md:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* Tagline */}
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-white">
              Empowering businesses across Indonesia by distributing high-performance AI
              technologies and optimized cloud software.
            </p>
            <p className="mt-8 text-[15px] font-semibold">Keep in Touch</p>
            <div className="mt-4 flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand"
                >
                  {s.label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="flex gap-20">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-[20px] font-semibold text-white">{col.title}</h4>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-base text-white/90 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-emeta py-6">
          <p className="text-[20px] font-normal text-white">{settings.copyright}</p>
        </div>
      </div>
    </footer>
  );
}