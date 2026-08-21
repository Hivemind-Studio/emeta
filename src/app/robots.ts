import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL || "https://emeta.zeabur.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"], // keep the protected CMS out of search indexes
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}