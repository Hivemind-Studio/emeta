import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  serverExternalPackages: ["sharp"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.denovamind.com" }],
  },
};

export default nextConfig;
