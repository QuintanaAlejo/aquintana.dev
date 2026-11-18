import { es } from "@/content/es";
import { ogSize, renderOg } from "@/lib/og/render";

export const alt = es.meta.ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg(es);
}
