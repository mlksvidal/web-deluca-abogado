import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { TimelineDivorcio } from "@/components/process/timeline-divorcio";
import { HITOS_DIVORCIO } from "@/lib/timeline-divorcio-config";
import { siteConfig } from "@/lib/site-config";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Proceso de divorcio en Argentina paso a paso | ${siteConfig.studioName}`,
  description:
    "Guía completa del proceso de divorcio en Argentina: mediación, demanda, convenio regulador, sentencia e inscripción registral. 8 pasos explicados claramente.",
  keywords: [
    "proceso divorcio Argentina",
    "cómo divorciarse en Argentina",
    "divorcio vincular Mendoza",
    "cuánto tarda un divorcio",
    "abogado divorcio San Rafael",
    "divorcio por presentación conjunta",
    "convenio regulador divorcio",
  ],
  alternates: { canonical: `${siteConfig.siteUrl}/proceso/divorcio` },
  openGraph: {
    title: "Proceso de divorcio en Argentina paso a paso — Estudio De Luca",
    description:
      "8 etapas del divorcio en Argentina con duración estimada. Guía legal gratuita del Estudio De Luca, San Rafael, Mendoza.",
    type: "article",
    url: `${siteConfig.siteUrl}/proceso/divorcio`,
  },
};

// ─── Schema HowTo ─────────────────────────────────────────────────────────────

function HowToSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${siteConfig.siteUrl}/proceso/divorcio`,
    name: "Proceso de divorcio en Argentina paso a paso",
    description:
      "Guía completa del proceso de divorcio en Argentina, desde la consulta inicial hasta la inscripción registral.",
    totalTime: "PT3M", // mínimo, puede extenderse
    tool: [
      {
        "@type": "HowToTool",
        name: "Abogado especialista en derecho de familia",
      },
    ],
    step: HITOS_DIVORCIO.map((hito) => ({
      "@type": "HowToStep",
      name: hito.titulo,
      text: hito.descripcion,
      position: hito.numero,
    })),
    provider: {
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

function BreadcrumbSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: siteConfig.siteUrl },
      { "@type": "ListItem", position: 2, name: "Proceso", item: `${siteConfig.siteUrl}/proceso` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Divorcio paso a paso",
        item: `${siteConfig.siteUrl}/proceso/divorcio`,
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

export default function ProcesoDivorcioPage() {
  return (
    <>
      <HowToSchema />
      <BreadcrumbSchema />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
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
            Guía jurídica
          </p>

          <h1 className="font-serif text-[var(--text-4xl)] font-600 text-[var(--color-marino)] leading-tight mb-4">
            Así es un divorcio en Argentina paso a paso
          </h1>

          <p className="font-body text-base text-[var(--color-text-secondary)] leading-relaxed max-w-lg mb-6">
            Desde la consulta inicial hasta la inscripción registral — cada etapa del proceso de
            divorcio explicada de forma clara, con duración estimada.
          </p>

          {/* Resumen rápido */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              `${HITOS_DIVORCIO.length} etapas del proceso`,
              "Duración estimada en cada paso",
              "Basado en legislación vigente",
              "Aplica a Mendoza y resto del país",
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

      {/* ─── Disclaimer ───────────────────────────────────────────── */}
      <div
        className="py-3 border-b border-[var(--color-border-default)]"
        style={{ background: "rgba(180,83,9,0.04)" }}
      >
        <Container size="narrow">
          <p className="font-ui text-xs text-[#92400E] text-center">
            Esta guía es orientativa. Los tiempos y pasos pueden variar según el juzgado, la
            complejidad del caso y el acuerdo entre las partes. Consultá siempre con un abogado.
          </p>
        </Container>
      </div>

      {/* ─── Timeline ─────────────────────────────────────────────── */}
      <section className="py-14 pb-20">
        <Container size="narrow">
          <TimelineDivorcio hitos={HITOS_DIVORCIO} />
        </Container>
      </section>

      {/* ─── FAQ rápido ───────────────────────────────────────────── */}
      <section
        className="py-12 border-t border-[var(--color-border-default)]"
        style={{ background: "var(--color-bg-warm)" }}
      >
        <Container size="narrow">
          <h2 className="font-serif text-2xl font-500 text-[var(--color-marino)] mb-8 text-center">
            Preguntas frecuentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "¿Cuánto tarda un divorcio en Argentina?",
                a: "En general, un divorcio de mutuo acuerdo sin conflictos tarda entre 3 y 6 meses. Si hay desacuerdo sobre los bienes, los hijos o los alimentos, puede extenderse de 1 a 3 años.",
              },
              {
                q: "¿Necesito alegar una causa para divorciarme?",
                a: "No. Desde el Código Civil y Comercial de 2015 (art. 437), el divorcio es incausado: cualquiera de los cónyuges puede pedirlo sin necesidad de alegar una razón.",
              },
              {
                q: "¿Qué es el convenio regulador?",
                a: "Es el acuerdo donde las partes establecen cómo se van a resolver las cuestiones derivadas del divorcio: cuidado de los hijos, alimentos, atribución del hogar y división de bienes. Si no hay acuerdo, lo decide el juez.",
              },
              {
                q: "¿Puedo divorciarme si no sé dónde está mi cónyuge?",
                a: "Sí. Existe el procedimiento de citación por edictos para cónyuge en paradero desconocido. El proceso es más largo, pero es posible.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="border-b border-[var(--color-border-default)] pb-5 last:border-0 last:pb-0"
              >
                <h3 className="font-ui text-sm font-600 text-[var(--color-marino)] mb-2">{q}</h3>
                <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── CTA final ────────────────────────────────────────────── */}
      <section
        className="py-14 border-t border-[var(--color-border-default)]"
        style={{ background: "var(--color-marino)" }}
      >
        <Container size="narrow">
          <div className="text-center">
            <p
              className="font-ui text-xs font-600 tracking-[0.12em] uppercase mb-3"
              style={{ color: "var(--color-dorado)" }}
            >
              Consultá con un especialista
            </p>
            <h2 className="font-serif text-2xl font-500 text-[var(--color-bg)] mb-3">
              ¿Empezás un proceso de divorcio?
            </h2>
            <p
              className="font-body text-sm mb-8 max-w-sm mx-auto"
              style={{ color: "rgba(250,247,242,0.65)" }}
            >
              Cada situación familiar es única. Reservá una consulta y analizamos tu caso en detalle
              con el Dr. Pablo De Luca.
            </p>
            <a
              href="/reservar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[6px] font-ui text-sm font-600 transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[0_4px_20px_rgba(201,169,97,0.3)] focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-2"
              style={{ background: "var(--color-dorado)", color: "var(--color-marino)" }}
            >
              Reservar una consulta →
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
