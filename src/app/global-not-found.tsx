import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { es } from "@/content/es";
import { en } from "@/content/en";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "404 · Alejo Quintana",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <main className="wrap" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
          <span className="label">
            <span className="mark" aria-hidden="true" />
            404
          </span>
          <h1 className="h2" style={{ maxWidth: "20ch" }}>
            {es.notFound.title} <span lang="en" style={{ color: "var(--ink3)" }}>{en.notFound.title}</span>
          </h1>
          <p className="muted" style={{ maxWidth: "52ch" }}>
            {es.notFound.text} <span lang="en">{en.notFound.text}</span>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/" className="btn btn-ink">
              {es.notFound.back}
            </Link>
            <Link href="/en" lang="en" className="btn btn-glass">
              {en.notFound.back}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
