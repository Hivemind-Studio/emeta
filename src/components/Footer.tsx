import Link from "next/link";
import Image from "next/image";
import { brandUrl } from "@/lib/brandAssets";
import { getProducts } from "@/lib/data";
import type { SiteSettings } from "@/lib/data";

export async function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.linkedinUrl, label: "LinkedIn" },
    { href: settings.facebookUrl, label: "Facebook" },
    { href: settings.twitterUrl, label: "Twitter" },
    { href: settings.youtubeUrl, label: "YouTube" },
  ];
  // Product links point at each product's real detail page (internal linking)
  const products = await getProducts().catch(() => []);
  // Footer at 1440x1024; content column anchored at left x156.
  return (
    <footer className="relative overflow-hidden bg-brand text-white md:h-[1024px]">
      {/* Decorative layer — clipped to the footer box; nothing paints outside */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Blurred white Emeta emblem — anchored right, drifts slowly on scroll (desktop). */}
        <div className="motion-footer-emblem absolute" style={{ left: "45%", top: -420, width: "85%", aspectRatio: "1 / 1", height: "auto" }}>
          <Image src={brandUrl("iconWhite")} alt="" fill className="object-contain opacity-60 blur-[26px]" sizes="1224px" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1128px] px-6 pb-[48px] pt-[56px] md:px-0 md:pb-0 md:pt-[366px]">
        <p className="w-full max-w-[456px] text-base leading-relaxed text-white">
          Empowering businesses across Indonesia by distributing high-performance AI
          technologies and optimized cloud software.
        </p>
        <div className="mt-[44px] grid grid-cols-2 gap-[24px] md:flex md:gap-[80px]">
          <div className="w-[180px]">
            <h4 className="text-[20px] font-semibold text-white">Company</h4>
            <ul className="mt-[15px] space-y-[8px]">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/#about" },
                { label: "News & Blogs", href: "/blog" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[16px] text-white/95 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-[180px]">
            <h4 className="text-[20px] font-semibold text-white">Products</h4>
            <ul className="mt-[15px] space-y-[8px]">
              {(products.length > 0
                ? products.map((p) => ({ label: p.title, href: `/products/${p.slug}` }))
                : [{ label: "Products & Solutions", href: "/#products" }]
              ).map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[16px] text-white/95 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-[36px]">
          <p className="text-[20px] font-semibold text-white">Keep in Touch</p>
          <div className="mt-[15px] flex gap-[12px]">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener"
                aria-label={s.label}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/10 text-white md:h-[36px] md:w-[36px]"
              >
                <SocialIcon label={s.label} />
              </a>
            ))}
          </div>
        </div>
        <p className="mt-[40px] text-[20px] text-white md:mt-[82px]">{settings.copyright}</p>
      </div>
    </footer>
  );
}
function SocialIcon({ label }: { label: string }) {
  const cls = "h-[16px] w-[16px]";
  if (label === "LinkedIn")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.31h4.52V23H.24zM8.34 8.31h4.33v2.01h.06c.6-1.14 2.07-2.34 4.27-2.34 4.57 0 5.41 3.01 5.41 6.92V23h-4.52v-7.12c0-1.7-.03-3.88-2.37-3.88-2.37 0-2.73 1.85-2.73 3.76V23H8.34z"/></svg>
    );
  if (label === "Facebook")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>
    );
  if (label === "Twitter")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26L22.83 21.75h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.72 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z"/></svg>
    );
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12z"/></svg>
  );
}
