import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterForm } from "@/components/NewsletterForm";
import { DemoMessageFiller } from "@/components/DemoMessageFiller";
import { ProductTags } from "@/components/ProductTags";
import { NewsCard } from "@/components/NewsCard";
import { CtaSection, ContactSection } from "@/components/CtaContact";
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

export default async function HomePage() {
  const settings = await getSettings();
  // When the Products toggle is disabled, don't fetch or render the section at all.
  const [products, posts] = await Promise.all([
    settings.productsEnabled ? getProducts() : Promise.resolve([]),
    getFeaturedPosts(3),
  ]);
  const showProducts = settings.productsEnabled && products.length > 0;

  const stats: { value: string; label: string }[] = (() => {
    try {
      const arr = JSON.parse(settings.aboutStatsJson);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="flex min-h-screen flex-col">
      <Header brandName={settings.brandName} variant="dark" productsEnabled={settings.productsEnabled} />
      <main className="flex-1">
        {/* ===== HERO (Design 20:1383, 0..1024) ===== */}
        <section className="relative h-[720px] overflow-hidden bg-[#fafafa] md:h-[1024px]">
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
              <Image src={brandUrl("iconWhite")} alt="" fill className="object-contain opacity-35 blur-[28px]" sizes="1416px" />
            </div>
          </div>
          <div className={`${CTN} relative z-10`}>
              <h1 className="max-w-[533px] pt-[220px] text-[38px] font-extrabold leading-[46px] text-paper md:pt-[384px] md:text-[54px] md:leading-[64px]">
                {settings.heroTitle}
              </h1>
              <p className="mt-[27px] max-w-[533px] font-inter text-[18px] leading-[28px] text-white/88">
                {settings.heroBody}
              </p>
              <NewsletterForm />
          </div>
        </section>

        {/* ===== ABOUT (Design 20:1403, 1024..1536) ===== */}
        <section id="about" className="bg-paper md:h-[512px]">
          <div className={`${CTN}`}>
            <div className="flex flex-col items-start justify-between gap-10 pt-[84px] md:flex-row md:items-start md:justify-between md:gap-10">
              <h2 className="w-full max-w-[533px] text-[38px] font-extrabold leading-[46px] text-ink-soft md:w-[533px] md:text-[54px] md:leading-[1.18]">
                {settings.aboutTitle}
              </h2>
              <div className="w-full md:w-[360px]">
                <p className="font-inter text-[18px] leading-[1.55] text-ink-soft">
                  {settings.aboutBody}
                </p>
              </div>
            </div>
            {/* Stats in #f3f8ff box */}
            <div className="mt-[64px] rounded-[16px] bg-brand-soft">
              <div className="flex flex-col items-center justify-around gap-[28px] px-[32px] py-[32px] text-center sm:flex-row sm:gap-0 sm:text-left">
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

        {/* ===== PRODUCTS (Offerings, 1536..2560) — hidden entirely when toggle off ===== */}
        {showProducts && (
        <section id="products" className="bg-paper py-[100px] md:h-[1024px] md:py-0">
          <div className={`${CTN}`}>
            <div className="flex flex-col items-center pt-[267px] text-center">
              <span className="inline-flex h-[30px] items-center rounded-full bg-[#e7edf7] px-[16px] text-[14px] font-semibold uppercase text-brand">
                {settings.offeringsEyebrow}
              </span>
              <h2 className="mt-[24px] text-[34px] font-extrabold leading-[1.18] text-ink-soft md:text-[54px]">
                {settings.offeringsTitle}
              </h2>
              <p className="mt-[2px] font-inter text-[18px] text-ink-soft">
                {settings.offeringsSubtitle}
              </p>
            </div>
            <div className="mt-[32px] flex flex-col gap-[24px] justify-between md:flex-row">
              {products.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group block h-[319px] w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.08)] md:w-[360px]">
                  <div className="mx-[16px] mt-[16px] flex h-[64px] shrink-0 items-center gap-3 rounded-[6px] bg-brand px-2">
                    <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[6px] bg-paper">
                      {p.iconUrl && <Image src={buildAssetUrl(p.iconUrl)} alt="" width={28} height={28} className="object-contain" />}
                    </div>
                    <h3 className="text-[20px] font-bold leading-none text-paper">{p.title}</h3>
                  </div>
                  <ProductTags tags={p.tags} className="shrink-0 px-4 pt-[20px]" />
                  <p className="flex-1 overflow-hidden px-4 pt-[12px] text-[16px] leading-[28px] text-ink-soft">
                    {p.description}
                  </p>
                  <p className="shrink-0 px-4 pb-[16px] pt-[16px] text-[16px] font-bold leading-none text-brand">Learn More</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ===== NEWS & BLOGS (41:1550, 2560..3584) ===== */}
        <section id="news" className="bg-paper py-[100px] md:h-[1024px] md:py-0">
          <div className={`${CTN}`}>
            <h2 className="max-w-[533px] text-[34px] font-extrabold leading-[1.18] text-ink-soft md:pt-[233px] md:text-[54px]">
              {settings.newsEyebrow}
            </h2>
            <p className="mt-[4px] font-inter text-[18px] text-ink-soft">
              {settings.newsSubtitle}
            </p>
            <div className="mt-[68px] flex flex-col gap-[24px] justify-between md:flex-row">
              {posts.map((p) => (
                <div key={p.id} className="w-[269px]">
                  <NewsCard post={p} />
                </div>
              ))}
              {/* More card */}
              <Link href="/blog" className="relative flex h-[400px] w-[247px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-black/5 bg-brand shadow-[0_4px_4px_rgba(0,0,0,0.04)]">
                {/* blurry blue circle bg — top-right behind text (Figma 41:1560, LAYER_BLUR 100) */}
                <span
                  className="absolute h-[209px] w-[209px] rounded-full bg-brand-light opacity-30 blur-[100px]"
                  style={{ left: 1168 - 1037, top: 3077 - 3025 }}
                  aria-hidden="true"
                />
                <span className="relative text-[20px] font-bold leading-none text-paper">Find More</span>
                <span className="relative mt-[4px] text-[16px] font-bold leading-none text-brand-light">Here</span>
              </Link>
            </div>
          </div>
        </section>
        {/* ===== CTA (20:1431) + Contact (20:1447) — shared components ===== */}
                <CtaSection settings={settings} />
                <ContactSection settings={settings} />
      </main>
      <DemoMessageFiller />
      <Footer settings={settings} />
    </div>
  );
}