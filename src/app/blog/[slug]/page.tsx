import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings, getPostBySlug, getPublishedPosts } from "@/lib/data";
import { buildAssetUrl } from "@/lib/storage/url";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://emeta.zeabur.app";

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-[3px] text-xs font-bold text-paper">
      {children}
    </span>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: { absolute: "Artikel Tidak Ditemukan | PT Emeta Teknologi Indonesia" } };
  const title = { absolute: `${post.title} | PT Emeta Teknologi Indonesia` };
  const description = post.excerpt;
  const ogImage = post.imageUrl ? buildAssetUrl(post.imageUrl) : `${SITE_URL}/images/og-cover.jpg`;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      title,
      description,
      images: [{ url: ogImage, alt: post.title }],
      publishedTime: post.createdAt.toISOString(),
    },
  };
}

const DEFAULT_TAGS = ["Generative BI Engine", "AI", "For Business"];

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, post, morePosts] = await Promise.all([
    getSettings(),
    getPostBySlug(slug),
    getPublishedPosts(4),
  ]);
  if (!post) notFound();

  const paragraphs = post.content.split(/\n+/).filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col">
      <Header brandName={settings.brandName} variant="light" productsEnabled={settings.productsEnabled} />
      <main className="flex-1">
        {/* Hero image */}
        <div className="bg-paper pt-[109px]">
          <div className="mx-auto w-full max-w-[1128px] px-6 md:px-0">
            <div className="relative aspect-[1128/546] overflow-hidden">
              {post.imageUrl ? (
                <Image
                  src={buildAssetUrl(post.imageUrl)}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="1128px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#b3b3b3]">
                  <span className="font-inter text-lg font-bold text-line">Place Holder</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Article content */}
        <article className="bg-paper pt-[21px] pb-16">
          <div className="mx-auto min-h-[1133px] w-full max-w-[744px] px-6 md:px-0">
            <h1 className="font-sans text-[54px] font-extrabold leading-[64px] text-ink-soft">
              {post.title}
            </h1>
            <p className="mt-[12px] font-inter text-[18px] leading-[28px] text-ink">
              {new Date(post.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="mt-[12px] flex flex-wrap gap-2">
              {DEFAULT_TAGS.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <div className="mt-8 space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i} className="font-inter text-lg leading-relaxed text-ink-soft">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* ===== Another (related) ===== */}
        <section className="bg-paper pb-16">
          <div className="mx-auto w-full max-w-[1128px] px-6 md:px-0 pt-[265px]">
            <h2 className="font-sans text-[54px] font-extrabold leading-[64px] text-ink-soft">
              Another
            </h2>
            <p className="mt-[12px] font-inter text-[18px] leading-[28px] text-ink-soft">Find out our latest news and updates</p>
            <div className="mt-[34px] grid grid-cols-2 gap-x-[24px] gap-y-[64px] sm:grid-cols-3 lg:grid-cols-4 items-stretch">
              {morePosts
                .filter((mp) => mp.slug !== post.slug)
                .slice(0, 3)
                .map((mp) => (
                  <Link
                    key={mp.id}
                    href={`/blog/${mp.slug}`}
                    className="group block h-[326px] w-full max-w-[270px] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.04)]"
                  >
                    <div className="relative h-[206px] overflow-hidden">
                      {mp.imageUrl ? (
                        <Image
                          src={buildAssetUrl(mp.imageUrl)}
                          alt={mp.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="264px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#b3b3b3]">
                          <span className="font-inter text-lg font-bold text-line">Place Holder</span>
                        </div>
                      )}
                    </div>
                    <div className="p-[12px]">
                      <p className="font-sans text-[20px] font-bold leading-[28px] text-ink-soft">{mp.title}</p>
                      <p className="mt-[4px] font-sans text-[16px] leading-[28px] text-ink-soft line-clamp-1">{mp.excerpt}</p>
                      <p className="mt-[0px] font-sans text-[16px] font-bold leading-[28px] text-brand">Read More</p>
                    </div>
                  </Link>
                ))}
              {/* Find More / Here blue card (design 41:2196) */}
              <Link
                href="/blog"
                className="group relative flex h-[326px] w-[247px] flex-col items-center justify-center self-start overflow-hidden rounded-2xl bg-brand"
              >
                {/* blurry blue circle bg — top-right behind text (per Figma 41:2197, 210px at rel x132 y52) */}
                <span
                  className="absolute h-[210px] w-[210px] rounded-full bg-brand-light opacity-30 blur-[100px]"
                  style={{ left: 132, top: 52 }}
                  aria-hidden="true"
                />
                <span className="relative text-[20px] font-bold leading-[28px] text-paper">Find More</span>
                <span className="relative font-sans text-[16px] font-bold leading-[28px] text-brand-light">Here</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}