import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CtaSection, ContactSection } from "@/components/CtaContact";
import { getSettings, getFeaturedPosts, getPublishedPostsPage } from "@/lib/data";
import { buildAssetUrl } from "@/lib/storage/url";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "News & Blogs | PT Emeta Teknologi Indonesia" },
  description:
    "Find out our latest news and updates from PT Emeta Teknologi Indonesia.",
  alternates: { canonical: "/blog" },
};

/** Content region = 1128px wide (156px margins on the 1440 design). */
const CTN = "mx-auto w-full max-w-[1128px] px-6 md:px-0";

function NewsCard({
  post,
  big = false,
}: {
  post: { slug: string; title: string; excerpt: string; imageUrl: string | null; createdAt: Date };
  big?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.04)]"
    >
      <div className={`relative ${big ? "h-[206px]" : "h-[206px]"} overflow-hidden`}>
        {post.imageUrl ? (
          <Image
            src={buildAssetUrl(post.imageUrl)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={big ? "520px" : "(max-width:768px) 50vw, 264px"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#b3b3b3]">
            <span className="font-inter text-[18px] font-bold text-[#d4d4d4]">Place Holder</span>
          </div>
        )}
      </div>
      {/* ctn per Figma: pad-left/right 12, Title y651(-639=12), desc +32, ReadMore +64 */}
      <div className="px-[12px] py-[12px]">
        <p className={`text-[20px] font-bold leading-none text-ink-soft ${big ? "" : ""}`}>
          {post.title}
        </p>
        <p className="mt-[4px] line-clamp-1 text-[16px] leading-[28px] text-ink-soft">{post.excerpt}</p>
        <p className="mt-[0px] text-[16px] font-bold leading-[28px] text-brand">Read More</p>
      </div>
    </Link>
  );
}

export default async function BlogIndexPage() {
  const [settings, featured, { items: posts }] = await Promise.all([
    getSettings(),
    getFeaturedPosts(2),
    getPublishedPostsPage(1, 11),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header brandName={settings.brandName} variant="light" productsEnabled={settings.productsEnabled} />
      <main className="flex-1">
        {/* ===== FEATURED (Design 41:1808, 0..1024) ===== */}
        <section className="bg-paper pt-[145px]">
          <div className={CTN}>
            {/* Blue rounded panel (Figma 41:1809, r16) with head + featured cards */}
            <div className="rounded-2xl bg-brand pb-[120px] pt-[120px]">
              <div className="px-[32px]">
                <h1 className="text-[54px] font-extrabold leading-[64px] text-paper">
                  Featured
                </h1>
                <p className="mt-[12px] font-inter text-[18px] text-paper">News and Blogs</p>
              </div>
              <div className="mt-[64px] flex flex-wrap justify-between gap-[24px] px-[32px]">
                {featured.map((p) => (
                  <div key={p.id} className="w-[520px] max-w-full">
                    <NewsCard post={p} big />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== NEWS & BLOGS grid (41:2230, 1024..2641) ===== */}
        <section id="news" className="bg-paper">
          <div className={`${CTN} pt-[300px]`}>
            <h2 className="max-w-[400px] text-[54px] font-extrabold leading-[64px] text-ink-soft">
              News &amp;<br />Blogs
            </h2>
            <p className="mt-[12px] font-inter text-[18px] leading-[28px] text-ink-soft">
              Find out our latest news and updates
            </p>
            <div className="mt-[64px] grid grid-cols-2 gap-x-[24px] gap-y-[64px] sm:grid-cols-3 lg:grid-cols-4">
              {posts.slice(0, 8).map((p) => (
                <div key={p.id}>
                  <NewsCard post={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA + CONTACT — shared components (same as homepage) ===== */}
        <CtaSection settings={settings} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
