import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { saveFile, isAllowedExt, mimeFromExt } from "@/lib/storage";
import sharp from "sharp";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024; // 12MB

/**
 * Admin image upload. Multipart POST with a single "file" field.
 * Saves to the CDN (R2) via the storage driver and returns the storage KEY,
 * which the caller stores on the model (blog post, service, award, etc.).
 * Validates real image content (via sharp) and a size cap BEFORE buffering.
 */
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Enforce a hard size cap up-front (Content-Length guard before reading body).
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > MAX_BYTES) {
    return NextResponse.json({ error: "File terlalu besar (maks 12MB)." }, { status: 413 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File terlalu besar (maks 12MB)." }, { status: 413 });
  }

  const name = file.name || "upload";
  if (!isAllowedExt(name)) {
    return NextResponse.json(
      { error: "Tipe file tidak diizinkan. Gunakan JPG, PNG, WebP, GIF, atau AVIF." },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Content validation, not just filename: decode via sharp and reject non-images.
    let ok = true;
    try {
      await sharp(buffer, { failOn: "error" }).metadata();
    } catch {
      ok = false;
    }
    if (!ok) {
      return NextResponse.json({ error: "File bukan gambar yang valid." }, { status: 400 });
    }

    const saved = await saveFile({
      originalName: name,
      buffer,
      mime: mimeFromExt(name),
    });
    return NextResponse.json({ key: saved.key, mime: saved.mime, size: saved.size });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 },
    );
  }
}