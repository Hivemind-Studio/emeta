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
 * News & Blogs section. Shows a real content sneak-peek: full title,
 * multi-line excerpt, date, and Read More. Branded fallback image
 * when a post has none.
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
      className="group flex h-[400px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.04)]"
    >
      {/* Image */}
      <div className="relative h-[190px] shrink-0 overflow-hidden">
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
            <Image src="/images/og-cover.jpg" alt="" fill className="object-cover" sizes={big ? "520px" : "264px"} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col px-[16px] pt-[14px] pb-[14px]">
        <p className="text-[13px] font-medium text-graphite">
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
        </p>
        <h3 className="mt-[6px] line-clamp-3 text-[19px] font-bold leading-[26px] text-ink-soft">
          {post.title}
        </h3>
        <p className="mt-[8px] line-clamp-2 text-[14px] leading-[21px] text-graphite">
          {post.excerpt}
        </p>
        <p className="mt-auto inline-flex items-center gap-1 text-[15px] font-bold leading-none text-brand transition-colors group-hover:text-[#1450b5]">
          Read More
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </p>
      </div>
    </Link>
  );
}
