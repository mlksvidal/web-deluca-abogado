/**
 * Casos — Sección "Casos resueltos" (3 cards narrativas).
 *
 * Background marino, texto blanco roto.
 * Cada card: badge área + duración, h3, descripción, bloque RESULTADO.
 * Hover: card sube, border más visible, underline top animado.
 * Disclaimer al pie.
 */

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/utils/reveal";
import { casosResueltos } from "@/lib/casos-data";

const STAGGER_DELAYS = [80, 160, 240];

export function Casos() {
  return (
    <Section id="casos" variant="dark" aria-labelledby="casos-heading">
      <Container>
        {/* Header */}
        <div className="casos-header">
          <Reveal>
            <span
              style={{
                fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "var(--color-dorado, #C9A961)",
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
                  background: "var(--color-dorado, #C9A961)",
                  flexShrink: 0,
                }}
              />
              Casos resueltos
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2
              id="casos-heading"
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                fontSize: "clamp(2rem, 1.4rem + 2vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "var(--color-bg-primary, #FAF7F2)",
                marginBottom: "64px",
                maxWidth: "680px",
              }}
            >
              Tres historias reales,{" "}
              <em
                style={{
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--color-dorado, #C9A961)",
                }}
              >
                resultados concretos
              </em>
            </h2>
          </Reveal>
        </div>

        {/* Grid 3 cards */}
        <div className="casos-grid" role="list">
          {casosResueltos.map((caso, i) => (
            <Reveal key={caso.id} delay={STAGGER_DELAYS[i]}>
              <article className="caso-card" role="listitem" aria-label={`Caso: ${caso.titulo}`}>
                {/* Header: badge área + duración */}
                <div
                  className="caso-card-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "16px",
                    borderBottom: "1px solid rgba(250,247,242,.08)",
                    marginBottom: "20px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                      fontSize: ".7rem",
                      textTransform: "uppercase",
                      letterSpacing: ".2em",
                      color: "var(--color-dorado, #C9A961)",
                      padding: "5px 10px",
                      border: "1px solid rgba(201,169,97,.4)",
                      borderRadius: "2px",
                    }}
                  >
                    {caso.area}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                      fontSize: ".78rem",
                      color: "rgba(250,247,242,.55)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    aria-label={`Duración: ${caso.duracionMeses} meses`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" strokeLinecap="round" />
                    </svg>
                    {caso.duracionMeses} meses
                  </span>
                </div>

                {/* Título */}
                <h3
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                    fontSize: "1.2rem",
                    fontWeight: 500,
                    lineHeight: 1.35,
                    letterSpacing: "-0.01em",
                    color: "var(--color-bg-primary, #FAF7F2)",
                    marginBottom: "16px",
                  }}
                >
                  {caso.titulo}
                </h3>

                {/* Descripción */}
                <p
                  style={{
                    fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                    fontSize: ".92rem",
                    lineHeight: 1.6,
                    color: "rgba(250,247,242,.7)",
                    flex: 1,
                    margin: 0,
                  }}
                >
                  {caso.descripcion}
                </p>

                {/* Resultado */}
                <div
                  style={{
                    paddingTop: "18px",
                    borderTop: "1px solid rgba(250,247,242,.08)",
                    marginTop: "20px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                      fontSize: ".7rem",
                      textTransform: "uppercase",
                      letterSpacing: ".18em",
                      color: "var(--color-dorado, #C9A961)",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Resultado
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                      fontStyle: "italic",
                      fontSize: ".92rem",
                      lineHeight: 1.55,
                      color: "rgba(250,247,242,.92)",
                      margin: 0,
                    }}
                  >
                    {caso.resultado}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Disclaimer */}
        <Reveal delay={320}>
          <div
            role="note"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "18px 24px",
              background: "rgba(250,247,242,.04)",
              borderLeft: "3px solid var(--color-dorado, #C9A961)",
              marginTop: "40px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-dorado, #C9A961)"
              strokeWidth="1.5"
              style={{ flexShrink: 0 }}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>
            <p
              style={{
                fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                fontSize: ".82rem",
                color: "rgba(250,247,242,.6)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Los nombres, fechas y detalles fueron alterados para proteger a los clientes. El
              secreto profesional es innegociable. Los resultados pasados no garantizan resultados
              futuros.
            </p>
          </div>
        </Reveal>
      </Container>

      <style>{`
        .casos-header { margin-bottom: 0; }

        .casos-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 1024px) {
          .casos-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .caso-card {
          background: rgba(250,247,242,.04);
          border: 1px solid rgba(201,169,97,.18);
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: transform .45s cubic-bezier(.22,1,.36,1),
                      border-color .45s cubic-bezier(.22,1,.36,1),
                      background .45s cubic-bezier(.22,1,.36,1);
        }
        .caso-card::after {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 0; height: 2px;
          background: var(--color-dorado, #C9A961);
          transition: width .5s cubic-bezier(.22,1,.36,1);
        }
        .caso-card:hover {
          background: rgba(250,247,242,.06);
          border-color: rgba(201,169,97,.5);
          transform: translateY(-4px);
        }
        .caso-card:hover::after { width: 100%; }

        @media (max-width: 640px) {
          .caso-card { padding: 28px 24px; }
        }
      `}</style>
    </Section>
  );
}
