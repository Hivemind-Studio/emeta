import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings, getProducts, getFeaturedPosts } from "@/lib/data";
import { brandUrl } from "@/lib/brandAssets";
import { buildAssetUrl } from "@/lib/storage/url";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PT Emeta Teknologi Indonesia | AI & Enterprise Software",
  description:
    "Bridging world-class AI and enterprise software with growing organizations and established enterprises across Indonesia.",
  alternates: { canonical: "/" },
};

/** Content region = 1128px wide, left edge at 156px (design 1440 grid). */
const CTN = "mx-auto w-full max-w-[1128px] md:px-0";

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex h-[23px] items-center justify-center rounded-full bg-brand-light px-3 text-[12px] font-bold leading-none text-paper">
      {children}
    </span>
  );
}

export default async function HomePage() {
  const [settings, products, posts] = await Promise.all([
    getSettings(),
    getProducts(),
    getFeaturedPosts(3),
  ]);

  const stats = [
    { value: "3000+", label: "Channel Partners" },
    { value: "35", label: "Strategic Locations" },
    { value: "300", label: "Cities in Indonesia" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header brandName="PT Emeta Teknologi Indonesia" variant="dark" />
      <main className="flex-1">
        {/* ===== HERO (Design 20:1383, 0..1024) ===== */}
        <section className="relative h-[1024px] overflow-hidden bg-[#fafafa]">
          {/* Decorative layer — everything inside is clipped by the hero box */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* Background bleeds past BOTH edges proportionally (-13.2% / 126.4% = Figma -190px/1820px
                at 1440) so it always covers the full section on any viewport width */}
            <div className="absolute inset-y-0" style={{ left: "-13.2%", width: "126.4%" }}>
              <Image src={brandUrl("heroBg")} alt="" fill priority className="object-cover" sizes="100vw" />
            </div>
            {/* Blurred white Emeta icon — relative to the hero container
                (26.25% left, 16.3% top, 98.3% wide = Figma 378/167/1416 in a 1440 frame) */}
            <div className="absolute" style={{ left: "26.25%", top: "16.31%", width: "98.33%", aspectRatio: "1 / 1" }}>
              <Image src={brandUrl("iconWhite")} alt="" fill className="object-contain opacity-50 blur-[40px]" sizes="1416px" />
            </div>
          </div>
          <div className={`${CTN} relative z-10`}>
            <div className="pt-[384px]">
              <h1 className="max-w-[533px] text-[54px] font-extrabold leading-[1.78] text-paper">
                The Best Click Bait In The World
              </h1>
              <p className="mt-[27px] max-w-[533px] font-inter text-[18px] leading-normal text-white">
                {settings.heroBody}
              </p>
              <form className="mt-[27px] flex" action="/#contact">
                <input type="email" placeholder="Email" name="email"
                  className="h-[48px] w-[360px] border-none bg-paper px-4 font-inter text-[14px] text-ink-soft outline-none placeholder:text-graphite" />
                <button type="submit"
                  className="inline-flex h-[47px] w-[154px] items-center justify-center bg-brand-light px-6 font-inter text-[16px] font-semibold text-white transition-colors hover:bg-[#6fa8ee]">
                  Get in Touch
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ===== ABOUT (Design 20:1403, 1024..1536) ===== */}
        <section id="about" className="h-[512px] bg-paper">
          <div className={`${CTN}`}>
            <div className="flex items-start justify-between gap-10 pt-[86px]">
              <h2 className="w-[533px] text-[54px] font-extrabold leading-[1.18] text-ink-soft">
                {settings.aboutTitle}
              </h2>
              <div className="w-[360px]">
                <p className="font-inter text-[18px] leading-[1.55] text-ink-soft">
                  {settings.aboutBody}
                </p>
              </div>
            </div>
            {/* Stats in #f3f8ff box */}
            <div className="mt-[44px] bg-brand-soft">
              <div className="flex justify-between px-[32px] py-[28px]">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-sora text-[40px] font-extrabold leading-none text-brand">{s.value}</p>
                    <p className="mt-[10px] font-inter text-[16px] font-semibold text-ink">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRODUCTS (Offerings, 1536..2560) ===== */}
        <section id="products" className="h-[1024px] bg-paper">
          <div className={`${CTN}`}>
            <div className="flex flex-col items-center pt-[267px] text-center">
              <span className="inline-flex h-[30px] items-center rounded-full bg-[#e7edf7] px-[16px] text-[14px] font-semibold uppercase tracking-[0.2em] text-brand">
                Offerings
              </span>
              <h2 className="mt-[24px] text-[54px] font-extrabold leading-[1.18] text-ink-soft">
                Product &amp; Solutions
              </h2>
              <p className="mt-[2px] font-inter text-[18px] text-ink-soft">
                Find out our latest news and updates
              </p>
            </div>
            <div className="mt-[32px] flex justify-between">
              {products.map((p) => (
                <article key={p.id} className="flex h-[319px] w-[360px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.08)]">
                  <div className="flex h-[64px] shrink-0 items-center gap-3 bg-brand px-4">
                    <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[6px] bg-paper">
                      {p.iconUrl && <Image src={buildAssetUrl(p.iconUrl)} alt="" width={28} height={28} className="object-contain" />}
                    </div>
                    <h3 className="text-[20px] font-bold leading-none text-paper">{p.title}</h3>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2 px-4 pt-[20px]">
                    {p.tags.split(",").filter(Boolean).map((t, i) => (
                      <Tag key={i}>{t.trim()}</Tag>
                    ))}
                  </div>
                  <p className="flex-1 overflow-hidden px-4 pt-[12px] text-[16px] leading-[1.5] text-ink-soft">
                    {p.description}
                  </p>
                  <p className="shrink-0 px-4 pb-[16px] pt-[16px] text-[16px] font-bold leading-none text-brand">Learn More</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== NEWS & BLOGS (41:1550, 2560..3584) ===== */}
        <section id="news" className="h-[1024px] bg-paper">
          <div className={`${CTN}`}>
            <h2 className="pt-[233px] text-[54px] font-extrabold leading-[1.18] text-ink-soft">
              News &amp; Blogs
            </h2>
            <p className="mt-[73px] font-inter text-[18px] text-ink-soft">
              Find out our latest news and updates
            </p>
            <div className="mt-[68px] flex justify-between">
              {posts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group w-[269px] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.04)]">
                  <div className="relative h-[206px] w-[269px] overflow-hidden bg-[#b3b3b3]">
                    {p.imageUrl ? (
                      <Image src={buildAssetUrl(p.imageUrl)} alt={p.title} fill className="object-cover" sizes="269px" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-inter text-[18px] font-bold text-line">Place Holder</span>
                      </div>
                    )}
                  </div>
                  <div className="p-[12px]">
                    <h3 className="text-[20px] font-bold leading-snug text-ink-soft">{p.title}</h3>
                    <p className="line-clamp-2 text-[16px] leading-[1.4] text-ink-soft">{p.excerpt}</p>
                    <p className="mt-[4px] text-[16px] font-bold text-brand">Read More</p>
                  </div>
                </Link>
              ))}
              {/* More card */}
              <Link href="/blog" className="relative flex h-[326px] w-[247px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-black/5 bg-brand shadow-[0_4px_4px_rgba(0,0,0,0.04)] self-start">
                {/* blurry blue circle bg — top-right behind text (Figma 41:1560, LAYER_BLUR 100) */}
                <span
                  className="absolute h-[209px] w-[209px] rounded-full bg-brand-light blur-[50px]"
                  style={{ left: 1168 - 1037, top: 3077 - 3025 }}
                  aria-hidden="true"
                />
                <span className="relative text-[20px] font-bold leading-none text-paper">Find More</span>
                <span className="relative mt-[4px] text-[16px] font-bold leading-none text-brand-light">Here</span>
              </Link>
            </div>
          </div>
        </section>
        {/* ===== CTA (20:1431, 3584..4096) ===== */}
                <section className="h-[512px] bg-paper pt-[90px]">
                  <div className={`${CTN}`}>
                    <div className="relative flex h-[332px] items-center justify-between overflow-hidden bg-brand">
                      {/* Decorative layer — clipped to the CTA box */}
                      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                        {/* CTA blob artwork (Figma 20:1433, 1294x920) — relative to CTA box */}
                        <div className="absolute" style={{ left: -83, top: -294, width: 1294, height: 920 }}>
                          <Image src={brandUrl("ctaBg")} alt="" fill className="object-cover" sizes="1294px" />
                        </div>
                        {/* Blurred white icon (Figma 20:1439) — relative to CTA box, right side */}
                        <div className="absolute right-[24px] top-1/2 -translate-y-1/2 opacity-30 h-[411px] w-[411px]">
                          <Image src={brandUrl("iconWhite")} alt="" fill className="object-contain blur-[16px]" sizes="411px" />
                        </div>
                      </div>
                      {/* content left-aligned x188 */}
                      <div className="relative z-10 pl-[32px]">
                        <h2 className="max-w-[800px] text-[54px] font-extrabold leading-[1.15] text-paper">
                          Ready to Transform Your <span className="whitespace-nowrap">Business?</span>
                        </h2>
                        <p className="mt-[10px] font-inter text-[18px] text-paper">Here For you</p>
                        <button className="mt-[18px] inline-flex h-[46px] w-[144px] items-center justify-center bg-white font-inter text-[15px] font-semibold text-brand">
                          Book a Demo
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
        <section id="contact" className="min-h-[1024px] bg-paper">
          <div className={`${CTN}`}>
            <h2 className="pt-[193px] text-[54px] font-extrabold leading-[1.18] text-ink-soft">Contact Us</h2>
            <div className="mt-[44px] flex justify-between pb-[60px]">
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
                <div className="relative mt-[40px] h-[240px] w-[492px] overflow-hidden">
                  <Image src={brandUrl("contactMap")} alt="" fill className="object-cover" sizes="492px" />
                </div>
              </div>
              <div className="w-[572px] bg-brand-soft px-[40px] py-[40px]">
                <h3 className="text-[22px] font-bold text-navy-emeta">Send a Message</h3>
                <form className="mt-[28px] space-y-[24px]">
                  {(["Name", "Email", "Message"] as const).map((label) => (
                    <div key={label}>
                      <label className="text-[14px] font-semibold text-graphite">{label}</label>
                      {label === "Message" ? (
                        <textarea placeholder="Describe your requirements..." rows={3}
                          className="mt-[6px] h-[100px] w-full border-none bg-white px-4 py-3 text-[14px] text-graphite outline-none placeholder:text-graphite" />
                      ) : (
                        <input type={label === "Email" ? "email" : "text"}
                          placeholder={label === "Name" ? "Your name" : "your@email.com"}
                          className="mt-[6px] h-[48px] w-full border-none bg-white px-4 text-[14px] text-graphite outline-none placeholder:text-graphite" />
                      )}
                    </div>
                  ))}
                  <button className="inline-flex h-[48px] w-[168px] items-center justify-center bg-brand text-[16px] font-semibold text-white">
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}