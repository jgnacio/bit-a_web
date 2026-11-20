import { Bricolage_Grotesque, Geist_Mono, Manrope } from "next/font/google";

/**
 * Display face. Variable: the weight axis covers 200-800 and the optical size
 * axis gives large headlines the tighter cut (`font-optical-sizing: auto`,
 * the browser default).
 */
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bricolage",
});

/** Body and controls. Variable, 200-800. */
export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

/** Technical data: state, format, platform. */
export const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const fontVariables = `${bricolage.variable} ${manrope.variable} ${geistMono.variable}`;
