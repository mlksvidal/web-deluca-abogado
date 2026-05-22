import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Términos de Uso",
  description:
    "Términos y condiciones de uso del sitio web del Estudio Jurídico Dr. Pablo De Luca. Información jurídica, responsabilidad y propiedad intelectual.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteConfig.siteUrl}/terminos`,
  },
};

// ─── Constantes ────────────────────────────────────────────────────────────────

const LAST_UPDATED = "2025-05-21";
const LAST_UPDATED_DISPLAY = "21 de mayo de 2025";

// ─── Schema.org ────────────────────────────────────────────────────────────────

function SchemaLegalPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "LegalNotice"],
    "@id": `${siteConfig.siteUrl}/terminos`,
    name: "Términos de Uso — Estudio Jurídico Dr. Pablo De Luca",
    description:
      "Términos y condiciones de uso del sitio web del Estudio Jurídico Dr. Pablo De Luca.",
    url: `${siteConfig.siteUrl}/terminos`,
    dateModified: LAST_UPDATED,
    inLanguage: "es-AR",
    isPartOf: {
      "@type": "WebSite",
      url: siteConfig.siteUrl,
      name: siteConfig.studioName,
    },
    publisher: {
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

// ─── Componentes editoriales ───────────────────────────────────────────────────

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-serif text-xl font-semibold text-[var(--color-marino)] mt-10 mb-4 scroll-mt-24"
    >
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-base leading-relaxed text-[var(--color-carbon-soft)] mb-4">
      {children}
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="font-body text-base text-[var(--color-carbon-soft)] leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

function DisclaimerBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border border-[var(--color-border-strong)] rounded-[8px] px-5 py-4 my-6"
      style={{ background: "var(--color-bg-warm)" }}
      role="note"
      aria-label="Advertencia legal importante"
    >
      <p className="font-ui text-xs uppercase tracking-widest text-[var(--color-marino)] font-semibold mb-2">
        Aviso legal importante
      </p>
      {children}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TerminosPage() {
  return (
    <>
      <SchemaLegalPage />

      {/* Hero editorial */}
      <section
        className="border-b border-[var(--color-border-default)]"
        style={{ background: "var(--color-marino)" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
          <p className="font-ui text-xs uppercase tracking-widest text-[rgba(201,169,97,0.80)] mb-3">
            Marco legal
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-bg)] leading-tight mb-4">
            Términos y Condiciones de Uso
          </h1>
          <p className="font-body text-base text-[rgba(250,247,242,0.75)] max-w-xl">
            Al utilizar este sitio usted acepta los presentes términos. Léalos detenidamente.
          </p>
          <p className="font-ui text-xs text-[rgba(250,247,242,0.45)] mt-6">
            Última actualización: {LAST_UPDATED_DISPLAY}
          </p>
        </div>
      </section>

      {/* Contenido editorial */}
      <article
        className="max-w-[720px] mx-auto px-6 py-12 md:py-16"
        aria-label="Términos y condiciones de uso"
      >
        {/* Índice rápido */}
        <nav aria-label="Índice de secciones" className="mb-10">
          <p className="font-ui text-xs uppercase tracking-wide text-[var(--color-text-tertiary)] mb-3">
            Contenido
          </p>
          <ol className="list-decimal list-inside space-y-1.5">
            {[
              { href: "#aceptacion", label: "Aceptación de los términos" },
              { href: "#uso-del-sitio", label: "Uso del sitio" },
              { href: "#naturaleza-informativa", label: "Naturaleza informativa del contenido" },
              {
                href: "#calculadoras",
                label: "Limitación de responsabilidad — calculadoras y verificadores",
              },
              { href: "#propiedad-intelectual", label: "Propiedad intelectual" },
              { href: "#conducta", label: "Conducta del usuario" },
              { href: "#servicios-terceros", label: "Servicios de terceros" },
              { href: "#jurisdiccion", label: "Jurisdicción y ley aplicable" },
              { href: "#contacto-legal", label: "Contacto" },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="font-ui text-sm text-[var(--color-marino)] hover:text-[var(--color-dorado-deep)] transition-colors duration-150 underline underline-offset-2"
                >
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <hr className="border-[var(--color-border-default)] mb-10" />

        {/* § 1 — Aceptación */}
        <SectionTitle id="aceptacion">1. Aceptación de los términos</SectionTitle>
        <Paragraph>
          Al acceder y utilizar el sitio web del <strong>{siteConfig.studioName}</strong> (en
          adelante &ldquo;el Sitio&rdquo;), usted acepta quedar vinculado por los presentes Términos
          y Condiciones de Uso. Si no está de acuerdo con alguno de ellos, le solicitamos que se
          abstenga de utilizar el Sitio.
        </Paragraph>
        <Paragraph>
          Estos términos pueden ser modificados en cualquier momento sin previo aviso. La
          continuación en el uso del Sitio implica la aceptación de las modificaciones vigentes.
        </Paragraph>

        {/* § 2 — Uso del sitio */}
        <SectionTitle id="uso-del-sitio">2. Uso del sitio</SectionTitle>
        <Paragraph>
          El Sitio está destinado a personas mayores de 18 años. El uso del Sitio está permitido
          exclusivamente para fines lícitos y conforme a la legislación vigente en la República
          Argentina.
        </Paragraph>
        <Paragraph>El Sitio permite:</Paragraph>
        <BulletList
          items={[
            "Obtener información general sobre los servicios jurídicos del Estudio",
            "Reservar turnos de consulta profesional",
            "Descargar recursos informativos en formato PDF",
            "Consultar el glosario jurídico y artículos del blog",
            "Utilizar herramientas de orientación (calculadoras, verificadores) con fines informativos",
          ]}
        />

        {/* § 3 — Naturaleza informativa */}
        <SectionTitle id="naturaleza-informativa">
          3. Naturaleza informativa del contenido
        </SectionTitle>
        <DisclaimerBox>
          <p className="font-body text-sm text-[var(--color-carbon-soft)] leading-relaxed">
            Todo el contenido publicado en este Sitio — incluyendo artículos del blog, el glosario
            jurídico, guías descargables y cualquier otro material — tiene{" "}
            <strong>carácter exclusivamente informativo y orientativo</strong>. Dicho contenido no
            constituye ni reemplaza el asesoramiento jurídico profesional.
          </p>
          <p className="font-body text-sm text-[var(--color-carbon-soft)] leading-relaxed mt-2">
            Cada situación legal es particular y requiere análisis individualizado por un
            profesional habilitado. Para recibir asesoramiento legal vinculante,{" "}
            <Link
              href="/reservar"
              className="text-[var(--color-marino)] font-semibold underline underline-offset-2 hover:text-[var(--color-dorado-deep)]"
            >
              reserve una consulta
            </Link>
            .
          </p>
        </DisclaimerBox>
        <Paragraph>
          El Dr. Pablo De Luca no asume responsabilidad por decisiones tomadas con base en el
          contenido informativo del Sitio sin haber obtenido asesoramiento legal personalizado
          previo.
        </Paragraph>

        {/* § 4 — Calculadoras */}
        <SectionTitle id="calculadoras">
          4. Limitación de responsabilidad — calculadoras y verificadores
        </SectionTitle>
        <Paragraph>
          El Sitio ofrece herramientas de orientación como calculadoras de indemnizaciones,
          verificadores de plazos procesales y otras utilidades similares. Respecto a estas
          herramientas:
        </Paragraph>
        <DisclaimerBox>
          <p className="font-body text-sm text-[var(--color-carbon-soft)] leading-relaxed">
            Los resultados de las calculadoras y verificadores son{" "}
            <strong>estimaciones orientativas</strong> basadas en parámetros generales. No
            constituyen liquidaciones definitivas, peritajes, ni dictámenes jurídicos. Los montos,
            plazos y cálculos pueden variar en función de las circunstancias particulares de cada
            caso, jurisprudencia aplicable, actualizaciones legislativas y criterios judiciales.
          </p>
          <p className="font-body text-sm text-[var(--color-carbon-soft)] leading-relaxed mt-2">
            El Estudio no garantiza la exactitud, integridad o vigencia de los resultados obtenidos.
            El uso de estas herramientas no genera relación profesional ni responsabilidad legal
            alguna.
          </p>
        </DisclaimerBox>
        <Paragraph>
          Para obtener un cálculo preciso y con validez jurídica, es imprescindible la consulta con
          el Dr. De Luca o un profesional habilitado.
        </Paragraph>

        {/* § 5 — Propiedad intelectual */}
        <SectionTitle id="propiedad-intelectual">5. Propiedad intelectual</SectionTitle>
        <Paragraph>
          Todos los contenidos del Sitio — incluyendo, sin limitarse a, textos, artículos del blog,
          guías, glosario, diseño gráfico, logotipos, imágenes, código fuente y estructura — son
          propiedad del <strong>{siteConfig.studioName}</strong> o de sus proveedores y están
          protegidos por las leyes de propiedad intelectual de la República Argentina (Ley 11.723 de
          Propiedad Intelectual) y tratados internacionales aplicables.
        </Paragraph>
        <Paragraph>Queda expresamente prohibido:</Paragraph>
        <BulletList
          items={[
            "Reproducir, copiar, distribuir o transmitir cualquier contenido del Sitio sin autorización previa y por escrito",
            "Utilizar el contenido con fines comerciales sin autorización",
            "Modificar o crear obras derivadas basadas en el contenido del Sitio",
            "Usar los contenidos de forma que induzca a error sobre su origen o autoría",
          ]}
        />
        <Paragraph>
          Se permite la cita parcial de contenidos con mención expresa de la fuente y enlace al
          Sitio, siempre que no se desvirtúe el sentido del contenido original.
        </Paragraph>

        {/* § 6 — Conducta */}
        <SectionTitle id="conducta">6. Conducta del usuario</SectionTitle>
        <Paragraph>El usuario se compromete a no utilizar el Sitio para:</Paragraph>
        <BulletList
          items={[
            "Enviar información falsa, engañosa o que infrinja derechos de terceros",
            "Realizar actividades que puedan dañar, deshabilitar o sobrecargar los servidores del Sitio",
            "Intentar acceder sin autorización a sistemas, datos o cuentas",
            "Distribuir malware, spam o código malicioso",
            "Violar cualquier disposición legal aplicable",
          ]}
        />

        {/* § 7 — Servicios de terceros */}
        <SectionTitle id="servicios-terceros">
          7. Servicios de terceros y enlaces externos
        </SectionTitle>
        <Paragraph>
          El Sitio puede contener enlaces a sitios web de terceros. Dichos enlaces se proporcionan
          únicamente a modo de referencia informativa. El <strong>{siteConfig.studioName}</strong>{" "}
          no tiene control sobre el contenido de esos sitios y no asume responsabilidad alguna por
          su contenido, políticas de privacidad o prácticas.
        </Paragraph>
        <Paragraph>
          La mención de servicios, instituciones o recursos externos no implica respaldo ni
          recomendación por parte del Estudio.
        </Paragraph>

        {/* § 8 — Jurisdicción */}
        <SectionTitle id="jurisdiccion">8. Jurisdicción y ley aplicable</SectionTitle>
        <Paragraph>
          Los presentes Términos y Condiciones se rigen por las leyes de la República Argentina.
          Para la resolución de cualquier controversia derivada del uso de este Sitio, las partes se
          someten a la jurisdicción de los Tribunales Ordinarios de la{" "}
          <strong>Provincia de Mendoza</strong>, con renuncia expresa a cualquier otro fuero o
          jurisdicción que pudiera corresponder.
        </Paragraph>
        <Paragraph>
          El domicilio legal del Estudio a todos los efectos es:{" "}
          <strong>{siteConfig.addressFull}</strong>.
        </Paragraph>

        {/* § 9 — Contacto */}
        <SectionTitle id="contacto-legal">9. Contacto</SectionTitle>
        <Paragraph>
          Para consultas sobre estos Términos de Uso o cualquier aspecto legal relacionado con el
          Sitio, puede comunicarse al correo:{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-[var(--color-marino)] underline underline-offset-2 hover:text-[var(--color-dorado-deep)]"
          >
            {siteConfig.email}
          </a>
          .
        </Paragraph>

        <hr className="border-[var(--color-border-default)] my-10" />

        {/* Footer legal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <p className="font-ui text-xs text-[var(--color-text-tertiary)]">
            Vigente desde el {LAST_UPDATED_DISPLAY}
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacidad"
              className="font-ui text-xs text-[var(--color-marino)] underline underline-offset-2 hover:text-[var(--color-dorado-deep)] transition-colors"
            >
              Política de privacidad
            </Link>
            <Link
              href="/"
              className="font-ui text-xs text-[var(--color-marino)] underline underline-offset-2 hover:text-[var(--color-dorado-deep)] transition-colors"
            >
              Inicio
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
