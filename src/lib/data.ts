import { prisma } from "./db";
import type { GlobalSettings, Product, BlogPost } from "@/generated/prisma/client";

export type SiteSettings = GlobalSettings;
export type ProductItem = Product;
export type BlogItem = BlogPost;

/** Fetch the singleton global settings. */
export async function getSettings(): Promise<SiteSettings> {
  return prisma.globalSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

/** Fetch products, sorted. */
export async function getProducts(): Promise<ProductItem[]> {
  return prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  return prisma.product.findUnique({ where: { slug } });
}

/** Fetch published blog posts, newest first, with pagination. */
export async function getPublishedPosts(limit?: number): Promise<BlogItem[]> {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getPublishedPostsPage(
  page: number,
  pageSize = 5,
): Promise<{ items: BlogItem[]; total: number; totalPages: number; page: number }> {
  const where = { published: true };
  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blogPost.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { items, total, totalPages, page };
}

export async function getFeaturedPosts(limit?: number): Promise<BlogItem[]> {
  const featured = await prisma.blogPost.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  // If fewer featured posts exist than requested, backfill with the latest published ones
  if (limit && featured.length < limit) {
    const ids = new Set(featured.map((p) => p.id));
    const filler = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: limit * 2,
    });
    for (const p of filler) {
      if (featured.length >= limit) break;
      if (!ids.has(p.id)) {
        featured.push(p);
        ids.add(p.id);
      }
    }
  }
  return featured;
}

export async function getPostBySlug(slug: string): Promise<BlogItem | null> {
  return prisma.blogPost.findFirst({ where: { slug, published: true } });
}

/** Resolve an old blog URL to its current post (for 301 redirects after slug changes). */
export async function getPostIdBySlugAlias(slug: string): Promise<string | null> {
  const alias = await prisma.blogSlugAlias.findUnique({
    where: { slug },
    select: { postId: true },
  });
  if (!alias) return null;
  const post = await prisma.blogPost.findUnique({
    where: { id: alias.postId },
    select: { slug: true, published: true },
  });
  return post?.published ? post.slug : null;
}
