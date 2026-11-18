import { Bricolage_Grotesque } from "next/font/google";

/**
 * Display face. Variable font: the weight axis covers 200-800, and the optical
 * size axis makes large headlines pick the tighter, more characterful cut
 * (`font-optical-sizing: auto`, which is the browser default).
 */
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bricolage",
});
