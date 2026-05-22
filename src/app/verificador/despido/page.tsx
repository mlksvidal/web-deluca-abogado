import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { VerificadorDespidoForm } from "@/components/verifier/verificador-despido-form";
import { siteConfig } from "@/lib/site-config";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `¿Tu despido fue legal? Verificador gratuito | ${siteConfig.studioName}`,
  description:
    "Respondé 5 preguntas sobre tu despido y obtené un diagnóstico orientativo: legal, dudoso o ilegal. Herramienta gratuita basada en la LCT argentina.",
  keywords: [
    "verificador despido legal Argentina",
    "mi despido fue legal",
    "despido sin causa LCT",
    "derechos trabajador despedido",
    "abogado laboral San Rafael",
    "indemnización despido ilegal",
  ],
  alternates: { canonical: `${siteConfig.siteUrl}/verificador/despido` },
  openGraph: {
    title: "¿Tu despido fue legal? Verificador gratuito — Estudio De Luca",
    description:
      "5 preguntas. Diagnóstico inmediato: legal, dudoso o ilegal. Basado en la Ley de Contrato de Trabajo argentina.",
    type: "website",
    url: `${siteConfig.siteUrl}/verificador/despido`,
  },
};

// ─── Schema.org ───────────────────────────────────────────────────────────────

function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${siteConfig.siteUrl}/verificador/despido`,
    name: "Verificador de legalidad del despido",
    applicationCategory: "LegalService",
    operatingSystem: "Web",
    url: `${siteConfig.siteUrl}/verificador/despido`,
    description:
      "Verificador gratuito que analiza 5 aspectos clave de tu despido y emite un diagnóstico orientativo según la Ley de Contrato de Trabajo argentina.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ARS",
    },
    provider: {
      "@type": "LegalService",
      name: siteConfig.studioName,
      url: siteConfig.siteUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.city,
        addressRegion: siteConfig.province,
        addressCountry: "AR",
      },
    },
    featureList: [
      "Análisis de tipo de despido",
      "Verificación de preaviso",
      "Evaluación de registro laboral",
      "Diagnóstico en segundos",
      "Sin registro requerido",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: siteConfig.siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Verificador",
        item: `${siteConfig.siteUrl}/verificador`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "¿Tu despido fue legal?",
        item: `${siteConfig.siteUrl}/verificador/despido`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VerificadorDespidoPage() {
  return (
    <>
      <SchemaOrg />
      <BreadcrumbSchema />

      {/* ─── Hero pequeño ─────────────────────────────────────────── */}
      <section
        className="pt-28 pb-10 border-b border-[var(--color-border-default)]"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <Container size="narrow">
          {/* Kicker */}
          <p
            className="font-ui text-xs font-600 tracking-[0.12em] uppercase mb-4"
            style={{ color: "var(--color-dorado-deep)" }}
          >
            Verificador legal gratuito
          </p>

          <h1 className="font-serif text-[var(--text-4xl)] font-600 text-[var(--color-marino)] leading-tight mb-4">
            ¿Tu despido fue legal?
          </h1>

          <p className="font-body text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 max-w-lg">
            Respondé 5 preguntas sobre tu situación y recibí un diagnóstico orientativo basado en la
            Ley de Contrato de Trabajo argentina.
          </p>

          {/* Características del verificador */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              "5 preguntas simples",
              "Resultado inmediato",
              "Completamente gratuito",
              "Sin registro requerido",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 font-ui text-xs text-[var(--color-text-secondary)]"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "var(--color-dorado)" }}
                  aria-hidden="true"
                />
                {item}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Formulario verificador ───────────────────────────────── */}
      <section className="py-12 pb-20">
        <Container size="narrow">
          <VerificadorDespidoForm />
        </Container>
      </section>

      {/* ─── Nota legal al pie ────────────────────────────────────── */}
      <section
        className="py-8 border-t border-[var(--color-border-default)]"
        style={{ background: "var(--color-bg-warm)" }}
      >
        <Container size="narrow">
          <p className="font-ui text-xs text-center text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl mx-auto">
            Esta herramienta es orientativa y no constituye asesoramiento jurídico profesional. Los
            resultados dependen de los datos ingresados por el usuario. Cada caso laboral tiene
            particularidades que solo puede evaluar un abogado. El uso de este verificador no crea
            relación abogado-cliente con el Estudio De Luca.
          </p>
        </Container>
      </section>
    </>
  );
}
