import raw from "./combinations.json";

export type ColorCombination = {
  id: number;
  colors: {
    hex: string;
    name: string;
    cmyk?: string;
  }[];
  type: "2-color" | "3-color" | "4-color" | "5-color";
};

// Source: Sanzo Wada, A Dictionary of Color Combinations, Vol. 1 (360 entries).
export const colorCombinations = raw as ColorCombination[];
