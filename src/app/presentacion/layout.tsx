import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-pres-grotesk",
  adjustFontFallback: true,
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-pres-manrope",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Presentación de la solución · Estudio De Luca",
  description:
    "Resumen ejecutivo de la plataforma web desarrollada para el Estudio Jurídico Dr. Pablo De Luca.",
  robots: { index: false, follow: false, nocache: true },
};

export default function PresentacionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${spaceGrotesk.variable} ${manrope.variable}`} style={{ contain: "layout" }}>
      {children}
    </div>
  );
}
