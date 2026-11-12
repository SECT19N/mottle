export const COLOR_CATEGORIES = [
  { name: "Red", hex: "#D64F3E" },
  { name: "Orange", hex: "#E65218" },
  { name: "Yellow", hex: "#E8D62E" },
  { name: "Green", hex: "#6B7C47" },
  { name: "Blue", hex: "#008DB7" },
  { name: "Purple", hex: "#543986" },
  { name: "Pink", hex: "#E0B6B6" },
  { name: "Brown", hex: "#5E3A48" },
  { name: "Gray", hex: "#3E4C53" },
] as const;

export type ColorCategory = (typeof COLOR_CATEGORIES)[number]["name"];

export function hexToHsl(hex: string): [h: number, s: number, l: number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [0, 0, 0];
  const [r, g, b] = [m[1], m[2], m[3]].map((v) => parseInt(v, 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}

/** Perceptual-ish bucket for a swatch, from its actual color rather than its name. */
export function categorize(hex: string): ColorCategory {
  const [h, s, l] = hexToHsl(hex);
  if (s < 0.14 || l < 0.1 || l > 0.96) return "Gray";
  const warm = h >= 8 && h < 52;
  // Warm, dark or muted colors read as brown rather than red/orange/yellow.
  if (warm && (l < 0.42 || s < 0.35 || (s < 0.55 && l < 0.6))) return "Brown";
  if ((h < 12 || h >= 330) && l < 0.28) return "Brown";
  // Olives: dull yellow-greens.
  if (h >= 52 && h < 70 && l < 0.62 && s < 0.65) return "Green";
  if ((h < 20 || h >= 320) && l > 0.64) return "Pink";
  if (h < 14 || h >= 340) return "Red";
  if (h < 40) return "Orange";
  if (h < 70) return "Yellow";
  if (h < 178) return "Green";
  if (h < 242) return "Blue";
  if (h < 320) return "Purple";
  return "Pink";
}

/** A filter token is either a category name ("Red") or an exact hex ("#D96629"). */
export function matchesToken(hex: string, token: string): boolean {
  return token.startsWith("#") ? hex === token : categorize(hex) === token;
}
