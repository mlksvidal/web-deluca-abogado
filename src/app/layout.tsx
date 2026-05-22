import type { Metadata } from "next";
import { Playfair_Display, Lora, Montserrat } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { siteConfig } from "@/lib/site-config";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-float";
import { Toaster } from "@/components/ui/sonner";

// ─── Fonts ────────────────────────────────────────────────────

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-playfair",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-lora",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-montserrat",
});

// ─── Metadata global ──────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.seoTitle,
    template: `%s | ${siteConfig.studioNameShort}`,
  },
  description: siteConfig.seoDescription,
  keywords: [
    "abogado San Rafael",
    "abogado Mendoza",
    "derecho laboral",
    "derecho civil",
    "derecho penal",
    "derecho comercial",
    "consulta legal",
    "estudio jurídico",
    "Pablo De Luca",
  ],
  authors: [{ name: siteConfig.drName }],
  creator: siteConfig.drName,
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteConfig.siteUrl,
    siteName: siteConfig.studioName,
    title: siteConfig.seoTitle,
    description: siteConfig.seoDescription,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.studioName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seoTitle,
    description: siteConfig.seoDescription,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.siteUrl,
  },
};

// ─── Schema.org JSON-LD global ────────────────────────────────

function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LegalService", "LocalBusiness"],
        "@id": `${siteConfig.siteUrl}/#organization`,
        name: siteConfig.studioName,
        alternateName: siteConfig.studioNameShort,
        description: siteConfig.taglineLong,
        url: siteConfig.siteUrl,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.city,
          addressRegion: siteConfig.province,
          addressCountry: "AR",
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
        currenciesAccepted: "ARS",
        areaServed: {
          "@type": "State",
          name: "Mendoza",
          addressCountry: "AR",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios Jurídicos",
          itemListElement: siteConfig.areas.map((area) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: `Derecho ${area.label}`,
            },
          })),
        },
        founder: {
          "@type": "Person",
          name: siteConfig.drName,
          jobTitle: "Abogado",
          worksFor: { "@id": `${siteConfig.siteUrl}/#organization` },
        },
        sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
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

// ─── Root Layout ──────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-AR"
      dir="ltr"
      className={`${playfairDisplay.variable} ${lora.variable} ${montserrat.variable}`}
    >
      <head>
        <SchemaOrg />
      </head>
      <body className="antialiased">
        <LenisProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          {/* FAB flotante — siempre presente en toda la app */}
          <WhatsAppFab />
          {/* Toast notifications */}
          <Toaster position="top-right" richColors />
        </LenisProvider>
      </body>
    </html>
  );
}
