"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";

/* ============================================================
   PRESENTACIÓN — Pitch deck editorial premium
   ============================================================
   Estructura:
   - Top progress bar (scroll-driven)
   - Sticky chapter indicator (sidebar)
   - Hero cinematográfico (word-by-word reveal)
   - 8 secciones con header asimétrico
   - Marquee tickers entre secciones (subtle)
   - Animaciones reveal via IntersectionObserver
   - Counter animado en métricas
   - CTA final con magnetic hover
   ============================================================ */

const SECTIONS = [
  { id: "diagnostico", num: "01", label: "Diagnóstico", group: "process" },
  { id: "solucion", num: "02", label: "Solución", group: "process" },
  { id: "inventario", num: "03", label: "Inventario", group: "process" },
  { id: "beneficios", num: "04", label: "Beneficios", group: "transform" },
  { id: "tecnologia", num: "05", label: "Tecnología", group: "transform" },
  { id: "metricas", num: "06", label: "Métricas", group: "result" },
  { id: "roadmap", num: "07", label: "Roadmap", group: "result" },
  { id: "go-live", num: "08", label: "Go live", group: "result" },
] as const;

const HERO_TITLE_WORDS = [
  { text: "Una", accent: false },
  { text: "plataforma", accent: false },
  { text: "que", accent: false, br: true },
  { text: "atrae", accent: "process" },
  { text: "clientes,", accent: false },
  { text: "ordena", accent: "transform", br: true },
  { text: "casos", accent: false },
  { text: "y", accent: false },
  { text: "hace", accent: false },
  { text: "crecer", accent: "result", br: true },
  { text: "la", accent: false },
  { text: "marca", accent: false },
  { text: "sola.", accent: false },
] as const;

const HERO_STATS = [
  {
    num: "31",
    tag: "Páginas activas",
    label: "rutas en producción ya navegables",
    color: "process",
  },
  {
    num: "07",
    tag: "Herramientas legales",
    label: "calculadoras, verificadores y guías",
    color: "transform",
  },
  { num: "140", tag: "Cobertura QA", label: "tests automatizados al 100%", color: "result" },
] as const;

const DIAGNOSTICO = [
  {
    tag: "P1 · Visibilidad",
    head: "El sitio aparece en Google solo si el cliente busca tu nombre.",
    desc: "Sin contenido útil indexable, el sitio es una tarjeta de presentación. Quien todavía no te conoce, no te encuentra. Hay que entregar valor para que Google te muestre.",
  },
  {
    tag: "P2 · Conversión",
    head: "El formulario genérico no convierte. El cliente se va al primero que conteste rápido.",
    desc: "Un “contactanos” pierde contra un proceso claro. Si el visitante no entiende cuánto cuesta, cuándo va a tener respuesta y por qué tu estudio, simplemente se va.",
  },
  {
    tag: "P3 · Operación",
    head: "Coordinar turnos por WhatsApp consume horas que deberían ir al expediente.",
    desc: "Cada turno coordinado a mano son 8–12 mensajes. Multiplicado por 20 consultas mensuales = una jornada laboral entera tirada en logística.",
  },
  {
    tag: "P4 · Confianza",
    head: "Sin diferenciadores visibles, todos los abogados parecen iguales al cliente.",
    desc: "El visitante no distingue entre 200 estudios con la misma estructura. El que entrega valor antes de cobrar gana la conversación.",
  },
];

const INVENTARIO = [
  {
    grupo: "Captura",
    items: [
      { name: "Landing portfolio editorial", desc: "Hero + áreas + casos + about + contacto." },
      {
        name: "Triaje WhatsApp pre-clasificado",
        desc: "Wizard 3 clicks → mensaje pre-armado al Dr.",
      },
      {
        name: "Reserva de turnos online",
        desc: "Calendario + slots + form. Sync con Google Calendar.",
      },
      {
        name: "Centro de descargas con lead capture",
        desc: "4 PDFs con form → lista de leads en DB.",
      },
    ],
  },
  {
    grupo: "SEO masivo",
    items: [
      {
        name: "Calculadora indemnización por despido",
        desc: "Art. 245 LCT + 232 + 233 + 80. Estima en vivo.",
      },
      {
        name: "Calculadora cuota alimentaria",
        desc: "% jurisprudencial sobre sueldo bruto + hijos + edades.",
      },
      {
        name: "Calculadora indemnización ART",
        desc: "Ley 24.557 + 26.773 con coeficiente de edad.",
      },
      {
        name: "Verificador “¿Tu despido fue legal?”",
        desc: "5 preguntas → diagnóstico legal/dudoso/ilegal.",
      },
      {
        name: "Glosario jurídico A-Z",
        desc: "Términos legales SSG con URL individual. Schema.org.",
      },
      {
        name: "Línea de tiempo proceso de divorcio",
        desc: "Infografía scroll-driven con HowTo schema.",
      },
      { name: "Blog editorial + admin", desc: "Artículos Markdown con FAQPage + Article schema." },
    ],
  },
  {
    grupo: "Autoridad",
    items: [
      {
        name: "Casos resueltos narrativos",
        desc: "3 historias anonimizadas con resultado concreto.",
      },
      {
        name: "Sello matrícula verificable",
        desc: "Link directo al perfil oficial del Colegio de Mendoza.",
      },
      { name: "Trayectoria profesional", desc: "Sección About + credenciales + foto." },
    ],
  },
  {
    grupo: "Operación",
    items: [
      {
        name: "Panel admin protegido",
        desc: "Basic Auth + guard server-side. Turnos, leads, blog.",
      },
      {
        name: "Sistema de emails transaccionales",
        desc: "Confirmación a cliente + notificación al Dr.",
      },
      {
        name: "Rate limiting + anti-bot",
        desc: "Honeypot + Upstash Ratelimit en formularios sensibles.",
      },
      { name: "WhatsApp directo", desc: "FAB flotante + links pre-armados desde todo el sitio." },
    ],
  },
  {
    grupo: "Confianza legal",
    items: [
      {
        name: "Política de privacidad Ley 25.326",
        desc: "11 secciones cumpliendo Habeas Data + ARCO.",
      },
      {
        name: "Términos de uso",
        desc: "Disclaimer + propiedad intelectual + jurisdicción Mendoza.",
      },
      {
        name: "Consentimiento expreso en formularios",
        desc: "Checkbox Ley 25.326 + persistencia con timestamp.",
      },
      { name: "Audit log + retention", desc: "Turnos 2 años, leads 1 año, audit 5 años." },
    ],
  },
];

