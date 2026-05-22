import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { siteConfig } from "@/lib/site-config";
import { getPostBySlug, listPosts } from "@/app/actions/blog";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

// ─── Área label map ───────────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General",
};

// ─── Metadata dinámica ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug(slug);

  if (!result.success) {
    return { title: "Artículo no encontrado" };
  }

  const post = result.data;
  const title = post.seoTitle ?? `${post.title} | ${siteConfig.studioNameShort}`;
  const description = post.seoDescription ?? post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${siteConfig.siteUrl}/blog/${slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author],
      images: post.ogImage
        ? [{ url: post.ogImage, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    alternates: {
      canonical: `${siteConfig.siteUrl}/blog/${slug}`,
    },
  };
}

// ─── Related posts ────────────────────────────────────────────────────────────

async function getRelatedPosts(area: string, excludeSlug: string) {
  const result = await listPosts({ page: 1, pageSize: 4, area });
  if (!result.success) return [];
  return result.data.items.filter((p) => p.slug !== excludeSlug).slice(0, 3);
}

// ─── FAQ detection — si el HTML tiene <h2>Preguntas frecuentes generamos FAQPage ─

function extractFAQs(contentHtml: string): { question: string; answer: string }[] {
  // Busca secciones FAQ dentro del HTML — pattern básico con h2/h3 + párrafo siguiente
  // Solo funciona si el post tiene una sección "Preguntas frecuentes" o similar
  const faqMatch = contentHtml.match(/(?:preguntas?\s+frecuentes|faq|consultas?\s+comunes)/i);
  if (!faqMatch) return [];

  // Extraer pares pregunta/respuesta del HTML — pattern simplificado
  const qaPattern = /<h[23][^>]*>(.*?)<\/h[23]>\s*<p[^>]*>(.*?)<\/p>/gi;
  const faqs: { question: string; answer: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = qaPattern.exec(contentHtml)) !== null && faqs.length < 10) {
    const q = match[1].replace(/<[^>]+>/g, "").trim();
    const a = match[2].replace(/<[^>]+>/g, "").trim();
    if (q && a && q.length > 5) {
      faqs.push({ question: q, answer: a });
    }
  }

  return faqs;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const result = await getPostBySlug(slug);

  if (!result.success) {
    notFound();
  }

  const post = result.data;
  const area = post.areaLegal ?? "general";
  const areaLabel = AREA_LABELS[area] ?? area;

  const publishedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })
    : null;

  const relatedPosts = await getRelatedPosts(area, slug);

  const faqs = extractFAQs(post.contentHtml);

  // ─── Schema.org ─────────────────────────────────────────────────────────────

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
      worksFor: {
        "@type": "LegalService",
        name: siteConfig.studioName,
        url: siteConfig.siteUrl,
      },
    },
    publisher: {
      "@type": "LegalService",
      name: siteConfig.studioName,
      url: siteConfig.siteUrl,
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    url: `${siteConfig.siteUrl}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl}/blog/${slug}`,
    },
    ...(post.ogImage && { image: post.ogImage }),
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero del artículo */}
      <section
        aria-labelledby="post-heading"
        style={{
          background: "linear-gradient(160deg, var(--color-marino) 0%, #1E3A6E 100%)",
          paddingTop: "120px",
          paddingBottom: "56px",
        }}
      >
        <Container size="narrow">
          {/* Breadcrumb */}
          <nav aria-label="Navegación de breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 font-ui text-xs text-[rgba(250,247,242,0.55)]">
              <li>
                <Link href="/" className="hover:text-dorado transition-colors duration-150">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} />
              </li>
              <li>
                <Link href="/blog" className="hover:text-dorado transition-colors duration-150">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} />
              </li>
              <li
                aria-current="page"
                className="text-dorado truncate max-w-[200px]"
                title={post.title}
              >
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Área */}
          <Badge variant="info" className="mb-4">
            {areaLabel}
          </Badge>

          {/* Título */}
          <h1
            id="post-heading"
            className="font-serif font-semibold text-bg leading-tight mb-6"
            style={{ fontSize: "clamp(1.6rem, 1rem + 2.8vw, 2.75rem)" }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          <p
            className="font-body text-[rgba(250,247,242,0.80)] leading-relaxed mb-6"
            style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.1rem)" }}
          >
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4">
            {publishedDate && (
              <span className="flex items-center gap-1.5 font-ui text-xs text-[rgba(250,247,242,0.55)]">
                <Calendar size={13} aria-hidden="true" />
                <time dateTime={post.publishedAt?.toISOString()}>{publishedDate}</time>
              </span>
            )}
            <span className="flex items-center gap-1.5 font-ui text-xs text-[rgba(250,247,242,0.55)]">
              <User size={13} aria-hidden="true" />
              {post.author}
            </span>
          </div>
        </Container>
      </section>

      {/* Contenido editorial */}
      <section
        style={{
          background: "var(--color-bg)",
          paddingTop: "64px",
          paddingBottom: "80px",
        }}
      >
        <Container size="narrow">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-ui text-sm text-text-secondary hover:text-marino transition-colors duration-150 mb-8 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2 focus-visible:rounded-[2px]"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Volver al blog
          </Link>

          {/* Contenido markdown renderizado */}
          <div
            className="prose-editorial"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            aria-label="Contenido del artículo"
          />

          {/* Divider dorado */}
          <hr className="divider-gold my-12" />

          {/* CTA al final */}
          <aside
            className="rounded-[12px] p-8 text-center"
            style={{
              background: "linear-gradient(135deg, var(--color-marino) 0%, #1E3A6E 100%)",
            }}
            aria-label="Consulta legal relacionada"
          >
            <h2 className="font-serif text-2xl font-semibold text-bg mb-3 leading-snug">
              ¿Tenés una consulta similar?
            </h2>
            <p className="font-body text-[rgba(250,247,242,0.75)] mb-6 max-w-md mx-auto">
              Cada caso es único. Hablá con el {siteConfig.drName} para analizar tu situación en
              particular.
            </p>
            <Link
              href="/reservar"
              className="inline-flex items-center gap-2.5 h-12 px-8 font-ui text-sm font-medium tracking-wide uppercase rounded-sm bg-dorado text-marino hover:bg-dorado-hover hover:-translate-y-0.5 transition-all duration-250 shadow-[var(--shadow-accent)] focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
            >
              Reservar consulta
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </aside>
        </Container>
      </section>

      {/* Posts relacionados */}
      {relatedPosts.length > 0 && (
        <section
          aria-labelledby="relacionados-heading"
          style={{
            background: "var(--color-bg-warm)",
            paddingTop: "64px",
            paddingBottom: "80px",
            borderTop: "1px solid var(--color-border-default)",
          }}
        >
          <Container>
            <h2
              id="relacionados-heading"
              className="font-serif text-2xl font-semibold text-marino mb-8"
            >
              Artículos relacionados
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => {
                const relatedArea = related.areaLegal ?? "general";
                const relatedAreaLabel = AREA_LABELS[relatedArea] ?? relatedArea;
                const relatedDate = related.publishedAt
                  ? format(new Date(related.publishedAt), "d MMM yyyy", { locale: es })
                  : null;

                return (
                  <article
                    key={related.id}
                    className="flex flex-col bg-bg border border-border-default rounded-[10px] shadow-[var(--shadow-sm)] overflow-hidden hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex flex-col flex-1 px-5 py-5">
                      <Badge variant="area-legal" className="w-fit mb-2.5">
                        {relatedAreaLabel}
                      </Badge>
                      <h3 className="font-serif text-base font-semibold text-marino leading-snug mb-2 line-clamp-2">
                        <Link
                          href={`/blog/${related.slug}`}
                          className="hover:text-marino-hover transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2 focus-visible:rounded-[2px]"
                        >
                          {related.title}
                        </Link>
                      </h3>
                      <p className="font-body text-sm text-carbon-soft leading-relaxed line-clamp-2 flex-1 mb-3">
                        {related.excerpt}
                      </p>
                      {relatedDate && (
                        <span className="font-ui text-xs text-text-tertiary">{relatedDate}</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
