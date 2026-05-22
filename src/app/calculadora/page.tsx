import type { Metadata } from "next";
import Link from "next/link";
import { Scale, Heart, ShieldAlert, ChevronRight } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: `Calculadoras Legales Gratuitas | ${siteConfig.studioName}`,
  description:
    "Calculadoras jurídicas gratuitas: indemnización por despido, cuota alimentaria e indemnización por accidente de trabajo. Resultados orientativos e inmediatos.",
  keywords: [
    "calculadora legal Argentina",
    "calculadora indemnización",
    "calculadora cuota alimentaria",
    "calculadora ART",
    "herramientas legales gratuitas",
  ],
  openGraph: {
    title: "Calculadoras Legales Gratuitas — Estudio De Luca",
    description:
      "Tres calculadoras jurídicas gratuitas para conocer tus derechos: despido, alimentos y accidentes laborales.",
    type: "website",
  },
};

// ─── Data ──────────────────────────────────────────────────────────────────

const CALCULADORAS = [
  {
    icon: Scale,
    titulo: "Indemnización por Despido",
    descripcion:
      "Calculá tu indemnización por despido según la Ley de Contrato de Trabajo. Arts. 245, 232, 233 y multa art. 80.",
    href: "/calculadora/indemnizacion-despido",
    area: "Derecho Laboral",
    tiempo: "~2 min",
  },
  {
    icon: Heart,
    titulo: "Cuota Alimentaria",
    descripcion:
      "Estimá la cuota alimentaria mensual según los criterios jurisprudenciales de los tribunales de familia argentinos.",
    href: "/calculadora/cuota-alimentaria",
    area: "Derecho de Familia",
    tiempo: "~2 min",
  },
  {
    icon: ShieldAlert,
    titulo: "Indemnización ART",
    descripcion:
      "Calculá tu indemnización por accidente de trabajo o enfermedad profesional. Ley 24.557 y Ley 26.773.",
    href: "/calculadora/indemnizacion-art",
    area: "Riesgos del Trabajo",
    tiempo: "~2 min",
  },
] as const;

// ─── Card ──────────────────────────────────────────────────────────────────

function CalculadoraCard({
  icon: Icon,
  titulo,
  descripcion,
  href,
  area,
  tiempo,
}: (typeof CALCULADORAS)[number]) {
  return (
    <Link
      href={href}
      className="group block rounded-[10px] overflow-hidden transition-all duration-300 ease-primary focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-3"
      style={{
        border: "1px solid var(--color-border-default)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <article
        className="flex flex-col h-full bg-[var(--color-bg)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lg)] group-hover:border-[var(--color-dorado)]"
        style={{
          borderRadius: "inherit",
        }}
      >
        {/* Icon strip */}
        <div
          className="px-6 pt-8 pb-6"
          style={{
            background: "linear-gradient(135deg, var(--color-marino) 0%, #1E3A6E 100%)",
          }}
        >
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-[8px] mb-4"
            style={{
              background: "rgba(201,169,97,0.15)",
              border: "1px solid rgba(201,169,97,0.30)",
            }}
          >
            <Icon size={24} className="text-[var(--color-dorado)]" aria-hidden="true" />
          </div>

          <div className="flex items-center gap-2">
            <span
              className="font-ui text-xs font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(201,169,97,0.10)",
                color: "var(--color-dorado)",
                border: "1px solid rgba(201,169,97,0.20)",
              }}
            >
              {area}
            </span>
            <span className="font-ui text-xs text-[rgba(250,247,242,0.45)]">{tiempo}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-6 py-5">
          <h2 className="font-serif text-xl font-semibold text-[var(--color-marino)] leading-snug mb-3">
            {titulo}
          </h2>

          <p className="font-body text-sm text-[var(--color-carbon-soft)] leading-relaxed flex-1 mb-5">
            {descripcion}
          </p>

          <div
            className="flex items-center gap-1.5 font-ui text-sm font-medium text-[var(--color-dorado-deep)] transition-gap duration-250"
            aria-hidden="true"
          >
            Usar calculadora
            <ChevronRight
              size={15}
              className="transition-transform duration-250 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function CalculadorasIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Calculadoras Legales — Estudio De Luca",
    description:
      "Calculadoras jurídicas gratuitas para conocer tus derechos laborales y de familia",
    numberOfItems: CALCULADORAS.length,
    itemListElement: CALCULADORAS.map((calc, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: calc.titulo,
      url: `https://deluca-abogado.com.ar${calc.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content">
        {/* Hero */}
        <section
          aria-labelledby="calc-index-heading"
          style={{
            background: "linear-gradient(160deg, var(--color-marino) 0%, #1E3A6E 100%)",
            paddingTop: "120px",
            paddingBottom: "64px",
          }}
        >
          <Container>
            <div className="flex flex-col items-center text-center gap-4 max-w-[700px] mx-auto">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-ui text-xs font-semibold tracking-[0.08em] uppercase"
                style={{
                  background: "rgba(201,169,97,0.15)",
                  color: "var(--color-dorado)",
                  border: "1px solid rgba(201,169,97,0.3)",
                }}
              >
                Herramientas gratuitas
              </span>

              <h1
                id="calc-index-heading"
                className="font-serif font-semibold text-[var(--color-bg)] leading-tight"
                style={{ fontSize: "clamp(1.75rem, 1rem + 3vw, 3rem)" }}
              >
                Calculadoras Legales
              </h1>

              <p
                className="font-body text-[rgba(250,247,242,0.75)] leading-relaxed"
                style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.5vw, 1.1rem)" }}
              >
                Herramientas orientativas para que conozcas tus derechos antes de la consulta. Los
                resultados son estimaciones — cada caso tiene sus particularidades.
              </p>
            </div>
          </Container>
        </section>

        {/* Grid */}
        <section
          aria-label="Listado de calculadoras"
          style={{
            background: "var(--color-bg-warm)",
            paddingTop: "64px",
            paddingBottom: "96px",
          }}
        >
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CALCULADORAS.map((calc) => (
                <CalculadoraCard key={calc.href} {...calc} />
              ))}
            </div>

            {/* Bottom note */}
            <p className="mt-12 text-center font-body text-sm text-[var(--color-text-tertiary)] max-w-[480px] mx-auto">
              Los resultados son estimaciones orientativas. Para un análisis preciso de tu caso,{" "}
              <Link
                href="/reservar"
                className="text-[var(--color-marino)] underline underline-offset-2 decoration-[var(--color-dorado)] hover:decoration-2 transition-all duration-150"
              >
                reservá una consulta
              </Link>
              .
            </p>
          </Container>
        </section>
      </main>
    </>
  );
}
