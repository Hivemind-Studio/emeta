import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CtaSection, ContactSection } from "@/components/CtaContact";
import { NewsCard } from "@/components/NewsCard";
import { getSettings, getFeaturedPosts, getPublishedPostsPage } from "@/lib/data";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://emeta.zeabur.app";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  return {
    title: { absolute: `News & Blogs${page > 1 ? ` — Page ${page}` : ""} | PT Emeta Teknologi Indonesia` },
    description:
      "Find out our latest news and updates from PT Emeta Teknologi Indonesia.",
    alternates: { canonical: page > 1 ? `/blog?page=${page}` : "/blog" },
  };
}

/** Content region = 1128px wide (156px margins on the 1440 design). */
const CTN = "mx-auto w-full max-w-[1128px] px-6 md:px-0";

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [settings, featured, { items: posts, totalPages }] = await Promise.all([
    getSettings(),
    // Featured hero only on page 1 — deeper pages go straight to the grid
    page === 1 ? getFeaturedPosts(2) : Promise.resolve([]),
    getPublishedPostsPage(page, 11),
  ]);

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "News & Blogs",
    url: `${SITE_URL}/blog`,
    publisher: { "@type": "Organization", name: settings.brandName },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.createdAt.toISOString(),
      dateModified: p.updatedAt.toISOString(),
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }} />
      <Header brandName={settings.brandName} variant="light" productsEnabled={settings.productsEnabled} />
      <main className="flex-1">
        {/* ===== FEATURED (Design 41:1808, 0..1024) ===== */}
        {page === 1 && (
        <section className="bg-paper pt-[110px] md:pt-[145px]">
          <div className={CTN}>
            {/* Blue rounded panel (Figma 41:1809, r16) with head + featured cards */}
            <div className="rounded-2xl bg-brand pb-[60px] pt-[60px] md:pb-[120px] md:pt-[120px]">
              <div className="px-[32px]">
                <h2 className="text-[34px] font-extrabold leading-[44px] text-paper md:text-[54px] md:leading-[64px]">
                  Featured
                </h2>
                <p className="mt-[12px] font-inter text-[18px] text-paper">News and Blogs</p>
              </div>
              <div className="mt-[64px] flex flex-wrap justify-center gap-[24px] px-[16px] md:justify-between md:px-[32px]">
                {featured.map((p) => (
                  <div key={p.id} className="w-full max-w-[520px] md:w-[520px]">
                    <NewsCard post={p} big />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ===== NEWS & BLOGS grid (41:2230, 1024..2641) ===== */}
        <section id="news" className="bg-paper">
          <div className={`${CTN} ${page === 1 ? "pt-[80px]" : "pt-[110px]"} md:${page === 1 ? "pt-[300px]" : "pt-[145px]"}`}>
            <h1 className="max-w-[400px] text-[34px] font-extrabold leading-[44px] text-ink-soft md:text-[54px] md:leading-[64px]">
              News &amp;<br />Blogs
            </h1>
            <p className="mt-[12px] font-inter text-[18px] leading-[28px] text-ink-soft">
              Find out our latest news and updates
            </p>
            <div className="mt-[64px] grid grid-cols-1 gap-x-[24px] gap-y-[64px] sm:grid-cols-2 lg:grid-cols-4">
              {posts.slice(0, 8).map((p) => (
                <div key={p.id} className="reveal">
                  <NewsCard post={p} />
                </div>
              ))}
            </div>

            {/* Pagination — crawlable links with self-canonicals per page */}
            {totalPages > 1 && (
              <nav aria-label="Blog pages" className="mt-[64px] flex items-center justify-center gap-3 pb-[40px]">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
                  n === page ? (
                    <span key={n} aria-current="page"
                      className="inline-flex h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-brand px-3 text-[15px] font-semibold text-white">
                      {n}
                    </span>
                  ) : (
                    <Link key={n} href={n === 1 ? "/blog" : `/blog?page=${n}`}
                      className="inline-flex h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-line-soft bg-white px-3 text-[15px] font-semibold text-ink hover:border-brand hover:text-brand">
                      {n}
                    </Link>
                  ),
                )}
              </nav>
            )}
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
