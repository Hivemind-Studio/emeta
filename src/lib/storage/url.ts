/**
 * Public URL builder for stored asset keys — the ONLY module client components
 * may import. It contains NO I/O, no sharp, no S3, no fs, so importing it from
 * client code never drags server-only deps into the client bundle.
 */
export const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/+$/, "");
export const CDN_KEY_PREFIX = (process.env.NEXT_PUBLIC_CDN_KEY_PREFIX || "").replace(/^\/+|\/+$/g, "");

/**
 * Turn a stored key (e.g. "2026-08/abc.webp") into its public URL. If a CDN is
 * configured, returns the CDN URL; otherwise falls back to the local /uploads
 * route. Same for both server and client.
 */
export function buildAssetUrl(key: string | null | undefined): string {
  if (!key) return "";
  // ImageUploader also accepts a pasted external URL — pass those through
  if (/^https?:\/\//i.test(key)) return key;
  if (CDN_BASE_URL) {
    return `${CDN_BASE_URL}/${CDN_KEY_PREFIX ? `${CDN_KEY_PREFIX}/` : ""}${key}`;
  }
  return `/uploads/${key}`;
}