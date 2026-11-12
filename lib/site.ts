export const SITE_NAME = "Mottle";
export const SITE_DESCRIPTION =
  "A digital archive of color combinations inspired by Sanzo Wada's A Dictionary of Color Combinations.";

// Set NEXT_PUBLIC_SITE_URL at build time (e.g. https://mottle.pages.dev).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
