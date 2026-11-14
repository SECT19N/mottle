import { Gallery } from "@/components/Gallery";
import { JsonLd } from "@/lib/json-ld";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: absoluteUrl("/"),
          description: SITE_DESCRIPTION,
        }}
      />
      <Gallery />
      <section className="mx-auto max-w-3xl px-4 pb-16 text-sm leading-relaxed text-stone-600 sm:px-6 dark:text-stone-400">
        <h2 className="mb-3 font-serif text-xl text-stone-900 italic dark:text-stone-100">
          About Mottle
        </h2>
        <p className="mb-3">
          Mottle is a browsable digital archive of the color combinations in{" "}
          <em>A Dictionary of Color Combinations</em> (Sanzo Wada, 1930s). Each
          combination is a palette of two to five named colors, shown with its
          HEX, RGB and CMYK values so it can be copied straight into a design.
        </p>
        <p>
          Filter by palette size or color family, save your favorites, or build
          your own palette from the colors in the book. Every combination has
          its own page you can link to.
        </p>
      </section>
    </>
  );
}
