/**
 * Valores — Strip horizontal de 5 pilares institucionales.
 *
 * Posición: entre Áreas y Casos en la landing.
 * Diseño: 5 columnas desktop / 2-col tablet / 1-col mobile.
 * Íconos: SVG inline 24×24 line-style currentColor, dorado.
 * Fondo: bg-warm (#E7DBCA) para diferenciarse de Áreas (default).
 */

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/utils/reveal";

// ─── Íconos inline 24×24, stroke 1.5, currentColor ──────────────────────────

function IconCompromiso() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2L4 6v6c0 4.5 3.5 8.5 8 10 4.5-1.5 8-5.5 8-10V6L12 2z" />
    </svg>
  );
}

function IconJusticia() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="5" y1="7" x2="19" y2="7" />
      <line x1="7" y1="7" x2="5" y2="13" />
      <path d="M3 13c0 1.5 1 2.5 4 2.5S11 14.5 11 13" />
      <line x1="17" y1="7" x2="19" y2="13" />
      <path d="M13 13c0 1.5 1 2.5 4 2.5S21 14.5 21 13" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  );
}

function IconAcompanamiento() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="6" r="2.2" />
      <path d="M5 21v-3a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v3" />
      <circle cx="16" cy="6" r="2.2" />
      <path d="M13 21v-3a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v3" />
      <path d="M11 13.5c0.6 0.4 1.4 0.6 2.2 0.3" />
    </svg>
  );
}

function IconClaridad() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2h9l4 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
      <polyline points="15 2 15 6 19 6" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="13.5" x2="16" y2="13.5" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function IconComunicacion() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
      <circle cx="9" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ─── Datos ────────────────────────────────────────────────────────────────────

const VALORES = [
  {
    icon: <IconCompromiso />,
    titulo: "Compromiso",
    descripcion:
      "Cada caso recibe dedicación total. Su problema es el nuestro desde el primer día.",
  },
  {
    icon: <IconJusticia />,
    titulo: "Justicia",
    descripcion: "Actuamos con rigor legal y ética profesional en cada etapa del proceso.",
  },
  {
    icon: <IconAcompanamiento />,
    titulo: "Acompañamiento",
    descripcion: "No estará solo. Guiamos cada paso con presencia real y disponibilidad efectiva.",
  },
  {
    icon: <IconClaridad />,
    titulo: "Claridad",
    descripcion:
      "Explicamos el derecho en términos que se entienden, sin tecnicismos innecesarios.",
  },
  {
    icon: <IconComunicacion />,
    titulo: "Comunicación",
    descripcion: "Información permanente sobre el estado de su caso, sin esperas ni incertidumbre.",
  },
] as const;

// ─── Componente ───────────────────────────────────────────────────────────────

export function Valores() {
  return (
    <Section variant="alt" aria-labelledby="valores-heading">
      <Container>
        {/* Encabezado de sección */}
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <p
              className="font-ui text-xs font-[500] uppercase text-[var(--color-dorado)] mb-3"
              style={{ letterSpacing: "0.18em" }}
            >
              Cómo trabajamos
            </p>
            <h2 id="valores-heading" className="text-[var(--color-marino)]">
              Cinco pilares que guían cada caso
            </h2>
          </div>
        </Reveal>

        {/* Grid de valores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-14 lg:gap-x-10">
          {VALORES.map((valor, index) => (
            <Reveal key={valor.titulo} delay={index * 80}>
              <div className="flex flex-col items-center text-center gap-4 min-w-0 w-full overflow-hidden px-2">
                {/* Icono frame dorado */}
                <div
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0 border border-[var(--color-dorado)] text-[var(--color-dorado)] rounded-sm"
                  aria-hidden="true"
                >
                  {valor.icon}
                </div>

                {/* Título */}
                <h3
                  className="font-ui font-[600] text-[var(--color-marino)] w-full"
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    lineHeight: 1.3,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                  }}
                >
                  {valor.titulo}
                </h3>

                {/* Descripción */}
                <p className="font-body text-sm text-[var(--color-carbon-soft)] leading-relaxed w-full">
                  {valor.descripcion}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
