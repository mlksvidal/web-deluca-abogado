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
                /* Placeholder SVG estilizado con pin dorado animado */
                <div className="mapa-placeholder" aria-hidden="true">
                  {/* Grid de calles SVG */}
                  <svg
                    viewBox="0 0 400 380"
                    fill="none"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0.35,
                    }}
                    aria-hidden="true"
                  >
                    {/* Horizontales */}
                    <line x1="0" y1="70" x2="400" y2="70" stroke="#0F1E3D" strokeWidth="1" />
                    <line x1="0" y1="140" x2="400" y2="140" stroke="#0F1E3D" strokeWidth="2" />
                    <line x1="0" y1="220" x2="400" y2="220" stroke="#0F1E3D" strokeWidth="1" />
                    <line x1="0" y1="300" x2="400" y2="300" stroke="#0F1E3D" strokeWidth="1.5" />
                    {/* Verticales */}
                    <line x1="60" y1="0" x2="60" y2="380" stroke="#0F1E3D" strokeWidth="1" />
                    <line x1="140" y1="0" x2="140" y2="380" stroke="#0F1E3D" strokeWidth="2" />
                    <line x1="240" y1="0" x2="240" y2="380" stroke="#0F1E3D" strokeWidth="1" />
                    <line x1="320" y1="0" x2="320" y2="380" stroke="#0F1E3D" strokeWidth="1.5" />
                    {/* Manzanas */}
                    <rect
                      x="65"
                      y="75"
                      width="70"
                      height="60"
                      fill="#0F1E3D"
                      fillOpacity=".06"
                      rx="2"
                    />
                    <rect
                      x="145"
                      y="75"
                      width="90"
                      height="60"
                      fill="#0F1E3D"
                      fillOpacity=".04"
                      rx="2"
                    />
                    <rect
                      x="245"
                      y="75"
                      width="70"
                      height="60"
                      fill="#0F1E3D"
                      fillOpacity=".06"
                      rx="2"
                    />
                    <rect
                      x="65"
                      y="145"
                      width="70"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".04"
                      rx="2"
                    />
                    <rect
                      x="145"
                      y="145"
                      width="90"
                      height="70"
                      fill="#C9A961"
                      fillOpacity=".12"
                      rx="2"
                    />
                    <rect
                      x="245"
                      y="145"
                      width="70"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".06"
                      rx="2"
                    />
                    <rect
                      x="65"
                      y="225"
                      width="70"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".06"
                      rx="2"
                    />
                    <rect
                      x="145"
                      y="225"
                      width="90"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".04"
                      rx="2"
                    />
                    <rect
                      x="245"
                      y="225"
                      width="70"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".06"
                      rx="2"
                    />
                  </svg>

                  {/* Pin central */}
                  <div
                    className="mapa-pin"
                    style={{
                      position: "absolute",
                      top: "44%",
                      left: "50%",
                      transform: "translate(-50%, -100%)",
                      zIndex: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="pin-icon"
                      style={{
                        width: "34px",
                        height: "34px",
                        background: "var(--color-dorado, #C9A961)",
                        border: "3px solid var(--color-bg-primary, #FAF7F2)",
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        boxShadow: "0 6px 18px rgba(0,0,0,.2)",
                        position: "relative",
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-marino, #0F1E3D)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                    </div>
                    <div
                      style={{
                        background: "var(--color-marino, #0F1E3D)",
                        color: "var(--color-bg-primary, #FAF7F2)",
                        fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                        fontSize: "10px",
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        marginTop: "6px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {siteConfig.studioNameShort}
                    </div>
                  </div>

                  {/* Overlay text */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "14px",
                      left: "14px",
                      background: "var(--color-bg-primary, #FAF7F2)",
                      padding: "7px 12px",
                      fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                      fontSize: "11px",
                      color: "var(--color-carbon-soft, #3A3A3A)",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      border: "1px solid rgba(15,30,61,.1)",
                      zIndex: 3,
                    }}
                  >
                    San Rafael, Mendoza · Dirección por confirmar
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

        /* Mapa — aspect-ratio 1:1.2 (más compacto que el original) */
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

        .mapa-placeholder {
          position: absolute;
          inset: 0;
        }

        /* Pin bounce */
        .pin-icon {
          animation: pinBounce 2.2s cubic-bezier(.22,1,.36,1) infinite;
        }
        @keyframes pinBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }

        /* Ripple rings */
        .pin-icon::before,
        .pin-icon::after {
          content: "";
          position: absolute;
          inset: -3px;
          border: 2px solid var(--color-dorado, #C9A961);
          border-radius: 50%;
          animation: pinRipple 2.4s cubic-bezier(.22,1,.36,1) infinite;
          pointer-events: none;
          opacity: 0;
        }
        .pin-icon::after { animation-delay: 1.2s; }
        @keyframes pinRipple {
          0%   { transform: scale(1); opacity: .7; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        @media (max-width: 640px) {
          .contacto-mapa { aspect-ratio: 4 / 3; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pin-icon,
          .pin-icon::before,
          .pin-icon::after {
            animation: none !important;
          }
        }
      `}</style>
    </Section>
  );
}
