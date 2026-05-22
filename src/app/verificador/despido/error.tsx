"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function VerificadorDespidoError({ error, reset }: ErrorProps) {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <p
        className="text-sm tracking-widest uppercase mb-4"
        style={{ color: "var(--color-dorado)" }}
      >
        Error en el verificador
      </p>
      <h1
        className="text-2xl font-bold text-center mb-4"
        style={{ color: "var(--color-marino)", fontFamily: "var(--font-playfair)" }}
      >
        No pudimos cargar el verificador de despido
      </h1>
      <p className="text-center mb-8 max-w-sm" style={{ color: "#4A4A4A" }}>
        Ocurrió un problema inesperado. Intentá de nuevo o consultá directamente con el Dr. De Luca.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 rounded font-semibold text-white"
          style={{ backgroundColor: "var(--color-marino)" }}
        >
          Reintentar
        </button>
        <a
          href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hola, quiero consultar sobre mi situación laboral.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded font-semibold border text-center"
          style={{ borderColor: "var(--color-dorado)", color: "var(--color-dorado)" }}
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
