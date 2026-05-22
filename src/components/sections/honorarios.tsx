/**
 * Honorarios — Tabla de tarifas orientativas.
 *
 * Sección bg-warm / blanco roto.
 * Tabla institucional sobria: 4 áreas × 4 columnas.
 * Zebra stripes sutiles. Disclaimer prominente.
 * Reveal on scroll.
 */

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/utils/reveal";

const TARIFAS = [
  {
    area: "Civil y Familia",
    modalidad: "Por etapas",
    rango: "Desde $500.000",
    pago: "Etapas o forfait",
  },
  {
    area: "Laboral",
    modalidad: "% de indemnización",
    rango: "10–15% del recupero",
    pago: "Al cobrar",
  },
  {
    area: "Penal",
    modalidad: "Por instancia",
    rango: "Desde $600.000",
    pago: "50% inicial + saldo",
  },
  {
    area: "Comercial",
    modalidad: "Forfait o por caso",
    rango: "Desde $400.000/mes",
    pago: "Mensual o por caso",
  },
] as const;

const COLS = ["Área", "Modalidad", "Rango orientativo", "Forma de pago"] as const;

export function Honorarios() {
  return (
    <Section id="honorarios" variant="alt" aria-labelledby="honorarios-heading">
      <Container>
        {/* Header */}
        <div style={{ maxWidth: "640px", marginBottom: "56px" }}>
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
              Honorarios
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2
              id="honorarios-heading"
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                fontSize: "clamp(2rem, 1.4rem + 2vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "var(--color-marino, #0F1E3D)",
                marginBottom: "20px",
              }}
            >
              Tarifas claras,{" "}
              <em
                style={{
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--color-dorado-deep, #B89344)",
                }}
              >
                sin sorpresas.
              </em>
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p
              style={{
                fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                fontSize: "1rem",
                lineHeight: 1.65,
                color: "var(--color-carbon-soft, #3A3A3A)",
              }}
            >
              Rangos orientativos en pesos argentinos. La cifra final se acuerda por escrito al
              inicio del caso. Primera consulta sin cargo.
            </p>
          </Reveal>
        </div>

        {/* Tabla — scroll horizontal en mobile */}
        <Reveal delay={160}>
          <div className="hon-table-wrap">
            <table className="hon-table" aria-label="Tabla de honorarios orientativos">
              <thead>
                <tr>
                  {COLS.map((col) => (
                    <th key={col} scope="col" className="hon-th">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TARIFAS.map((fila, i) => (
                  <tr key={fila.area} className={`hon-tr ${i % 2 === 1 ? "hon-tr--alt" : ""}`}>
                    <td className="hon-td hon-td--area">{fila.area}</td>
                    <td className="hon-td">{fila.modalidad}</td>
                    <td className="hon-td hon-td--rango">{fila.rango}</td>
                    <td className="hon-td">{fila.pago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Disclaimer */}
        <Reveal delay={220}>
          <aside
            className="hon-disclaimer"
            role="note"
            aria-label="Aclaración sobre los honorarios"
          >
            <span className="hon-disclaimer-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="7.5"
                  stroke="var(--color-dorado-deep, #B89344)"
                  strokeWidth="1"
                />
                <path
                  d="M8 5v4M8 10.5v.5"
                  stroke="var(--color-dorado-deep, #B89344)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <p className="hon-disclaimer-text">
              Los rangos son orientativos. El honorario definitivo depende del análisis del caso,
              complejidad y duración estimada.{" "}
              <strong>Se entrega presupuesto por escrito antes de iniciar cualquier tarea.</strong>
            </p>
          </aside>
        </Reveal>
      </Container>

      <style>{`
        /* ── Tabla wrapper — scroll horizontal en mobile ── */
        .hon-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border: 1px solid rgba(15,30,61,.1);
          border-radius: 4px;
          margin-bottom: 32px;
        }

        .hon-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 540px;
        }

        /* Headers */
        .hon-th {
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .14em;
          color: var(--color-carbon-soft, #3A3A3A);
          background: rgba(15,30,61,.04);
          padding: 14px 20px;
          text-align: left;
          border-bottom: 1px solid rgba(15,30,61,.1);
          white-space: nowrap;
        }

        /* Rows */
        .hon-tr {
          border-bottom: 1px solid rgba(15,30,61,.06);
          transition: background .2s ease;
        }
        .hon-tr:last-child {
          border-bottom: none;
        }
        .hon-tr:hover {
          background: rgba(15,30,61,.025);
        }
        .hon-tr--alt {
          background: rgba(15,30,61,.025);
        }
        .hon-tr--alt:hover {
          background: rgba(15,30,61,.045);
        }

        /* Cells */
        .hon-td {
          font-family: var(--font-lora, Lora, Georgia, serif);
          font-size: 15px;
          color: var(--color-carbon-soft, #3A3A3A);
          padding: 18px 20px;
          vertical-align: middle;
          line-height: 1.4;
        }
        .hon-td--area {
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-weight: 600;
          color: var(--color-marino, #0F1E3D);
          font-size: 14px;
          white-space: nowrap;
        }
        .hon-td--rango {
          font-weight: 500;
          color: var(--color-marino, #0F1E3D);
        }

        /* ── Disclaimer ── */
        .hon-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 18px 20px;
          background: rgba(201,169,97,.07);
          border: 1px solid rgba(201,169,97,.25);
          border-left: 3px solid var(--color-dorado, #C9A961);
          border-radius: 2px;
        }
        .hon-disclaimer-icon {
          flex-shrink: 0;
          margin-top: 2px;
          display: flex;
        }
        .hon-disclaimer-text {
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: .85rem;
          color: var(--color-carbon-soft, #3A3A3A);
          line-height: 1.6;
          margin: 0;
        }
        .hon-disclaimer-text strong {
          color: var(--color-marino, #0F1E3D);
          font-weight: 600;
        }
      `}</style>
    </Section>
  );
}
