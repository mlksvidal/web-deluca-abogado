import type { Metadata } from "next";
import { Heart } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/layout/container";
import { FormCuotaAlimentaria } from "./form";

export const metadata: Metadata = {
  title: `Calculadora Cuota Alimentaria | ${siteConfig.studioName}`,
  description:
    "Estimá la cuota alimentaria según criterios jurisprudenciales argentinos. Resultado orientativo gratuito basado en sueldo, cantidad e edades de los hijos.",
  keywords: [
    "calculadora cuota alimentaria Argentina",
    "cuánto debo pagar de alimentos",
    "porcentaje cuota alimentaria",
    "juicio de alimentos Mendoza",
    "derecho de familia",
  ],
  openGraph: {
    title: "Calculadora de Cuota Alimentaria — Estudio De Luca",
    description:
      "Estimación orientativa de cuota alimentaria según criterios de las cámaras de familia argentinas. Gratuito e inmediato.",
    type: "website",
  },
};

export default function CuotaAlimentariaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Calculadora de Cuota Alimentaria",
    applicationCategory: "LegalService",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ARS",
    },
    description:
      "Estimá la cuota alimentaria mensual según criterios jurisprudenciales argentinos. Tiene en cuenta sueldo del obligado, cantidad de hijos, edades y otras obligaciones alimentarias.",
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
          aria-labelledby="calc-alim-heading"
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
                  <Heart size={12} aria-hidden="true" />
                  Calculadora gratuita
                </span>
              </div>

              <h1
                id="calc-alim-heading"
                className="font-serif font-semibold text-[var(--color-bg)] leading-tight"
                style={{ fontSize: "clamp(1.75rem, 1.25rem + 2.5vw, 2.75rem)" }}
              >
                Calculadora de Cuota Alimentaria
              </h1>

              <p
                className="font-body text-[rgba(250,247,242,0.75)] leading-relaxed max-w-[560px]"
                style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.5vw, 1.1rem)" }}
              >
                Estimá la cuota alimentaria mensual según los criterios jurisprudenciales de los
                tribunales de familia argentinos. Resultado orientativo e inmediato.
              </p>
            </div>
          </Container>
        </section>

        {/* Form + resultado */}
        <section
          aria-label="Formulario de cálculo alimentario"
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
                <FormCuotaAlimentaria />
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
