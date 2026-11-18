import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Dictionary } from "@/content/types";

export const ogSize = { width: 1200, height: 630 };

// Read once at module load so the images are generated at build time.
const mono = await readFile(join(process.cwd(), "src/assets/fonts/GeistMono-SemiBold.ttf"));
const sans = await readFile(join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf"));
const photo = `data:image/jpeg;base64,${await readFile(join(process.cwd(), "src/assets/fotos/retrato.jpg"), "base64")}`;

/** Open Graph card: same palette, type and portrait as the site hero. */
export async function renderOg(t: Dictionary) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "56px 64px",
          background: "linear-gradient(135deg, #E4E4E1 0%, #D8D8D5 55%, #CFCFCC 100%)",
          color: "#1C1D1F",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Geist Mono",
              fontSize: 20,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#57585C",
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 3, background: "#F0531C", marginRight: 16 }} />
            {t.hero.eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Geist Mono",
              fontSize: 54,
              lineHeight: 1.06,
              letterSpacing: "-0.05em",
            }}
          >
            <span>{t.hero.titleA.trim()}</span>
            <span style={{ color: "#57585C" }}>{t.hero.titleB}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Geist", fontSize: 24, color: "#46474B" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                background: "#1C1D1F",
                color: "#EDEDEA",
                border: "2px solid #F0531C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Geist Mono",
                fontSize: 16,
                letterSpacing: "-0.04em",
              }}
            >
              AQ
            </div>
            aquintana.dev
          </div>
        </div>
        <div
          style={{
            display: "flex",
            padding: 12,
            borderRadius: 48,
            background: "rgba(255,255,255,0.44)",
            border: "1px solid rgba(255,255,255,0.75)",
            boxShadow: "0 24px 60px -28px rgba(20,21,23,0.35)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
          <img src={photo} alt="" width={340} height={414} style={{ borderRadius: 36, objectFit: "cover" }} />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist Mono", data: mono, style: "normal", weight: 600 },
        { name: "Geist", data: sans, style: "normal", weight: 400 },
      ],
    },
  );
}
