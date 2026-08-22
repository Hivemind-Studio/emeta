import Image from "next/image";
import Link from "next/link";
import { buildAssetUrl } from "@/lib/storage/url";

export interface NewsCardPost {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  createdAt: Date;
}

/**
 * News/blog card — shared by the blog listing page and the home
 * News & Blogs section. Branded fallback image when a post has none.
 */
export function NewsCard({
  post,
  big = false,
}: {
  post: NewsCardPost;
  big?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-[326px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.04)]"
    >
      <div className="relative h-[206px] shrink-0 overflow-hidden">
        {post.imageUrl ? (
          <Image
            src={buildAssetUrl(post.imageUrl)}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={big ? "520px" : "(max-width:768px) 50vw, 264px"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-brand">
            <Image src="/images/og-cover.jpg" alt="" width={300} height={158} className="object-contain opacity-90" />
          </div>
        )}
      </div>
      {/* ctn per Figma: pad-left/right 12, Title y651(-639=12), desc +32, ReadMore +64 */}
      <div className="flex min-h-0 flex-1 flex-col px-[12px] py-[12px]">
        <h3 className={`line-clamp-2 text-[20px] font-bold leading-[26px] text-ink-soft ${big ? "" : ""}`}>
          {post.title}
        </h3>
        <p className="mt-[4px] line-clamp-1 text-[16px] leading-[28px] text-ink-soft">{post.excerpt}</p>
        <p className="mt-auto text-[16px] font-bold leading-[28px] text-brand">Read More</p>
      </div>
    </Link>
  );
}
