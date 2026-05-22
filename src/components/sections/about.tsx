/**
 * About — Sección trayectoria del Dr. Pablo De Luca.
 *
 * Layout refinado: sin lista de credenciales vertical.
 * 3 stats horizontales compactos reemplazan la lista.
 * Sello matrícula movido al footer (no se duplica aquí).
 */

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/utils/reveal";
import { siteConfig } from "@/lib/site-config";

const STATS = [
  { value: siteConfig.matricula, label: "Matrícula habilitada" },
  { value: "UNCuyo", label: "Universidad Nacional de Cuyo" },
  { value: "15+", label: "años en San Rafael" },
];

export function About() {
  return (
    <Section id="trayectoria" variant="default" aria-labelledby="about-heading">
      <Container>
        <div className="about-grid">
          {/* ── Columna izquierda: foto placeholder ── */}
          <Reveal threshold={0.1} className="about-photo-col">
            <div
              className="about-photo"
              data-placeholder="dr-photo-about"
              style={{
                position: "relative",
                aspectRatio: "4/5",
                maxWidth: "380px",
                background: "linear-gradient(135deg, #E8E0D0 0%, #D4C5A8 100%)",
                border: "1px solid rgba(201,169,97,.4)",
                overflow: "hidden",
              }}
            >
              {/* Marco dorado interior */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  right: "20px",
                  bottom: "20px",
                  border: "1px solid var(--color-dorado, #C9A961)",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
              {/* Placeholder */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  zIndex: 1,
                  background:
                    "repeating-linear-gradient(45deg, transparent 0, transparent 20px, rgba(15,30,61,.03) 20px, rgba(15,30,61,.03) 21px)",
                }}
              >
                <div>
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-marino, #0F1E3D)"
                    strokeWidth="1.2"
                    style={{ opacity: 0.4, marginBottom: "14px" }}
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                  </svg>
                  <div
                    style={{
                      fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                      fontSize: "11px",
                      letterSpacing: ".2em",
                      textTransform: "uppercase",
                      color: "var(--color-marino, #0F1E3D)",
                      opacity: 0.6,
                    }}
                  >
                    Retrato oficial
                    <br />· se reemplazará ·
                  </div>
                </div>
              </div>

              {/* Badge inferior */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-1px",
                  left: "20px",
                  background: "var(--color-marino, #0F1E3D)",
                  color: "var(--color-bg-primary, #FAF7F2)",
                  padding: "10px 18px",
                  zIndex: 3,
                  fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    opacity: 0.65,
                    marginBottom: "3px",
                    display: "block",
                  }}
                >
                  Abogado · San Rafael, Mendoza
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {siteConfig.drName}
                </span>
              </div>
            </div>
          </Reveal>

          {/* ── Columna derecha: texto ── */}
          <div className="about-text-col">
            {/* Kicker */}
            <Reveal>
              <span
                className="about-kicker"
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
                  marginBottom: "24px",
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
                Conoce al Dr.
              </span>
            </Reveal>

            {/* H2 */}
            <Reveal delay={80}>
              <h2
                id="about-heading"
                style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                  fontSize: "clamp(2rem, 1.4rem + 2vw, 3rem)",
                  fontWeight: 500,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "var(--color-marino, #0F1E3D)",
                  marginBottom: "28px",
                }}
              >
                Trayectoria construida caso{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--color-dorado-deep, #B89344)",
                  }}
                >
                  a caso
                </em>
              </h2>
            </Reveal>

            {/* Párrafos */}
            <Reveal delay={120}>
              <p
                style={{
                  fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: "var(--color-carbon-soft, #3A3A3A)",
                  marginBottom: "16px",
                  maxWidth: "520px",
                }}
              >
                El Dr. Pablo De Luca es abogado egresado de la Universidad Nacional de Cuyo con más
                de 15 años de ejercicio profesional en San Rafael, Mendoza. Su práctica cubre las
                ramas más demandadas del derecho privado: civil, familia, laboral, penal y
                comercial.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: "var(--color-carbon-soft, #3A3A3A)",
                  marginBottom: "48px",
                  maxWidth: "520px",
                }}
              >
                Trabaja con un método claro: diagnóstico honesto del caso, estrategia transparente y
                comunicación directa en cada etapa. Sin tecnicismos innecesarios, sin promesas
                vacías.
              </p>
            </Reveal>

            {/* 3 stats horizontales */}
            <Reveal delay={160}>
              <dl className="about-stats" aria-label="Datos de trayectoria">
                {STATS.map((stat, i) => (
                  <div key={i} className="about-stat">
                    <dt
                      style={{
                        fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: ".16em",
                        color: "var(--color-carbon-soft, #3A3A3A)",
                        marginBottom: "6px",
                        opacity: 0.7,
                      }}
                    >
                      {stat.label}
                    </dt>
                    <dd
                      style={{
                        fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                        fontSize: "1.35rem",
                        fontWeight: 500,
                        color: "var(--color-marino, #0F1E3D)",
                        letterSpacing: "-0.01em",
                        margin: 0,
                      }}
                    >
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr 1.3fr;
            gap: 80px;
          }
        }
        .about-photo-col {
          max-width: 380px;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .about-photo-col {
            max-width: unset;
          }
        }

        /* Stats row */
        .about-stats {
          display: flex;
          gap: 0;
          border-top: 1px solid rgba(15,30,61,.1);
          padding-top: 0;
        }
        .about-stat {
          flex: 1;
          padding: 24px 0;
          padding-right: 24px;
          border-right: 1px solid rgba(15,30,61,.08);
        }
        .about-stat:last-child {
          border-right: none;
          padding-right: 0;
          padding-left: 24px;
        }
        .about-stat:not(:first-child):not(:last-child) {
          padding-left: 24px;
        }
        @media (max-width: 479px) {
          .about-stats {
            flex-direction: column;
            gap: 0;
          }
          .about-stat {
            border-right: none;
            border-bottom: 1px solid rgba(15,30,61,.08);
            padding: 16px 0;
          }
          .about-stat:last-child {
            border-bottom: none;
            padding-left: 0;
          }
          .about-stat:not(:first-child):not(:last-child) {
            padding-left: 0;
          }
        }
      `}</style>
    </Section>
  );
}
