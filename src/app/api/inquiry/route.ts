import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/inquiry — receives the contact form and emails it to the
 * company's inquiry address defined by the admin in GlobalSettings
 * (fallback: INQUIRY_TO_EMAIL env, then info@emeta.co.id).
 *
 * Transport: SMTP via nodemailer when SMTP_* env vars are present.
 * If no SMTP is configured, respond 503 so the sender knows delivery is unavailable.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    const form = await req.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    // Recipient = admin-defined "inquiry email", with env/constant fallbacks
    let to = process.env.INQUIRY_TO_EMAIL || "info@emeta.co.id";
    try {
      const settings = await prisma.globalSettings.findUnique({ where: { id: 1 } });
      if (settings?.inquiryEmail && EMAIL_RE.test(settings.inquiryEmail)) {
        to = settings.inquiryEmail;
      }
    } catch {
      // DB hiccup — fall back to env/default
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.error("[inquiry] SMTP not configured; drop:", { name, email, message });
      return NextResponse.json(
        { ok: false, error: "Email service not configured" },
        { status: 503 },
      );
    }

    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to,
      replyTo: email,
      subject: `[Website Inquiry] ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><hr/><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    });

    const url = new URL(req.url);
    return NextResponse.redirect(`${url.origin}/?inquiry=sent#contact`, 303);
  } catch (err) {
    console.error("[inquiry] send failed", err);
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
