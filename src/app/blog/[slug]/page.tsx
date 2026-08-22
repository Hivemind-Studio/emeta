import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductTags } from "@/components/ProductTags";
import {
  getSettings,
  getPostBySlug,
  getPostIdBySlugAlias,
  getPublishedPosts,
} from "@/lib/data";
import { buildAssetUrl } from "@/lib/storage/url";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://emeta.zeabur.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: { absolute: "Artikel Tidak Ditemukan | PT Emeta Teknologi Indonesia" } };
  const title = post.title;
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

/** Minimal inline markdown: ## / ### headings, - lists, **bold**, *italic*. */
function renderInline(text: string, keyPrefix: string) {
  // split on **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function ArticleBody({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="mt-8 space-y-5">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        // Heading block
        if (lines.length === 1 && lines[0].startsWith("### ")) {
          return (
            <h3 key={bi} className="pt-2 font-sans text-[24px] font-bold leading-[32px] text-ink-soft">
              {renderInline(lines[0].slice(4), `h3-${bi}`)}
            </h3>
          );
        }
        if (lines.length === 1 && lines[0].startsWith("## ")) {
          return (
            <h2 key={bi} className="pt-2 font-sans text-[30px] font-extrabold leading-[40px] text-ink-soft">
              {renderInline(lines[0].slice(3), `h2-${bi}`)}
            </h2>
          );
        }
        // List block
        if (lines.every((l) => l.startsWith("- ") || l.startsWith("* "))) {
          return (
            <ul key={bi} className="list-disc space-y-2 pl-6 font-inter text-lg leading-relaxed text-ink-soft">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^[-*] /, ""), `li-${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        // Paragraph (single newlines inside a block become line breaks)
        return (
          <p key={bi} className="font-inter text-lg leading-relaxed text-ink-soft">
            {lines.map((l, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {renderInline(l, `p-${bi}-${li}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    // Old URL? 301 to the current slug instead of dying.
    const current = await getPostIdBySlugAlias(slug);
    if (current && current !== slug) permanentRedirect(`/blog/${current}`);
    notFound();
  }
  const [settings, morePosts] = await Promise.all([getSettings(), getPublishedPosts(4)]);

  const paragraphs = post.content.split(/\n+/).filter(Boolean);
  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / 200));

  const absImg = post.imageUrl
    ? new URL(buildAssetUrl(post.imageUrl), SITE_URL).href
    : `${SITE_URL}/images/og-cover.jpg`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [absImg],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: "en",
    author: { "@type": "Organization", name: settings.brandName, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: settings.brandName,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/og-cover.jpg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }} />
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
                <div className="absolute inset-0 flex items-center justify-center bg-brand">
                  <Image src="/images/og-cover.jpg" alt="" width={600} height={315} className="object-contain opacity-90" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Article content */}
        <article className="bg-paper pt-[21px] pb-16">
          <div className="mx-auto min-h-[1133px] w-full max-w-[744px] px-6 md:px-0">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-[18px] text-[14px] text-graphite">
              <Link href="/" className="hover:text-brand">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/blog" className="hover:text-brand">Blog</Link>
              <span className="mx-2">›</span>
              <span className="text-ink">{post.title}</span>
            </nav>
            <h1 className="font-sans text-[54px] font-extrabold leading-[64px] text-ink-soft">
              {post.title}
            </h1>
            <p className="mt-[12px] font-inter text-[18px] leading-[28px] text-ink">
              <time dateTime={new Date(post.createdAt).toISOString()}>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span className="mx-2 text-line">·</span>
              {readingMinutes} min read
            </p>
            <ProductTags tags={post.tags} className="mt-[12px]" />
            <ArticleBody content={post.content} />
          </div>
        </article>

        {/* ===== Related articles ===== */}
        <section className="bg-paper pb-16">
          <div className="mx-auto w-full max-w-[1128px] px-6 md:px-0 pt-[120px]">
            <h2 className="font-sans text-[54px] font-extrabold leading-[64px] text-ink-soft">
              Related Articles
            </h2>
            <p className="mt-[12px] font-inter text-[18px] leading-[28px] text-ink-soft">Find out our latest news and updates</p>
            <div className="mt-[34px] grid grid-cols-2 gap-x-[24px] gap-y-[64px] sm:grid-cols-3 lg:grid-cols-4 items-stretch">
              {morePosts
                .filter((mp) => mp.slug !== post!.slug)
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
                        <div className="absolute inset-0 flex items-center justify-center bg-brand">
                          <Image src="/images/og-cover.jpg" alt="" width={300} height={158} className="object-contain opacity-90" />
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
                className="group relative flex h-[326px] w-[247px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-brand"
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
