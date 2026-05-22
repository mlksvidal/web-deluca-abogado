import type { Metadata } from "next";
import { Suspense } from "react";

import { siteConfig } from "@/lib/site-config";
import { listPosts } from "@/app/actions/blog";
import { Container } from "@/components/layout/container";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogFilters } from "@/components/blog/blog-filters";
import { BlogPagination } from "@/components/blog/blog-pagination";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Guías y Artículos Jurídicos | ${siteConfig.studioName}`,
  description:
    "Artículos y guías jurídicas sobre derecho laboral, civil, penal y comercial en Argentina. Redactados por el Dr. Pablo De Luca, abogado en San Rafael, Mendoza.",
  keywords: [
    "artículos jurídicos Argentina",
    "guías legales Mendoza",
    "blog abogado San Rafael",
    "derecho laboral civil penal Argentina",
    "asesoramiento legal gratuito",
  ],
  openGraph: {
    title: "Blog Jurídico — Estudio De Luca",
    description:
      "Guías y artículos sobre derecho argentino escritos por el Dr. Pablo De Luca. Información clara para conocer tus derechos.",
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.siteUrl}/blog`,
  },
};

// ─── Área label map ───────────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General",
};

// ─── Page ────────────────────────────────────────────────────────────────────

type SearchParams = Promise<{
  area?: string;
  page?: string;
}>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const area = params.area ?? "";
  const page = Number(params.page ?? "1") || 1;
  const pageSize = 6;

  const result = await listPosts({ page, pageSize, area: area || undefined });

  const posts = result.success ? result.data.items : [];
  const total = result.success ? result.data.total : 0;
  const activeAreaLabel = area ? (AREA_LABELS[area] ?? area) : null;

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="blog-heading"
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
              Blog jurídico
            </span>

            <h1
              id="blog-heading"
              className="font-serif font-semibold text-[var(--color-bg)] leading-tight"
              style={{ fontSize: "clamp(1.75rem, 1rem + 3vw, 3rem)" }}
            >
              Guías y artículos jurídicos
            </h1>

            <p
              className="font-body text-[rgba(250,247,242,0.75)] leading-relaxed"
              style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.5vw, 1.1rem)" }}
            >
              Información legal clara y accesible para que conozcas tus derechos. Escrita por el{" "}
              {siteConfig.drName}.
            </p>
          </div>
        </Container>
      </section>

      {/* Filtros + Grid */}
      <section
        style={{
          background: "var(--color-bg-warm)",
          paddingTop: "56px",
          paddingBottom: "96px",
        }}
      >
        <Container>
          {/* Filtros — Suspense porque usa useSearchParams */}
          <div className="mb-8">
            <Suspense fallback={<div className="h-10" aria-hidden="true" />}>
              <BlogFilters activeArea={area} />
            </Suspense>
          </div>

          {/* Encabezado de resultados */}
          {activeAreaLabel && (
            <p
              className="font-ui text-sm text-[var(--color-text-secondary)] mb-6"
              aria-live="polite"
            >
              Mostrando artículos de{" "}
              <strong className="font-semibold text-[var(--color-marino)]">
                {activeAreaLabel}
              </strong>{" "}
              · {total} resultado{total !== 1 ? "s" : ""}
            </p>
          )}

          {/* Grid */}
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Paginación */}
              <Suspense fallback={null}>
                <BlogPagination page={page} total={total} pageSize={pageSize} />
              </Suspense>
            </>
          ) : (
            /* Empty state */
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              role="status"
              aria-live="polite"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-3xl"
                style={{ background: "var(--color-bg-secondary)" }}
                aria-hidden="true"
              >
                📄
              </div>
              <h2 className="font-serif text-2xl font-semibold text-[var(--color-marino)] mb-2">
                {activeAreaLabel
                  ? `Sin artículos de ${activeAreaLabel} por ahora`
                  : "Sin artículos por ahora"}
              </h2>
              <p className="font-body text-sm text-[var(--color-text-secondary)] max-w-sm">
                Estamos preparando contenido. Mientras tanto,{" "}
                <a
                  href="/reservar"
                  className="text-[var(--color-marino)] underline underline-offset-2 decoration-[var(--color-dorado)] hover:decoration-2 transition-all"
                >
                  reservá una consulta
                </a>{" "}
                para hablar directamente con el Dr. De Luca.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
