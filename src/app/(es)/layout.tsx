import type { ReactNode } from "react";
import "../globals.css";
import { es } from "@/content/es";
import { RootDocument, buildMetadata } from "@/components/RootDocument";

export { viewport } from "@/components/RootDocument";
export const metadata = buildMetadata(es);

export default function SpanishLayout({ children }: { children: ReactNode }) {
  return <RootDocument t={es}>{children}</RootDocument>;
}
