import { en } from "@/content/en";
import { ogSize, renderOg } from "@/lib/og/render";

export const alt = en.meta.ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg(en);
}
