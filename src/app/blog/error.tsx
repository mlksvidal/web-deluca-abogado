"use client";

import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function BlogError({ error, reset }: ErrorProps) {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <p
        className="text-sm tracking-widest uppercase mb-4"
        style={{ color: "var(--color-dorado)" }}
      >
        Error al cargar
      </p>
      <h1
        className="text-2xl font-bold text-center mb-4"
        style={{ color: "var(--color-marino)", fontFamily: "var(--font-playfair)" }}
      >
        No pudimos cargar los artículos
      </h1>
      <p className="text-center mb-8 max-w-sm" style={{ color: "#4A4A4A" }}>
        Ocurrió un problema al obtener los artículos. Intentá de nuevo en unos momentos.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded font-medium text-white"
          style={{ backgroundColor: "var(--color-marino)" }}
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 rounded font-medium border"
          style={{ borderColor: "var(--color-dorado)", color: "var(--color-dorado)" }}
        >
          Inicio
        </Link>
      </div>
    </div>
  );
}
