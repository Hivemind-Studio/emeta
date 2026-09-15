import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/subscribers/export — admin-only CSV download of newsletter
 * subscriber emails (hero "Get in Touch" captures).
 *
 * Auth-gated by the same JWT admin cookie used by the (protected) admin
 * pages. Rejects with 401 when no valid session cookie is present, and 403
 * for any other HTTP method.
 */
function csvCell(value: string): string {
  // RFC 4180: quote cells containing commas, quotes, or newlines; double the quotes.
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "asc" },
  });

  const header = "id,email,source,created_at\n";
  const rows = subscribers.map((s) =>
    [
      csvCell(String(s.id)),
      csvCell(s.email),
      csvCell(s.source),
      csvCell(s.createdAt.toISOString()),
    ].join(","),
  );
  const csv = header + rows.join("\n") + "\n";
  const filename = `emeta-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function POST() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}