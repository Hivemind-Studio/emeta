import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const SITE_URL = process.env.SITE_URL || "https://emeta.zeabur.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, products, latest] = await Promise.all([
    prisma.blogPost
      .findMany({ where: { published: true }, select: { slug: true, updatedAt: true }, orderBy: { updatedAt: "desc" } })
      .catch(() => []),
    prisma.product
      .findMany({ select: { slug: true, updatedAt: true } })
      .catch(() => []),
    prisma.blogPost
      .findFirst({ where: { published: true }, orderBy: { updatedAt: "desc" }, select: { updatedAt: true } })
      .catch(() => null),
  ]);

  // Honest freshness signals: derive from real content updates, not "now"
  const contentFreshness = latest?.updatedAt ?? new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: contentFreshness, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: contentFreshness, changeFrequency: "daily", priority: 0.9 },
  ];

  for (const p of posts) {
    routes.push({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const p of products) {
    routes.push({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return routes;
}
