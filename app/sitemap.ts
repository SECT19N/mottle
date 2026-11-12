import type { MetadataRoute } from "next";
import { colorCombinations } from "@/data";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/") },
    ...colorCombinations.map((c) => ({ url: absoluteUrl(`/combo/${c.id}`) })),
  ];
}
