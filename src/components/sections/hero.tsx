"use client";
/**
 * Hero — Sección principal editorial centrada.
 *
 * Layout: single column centered. Maximum air & breathing room.
 * Sin foto del Dr. (queda solo en About para no duplicar placeholder).
 * Sello decorativo PDL como ornamento de fondo.
 *
 * Estructura: kicker → h1 word-by-word → CTAs → micro-meta → breadcrumb pasos.
 */

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// Palabras del h1 — la palabra "criterio" lleva acento dorado
const H1_WORDS = [
  { text: "Asesoría", accent: false },
  { text: "jurídica", accent: false },
  { text: "con", accent: false },
  { text: "criterio,", accent: true },
  { text: "claridad", accent: false },
  { text: "y", accent: false },
  { text: "compromiso.", accent: false },
];

const PASOS = [
  { num: "01", titulo: "Consulta inicial sin cargo" },
  { num: "02", titulo: "Estrategia + honorarios claros" },
  { num: "03", titulo: "Acompañamiento al cierre" },
];

export function Hero() {
  return (
    <section
      className="hero-section relative overflow-hidden pt-[180px] pb-[140px] md:pt-[220px] md:pb-[180px]"
      aria-labelledby="hero-heading"
    >
      {/* Atmospheric background radials */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 50% 30%, rgba(201,169,97,.05), transparent 60%), radial-gradient(circle at 80% 80%, rgba(15,30,61,.03), transparent 60%)",
          }}
        />
      </div>

      {/* Sello decorativo PDL de fondo — opacidad muy baja */}
      <div
        aria-hidden="true"
        className="hero-ornament absolute pointer-events-none"
        style={{
          top: "120px",
          right: "-60px",
          width: "420px",
          height: "420px",
          opacity: 0.05,
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          stroke="var(--color-marino, #0F1E3D)"
          strokeWidth="0.4"
        >
          <circle cx="100" cy="100" r="95" />
          <circle cx="100" cy="100" r="80" />
          <path d="M100 20v160M20 100h160" strokeDasharray="2 4" />
          <text
            x="100"
            y="108"
            textAnchor="middle"
            fontSize="38"
            fontFamily="Playfair Display, Georgia, serif"
            fontStyle="italic"
            fill="currentColor"
            stroke="none"
          >
            PDL
          </text>
        </svg>
      </div>

      <div className="container relative z-[1]">
        {/* Hero editorial: una sola columna, centrado, máximo aire */}
        <div className="hero-editorial mx-auto text-center" style={{ maxWidth: "880px" }}>
          {/* Kicker */}
          <span
            className="hero-kicker inline-flex items-center gap-3 mb-12"
            style={{
              fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "var(--color-dorado-deep, #B89344)",
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
            {siteConfig.drName} · Abogado · Mat. {siteConfig.matricula}
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

          {/* H1 — word-by-word reveal */}
          <h1
            id="hero-heading"
            className="mb-14"
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(2.4rem, 1.5rem + 3.2vw, 4.25rem)",
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--color-marino, #0F1E3D)",
              overflow: "hidden",
            }}
          >
            {H1_WORDS.map((word, i) => (
              <span
                key={i}
                className="hero-word"
                style={
                  {
                    display: "inline-block",
                    marginRight: "0.28em",
                    "--delay": `${0.35 + i * 0.08}s`,
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
            ))}
          </h1>

          {/* CTAs */}
          <div className="hero-ctas flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href="/reservar"
              className="btn-primary-hero inline-flex items-center gap-2.5"
              style={{
                padding: "16px 32px",
                fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                background: "var(--color-marino, #0F1E3D)",
                color: "var(--color-bg-primary, #FAF7F2)",
                borderRadius: "2px",
                textDecoration: "none",
                boxShadow: "0 4px 12px -4px rgba(15,30,61,.3)",
                transition:
                  "transform .3s cubic-bezier(.22,1,.36,1), background .3s cubic-bezier(.22,1,.36,1), box-shadow .4s cubic-bezier(.22,1,.36,1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--color-marino-hover, #1E3A6E)";
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 12px 24px -8px rgba(15,30,61,.5)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--color-marino, #0F1E3D)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 12px -4px rgba(15,30,61,.3)";
              }}
            >
              Reservar consulta
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="#areas"
              className="btn-outline-hero inline-flex items-center gap-2"
              style={{
                padding: "16px 32px",
                fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                background: "transparent",
                color: "var(--color-marino, #0F1E3D)",
                border: "1px solid var(--color-marino, #0F1E3D)",
                borderRadius: "2px",
                textDecoration: "none",
                transition:
                  "transform .3s cubic-bezier(.22,1,.36,1), background .3s cubic-bezier(.22,1,.36,1), color .3s cubic-bezier(.22,1,.36,1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--color-marino, #0F1E3D)";
                el.style.color = "var(--color-bg-primary, #FAF7F2)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "transparent";
                el.style.color = "var(--color-marino, #0F1E3D)";
                el.style.transform = "translateY(0)";
              }}
            >
              Ver áreas de trabajo
            </Link>
          </div>

          {/* Micro-meta disponibilidad */}
          <div
            className="cta-meta hero-cta-meta inline-flex items-center justify-center gap-2.5 mb-20"
            style={{
              fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
              fontSize: ".8rem",
              color: "var(--color-carbon-soft, #3A3A3A)",
              letterSpacing: ".02em",
            }}
          >
            <span
              className="disp-dot"
              aria-hidden="true"
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#2EA043",
                flexShrink: 0,
                position: "relative",
                display: "inline-block",
              }}
            />
            <span>
              Próximo turno disponible:{" "}
              <strong style={{ color: "var(--color-marino, #0F1E3D)", fontWeight: 600 }}>
                jueves 10:30
              </strong>
            </span>
          </div>

          {/* Breadcrumb proceso — una sola línea sutil, centrada */}
          <div
            className="hero-proceso-line flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
            role="list"
            aria-label="Proceso de trabajo"
            style={{
              fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
              fontSize: "11px",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--color-carbon-soft, #3A3A3A)",
              opacity: 0.6,
            }}
          >
            {PASOS.map((paso, i) => (
              <div key={paso.num} role="listitem" className="inline-flex items-center gap-3">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    style={{
                      width: "12px",
                      height: "1px",
                      background: "var(--color-dorado, #C9A961)",
                      opacity: 0.6,
                    }}
                  />
                )}
                <span className="inline-flex items-baseline gap-2">
                  <span
                    style={{
                      fontWeight: 500,
                      color: "var(--color-dorado-deep, #B89344)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {paso.num}
                  </span>
                  <span style={{ textTransform: "none", letterSpacing: ".02em" }}>
                    {paso.titulo}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS animations — keyframes declarados en style tag */}
      <style>{`
        @keyframes heroWordRise {
          from { opacity: 0; transform: translateY(100%); }
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
        @keyframes dotPulseHero {
          0%   { transform: scale(.6); opacity: .5; }
          100% { transform: scale(1.9); opacity: 0; }
        }

        .hero-kicker {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) .15s both;
        }
        .hero-word {
          animation: heroWordRise 1.1s cubic-bezier(.22,1,.36,1) var(--delay, .35s) both;
        }
        .hero-ctas {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) 1.15s both;
        }
        .hero-cta-meta {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) 1.35s both;
        }
        .hero-proceso-line {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) 1.55s both;
        }
        .hero-accent::after {
          content: "";
          position: absolute;
          bottom: .08em;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-dorado, #C9A961);
          animation: heroAccentLine .8s cubic-bezier(.22,1,.36,1) 1.2s forwards;
        }
        .disp-dot::after {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: #2EA043;
          opacity: .4;
          animation: dotPulseHero 2.2s cubic-bezier(.22,1,.36,1) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-kicker,
          .hero-word,
          .hero-ctas,
          .hero-cta-meta,
          .hero-proceso-line {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .disp-dot::after { animation: none !important; }
          .hero-accent::after {
            animation: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
