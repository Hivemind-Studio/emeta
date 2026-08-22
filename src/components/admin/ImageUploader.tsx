"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { buildAssetUrl } from "@/lib/storage/url";

/**
 * Reusable admin image field.
 * - Upload a file to the CDN (stored as a key), OR paste an external URL.
 * - Hidden <input name={name}> carries the final value (CDN key or URL) to the server action.
 */
export function ImageUploader({
  name,
  label,
  defaultValue = "",
  allowUrl = true,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  /** show the "or paste URL" input (default true) */
  allowUrl?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [key, setKey] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(key ? buildAssetUrl(key) : null);

  function isExternal(v: string) {
    return /^https?:\/\//i.test(v);
  }

  async function handleFile(file: File) {
    setError("");
    // preview locally first
    const local = URL.createObjectURL(file);
    setPreview(local);

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      setKey(data.key);
      setPreview(buildAssetUrl(data.key));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal");
      if (defaultValue) setPreview(buildAssetUrl(defaultValue));
      else setPreview(null);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      {/* the form value — hidden input carries the storage key / URL to the server action */}
      <input type="hidden" name={name} value={key} />

      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg border border-line">
            <Image src={preview} alt="" fill className="object-cover" sizes="160px" unoptimized />
          </div>
        ) : (
          <div className="flex h-28 w-40 shrink-0 items-center justify-center rounded-lg border border-dashed border-line-soft text-xs text-mist">
            No image
          </div>
        )}

        <div className="flex-1">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-navy px-4 py-2 text-sm font-medium text-navy hover:bg-navy/5">
            {uploading ? "Uploading…" : key ? "Ganti Gambar" : "Upload Gambar"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>

          {allowUrl && (
            <div className="mt-2">
              <span className="block text-xs font-medium text-graphite">atau tempel URL gambar:</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="url"
                  placeholder="https://…"
                  defaultValue={isExternal(key) ? key : ""}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    if (v) {
                      setKey(v);
                      setPreview(v);
                    }
                  }}
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
          )}

          <p className="mt-2 text-xs text-mist">JPG, PNG, WebP, GIF, AVIF. Maks 12MB.</p>
          {uploading && <p className="mt-1 text-xs text-navy">Mengunggah…</p>}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          {key && (
            <button
              type="button"
              onClick={() => {
                setKey("");
                setPreview(null);
              }}
              className="mt-2 text-xs text-red-600 hover:underline"
            >
              Hapus gambar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
