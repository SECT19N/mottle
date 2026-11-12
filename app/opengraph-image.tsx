import { colorCombinations } from "@/data";
import { OG_SIZE, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Mottle — a dictionary of color combinations";

export default function Image() {
  const colors = colorCombinations.slice(0, 6).flatMap((c) => c.colors[0]);
  return renderOg({
    colors,
    title: "Mottle",
    subtitle: "A dictionary of color combinations",
  });
}
