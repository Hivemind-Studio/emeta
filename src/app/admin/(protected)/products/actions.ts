"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { deleteFile } from "@/lib/storage";

/** Unique slug from a title, appending -2, -3… when taken. */
async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = slugify(base) || "produk";
  for (let i = 2; ; i++) {
    const exists = await prisma.product.findUnique({ where: { slug } });
    if (!exists || exists.id === ignoreId) return slug;
    slug = `${slugify(base)}-${i}`;
  }
}

export async function createProduct(formData: FormData) {
  await requireAuth();
  const title = String(formData.get("title") || "").trim();
  const tags = String(formData.get("tags") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const learnMoreUrl = String(formData.get("learnMoreUrl") || "").trim();
  const iconUrl = String(formData.get("iconUrl") || "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder")) || 0;

  if (!title) redirect("/admin/products?error=product-created");

  // Slug: from the explicit field, else derived from the title
  const requested = String(formData.get("slug") || "").trim();
  const slug = await uniqueSlug(requested || title);

  try {
    await prisma.product.create({
      data: { title, slug, tags, description, learnMoreUrl, iconUrl, imageUrl, sortOrder },
    });
  } catch {
    redirect("/admin/products?error=product-created");
  }
  revalidatePath("/");
  redirect("/admin/products?ok=product-created");
}

export async function updateProduct(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const tags = String(formData.get("tags") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const learnMoreUrl = String(formData.get("learnMoreUrl") || "").trim();
  const iconUrl = String(formData.get("iconUrl") || "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder")) || 0;

  const requested = String(formData.get("slug") || "").trim() || title;
  const slug = await uniqueSlug(requested, id);

  try {
    const prev = await prisma.product.findUnique({ where: { id } });
    await prisma.product.update({
      where: { id },
      data: { title, slug, tags, description, learnMoreUrl, iconUrl, imageUrl, sortOrder },
    });
    // Drop replaced assets — but never one the product still points at (icon and
    // detail image can share a key, e.g. after copying one field into the other)
    const kept = [iconUrl, imageUrl];
    for (const before of new Set([prev?.iconUrl, prev?.imageUrl])) {
      if (before && !kept.includes(before)) {
        try { await deleteFile(before); } catch {}
      }
    }
  } catch {
    redirect("/admin/products?error=product-updated");
  }
  revalidatePath("/");
  redirect("/admin/products?ok=product-updated");
}

export async function deleteProduct(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") || "");
  try {
    const prev = await prisma.product.findUnique({ where: { id } });
    await prisma.product.delete({ where: { id } });
    for (const key of new Set([prev?.iconUrl, prev?.imageUrl])) {
      if (key) {
        try { await deleteFile(key); } catch {}
      }
    }
  } catch {
    redirect("/admin/products?error=product-deleted");
  }
  revalidatePath("/");
  redirect("/admin/products?ok=product-deleted");
}
