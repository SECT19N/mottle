import type { MetadataRoute } from "next";
import { colorCombinations } from "@/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    ...colorCombinations.map((c) => ({ url: `${SITE_URL}/combo/${c.id}` })),
  ];
}
