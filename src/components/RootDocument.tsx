import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { Dictionary } from "@/content/types";
import { EMAIL, GOOGLE_SITE_VERIFICATION, LINKEDIN_URL, SITE_URL } from "@/lib/site";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

/**
 * Runs before first paint: restores a theme picked earlier in this same visit
 * (sessionStorage, so it never carries over to a later visit) and enables the
 * scroll animations only when the OS does not ask for reduced motion.
 */
const bootScript = `(function(){var d=document.documentElement;try{var t=sessionStorage.getItem("aq-theme");if(t==="light"||t==="dark")d.setAttribute("data-theme",t)}catch(e){}try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("aq-motion")}catch(e){}})();`;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#D8D8D5" },
    { media: "(prefers-color-scheme: dark)", color: "#17181A" },
  ],
};

export function buildMetadata(t: Dictionary): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: "Alejo Quintana",
    authors: [{ name: "Alejo Quintana", url: SITE_URL }],
    alternates: {
      canonical: t.path,
      languages: { es: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: t.path,
      siteName: "Alejo Quintana",
      title: t.meta.title,
      description: t.meta.description,
      locale: t.ogLocale,
      alternateLocale: t.locale === "es" ? ["en_US"] : ["es_AR"],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
    robots: { index: true, follow: true },
    verification: { google: GOOGLE_SITE_VERIFICATION },
  };
}

export function RootDocument({ t, children }: { t: Dictionary; children: ReactNode }) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alejo Quintana",
    url: t.locale === "es" ? SITE_URL : `${SITE_URL}/en`,
    jobTitle: t.locale === "es" ? "Ingeniero de software" : "Software Engineer",
    email: `mailto:${EMAIL}`,
    sameAs: [LINKEDIN_URL],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Universidad Nacional del Sur" },
  };

  return (
    <html lang={t.locale} className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router root layout */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
