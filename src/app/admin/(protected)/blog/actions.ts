"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { deleteFile } from "@/lib/storage";

/** Ensure a slug is unique by appending a numeric suffix on collision. */
async function uniqueSlug(base: string): Promise<string> {
  const slug = slugify(base) || `post-${Date.now()}`;
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (!existing) return slug;
  let i = 2;
  for (;;) {
    const candidate = `${slug}-${i}`;
    const taken = await prisma.blogPost.findUnique({ where: { slug: candidate } });
    if (!taken) return candidate;
    i++;
  }
}

export async function createPost(formData: FormData) {
  await requireAuth();
  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "");
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;
  const tags = String(formData.get("tags") || "").trim();

  if (!title) redirect("/admin/blog/new?error=post-created");

  try {
    const slug = await uniqueSlug(title);
    await prisma.blogPost.create({
      data: { title, slug, tags, excerpt, content, published, featured, imageUrl },
    });
  } catch {
    redirect("/admin/blog/new?error=post-created");
  }
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog?ok=post-created");
}

export async function updatePost(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "");
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;
  // Slug is only changed when the admin edits the explicit Slug field.
  // Never derive it from the title on update — that silently breaks live URLs.
  const requestedSlug = String(formData.get("slug") || "").trim();
  const tags = String(formData.get("tags") || "").trim();

  try {
    const prev = await prisma.blogPost.findUnique({ where: { id } });
    if (!prev) redirect(`/admin/blog/${id}/edit?error=post-updated`);

    let slug = prev.slug;
    if (requestedSlug && slugify(requestedSlug) && slugify(requestedSlug) !== prev.slug) {
      const next = await uniqueSlug(requestedSlug);
      if (next !== prev.slug) {
        // Keep the old URL working: record it as an alias → 301 to the new one
        await prisma.blogSlugAlias.create({ data: { slug: prev.slug, postId: id } }).catch(() => {});
        slug = next;
      }
    }

    await prisma.blogPost.update({
      where: { id },
      data: { title, slug, tags, excerpt, content, published, featured, imageUrl },
    });
    if (prev?.imageUrl && prev.imageUrl !== imageUrl) {
      try { await deleteFile(prev.imageUrl); } catch {}
    }
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/");
  } catch {
    redirect(`/admin/blog/${id}/edit?error=post-updated`);
  }
  redirect("/admin/blog?ok=post-updated");
}

export async function deletePost(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") || "");
  try {
    const prev = await prisma.blogPost.findUnique({ where: { id } });
    await prisma.blogPost.delete({ where: { id } });
    if (prev?.imageUrl) {
      try { await deleteFile(prev.imageUrl); } catch {}
    }
  } catch {
    redirect("/admin/blog?error=post-deleted");
  }
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog?ok=post-deleted");
}
