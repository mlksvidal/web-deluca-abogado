import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { TriajeWizard } from "@/components/triage/triage-wizard";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: `Consulta rápida por WhatsApp | ${siteConfig.studioName}`,
  description:
    "Describí tu caso en 3 pasos y recibí un mensaje pre-armado para coordinar una entrevista con el Dr. De Luca vía WhatsApp.",
  robots: { index: false, follow: false },
};

/**
 * /consultar — Versión full-page del TriajeWizard.
 * Sin header fijo encima para no distraer del wizard.
 */
export default function ConsultarPage() {
  return (
    <main id="main-content">
      <section
        aria-labelledby="consultar-heading"
        style={{
          paddingTop: "140px",
          paddingBottom: "80px",
          background: "var(--color-bg-warm, #F2EBDE)",
          minHeight: "100vh",
        }}
      >
        <Container size="narrow">
          <h1 id="consultar-heading" className="sr-only">
            Consulta rápida por WhatsApp — {siteConfig.studioName}
          </h1>
        </Container>
        <TriajeWizard />
      </section>

      <style>{`
        .sr-only {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </main>
  );
}
