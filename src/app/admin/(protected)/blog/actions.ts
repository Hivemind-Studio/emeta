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

  if (!title) redirect("/admin/blog/new?error=post-created");

  try {
    const slug = await uniqueSlug(title);
    await prisma.blogPost.create({
      data: { title, slug, excerpt, content, published, featured, imageUrl },
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

  try {
    const prev = await prisma.blogPost.findUnique({ where: { id } });
    let slug = slugify(title);
    if (slug) {
      const clash = await prisma.blogPost.findFirst({ where: { slug, id: { not: id } } });
      if (clash) slug = await uniqueSlug(title);
    }

    await prisma.blogPost.update({
      where: { id },
      data: { title, slug, excerpt, content, published, featured, imageUrl },
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
