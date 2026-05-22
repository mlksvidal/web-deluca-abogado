"use client";
/**
 * Hero — Sección principal de la landing.
 *
 * Layout: grid 2 cols desktop (1.15fr / 1fr), stack mobile.
 * Izquierda: kicker → h1 word-by-word → bajada → CTAs → micro-meta → 3 pasos.
 * Derecha: placeholder foto Dr. con marco dorado + badge + parallax sutil.
 *
 * Animaciones: CSS puro (keyframes) + IntersectionObserver para reduced-motion.
 * NO GSAP — motion_intensity 3, CSS alcanza.
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
  {
    num: "01",
    titulo: "Consulta inicial sin cargo",
    descripcion: "30 minutos para entender tu caso y orientarte sobre las opciones legales reales.",
  },
  {
    num: "02",
    titulo: "Estrategia + honorarios claros",
    descripcion:
      "Plan personalizado, presupuesto cerrado o por etapas. Sin sorpresas, todo por escrito.",
  },
  {
    num: "03",
    titulo: "Acompañamiento al cierre",
    descripcion:
      "Te mantenemos informado en cada paso del proceso, presencial o por canal digital.",
  },
];

export function Hero() {
  return (
    <section
      className="hero-section relative overflow-hidden pt-[160px] pb-[120px] md:pt-[200px] md:pb-[160px]"
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
              "radial-gradient(circle at 85% 30%, rgba(201,169,97,.06), transparent 50%), radial-gradient(circle at 15% 70%, rgba(15,30,61,.04), transparent 50%)",
          }}
        />
      </div>

      <div className="container relative z-[1]">
        {/* Grid hero */}
        <div
          className="hero-grid grid gap-16 md:gap-20 items-center"
          style={{
            gridTemplateColumns: "1fr",
          }}
        >
          {/* ── Columna izquierda: texto ── */}
          <div className="hero-text">
            {/* Kicker */}
            <span
              className="hero-kicker inline-flex items-center gap-3 mb-10"
              style={{
                fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: ".18em",
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
              {siteConfig.drName} · Abogado · Mat. {siteConfig.matricula}
            </span>

            {/* H1 — word-by-word reveal vía CSS animation */}
            <h1
              id="hero-heading"
              className="mb-10"
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                fontSize: "clamp(2.25rem, 1.6rem + 2.6vw, 3.75rem)",
                fontWeight: 500,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: "var(--color-marino, #0F1E3D)",
                overflow: "hidden",
                maxWidth: "16ch",
              }}
            >
              {H1_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="hero-word"
                  style={
                    {
                      display: "inline-block",
                      marginRight: "0.3em",
                      "--delay": `${0.35 + i * 0.08}s`,
                    } as React.CSSProperties
                  }
                  aria-hidden={word.accent ? undefined : undefined}
                >
                  {word.accent ? (
                    <em
                      className="hero-accent"
                      style={{
                        fontStyle: "italic",
                        fontWeight: 400,
                        color: "var(--color-dorado-deep, #B89344)",
                        position: "relative",
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
            <div className="hero-ctas flex flex-wrap gap-4 mb-6 mt-2">
              <Link
                href="/reservar"
                className="btn-primary-hero inline-flex items-center gap-2.5"
                style={{
                  padding: "14px 28px",
                  fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: ".04em",
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
                  padding: "14px 28px",
                  fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: ".04em",
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
              className="cta-meta hero-cta-meta inline-flex items-center gap-2.5 mb-16"
              style={{
                fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                fontSize: ".82rem",
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
                <strong
                  style={{
                    color: "var(--color-marino, #0F1E3D)",
                    fontWeight: 600,
                  }}
                >
                  jueves 10:30
                </strong>
              </span>
            </div>

            {/* Breadcrumb proceso — una sola línea sutil */}
            <div
              className="hero-proceso-line"
              role="list"
              aria-label="Proceso de trabajo"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px 14px",
                fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                fontSize: "12px",
                letterSpacing: ".06em",
                color: "var(--color-carbon-soft, #3A3A3A)",
                opacity: 0.85,
              }}
            >
              {PASOS.map((paso, i) => (
                <div
                  key={paso.num}
                  role="listitem"
                  style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
                >
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: "16px",
                        height: "1px",
                        background: "var(--color-dorado, #C9A961)",
                        opacity: 0.5,
                      }}
                    />
                  )}
                  <span style={{ display: "inline-flex", alignItems: "baseline", gap: "8px" }}>
                    <span
                      style={{
                        fontWeight: 500,
                        color: "var(--color-dorado-deep, #B89344)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {paso.num}
                    </span>
                    <span>{paso.titulo}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Columna derecha: foto placeholder ── */}
          <div className="hero-photo-wrap" data-parallax="0.08" style={{ willChange: "transform" }}>
            <div
              className="hero-photo"
              data-placeholder="dr-photo-main"
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
                  top: "24px",
                  left: "24px",
                  right: "24px",
                  bottom: "24px",
                  border: "1px solid var(--color-dorado, #C9A961)",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />

              {/* Placeholder mark */}
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
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-marino, #0F1E3D)"
                    strokeWidth="1.2"
                    style={{ opacity: 0.4, marginBottom: "20px" }}
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
                    Retrato del Dr.
                    <br />· se reemplazará ·
                  </div>
                </div>
              </div>

              {/* Badge marino inferior */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-1px",
                  right: "24px",
                  background: "var(--color-marino, #0F1E3D)",
                  color: "var(--color-bg-primary, #FAF7F2)",
                  padding: "16px 24px",
                  zIndex: 3,
                  fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    opacity: 0.7,
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Estudio Jurídico
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                    fontSize: "18px",
                    fontWeight: 500,
                  }}
                >
                  {siteConfig.drName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations — keyframes declarados en style tag */}
      <style>{`
        /* ── Hero grid responsive ── */
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.15fr 1fr !important;
          }
        }

        /* ── Proceso pasos: stack en mobile ── */
        @media (max-width: 767px) {
          .proceso {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }

        /* ── Word-by-word reveal ── */
        @keyframes heroWordRise {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroEntry {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPhotoReveal {
          from { clip-path: inset(0 0 100% 0); }
          to   { clip-path: inset(0 0 0% 0); }
        }
        @keyframes heroHairline {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes heroAccentLine {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes dotPulseHero {
          0%   { transform: scale(.6); opacity: .5; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes pasoLineExpand {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* Apply animations */
        .hero-kicker {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) .15s both;
        }
        .hero-word {
          animation: heroWordRise 1.1s cubic-bezier(.22,1,.36,1) var(--delay, .35s) both;
        }
        .hero-bajada {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) 1.1s both;
        }
        .hero-ctas {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) 1.3s both;
        }
        .hero-cta-meta {
          animation: heroEntry .9s cubic-bezier(.22,1,.36,1) 1.5s both;
        }
        .hero-photo {
          animation: heroPhotoReveal 1.4s cubic-bezier(.22,1,.36,1) .6s both;
        }
        .hero-hairline {
          background: linear-gradient(90deg, rgba(15,30,61,.12) 0%, var(--color-dorado, #C9A961) 30%, var(--color-dorado, #C9A961) 70%, rgba(15,30,61,.12) 100%);
          animation: heroHairline 1.6s cubic-bezier(.22,1,.36,1) .8s both;
        }
        .hero-accent::after {
          content: "";
          position: absolute;
          bottom: .1em;
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
        .paso {
          animation: heroEntry .8s cubic-bezier(.22,1,.36,1) var(--step-delay, .9s) both;
        }
        .paso-line {
          transform-origin: left center;
          animation: pasoLineExpand .6s cubic-bezier(.22,1,.36,1) var(--step-delay, .9s) both;
        }

        /* Reduced motion — disable all animations */
        @media (prefers-reduced-motion: reduce) {
          .hero-kicker,
          .hero-word,
          .hero-bajada,
          .hero-ctas,
          .hero-cta-meta,
          .hero-photo,
          .hero-hairline,
          .paso,
          .paso-line {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            clip-path: none !important;
            width: 100% !important;
          }
          .disp-dot::after {
            animation: none !important;
          }
          .hero-accent::after {
            animation: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
