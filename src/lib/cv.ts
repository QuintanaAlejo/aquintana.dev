import { existsSync } from "node:fs";
import { join } from "node:path";
import { en } from "@/content/en";
import { es } from "@/content/es";
import type { Locale } from "@/content/types";

/**
 * Which languages have their CV PDF in /public. Checked at build time, so the
 * download buttons appear on their own once a file is added and deployed.
 */
export function cvAvailability(): Record<Locale, boolean> {
  const has = (href: string) => existsSync(join(process.cwd(), "public", href));
  return { es: has(es.cv.href), en: has(en.cv.href) };
}
