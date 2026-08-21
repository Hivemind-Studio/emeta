import { buildAssetUrl } from "@/lib/storage/url";

/**
 * Figma-exported brand assets, hosted on the R2 CDN under the emeta prefix
 * (cdn.denovamind.com/emeta). Keys returned by the upload-assets script.
 * Using the CDN (buildAssetUrl) guarantees these are the EXACT Figma assets
 * and served from cdn.denovamind.com/emeta, never a local substitute.
 */
export const BRAND_ASSETS: Record<string, string> = {
  heroBg: "2026-08/emeta-hero-bg-511585cc.webp",
  logoWhite: "2026-08/emeta-logo-white-00264f74.webp",
  logoBlue: "2026-08/emeta-logo-blue-e0df7022.webp",
  iconWhite: "2026-08/emeta-icon-white-15c86426.webp",
  contactMap: "2026-08/emeta-contact-map-4c31b637.webp",
};

export function brandUrl(id: string): string {
  return buildAssetUrl(BRAND_ASSETS[id] || "");
}
