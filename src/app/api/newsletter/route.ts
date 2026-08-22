import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/newsletter — hero "Get in Touch" email capture.
 * Saves the address as a newsletter subscriber (unique, idempotent).
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    const form = await req.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    const email = String(form.get("email") || "").trim();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {}, // already subscribed — nothing to change
      create: { email, source: "website-hero" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] failed", err);
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
