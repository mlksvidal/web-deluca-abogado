/**
 * About — Sección trayectoria del Dr. Pablo De Luca.
 *
 * Layout: split 2 cols (foto izquierda | texto derecha). Stack en mobile.
 * Credenciales con check-marks dorado.
 * SelloMatricula al pie.
 */

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SelloMatricula } from "@/components/trust/sello-matricula";
import { Reveal } from "@/components/utils/reveal";
import { siteConfig } from "@/lib/site-config";

const CREDENCIALES = [
  {
    titulo: "Matrícula CSJN / CAM",
    detalle: `Habilitado ante ${siteConfig.colegioName}`,
  },
  {
    titulo: "Universidad Nacional de Cuyo",
    detalle: "Abogacía — egresado con distinción",
  },
  {
    titulo: "Especialización en Derecho de Familia",
    detalle: "Posgrado — FCJ-UNCuyo",
  },
  {
    titulo: "Especialización en Derecho Laboral",
    detalle: "Programa continuo — SAIJ Mendoza",
  },
  {
    titulo: "Mediación Civil y Comercial",
    detalle: "Mediador habilitado — MJDH",
  },
  {
    titulo: "15+ años de ejercicio en San Rafael",
    detalle: "Trayectoria continua en fuero local",
  },
];

export function About() {
  return (
    <Section id="trayectoria" variant="default" aria-labelledby="about-heading">
      <Container>
        <div className="about-grid">
          {/* ── Columna izquierda: placeholder foto ── */}
          <Reveal threshold={0.1} className="about-photo-col">
            <div
              className="about-photo"
              data-placeholder="dr-photo-about"
              style={{
                position: "relative",
                aspectRatio: "4/5",
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
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-marino, #0F1E3D)"
                    strokeWidth="1.2"
                    style={{ opacity: 0.4, marginBottom: "16px" }}
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
                  padding: "12px 20px",
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
                    marginBottom: "4px",
                    display: "block",
                  }}
                >
                  Abogado — San Rafael, Mendoza
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                    fontSize: "16px",
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
                  marginBottom: "36px",
                  maxWidth: "520px",
                }}
              >
                Trabaja con un método claro: diagnóstico honesto del caso, estrategia transparente y
                comunicación directa en cada etapa. Sin tecnicismos innecesarios, sin promesas
                vacías.
              </p>
            </Reveal>

            {/* Credenciales */}
            <Reveal delay={160}>
              <ul
                role="list"
                aria-label="Credenciales y formación"
                style={{ listStyle: "none", marginBottom: "40px" }}
              >
                {CREDENCIALES.map((cred, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "14px",
                      padding: "12px 0",
                      borderBottom:
                        i < CREDENCIALES.length - 1 ? "1px solid rgba(15,30,61,.08)" : "none",
                    }}
                  >
                    {/* Check dorado */}
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        marginTop: "3px",
                        width: "18px",
                        height: "18px",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="7.5"
                          stroke="var(--color-dorado, #C9A961)"
                          strokeWidth="1"
                        />
                        <path
                          d="M4.5 8l2.5 2.5L11 5.5"
                          stroke="var(--color-dorado-deep, #B89344)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <div>
                      <span
                        style={{
                          fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                          fontSize: ".9rem",
                          fontWeight: 500,
                          color: "var(--color-marino, #0F1E3D)",
                          display: "block",
                          lineHeight: 1.35,
                        }}
                      >
                        {cred.titulo}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                          fontSize: ".8rem",
                          color: "var(--color-carbon-soft, #3A3A3A)",
                          display: "block",
                          marginTop: "2px",
                        }}
                      >
                        {cred.detalle}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Sello matrícula */}
            <Reveal delay={200}>
              <SelloMatricula variant="light" />
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
            grid-template-columns: 1fr 1.2fr;
            gap: 80px;
          }
        }
        .about-photo-col {
          max-width: 460px;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .about-photo-col {
            max-width: unset;
          }
        }
      `}</style>
    </Section>
  );
}
