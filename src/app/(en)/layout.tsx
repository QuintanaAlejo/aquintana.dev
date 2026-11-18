import type { ReactNode } from "react";
import "../globals.css";
import { en } from "@/content/en";
import { RootDocument, buildMetadata } from "@/components/RootDocument";

export { viewport } from "@/components/RootDocument";
export const metadata = buildMetadata(en);

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument t={en}>{children}</RootDocument>;
}
