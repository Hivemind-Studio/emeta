"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function updateSettings(formData: FormData) {
  await requireAuth();
  const g = (k: string) => String(formData.get(k) || "").trim();
  const opt = (k: string) => g(k) || null;

  await prisma.globalSettings.upsert({
    where: { id: 1 },
    update: {
      brandName: g("brandName"),
      phoneDisplay: g("phoneDisplay"),
      emailSupport: g("emailSupport"),
      officeAddress: g("officeAddress"),
      linkedinUrl: g("linkedinUrl"),
      facebookUrl: g("facebookUrl"),
      twitterUrl: g("twitterUrl"),
      youtubeUrl: g("youtubeUrl"),
      foundedYear: g("foundedYear"),
      heroTitle: g("heroTitle"),
      heroBody: g("heroBody"),
      aboutTitle: g("aboutTitle"),
      aboutBody: g("aboutBody"),
      copyright: g("copyright"),
      heroImageUrl: opt("heroImageUrl"),
      logoWhiteUrl: opt("logoWhiteUrl"),
      logoBlueUrl: opt("logoBlueUrl"),
      contactMapUrl: opt("contactMapUrl"),
    },
    create: {
      id: 1,
      brandName: g("brandName"),
      phoneDisplay: g("phoneDisplay"),
      emailSupport: g("emailSupport"),
      officeAddress: g("officeAddress"),
      linkedinUrl: g("linkedinUrl"),
      facebookUrl: g("facebookUrl"),
      twitterUrl: g("twitterUrl"),
      youtubeUrl: g("youtubeUrl"),
      foundedYear: g("foundedYear"),
      heroTitle: g("heroTitle"),
      heroBody: g("heroBody"),
      aboutTitle: g("aboutTitle"),
      aboutBody: g("aboutBody"),
      copyright: g("copyright"),
      heroImageUrl: opt("heroImageUrl"),
      logoWhiteUrl: opt("logoWhiteUrl"),
      logoBlueUrl: opt("logoBlueUrl"),
      contactMapUrl: opt("contactMapUrl"),
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
