"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { deleteFile } from "@/lib/storage";

export async function createProduct(formData: FormData) {
  await requireAuth();
  const title = String(formData.get("title") || "").trim();
  const tags = String(formData.get("tags") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const learnMoreUrl = String(formData.get("learnMoreUrl") || "").trim();
  const iconUrl = String(formData.get("iconUrl") || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder")) || 0;

  await prisma.product.create({
    data: { title, tags, description, learnMoreUrl, iconUrl, sortOrder },
  });
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const tags = String(formData.get("tags") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const learnMoreUrl = String(formData.get("learnMoreUrl") || "").trim();
  const iconUrl = String(formData.get("iconUrl") || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder")) || 0;

  const prev = await prisma.product.findUnique({ where: { id } });
  await prisma.product.update({
    where: { id },
    data: { title, tags, description, learnMoreUrl, iconUrl, sortOrder },
  });
  if (prev?.iconUrl && prev.iconUrl !== iconUrl) {
    try { await deleteFile(prev.iconUrl); } catch {}
  }
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") || "");
  const prev = await prisma.product.findUnique({ where: { id } });
  await prisma.product.delete({ where: { id } });
  if (prev?.iconUrl) {
    try { await deleteFile(prev.iconUrl); } catch {}
  }
  revalidatePath("/");
  redirect("/admin/products");
}
