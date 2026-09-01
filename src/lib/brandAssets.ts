import { buildAssetUrl } from "@/lib/storage/url";

/**
 * Figma-exported brand assets, hosted on the R2 CDN under the emeta prefix
 * (cdn.emeta.co.id/emeta). Keys returned by the upload-assets script (HD
 * 4x exports). Using the CDN (buildAssetUrl) guarantees these are the EXACT
 * Figma assets and served from cdn.emeta.co.id/emeta, never a local
 * substitute.
 */
export const BRAND_ASSETS: Record<string, string> = {
  heroBg: "2026-08/emeta-hero-bg-274e77ae.webp",
  logoWhite: "2026-08/emeta-logo-white-c85dca5e.webp",
  logoBlue: "2026-08/emeta-logo-blue-07bf057e.webp",
  iconWhite: "2026-08/emeta-icon-white-clean-3eabaec4.webp",
  ctaBg: "2026-08/emeta-cta-bg-1a84d18f.webp",
  contactMap: "2026-08/emeta-contact-map-1db0319d.webp",
};

export function brandUrl(id: string): string {
  return buildAssetUrl(BRAND_ASSETS[id] || "");
}
