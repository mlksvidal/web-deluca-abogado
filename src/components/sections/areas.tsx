/**
 * Areas — Sección "Áreas de práctica" (2×2 grid).
 *
 * 4 cards: Civil/Familia, Laboral, Penal, Comercial.
 * Hover: lift + dorado border + underline animado.
 * Icon-frame: 56×56 border dorado, hover invierte (bg marino + color dorado).
 * Reveal stagger 80-320ms.
 */

import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/utils/reveal";
import { practiceAreas, type PracticeArea } from "@/lib/practice-areas-data";

// Íconos SVG inline — sin dependencia de archivos externos en placeholder
function IconBalanza() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 3v22M7 25h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 10l4 8H1l4-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 10l4 8h-8l4-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M5 10h18"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
    </svg>
  );
}
function IconGavel() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="19" width="22" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 13v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconEscudo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 3L4 7v8c0 5.5 4.4 10.7 10 12 5.6-1.3 10-6.5 10-12V7L14 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 14l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconEdificio() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="4" y="8" width="20" height="17" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 25V17h10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="9" y="11" width="3" height="3" rx=".5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="16" y="11" width="3" height="3" rx=".5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M10 3h8l2 5H8L10 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICON_MAP: Record<PracticeArea["icon"], React.FC> = {
  balanza: IconBalanza,
  gavel: IconGavel,
  escudo: IconEscudo,
  edificio: IconEdificio,
};

const STAGGER_DELAYS = [80, 160, 240, 320];

export function Areas() {
  return (
    <Section id="areas" variant="alt" aria-labelledby="areas-heading">
      <Container>
        {/* Header */}
        <div className="areas-header">
          <div className="areas-header-text">
            <Reveal>
              <span
                style={{
                  fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "var(--color-dorado-deep, #B89344)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: "32px",
                    height: "1px",
                    background: "var(--color-dorado-deep, #B89344)",
                    flexShrink: 0,
                  }}
                />
                Áreas de práctica
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2
                id="areas-heading"
                style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                  fontSize: "clamp(2rem, 1.4rem + 2vw, 3rem)",
                  fontWeight: 500,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "var(--color-marino, #0F1E3D)",
                  marginBottom: "0",
                }}
              >
                Cuatro especialidades, una misma{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--color-dorado-deep, #B89344)",
                  }}
                >
                  forma
                </em>{" "}
                de trabajar
              </h2>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <p
              style={{
                fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                fontSize: ".95rem",
                lineHeight: 1.6,
                color: "var(--color-carbon-soft, #3A3A3A)",
                maxWidth: "360px",
              }}
            >
              Diagnóstico honesto, estrategia clara y comunicación directa. Sin tecnicismos
              innecesarios ni plazos inflados.
            </p>
          </Reveal>
        </div>

        {/* Grid 2×2 */}
        <div className="areas-grid" role="list">
          {practiceAreas.map((area, i) => {
            const Icon = ICON_MAP[area.icon];
            return (
              <Reveal
                key={area.id}
                delay={STAGGER_DELAYS[i]}
                variant={i % 2 === 0 ? "left" : "right"}
              >
                <article className="area-card" role="listitem" aria-label={`Área: ${area.label}`}>
                  {/* Icon frame 56×56 */}
                  <div
                    className="area-icon"
                    aria-hidden="true"
                    style={{
                      width: "56px",
                      height: "56px",
                      border: "1px solid var(--color-dorado, #C9A961)",
                      display: "grid",
                      placeItems: "center",
                      marginBottom: "28px",
                      color: "var(--color-dorado-deep, #B89344)",
                      flexShrink: 0,
                      transition:
                        "border-color .4s cubic-bezier(.22,1,.36,1), background .4s cubic-bezier(.22,1,.36,1), color .4s cubic-bezier(.22,1,.36,1)",
                    }}
                  >
                    <Icon />
                  </div>

                  {/* Título */}
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                      fontSize: "1.5rem",
                      fontWeight: 500,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                      color: "var(--color-marino, #0F1E3D)",
                      marginBottom: "12px",
                    }}
                  >
                    {area.label}
                  </h3>

                  {/* Descripción */}
                  <p
                    style={{
                      fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                      fontSize: ".95rem",
                      lineHeight: 1.6,
                      color: "var(--color-carbon-soft, #3A3A3A)",
                      marginBottom: "20px",
                    }}
                  >
                    {area.description}
                  </p>

                  {/* Sub-temas */}
                  <ul
                    role="list"
                    aria-label={`Sub-temas de ${area.label}`}
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      marginBottom: "28px",
                      flex: 1,
                    }}
                  >
                    {area.subtemas.map((sub) => (
                      <li
                        key={sub}
                        style={{
                          fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                          fontSize: ".83rem",
                          color: "var(--color-carbon-soft, #3A3A3A)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: "var(--color-dorado, #C9A961)",
                            flexShrink: 0,
                          }}
                        />
                        {sub}
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link
                    href="#estudio"
                    className="area-link"
                    aria-label={`Consultar sobre ${area.label}`}
                    style={{
                      fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                      fontSize: "13px",
                      fontWeight: 500,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--color-marino, #0F1E3D)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      textDecoration: "none",
                    }}
                  >
                    Consultar
                    <span
                      className="area-link-arrow"
                      aria-hidden="true"
                      style={{
                        transition: "transform .25s cubic-bezier(.22,1,.36,1)",
                      }}
                    >
                      →
                    </span>
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>

      <style>{`
        /* Header centrado */
        .areas-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
          margin-bottom: 64px;
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }
        .areas-header-text { max-width: 720px; }
        .areas-header p { max-width: 56ch !important; margin-left: auto; margin-right: auto; }

        /* Grid 2×2 */
        .areas-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 640px) {
          .areas-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Card */
        .area-card {
          background: var(--color-bg-primary, #FAF7F2);
          border: 1px solid rgba(15,30,61,.1);
          padding: 48px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          cursor: default;
          transition: transform .45s cubic-bezier(.22,1,.36,1),
                      border-color .45s cubic-bezier(.22,1,.36,1),
                      box-shadow .45s cubic-bezier(.22,1,.36,1);
        }
        .area-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(135deg, transparent 40%, rgba(201,169,97,.04) 100%);
          opacity: 0;
          transition: opacity .5s cubic-bezier(.22,1,.36,1);
          pointer-events: none;
        }
        .area-card::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: var(--color-dorado, #C9A961);
          transition: width .4s cubic-bezier(.22,1,.36,1);
        }
        .area-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-dorado, #C9A961);
          box-shadow: 0 24px 48px -16px rgba(15,30,61,.12);
        }
        .area-card:hover::before { opacity: 1; }
        .area-card:hover::after { width: 100%; }
        .area-card:hover .area-icon {
          background: var(--color-marino, #0F1E3D);
          border-color: var(--color-dorado-deep, #B89344);
          color: var(--color-dorado, #C9A961);
        }
        .area-card:hover .area-link-arrow { transform: translateX(4px); }

        /* Mobile padding adjust */
        @media (max-width: 640px) {
          .area-card { padding: 32px 28px; }
        }
      `}</style>
    </Section>
  );
}
