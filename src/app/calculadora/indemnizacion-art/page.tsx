import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/layout/container";
import { FormIndemnizacionART } from "./form";

export const metadata: Metadata = {
  title: `Calculadora Indemnización ART — Accidente Laboral | ${siteConfig.studioName}`,
  description:
    "Calculá tu indemnización por accidente de trabajo o enfermedad profesional según la Ley 24.557 y Ley 26.773. Resultado inmediato y gratuito.",
  keywords: [
    "calculadora ART Argentina",
    "indemnización accidente trabajo",
    "Ley 24557",
    "Ley 26773",
    "incapacidad laboral permanente",
    "in itinere indemnización",
  ],
  openGraph: {
    title: "Calculadora de Indemnización ART — Estudio De Luca",
    description:
      "Estimá tu indemnización por accidente de trabajo o enfermedad profesional. Ley 24.557 + Ley 26.773. Gratuito.",
    type: "website",
  },
};

export default function IndemnizacionARTPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Calculadora de Indemnización ART",
    applicationCategory: "LegalService",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ARS",
    },
    description:
      "Calculá la indemnización por incapacidad permanente parcial según la Ley 24.557 (Riesgos del Trabajo) y Ley 26.773. Considera accidentes laborales, in itinere y enfermedades profesionales.",
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
          aria-labelledby="calc-art-heading"
          className="border-b border-[var(--color-border-default)]"
          style={{
            background: "linear-gradient(160deg, var(--color-marino) 0%, #1E3A6E 100%)",
            paddingTop: "120px",
            paddingBottom: "56px",
          }}
        >
          <Container size="narrow">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-ui text-xs font-semibold tracking-[0.08em] uppercase"
                  style={{
                    background: "rgba(201,169,97,0.15)",
                    color: "var(--color-dorado)",
                    border: "1px solid rgba(201,169,97,0.3)",
                  }}
                >
                  <ShieldAlert size={12} aria-hidden="true" />
                  Calculadora gratuita
                </span>
              </div>

              <h1
                id="calc-art-heading"
                className="font-serif font-semibold text-[var(--color-bg)] leading-tight"
                style={{ fontSize: "clamp(1.75rem, 1.25rem + 2.5vw, 2.75rem)" }}
              >
                Calculadora de Indemnización ART
              </h1>

              <p
                className="font-body text-[rgba(250,247,242,0.75)] leading-relaxed max-w-[560px]"
                style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.5vw, 1.1rem)" }}
              >
                Estimá tu indemnización por accidente de trabajo, accidente in itinere o enfermedad
                profesional según la Ley 24.557 y Ley 26.773.
              </p>
            </div>
          </Container>
        </section>

        {/* Form + resultado */}
        <section
          aria-label="Formulario de cálculo ART"
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
                <FormIndemnizacionART />
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
