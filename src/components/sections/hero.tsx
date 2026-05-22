"use client";
/**
 * Hero — Editorial book cover style.
 *
 * Single column centered, min-height 100vh con contenido centered vertical.
 * Sin foto, sin breadcrumb, sin "próximo turno", sin segunda CTA.
 * Solo: kicker fino + titular grande + divisor dorado + bajada italic + 1 CTA primaria.
 *
 * Idea: portada de libro de derecho premium.
 */

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const H1_WORDS = [
  { text: "Asesoría", accent: false, br: false },
  { text: "jurídica", accent: false, br: false },
  { text: "con", accent: false, br: true },
  { text: "criterio,", accent: true, br: false },
  { text: "claridad", accent: false, br: true },
  { text: "y", accent: false, br: false },
  { text: "compromiso.", accent: false, br: false },
];

export function Hero() {
  return (
    <section
      className="hero-section relative overflow-hidden flex items-center justify-center"
      aria-labelledby="hero-heading"
      style={{
        minHeight: "100svh",
        paddingTop: "160px",
        paddingBottom: "100px",
      }}
    >
      {/* Background atmospheric: gradiente sutil + ornamentos */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(201,169,97,.04) 0%, transparent 70%)",
          }}
        />

        {/* Líneas verticales decorativas estilo blueprint — laterales sutiles */}
        <svg
          className="absolute left-0 top-0 h-full w-[80px] opacity-[0.06]"
          viewBox="0 0 80 800"
          preserveAspectRatio="none"
        >
          <line
            x1="40"
            y1="0"
            x2="40"
            y2="800"
            stroke="var(--color-marino, #0F1E3D)"
            strokeWidth="0.5"
          />
          <line
            x1="20"
            y1="0"
            x2="20"
            y2="800"
            stroke="var(--color-marino, #0F1E3D)"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
          <line
            x1="60"
            y1="0"
            x2="60"
            y2="800"
            stroke="var(--color-marino, #0F1E3D)"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
        </svg>
        <svg
          className="absolute right-0 top-0 h-full w-[80px] opacity-[0.06]"
          viewBox="0 0 80 800"
          preserveAspectRatio="none"
        >
          <line
            x1="40"
            y1="0"
            x2="40"
            y2="800"
            stroke="var(--color-marino, #0F1E3D)"
            strokeWidth="0.5"
          />
          <line
            x1="20"
            y1="0"
            x2="20"
            y2="800"
            stroke="var(--color-marino, #0F1E3D)"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
          <line
            x1="60"
            y1="0"
            x2="60"
            y2="800"
            stroke="var(--color-marino, #0F1E3D)"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
        </svg>

        {/* Sello decorativo PDL — semi-transparente al fondo */}
        <svg
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(700px, 70vw)",
            height: "min(700px, 70vw)",
            opacity: 0.025,
            zIndex: 0,
          }}
          viewBox="0 0 400 400"
          fill="none"
          stroke="var(--color-marino, #0F1E3D)"
          strokeWidth="0.6"
          aria-hidden="true"
        >
          <circle cx="200" cy="200" r="195" />
          <circle cx="200" cy="200" r="180" />
          <circle cx="200" cy="200" r="120" strokeDasharray="3 5" />
        </svg>
      </div>

      <div className="container relative z-[1]">
        <div className="hero-editorial mx-auto text-center" style={{ maxWidth: "920px" }}>
          {/* Kicker — institutional tag superior */}
          <div className="hero-kicker mb-14 md:mb-20">
            <span
              className="inline-flex items-center gap-3 md:gap-4"
              style={{
                fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                fontSize: "10.5px",
                fontWeight: 500,
                letterSpacing: ".28em",
                textTransform: "uppercase",
                color: "var(--color-dorado-deep, #B89344)",
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
              <span>Estudio Jurídico</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{siteConfig.drName}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>Mat. {siteConfig.matricula}</span>
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
            </span>
          </div>

          {/* H1 — book cover style, multiple lines forced */}
          <h1
            id="hero-heading"
            className="hero-h1 mb-12 md:mb-14"
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(2.4rem, 1.4rem + 3.4vw, 4.5rem)",
              fontWeight: 400,
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
              color: "var(--color-marino, #0F1E3D)",
            }}
          >
            {H1_WORDS.map((word, i) => (
              <span key={i}>
                <span
                  className="hero-word inline-block"
                  style={
                    {
                      "--delay": `${0.45 + i * 0.09}s`,
                    } as React.CSSProperties
                  }
                >
                  {word.accent ? (
                    <em
                      className="hero-accent relative"
                      style={{
                        fontStyle: "italic",
                        fontWeight: 400,
                        color: "var(--color-dorado-deep, #B89344)",
                      }}
                    >
                      {word.text}
                    </em>
                  ) : (
                    word.text
                  )}
                </span>
                {word.br ? <br /> : <span> </span>}
              </span>
            ))}
          </h1>

          {/* Divisor central — línea dorada corta decorativa */}
          <div
            className="hero-divider mx-auto mb-10 md:mb-12"
            aria-hidden="true"
            style={{
              width: "64px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, var(--color-dorado, #C9A961), transparent)",
            }}
          />

          {/* Bajada — italic editorial, áreas + ubicación */}
          <p
            className="hero-bajada mb-12 md:mb-16 mx-auto"
            style={{
              fontFamily: "var(--font-lora, Lora, Georgia, serif)",
              fontSize: "clamp(.95rem, .85rem + .35vw, 1.15rem)",
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "var(--color-carbon-soft, #3A3A3A)",
              maxWidth: "640px",
            }}
          >
            Civil &amp; Familia · Laboral · Penal · Comercial
            <br />
            <span style={{ fontStyle: "normal", fontSize: ".92em", opacity: 0.75 }}>
              San Rafael, Mendoza — Consultas presenciales y a distancia para toda la Argentina.
            </span>
          </p>

          {/* CTA único primario */}
          <div className="hero-cta">
            <Link
              href="/reservar"
              className="btn-primary-hero inline-flex items-center gap-3"
              style={{
                padding: "18px 38px",
                fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                fontSize: "12.5px",
                fontWeight: 500,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                background: "var(--color-marino, #0F1E3D)",
                color: "var(--color-bg-primary, #FAF7F2)",
                borderRadius: "2px",
                textDecoration: "none",
                boxShadow: "0 4px 14px -4px rgba(15,30,61,.28)",
                transition:
                  "transform .35s cubic-bezier(.22,1,.36,1), background .3s cubic-bezier(.22,1,.36,1), box-shadow .4s cubic-bezier(.22,1,.36,1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--color-marino-hover, #1E3A6E)";
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 14px 28px -8px rgba(15,30,61,.5)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--color-marino, #0F1E3D)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 14px -4px rgba(15,30,61,.28)";
              }}
            >
              Reservar consulta
              <span aria-hidden="true">→</span>
            </Link>

            {/* Secondary link sutil */}
            <div className="mt-6">
              <Link
                href="#areas"
                className="hero-link-secondary inline-flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--color-carbon-soft, #3A3A3A)",
                  textDecoration: "none",
                  borderBottom: "1px solid transparent",
                  paddingBottom: "3px",
                  transition:
                    "color .3s cubic-bezier(.22,1,.36,1), border-color .3s cubic-bezier(.22,1,.36,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-marino, #0F1E3D)";
                  e.currentTarget.style.borderBottomColor = "var(--color-dorado, #C9A961)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-carbon-soft, #3A3A3A)";
                  e.currentTarget.style.borderBottomColor = "transparent";
                }}
              >
                Conocé las áreas de trabajo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador scroll sutil al pie del hero */}
      <div
        className="hero-scroll-indicator absolute"
        aria-hidden="true"
        style={{
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
          fontSize: "10px",
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "var(--color-carbon-soft, #3A3A3A)",
          opacity: 0.4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span>Desliza</span>
        <span
          style={{
            width: "1px",
            height: "36px",
            background: "linear-gradient(180deg, var(--color-marino, #0F1E3D), transparent)",
          }}
        />
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes heroWordRise {
          from { opacity: 0; transform: translateY(60%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroEntry {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroAccentLine {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes heroDividerGrow {
          from { width: 0; opacity: 0; }
          to   { width: 64px; opacity: 1; }
        }
        @keyframes heroScrollFade {
          0%, 100% { opacity: .4; transform: translateX(-50%) translateY(0); }
          50%      { opacity: .15; transform: translateX(-50%) translateY(4px); }
        }

        .hero-kicker {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) .2s both;
        }
        .hero-word {
          animation: heroWordRise 1.1s cubic-bezier(.22,1,.36,1) var(--delay, .45s) both;
        }
        .hero-divider {
          animation: heroDividerGrow 1s cubic-bezier(.22,1,.36,1) 1.5s both;
        }
        .hero-bajada {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) 1.7s both;
        }
        .hero-cta {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) 1.95s both;
        }
        .hero-scroll-indicator {
          animation: heroScrollFade 2.4s cubic-bezier(.22,1,.36,1) 2.5s infinite;
        }
        .hero-accent::after {
          content: "";
          position: absolute;
          bottom: .08em;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-dorado, #C9A961);
          animation: heroAccentLine .8s cubic-bezier(.22,1,.36,1) 1.4s forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-kicker,
          .hero-word,
          .hero-divider,
          .hero-bajada,
          .hero-cta,
          .hero-scroll-indicator {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .hero-divider { width: 64px !important; }
          .hero-accent::after {
            animation: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
