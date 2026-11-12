export const SITE_NAME = "Mottle";
export const SITE_DESCRIPTION =
  "A digital archive of color combinations inspired by Sanzo Wada's A Dictionary of Color Combinations.";

// Set at build time. For a GitHub project site: NEXT_PUBLIC_SITE_URL=https://<user>.github.io
// and NEXT_PUBLIC_BASE_PATH=/<repo>. Leave BASE_PATH empty for a user site or custom domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(
  /\/$/,
  "",
);

/** Absolute URL for a site path like "/combo/3". */
export function absoluteUrl(path = "/") {
  return `${SITE_URL}${BASE_PATH}${path}`;
}
