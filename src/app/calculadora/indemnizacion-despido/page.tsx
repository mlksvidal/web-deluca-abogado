import type { Metadata } from "next";
import { Scale } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/layout/container";
import { FormIndemnizacionDespido } from "./form";

export const metadata: Metadata = {
  title: `Calculadora Indemnización por Despido | ${siteConfig.studioName}`,
  description:
    "Calculá gratis tu indemnización por despido según la Ley de Contrato de Trabajo argentina. Arts. 245, 232, 233 y multa art. 80. Resultado inmediato.",
  keywords: [
    "calculadora indemnización despido",
    "cuánto me corresponde despido",
    "art 245 LCT",
    "liquidación final",
    "indemnización laboral Argentina",
  ],
  openGraph: {
    title: "Calculadora de Indemnización por Despido — Estudio De Luca",
    description:
      "Estimá tu indemnización por despido sin cargo. Ley 20.744. Arts. 245, 232, 233 y multa art. 80.",
    type: "website",
  },
  other: {
    // Schema.org SoftwareApplication via JSON-LD — se inyecta en el script abajo
  },
};

export default function IndemnizacionDespidoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Calculadora de Indemnización por Despido",
    applicationCategory: "LegalService",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ARS",
    },
    description:
      "Calculá tu indemnización por despido según la Ley de Contrato de Trabajo argentina (arts. 245, 232, 233 y multa art. 80). Resultado inmediato y gratuito.",
    provider: {
      "@type": "LegalService",
      name: siteConfig.studioName,
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.city,
        addressRegion: siteConfig.province,
        addressCountry: "AR",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content">
        {/* Hero pequeño */}
        <section
          aria-labelledby="calc-despido-heading"
          className="border-b border-[var(--color-border-default)]"
          style={{
            background: "linear-gradient(160deg, var(--color-marino) 0%, #1E3A6E 100%)",
            paddingTop: "120px",
            paddingBottom: "56px",
          }}
        >
          <Container size="narrow">
            <div className="flex flex-col items-center text-center gap-4">
              {/* Kicker */}
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-ui text-xs font-semibold tracking-[0.08em] uppercase"
                  style={{
                    background: "rgba(201,169,97,0.15)",
                    color: "var(--color-dorado)",
                    border: "1px solid rgba(201,169,97,0.3)",
                  }}
                >
                  <Scale size={12} aria-hidden="true" />
                  Calculadora gratuita
                </span>
              </div>

              <h1
                id="calc-despido-heading"
                className="font-serif font-semibold text-[var(--color-bg)] leading-tight"
                style={{ fontSize: "clamp(1.75rem, 1.25rem + 2.5vw, 2.75rem)" }}
              >
                Calculadora de Indemnización por Despido
              </h1>

              <p
                className="font-body text-[rgba(250,247,242,0.75)] leading-relaxed max-w-[560px]"
                style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.5vw, 1.1rem)" }}
              >
                Ingresá tus datos y obtené una estimación orientativa de tu indemnización según la
                Ley de Contrato de Trabajo (arts.&nbsp;245, 232, 233 y multa art.&nbsp;80).
              </p>
            </div>
          </Container>
        </section>

        {/* Form + resultado */}
        <section
          aria-label="Formulario de cálculo"
          style={{
            background: "var(--color-bg-warm)",
            paddingTop: "48px",
            paddingBottom: "80px",
          }}
        >
          <Container size="narrow">
            <div
              className="bg-[var(--color-bg)] rounded-[10px] shadow-[var(--shadow-lg)] overflow-hidden"
              style={{ border: "1px solid var(--color-border-default)" }}
            >
              <div className="px-6 py-6 sm:px-8 sm:py-8">
                <FormIndemnizacionDespido />
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
