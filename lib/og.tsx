import { ImageResponse } from "next/og";
import { readableTextOn } from "@/lib/utils";

export const OG_SIZE = { width: 1200, height: 630 };

/** Full-bleed swatch strips with a caption bar; used for the home + per-combination share images. */
export function renderOg({
  colors,
  title,
  subtitle,
}: {
  colors: { hex: string; name?: string }[];
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#F4F1EA",
      }}
    >
      <div style={{ display: "flex", flex: 1 }}>
        {colors.map((c, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: c.hex,
              display: "flex",
              alignItems: "flex-end",
              padding: 24,
              color: readableTextOn(c.hex),
              fontSize: 26,
            }}
          >
            {c.name}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "28px 48px",
          color: "#1c1917",
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#78716c" }}>{subtitle}</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
