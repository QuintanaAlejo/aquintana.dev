import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const mono = await readFile(join(process.cwd(), "src/assets/fonts/GeistMono-SemiBold.ttf"));

/** The "AQ" monogram from the navigation, used as favicon and app icon. */
export async function renderMonogram(size: number, rounded: boolean) {
  const ring = Math.max(2, Math.round(size / 22));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1C1D1F",
          color: "#EDEDEA",
          borderRadius: rounded ? 999 : 0,
          border: rounded ? `${ring}px solid #F0531C` : "none",
          fontFamily: "Geist Mono",
          fontSize: Math.round(size * 0.4),
          letterSpacing: "-0.04em",
        }}
      >
        AQ
      </div>
    ),
    { width: size, height: size, fonts: [{ name: "Geist Mono", data: mono, style: "normal", weight: 600 }] },
  );
}
