import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/data";
import { brandUrl } from "@/lib/brandAssets";

/**
 * CTA band ("Ready to Transform Your Business?") — Figma 20:1431.
 * Shared by the Home page and the Product Detail page (41:2475).
 * The button is a "Book a Demo" CTA: jumps to the contact form with the
 * message pre-filled (?demo=1).
 */
export function CtaSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="h-[512px] bg-paper pt-[90px]">
      <div className="mx-auto w-full max-w-[1128px] md:px-0">
        <div className="relative flex h-[332px] items-center justify-between overflow-hidden rounded-2xl bg-brand">
          {/* Decorative layer — clipped to the CTA box */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* CTA blob artwork (Figma 20:1433, 1294x920) — relative to CTA box */}
            <div className="absolute" style={{ left: -83, top: -294, width: 1294, height: 920 }}>
              <Image src={brandUrl("ctaBg")} alt="" fill className="object-cover" sizes="1294px" />
            </div>
            {/* Blurred white icon (Figma 20:1439) — relative to CTA box, right side */}
            <div className="absolute right-0 top-[-18px] opacity-30 h-[411px] w-[411px]">
              <Image src={brandUrl("iconWhite")} alt="" fill className="object-contain" sizes="411px" />
            </div>
          </div>
          {/* content left-aligned x188 */}
          <div className="relative z-10 pl-[32px] pt-[32px]">
            <h2 className="max-w-[800px] text-[54px] font-extrabold leading-[1.15] text-paper">
              {settings.ctaTitle}
            </h2>
            <p className="mt-[32px] font-inter text-[18px] text-paper">{settings.ctaSubtitle}</p>
            <Link
              href="/?demo=1#contact"
              className="mt-[32px] inline-flex h-[46px] w-[144px] items-center justify-center rounded-[8px] bg-white font-inter text-[15px] font-semibold text-brand transition-colors hover:bg-brand-soft"
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
        <h2 className="pt-[193px] text-[54px] font-extrabold leading-[1.18] text-ink-soft">
          {settings.contactTitle}
        </h2>
        <div className="mt-[64px] flex justify-between pb-[60px]">
          {/* Left info + live Google Map (Ruko WTC Matahari Serpong) */}
          <div className="w-[492px]">
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
            <div className="relative mt-[40px] h-[240px] w-full overflow-hidden rounded-[12px] ring-1 ring-[#e5e7eb]">
              <iframe
                title="Ruko WTC Matahari Serpong"
                src="https://maps.google.com/maps?q=Ruko%20WTC%20Matahari%20Serpong&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="w-[572px] rounded-[20px] bg-brand-soft px-[40px] py-[40px]">
            <h3 className="text-[22px] font-bold text-navy-emeta">Send a Message</h3>
            <form className="mt-[28px] space-y-[16px]" action="/api/inquiry" method="POST">
              {(["Name", "Email", "Message"] as const).map((label) => (
                <div key={label}>
                  <label className="text-[14px] font-semibold text-graphite">{label}</label>
                  {label === "Message" ? (
                    <textarea name="message" required placeholder="Describe your requirements..." rows={3}
                      className="mt-[8px] h-[100px] w-full rounded-[8px] border-none bg-white px-4 py-3 text-[14px] text-graphite outline-none placeholder:text-graphite" />
                  ) : (
                    <input type={label === "Email" ? "email" : "text"} name={label.toLowerCase()} required
                      placeholder={label === "Name" ? "Your name" : "your@email.com"}
                      className="mt-[8px] h-[48px] w-full rounded-[8px] border-none bg-white px-4 text-[14px] text-graphite outline-none placeholder:text-graphite" />
                  )}
                </div>
              ))}
              <button type="submit" className="inline-flex h-[48px] w-[168px] items-center justify-center rounded-[8px] bg-brand text-[16px] font-semibold text-white">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
