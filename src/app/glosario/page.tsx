import type { Metadata } from "next";

// Revalidar cada hora — SSG con ISR para SEO masivo
export const revalidate = 3600;

import { listTerminos } from "@/app/actions/glosario";
import { Container } from "@/components/layout/container";
import { GlosarioClient } from "@/components/glossary/glosario-client";
import { siteConfig } from "@/lib/site-config";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Glosario Jurídico A-Z | ${siteConfig.studioName}`,
  description:
    "Diccionario jurídico argentino con más de 30 términos legales explicados en lenguaje claro. Ideal para entender sus derechos antes de una consulta con un abogado.",
  keywords: [
    "glosario jurídico argentino",
    "términos legales Argentina",
    "diccionario derecho laboral",
    "vocabulario legal civil",
    "qué es prescripción",
    "qué es indemnización",
    "abogado San Rafael Mendoza",
  ],
  alternates: { canonical: `${siteConfig.siteUrl}/glosario` },
  openGraph: {
    title: "Glosario Jurídico A-Z — Estudio De Luca",
    description:
      "Términos jurídicos explicados en lenguaje claro. Laboral, Civil, Penal y Comercial.",
    type: "website",
    url: `${siteConfig.siteUrl}/glosario`,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ─── Schema.org ───────────────────────────────────────────────────────────────

function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${siteConfig.siteUrl}/glosario`,
    name: "Glosario Jurídico — Estudio De Luca",
    description:
      "Diccionario de términos jurídicos del derecho argentino explicados en lenguaje claro.",
    url: `${siteConfig.siteUrl}/glosario`,
    publisher: {
      "@type": "LegalService",
      name: siteConfig.studioName,
      url: siteConfig.siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Breadcrumb Schema ────────────────────────────────────────────────────────

function BreadcrumbSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: siteConfig.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Glosario Jurídico",
        item: `${siteConfig.siteUrl}/glosario`,
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

export default async function GlosarioPage() {
  // Carga todos los términos publicados (sin paginación — SSG/cache)
  const result = await listTerminos({ pageSize: 200 });
  const terminos = result.success ? result.data.items : [];

  // Letras que tienen al menos un término
  const letrasConTerminos = new Set(terminos.map((t) => t.letra.toUpperCase()));

  return (
    <>
      <SchemaOrg />
      <BreadcrumbSchema />

      {/* ─── Hero de sección ──────────────────────────────────────── */}
      <section
        className="pt-28 pb-12 border-b border-[var(--color-border-default)]"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <Container>
          {/* Kicker */}
          <p
            className="font-ui text-xs font-600 tracking-[0.12em] uppercase mb-4"
            style={{ color: "var(--color-dorado-deep)" }}
          >
            Glosario jurídico A-Z
          </p>

          <h1 className="font-serif text-[var(--text-4xl)] font-600 text-[var(--color-marino)] leading-tight mb-4 max-w-2xl">
            Términos legales en lenguaje claro
          </h1>

          <p className="font-body text-base text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
            El derecho tiene su propio vocabulario. Acá encontrás los términos más frecuentes del
            derecho laboral, civil, penal y comercial argentino — explicados sin tecnicismos.
          </p>
        </Container>
      </section>

      {/* ─── Glosario interactivo ─────────────────────────────────── */}
      <section className="py-12">
        <Container>
          <GlosarioClient
            terminos={terminos}
            letrasConTerminos={letrasConTerminos}
            allLetters={ALL_LETTERS}
          />
        </Container>
      </section>

      {/* ─── CTA footer ───────────────────────────────────────────── */}
      <section
        className="py-14 border-t border-[var(--color-border-default)]"
        style={{ background: "var(--color-bg-warm)" }}
      >
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <p className="font-serif text-xl font-500 text-[var(--color-marino)] mb-3">
              ¿Necesitás más que una definición?
            </p>
            <p className="font-body text-sm text-[var(--color-text-secondary)] mb-6">
              Cada caso es distinto. Un análisis profesional puede marcar la diferencia.
            </p>
            <a
              href="/reservar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[6px] font-ui text-sm font-600 transition-all duration-250 hover:-translate-y-[2px] focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-2"
              style={{
                background: "var(--color-marino)",
                color: "var(--color-bg)",
              }}
            >
              Reservar consulta
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
