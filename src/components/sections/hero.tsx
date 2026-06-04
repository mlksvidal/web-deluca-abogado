"use client";
/**
 * Hero — Editorial book cover style, ahora coreografiado con GSAP.
 *
 * - Entrada: timeline GSAP (kicker → palabras con máscara → subrayado → CTA).
 * - Scroll: parallax del sello PD del fondo (scrub) + leve drift del contenido.
 * - prefers-reduced-motion: sin GSAP, todo visible en su estado final.
 *
 * Idea: portada de libro de derecho premium que "respira" al scrollear.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { gsap } from "@/lib/gsap";
import { Magnetic } from "@/components/utils/magnetic";

const H1_WORDS = [
  { text: "Asesoría", accent: false, br: false },
  { text: "jurídica", accent: false, br: false },
  { text: "con", accent: false, br: true },
  { text: "criterio,", accent: true, br: false },
  { text: "claridad", accent: false, br: true },
  { text: "y", accent: false, br: false },
  { text: "compromiso.", accent: false, br: false },
];

// Motas flotantes (posiciones fijas para evitar hydration mismatch).
// Mezcla dorado + azul eléctrico para que el fondo no se sienta plano.
const GOLD = "var(--color-dorado, #C9A961)";
const BLUE = "var(--color-azul-electrico, #2952ff)";
const HERO_PARTICLES = [
  { left: "12%", top: "22%", size: 5, dur: "9s", delay: "0s", opacity: 0.5, color: GOLD },
  { left: "24%", top: "68%", size: 3, dur: "11s", delay: "1.5s", opacity: 0.45, color: BLUE },
  { left: "38%", top: "34%", size: 4, dur: "8s", delay: "0.8s", opacity: 0.35, color: GOLD },
  { left: "58%", top: "72%", size: 4, dur: "12s", delay: "2.2s", opacity: 0.5, color: BLUE },
  { left: "72%", top: "28%", size: 5, dur: "10s", delay: "0.4s", opacity: 0.5, color: GOLD },
  { left: "84%", top: "58%", size: 3, dur: "9.5s", delay: "1.1s", opacity: 0.45, color: BLUE },
  { left: "48%", top: "16%", size: 4, dur: "13s", delay: "2.8s", opacity: 0.3, color: GOLD },
  { left: "64%", top: "44%", size: 3, dur: "10.5s", delay: "3.2s", opacity: 0.4, color: BLUE },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const sealRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // estado natural = visible

    const ctx = gsap.context(() => {
      // ── Entrada coreografiada ──────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-kicker", { y: 22, opacity: 0, duration: 0.9 }, 0.15)
        .from(".hero-word", { yPercent: 110, opacity: 0, duration: 0.95, stagger: 0.07 }, "-=0.45")
        .from(
          ".hero-accent-line",
          { scaleX: 0, transformOrigin: "left center", duration: 0.7 },
          "-=0.35"
        )
        .from(".hero-cta", { y: 22, opacity: 0, duration: 0.9 }, "-=0.4");

      // ── Parallax del sello PD al scrollear ─────────────────
      if (sealRef.current) {
        gsap.to(sealRef.current, {
          yPercent: 26,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // ── Leve drift + fade del contenido al salir del hero ──
      gsap.to(".hero-editorial", {
        yPercent: -8,
        opacity: 0.55,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
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
              "radial-gradient(ellipse at 50% 40%, rgba(201,169,97,.06) 0%, transparent 68%)",
          }}
        />

        {/* Motas doradas flotantes — vida ambiental */}
        <div className="hero-particles">
          {HERO_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="hero-particle"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                animationDuration: p.dur,
                animationDelay: p.delay,
                ["--p-opacity" as string]: p.opacity,
              }}
            />
          ))}
        </div>

        {/* Líneas verticales decorativas estilo blueprint */}
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

        {/* Sello decorativo PD — parallax al scrollear */}
        <svg
          ref={sealRef}
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(720px, 72vw)",
            height: "min(720px, 72vw)",
            opacity: 0.05,
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
          <text
            x="200"
            y="232"
            textAnchor="middle"
            fontFamily="var(--font-playfair, 'Playfair Display', serif)"
            fontSize="110"
            fontStyle="italic"
            fill="var(--color-marino, #0F1E3D)"
            stroke="none"
            opacity="0.7"
          >
            PD
          </text>
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

          {/* H1 — book cover style, palabras con máscara para reveal GSAP */}
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
                <span className="hero-word-mask">
                  <span className="hero-word">
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
                        <span className="hero-accent-line" aria-hidden="true" />
                      </em>
                    ) : (
                      word.text
                    )}
                  </span>
                </span>
                {word.br ? <br /> : <span> </span>}
              </span>
            ))}
          </h1>

          {/* CTA único primario — magnético */}
          <div className="hero-cta mt-14 md:mt-20">
            <Magnetic strength={0.4}>
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
                    "background .3s cubic-bezier(.22,1,.36,1), box-shadow .4s cubic-bezier(.22,1,.36,1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "var(--color-marino-hover, #1E3A6E)";
                  el.style.boxShadow = "0 14px 28px -8px rgba(15,30,61,.5)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "var(--color-marino, #0F1E3D)";
                  el.style.boxShadow = "0 4px 14px -4px rgba(15,30,61,.28)";
                }}
              >
                <span className="btn-label">
                  Reservar consulta
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </Magnetic>

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

      {/* Estilos estructurales del hero (máscaras + subrayado + partículas) */}
      <style>{`
        .hero-word-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding-bottom: 0.06em;
        }
        .hero-word {
          display: inline-block;
        }
        .hero-accent-line {
          position: absolute;
          left: 0;
          bottom: 0.02em;
          width: 100%;
          height: 2px;
          background: var(--color-dorado, #C9A961);
          display: block;
        }
        .hero-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .hero-particle {
          position: absolute;
          border-radius: 50%;
          opacity: var(--p-opacity, 0.4);
          animation-name: heroFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: calc(var(--p-opacity, 0.4) * 0.5); }
          50%      { transform: translateY(-26px) scale(1.25); opacity: var(--p-opacity, 0.4); }
        }

        /* CTA — destello azul eléctrico que barre periódicamente */
        .btn-primary-hero {
          position: relative;
          overflow: hidden;
        }
        .btn-primary-hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: -65%;
          width: 45%;
          height: 100%;
          background: linear-gradient(100deg, transparent, rgba(67, 102, 255, 0.5), transparent);
          transform: skewX(-18deg);
          animation: ctaSheen 5.5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes ctaSheen {
          0%   { left: -65%; }
          35%  { left: 150%; }
          100% { left: 150%; }
        }
        .btn-label {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-particle { animation: none; }
          .btn-primary-hero::before { animation: none; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
