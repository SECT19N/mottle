export type ColorCombination = {
  id: number;
  colors: {
    hex: string;
    name: string;
    cmyk?: string;
  }[];
  type: "2-color" | "3-color" | "4-color";
};

export const colorCombinations: ColorCombination[] = [
  // 2-Color Combinations
  {
    id: 1,
    type: "2-color",
    colors: [
      { hex: "#D64F3E", name: "English Red", cmyk: "C0 M62 Y58 K0" },
      { hex: "#008DB7", name: "Cerulean Blue", cmyk: "C84 M26 Y32 K0" },
    ],
  },
  {
    id: 2,
    type: "2-color",
    colors: [
      { hex: "#1C2442", name: "Dark Tyrian Blue", cmyk: "C90 M66 Y36 K50" },
      { hex: "#F39F18", name: "Yellow Orange", cmyk: "C0 M45 Y100 K0" },
    ],
  },
  {
    id: 45,
    type: "2-color",
    colors: [
      { hex: "#E0B6B6", name: "Seashell Pink", cmyk: "C0 M19 Y23 K0" },
      { hex: "#E8D62E", name: "Lemon Yellow", cmyk: "C5 M0 Y85 K0" },
    ],
  },
  {
    id: 46,
    type: "2-color",
    colors: [
      { hex: "#E65218", name: "Orange", cmyk: "C0 M68 Y100 K0" },
      { hex: "#1A1A1A", name: "Black", cmyk: "C20 M10 Y15 K100" },
    ],
  },
  {
    id: 57,
    type: "2-color",
    colors: [
      { hex: "#5E3A48", name: "Taupe Brown", cmyk: "C30 M70 Y35 K40" },
      { hex: "#3E4C53", name: "Slate Color", cmyk: "C85 M70 Y62 K30" },
    ],
  },
  {
    id: 60,
    type: "2-color",
    colors: [
      { hex: "#1C2442", name: "Dark Tyrian Blue", cmyk: "C90 M66 Y36 K50" },
      { hex: "#EBE0A5", name: "Pale Lemon Yellow", cmyk: "C0 M4 Y38 K0" },
    ],
  },

  // 3-Color Combinations
  {
    id: 129,
    type: "3-color",
    colors: [
      { hex: "#C39126", name: "Khaki", cmyk: "C24 M45 Y100 K6" },
      { hex: "#8FA2CC", name: "Salvia Blue", cmyk: "C41 M25 Y10 K0" },
      { hex: "#F4C900", name: "Apricot Yellow", cmyk: "C0 M10 Y100 K0" },
    ],
  },
  {
    id: 130,
    type: "3-color",
    colors: [
      { hex: "#A12F36", name: "Carmine Red", cmyk: "C25 M95 Y80 K16" },
      { hex: "#543986", name: "Violet", cmyk: "C75 M100 Y50 K5" },
      { hex: "#A65E2E", name: "Raw Sienna", cmyk: "C18 M58 Y100 K12" },
    ],
  },
  {
    id: 154,
    type: "3-color",
    colors: [
      { hex: "#D11C28", name: "Carmine", cmyk: "C0 M100 Y75 K16" },
      { hex: "#FFD900", name: "Yellow", cmyk: "C0 M0 Y100 K0" },
      { hex: "#0067C0", name: "Blue", cmyk: "C95 M54 Y0 K0" },
    ],
  },
  {
    id: 167,
    type: "3-color",
    colors: [
      { hex: "#A3C3D6", name: "Pale King's Blue", cmyk: "C33 M4 Y7 K0" },
      { hex: "#AFA391", name: "Ecru", cmyk: "C20 M25 Y40 K6" },
      { hex: "#1D3F6E", name: "Vandar Poel's Blue", cmyk: "C100 M73 Y43 K10" },
    ],
  },

  // 4-Color Combinations
  {
    id: 241,
    type: "4-color",
    colors: [
      { hex: "#D63C27", name: "Red Orange", cmyk: "C9 M90 Y100 K0" },
      { hex: "#3D4C63", name: "Dark Medici Blue", cmyk: "C70 M45 Y45 K15" },
      { hex: "#EBE0A5", name: "Pale Lemon Yellow", cmyk: "C0 M4 Y38 K0" },
      { hex: "#B0945D", name: "Isabella Color", cmyk: "C15 M28 Y60 K10" },
    ],
  },
  {
    id: 266,
    type: "4-color",
    colors: [
      { hex: "#C4282D", name: "Spectrum Red", cmyk: "C5 M100 Y100 K0" },
      { hex: "#E3D7C1", name: "Ivory Buff", cmyk: "C8 M15 Y40 K0" },
      { hex: "#6B7C47", name: "Rainette Green", cmyk: "C42 M20 Y62 K28" },
      { hex: "#007B67", name: "Benzol Green", cmyk: "C100 M15 Y55 K0" },
    ],
  },
  {
    id: 289,
    type: "4-color",
    colors: [
      { hex: "#2E2930", name: "Dull Violet Black", cmyk: "C100 M90 Y38 K50" },
      { hex: "#E8D62E", name: "Lemon Yellow", cmyk: "C5 M0 Y85 K0" },
      { hex: "#4B57A3", name: "Violet Blue", cmyk: "C85 M79 Y38 K16" },
      { hex: "#C8D03B", name: "Light Green Yellow", cmyk: "C26 M5 Y85 K0" },
    ],
  },
  {
    id: 300,
    type: "4-color",
    colors: [
      { hex: "#A9C6D6", name: "Calamine Blue", cmyk: "C50 M0 Y20 K0" },
      { hex: "#F2E691", name: "Cream Yellow", cmyk: "C0 M28 Y68 K0" },
      { hex: "#F07D67", name: "Grenadine Pink", cmyk: "C0 M62 Y58 K0" },
      { hex: "#77C2B2", name: "Turquoise Green", cmyk: "C29 M0 Y24 K0" },
    ],
  },
];
