import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad del Estudio Jurídico Dr. Pablo De Luca. Cumplimiento Ley 25.326 (Habeas Data Argentina).",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteConfig.siteUrl}/privacidad`,
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
    "@id": `${siteConfig.siteUrl}/privacidad`,
    name: "Política de Privacidad — Estudio Jurídico Dr. Pablo De Luca",
    description:
      "Política de privacidad y tratamiento de datos personales conforme a la Ley 25.326.",
    url: `${siteConfig.siteUrl}/privacidad`,
    dateModified: LAST_UPDATED,
    inLanguage: "es-AR",
    isPartOf: {
      "@type": "WebSite",
      url: siteConfig.siteUrl,
      name: siteConfig.studioName,
    },
    about: {
      "@type": "Thing",
      name: "Protección de datos personales",
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

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border-l-4 pl-5 py-3 my-6 rounded-r-[4px]"
      style={{ borderColor: "var(--color-dorado)", background: "var(--color-bg-warm)" }}
    >
      {children}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PrivacidadPage() {
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
            Política de Privacidad
          </h1>
          <p className="font-body text-base text-[rgba(250,247,242,0.75)] max-w-xl">
            Tratamiento de datos personales conforme a la{" "}
            <strong className="text-[rgba(250,247,242,0.90)]">Ley 25.326</strong> de Habeas Data de
            la República Argentina.
          </p>
          <p className="font-ui text-xs text-[rgba(250,247,242,0.45)] mt-6">
            Última actualización: {LAST_UPDATED_DISPLAY}
          </p>
        </div>
      </section>

      {/* Contenido editorial */}
      <article
        className="max-w-[720px] mx-auto px-6 py-12 md:py-16"
        aria-label="Política de privacidad"
      >
        {/* Índice rápido */}
        <nav aria-label="Índice de secciones" className="mb-10">
          <p className="font-ui text-xs uppercase tracking-wide text-[var(--color-text-tertiary)] mb-3">
            Contenido
          </p>
          <ol className="list-decimal list-inside space-y-1.5">
            {[
              { href: "#responsable", label: "Responsable del tratamiento" },
              { href: "#datos-recolectados", label: "Datos personales que recolectamos" },
              { href: "#finalidad", label: "Finalidad del tratamiento" },
              { href: "#datos-sensibles", label: "Datos sensibles" },
              { href: "#conservacion", label: "Plazos de conservación" },
              { href: "#cesion-terceros", label: "Cesión a terceros" },
              { href: "#derechos-arco", label: "Derechos ARCO" },
              { href: "#aaip", label: "Inscripción AAIP" },
              { href: "#cookies", label: "Cookies" },
              { href: "#cambios", label: "Cambios a esta política" },
              { href: "#contacto-privacidad", label: "Contacto de privacidad" },
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

        {/* § 1 — Responsable del tratamiento */}
        <SectionTitle id="responsable">1. Responsable del tratamiento</SectionTitle>
        <Paragraph>El responsable del tratamiento de sus datos personales es:</Paragraph>
        <InfoBox>
          <p className="font-ui text-sm font-semibold text-[var(--color-marino)] mb-1">
            Dr. Pablo De Luca
          </p>
          <p className="font-body text-sm text-[var(--color-carbon-soft)]">
            Matrícula: {siteConfig.matricula} — {siteConfig.colegioName}
          </p>
          <p className="font-body text-sm text-[var(--color-carbon-soft)]">
            Email:{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-[var(--color-marino)] underline underline-offset-2 hover:text-[var(--color-dorado-deep)]"
            >
              {siteConfig.email}
            </a>
          </p>
          <p className="font-body text-sm text-[var(--color-carbon-soft)]">
            Domicilio: {siteConfig.addressFull}
          </p>
        </InfoBox>

        {/* § 2 — Datos recolectados */}
        <SectionTitle id="datos-recolectados">2. Datos personales que recolectamos</SectionTitle>
        <Paragraph>
          Recolectamos únicamente los datos necesarios para brindar los servicios solicitados. Los
          datos varían según el canal de contacto:
        </Paragraph>
        <p className="font-ui text-sm font-semibold text-[var(--color-marino)] mb-2">
          Formulario de reserva de turnos:
        </p>
        <BulletList
          items={[
            "Nombre y apellido",
            "Correo electrónico",
            "Número de teléfono",
            "Área legal de consulta",
            "Descripción breve de la situación (dato sensible — ver § 4)",
            "Fecha y hora del turno seleccionado",
            "Dirección IP truncada a subred /24 (auditoría)",
            "Agente de usuario del navegador (auditoría técnica)",
            "Fecha y hora del consentimiento",
          ]}
        />
        <p className="font-ui text-sm font-semibold text-[var(--color-marino)] mb-2 mt-4">
          Formulario de descarga de recursos (guías y modelos):
        </p>
        <BulletList
          items={[
            "Nombre",
            "Correo electrónico",
            "Área de interés legal",
            "Recurso solicitado",
            "Dirección IP parcial (auditoría)",
          ]}
        />
        <p className="font-ui text-sm font-semibold text-[var(--color-marino)] mb-2 mt-4">
          Datos técnicos recolectados automáticamente:
        </p>
        <BulletList
          items={[
            "Cookies de sesión y preferencias (ver § 9)",
            "Registros de acceso (logs del servidor)",
          ]}
        />

        {/* § 3 — Finalidad */}
        <SectionTitle id="finalidad">3. Finalidad del tratamiento</SectionTitle>
        <Paragraph>
          Los datos personales recolectados son tratados exclusivamente para las siguientes
          finalidades:
        </Paragraph>
        <BulletList
          items={[
            "Gestión y confirmación de turnos de consulta profesional",
            "Envío de comunicaciones relacionadas con el turno (confirmaciones, cancelaciones, recordatorios)",
            "Entrega del recurso jurídico solicitado por correo electrónico",
            "Cumplimiento de obligaciones legales y regulatorias",
            "Auditoría de seguridad y prevención de fraude",
          ]}
        />
        <Paragraph>
          No utilizamos los datos personales con fines de marketing directo sin consentimiento
          previo y expreso del titular.
        </Paragraph>

        {/* § 4 — Datos sensibles */}
        <SectionTitle id="datos-sensibles">4. Datos sensibles</SectionTitle>
        <InfoBox>
          <p className="font-body text-sm text-[var(--color-carbon-soft)]">
            <strong>Artículo 7, Ley 25.326:</strong> Se consideran datos sensibles aquellos que
            revelan origen racial o étnico, opiniones políticas, convicciones religiosas o morales,
            afiliación sindical, información referente a la salud o la vida sexual.
          </p>
        </InfoBox>
        <Paragraph>
          La descripción de la situación legal que usted proporciona en el formulario de reserva
          puede contener información sobre procesos judiciales, situación familiar, laboral o
          patrimonial que califica como dato sensible o semisensible conforme al artículo 7 de la
          Ley 25.326. Dicha información es recolectada con las siguientes garantías:
        </Paragraph>
        <BulletList
          items={[
            "Consentimiento expreso e informado prestado en el momento del envío del formulario",
            "Acceso restringido exclusivamente al Dr. Pablo De Luca",
            "No se cede a terceros salvo los prestadores de infraestructura indicados en § 6 bajo acuerdos de confidencialidad y DPA",
            "Conservación limitada conforme a los plazos de § 5",
          ]}
        />

        {/* § 5 — Conservación */}
        <SectionTitle id="conservacion">5. Plazos de conservación</SectionTitle>
        <Paragraph>
          Conservamos los datos personales durante el tiempo estrictamente necesario para cumplir
          las finalidades para las que fueron recolectados:
        </Paragraph>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse text-sm font-ui">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2.5 pr-4 text-[var(--color-marino)] font-semibold">
                  Tipo de dato
                </th>
                <th className="text-left py-2.5 text-[var(--color-marino)] font-semibold">
                  Plazo de conservación
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Datos de turnos (confirmados/cancelados)", "2 años desde la fecha del turno"],
                ["Datos de leads de descarga", "1 año desde la descarga"],
                ["Registros de auditoría (logs de acceso)", "5 años (requisito regulatorio)"],
                ["Datos de consentimiento", "5 años (respaldo legal)"],
              ].map(([tipo, plazo]) => (
                <tr key={tipo} className="border-b border-[var(--color-border-default)]">
                  <td className="py-2.5 pr-4 text-[var(--color-carbon-soft)]">{tipo}</td>
                  <td className="py-2.5 text-[var(--color-carbon-soft)]">{plazo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Paragraph>
          Vencidos los plazos, los datos son eliminados de forma segura o anonimizados de manera
          irreversible.
        </Paragraph>

        {/* § 6 — Cesión a terceros */}
        <SectionTitle id="cesion-terceros">6. Cesión a terceros</SectionTitle>
        <Paragraph>
          No vendemos ni cedemos datos personales a terceros con fines comerciales. Para operar el
          sitio utilizamos los siguientes prestadores de infraestructura, todos bajo acuerdos de
          procesamiento de datos (DPA) y comprometidos con el Reglamento General de Protección de
          Datos (GDPR) o marcos equivalentes:
        </Paragraph>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse text-sm font-ui">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2.5 pr-4 text-[var(--color-marino)] font-semibold">
                  Prestador
                </th>
                <th className="text-left py-2.5 pr-4 text-[var(--color-marino)] font-semibold">
                  Finalidad
                </th>
                <th className="text-left py-2.5 text-[var(--color-marino)] font-semibold">
                  Datos transferidos
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Supabase",
                  "Base de datos PostgreSQL — almacenamiento de turnos y leads",
                  "Todos los datos del formulario",
                ],
                ["Vercel", "Hosting y despliegue del sitio web", "IP, logs de acceso"],
                [
                  "Resend",
                  "Servicio de envío de correos electrónicos transaccionales",
                  "Nombre, email, datos del turno",
                ],
                [
                  "Google Calendar",
                  "Sincronización de turnos en el calendario del Dr.",
                  "Nombre, email, teléfono, área, fecha del turno",
                ],
                ["Upstash Redis", "Control de límite de solicitudes (anti-spam)", "IP anonimizada"],
              ].map(([prestador, finalidad, datos]) => (
                <tr key={prestador} className="border-b border-[var(--color-border-default)]">
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-marino)]">
                    {prestador}
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--color-carbon-soft)]">{finalidad}</td>
                  <td className="py-2.5 text-[var(--color-carbon-soft)]">{datos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* § 7 — Derechos ARCO */}
        <SectionTitle id="derechos-arco">7. Derechos ARCO</SectionTitle>
        <Paragraph>
          Conforme a los artículos 14 al 16 de la Ley 25.326, usted tiene derecho a:
        </Paragraph>
        <BulletList
          items={[
            "Acceso: solicitar información sobre sus datos personales que obran en nuestra base de datos.",
            "Rectificación: solicitar la corrección de datos inexactos o incompletos.",
            "Cancelación (supresión): solicitar la eliminación de sus datos cuando ya no sean necesarios para la finalidad para la que fueron recolectados.",
            "Oposición: oponerse al tratamiento de sus datos por razones legítimas.",
          ]}
        />
        <Paragraph>
          Para ejercer cualquiera de estos derechos, comuníquese a{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-[var(--color-marino)] underline underline-offset-2 hover:text-[var(--color-dorado-deep)]"
          >
            {siteConfig.email}
          </a>{" "}
          con el asunto <strong>&ldquo;Ejercicio de derechos ARCO&rdquo;</strong> indicando su
          nombre completo y el derecho que desea ejercer. Responderemos dentro del plazo de 5 días
          hábiles conforme al artículo 14 de la Ley 25.326.
        </Paragraph>

        {/* § 8 — AAIP */}
        <SectionTitle id="aaip">8. Inscripción ante la AAIP</SectionTitle>
        <Paragraph>
          Las bases de datos del Estudio Jurídico Dr. Pablo De Luca se encuentran inscriptas ante la{" "}
          <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>, organismo de control
          de la Ley 25.326.
        </Paragraph>
        <InfoBox>
          <p className="font-body text-sm text-[var(--color-carbon-soft)]">
            Registro AAIP N.°:{" "}
            <span className="font-semibold text-[var(--color-marino)]">
              [a confirmar por el Dr. De Luca]
            </span>{" "}
            — La verificación puede realizarse en{" "}
            <a
              href="https://servicios.aaip.gob.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-marino)] underline underline-offset-2 hover:text-[var(--color-dorado-deep)]"
            >
              servicios.aaip.gob.ar
            </a>
            .
          </p>
        </InfoBox>
        <Paragraph>
          La AAIP es el organismo competente para recibir denuncias y reclamos vinculados a la
          protección de datos personales. Puede comunicarse con la AAIP en{" "}
          <a
            href="https://www.argentina.gob.ar/aaip"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-marino)] underline underline-offset-2 hover:text-[var(--color-dorado-deep)]"
          >
            www.argentina.gob.ar/aaip
          </a>
          .
        </Paragraph>

        {/* § 9 — Cookies */}
        <SectionTitle id="cookies">9. Cookies</SectionTitle>
        <Paragraph>
          Este sitio utiliza cookies estrictamente necesarias para su funcionamiento. No utilizamos
          cookies de rastreo publicitario ni compartimos datos de navegación con terceros con fines
          publicitarios.
        </Paragraph>
        <BulletList
          items={[
            "Cookies de sesión: almacenan preferencias temporales durante su visita y se eliminan al cerrar el navegador.",
            "Cookies técnicas: necesarias para el correcto funcionamiento del sitio (formularios, seguridad).",
          ]}
        />
        <Paragraph>
          Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la
          funcionalidad del sitio.
        </Paragraph>

        {/* § 10 — Cambios */}
        <SectionTitle id="cambios">10. Cambios a esta política</SectionTitle>
        <Paragraph>
          Nos reservamos el derecho de actualizar esta política de privacidad para reflejar cambios
          en nuestras prácticas o en la legislación aplicable. La fecha de última actualización se
          indica al inicio de este documento. Le notificaremos cambios significativos por correo
          electrónico cuando contemos con su dirección de email.
        </Paragraph>

        {/* § 11 — Contacto */}
        <SectionTitle id="contacto-privacidad">11. Contacto de privacidad</SectionTitle>
        <Paragraph>
          Para consultas sobre privacidad, ejercicio de derechos ARCO o cualquier aspecto del
          tratamiento de sus datos personales, contáctese con:
        </Paragraph>
        <InfoBox>
          <p className="font-ui text-sm font-semibold text-[var(--color-marino)] mb-1">
            Responsable de privacidad de datos
          </p>
          <p className="font-body text-sm text-[var(--color-carbon-soft)]">
            Dr. Pablo De Luca — Estudio Jurídico
          </p>
          <p className="font-body text-sm text-[var(--color-carbon-soft)]">
            Email:{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-[var(--color-marino)] underline underline-offset-2 hover:text-[var(--color-dorado-deep)]"
            >
              {siteConfig.email}
            </a>
          </p>
          <p className="font-body text-sm text-[var(--color-carbon-soft)] mt-1">
            Asunto: &ldquo;Consulta de privacidad&rdquo;
          </p>
        </InfoBox>

        <hr className="border-[var(--color-border-default)] my-10" />

        {/* Footer legal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <p className="font-ui text-xs text-[var(--color-text-tertiary)]">
            Política vigente desde el {LAST_UPDATED_DISPLAY}
          </p>
          <div className="flex gap-4">
            <Link
              href="/terminos"
              className="font-ui text-xs text-[var(--color-marino)] underline underline-offset-2 hover:text-[var(--color-dorado-deep)] transition-colors"
            >
              Términos de uso
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
