import type { NextConfig } from "next";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // fully static: deploy `out/` to GitHub Pages, Cloudflare Pages or Vercel
  images: { unoptimized: true },
  ...(basePath && { basePath }),
};

export default nextConfig;
