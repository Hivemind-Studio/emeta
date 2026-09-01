import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CtaSection, ContactSection } from "@/components/CtaContact";
import { ProductTags } from "@/components/ProductTags";
import { ArticleBody } from "@/components/ArticleBody";
import { getSettings, getProductBySlug } from "@/lib/data";
import { buildAssetUrl } from "@/lib/storage/url";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://emeta.zeabur.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: { absolute: "Produk Tidak Ditemukan | PT Emeta Teknologi Indonesia" } };
  // Cut description at a word boundary, not mid-word
  const shortDesc = product.description.length > 155
    ? product.description.slice(0, 150).replace(/\s+\S*$/, "") + "…"
    : product.description;
  // Share the product's own picture, not the generic site cover — falls back to
  // the card icon, then the cover, so there is always an image
  const socialKey = product.imageUrl || product.iconUrl;
  const socialImage = socialKey
    ? new URL(buildAssetUrl(socialKey), SITE_URL).href
    : `${SITE_URL}/images/og-cover.jpg`;

  return {
    // Root layout template appends "| Emeta"
    title: product.title,
    description: shortDesc,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/products/${product.slug}`,
      title: product.title,
      description: shortDesc,
      images: [{ url: socialImage, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: shortDesc,
      images: [socialImage],
    },
  };
}

/**
 * Product Detail — Figma 41:2475 ("Project Read").
 * Top section: image left (564x546 @ x156,y159), content right (title,
 * date line, tags, body @ x748). Then shared CTA + Contact + Footer.
 */
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, product] = await Promise.all([getSettings(), getProductBySlug(slug)]);
  if (!product || !settings.productsEnabled) notFound();

  // Body is the rich `content` field; products written before it existed fall
  // back to their plain description, so they render exactly as they used to
  const body = product.content.trim() || product.description;
  // Detail image is its own upload; older products that only have a card icon fall back to it
  const heroImage = product.imageUrl || product.iconUrl;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.title,
    description: product.description.slice(0, 300),
    url: `${SITE_URL}/products/${product.slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    image: heroImage ? new URL(buildAssetUrl(heroImage), SITE_URL).href : undefined,
    datePublished: product.createdAt.toISOString(),
    dateModified: product.updatedAt.toISOString(),
    brand: { "@type": "Brand", name: settings.brandName },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/#products` },
      { "@type": "ListItem", position: 3, name: product.title, item: `${SITE_URL}/products/${product.slug}` },
    ],
  };

  // Figma geometry (1440 frame): ctn y=159, image x156 w564 h546; text col x748.
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }} />
      <Header brandName={settings.brandName} variant="light" productsEnabled={settings.productsEnabled} />
      <main className="flex-1 bg-paper">
        {/* ===== TOP SECTION (Figma 41:2480 News, 0..867) ===== */}
        <section className="bg-paper">
          <div className="mx-auto flex w-full max-w-[1128px] flex-col items-start pb-[87px] pt-[64px] md:flex-row md:items-stretch md:pb-[87px] md:pt-[159px] md:px-0">
            {/* Pic — left, 564x546, square corners per design */}
            <div className="relative aspect-[564/546] w-full shrink-0 overflow-hidden bg-brand md:aspect-auto md:h-[546px] md:w-[564px]">
              {heroImage ? (
                <Image
                  src={buildAssetUrl(heroImage)}
                  alt={product.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="564px"
                />
              ) : (
                <div className="absolute inset-0">
                  <Image src="/images/og-cover.jpg" alt="" fill className="object-cover" sizes="564px" />
                </div>
              )}
            </div>

            {/* Content — right column at x748 (= 156+564+28 gap), title baseline y175 */}
            <div className="mt-[40px] w-full shrink-0 grow-0 text-[18px] leading-[28px] md:ml-[28px] md:mt-0 md:w-[520px] md:text-base">
              <h1 className="max-w-[533px] font-sans text-[38px] font-extrabold leading-[46px] text-ink-soft md:text-[54px] md:leading-[64px]">
                {product.title}
              </h1>
              <p className="mt-[12px] max-w-[360px] font-inter text-[18px] leading-[28px] text-ink-soft">
                <time dateTime={product.createdAt.toISOString()}>
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </p>
              <ProductTags tags={product.tags} className="mt-[12px]" />
              <ArticleBody content={body} className="mt-[42px] space-y-5" />
            </div>
          </div>
        </section>

        {/* ===== CTA + CONTACT — shared with home ===== */}
        <CtaSection settings={settings} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
