"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function updateSettings(formData: FormData) {
  await requireAuth();
  const g = (k: string) => String(formData.get(k) || "").trim();
  const opt = (k: string) => g(k) || null;

  // Shared payload so update & create always stay in sync (previously the
  // update branch was missing most fields — edits silently dropped them).
  const data = {
    brandName: g("brandName"),
    phoneDisplay: g("phoneDisplay"),
    emailSupport: g("emailSupport"),
    inquiryEmail: g("inquiryEmail"),
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
    heroCtaLabel: g("heroCtaLabel"),
    aboutStatsJson: g("aboutStatsJson"),
    offeringsEyebrow: g("offeringsEyebrow"),
    offeringsTitle: g("offeringsTitle"),
    offeringsSubtitle: g("offeringsSubtitle"),
    newsEyebrow: g("newsEyebrow"),
    newsSubtitle: g("newsSubtitle"),
    ctaTitle: g("ctaTitle"),
    ctaSubtitle: g("ctaSubtitle"),
    ctaButtonLabel: g("ctaButtonLabel"),
    contactTitle: g("contactTitle"),
    productsEnabled: formData.get("productsEnabled") === "on",
    comingSoonTitle: g("comingSoonTitle"),
    comingSoonQuote: g("comingSoonQuote"),
    heroImageUrl: opt("heroImageUrl"),
    logoWhiteUrl: opt("logoWhiteUrl"),
    logoBlueUrl: opt("logoBlueUrl"),
    contactMapUrl: opt("contactMapUrl"),
  };

  await prisma.globalSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/coming-soon");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?ok=settings-updated");
}
