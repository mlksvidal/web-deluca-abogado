/**
 * Contacto — Sección "El Estudio" + Mapa + CTA.
 *
 * id="estudio" para nav anchor.
 * Split layout: info izquierda | mapa/placeholder derecha.
 * Tabla 4 datos: Dirección, Horario, WhatsApp, Email.
 * Si mapEmbedUrl tiene URL real → iframe; sino → placeholder SVG con pin animado.
 */

import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/utils/reveal";
import { siteConfig } from "@/lib/site-config";

const IS_REAL_MAP = siteConfig.mapEmbedUrl && !siteConfig.mapEmbedUrl.includes("placeholder");

const DATOS_CONTACTO = [
  {
    label: "Dirección",
    value: siteConfig.addressFull,
    note: `${siteConfig.city}, ${siteConfig.province}`,
  },
  {
    label: "Horario",
    value: siteConfig.horariosDisplay,
    note: "Consultas a distancia: por WhatsApp",
  },
  {
    label: "WhatsApp",
    value: siteConfig.whatsappDisplay,
    href: `https://wa.me/${siteConfig.whatsapp}`,
    note: "Respuesta en menos de 24h",
  },
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    note: null,
  },
];

export function Contacto() {
  return (
    <Section id="estudio" variant="default" aria-labelledby="contacto-heading">
      <Container>
        <div className="contacto-grid">
          {/* ── Columna izquierda: info ── */}
          <div className="contacto-info">
            {/* Kicker */}
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
                El estudio
              </span>
            </Reveal>

            {/* H2 */}
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
                  marginBottom: "20px",
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

            {/* Bajada */}
            <Reveal delay={120}>
              <p
                style={{
                  fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: "var(--color-carbon-soft, #3A3A3A)",
                  maxWidth: "460px",
                  marginBottom: "36px",
                }}
              >
                Atención presencial con turno previo en San Rafael, Mendoza. También atendemos
                consultas a distancia para clientes de toda la Argentina.
              </p>
            </Reveal>

            {/* Tabla de datos */}
            <Reveal delay={160}>
              <dl
                aria-label="Datos de contacto del estudio"
                style={{
                  borderTop: "1px solid rgba(15,30,61,.1)",
                  marginBottom: "40px",
                }}
              >
                {DATOS_CONTACTO.map((dato) => (
                  <div
                    key={dato.label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr",
                      padding: "20px 0",
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
                      {dato.label}
                    </dt>
                    <dd style={{ margin: 0 }}>
                      {dato.href ? (
                        <a
                          href={dato.href}
                          target={dato.href.startsWith("https") ? "_blank" : undefined}
                          rel={dato.href.startsWith("https") ? "noopener noreferrer" : undefined}
                          className="contacto-dato-link"
                        >
                          {dato.value}
                        </a>
                      ) : (
                        <span
                          style={{
                            fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                            color: "var(--color-marino, #0F1E3D)",
                            fontWeight: 500,
                            display: "block",
                          }}
                        >
                          {dato.value}
                        </span>
                      )}
                      {dato.note && (
                        <small
                          style={{
                            display: "block",
                            fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                            fontSize: ".8rem",
                            color: "var(--color-carbon-soft, #3A3A3A)",
                            fontWeight: 400,
                            marginTop: "4px",
                          }}
                        >
                          {dato.note}
                        </small>
                      )}
                    </dd>
                  </div>
                ))}
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

          {/* ── Columna derecha: mapa ── */}
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
                    viewBox="0 0 400 420"
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
                    <line x1="0" y1="80" x2="400" y2="80" stroke="#0F1E3D" strokeWidth="1" />
                    <line x1="0" y1="160" x2="400" y2="160" stroke="#0F1E3D" strokeWidth="2" />
                    <line x1="0" y1="240" x2="400" y2="240" stroke="#0F1E3D" strokeWidth="1" />
                    <line x1="0" y1="320" x2="400" y2="320" stroke="#0F1E3D" strokeWidth="1.5" />
                    <line x1="0" y1="380" x2="400" y2="380" stroke="#0F1E3D" strokeWidth="1" />
                    {/* Verticales */}
                    <line x1="60" y1="0" x2="60" y2="420" stroke="#0F1E3D" strokeWidth="1" />
                    <line x1="140" y1="0" x2="140" y2="420" stroke="#0F1E3D" strokeWidth="2" />
                    <line x1="240" y1="0" x2="240" y2="420" stroke="#0F1E3D" strokeWidth="1" />
                    <line x1="320" y1="0" x2="320" y2="420" stroke="#0F1E3D" strokeWidth="1.5" />
                    {/* Manzanas rellenas */}
                    <rect
                      x="65"
                      y="85"
                      width="70"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".06"
                      rx="2"
                    />
                    <rect
                      x="145"
                      y="85"
                      width="90"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".04"
                      rx="2"
                    />
                    <rect
                      x="245"
                      y="85"
                      width="70"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".06"
                      rx="2"
                    />
                    <rect
                      x="65"
                      y="165"
                      width="70"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".04"
                      rx="2"
                    />
                    <rect
                      x="145"
                      y="165"
                      width="90"
                      height="70"
                      fill="#C9A961"
                      fillOpacity=".12"
                      rx="2"
                    />
                    <rect
                      x="245"
                      y="165"
                      width="70"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".06"
                      rx="2"
                    />
                    <rect
                      x="65"
                      y="245"
                      width="70"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".06"
                      rx="2"
                    />
                    <rect
                      x="145"
                      y="245"
                      width="90"
                      height="70"
                      fill="#0F1E3D"
                      fillOpacity=".04"
                      rx="2"
                    />
                    <rect
                      x="245"
                      y="245"
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
                      top: "46%",
                      left: "50%",
                      transform: "translate(-50%, -100%)",
                      zIndex: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* Círculo pin */}
                    <div
                      className="pin-icon"
                      style={{
                        width: "36px",
                        height: "36px",
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
                        width="16"
                        height="16"
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
                    {/* Label */}
                    <div
                      style={{
                        background: "var(--color-marino, #0F1E3D)",
                        color: "var(--color-bg-primary, #FAF7F2)",
                        fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                        fontSize: "10px",
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        padding: "5px 10px",
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
                      bottom: "16px",
                      left: "16px",
                      background: "var(--color-bg-primary, #FAF7F2)",
                      padding: "8px 14px",
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
        /* Dato link */
        .contacto-dato-link {
          font-family: var(--font-lora, Lora, Georgia, serif);
          color: var(--color-marino, #0F1E3D);
          font-weight: 500;
          text-decoration: none;
          display: block;
          transition: color .25s cubic-bezier(.22,1,.36,1);
        }
        .contacto-dato-link:hover {
          color: var(--color-dorado-deep, #B89344);
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
            grid-template-columns: 1fr 1.1fr;
            gap: 80px;
          }
        }

        .contacto-mapa {
          position: relative;
          aspect-ratio: 1 / 1.05;
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