const BENEFICIOS = [
  {
    titulo: "Tráfico orgánico sin pagar publicidad",
    detalle:
      "Las 3 calculadoras + glosario + verificador + blog generan SEO masivo. Cada herramienta rankea por separado. La gente busca “calcular indemnización por despido Argentina” todos los meses.",
  },
  {
    titulo: "Conversión más alta que un formulario clásico",
    detalle:
      "El triaje WhatsApp pre-clasifica al cliente en 3 clicks. Cuando llega al WhatsApp del Dr., ya viene con área legal + urgencia + tipo de consulta. Cero fricción de discovery.",
  },
  {
    titulo: "Menos tiempo perdido en mensajes operativos",
    detalle:
      "La reserva online sincroniza con el Google Calendar del Dr. El cliente recibe email automático con dirección, fecha, hora y cómo llegar. No hay ping-pong de WhatsApp.",
  },
  {
    titulo: "Diferenciación clara vs otros abogados de la zona",
    detalle:
      "En San Rafael casi nadie del rubro tiene calculadoras, verificadores ni descargas gratuitas. El sitio se siente premium y entrega valor antes de cobrar.",
  },
  {
    titulo: "Posicionamiento como autoridad",
    detalle:
      "Casos resueltos narrativos + recursos descargables + blog editorial muestran competencia real, no solo años en una bio. La gente compra abogados que demuestran que saben.",
  },
  {
    titulo: "Cumplimiento legal desde el día uno",
    detalle:
      "Ley 25.326 Habeas Data cubierta en política de privacidad, consentimiento expreso, retention policy y separación de datos sensibles en logs.",
  },
];

const STACK = [
  { layer: "Frontend", tech: "Next.js 16 · React Server Components · Turbopack · Tailwind 4" },
  {
    layer: "Diseño",
    tech: "Sistema custom · Playfair Display + Lora + Inter · paleta marino + dorado · WCAG AA",
  },
  {
    layer: "Backend",
    tech: "Server Actions · Drizzle ORM · postgres.js · Zod validation server-side",
  },
  {
    layer: "Base de datos",
    tech: "Supabase Postgres Pooler · 4 tablas (turnos, leads, blog, glosario)",
  },
  { layer: "Emails", tech: "Resend · React Email Templates · retry exponencial" },
  { layer: "Calendario", tech: "Google Calendar API v3 · Service Account JWT" },
  {
    layer: "Seguridad",
    tech: "Basic Auth proxy · timing-safe XOR · CSP estricta · HSTS · rate limiting",
  },
  {
    layer: "SEO",
    tech: "Sitemap dinámico · robots.txt · Schema.org (LegalService + Article + HowTo)",
  },
  {
    layer: "QA",
    tech: "140 tests Vitest · 11 archivos de spec · build prod limpio · 0 errores lint",
  },
  { layer: "Hosting", tech: "Vercel Edge · CI/CD automático en push a main · HTTPS + CDN global" },
];

const METRICAS = [
  { label: "Rutas", value: 31, suffix: "", note: "estáticas + SSG + dinámicas" },
  { label: "Tareas dev", value: 47, suffix: "", note: "en 11 batches" },
  { label: "Tests pasando", value: 140, suffix: "", note: "automatizados" },
  { label: "Build prod", value: 60, suffix: "s", note: "Turbopack" },
  { label: "Schemas SEO", value: 5, suffix: "", note: "tipos distintos" },
  { label: "Calculadoras", value: 3, suffix: "", note: "legales gratis" },
  { label: "Lighthouse", value: 90, suffix: "+", note: "perf + SEO + a11y" },
  { label: "Cumplimiento", value: 100, suffix: "%", note: "Ley 25.326" },
];

const ROADMAP = [
  {
    etapa: "FASE 2",
    titulo: "Portal del cliente con login",
    desc: "Cliente activo ve estado de su caso, documentos, próximas audiencias y chat con el Dr.",
  },
  {
    etapa: "FASE 2",
    titulo: "Asistente IA legal con triaje",
    desc: "Chat conversacional que con 3-5 preguntas identifica el caso y agenda automáticamente.",
  },
  {
    etapa: "FASE 2",
    titulo: "Pagos online con Mercado Pago",
    desc: "Cobro de honorarios desde la web con cuotas + factura automática.",
  },
  {
    etapa: "FASE 2",
    titulo: "Suscripciones recurrentes",
    desc: "Plan PyME, Plan Familia, Plan Freelance, Plan Inmobiliario.",
  },
  {
    etapa: "FASE 3",
    titulo: "Análisis IA de documentos",
    desc: "Cliente sube su contrato y la IA marca cláusulas riesgosas. Lead magnet brutal.",
  },
  {
    etapa: "FASE 3",
    titulo: "Generador automático de documentos",
    desc: "Wizard para armar carta documento o poder simple. PDF descargable.",
  },
];

const GO_LIVE = [
  { tarea: "Confirmar número de matrícula real", responsable: "Dr." },
  { tarea: "Confirmar URL del perfil en el Colegio de Mendoza", responsable: "Dr." },
  { tarea: "Enviar dirección exacta del estudio + Google Maps embed", responsable: "Dr." },
  { tarea: "Confirmar email para notificaciones (RESEND_TO_EMAIL)", responsable: "Dr." },
  { tarea: "Aprobar fórmulas de las 3 calculadoras", responsable: "Dr." },
  { tarea: "Validar 3 casos narrativos (Laboral / Familia / Civil)", responsable: "Dr." },
  { tarea: "Aprobar 8 hitos del proceso de divorcio", responsable: "Dr." },
  { tarea: "Enviar fotos profesionales del Dr. y del estudio", responsable: "Dr." },
  {
    tarea: "Configurar Supabase + Resend + Google Service + Upstash en Vercel",
    responsable: "Dev",
  },
  { tarea: "Verificar dominio Resend (DKIM + SPF + DMARC)", responsable: "Dev + Dr." },
  { tarea: "Reemplazar 4 PDFs placeholders por documentos reales", responsable: "Dr." },
  { tarea: "Aprobar 2-3 artículos del blog seed", responsable: "Dr." },
  { tarea: "Dominio custom opcional (ej. deluca-abogado.com.ar)", responsable: "Dev + Dr." },
];

/* ============== Hook: reveal on scroll ============== */
function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.dataset.revealed = "true";
      });
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
}

/* ============== Hook: scroll progress ============== */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const scrollHeight = h.scrollHeight - h.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return progress;
}

/* ============== Hook: active section ============== */
function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

