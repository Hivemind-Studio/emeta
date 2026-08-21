import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings, getProducts, getPublishedPosts, getFeaturedPosts } from "@/lib/data";
import { brandUrl } from "@/lib/brandAssets";
import { buildAssetUrl } from "@/lib/storage/url";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://emeta.zeabur.app";

export const metadata = {
  title: "PT Emeta Teknologi Indonesia | AI & Enterprise Software",
  description:
    "Bridging world-class AI and enterprise software with growing organizations and established enterprises across Indonesia.",
  alternates: { canonical: "/" },
};

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-[3px] text-xs font-bold text-paper">
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header brandName="PT Emeta Teknologi Indonesia" variant="dark" />
      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden bg-[#fafafa]">
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={brandUrl("heroBg")}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="container-emeta relative z-10 flex min-h-[1024px] flex-col justify-center">
            <h1 className="max-w-[533px] font-sans text-[clamp(2.75rem,5vw,3.375rem)] font-extrabold leading-[1.18] text-paper">
              The Best Click Bait In The World
            </h1>
            <p className="mt-5 max-w-[533px] font-inter text-lg leading-relaxed text-white">
              {settings.heroBody}
            </p>
            <form className="mt-8 flex max-w-[533px] items-center gap-3" action="/#contact">
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="h-[48px] flex-1 border-none bg-paper px-5 font-inter text-base text-ink-soft outline-none placeholder:text-graphite"
              />
              <button
                type="submit"
                className="inline-flex h-[47px] items-center justify-center bg-brand-light px-6 font-inter text-base font-semibold text-paper transition-colors hover:bg-[#6fa8ee]"
              >
                Get in Touch
              </button>
            </form>
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section id="about" className="bg-paper">
          <div className="container-emeta flex min-h-[512px] flex-col justify-center gap-10 py-16 md:flex-row md:items-center md:justify-between">
            <h2 className="max-w-[520px] font-sans text-[clamp(2.5rem,5vw,3.375rem)] font-extrabold leading-[1.1] text-ink-soft">
              {settings.aboutTitle}
            </h2>
            <p className="max-w-[480px] font-inter text-lg leading-relaxed text-ink">
              {settings.aboutBody}
            </p>
          </div>

          {/* Stats */}
          <div className="container-emeta grid grid-cols-1 gap-10 pb-16 sm:grid-cols-3">
            {[
              { value: "3000+", label: "Channel Partners" },
              { value: "35", label: "Strategic Locations" },
              { value: "300", label: "Cities in Indonesia" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-sora text-4xl font-extrabold text-brand">{s.value}</p>
                <p className="mt-2 font-inter text-base font-semibold text-ink">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PRODUCTS (Offerings / Product & Solutions) ===== */}
        <section id="products" className="bg-paper">
          <div className="container-emeta py-16">
            <p className="eyebrow text-center">Offerings</p>
            <h2 className="section-heading mt-3 text-center text-[clamp(2rem,5vw,3.375rem)]">
              Product &amp; Solutions
            </h2>
            <p className="mt-2 text-center font-inter text-lg text-ink">
              Find out our latest news and updates
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {products.map((p) => (
                <article
                  key={p.id}
                  className="group overflow-hidden rounded-none border border-line/30 bg-paper"
                >
                  {/* Blue icon header */}
                  <div className="flex h-[64px] items-center gap-3 bg-brand px-4">
                    {p.iconUrl && (
                      <Image
                        src={buildAssetUrl(p.iconUrl)}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full bg-paper object-contain p-1"
                      />
                    )}
                    <h3 className="font-sans text-[20px] font-bold text-paper">{p.title}</h3>
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 px-4 pt-3">
                    {p.tags.split(",").filter(Boolean).map((t, i) => (
                      <Tag key={i}>{t.trim()}</Tag>
                    ))}
                  </div>
                  <p className="mt-3 px-4 font-sans text-base leading-relaxed text-ink-soft">
                    {p.description}
                  </p>
                  <p className="px-4 py-4 font-sans text-base font-bold text-brand">Learn More</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== NEWS & BLOGS ===== */}
        <section id="news" className="bg-paper">
          <div className="container-emeta py-16">
            <h2 className="section-heading text-[clamp(2rem,5vw,3.375rem)]">News &amp; Blogs</h2>
            <p className="mt-2 font-inter text-lg text-ink">Find out our latest news and updates</p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group overflow-hidden border border-line/30 bg-white"
                >
                  {p.imageUrl && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={buildAssetUrl(p.imageUrl)}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="font-sans text-[20px] font-bold text-ink-soft">{p.title}</p>
                    <p className="mt-2 font-sans text-base text-ink-soft line-clamp-2">{p.excerpt}</p>
                    <p className="mt-3 font-sans text-base font-bold text-brand">Read More</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="bg-paper py-16">
          <div className="container-emeta flex min-h-[512px] flex-col justify-center bg-brand px-8 md:px-16">
            <h2 className="max-w-[800px] font-sans text-[clamp(2.5rem,5vw,3.375rem)] font-extrabold leading-[1.15] text-paper">
              Ready to Transform Your Business?
            </h2>
            <p className="mt-4 font-inter text-lg text-white">Here For you</p>
            <button className="mt-8 inline-flex h-[46px] w-fit items-center justify-center bg-white px-6 font-inter text-[15px] font-semibold text-brand">
              Book a Demo
            </button>
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="bg-paper">
          <div className="container-emeta py-16">
            <h2 className="section-heading text-[clamp(2rem,5vw,3.375rem)]">Contact Us</h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-2">
              {/* Left info + map */}
              <div>
                <div className="space-y-6">
                  {[
                    { k: "Our Office", v: settings.officeAddress },
                    { k: "Phone", v: settings.phoneDisplay },
                    { k: "Email Support", v: settings.emailSupport },
                  ].map((c) => (
                    <div key={c.k}>
                      <p className="font-sans text-lg font-bold text-brand">{c.k}</p>
                      <p className="mt-1 font-sans text-base text-ink">{c.v}</p>
                    </div>
                  ))}
                </div>
                {brandUrl("contactMap") && (
                  <div className="relative mt-8 aspect-[492/240] overflow-hidden">
                    <Image src={brandUrl("contactMap")} alt="" fill className="object-cover" sizes="492px" />
                  </div>
                )}
              </div>

              {/* Right form */}
              <div className="bg-brand-soft p-9">
                <h3 className="font-sans text-[22px] font-bold text-navy-emeta">Send a Message</h3>
                <form className="mt-6 space-y-5">
                  {(["Name", "Email", "Message"] as const).map((label) => (
                    <div key={label}>
                      <label className="font-sans text-sm font-semibold text-graphite">{label}</label>
                      {label === "Message" ? (
                        <textarea
                          placeholder="Describe your requirements..."
                          rows={3}
                          className="mt-2 w-full border-none bg-white px-4 py-3 font-sans text-sm text-graphite outline-none placeholder:text-graphite"
                        />
                      ) : (
                        <input
                          type={label === "Email" ? "email" : "text"}
                          placeholder={label === "Name" ? "Your name" : "your@email.com"}
                          className="mt-2 h-[48px] w-full border-none bg-white px-4 font-sans text-sm text-graphite outline-none placeholder:text-graphite"
                        />
                      )}
                    </div>
                  ))}
                  <button className="inline-flex h-[48px] items-center justify-center bg-brand px-6 font-sans text-base font-semibold text-white">
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