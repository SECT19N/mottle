import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { colorCombinations } from "@/data";
import { SchemeView } from "@/components/SchemeView";
import { JsonLd } from "@/lib/json-ld";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return colorCombinations.map((c) => ({ id: String(c.id) }));
}

function find(id: string) {
  const n = Number(id);
  const index = colorCombinations.findIndex((c) => c.id === n);
  return index === -1 ? null : { index, combo: colorCombinations[index] };
}

function joinNames(names: string[]) {
  return names.length < 3
    ? names.join(" & ")
    : `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const found = find((await params).id);
  if (!found) return {};
  const { combo } = found;
  const names = joinNames(combo.colors.map((c) => c.name));
  const hexes = combo.colors.map((c) => c.hex).join(", ");
  const title = `${names} Color Palette (${hexes})`;
  const description = `${names}: a ${combo.type} color combination (no. ${combo.id}) from Sanzo Wada's A Dictionary of Color Combinations. ${combo.colors
    .map((c) => `${c.name} ${c.hex}${c.cmyk ? ` / ${c.cmyk}` : ""}`)
    .join("; ")}.`;
  const url = `/combo/${combo.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ComboPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const found = find((await params).id);
  if (!found) notFound();
  const { index, combo } = found;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CreativeWork",
              "@id": absoluteUrl(`/combo/${combo.id}`),
              url: absoluteUrl(`/combo/${combo.id}`),
              name: `${joinNames(combo.colors.map((c) => c.name))} Color Palette`,
              description: `${combo.type} color combination no. ${combo.id}: ${combo.colors.map((c) => `${c.name} ${c.hex}`).join(", ")}.`,
              keywords: [
                ...combo.colors.flatMap((c) => [c.name, c.hex]),
                "color palette",
                "color combination",
              ].join(", "),
              isPartOf: {
                "@type": "WebSite",
                name: SITE_NAME,
                url: absoluteUrl("/"),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: SITE_NAME,
                  item: absoluteUrl("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: `Combination ${combo.id}`,
                  item: absoluteUrl(`/combo/${combo.id}`),
                },
              ],
            },
          ],
        }}
      />
      <SchemeView
        combination={combo}
        prevId={colorCombinations[index - 1]?.id ?? null}
        nextId={colorCombinations[index + 1]?.id ?? null}
      />
    </>
  );
}
