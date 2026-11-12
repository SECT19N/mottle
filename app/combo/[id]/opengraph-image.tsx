import { colorCombinations } from "@/data";
import { formatId } from "@/lib/utils";
import { OG_SIZE, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return colorCombinations.map((c) => ({ id: String(c.id) }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const combo = colorCombinations.find((c) => c.id === Number(id))!;
  return renderOg({
    colors: combo.colors,
    title: `Combination ${formatId(combo.id)}`,
    subtitle: `Mottle · ${combo.type}`,
  });
}
