import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import { RECURSOS } from "@/lib/recursos-config";
import { Container } from "@/components/layout/container";
import { RecursoCard } from "@/components/recursos/recurso-card";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Recursos y Modelos Legales Gratuitos | ${siteConfig.studioName}`,
  description:
    "Descargá gratis guías y modelos jurídicos: poder general, carta documento laboral, guía de despido y guía de sucesión en Mendoza. Sin cargo. Sin spam.",
  keywords: [
    "modelos legales gratis Argentina",
    "guia juridica gratuita",
    "modelo poder general",
    "carta documento laboral modelo",
    "guia despido sin causa",
    "sucesion Mendoza guia",
    "recursos juridicos San Rafael",
  ],
  openGraph: {
    title: "Recursos y Modelos Legales Gratuitos — Estudio De Luca",
    description:
      "Cuatro documentos jurídicos gratuitos: modelos editables y guías prácticas para conocer tus derechos antes de la consulta.",
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.siteUrl}/recursos`,
  },
};

// ─── Schema.org ───────────────────────────────────────────────────────────────

function SchemaOrgRecursos() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Recursos Jurídicos Gratuitos — Estudio De Luca",
    description:
      "Modelos y guías jurídicas gratuitas para conocer tus derechos antes de la consulta con el Dr. Pablo De Luca en San Rafael, Mendoza.",
    numberOfItems: RECURSOS.length,
    itemListElement: RECURSOS.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.titulo,
      url: `${siteConfig.siteUrl}/recursos/${r.slug}`,
      description: r.descripcion,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RecursosPage() {
  return (
    <>
      <SchemaOrgRecursos />

      {/* Hero */}
      <section
        aria-labelledby="recursos-heading"
        style={{
          background: "linear-gradient(160deg, var(--color-marino) 0%, #1E3A6E 100%)",
          paddingTop: "120px",
          paddingBottom: "64px",
        }}
      >
        <Container>
          <div className="flex flex-col items-center text-center gap-4 max-w-[680px] mx-auto">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-ui text-xs font-semibold tracking-[0.08em] uppercase"
              style={{
                background: "rgba(201,169,97,0.15)",
                color: "var(--color-dorado)",
                border: "1px solid rgba(201,169,97,0.3)",
              }}
            >
              Centro de recursos
            </span>

            <h1
              id="recursos-heading"
              className="font-serif font-semibold text-bg leading-tight"
              style={{ fontSize: "clamp(1.75rem, 1rem + 3vw, 3rem)" }}
            >
              Documentos y guías jurídicas gratuitas
            </h1>

            <p
              className="font-body text-[rgba(250,247,242,0.75)] leading-relaxed"
              style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.5vw, 1.1rem)" }}
            >
              Modelos editables y guías prácticas para que llegues a la consulta con la información
              esencial. Sin costo. Sin spam.
            </p>
          </div>
        </Container>
      </section>

      {/* Grid de recursos */}
      <section
        aria-label="Recursos disponibles para descarga"
        style={{
          background: "var(--color-bg-warm)",
          paddingTop: "64px",
          paddingBottom: "96px",
        }}
      >
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {RECURSOS.map((recurso) => (
              <RecursoCard key={recurso.slug} recurso={recurso} />
            ))}
          </div>

          {/* Nota legal */}
          <div
            className="mt-12 px-6 py-5 rounded-[8px] border"
            style={{
              background: "var(--color-bg-secondary)",
              borderColor: "var(--color-border-default)",
            }}
          >
            <p className="font-body text-sm text-text-secondary text-center leading-relaxed max-w-[600px] mx-auto">
              <strong className="font-semibold text-carbon">Aviso legal:</strong> Los documentos son
              orientativos y no reemplazan el asesoramiento jurídico profesional. Cada caso tiene
              sus particularidades.{" "}
              <a
                href="/reservar"
                className="text-marino underline underline-offset-2 decoration-dorado hover:decoration-2 transition-all duration-150"
              >
                Reservá una consulta
              </a>{" "}
              para un análisis preciso de tu situación.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
