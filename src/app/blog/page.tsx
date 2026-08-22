import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings, getFeaturedPosts, getPublishedPostsPage } from "@/lib/data";
import { brandUrl } from "@/lib/brandAssets";
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
            <div className="rounded-2xl bg-brand pb-[65px] pt-[120px]">
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
          <div className={`${CTN} pt-[140px]`}>
            <h2 className="max-w-[400px] text-[54px] font-extrabold leading-[64px] text-ink-soft">
              News &amp; Blogs
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

        {/* ===== CTA (41:2441, 2641..3153) ===== */}
        <section className="bg-paper pt-[90px]">
          <div className={CTN}>
            <div className="relative h-[332px] overflow-hidden rounded-2xl bg-brand">
              {/* Decorative layer — clipped to the CTA box */}
              <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                {/* Blob artwork (41:2443, 1294x920) — relative to CTA box */}
                <div className="absolute" style={{ left: -83, top: -294, width: 1294, height: 920 }}>
                  <Image src={brandUrl("ctaBg")} alt="" fill className="object-cover" sizes="1128px" />
                </div>
                {/* Blurred white icon (41:2449) — right side */}
                <div className="absolute right-[16px] top-[-18px] opacity-30" style={{ width: 411, height: 411 }}>
                  <Image src={brandUrl("iconWhite")} alt="" fill className="object-contain blur-[16px]" sizes="411px" />
                </div>
              </div>
              {/* Content at x188 (=32px inside the panel) */}
              <div className="relative z-10 pl-[32px] pt-[122px]">
                <h2 className="max-w-[800px] text-[54px] font-extrabold leading-[68px] text-paper">
                  Ready to Transform Your <span className="whitespace-nowrap">Business?</span>
                </h2>
                <p className="mt-[10px] font-inter text-[18px] text-paper">Here For you</p>
                <button className="mt-[18px] inline-flex h-[46px] w-[144px] items-center justify-center rounded-[8px] bg-white font-inter text-[15px] font-semibold text-brand">
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CONTACT (86:259, 3153..4177) ===== */}
        <section id="contact" className="min-h-[1024px] bg-paper">
          <div className={`${CTN} pt-[193px]`}>
            <h2 className="text-[54px] font-extrabold leading-[1.18] text-ink-soft">Contact Us</h2>
            <div className="mt-[128px] flex justify-between pb-[60px]">
              {/* Left info + map */}
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
                <div className="relative mt-[40px] h-[240px] w-[492px] overflow-hidden rounded-lg">
                  <Image src={brandUrl("contactMap")} alt="" fill className="object-cover" sizes="492px" />
                </div>
              </div>

              {/* Right form panel (#f3f8ff r20) */}
              <div className="w-[572px] rounded-[20px] bg-brand-soft p-[40px]">
                <h3 className="text-[22px] font-bold text-navy-emeta">Send a Message</h3>
                <form className="mt-[28px] space-y-[16px]" action="/api/inquiry" method="POST">
                  {(["Name", "Email", "Message"] as const).map((label) => (
                    <div key={label}>
                      <label className="text-[14px] font-semibold text-graphite">{label}</label>
                      {label === "Message" ? (
                        <textarea name="message" required placeholder="Describe your requirements..." rows={3}
                          className="mt-[8px] h-[100px] w-full rounded-[8px] border-none bg-white px-4 py-3 text-[14px] text-graphite outline-none placeholder:text-graphite" />
                      ) : (
                        <input type={label === "Email" ? "email" : "text"} name={label.toLowerCase()} required
                          placeholder={label === "Name" ? "Your name" : "your@email.com"}
                          className="mt-[8px] h-[48px] w-full rounded-[8px] border-none bg-white px-4 text-[14px] text-graphite outline-none placeholder:text-graphite" />
                      )}
                    </div>
                  ))}
                  <button type="submit" className="inline-flex h-[48px] w-[168px] items-center justify-center rounded-[8px] bg-brand text-[16px] font-semibold text-white">
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
