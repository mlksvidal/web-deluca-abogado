import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  FileText,
  Briefcase,
  Scale,
  BookOpen,
} from "lucide-react";
import type { ComponentType } from "react";

import { siteConfig } from "@/lib/site-config";
import { RECURSOS, TIPO_LABELS, getRecursoBySlug } from "@/lib/recursos-config";
import { Container } from "@/components/layout/container";
import { RecursoDownloadSection } from "@/components/recursos/recurso-download-section";

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return RECURSOS.map((r) => ({ slug: r.slug }));
}

// ─── Metadata dinámica ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recurso = getRecursoBySlug(slug);

  if (!recurso) {
    return {
      title: "Recurso no encontrado",
    };
  }

  const title = `${recurso.titulo} | Descarga Gratuita — ${siteConfig.studioNameShort}`;
  const description = recurso.descripcionLarga.slice(0, 160);

  return {
    title,
    description,
    keywords: recurso.keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.siteUrl}/recursos/${slug}`,
    },
    alternates: {
      canonical: `${siteConfig.siteUrl}/recursos/${slug}`,
    },
  };
}

// ─── Beneficios genéricos por tipo ───────────────────────────────────────────

const BENEFICIOS_GUIA = [
  "Redactada en lenguaje claro, sin tecnicismos innecesarios",
  "Checklist de acciones con plazos concretos",
  "Incluye ejemplos y casos frecuentes",
  "Preparada por el Dr. Pablo De Luca",
];

const BENEFICIOS_MODELO = [
  "Modelo conforme al derecho argentino vigente",
  "Con instrucciones de completado en cada campo",
  "Adaptable a la situación particular de cada caso",
  "Revisado por el Dr. Pablo De Luca",
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function RecursoSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recurso = getRecursoBySlug(slug);

  if (!recurso) {
    notFound();
  }

  const ICON_MAP: Record<
    string,
    ComponentType<{ size?: number; className?: string; "aria-hidden"?: "true" }>
  > = {
    FileText,
    Briefcase,
    Scale,
    BookOpen,
  };
  const Icon = ICON_MAP[recurso.iconName] ?? FileText;
  const beneficios = recurso.tipo === "guia" ? BENEFICIOS_GUIA : BENEFICIOS_MODELO;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: recurso.titulo,
    description: recurso.descripcionLarga,
    url: `${siteConfig.siteUrl}/recursos/${recurso.slug}`,
    author: {
      "@type": "Person",
      name: siteConfig.drName,
      worksFor: {
        "@type": "LegalService",
        name: siteConfig.studioName,
        url: siteConfig.siteUrl,
      },
    },
    isAccessibleForFree: true,
    encodingFormat: "application/pdf",
    publisher: {
      "@type": "LegalService",
      name: siteConfig.studioName,
      url: siteConfig.siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section
        aria-labelledby="recurso-heading"
        style={{
          background: "linear-gradient(160deg, var(--color-marino) 0%, #1E3A6E 100%)",
          paddingTop: "120px",
          paddingBottom: "56px",
        }}
      >
        <Container size="narrow">
          {/* Breadcrumb */}
          <nav aria-label="Navegación de breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 font-ui text-xs text-[rgba(250,247,242,0.55)]">
              <li>
                <Link href="/" className="hover:text-dorado transition-colors duration-150">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} />
              </li>
              <li>
                <Link href="/recursos" className="hover:text-dorado transition-colors duration-150">
                  Recursos
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} />
              </li>
              <li aria-current="page" className="text-dorado">
                {recurso.titulo}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-5">
            {/* Tipo + Área */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-ui text-xs font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(201,169,97,0.15)",
                  color: "var(--color-dorado)",
                  border: "1px solid rgba(201,169,97,0.3)",
                }}
              >
                {TIPO_LABELS[recurso.tipo]}
              </span>
              <span
                className="font-ui text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(250,247,242,0.08)",
                  color: "rgba(250,247,242,0.55)",
                  border: "1px solid rgba(250,247,242,0.15)",
                }}
              >
                {recurso.areaLabel}
              </span>
            </div>

            {/* Título */}
            <h1
              id="recurso-heading"
              className="font-serif font-semibold text-bg leading-tight"
              style={{ fontSize: "clamp(1.5rem, 1rem + 2.5vw, 2.5rem)" }}
            >
              {recurso.titulo}
            </h1>

            {/* Descripción larga */}
            <p
              className="font-body text-[rgba(250,247,242,0.75)] leading-relaxed"
              style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.05rem)" }}
            >
              {recurso.descripcionLarga}
            </p>

            {/* Icon */}
            <div className="flex items-center gap-2 text-dorado-muted">
              <Icon size={16} aria-hidden="true" />
              <span className="font-ui text-xs">PDF · {recurso.tamano} · Gratuito</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Content + Form */}
      <section
        style={{
          background: "var(--color-bg-warm)",
          paddingTop: "64px",
          paddingBottom: "96px",
        }}
      >
        <Container size="narrow">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start">
            {/* Left: beneficios */}
            <div className="space-y-8">
              <div>
                <Link
                  href="/recursos"
                  className="inline-flex items-center gap-1.5 font-ui text-sm text-text-secondary hover:text-marino transition-colors duration-150 mb-6 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2 focus-visible:rounded-[2px]"
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  Volver a recursos
                </Link>

                <h2 className="font-serif text-2xl font-semibold text-marino mb-4 leading-snug">
                  ¿Qué incluye este documento?
                </h2>

                <ul className="space-y-3" role="list">
                  {beneficios.map((beneficio) => (
                    <li key={beneficio} className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="shrink-0 mt-0.5 text-success"
                        aria-hidden="true"
                      />
                      <span className="font-body text-carbon-soft leading-relaxed">
                        {beneficio}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sobre el autor */}
              <div
                className="rounded-[10px] p-6 border"
                style={{
                  background: "var(--color-bg)",
                  borderColor: "var(--color-border-default)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-serif font-semibold text-lg"
                    style={{
                      background: "var(--color-marino)",
                      color: "var(--color-dorado)",
                    }}
                    aria-hidden="true"
                  >
                    PDL
                  </div>
                  <div>
                    <p className="font-ui text-sm font-semibold text-marino">{siteConfig.drName}</p>
                    <p className="font-ui text-xs text-text-tertiary mb-2">
                      Abogado · {siteConfig.city}, {siteConfig.province}
                    </p>
                    <p className="font-body text-sm text-carbon-soft leading-relaxed">
                      Documento preparado por el {siteConfig.drName}, con amplia experiencia en{" "}
                      {recurso.areaLabel.toLowerCase()}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Aviso legal */}
              <p className="font-body text-xs text-text-tertiary leading-relaxed">
                <strong className="font-semibold">Aviso legal:</strong> Este documento es
                orientativo y no reemplaza el asesoramiento jurídico profesional. Para un análisis
                específico de tu situación,{" "}
                <Link
                  href="/reservar"
                  className="text-marino underline underline-offset-2 decoration-dorado hover:decoration-2 transition-all"
                >
                  reservá una consulta
                </Link>
                .
              </p>
            </div>

            {/* Right: Form */}
            <div className="lg:sticky lg:top-24">
              <RecursoDownloadSection recurso={recurso} />
            </div>
          </div>
        </Container>
      </section>

      {/* CTA relacionados */}
      <section
        aria-label="Otros recursos disponibles"
        style={{
          background: "var(--color-bg)",
          paddingTop: "64px",
          paddingBottom: "80px",
          borderTop: "1px solid var(--color-border-default)",
        }}
      >
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-marino mb-1">
                ¿Necesitás otro documento?
              </h2>
              <p className="font-body text-sm text-text-secondary">
                Tenemos más recursos jurídicos gratuitos disponibles.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/recursos"
                className="inline-flex items-center justify-center gap-2 h-11 px-7 font-ui text-sm font-medium tracking-wide uppercase rounded-sm bg-transparent text-marino border border-marino hover:bg-marino hover:text-bg transition-all duration-250 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
              >
                Ver todos los recursos
              </Link>
              <Link
                href="/reservar"
                className="inline-flex items-center justify-center gap-2 h-11 px-7 font-ui text-sm font-medium tracking-wide uppercase rounded-sm bg-marino text-bg hover:bg-marino-hover hover:-translate-y-0.5 transition-all duration-250 shadow-[var(--shadow-sm)] focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
              >
                Reservar consulta
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
