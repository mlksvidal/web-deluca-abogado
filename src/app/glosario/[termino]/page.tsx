import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronRight } from "lucide-react";

import { getTerminoBySlug, listTerminos } from "@/app/actions/glosario";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/site-config";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General",
};

const AREA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  civil_familia: {
    bg: "rgba(15,30,61,0.06)",
    text: "var(--color-marino)",
    border: "rgba(15,30,61,0.15)",
  },
  laboral: {
    bg: "rgba(201,169,97,0.10)",
    text: "#7A5F1A",
    border: "rgba(201,169,97,0.30)",
  },
  penal: {
    bg: "rgba(169,29,29,0.06)",
    text: "#7A1818",
    border: "rgba(169,29,29,0.15)",
  },
  comercial: {
    bg: "rgba(46,160,67,0.06)",
    text: "#1A5C2A",
    border: "rgba(46,160,67,0.15)",
  },
  general: {
    bg: "rgba(107,114,128,0.08)",
    text: "var(--color-text-secondary)",
    border: "rgba(107,114,128,0.18)",
  },
};

// ─── generateStaticParams — SSG para todas las URLs ───────────────────────────

export async function generateStaticParams() {
  const result = await listTerminos({ pageSize: 200 });
  if (!result.success) return [];
  return result.data.items.map((t) => ({ termino: t.slug }));
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ termino: string }>;
}): Promise<Metadata> {
  const { termino: slug } = await params;
  const result = await getTerminoBySlug(slug);

  if (!result.success) {
    return {
      title: "Término no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const t = result.data;
  const area = t.areaLegal ? (AREA_LABELS[t.areaLegal] ?? "General") : "General";

  return {
    title: `${t.termino} — Glosario Jurídico | ${siteConfig.studioName}`,
    description: t.definicionCorta,
    keywords: [
      t.termino.toLowerCase(),
      ...(t.sinonimos ?? []).map((s) => s.toLowerCase()),
      `qué es ${t.termino.toLowerCase()}`,
      `definición ${t.termino.toLowerCase()} Argentina`,
      `derecho ${area.toLowerCase()}`,
    ],
    alternates: { canonical: `${siteConfig.siteUrl}/glosario/${t.slug}` },
    openGraph: {
      title: `${t.termino} — Definición jurídica`,
      description: t.definicionCorta,
      type: "article",
      url: `${siteConfig.siteUrl}/glosario/${t.slug}`,
    },
  };
}

// ─── Schema ───────────────────────────────────────────────────────────────────

function DefinedTermSchema({
  termino,
}: {
  termino: {
    slug: string;
    termino: string;
    definicionCorta: string;
    areaLegal: string | null;
  };
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${siteConfig.siteUrl}/glosario/${termino.slug}`,
    name: termino.termino,
    description: termino.definicionCorta,
    termCode: termino.slug,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": `${siteConfig.siteUrl}/glosario`,
      name: "Glosario Jurídico — Estudio De Luca",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbSchema({
  slug,
  nombre,
  letra,
}: {
  slug: string;
  nombre: string;
  letra: string;
}) {
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
        name: "Glosario",
        item: `${siteConfig.siteUrl}/glosario`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${letra}`,
        item: `${siteConfig.siteUrl}/glosario?letra=${letra}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: nombre,
        item: `${siteConfig.siteUrl}/glosario/${slug}`,
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

export default async function TerminoPage({ params }: { params: Promise<{ termino: string }> }) {
  const { termino: slug } = await params;
  const result = await getTerminoBySlug(slug);

  if (!result.success) {
    notFound();
  }

  const t = result.data;
  const area = t.areaLegal ?? "general";
  const areaLabel = AREA_LABELS[area] ?? "General";
  const areaColors = AREA_COLORS[area] ?? AREA_COLORS.general;

  // Términos relacionados: array de slugs almacenados
  const relacionados = t.terminosRelacionados ?? [];

  return (
    <>
      <DefinedTermSchema termino={t} />
      <BreadcrumbSchema slug={t.slug} nombre={t.termino} letra={t.letra} />

      {/* ─── Hero editorial ───────────────────────────────────────── */}
      <section
        className="pt-28 pb-10 border-b border-[var(--color-border-default)]"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <Container size="narrow">
          {/* Breadcrumb */}
          <nav aria-label="Ubicación en el sitio" className="mb-6">
            <ol className="flex items-center flex-wrap gap-1 font-ui text-xs text-[var(--color-text-tertiary)]">
              <li>
                <Link
                  href="/glosario"
                  className="hover:text-[var(--color-marino)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)]"
                >
                  Glosario
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} />
              </li>
              <li>
                <Link
                  href={`/glosario?letra=${t.letra}`}
                  className="hover:text-[var(--color-marino)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)]"
                >
                  {t.letra}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} />
              </li>
              <li aria-current="page" className="text-[var(--color-carbon)] font-500">
                {t.termino}
              </li>
            </ol>
          </nav>

          {/* Badge área */}
          <div className="mb-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full font-ui text-xs font-500"
              style={{
                background: areaColors.bg,
                color: areaColors.text,
                border: `1px solid ${areaColors.border}`,
              }}
            >
              {areaLabel}
            </span>
          </div>

          {/* Título */}
          <h1 className="font-serif text-[var(--text-4xl)] font-600 text-[var(--color-marino)] leading-tight mb-4">
            {t.termino}
          </h1>

          {/* Letra grande decorativa */}
          <div
            className="absolute top-0 right-0 font-serif text-[12rem] font-700 leading-none select-none pointer-events-none hidden lg:block"
            style={{ color: "var(--color-dorado)", opacity: 0.06 }}
            aria-hidden="true"
          >
            {t.letra}
          </div>
        </Container>
      </section>

      {/* ─── Contenido principal ──────────────────────────────────── */}
      <section className="py-12">
        <Container size="narrow">
          <div className="space-y-10">
            {/* Definición corta */}
            <div>
              <h2 className="font-ui text-xs font-600 tracking-[0.12em] uppercase text-[var(--color-dorado-deep)] mb-3">
                Definición corta
              </h2>
              <p className="font-body text-lg leading-relaxed text-[var(--color-carbon)]">
                {t.definicionCorta}
              </p>
            </div>

            <hr
              className="border-none h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, var(--color-dorado), transparent)",
                opacity: 0.4,
              }}
            />

            {/* Definición completa */}
            <div>
              <h2 className="font-ui text-xs font-600 tracking-[0.12em] uppercase text-[var(--color-dorado-deep)] mb-4">
                Definición completa
              </h2>
              <div
                className="prose prose-sm max-w-none font-body leading-relaxed"
                style={{
                  // Tipografía del proyecto en lugar de prose defaults
                  ["--tw-prose-body" as string]: "var(--color-carbon-soft)",
                  ["--tw-prose-headings" as string]: "var(--color-marino)",
                  ["--tw-prose-links" as string]: "var(--color-marino)",
                  ["--tw-prose-bold" as string]: "var(--color-carbon)",
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.definicionLarga}</ReactMarkdown>
              </div>
            </div>

            {/* Sinónimos */}
            {t.sinonimos && t.sinonimos.length > 0 && (
              <div>
                <h2 className="font-ui text-xs font-600 tracking-[0.12em] uppercase text-[var(--color-dorado-deep)] mb-3">
                  Sinónimos y términos equivalentes
                </h2>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Sinónimos">
                  {t.sinonimos.map((sin) => (
                    <span
                      key={sin}
                      role="listitem"
                      className="px-3 py-1 rounded-full font-ui text-sm text-[var(--color-text-secondary)] border border-[var(--color-border-default)] bg-[var(--color-bg-warm)]"
                    >
                      {sin}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Términos relacionados */}
            {relacionados.length > 0 && (
              <div>
                <h2 className="font-ui text-xs font-600 tracking-[0.12em] uppercase text-[var(--color-dorado-deep)] mb-4">
                  Términos relacionados
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relacionados.map((relSlug) => (
                    <Link
                      key={relSlug}
                      href={`/glosario/${relSlug}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-[6px] border border-[var(--color-border-default)] bg-[var(--color-bg)] hover:border-[var(--color-marino)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-sm)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-2"
                      aria-label={`Ver definición de ${relSlug}`}
                    >
                      <span
                        className="shrink-0 w-7 h-7 rounded-[4px] flex items-center justify-center font-serif text-sm font-600"
                        style={{
                          background: "var(--color-marino-subtle)",
                          color: "var(--color-marino)",
                        }}
                        aria-hidden="true"
                      >
                        {relSlug.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-ui text-sm font-500 text-[var(--color-marino)] capitalize">
                        {relSlug.replace(/-/g, " ")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ─── CTA al final ─────────────────────────────────────────── */}
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
              Consulta profesional
            </p>
            <h2 className="font-serif text-2xl font-500 text-[var(--color-bg)] mb-3">
              ¿Necesitás asesoramiento sobre este tema?
            </h2>
            <p className="font-body text-sm mb-8" style={{ color: "rgba(250,247,242,0.65)" }}>
              Cada situación es única. El Dr. Pablo De Luca puede analizar tu caso en detalle.
            </p>
            <a
              href="/reservar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[6px] font-ui text-sm font-600 transition-all duration-250 hover:-translate-y-[2px] focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-2"
              style={{ background: "var(--color-dorado)", color: "var(--color-marino)" }}
            >
              Reservar consulta →
            </a>
          </div>
        </Container>
      </section>

      {/* ─── Volver al glosario ───────────────────────────────────── */}
      <div className="py-6 border-t border-[var(--color-border-default)]">
        <Container size="narrow">
          <Link
            href="/glosario"
            className="font-ui text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-marino)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:rounded-[4px] flex items-center gap-1"
          >
            ← Volver al glosario
          </Link>
        </Container>
      </div>
    </>
  );
}
