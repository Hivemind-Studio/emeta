"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Global admin feedback toast.
 *
 * Server actions redirect back with ?ok=<message-key> on success (or the page
 * renders a flash message). This component reads that query param and shows a
 * dismissible toast for 4 seconds. It also listens for the custom
 * "admin:toast" window event so client forms can trigger it directly.
 */
const LABELS: Record<string, string> = {
  created: "Berhasil disimpan — data baru dibuat.",
  updated: "Perubahan berhasil disimpan.",
  deleted: "Data berhasil dihapus.",
  "post-created": "Artikel berhasil dibuat.",
  "post-updated": "Artikel berhasil diperbarui.",
  "post-deleted": "Artikel berhasil dihapus.",
  "product-created": "Produk berhasil ditambahkan.",
  "product-updated": "Produk berhasil diperbarui.",
  "product-deleted": "Produk berhasil dihapus.",
  "settings-updated": "Pengaturan berhasil disimpan.",
};

export function AdminToast() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ok = searchParams.get("ok");
    const error = searchParams.get("error");
    if (ok) setMsg(LABELS[ok] ?? "Berhasil.");
    if (error) setErr(LABELS[error] ?? "Terjadi kesalahan.");
  }, [searchParams]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ ok?: string; error?: string }>).detail;
      if (detail.ok) setMsg(LABELS[detail.ok] ?? detail.ok);
      if (detail.error) setErr(detail.error);
    };
    window.addEventListener("admin:toast", handler);
    return () => window.removeEventListener("admin:toast", handler);
  }, []);

  useEffect(() => {
    if (!msg && !err) return;
    const t = setTimeout(() => {
      setMsg(null);
      setErr(null);
      // clean the query string so refresh doesn't re-show it
      if (searchParams.get("ok") || searchParams.get("error")) {
        window.history.replaceState(null, "", pathname);
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [msg, err, pathname, searchParams]);

  if (!msg && !err) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] max-w-sm"
    >
      <div
        className={`flex items-start gap-3 rounded-xl border px-5 py-4 shadow-lg backdrop-blur ${
          err
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-800"
        }`}
      >
        <span className="mt-0.5 text-lg leading-none">{err ? "✕" : "✓"}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{err ? "Gagal" : "Sukses"}</p>
          <p className="mt-0.5 text-sm">{err ?? msg}</p>
        </div>
        <button
          onClick={() => {
            setMsg(null);
            setErr(null);
          }}
          className="ml-2 shrink-0 text-sm opacity-60 hover:opacity-100"
          aria-label="Tutup notifikasi"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
