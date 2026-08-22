import { getPublishedPosts } from "@/lib/data";
import { buildAssetUrl } from "@/lib/storage/url";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://emeta.zeabur.app";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** RSS 2.0 feed for the Emeta blog. */
export async function GET() {
  const posts = await getPublishedPosts(50).catch(() => []);
  const lastBuild =
    posts.length > 0
      ? posts.reduce((m, p) => (p.updatedAt > m ? p.updatedAt : m), posts[0].updatedAt)
      : new Date();

  const items = posts
    .map((p) => {
      const img = p.imageUrl ? new URL(buildAssetUrl(p.imageUrl), SITE_URL).href : `${SITE_URL}/images/og-cover.jpg`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${esc(p.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${esc(p.slug)}</guid>
      <description>${esc(p.excerpt)}</description>
      <pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>
      <enclosure url="${esc(img)}" type="image/jpeg" length="0"/>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>News &amp; Blogs | PT Emeta Teknologi Indonesia</title>
    <link>${SITE_URL}/blog</link>
    <description>Latest news and updates from PT Emeta Teknologi Indonesia.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