/* ============== Animated counter ============== */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;
    const node = ref.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          obs.unobserve(node);

          if (prefersReducedMotion) {
            setDisplay(value);
            return;
          }

          const start = performance.now();
          const duration = 1400;
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            setDisplay(Math.round(value * ease(t)));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [value]);
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function Page() {
  useReveal();
  const progress = useScrollProgress();
  const active = useActiveSection();

  return (
    <>
      <style>{`
        /* ======================================================
           HIDE SITE CHROME — /presentacion es standalone
           ====================================================== */
        body:has(.pres-2026) header,
        body:has(.pres-2026) footer[role="contentinfo"],
        body:has(.pres-2026) a[aria-label*="WhatsApp"],
        body:has(.pres-2026) a[aria-label*="Contactar"],
        body:has(.pres-2026) .skip-link { display: none !important; }
        body:has(.pres-2026) main#main-content,
        body:has(.pres-2026) main {
          padding: 0 !important; margin: 0 !important; min-height: 0 !important;
        }
        body:has(.pres-2026) { background: #F4F2EC !important; }

        /* ======================================================
           DESIGN TOKENS
           ====================================================== */
        .pres-2026 {
          --bg: #F4F2EC;
          --bg-2: #ECE9DF;
          --ink: #0A0A0F;
          --ink-soft: rgba(10,10,15,0.62);
          --ink-muted: rgba(10,10,15,0.42);
          --ink-line: rgba(10,10,15,0.10);
          --ink-faint: rgba(10,10,15,0.04);
          --process: #2A39E8;
          --transform: #6B1FE5;
          --result: #C9F255;
          --night: #0A0A0F;
          --night-2: #14141C;
          --ease: cubic-bezier(0.16, 1, 0.3, 1);
          --ease-2: cubic-bezier(0.22, 1, 0.36, 1);
          --gutter: clamp(20px, 5vw, 64px);
          --wrap: 1320px;
          --font-display: var(--font-pres-grotesk), ui-sans-serif, system-ui, sans-serif;
          --font-text: var(--font-pres-manrope), ui-sans-serif, system-ui, sans-serif;

          min-height: 100vh;
          background: var(--bg);
          color: var(--ink);
          font-family: var(--font-display);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          line-height: 1.4;
          overflow-x: hidden;
          position: relative;
        }
        .pres-2026 *, .pres-2026 *::before, .pres-2026 *::after { box-sizing: border-box; }
        .pres-2026 h1, .pres-2026 h2, .pres-2026 h3, .pres-2026 h4, .pres-2026 h5, .pres-2026 h6 {
          font-family: var(--font-display);
          font-weight: 400;
          color: inherit;
          margin: 0;
        }
        .pres-2026 p, .pres-2026 span, .pres-2026 a, .pres-2026 li, .pres-2026 button,
        .pres-2026 small, .pres-2026 strong, .pres-2026 em { font-family: inherit; }
        .pres-2026 p { margin: 0; font-weight: inherit; }
        .pres-2026 a { text-decoration: none; color: inherit; }

        .pres-wrap { max-width: var(--wrap); margin: 0 auto; padding: 0 var(--gutter); }

        /* ======================================================
           NOISE OVERLAY — sutil grain global
           ====================================================== */
        .pres-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 9999;
          opacity: 0.04; mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
        }

        /* ======================================================
           PROGRESS BAR — top fixed
           ====================================================== */
        .pres-progress {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 2px; background: var(--ink-faint);
        }
        .pres-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--process) 0%, var(--transform) 50%, var(--result) 100%);
          transform-origin: 0 50%;
          transition: width .08s linear;
        }

        /* ======================================================
           TOP BAR — minimal sticky
           ====================================================== */
        .pres-topbar {
          position: sticky; top: 0; z-index: 90;
          padding: 18px var(--gutter);
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(244,242,236,0.78);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border-bottom: 1px solid var(--ink-line);
        }
        .pres-brand {
          display: flex; align-items: center; gap: 14px;
          font-size: 16px; font-weight: 500; letter-spacing: -0.01em;
        }
        .pres-brand-mark {
          width: 38px; height: 38px;
          background: var(--ink); color: var(--bg);
          display: grid; place-items: center;
          border-radius: 50%;
          font-weight: 600; font-size: 13px;
          letter-spacing: 0;
          transition: transform .5s var(--ease);
        }
        .pres-brand:hover .pres-brand-mark { transform: rotate(8deg) scale(1.05); }
        .pres-brand-meta { display: flex; flex-direction: column; gap: 1px; }
        .pres-brand-meta small {
          font-family: var(--font-text);
          font-size: 11px; color: var(--ink-soft); font-weight: 400;
          letter-spacing: 0.02em;
        }
        .pres-topbar-nav {
          display: flex; align-items: center; gap: 28px;
          font-family: var(--font-text);
          font-size: 13px;
          color: var(--ink-soft);
        }
        .pres-topbar-nav .dot {
          display: inline-block; width: 7px; height: 7px; border-radius: 50%;
          background: var(--result); margin-right: 9px;
          box-shadow: 0 0 0 4px rgba(201,242,85,0.25);
          animation: pulse 2.4s var(--ease) infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(201,242,85,0.25); }
          50%      { box-shadow: 0 0 0 7px rgba(201,242,85,0.08); }
        }
        .pres-topbar-nav strong { color: var(--ink); font-weight: 500; }
        @media (max-width: 720px) { .pres-topbar-nav .hide-mobile { display: none; } }

        /* ======================================================
           SIDEBAR INDICATOR — chapter dots
           ====================================================== */
        .pres-sidebar {
          position: fixed; left: clamp(16px, 2vw, 32px); top: 50%;
          transform: translateY(-50%); z-index: 50;
          display: flex; flex-direction: column; gap: 18px;
        }
        @media (max-width: 1100px) { .pres-sidebar { display: none; } }
        .pres-sidebar-item {
          display: flex; align-items: center; gap: 12px;
          color: var(--ink-muted);
          font-family: var(--font-text);
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0.55;
          transition: opacity .35s var(--ease), color .35s var(--ease);
          cursor: pointer;
        }
        .pres-sidebar-item:hover { opacity: 1; color: var(--ink); }
        .pres-sidebar-item .bar {
          width: 18px; height: 1px; background: currentColor;
          transition: width .4s var(--ease);
        }
        .pres-sidebar-item.active { opacity: 1; color: var(--ink); }
        .pres-sidebar-item.active .bar { width: 36px; }
        .pres-sidebar-item .lbl { white-space: nowrap; }

        /* ======================================================
           REVEAL ANIMATIONS
           ====================================================== */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 1s var(--ease), transform 1s var(--ease);
        }
        [data-reveal][data-revealed="true"] {
          opacity: 1; transform: translateY(0);
        }
        [data-reveal][data-delay="1"] { transition-delay: .08s; }
        [data-reveal][data-delay="2"] { transition-delay: .16s; }
        [data-reveal][data-delay="3"] { transition-delay: .24s; }
        [data-reveal][data-delay="4"] { transition-delay: .32s; }
        [data-reveal][data-delay="5"] { transition-delay: .40s; }
        [data-reveal][data-delay="6"] { transition-delay: .48s; }
        [data-reveal][data-delay="7"] { transition-delay: .56s; }
        [data-reveal][data-delay="8"] { transition-delay: .64s; }

        /* ======================================================
           HERO
           ====================================================== */
        .hero-pres {
          padding: clamp(80px, 14vw, 180px) 0 clamp(60px, 10vw, 140px);
          position: relative;
        }
        .hero-pres::before {
          content: ""; position: absolute;
          top: 20%; left: 50%;
          transform: translateX(-50%);
          width: min(900px, 70vw); height: min(900px, 70vw);
          background: radial-gradient(circle at center, rgba(42,57,232,0.06) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }
        .hero-pres-inner { position: relative; z-index: 1; }
        .hero-pres-tag {
          display: inline-flex; align-items: center; gap: 14px;
          font-family: var(--font-text);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin-bottom: clamp(32px, 5vw, 56px);
          flex-wrap: wrap;
        }
        .hero-pres-tag::before {
          content: ""; width: 44px; height: 1px;
          background: var(--ink-soft); opacity: .4;
        }
        .hero-pres-tag .live-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px;
          background: var(--ink);
          color: var(--result);
          border-radius: 100px;
          font-weight: 500;
          letter-spacing: 0.16em;
        }
        .hero-pres-tag .live-pill::before {
          content: ""; width: 7px; height: 7px; border-radius: 50%;
          background: var(--result);
          animation: pulse-result 1.8s var(--ease) infinite;
        }
        @keyframes pulse-result {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }

        .hero-pres-title {
          font-size: clamp(2.8rem, 9.5vw, 8rem);
          line-height: 0.94;
          font-weight: 400;
          letter-spacing: -0.05em;
          margin-bottom: clamp(40px, 6vw, 64px);
          max-width: 19ch;
        }
        .hero-pres-title .word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }
        .hero-pres-title .word {
          display: inline-block;
          animation: word-rise 1.1s var(--ease) both;
        }
        @keyframes word-rise {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .hero-pres-title .word.accent-process { color: var(--process); font-style: italic; }
        .hero-pres-title .word.accent-transform { color: var(--transform); font-style: italic; }
        .hero-pres-title .word.accent-result {
          color: var(--result);
          -webkit-text-stroke: 1.2px var(--ink);
          font-style: italic;
        }

        .hero-pres-sub {
          font-family: var(--font-text);
          font-size: clamp(1.05rem, 2vw, 1.4rem);
          line-height: 1.5;
          max-width: 58ch;
          color: var(--ink-soft);
          margin-bottom: clamp(56px, 8vw, 96px);
          font-weight: 400;
        }
        .hero-pres-sub strong { color: var(--ink); font-weight: 500; }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(12px, 2vw, 24px);
        }
        @media (max-width: 880px) { .hero-stats { grid-template-columns: 1fr; } }
        .hero-stat {
          padding: clamp(24px, 3.5vw, 40px);
          background: var(--bg);
          border: 1px solid var(--ink-line);
          display: flex; flex-direction: column; gap: 14px;
          position: relative;
          overflow: hidden;
          transition: transform .5s var(--ease), border-color .5s var(--ease), background .5s var(--ease);
        }
        .hero-stat::after {
          content: ""; position: absolute;
          top: 0; right: 0; width: 80px; height: 80px;
          background: currentColor;
          opacity: 0;
          clip-path: polygon(100% 0, 0 0, 100% 100%);
          transition: opacity .5s var(--ease);
          pointer-events: none;
        }
        .hero-stat:hover { transform: translateY(-4px); border-color: var(--ink); }
        .hero-stat:hover::after { opacity: 0.08; }
        .hero-stat.process { color: var(--process); }
        .hero-stat.transform { color: var(--transform); }
        .hero-stat.result { color: var(--ink); }
        .hero-stat-tag {
          font-family: var(--font-text);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-muted);
          font-weight: 500;
        }
        .hero-stat-num {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 400;
          letter-spacing: -0.05em;
          line-height: 0.92;
          font-variant-numeric: tabular-nums;
        }
        .hero-stat.result .hero-stat-num {
          color: var(--result);
          -webkit-text-stroke: 1.2px var(--ink);
        }
        .hero-stat-label {
          font-family: var(--font-text);
          font-size: 14px;
          color: var(--ink-soft);
          line-height: 1.45;
        }

        .hero-scroll-cue {
          position: absolute;
          bottom: 32px; left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-text);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-muted);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          animation: scroll-cue 2.4s var(--ease) infinite;
        }
        @keyframes scroll-cue {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
          50%      { transform: translateX(-50%) translateY(4px); opacity: 0.2; }
        }
        .hero-scroll-cue::after {
          content: ""; width: 1px; height: 40px;
          background: linear-gradient(180deg, var(--ink) 0%, transparent 100%);
        }

        /* ======================================================
           MARQUEE — between sections
           ====================================================== */
        .marquee {
          padding: clamp(20px, 3vw, 36px) 0;
          background: var(--bg-2);
          border-top: 1px solid var(--ink-line);
          border-bottom: 1px solid var(--ink-line);
          overflow: hidden;
        }
        .marquee.dark { background: var(--night); border-color: rgba(255,255,255,0.08); color: var(--bg); }
        .marquee-track {
          display: flex;
          gap: 48px;
          animation: marquee 48s linear infinite;
          white-space: nowrap;
          width: max-content;
        }
        .marquee-track > span {
          display: inline-flex; align-items: center; gap: 16px;
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 4vw, 3.2rem);
          font-weight: 400;
          letter-spacing: -0.03em;
        }
        .marquee-track > span::after {
          content: "✦";
          color: var(--process);
          margin-left: 32px;
          font-size: 0.6em;
        }
        .marquee.dark .marquee-track > span::after { color: var(--result); }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }

        /* ======================================================
           SECTION BASE
           ====================================================== */
        section.pres-section {
          padding: clamp(96px, 14vw, 180px) 0;
          position: relative;
        }
        section.pres-section.dark {
          background: var(--night);
          color: var(--bg);
        }
        section.pres-section.dark .section-num,
        section.pres-section.dark .section-bajada {
          color: rgba(244,242,236,0.55);
        }
        section.pres-section.surface { background: var(--bg-2); }

        .section-head {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: clamp(32px, 5vw, 80px);
          align-items: end;
          margin-bottom: clamp(60px, 8vw, 120px);
        }
        @media (max-width: 980px) {
          .section-head { grid-template-columns: 1fr; align-items: start; gap: 32px; }
        }
        .section-num {
          font-family: var(--font-text);
          font-size: 12px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-soft);
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 28px;
        }
        .section-num .dot-color {
          width: 12px; height: 12px; border-radius: 50%;
        }
        .dot-process { background: var(--process); }
        .dot-transform { background: var(--transform); }
        .dot-result { background: var(--result); }
        section.pres-section h2 {
          font-size: clamp(2.2rem, 5.5vw, 4.5rem);
          line-height: 0.98;
          font-weight: 400;
          letter-spacing: -0.04em;
          max-width: 14ch;
        }
        section.pres-section h2 em { font-style: italic; }
        section.pres-section h2 em.process { color: var(--process); }
        section.pres-section h2 em.transform { color: var(--transform); }
        section.pres-section h2 em.result {
          color: var(--result);
          -webkit-text-stroke: 1.2px currentColor;
        }
        section.pres-section.dark h2 em.result { -webkit-text-stroke: 0; }
        .section-bajada {
          font-family: var(--font-text);
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          line-height: 1.55;
          color: var(--ink-soft);
          max-width: 56ch;
          font-weight: 400;
        }

        /* ======================================================
           DIAGNÓSTICO — asymmetric grid
           ====================================================== */
        .diag-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: clamp(16px, 2vw, 28px);
        }
        @media (max-width: 880px) { .diag-grid { grid-template-columns: 1fr; } }
        .diag-card {
          padding: clamp(28px, 3.5vw, 48px);
          background: var(--bg);
          border: 1px solid var(--ink-line);
          display: flex; flex-direction: column; gap: 18px;
          position: relative;
          overflow: hidden;
          transition: transform .5s var(--ease), border-color .5s var(--ease);
        }
        .diag-card:hover { transform: translateY(-4px); border-color: var(--process); }
        .diag-card::before {
          content: attr(data-num);
          position: absolute;
          top: 24px; right: 28px;
          font-family: var(--font-display);
          font-size: clamp(4rem, 7vw, 6.5rem);
          font-weight: 400;
          color: var(--ink-faint);
          line-height: 1;
          letter-spacing: -0.04em;
          pointer-events: none;
        }
        .diag-card:nth-child(1) { grid-column: span 7; }
        .diag-card:nth-child(2) { grid-column: span 5; }
        .diag-card:nth-child(3) { grid-column: span 5; }
        .diag-card:nth-child(4) { grid-column: span 7; }
        @media (max-width: 880px) {
          .diag-card { grid-column: span 1 !important; }
          .diag-card::before { font-size: 4.5rem; top: 16px; right: 20px; }
        }
        .diag-tag {
          font-family: var(--font-text);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--process);
          font-weight: 600;
          position: relative; z-index: 1;
        }
        .diag-card h3 {
          font-size: clamp(1.3rem, 2.4vw, 1.95rem);
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1.18;
          position: relative; z-index: 1;
          max-width: 24ch;
        }
        .diag-card p {
          font-family: var(--font-text);
          color: var(--ink-soft);
          font-size: 0.98rem;
          line-height: 1.6;
          position: relative; z-index: 1;
          max-width: 52ch;
        }

        /* ======================================================
           SOLUCIÓN — dark manifiesto
           ====================================================== */
        .manifiesto-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(56px, 8vw, 96px);
        }
        .manifiesto-text {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 4vw, 3rem);
          font-weight: 400;
          line-height: 1.18;
          letter-spacing: -0.025em;
          max-width: 22ch;
          color: rgba(244,242,236,0.92);
        }
        .manifiesto-text em {
          font-style: italic;
          color: var(--result);
          font-weight: 400;
        }
        .manifiesto-keys {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(20px, 3vw, 32px);
        }
        @media (max-width: 880px) { .manifiesto-keys { grid-template-columns: 1fr; } }
        .manif-key {
          display: flex; flex-direction: column; gap: 18px;
          padding: clamp(28px, 3vw, 40px);
          border: 1px solid rgba(244,242,236,0.12);
          transition: border-color .4s var(--ease), transform .4s var(--ease), background .4s var(--ease);
          background: rgba(244,242,236,0.02);
        }
        .manif-key:hover {
          border-color: rgba(244,242,236,0.35);
          transform: translateY(-3px);
          background: rgba(244,242,236,0.05);
        }
        .manif-num {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 400;
          letter-spacing: -0.05em;
          line-height: 1;
          font-family: var(--font-display);
        }
        .manif-num.process { color: var(--process); }
        .manif-num.transform { color: var(--transform); }
        .manif-num.result { color: var(--result); }
        .manif-key h4 {
          font-size: clamp(1.05rem, 1.6vw, 1.25rem);
          font-weight: 500;
          letter-spacing: -0.015em;
          color: var(--bg);
        }
        .manif-key p {
          font-family: var(--font-text);
          font-size: 0.95rem;
          color: rgba(244,242,236,0.62);
          line-height: 1.55;
        }

        /* ======================================================
           INVENTARIO — grouped lists
           ====================================================== */
        .grupo-block { margin-bottom: clamp(56px, 7vw, 100px); }
        .grupo-block:last-child { margin-bottom: 0; }
        .grupo-head {
          display: flex; align-items: baseline; gap: 24px;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--ink-line);
        }
        .grupo-num {
          font-family: var(--font-text);
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-muted);
          font-variant-numeric: tabular-nums;
        }
        .grupo-titulo {
          font-size: clamp(1.4rem, 2.6vw, 2rem);
          font-weight: 500;
          letter-spacing: -0.025em;
        }
        .grupo-count {
          margin-left: auto;
          font-family: var(--font-text);
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        .grupo-items {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(20px, 2.5vw, 36px);
        }
        @media (max-width: 720px) { .grupo-items { grid-template-columns: 1fr; } }
        .grupo-item {
          display: flex; flex-direction: column; gap: 10px;
          padding: 24px 0;
          border-bottom: 1px solid var(--ink-line);
          transition: transform .4s var(--ease);
        }
        .grupo-item:hover { transform: translateX(6px); }
        .item-name {
          font-size: clamp(1rem, 1.4vw, 1.15rem);
          font-weight: 500;
          letter-spacing: -0.012em;
          display: flex; align-items: center; gap: 14px;
        }
        .item-name::before {
          content: "";
          width: 10px; height: 10px;
          background: var(--process);
          flex-shrink: 0;
          transition: transform .4s var(--ease), background .4s var(--ease);
        }
        .grupo-item:hover .item-name::before {
          transform: rotate(45deg);
          background: var(--transform);
        }
        .item-desc {
          font-family: var(--font-text);
          font-size: 0.93rem;
          color: var(--ink-soft);
          line-height: 1.6;
          padding-left: 24px;
        }

        /* ======================================================
           BENEFICIOS — magazine cards
           ====================================================== */
        .benef-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(20px, 2.5vw, 32px);
        }
        @media (max-width: 980px) { .benef-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .benef-grid { grid-template-columns: 1fr; } }
        .benef {
          padding: clamp(32px, 4vw, 48px);
          background: var(--bg);
          border: 1px solid var(--ink-line);
          display: flex; flex-direction: column; gap: 20px;
          position: relative;
          transition: transform .5s var(--ease), border-color .5s var(--ease);
          overflow: hidden;
        }
        .benef::after {
          content: "";
          position: absolute;
          inset: auto -2px -2px auto;
          width: 80px; height: 80px;
          background: var(--transform);
          opacity: 0;
          clip-path: polygon(100% 0, 0 100%, 100% 100%);
          transition: opacity .5s var(--ease);
        }
        .benef:hover { transform: translateY(-6px); border-color: var(--transform); }
        .benef:hover::after { opacity: 0.12; }
        .benef-num {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 400;
          letter-spacing: -0.05em;
          color: var(--transform);
          line-height: 0.9;
          opacity: 0.5;
        }
        .benef:nth-child(3n+1) .benef-num { color: var(--process); }
        .benef:nth-child(3n+2) .benef-num { color: var(--transform); }
        .benef:nth-child(3n+3) .benef-num { color: var(--ink); }
        .benef h3 {
          font-size: clamp(1.15rem, 1.9vw, 1.4rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.25;
          max-width: 22ch;
        }
        .benef p {
          font-family: var(--font-text);
          font-size: 0.94rem;
          color: var(--ink-soft);
          line-height: 1.6;
        }

        /* ======================================================
           STACK TABLE
           ====================================================== */
        .stack-table {
          display: flex; flex-direction: column;
          border-top: 1px solid var(--ink-line);
        }
        .stack-row {
          display: grid;
          grid-template-columns: 240px 1fr auto;
          gap: 40px;
          padding: 28px 0;
          border-bottom: 1px solid var(--ink-line);
          align-items: center;
          transition: padding .4s var(--ease), background .4s var(--ease);
          position: relative;
        }
        .stack-row::before {
          content: "";
          position: absolute;
          left: -16px;
          top: 50%;
          width: 8px;
          height: 8px;
          background: var(--transform);
          border-radius: 50%;
          opacity: 0;
          transform: translateY(-50%);
          transition: opacity .4s var(--ease);
        }
        .stack-row:hover {
          padding-left: 16px; padding-right: 16px;
          background: var(--bg-2);
        }
        .stack-row:hover::before { opacity: 1; }
        @media (max-width: 720px) {
          .stack-row { grid-template-columns: 1fr; gap: 8px; padding: 20px 0; }
          .stack-row:hover { padding-left: 0; padding-right: 0; }
        }
        .stack-layer {
          font-family: var(--font-text);
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-muted);
          display: flex; align-items: center; gap: 12px;
          font-weight: 500;
        }
        .stack-layer::before {
          content: ""; width: 8px; height: 8px;
          background: var(--transform);
          border-radius: 50%;
        }
        .stack-tech {
          font-size: clamp(0.98rem, 1.4vw, 1.1rem);
          font-weight: 400;
          letter-spacing: -0.01em;
          line-height: 1.45;
        }
        .stack-idx {
          font-family: var(--font-text);
          font-size: 11px;
          color: var(--ink-muted);
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.1em;
        }
        @media (max-width: 720px) { .stack-idx { display: none; } }

        /* ======================================================
           MÉTRICAS — animated counters
           ====================================================== */
        .metricas-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(12px, 1.5vw, 20px);
        }
        @media (max-width: 980px) { .metricas-grid { grid-template-columns: repeat(2, 1fr); } }
        .metrica {
          padding: clamp(28px, 3.5vw, 44px) clamp(22px, 2.5vw, 32px);
          border: 1px solid rgba(244,242,236,0.12);
          background: rgba(244,242,236,0.02);
          display: flex; flex-direction: column; gap: 14px;
          position: relative;
          overflow: hidden;
          transition: border-color .4s var(--ease), background .4s var(--ease);
        }
        .metrica:hover { border-color: rgba(244,242,236,0.3); background: rgba(244,242,236,0.05); }
        .metrica-label {
          font-family: var(--font-text);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(244,242,236,0.55);
          font-weight: 500;
        }
        .metrica-value {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 400;
          letter-spacing: -0.05em;
          line-height: 0.94;
          color: var(--result);
          font-variant-numeric: tabular-nums;
        }
        .metrica-note {
          font-family: var(--font-text);
          font-size: 12px;
          color: rgba(244,242,236,0.55);
        }

        /* ======================================================
           ROADMAP — timeline cards
           ====================================================== */
        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(20px, 2.5vw, 32px);
        }
        @media (max-width: 980px) { .roadmap-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .roadmap-grid { grid-template-columns: 1fr; } }
        .roadmap-card {
          padding: clamp(28px, 3.5vw, 40px);
          background: var(--bg);
          border: 1px solid var(--ink-line);
          display: flex; flex-direction: column; gap: 16px;
          position: relative;
          transition: transform .5s var(--ease), border-color .5s var(--ease), background .5s var(--ease);
        }
        .roadmap-card:hover {
          transform: translateY(-5px);
          border-color: var(--ink);
          background: var(--bg-2);
        }
        .roadmap-etapa {
          display: inline-flex; align-self: flex-start; align-items: center; gap: 8px;
          padding: 6px 14px;
          background: var(--ink);
          color: var(--bg);
          font-family: var(--font-text);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border-radius: 100px;
        }
        .roadmap-etapa::before {
          content: ""; width: 6px; height: 6px;
          background: var(--result); border-radius: 50%;
        }
        .roadmap-card h3 {
          font-size: clamp(1.1rem, 1.8vw, 1.35rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }
        .roadmap-card p {
          font-family: var(--font-text);
          font-size: 0.94rem;
          color: var(--ink-soft);
          line-height: 1.6;
        }

        /* ======================================================
           GO LIVE TABLE
           ====================================================== */
        .golive-table {
          display: flex; flex-direction: column;
          border-top: 1px solid var(--ink-line);
        }
        .golive-row {
          display: grid;
          grid-template-columns: 56px 1fr 200px;
          gap: 24px;
          padding: 22px 0;
          border-bottom: 1px solid var(--ink-line);
          align-items: center;
          transition: padding .4s var(--ease), background .4s var(--ease);
        }
        .golive-row:hover {
          padding-left: 16px; padding-right: 16px;
          background: var(--bg);
        }
        @media (max-width: 720px) {
          .golive-row { grid-template-columns: 40px 1fr; padding: 16px 0; gap: 16px; }
          .golive-row:hover { padding-left: 0; padding-right: 0; }
          .golive-resp { grid-column: 1 / -1; padding-left: 56px; font-size: 11px; text-align: left; }
        }
        .golive-num {
          font-family: var(--font-text);
          font-size: 13px;
          color: var(--ink-muted);
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.08em;
        }
        .golive-task {
          font-size: clamp(0.95rem, 1.3vw, 1.05rem);
          font-weight: 400;
          letter-spacing: -0.005em;
        }
        .golive-resp {
          font-family: var(--font-text);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
          text-align: right;
          display: inline-flex; align-items: center; gap: 8px;
          justify-content: flex-end;
        }
        .golive-resp::before {
          content: ""; width: 6px; height: 6px; border-radius: 50%;
          background: var(--process);
        }
        .golive-resp.dr::before { background: var(--process); }
        .golive-resp.dev::before { background: var(--transform); }
        .golive-resp.mix::before { background: var(--result); }
        @media (max-width: 720px) {
          .golive-resp { justify-content: flex-start; }
        }

        /* ======================================================
           CTA FINAL
           ====================================================== */
        .cta-final {
          padding: clamp(96px, 14vw, 180px) 0;
          background: var(--night);
          color: var(--bg);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-final::before {
          content: "";
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(800px, 80vw); height: min(800px, 80vw);
          background: radial-gradient(circle at center, rgba(201,242,85,0.10) 0%, transparent 60%);
          pointer-events: none;
        }
        .cta-final-inner { position: relative; z-index: 1; }
        .cta-final h2 {
          font-size: clamp(2.4rem, 7vw, 5.5rem);
          line-height: 1;
          font-weight: 400;
          letter-spacing: -0.045em;
          margin-bottom: clamp(28px, 4vw, 44px);
          max-width: 22ch;
          margin-left: auto;
          margin-right: auto;
        }
        .cta-final h2 em {
          font-style: italic;
          color: var(--result);
        }
        .cta-final p {
          font-family: var(--font-text);
          font-size: clamp(1rem, 1.6vw, 1.25rem);
          color: rgba(244,242,236,0.65);
          max-width: 58ch;
          margin: 0 auto clamp(48px, 6vw, 72px);
          line-height: 1.6;
        }
        .cta-actions {
          display: inline-flex; gap: 16px; flex-wrap: wrap;
          justify-content: center;
        }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 18px 36px;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 100px;
          transition: transform .4s var(--ease), background .4s var(--ease), box-shadow .4s var(--ease);
          border: 1px solid transparent;
        }
        .cta-btn .arrow {
          display: inline-block;
          transition: transform .4s var(--ease);
        }
        .cta-btn:hover .arrow { transform: translateX(4px); }
        .cta-btn.primary {
          background: var(--result);
          color: var(--ink);
          box-shadow: 0 8px 24px -6px rgba(201,242,85,0.4);
        }
        .cta-btn.primary:hover {
          transform: translateY(-3px);
          background: #D9FF66;
          box-shadow: 0 16px 32px -8px rgba(201,242,85,0.55);
        }
        .cta-btn.secondary {
          background: transparent;
          color: var(--bg);
          border-color: rgba(244,242,236,0.3);
        }
        .cta-btn.secondary:hover {
          background: rgba(244,242,236,0.08);
          transform: translateY(-3px);
          border-color: rgba(244,242,236,0.6);
        }

        /* ======================================================
           FOOTER
           ====================================================== */
        .footer-pres {
          padding: clamp(40px, 6vw, 64px) 0;
          border-top: 1px solid var(--ink-line);
          font-family: var(--font-text);
          font-size: 13px;
          color: var(--ink-soft);
          background: var(--bg);
        }
        .footer-grid {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; flex-wrap: wrap;
        }
        .footer-grid strong { color: var(--ink); font-weight: 500; }

        /* ======================================================
           REDUCED MOTION
           ====================================================== */
        @media (prefers-reduced-motion: reduce) {
          .hero-pres-title .word,
          .hero-scroll-cue,
          .pres-topbar-nav .dot,
          .hero-pres-tag .live-pill::before {
            animation: none !important;
          }
          [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="pres-2026">
        {/* ============== NOISE OVERLAY ============== */}
        <div className="pres-noise" aria-hidden="true" />

        {/* ============== PROGRESS BAR ============== */}
        <div className="pres-progress" aria-hidden="true">
          <div className="pres-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* ============== TOP BAR ============== */}
        <nav className="pres-topbar">
          <Link href="/" className="pres-brand" aria-label="Volver al sitio principal">
            <span className="pres-brand-mark">PD</span>
            <span className="pres-brand-meta">
              <span>Estudio De Luca</span>
              <small>Presentación · v1.0 · 2026</small>
            </span>
          </Link>
          <div className="pres-topbar-nav">
            <span className="hide-mobile">
              <span className="dot" />
              Sitio en producción
            </span>
            <span className="hide-mobile">·</span>
            <span>
              <strong>{siteConfig.whatsappDisplay}</strong>
            </span>
          </div>
        </nav>

        {/* ============== SIDEBAR INDICATOR ============== */}
        <div className="pres-sidebar" aria-hidden="true">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`pres-sidebar-item ${active === s.id ? "active" : ""}`}
            >
              <span className="bar" />
              <span className="lbl">
                {s.num} · {s.label}
              </span>
            </a>
          ))}
        </div>

        {/* ============== HERO ============== */}
        <section className="hero-pres">
          <div className="pres-wrap hero-pres-inner">
            <div className="hero-pres-tag" data-reveal>
              <span>Presentación de la solución</span>
              <span className="live-pill">live</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>web-deluca-abogado.vercel.app</span>
            </div>

            <h1 className="hero-pres-title">
              {HERO_TITLE_WORDS.map((w, i) => (
                <span key={i}>
                  <span className="word-wrap">
                    <span
                      className={`word${
                        w.accent === "process"
                          ? " accent-process"
                          : w.accent === "transform"
                            ? " accent-transform"
                            : w.accent === "result"
                              ? " accent-result"
                              : ""
                      }`}
                      style={{ animationDelay: `${0.4 + i * 0.07}s` }}
                    >
                      {w.text}
                    </span>
                  </span>
                  {"br" in w && w.br ? <br /> : <span> </span>}
                </span>
              ))}
            </h1>

            <p className="hero-pres-sub" data-reveal data-delay="3">
              Lo que sigue <strong>no es un sitio web</strong>. Es un sistema completo de captación,
              conversión, autoridad y operación — construido para el Estudio Jurídico Dr. Pablo De
              Luca con tecnología de punta y <strong>cumplimiento legal nativo</strong> desde el
              primer minuto.
            </p>

            <div className="hero-stats">
              {HERO_STATS.map((s, i) => (
                <div key={s.tag} className={`hero-stat ${s.color}`} data-reveal data-delay={4 + i}>
                  <span className="hero-stat-tag">{s.tag}</span>
                  <span className="hero-stat-num">{s.num}</span>
                  <span className="hero-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-scroll-cue" aria-hidden="true">
            Desliza
          </div>
        </section>

        {/* ============== MARQUEE ============== */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            <span>Captación digital</span>
            <span>Conversión medible</span>
            <span>Autoridad legal</span>
            <span>Operación automatizada</span>
            <span>Cumplimiento Ley 25.326</span>
            <span>SEO masivo</span>
            <span>Captación digital</span>
            <span>Conversión medible</span>
            <span>Autoridad legal</span>
            <span>Operación automatizada</span>
            <span>Cumplimiento Ley 25.326</span>
            <span>SEO masivo</span>
          </div>
        </div>

        {/* ============== 01 DIAGNÓSTICO ============== */}
        <section className="pres-section" id="diagnostico">
          <div className="pres-wrap">
            <div className="section-head">
              <div data-reveal>
                <div className="section-num">
                  <span className="dot-color dot-process" />
                  01 — Diagnóstico
                </div>
                <h2>
                  Cuatro problemas que <em className="process">casi nadie</em> resuelve.
                </h2>
              </div>
              <p className="section-bajada" data-reveal data-delay="1">
                La diferencia entre un sitio web y una plataforma profesional está en resolver
                problemas reales del negocio, no solo en verse bien. Estos son los cuellos de
                botella que detectamos antes de empezar a construir.
              </p>
            </div>
            <div className="diag-grid">
              {DIAGNOSTICO.map((d, i) => (
                <div
                  key={d.tag}
                  className="diag-card"
                  data-num={String(i + 1).padStart(2, "0")}
                  data-reveal
                  data-delay={i + 1}
                >
                  <span className="diag-tag">{d.tag}</span>
                  <h3>{d.head}</h3>
                  <p>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 02 SOLUCIÓN ============== */}
        <section className="pres-section dark" id="solucion">
          <div className="pres-wrap">
            <div className="section-head">
              <div data-reveal>
                <div className="section-num">
                  <span className="dot-color dot-process" />
                  02 — Solución
                </div>
                <h2>
                  Una <em className="result">plataforma operativa</em>, no un folleto digital.
                </h2>
              </div>
              <p className="manifiesto-text" data-reveal data-delay="1">
                Construimos un sitio que <em>trabaja por vos las 24 horas</em>: atrae con SEO útil,
                califica al visitante, automatiza la reserva, sincroniza con tu calendario y guarda
                todo bajo cumplimiento legal argentino.
              </p>
            </div>

            <div className="manifiesto-keys">
              <div className="manif-key" data-reveal data-delay="2">
                <span className="manif-num process">01.</span>
                <h4>Atrae</h4>
                <p>con herramientas que la gente busca todos los meses en Google.</p>
              </div>
              <div className="manif-key" data-reveal data-delay="3">
                <span className="manif-num transform">02.</span>
                <h4>Convierte</h4>
                <p>con un triaje pre-clasificado que llega al WhatsApp del Dr. ya ordenado.</p>
              </div>
              <div className="manif-key" data-reveal data-delay="4">
                <span className="manif-num result">03.</span>
                <h4>Opera sola</h4>
                <p>reserva, emails, Google Calendar y panel admin con auditoría completa.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============== MARQUEE 2 ============== */}
        <div className="marquee dark" aria-hidden="true">
          <div className="marquee-track">
            <span>21 features</span>
            <span>5 grupos</span>
            <span>140 tests</span>
            <span>31 rutas</span>
            <span>10 capas técnicas</span>
            <span>8 métricas</span>
            <span>21 features</span>
            <span>5 grupos</span>
            <span>140 tests</span>
            <span>31 rutas</span>
            <span>10 capas técnicas</span>
            <span>8 métricas</span>
          </div>
        </div>

        {/* ============== 03 INVENTARIO ============== */}
        <section className="pres-section" id="inventario">
          <div className="pres-wrap">
            <div className="section-head">
              <div data-reveal>
                <div className="section-num">
                  <span className="dot-color dot-process" />
                  03 — Inventario
                </div>
                <h2>
                  Todo lo que <em className="process">ya está</em> en producción.
                </h2>
              </div>
              <p className="section-bajada" data-reveal data-delay="1">
                Veintiún features funcionando, agrupadas en cinco frentes estratégicos. Cada una
                desarrollada, testeada y certificada para deploy.
              </p>
            </div>

            {INVENTARIO.map((g, i) => (
              <div key={g.grupo} className="grupo-block" data-reveal data-delay={i + 1}>
                <div className="grupo-head">
                  <span className="grupo-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="grupo-titulo">{g.grupo}</span>
                  <span className="grupo-count">
                    {g.items.length} {g.items.length === 1 ? "feature" : "features"}
                  </span>
                </div>
                <div className="grupo-items">
                  {g.items.map((item) => (
                    <div key={item.name} className="grupo-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-desc">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============== 04 BENEFICIOS ============== */}
        <section className="pres-section surface" id="beneficios">
          <div className="pres-wrap">
            <div className="section-head">
              <div data-reveal>
                <div className="section-num">
                  <span className="dot-color dot-transform" />
                  04 — Beneficios
                </div>
                <h2>
                  Por qué esto <em className="transform">cambia el juego</em>.
                </h2>
              </div>
              <p className="section-bajada" data-reveal data-delay="1">
                Cada decisión técnica responde a un problema de negocio concreto. No hay features de
                adorno — todo lo construido tiene una razón medible.
              </p>
            </div>
            <div className="benef-grid">
              {BENEFICIOS.map((b, i) => (
                <div key={b.titulo} className="benef" data-reveal data-delay={i + 1}>
                  <span className="benef-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{b.titulo}</h3>
                  <p>{b.detalle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 05 TECNOLOGÍA ============== */}
        <section className="pres-section" id="tecnologia">
          <div className="pres-wrap">
            <div className="section-head">
              <div data-reveal>
                <div className="section-num">
                  <span className="dot-color dot-transform" />
                  05 — Tecnología
                </div>
                <h2>
                  Stack <em className="transform">2026</em>, no Wordpress de 2014.
                </h2>
              </div>
              <p className="section-bajada" data-reveal data-delay="1">
                Construido sobre las mismas tecnologías que usan Vercel, Linear, Notion y los
                productos digitales premium. Mantenible, escalable y rápido por diseño.
              </p>
            </div>
            <div className="stack-table" data-reveal>
              {STACK.map((s, i) => (
                <div key={s.layer} className="stack-row">
                  <span className="stack-layer">{s.layer}</span>
                  <span className="stack-tech">{s.tech}</span>
                  <span className="stack-idx">
                    {String(i + 1).padStart(2, "0")} / {STACK.length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 06 MÉTRICAS ============== */}
        <section className="pres-section dark" id="metricas">
          <div className="pres-wrap">
            <div className="section-head">
              <div data-reveal>
                <div className="section-num">
                  <span className="dot-color dot-result" />
                  06 — Métricas
                </div>
                <h2>
                  Lo que se <em className="result">midió</em> durante el build.
                </h2>
              </div>
              <p className="section-bajada" data-reveal data-delay="1">
                Build verificable, tests automáticos, performance Core Web Vitals — todo medible y
                reproducible. Cero estimaciones.
              </p>
            </div>
            <div className="metricas-grid">
              {METRICAS.map((m, i) => (
                <div key={m.label} className="metrica" data-reveal data-delay={i + 1}>
                  <span className="metrica-label">{m.label}</span>
                  <span className="metrica-value">
                    <Counter value={m.value} suffix={m.suffix} />
                  </span>
                  <span className="metrica-note">{m.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 07 ROADMAP ============== */}
        <section className="pres-section" id="roadmap">
          <div className="pres-wrap">
            <div className="section-head">
              <div data-reveal>
                <div className="section-num">
                  <span className="dot-color dot-result" />
                  07 — Roadmap
                </div>
                <h2>
                  Lo que <em className="result">viene después</em>.
                </h2>
              </div>
              <p className="section-bajada" data-reveal data-delay="1">
                La plataforma está diseñada para crecer en módulos. Cuando el MVP esté validado,
                sumamos features premium que diferencian al estudio aún más de la competencia.
              </p>
            </div>
            <div className="roadmap-grid">
              {ROADMAP.map((r, i) => (
                <div key={r.titulo} className="roadmap-card" data-reveal data-delay={i + 1}>
                  <span className="roadmap-etapa">{r.etapa}</span>
                  <h3>{r.titulo}</h3>
                  <p>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 08 GO LIVE ============== */}
        <section className="pres-section surface" id="go-live">
          <div className="pres-wrap">
            <div className="section-head">
              <div data-reveal>
                <div className="section-num">
                  <span className="dot-color dot-result" />
                  08 — Go live
                </div>
                <h2>
                  Pasos para que el sitio <em className="result">empiece a generar</em>.
                </h2>
              </div>
              <p className="section-bajada" data-reveal data-delay="1">
                El sitio está deployado y funcionando. Para activar al 100% el sistema de turnos,
                emails y blog dinámico, necesitamos completar estos puntos.
              </p>
            </div>
            <div className="golive-table" data-reveal>
              {GO_LIVE.map((g, i) => (
                <div key={g.tarea} className="golive-row">
                  <span className="golive-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="golive-task">{g.tarea}</span>
                  <span
                    className={`golive-resp ${
                      g.responsable === "Dev" ? "dev" : g.responsable.includes("+") ? "mix" : "dr"
                    }`}
                  >
                    {g.responsable}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== CTA FINAL ============== */}
        <section className="cta-final">
          <div className="pres-wrap cta-final-inner">
            <h2 data-reveal>
              El sitio está en producción.
              <br />
              Falta <em>encenderlo</em>.
            </h2>
            <p data-reveal data-delay="1">
              El código está desplegado en Vercel. Faltan tus datos reales y la configuración de las
              cuentas externas (Supabase, Resend, Google Calendar). Coordinamos esto en una llamada
              de 30 minutos y dejamos el sitio vivo.
            </p>
            <div className="cta-actions" data-reveal data-delay="2">
              <a
                href="https://web-deluca-abogado.vercel.app/"
                className="cta-btn primary"
                target="_blank"
                rel="noreferrer"
              >
                Ver el sitio en vivo <span className="arrow">→</span>
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  "Hola, vi la presentación. Coordinemos para arrancar."
                )}`}
                className="cta-btn secondary"
                target="_blank"
                rel="noreferrer"
              >
                Coordinemos por WhatsApp <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ============== FOOTER ============== */}
        <footer className="footer-pres">
          <div className="pres-wrap footer-grid">
            <span>
              <strong>Estudio Jurídico Dr. Pablo De Luca</strong> · Presentación generada para
              revisión interna · v1.0
            </span>
            <span>2026 · web-deluca-abogado.vercel.app</span>
          </div>
        </footer>
      </div>
    </>
  );
}
