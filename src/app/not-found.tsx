import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Página no encontrada | ${siteConfig.studioNameShort}`,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Monogram decorativo */}
      <div
        className="w-20 h-20 rounded-full border-2 flex items-center justify-center mb-8 text-2xl font-bold tracking-widest select-none"
        style={{
          borderColor: "var(--color-dorado)",
          color: "var(--color-dorado)",
          fontFamily: "var(--font-playfair)",
        }}
        aria-hidden="true"
      >
        {siteConfig.monogram}
      </div>

      {/* Código de error */}
      <p
        className="text-sm tracking-[0.3em] uppercase mb-4 font-medium"
        style={{ color: "var(--color-dorado)" }}
      >
        Error 404
      </p>

      {/* Título */}
      <h1
        className="text-4xl md:text-5xl font-bold text-center mb-6 leading-tight"
        style={{
          color: "var(--color-marino)",
          fontFamily: "var(--font-playfair)",
        }}
      >
        Página no encontrada
      </h1>

      {/* Línea decorativa */}
      <div
        className="w-16 h-0.5 mb-8"
        style={{ backgroundColor: "var(--color-dorado)" }}
        aria-hidden="true"
      />

      {/* Mensaje */}
      <p
        className="text-center max-w-md text-lg leading-relaxed mb-10"
        style={{ color: "var(--color-carbon-muted, #4A4A4A)" }}
      >
        La página que buscás no existe o fue movida. Podés volver al inicio o reservar una consulta
        directamente.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 rounded font-semibold text-white transition-colors duration-200"
          style={{ backgroundColor: "var(--color-marino)" }}
        >
          Volver al inicio
        </Link>
        <Link
          href="/reservar"
          className="inline-flex items-center justify-center px-8 py-3 rounded font-semibold transition-colors duration-200 border"
          style={{
            borderColor: "var(--color-dorado)",
            color: "var(--color-dorado)",
          }}
        >
          Reservar consulta
        </Link>
      </div>

      {/* Footer mínimo */}
      <p className="mt-16 text-sm" style={{ color: "var(--color-carbon-muted, #8a8a8a)" }}>
        {siteConfig.studioName} · {siteConfig.city}, {siteConfig.province}
      </p>
    </div>
  );
}
