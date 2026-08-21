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
      { label: "Services", href: "/#products" },
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
  // Footer at 1440x1024; content column anchored at left x156.
  return (
    <footer className="relative h-[1024px] overflow-hidden bg-brand text-white">
      {/* Large white Emeta icon watermark (Figma 20:1349 at 252,4497,1599x1599) */}
      <div
        className="pointer-events-none absolute"
        style={{ left: 252, top: 4497 - 5120, width: 1599, height: 1599 }}
        aria-hidden="true"
      >
        <Image src={brandUrl("iconWhite")} alt="" fill className="object-contain opacity-100" sizes="1599px" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1128px] px-6 md:px-0">
        <p className="w-[456px] pt-[366px] text-base leading-relaxed text-white">
          Empowering businesses across Indonesia by distributing high-performance AI
          technologies and optimized cloud software.
        </p>
        <div className="mt-[64px] flex gap-[80px]">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[20px] font-semibold text-white">{col.title}</h4>
              <ul className="mt-[15px] space-y-[8px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[16px] text-white/95 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-[54px]">
          <p className="text-[20px] font-semibold text-white">Keep in Touch</p>
          <div className="mt-[15px] flex gap-[12px]">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener"
                aria-label={s.label}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white text-brand"
              >
                {s.label[0]}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-[44px] text-[20px] text-white">{settings.copyright}</p>
      </div>
    </footer>
  );
}