import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings, getFeaturedPosts, getPublishedPostsPage } from "@/lib/data";
import { buildAssetUrl } from "@/lib/storage/url";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

export const metadata = {
  title: "News & Blogs | PT Emeta Teknologi Indonesia",
  description:
    "Find out our latest news and updates from PT Emeta Teknologi Indonesia.",
  alternates: { canonical: "/blog" },
};

function NewsCard({ post, big = false }: { post: { slug: string; title: string; excerpt: string; imageUrl: string | null; createdAt: Date }; big?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden border border-line/30 bg-paper"
    >
      <div className={`relative ${big ? "aspect-[520/206]" : "aspect-[264/206]"} overflow-hidden`}>
        {post.imageUrl ? (
          <Image
            src={buildAssetUrl(post.imageUrl)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={big ? "520px" : "264px"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#b3b3b3]">
            <span className="font-inter text-lg font-bold text-line">Place Holder</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-sans text-[20px] font-bold leading-snug text-ink-soft">{post.title}</p>
        <p className="mt-1 font-sans text-base text-ink-soft line-clamp-2">{post.excerpt}</p>
        <p className="mt-2 font-sans text-base font-bold text-brand">Read More</p>
      </div>
    </Link>
  );
}

export default async function BlogIndexPage() {
  const [settings, featured, { items: posts }] = await Promise.all([
    getSettings(),
    getFeaturedPosts(2),
    getPublishedPostsPage(1, PAGE_SIZE),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header brandName="PT Emeta Teknologi Indonesia" variant="light" />
      <main className="flex-1">
        {/* ===== FEATURED hero ===== */}
        <section className="bg-brand pb-8 pt-32 text-paper">
          <div className="container-emeta">
            <h1 className="font-sans text-[clamp(2.75rem,5vw,3.375rem)] font-extrabold leading-[1.1] text-paper">
              Featured
            </h1>
            <p className="mt-2 font-inter text-lg text-paper">News and Blogs</p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {featured.map((p) => (
                <NewsCard key={p.id} post={p} big />
              ))}
            </div>
          </div>
        </section>

        {/* ===== News & Blogs grid ===== */}
        <section className="bg-paper py-16">
          <div className="container-emeta">
            <h2 className="font-sans text-[clamp(2.5rem,5vw,3.375rem)] font-extrabold leading-[1.1] text-ink-soft">
              News &amp; Blogs
            </h2>
            <p className="mt-2 font-inter text-lg text-ink-soft">
              Find out our latest news and updates
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {posts.map((p) => (
                <NewsCard key={p.id} post={p} />
              ))}
            </div>

            {posts.length === 0 && (
              <p className="mt-14 text-center font-sans text-base text-ink">
                Belum ada artikel.
              </p>
            )}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="bg-paper pb-16">
          <div className="container-emeta flex min-h-[300px] flex-col justify-center bg-brand px-8 md:px-16">
            <h2 className="max-w-[800px] font-sans text-[clamp(2.5rem,5vw,3.375rem)] font-extrabold leading-[1.15] text-paper">
              Ready to Transform Your Business?
            </h2>
            <p className="mt-4 font-inter text-lg text-paper">Here For you</p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex h-[46px] w-fit items-center justify-center bg-white px-6 font-inter text-[15px] font-semibold text-brand"
            >
              Book a Demo
            </Link>
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="bg-paper pb-16">
          <div className="container-emeta">
            <h2 className="font-sans text-[clamp(2rem,5vw,3.375rem)] font-extrabold leading-[1.1] text-ink-soft">
              Contact Us
            </h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-2">
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