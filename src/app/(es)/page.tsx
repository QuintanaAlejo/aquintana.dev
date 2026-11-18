import { Site } from "@/components/Site";
import { cvAvailability } from "@/lib/cv";

export default function Page() {
  return <Site initialLocale="es" cv={cvAvailability()} />;
}
