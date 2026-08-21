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
  if (!post) return { title: "Artikel Tidak Ditemukan | PT Emeta Teknologi Indonesia" };
  const title = `${post.title} | PT Emeta Teknologi Indonesia`;
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
        <div className="bg-paper pb-8 pt-32">
          <div className="container-emeta">
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
        <article className="bg-paper pb-16">
          <div className="container-emeta max-w-[744px]">
            <h1 className="font-sans text-[clamp(2.5rem,5vw,3.375rem)] font-extrabold leading-[1.15] text-ink-soft">
              {post.title}
            </h1>
            <p className="mt-3 font-inter text-lg text-ink">
              {new Date(post.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
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
          <div className="container-emeta">
            <h2 className="font-sans text-[clamp(2.5rem,5vw,3.375rem)] font-extrabold leading-[1.1] text-ink-soft">
              Another
            </h2>
            <p className="mt-2 font-inter text-lg text-ink-soft">Find out our latest news and updates</p>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 items-stretch">
              {morePosts
                .filter((mp) => mp.slug !== post.slug)
                .slice(0, 3)
                .map((mp) => (
                  <Link
                    key={mp.id}
                    href={`/blog/${mp.slug}`}
                    className="group block overflow-hidden border border-line/30 bg-paper"
                  >
                    <div className="relative aspect-[264/206] overflow-hidden">
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
                    <div className="p-3">
                      <p className="font-sans text-[20px] font-bold leading-snug text-ink-soft">{mp.title}</p>
                      <p className="mt-1 font-sans text-base text-ink-soft line-clamp-2">{mp.excerpt}</p>
                      <p className="mt-2 font-sans text-base font-bold text-brand">Read More</p>
                    </div>
                  </Link>
                ))}
              {/* Find More / Here blue card (design 41:2196) */}
              <Link
                href="/blog"
                className="group flex flex-col items-center justify-center gap-2 overflow-hidden bg-brand p-6 text-center"
              >
                <div className="relative">
                  <span className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand-light" />
                  <span className="relative font-sans text-[20px] font-bold text-paper">Find More</span>
                </div>
                <span className="relative font-sans text-base font-bold text-brand-light">Here</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}