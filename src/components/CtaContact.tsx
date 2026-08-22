import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/data";
import { brandUrl } from "@/lib/brandAssets";
import { ContactForm } from "@/components/ContactForm";

/**
 * CTA band ("Ready to Transform Your Business?") — Figma 20:1431.
 * Shared by the Home page and the Product Detail page (41:2475).
 * The button is a "Book a Demo" CTA: jumps to the contact form with the
 * message pre-filled (?demo=1).
 */
export function CtaSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-paper pt-[60px] md:h-[512px] md:pt-[90px]">
      <div className="mx-auto w-full max-w-[1128px] md:px-0">
        <div className="motion-cta relative flex h-[332px] items-center justify-between overflow-hidden rounded-2xl bg-brand">
          {/* Decorative layer — clipped to the CTA box */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* CTA blob artwork (Figma 20:1433, 1294x920) — relative to CTA box.
                Blobs drift at individual rates on scroll (desktop, motion-safe). */}
            <div className="motion-blob-1 absolute opacity-60 md:opacity-100" style={{ left: -83, top: -294, width: 1294, height: 920 }}>
              <Image src={brandUrl("ctaBg")} alt="" fill className="object-cover" sizes="1294px" />
            </div>
            {/* Extra depth planes: soft light-blue orbs, desktop motion only */}
            <div className="motion-blob-3 absolute h-[300px] w-[300px] rounded-full bg-brand-light/25 blur-[70px]" style={{ right: 340, top: -80 }} aria-hidden="true" />
            <div className="motion-blob-4 absolute h-[220px] w-[220px] rounded-full bg-white/15 blur-[60px]" style={{ left: 480, bottom: -90 }} aria-hidden="true" />
            {/* Blurred white icon (Figma 20:1439) — relative to CTA box, right side.
                Drifts slower than the panel content on scroll (desktop, motion-safe). */}
            <div className="motion-blob-2 absolute right-0 top-[-18px] opacity-30 h-[411px] w-[411px]">
              <Image src={brandUrl("iconWhite")} alt="" fill className="object-contain" sizes="411px" />
            </div>
          </div>
          {/* content left-aligned x188 */}
          <div className="relative z-10 flex min-h-[280px] w-full flex-col pl-[24px] pr-[16px] pt-[32px] pb-[32px] md:min-h-[332px] md:pl-[32px] md:pr-0 md:pb-0">
            <h2 className="max-w-[85%] text-[30px] font-extrabold leading-[1.15] text-paper md:max-w-[800px] md:text-[54px]">
              {settings.ctaTitle}
            </h2>
            <p className="mt-[32px] font-inter text-[18px] text-paper">{settings.ctaSubtitle}</p>
            <Link
              href="/?demo=1#contact"
              className="mt-[24px] inline-flex h-[46px] w-[144px] items-center justify-center rounded-[8px] bg-white font-inter text-[15px] font-semibold text-brand transition-colors hover:bg-brand-soft md:mt-[32px]"
            >
              {settings.ctaButtonLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Contact section ("Contact Us" + info/map + Send a Message form) — Figma 20:1447.
 * Shared by the Home page and the Product Detail page (41:2475).
 */
export function ContactSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="contact" className="min-h-[1024px] bg-paper">
      <div className="mx-auto w-full max-w-[1128px] md:px-0">
        <h2 className="pt-[56px] text-[34px] font-extrabold leading-[1.18] text-ink-soft md:pt-[193px] md:text-[54px]">
          {settings.contactTitle}
        </h2>
        <div className="mt-[64px] flex w-full flex-col justify-between gap-[40px] pb-[60px] md:flex-row md:gap-0">
          {/* Left info + live Google Map (Ruko WTC Matahari Serpong) */}
          <div className="w-full md:max-w-[492px]">
            <div className="space-y-[32px]">
              {[
                { k: "Our Office", v: settings.officeAddress },
                { k: "Phone", v: settings.phoneDisplay },
                { k: "Email Support", v: settings.emailSupport },
              ].map((c) => (
                <div key={c.k}>
                  <p className="text-[18px] font-bold text-brand">{c.k}</p>
                  <p className="mt-[6px] text-[16px] leading-[1.5] text-ink">{c.v}</p>
                </div>
              ))}
            </div>
            <div className="relative mt-[24px] h-[240px] w-full overflow-hidden rounded-[12px] bg-brand-soft ring-1 ring-[#e5e7eb] md:mt-[40px]">
              <iframe
                title="Ruko WTC Matahari Serpong"
                src="https://maps.google.com/maps?q=Ruko%20WTC%20Matahari%20Serpong&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="w-full rounded-[20px] bg-brand-soft px-[24px] py-[32px] md:w-[572px] md:max-w-[572px] md:px-[40px] md:py-[40px]">
            <h3 className="text-[22px] font-bold text-navy-emeta">Send a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
