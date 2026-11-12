import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { colorCombinations } from "@/data";
import { SchemeView } from "@/components/SchemeView";

export const dynamicParams = false;

export function generateStaticParams() {
  return colorCombinations.map((c) => ({ id: String(c.id) }));
}

function find(id: string) {
  const n = Number(id);
  const index = colorCombinations.findIndex((c) => c.id === n);
  return index === -1 ? null : { index, combo: colorCombinations[index] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const found = find((await params).id);
  if (!found) return {};
  const { combo } = found;
  const names = combo.colors.map((c) => c.name).join(", ");
  const title = `Combination ${combo.id}: ${names}`;
  const description = `${combo.type} palette from Sanzo Wada's A Dictionary of Color Combinations — ${combo.colors
    .map((c) => `${c.name} ${c.hex}`)
    .join(", ")}.`;
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
    <SchemeView
      combination={combo}
      prevId={colorCombinations[index - 1]?.id ?? null}
      nextId={colorCombinations[index + 1]?.id ?? null}
    />
  );
}
