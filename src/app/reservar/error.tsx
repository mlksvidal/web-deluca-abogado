"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ReservarError({ error, reset }: ErrorProps) {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <p
        className="text-sm tracking-widest uppercase mb-4"
        style={{ color: "var(--color-dorado)" }}
      >
        Error en el sistema de turnos
      </p>
      <h1
        className="text-2xl md:text-3xl font-bold text-center mb-4"
        style={{ color: "var(--color-marino)", fontFamily: "var(--font-playfair)" }}
      >
        No pudimos cargar el sistema de reservas
      </h1>
      <p className="text-center mb-8 max-w-md" style={{ color: "#4A4A4A" }}>
        Ocurrió un problema al cargar el formulario. Podés intentar de nuevo o contactarnos
        directamente por WhatsApp para coordinar tu turno.
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
          href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hola, quiero reservar un turno.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded font-semibold border text-center"
          style={{ borderColor: "var(--color-dorado)", color: "var(--color-dorado)" }}
        >
          Reservar por WhatsApp
        </a>
      </div>
    </div>
  );
}
