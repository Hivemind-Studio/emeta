"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { brandUrl } from "@/lib/brandAssets";

// Nav links per the Emeta Design page (productsHref switches to /coming-soon when disabled)
const LINKS = (productsHref: string) => [
  { href: "/#about", label: "About Us" },
  { href: productsHref, label: "Products" },
  { href: "/#services", label: "Services" },
  { href: "/blog", label: "Blogs" },
];

export function Header({
  brandName,
  variant = "light",
  productsEnabled = true,
}: {
  brandName: string;
  variant?: "dark" | "light";
  /** When false, the Products nav item points to the Coming Soon page. */
  productsEnabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const dark = variant === "dark"; // over hero (white logo, mist nav)

  return (
    <header
      className={
        dark
          ? "fixed inset-x-0 top-0 z-50"
          : "fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white shadow-sm"
      }
    >
      <div className="container-emeta flex h-[88px] items-center justify-between overflow-hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={brandUrl(dark ? "logoWhite" : "logoBlue")}
            alt={brandName}
            width={174}
            height={52}
            className="h-[52px] w-[174px] object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Utama">
          {LINKS(productsEnabled ? "/#products" : "/coming-soon").map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`text-[15px] font-medium transition-colors ${
                dark ? "text-mist hover:text-white" : "text-[#1f2937] hover:text-brand"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <a
          href="/#contact"
          className={`inline-flex h-[47px] w-[154px] items-center justify-center rounded-[8px] text-[16px] font-semibold ${
            dark ? "bg-brand text-paper hover:bg-[#1450b5]" : "bg-brand text-white hover:bg-[#1450b5]"
          }`}
        >
          Get in Touch
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden transition-colors ${dark ? "text-white" : "text-ink"}`}
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
        <nav className={`border-t px-6 py-4 lg:hidden ${dark ? "border-white/10 bg-black/70" : "border-black/5 bg-white"}`}>
          <ul className="flex flex-col gap-4">
            {LINKS(productsEnabled ? "/#products" : "/coming-soon").map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`text-base font-medium ${dark ? "text-white/80" : "text-graphite"}`}
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