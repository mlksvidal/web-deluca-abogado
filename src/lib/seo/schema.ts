/**
 * schema.ts — Helpers tipados para JSON-LD Schema.org
 * Usados por páginas individuales para enriquecer sus metadatos estructurados.
 */

import { siteConfig } from "@/lib/site-config";

const BASE = siteConfig.siteUrl;

// ─── Tipos internos ───────────────────────────────────────────

type JsonLdObject = Record<string, unknown>;

// ─── Breadcrumb ───────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── Article (blog post) ──────────────────────────────────────

export interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date | string;
  updatedAt?: Date | string;
  imageUrl?: string;
}

export function buildArticleSchema(props: ArticleSchemaProps): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BASE}/blog/${props.slug}#article`,
    headline: props.title,
    description: props.description,
    url: `${BASE}/blog/${props.slug}`,
    datePublished:
      props.publishedAt instanceof Date ? props.publishedAt.toISOString() : props.publishedAt,
    dateModified:
      props.updatedAt instanceof Date
        ? props.updatedAt.toISOString()
        : (props.updatedAt ?? props.publishedAt),
    author: {
      "@type": "Person",
      name: siteConfig.drName,
      worksFor: {
        "@type": "Organization",
        name: siteConfig.studioName,
      },
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.studioName,
      url: BASE,
    },
    ...(props.imageUrl ? { image: props.imageUrl } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE}/blog/${props.slug}`,
    },
  };
}

// ─── FAQPage ──────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

export function buildFAQSchema(items: FAQItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ─── SoftwareApplication (calculadoras) ──────────────────────

export interface CalculatorSchemaProps {
  name: string;
  description: string;
  url: string;
}

export function buildCalculatorSchema(props: CalculatorSchemaProps): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: props.name,
    description: props.description,
    url: props.url,
    applicationCategory: "LegalService",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ARS",
    },
  };
}

// ─── DefinedTerm (glosario) ───────────────────────────────────

export interface DefinedTermSchemaProps {
  termino: string;
  slug: string;
  definicion: string;
}

export function buildDefinedTermSchema(props: DefinedTermSchemaProps): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: props.termino,
    description: props.definicion,
    url: `${BASE}/glosario/${props.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Glosario Jurídico",
      url: `${BASE}/glosario`,
    },
  };
}

// ─── HowTo (proceso divorcio) ─────────────────────────────────

export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
}

export function buildHowToSchema(props: HowToSchemaProps): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: props.name,
    description: props.description,
    step: props.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

// ─── Helper: serializar múltiples schemas ─────────────────────

export function combineSchemas(...schemas: JsonLdObject[]): string {
  if (schemas.length === 1) return JSON.stringify(schemas[0]);
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": schemas,
  });
}
