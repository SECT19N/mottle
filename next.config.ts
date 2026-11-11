import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // fully static: deploy `out/` to Cloudflare Pages or Vercel
  images: { unoptimized: true },
};

export default nextConfig;
