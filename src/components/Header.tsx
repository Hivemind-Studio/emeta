"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { brandUrl } from "@/lib/brandAssets";

// Nav menu per user request: Home, About Us, Products, Blog.
// Products → /#products when enabled, /coming-soon when not exists/disabled.
const LINKS = (productsHref: string) => [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: productsHref, label: "Products" },
  { href: "/blog", label: "Blog" },
];

export function Header({
  brandName,
  variant = "light",
  productsEnabled = true,
}: {
  brandName: string;
  variant?: "dark" | "light";
  /** When false/not existing, the Products nav item points to the Coming Soon page. */
  productsEnabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dark = variant === "dark"; // over hero (white logo, mist nav)

  // Transparent at top → solid white + shadow once scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "solid" = scrolled state or light-variant pages (blog/read) that need contrast from the start
  const solid = scrolled || !dark;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "border-b border-black/5 bg-white shadow-sm backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[88px] w-full max-w-[1128px] items-center justify-between overflow-hidden px-6 md:px-0">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={brandUrl(solid ? "logoBlue" : dark ? "logoWhite" : "logoWhite")}
            alt={brandName}
            width={174}
            height={52}
            className="h-[52px] w-[174px] object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Utama">
          {LINKS(productsEnabled ? "/#products" : "/coming-soon").map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`font-inter text-[15px] font-medium transition-colors ${
                solid ? "text-[#1f2937] hover:text-brand" : "text-mist hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <a
          href="/#contact"
          className={`inline-flex h-[47px] w-[154px] items-center justify-center rounded-[8px] bg-brand font-inter text-[16px] font-semibold text-paper transition-colors hover:bg-[#1450b5] ${
            solid ? "" : "text-white"
          }`}
        >
          Get in Touch
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden transition-colors ${solid ? "text-ink" : "text-white"}`}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-black/5 bg-white px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            {LINKS(productsEnabled ? "/#products" : "/coming-soon").map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-graphite"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#contact" onClick={() => setOpen(false)} className="inline-flex h-[47px] w-[154px] items-center justify-center rounded-[8px] bg-brand text-sm font-semibold text-white">
                Get in Touch
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
