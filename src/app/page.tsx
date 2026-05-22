import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { Hero } from "@/components/sections/hero";
import { TriajeWizard } from "@/components/triage/triage-wizard";
import { Areas } from "@/components/sections/areas";
import { Casos } from "@/components/sections/casos";
import { CtaBand } from "@/components/sections/cta-band";
import { About } from "@/components/sections/about";
import { Contacto } from "@/components/sections/contacto";

export const metadata: Metadata = {
  title: siteConfig.seoTitle,
  description: siteConfig.seoDescription,
  openGraph: {
    title: siteConfig.seoTitle,
    description: siteConfig.seoDescription,
    url: siteConfig.siteUrl,
    siteName: siteConfig.studioName,
    images: [
      {
        url: `${siteConfig.siteUrl}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.seoTitle,
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seoTitle,
    description: siteConfig.seoDescription,
    images: [`${siteConfig.siteUrl}${siteConfig.ogImage}`],
  },
  alternates: {
    canonical: siteConfig.siteUrl,
  },
};

/**
 * Landing page — composición de secciones.
 *
 * Orden:
 *   1. Hero (#inicio) — qué hace el Dr.
 *   2. Áreas (#areas) — especialidades
 *   3. Casos (#casos) — historias narrativas
 *   4. About (#trayectoria) — quién es el Dr.
 *   5. TriajeWizard (#consulta) — ya conoce, ahora consultá rápido
 *   6. CtaBand — primera consulta sin cargo
 *   7. Contacto (#estudio) — datos físicos
 */
export default function HomePage() {
  // Schema.org — LocalBusiness + ItemList de áreas
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": `${siteConfig.siteUrl}/#legal-service`,
        name: siteConfig.studioName,
        url: siteConfig.siteUrl,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.city,
          addressRegion: siteConfig.province,
          addressCountry: siteConfig.country,
          postalCode: "5600",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "13:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "16:00",
            closes: "20:00",
          },
        ],
        priceRange: "$$",
        areaServed: {
          "@type": "State",
          name: "Mendoza",
        },
      },
      {
        "@type": "ItemList",
        name: "Áreas de práctica",
        itemListElement: siteConfig.areas.map((area, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Service",
            name: area.label,
            provider: { "@id": `${siteConfig.siteUrl}/#legal-service` },
            url: `${siteConfig.siteUrl}/#areas`,
          },
        })),
      },
    ],
  };

  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <main id="main-content">
        {/* 1. Hero — section#inicio */}
        <Hero />

        {/* 2. Áreas de práctica — section#areas */}
        <Areas />

        {/* 3. Casos resueltos — section#casos */}
        <Casos />

        {/* 4. About / Trayectoria — section#trayectoria */}
        <About />

        {/* 5. Triaje WhatsApp — el usuario ya conoce al Dr., ahora consulta rápido */}
        <div id="consulta">
          <TriajeWizard />
        </div>

        {/* 6. CTA band — primera consulta sin cargo */}
        <CtaBand />

        {/* 7. Contacto + Mapa — section#estudio */}
        <Contacto />
      </main>
    </>
  );
}
