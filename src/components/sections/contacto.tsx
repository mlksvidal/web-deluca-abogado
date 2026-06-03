/**
 * Contacto — Sección "El Estudio" + Mapa.
 *
 * id="estudio" para nav anchor.
 * Layout compacto: dirección + horario a la izquierda | mapa más pequeño a la derecha.
 * WhatsApp y Email se omiten aquí — ya están en el footer.
 */

import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/utils/reveal";
import { siteConfig } from "@/lib/site-config";

const IS_REAL_MAP = siteConfig.mapEmbedUrl && !siteConfig.mapEmbedUrl.includes("placeholder");

export function Contacto() {
  return (
    <Section id="estudio" variant="default" aria-labelledby="contacto-heading">
      <Container>
        {/* ── Header de sección centrado ── */}
        <div className="contacto-header">
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
                  width: "28px",
                  height: "1px",
                  background: "var(--color-dorado-deep, #B89344)",
                  flexShrink: 0,
                }}
              />
              El estudio
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: "28px",
                  height: "1px",
                  background: "var(--color-dorado-deep, #B89344)",
                  flexShrink: 0,
                }}
              />
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2
              id="contacto-heading"
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                fontSize: "clamp(1.8rem, 1.2rem + 2vw, 2.8rem)",
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "var(--color-marino, #0F1E3D)",
                marginBottom: "16px",
              }}
            >
              Encontranos en{" "}
              <em
                style={{
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--color-dorado-deep, #B89344)",
                }}
              >
                San Rafael
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
                maxWidth: "56ch",
                margin: "0 auto",
              }}
            >
              Atención presencial con turno previo en San Rafael, Mendoza. Consultas a distancia
              para toda la Argentina.
            </p>
          </Reveal>
        </div>

        <div className="contacto-grid">
          {/* ── Columna izquierda: info ── */}
          <div className="contacto-info">
            {/* Dirección + Horario — solo 2 filas compactas */}
            <Reveal delay={160}>
              <dl
                aria-label="Datos de ubicación del estudio"
                style={{
                  borderTop: "1px solid rgba(15,30,61,.1)",
                  marginBottom: "40px",
                }}
              >
                {/* Dirección */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(15,30,61,.08)",
                    alignItems: "start",
                    gap: "12px",
                  }}
                >
                  <dt
                    style={{
                      fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: ".15em",
                      color: "var(--color-carbon-soft, #3A3A3A)",
                      paddingTop: "3px",
                    }}
                  >
                    Dirección
                  </dt>
                  <dd style={{ margin: 0 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                        color: "var(--color-marino, #0F1E3D)",
                        fontWeight: 500,
                        display: "block",
                        fontSize: "1rem",
                      }}
                    >
                      {siteConfig.addressFull}
                    </span>
                    <small
                      style={{
                        display: "block",
                        fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                        fontSize: ".8rem",
                        color: "var(--color-carbon-soft, #3A3A3A)",
                        marginTop: "3px",
                      }}
                    >
                      {siteConfig.city}, {siteConfig.province}
                    </small>
                  </dd>
                </div>

                {/* Horario */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    padding: "18px 0",
                    alignItems: "start",
                    gap: "12px",
                  }}
                >
                  <dt
                    style={{
                      fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: ".15em",
                      color: "var(--color-carbon-soft, #3A3A3A)",
                      paddingTop: "3px",
                    }}
                  >
                    Horario
                  </dt>
                  <dd style={{ margin: 0 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                        color: "var(--color-marino, #0F1E3D)",
                        fontWeight: 500,
                        display: "block",
                        fontSize: "1rem",
                      }}
                    >
                      {siteConfig.horariosDisplay}
                    </span>
                    <small
                      style={{
                        display: "block",
                        fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                        fontSize: ".8rem",
                        color: "var(--color-carbon-soft, #3A3A3A)",
                        marginTop: "3px",
                      }}
                    >
                      Consultas a distancia: por WhatsApp
                    </small>
                  </dd>
                </div>
              </dl>
            </Reveal>

            {/* CTA reservar */}
            <Reveal delay={200}>
              <Link href="/reservar" className="contacto-cta-btn">
                Reservar consulta
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          {/* ── Columna derecha: mapa compacto ── */}
          <Reveal delay={120} className="contacto-mapa-col">
            <div className="contacto-mapa">
              {IS_REAL_MAP ? (
                <iframe
                  src={siteConfig.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de ubicación — ${siteConfig.studioName}`}
                />
              ) : (
                /* Panel de ubicación intencional (sin mapa falso) */
                <div className="mapa-ubicacion surface-deep grain">
                  <div className="mapa-ubicacion-inner">
                    <svg
                      className="mapa-ubicacion-pin"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-dorado, #C9A961)"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <span className="mapa-ubicacion-city">San Rafael</span>
                    <span className="mapa-ubicacion-region">Mendoza · Argentina</span>
                    <span className="mapa-ubicacion-divider" aria-hidden="true" />
                    <p className="mapa-ubicacion-note">
                      Coordinamos el punto exacto de encuentro al confirmar tu consulta.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </Container>

      <style>{`
        /* Header de sección centrado */
        .contacto-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 720px;
          margin: 0 auto 56px;
        }

        /* CTA botón */
        .contacto-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: .04em;
          text-transform: uppercase;
          background: var(--color-marino, #0F1E3D);
          color: var(--color-bg-primary, #FAF7F2);
          border-radius: 2px;
          text-decoration: none;
          box-shadow: 0 4px 12px -4px rgba(15,30,61,.3);
          transition: transform .3s cubic-bezier(.22,1,.36,1),
                      background .3s cubic-bezier(.22,1,.36,1),
                      box-shadow .4s cubic-bezier(.22,1,.36,1);
        }
        .contacto-cta-btn:hover {
          background: var(--color-marino-hover, #1E3A6E);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -8px rgba(15,30,61,.5);
        }

        .contacto-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .contacto-grid {
            grid-template-columns: 1.2fr 1fr;
            gap: 80px;
          }
        }

        /* Mapa / panel de ubicación — aspect-ratio 1:1.2 */
        .contacto-mapa {
          position: relative;
          aspect-ratio: 1 / 1.2;
          background: #E8E5DD;
          border: 1px solid rgba(15,30,61,.1);
          overflow: hidden;
        }
        .contacto-mapa iframe {
          display: block;
        }

        /* Panel de ubicación intencional (marino + grain) */
        .mapa-ubicacion {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 32px;
        }
        .mapa-ubicacion-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .mapa-ubicacion-pin {
          margin-bottom: 18px;
        }
        .mapa-ubicacion-city {
          font-family: var(--font-playfair, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.8rem, 1.2rem + 2vw, 2.6rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--color-bg-primary, #FAF7F2);
          line-height: 1;
        }
        .mapa-ubicacion-region {
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: 11px;
          letter-spacing: .24em;
          text-transform: uppercase;
          color: var(--color-dorado, #C9A961);
          margin-top: 12px;
        }
        .mapa-ubicacion-divider {
          width: 40px;
          height: 1px;
          background: rgba(201,169,97,.5);
          margin: 22px 0;
        }
        .mapa-ubicacion-note {
          font-family: var(--font-lora, Lora, Georgia, serif);
          font-style: italic;
          font-size: .92rem;
          line-height: 1.55;
          color: rgba(250,247,242,.7);
          max-width: 30ch;
          margin: 0;
        }

        @media (max-width: 640px) {
          .contacto-mapa { aspect-ratio: 4 / 3; }
        }
      `}</style>
    </Section>
  );
}
