"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * global-error.tsx — Captura errores en el root layout (incluyendo el layout mismo).
 * Debe incluir <html> y <body> propios ya que reemplaza el root layout completo.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", { digest: error.digest, name: error.name });
  }, [error]);

  return (
    <html lang="es-AR" dir="ltr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF7F2",
          fontFamily: "Georgia, serif",
          padding: "24px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#C9A961",
            marginBottom: "16px",
          }}
        >
          Error crítico
        </p>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: "700",
            color: "#0F1E3D",
            textAlign: "center",
            marginBottom: "16px",
            lineHeight: 1.2,
          }}
        >
          Algo salió mal
        </h1>
        <p
          style={{
            color: "#4A4A4A",
            textAlign: "center",
            maxWidth: "440px",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          Ocurrió un error inesperado. Por favor recargá la página o contactanos por WhatsApp si el
          problema persiste.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              padding: "12px 32px",
              backgroundColor: "#0F1E3D",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            Reintentar
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              padding: "12px 32px",
              border: "1px solid #C9A961",
              color: "#C9A961",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            Volver al inicio
          </a>
        </div>
      </body>
    </html>
  );
}
