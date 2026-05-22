"use client";

import { useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log estructurado — sin exponer detalles al usuario
    console.error("[Error Boundary]", {
      digest: error.digest,
      name: error.name,
      // No loguear el message completo (puede contener PII o stack info)
    });
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Ícono de alerta */}
      <div
        className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-8 text-2xl select-none"
        style={{
          borderColor: "var(--color-dorado)",
          color: "var(--color-dorado)",
        }}
        aria-hidden="true"
      >
        !
      </div>

      {/* Código */}
      <p
        className="text-sm tracking-[0.3em] uppercase mb-4 font-medium"
        style={{ color: "var(--color-dorado)" }}
      >
        Error inesperado
      </p>

      {/* Título */}
      <h1
        className="text-3xl md:text-4xl font-bold text-center mb-6 leading-tight"
        style={{
          color: "var(--color-marino)",
          fontFamily: "var(--font-playfair)",
        }}
      >
        Algo no salió como esperábamos
      </h1>

      {/* Línea decorativa */}
      <div
        className="w-16 h-0.5 mb-8"
        style={{ backgroundColor: "var(--color-dorado)" }}
        aria-hidden="true"
      />

      {/* Mensaje */}
      <p
        className="text-center max-w-md text-base leading-relaxed mb-10"
        style={{ color: "var(--color-carbon-muted, #4A4A4A)" }}
      >
        Ocurrió un error en esta página. Por favor intentá de nuevo. Si el problema persiste,
        contactanos por WhatsApp.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-8 py-3 rounded font-semibold text-white transition-colors duration-200"
          style={{ backgroundColor: "var(--color-marino)" }}
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 rounded font-semibold transition-colors duration-200 border"
          style={{
            borderColor: "var(--color-dorado)",
            color: "var(--color-dorado)",
          }}
        >
          Volver al inicio
        </Link>
      </div>

      {/* WhatsApp fallback */}
      <a
        href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hola, necesito ayuda con el sitio web.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 text-sm underline underline-offset-4"
        style={{ color: "var(--color-dorado)" }}
      >
        Contactar por WhatsApp
      </a>
    </div>
  );
}
