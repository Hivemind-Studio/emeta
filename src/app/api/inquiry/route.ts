import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/inquiry — receives the contact form and emails it to the
 * company's support address (info@emeta.co.id by default).
 *
 * Transport: SMTP via nodemailer when SMTP_* env vars are present.
 * Fallback: stores nothing but returns success only if email sent;
 * if no SMTP configured, respond 503 so the admin knows to configure it.
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const to = process.env.INQUIRY_TO_EMAIL || "info@emeta.co.id";
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
