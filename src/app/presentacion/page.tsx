"use client";

import Link from "next/link";
import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

/* ============================================================
   PRESENTACIÓN — Memorando ejecutivo editorial
   ============================================================
   Estética: informe confidencial premium tipo bufete británico /
   white paper jurídico. Match completo con el sitio principal
   (marino + dorado + cream + Playfair + Lora). Sobrio, sin
   colores eléctricos, sin marquees, sin distracciones.

   Estructura tipo libro:
   - Cubierta (hero portada)
   - Índice general
   - 8 capítulos numerados en romanos
   - Colofón final
   ============================================================ */

const CHAPTERS = [
  { id: "diagnostico", roman: "I", num: "01", label: "Diagnóstico" },
  { id: "solucion", roman: "II", num: "02", label: "Solución" },
  { id: "inventario", roman: "III", num: "03", label: "Inventario" },
  { id: "beneficios", roman: "IV", num: "04", label: "Beneficios" },
  { id: "tecnologia", roman: "V", num: "05", label: "Tecnología" },
  { id: "metricas", roman: "VI", num: "06", label: "Métricas" },
  { id: "roadmap", roman: "VII", num: "07", label: "Roadmap" },
  { id: "go-live", roman: "VIII", num: "08", label: "Puesta en marcha" },
] as const;

const DIAGNOSTICO = [
  {
    tag: "Primer problema",
    head: "El sitio aparece en Google solo si el cliente busca tu nombre.",
    desc: "Sin contenido útil indexable, el sitio se transforma en una tarjeta de presentación. Quien todavía no te conoce, no te encuentra. Es necesario entregar valor para que los buscadores te muestren.",
  },
  {
    tag: "Segundo problema",
    head: "El formulario genérico no convierte. El cliente se va al primer abogado que conteste.",
    desc: "Un “contactanos” pierde contra un proceso claro. Si el visitante no entiende cuánto cuesta, cuándo va a tener respuesta y por qué tu estudio, simplemente abandona.",
  },
  {
    tag: "Tercer problema",
    head: "Coordinar turnos por WhatsApp consume horas que deberían ir al expediente.",
    desc: "Cada turno coordinado a mano son entre ocho y doce mensajes. Multiplicado por veinte consultas mensuales, equivale a una jornada laboral entera dedicada a logística.",
  },
  {
    tag: "Cuarto problema",
    head: "Sin diferenciadores visibles, todos los abogados parecen iguales al cliente.",
    desc: "El visitante no distingue entre doscientos estudios con la misma estructura: hero, áreas, contacto. Quien entrega valor antes de cobrar gana la conversación.",
  },
];

const SOLUCION_PILARES = [
  {
    label: "Captación",
    title: "Atrae con herramientas que la gente busca todos los meses.",
    desc: "Calculadoras, verificadores, glosario y blog generan SEO masivo. El sitio gana posiciones por entregar valor, no por publicidad pagada.",
  },
  {
    label: "Conversión",
    title: "Califica al visitante antes del primer contacto.",
    desc: "El triaje de WhatsApp pre-clasifica al cliente en tres clicks. Cuando llega al Dr., ya viene con área legal, urgencia y tipo de consulta ordenados.",
  },
  {
    label: "Operación",
    title: "Reserva, calendario y emails automatizados.",
    desc: "Sincronización con Google Calendar, confirmaciones automáticas al cliente y al Dr., panel admin con auditoría. Sin ping-pong de mensajes operativos.",
  },
];

const INVENTARIO = [
  {
    grupo: "Captura de demanda",
    items: [
      { name: "Landing portfolio editorial", desc: "Hero + áreas + casos + about + contacto." },
      {
        name: "Triaje WhatsApp pre-clasificado",
        desc: "Wizard de tres clicks → mensaje pre-armado al Dr.",
      },
      {
        name: "Reserva de turnos online",
        desc: "Calendario + slots + formulario. Sincronización con Google Calendar.",
      },
      {
        name: "Centro de descargas con lead capture",
        desc: "Cuatro PDFs con formulario → lista de leads en base de datos.",
      },
    ],
  },
  {
    grupo: "Posicionamiento orgánico",
    items: [
      {
        name: "Calculadora indemnización por despido",
        desc: "Artículos 245 LCT, 232, 233 y 80. Estimación en vivo.",
      },
      {
        name: "Calculadora cuota alimentaria",
        desc: "Porcentaje jurisprudencial sobre sueldo bruto, hijos y edades.",
      },
      {
        name: "Calculadora indemnización ART",
        desc: "Ley 24.557 y 26.773 con coeficiente de edad.",
      },
      {
        name: "Verificador de despido",
        desc: "Cinco preguntas → diagnóstico legal, dudoso o ilegal.",
      },
      {
        name: "Glosario jurídico A–Z",
        desc: "Términos legales con URL individual y Schema.org DefinedTerm.",
      },
      {
        name: "Línea de tiempo proceso de divorcio",
        desc: "Infografía paso a paso con HowTo schema.",
      },
      {
        name: "Blog editorial + admin",
        desc: "Artículos en Markdown con FAQPage y Article schema.",
      },
    ],
  },
  {
    grupo: "Construcción de autoridad",
    items: [
      {
        name: "Casos resueltos narrativos",
        desc: "Tres historias anonimizadas con resultado concreto.",
      },
      {
        name: "Sello de matrícula verificable",
        desc: "Enlace directo al perfil oficial del Colegio de Mendoza.",
      },
      {
        name: "Trayectoria profesional",
        desc: "Sección sobre el Dr., credenciales y foto institucional.",
      },
    ],
  },
  {
    grupo: "Operación interna",
    items: [
      {
        name: "Panel admin protegido",
        desc: "Basic Auth con guard server-side. Turnos, leads, blog, glosario.",
      },
      {
        name: "Sistema de emails transaccionales",
        desc: "Confirmación al cliente y notificación al Dr. con reintentos.",
      },
      {
        name: "Rate limiting + anti-bot",
        desc: "Honeypot y Upstash Ratelimit en formularios sensibles.",
      },
      {
        name: "WhatsApp directo",
        desc: "Enlaces pre-armados desde todo el sitio hacia el WhatsApp del Dr.",
      },
    ],
  },
  {
    grupo: "Cumplimiento legal",
    items: [
      {
        name: "Política de privacidad Ley 25.326",
        desc: "Once secciones cumpliendo Habeas Data y derechos ARCO.",
      },
      {
        name: "Términos de uso",
        desc: "Disclaimer de calculadoras, propiedad intelectual y jurisdicción Mendoza.",
      },
      {
        name: "Consentimiento expreso en formularios",
        desc: "Checkbox Ley 25.326 con persistencia y timestamp.",
      },
      {
        name: "Audit log y política de retención",
        desc: "Turnos dos años, leads un año, audit cinco años.",
      },
    ],
  },
];

const BENEFICIOS = [
  {
    titulo: "Tráfico orgánico sin publicidad paga",
    detalle:
      "Las tres calculadoras, el glosario, el verificador y el blog generan SEO masivo. Cada herramienta rankea por separado en buscadores. Las consultas por términos como “calcular indemnización por despido Argentina” se hacen miles de veces al mes.",
  },
  {
    titulo: "Conversión superior al formulario clásico",
    detalle:
      "El triaje pre-clasifica al cliente en tres clicks. Cuando el mensaje llega al WhatsApp del Dr., ya viene con área legal identificada, urgencia y tipo de consulta. Se elimina por completo la fricción inicial de discovery.",
  },
  {
    titulo: "Menos tiempo dedicado a coordinación",
    detalle:
      "La reserva online sincroniza con el Google Calendar del Dr. El cliente recibe email automático con dirección, fecha, hora y cómo llegar. No existe ping-pong de mensajes para coordinar agendas.",
  },
  {
    titulo: "Diferenciación frente a la competencia local",
    detalle:
      "En San Rafael, prácticamente ningún estudio del rubro ofrece calculadoras, verificadores, descargas gratuitas ni glosario. El sitio se percibe como premium y entrega valor antes de cobrar la primera consulta.",
  },
  {
    titulo: "Posicionamiento como autoridad",
    detalle:
      "Los casos narrativos, los recursos descargables y el blog editorial muestran competencia real, no solo años en una biografía. Los clientes contratan abogados que demuestran que saben, no que dicen que saben.",
  },
  {
    titulo: "Cumplimiento legal desde el día uno",
    detalle:
      "La Ley 25.326 de Habeas Data está cubierta en política de privacidad, consentimiento expreso en formularios, política de retención y separación de datos sensibles en logs auditados.",
  },
];

const STACK = [
  { layer: "Frontend", tech: "Next.js 16 · React Server Components · Turbopack · Tailwind 4" },
  {
    layer: "Diseño",
    tech: "Sistema custom · Playfair Display + Lora + Montserrat · paleta marino y dorado · WCAG AA",
  },
  {
    layer: "Backend",
    tech: "Server Actions · Drizzle ORM · postgres.js · validación Zod en servidor",
  },
  {
    layer: "Base de datos",
    tech: "Supabase Postgres Pooler · cuatro tablas (turnos, leads, blog, glosario)",
  },
  { layer: "Emails", tech: "Resend · React Email Templates · reintentos exponenciales" },
  { layer: "Calendario", tech: "Google Calendar API v3 · Service Account JWT" },
  {
    layer: "Seguridad",
    tech: "Basic Auth proxy · timing-safe XOR · CSP estricta · HSTS · rate limiting",
  },
  {
    layer: "SEO",
    tech: "Sitemap dinámico · robots.txt · Schema.org (LegalService, Article, HowTo, DefinedTerm)",
  },
  {
    layer: "Aseguramiento",
    tech: "140 tests Vitest · once archivos de spec · build limpio · cero errores de lint",
  },
  { layer: "Hosting", tech: "Vercel Edge · CI/CD automático en push a main · HTTPS y CDN global" },
];

const METRICAS = [
  { label: "Rutas en producción", value: "31", note: "estáticas, SSG y dinámicas" },
  { label: "Tareas de desarrollo", value: "47", note: "ejecutadas en once batches" },
  { label: "Tests automatizados", value: "140", note: "pasando al cien por ciento" },
  { label: "Build de producción", value: "60s", note: "con Turbopack" },
  { label: "Schemas SEO", value: "05", note: "tipos distintos implementados" },
  { label: "Calculadoras legales", value: "03", note: "gratuitas y verificadas" },
  { label: "Objetivo Lighthouse", value: "90+", note: "performance, SEO y accesibilidad" },
  { label: "Cumplimiento legal", value: "100%", note: "Ley 25.326 cubierta" },
];

const ROADMAP = [
  {
    fase: "Fase II",
    horizonte: "Próximos 90 días",
    items: [
      {
        titulo: "Portal del cliente con login",
        desc: "Acceso individual a estado del caso, documentos, audiencias y chat directo.",
      },
      {
        titulo: "Asistente IA con triaje",
        desc: "Chat conversacional que identifica el caso en tres a cinco preguntas y agenda.",
      },
      {
        titulo: "Pagos online con Mercado Pago",
        desc: "Cobro de honorarios desde la web, con cuotas y factura automática.",
      },
      {
        titulo: "Suscripciones recurrentes",
        desc: "Planes PyME, Familia, Freelance e Inmobiliario.",
      },
    ],
  },
  {
    fase: "Fase III",
    horizonte: "Horizonte de seis meses",
    items: [
      {
        titulo: "Análisis IA de documentos",
        desc: "El cliente sube su contrato y la IA marca cláusulas riesgosas. Lead magnet de alto valor.",
      },
      {
        titulo: "Generador automático de documentos",
        desc: "Wizard para armar carta documento o poder simple. PDF descargable.",
      },
    ],
  },
];

const GO_LIVE = [
  { tarea: "Confirmar número de matrícula real", responsable: "Dr." },
  { tarea: "Confirmar URL del perfil en el Colegio de Mendoza", responsable: "Dr." },
  { tarea: "Enviar dirección exacta del estudio y Google Maps embed", responsable: "Dr." },
  { tarea: "Confirmar email para notificaciones automáticas", responsable: "Dr." },
  { tarea: "Aprobar fórmulas de las tres calculadoras", responsable: "Dr." },
  { tarea: "Validar tres casos narrativos (Laboral, Familia, Civil)", responsable: "Dr." },
  { tarea: "Aprobar ocho hitos del proceso de divorcio", responsable: "Dr." },
  { tarea: "Enviar fotos profesionales del Dr. y del estudio", responsable: "Dr." },
  {
    tarea: "Configurar Supabase, Resend, Google Service y Upstash en Vercel",
    responsable: "Estudio",
  },
  { tarea: "Verificar dominio Resend (DKIM, SPF y DMARC)", responsable: "Estudio y Dr." },
  { tarea: "Reemplazar PDFs placeholders por documentos reales", responsable: "Dr." },
  { tarea: "Aprobar dos a tres artículos del blog inicial", responsable: "Dr." },
  { tarea: "Dominio custom (ej. deluca-abogado.com.ar)", responsable: "Estudio y Dr." },
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
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
}

export default function Page() {
  useReveal();

  return (
    <>
      <style>{`
        /* ============== HIDE SITE CHROME ============== */
        body:has(.pres-editorial) header,
        body:has(.pres-editorial) footer[role="contentinfo"],
        body:has(.pres-editorial) a[aria-label*="WhatsApp"],
        body:has(.pres-editorial) a[aria-label*="Contactar"],
        body:has(.pres-editorial) .skip-link { display: none !important; }
        body:has(.pres-editorial) main#main-content,
        body:has(.pres-editorial) main {
          padding: 0 !important; margin: 0 !important; min-height: 0 !important;
        }
        body:has(.pres-editorial) { background: #0A1224 !important; }

        /* ============== TOKENS — DARK MODE editorial premium ============== */
        .pres-editorial {
          /* Fondos en escala oscura (marino → negro) */
          --bg: #0A1224;
          --bg-2: #11193A;
          --bg-deep: #050912;
          --paper: #161F3C;

          /* Texto y líneas (cream sobre oscuro) */
          --cream: #F4EFE7;
          --cream-2: #FAF7F2;
          --ink: #F4EFE7;
          --ink-soft: rgba(244,239,231,0.72);
          --ink-muted: rgba(244,239,231,0.50);
          --ink-faint: rgba(244,239,231,0.32);
          --ink-line: rgba(244,239,231,0.10);
          --ink-line-2: rgba(244,239,231,0.20);

          /* Dorado (más claro para legibilidad sobre dark) */
          --dorado: #D4B872;
          --dorado-deep: #C9A961;

          /* Marino (ahora se usa solo como acento donde antes era cream) */
          --marino: #F4EFE7;
          --marino-2: #D4B872;
          --carbon-soft: rgba(244,239,231,0.78);

          --ease: cubic-bezier(0.22, 1, 0.36, 1);
          --gutter: clamp(20px, 4.5vw, 56px);
          --wrap: 1180px;
          --wrap-narrow: 920px;

          min-height: 100vh;
          background: var(--bg);
          color: var(--cream);
          font-family: 'Lora', Georgia, 'Times New Roman', serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          line-height: 1.55;
          overflow-x: hidden;
        }
        .pres-editorial *, .pres-editorial *::before, .pres-editorial *::after {
          box-sizing: border-box;
        }
        .pres-editorial h1, .pres-editorial h2, .pres-editorial h3,
        .pres-editorial h4, .pres-editorial h5, .pres-editorial h6 {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 400;
          color: var(--marino);
          margin: 0;
          line-height: 1.12;
          letter-spacing: -0.015em;
        }
        .pres-editorial p { margin: 0; }
        .pres-editorial a { text-decoration: none; color: inherit; }

        .pres-wrap { max-width: var(--wrap); margin: 0 auto; padding: 0 var(--gutter); }
        .pres-wrap-narrow { max-width: var(--wrap-narrow); margin: 0 auto; padding: 0 var(--gutter); }

        /* ============== REVEAL ============== */
        [data-reveal] {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1.1s var(--ease), transform 1.1s var(--ease);
        }
        [data-reveal][data-revealed="true"] {
          opacity: 1; transform: translateY(0);
        }
        [data-reveal][data-delay="1"] { transition-delay: 0.10s; }
        [data-reveal][data-delay="2"] { transition-delay: 0.20s; }
        [data-reveal][data-delay="3"] { transition-delay: 0.30s; }
        [data-reveal][data-delay="4"] { transition-delay: 0.40s; }
        [data-reveal][data-delay="5"] { transition-delay: 0.50s; }
        [data-reveal][data-delay="6"] { transition-delay: 0.60s; }
        [data-reveal][data-delay="7"] { transition-delay: 0.70s; }

        /* ============== TOP BAR ============== */
        .pres-topbar {
          padding: 22px var(--gutter);
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid var(--ink-line);
          background: rgba(10,18,36,0.82);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          position: sticky; top: 0; z-index: 60;
        }
        .pres-brand {
          display: flex; align-items: center; gap: 14px;
        }
        .pres-brand-mark {
          width: 42px; height: 42px;
          border: 1.5px solid var(--dorado);
          border-radius: 50%;
          display: grid; place-items: center;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 18px;
          color: var(--dorado);
          background: transparent;
        }
        .pres-brand-text {
          display: flex; flex-direction: column; gap: 2px;
        }
        .pres-brand-text strong {
          font-family: 'Playfair Display', serif;
          font-weight: 500;
          font-size: 16px;
          letter-spacing: -0.01em;
          color: var(--marino);
        }
        .pres-brand-text small {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .pres-topbar-meta {
          display: flex; align-items: center; gap: 24px;
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .pres-topbar-meta .divider {
          width: 1px; height: 16px;
          background: var(--ink-line-2);
        }
        @media (max-width: 780px) {
          .pres-topbar-meta .hide-mobile { display: none; }
        }

        /* ============== CUBIERTA / HERO ============== */
        .cubierta {
          padding: clamp(64px, 9vw, 120px) 0 clamp(56px, 8vw, 96px);
          position: relative;
        }
        .cubierta-frame {
          border-top: 1px solid var(--dorado);
          border-bottom: 1px solid var(--dorado);
          padding: clamp(48px, 7vw, 88px) 0;
          position: relative;
        }

        .cubierta-eyebrow {
          display: flex; align-items: center; justify-content: center;
          gap: 18px;
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--dorado-deep);
          margin-bottom: clamp(28px, 4vw, 44px);
        }
        .cubierta-eyebrow::before,
        .cubierta-eyebrow::after {
          content: "";
          width: 40px; height: 1px;
          background: var(--dorado-deep);
        }

        .cubierta-title {
          text-align: center;
          font-size: clamp(2.6rem, 7vw, 5.4rem);
          font-weight: 400;
          line-height: 1.04;
          letter-spacing: -0.022em;
          color: var(--marino);
          max-width: 22ch;
          margin: 0 auto clamp(28px, 4vw, 40px);
        }
        .cubierta-title em {
          font-style: italic;
          color: var(--dorado-deep);
          font-weight: 400;
        }

        .cubierta-rule {
          width: 60px; height: 1px;
          background: var(--dorado);
          margin: 0 auto clamp(24px, 4vw, 36px);
        }
        .cubierta-lead {
          text-align: center;
          font-family: 'Lora', Georgia, serif;
          font-style: italic;
          font-size: clamp(1.05rem, 1.7vw, 1.35rem);
          line-height: 1.6;
          color: var(--carbon-soft);
          max-width: 56ch;
          margin: 0 auto clamp(40px, 6vw, 60px);
          font-weight: 400;
        }

        .cubierta-folio {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0;
          border-top: 1px solid var(--ink-line);
          padding-top: clamp(28px, 4vw, 40px);
          max-width: 720px;
          margin: 0 auto;
        }
        @media (max-width: 720px) {
          .cubierta-folio { grid-template-columns: 1fr; gap: 24px; padding-top: 24px; }
        }
        .cubierta-folio > div {
          text-align: center;
          padding: 0 16px;
          position: relative;
        }
        .cubierta-folio > div + div::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 1px;
          background: var(--ink-line);
        }
        @media (max-width: 720px) {
          .cubierta-folio > div + div::before { display: none; }
        }
        .folio-label {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin-bottom: 10px;
        }
        .folio-value {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.4rem, 2.2vw, 1.7rem);
          font-weight: 500;
          letter-spacing: -0.015em;
          color: var(--marino);
        }
        .folio-value em {
          font-style: italic;
          color: var(--dorado-deep);
          font-weight: 400;
        }

        /* ============== ÍNDICE ============== */
        .indice-section {
          padding: clamp(80px, 10vw, 120px) 0;
          background: var(--bg-2);
          border-top: 1px solid var(--ink-line);
          border-bottom: 1px solid var(--ink-line);
        }
        .indice-head {
          text-align: center;
          margin-bottom: clamp(48px, 7vw, 80px);
        }
        .indice-eyebrow {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--dorado-deep);
          font-weight: 500;
          margin-bottom: 18px;
          display: inline-flex; align-items: center; gap: 14px;
        }
        .indice-eyebrow::before,
        .indice-eyebrow::after {
          content: "";
          width: 28px; height: 1px;
          background: var(--dorado-deep);
        }
        .indice-title {
          font-size: clamp(2rem, 4.5vw, 3.6rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: var(--marino);
        }
        .indice-title em {
          font-style: italic;
          color: var(--dorado-deep);
        }

        .indice-list {
          max-width: 720px;
          margin: 0 auto;
          list-style: none;
          padding: 0;
        }
        .indice-row {
          display: grid;
          grid-template-columns: 60px 1fr auto;
          gap: 24px;
          padding: 22px 4px;
          border-bottom: 1px solid var(--ink-line);
          align-items: baseline;
          transition: padding .4s var(--ease), background .4s var(--ease);
        }
        .indice-list li:first-child .indice-row { border-top: 1px solid var(--ink-line); }
        .indice-row:hover {
          padding-left: 18px; padding-right: 18px;
        }
        .indice-roman {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 18px;
          color: var(--dorado-deep);
          font-variant-numeric: tabular-nums;
        }
        .indice-label {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.05rem, 1.6vw, 1.3rem);
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--marino);
        }
        .indice-page {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--ink-soft);
          font-variant-numeric: tabular-nums;
        }

        /* ============== CHAPTER HEAD ============== */
        section.chapter {
          padding: clamp(80px, 12vw, 140px) 0;
          position: relative;
        }
        section.chapter.tinted { background: var(--bg-2); }
        section.chapter.deep {
          background: var(--bg-deep);
          color: var(--cream);
        }
        section.chapter.deep h1,
        section.chapter.deep h2,
        section.chapter.deep h3,
        section.chapter.deep h4 { color: var(--cream); }

        .chapter-head {
          text-align: center;
          margin-bottom: clamp(56px, 8vw, 96px);
        }
        .chapter-roman {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 400;
          color: var(--dorado-deep);
          line-height: 1;
          margin-bottom: 12px;
        }
        section.chapter.deep .chapter-roman { color: var(--dorado); }
        .chapter-label {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-weight: 500;
          margin-bottom: 28px;
          display: inline-flex; align-items: center; gap: 14px;
        }
        section.chapter.deep .chapter-label { color: rgba(250,247,242,0.7); }
        .chapter-label::before,
        .chapter-label::after {
          content: "";
          width: 32px; height: 1px;
          background: currentColor;
          opacity: 0.6;
        }
        .chapter-title {
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 400;
          letter-spacing: -0.025em;
          line-height: 1.05;
          max-width: 24ch;
          margin: 0 auto 28px;
        }
        .chapter-title em {
          font-style: italic;
          color: var(--dorado-deep);
        }
        section.chapter.deep .chapter-title em { color: var(--dorado); }
        .chapter-rule {
          width: 48px; height: 1px;
          background: var(--dorado);
          margin: 0 auto 28px;
        }
        section.chapter.deep .chapter-rule { background: var(--dorado); }
        .chapter-lead {
          font-family: 'Lora', Georgia, serif;
          font-style: italic;
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          line-height: 1.65;
          color: var(--carbon-soft);
          max-width: 58ch;
          margin: 0 auto;
        }
        section.chapter.deep .chapter-lead { color: rgba(250,247,242,0.78); }

        /* ============== DIAGNÓSTICO ============== */
        .diag-stack {
          display: flex; flex-direction: column;
          max-width: 880px;
          margin: 0 auto;
        }
        .diag-row {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: clamp(24px, 4vw, 56px);
          padding: clamp(36px, 5vw, 52px) 0;
          border-bottom: 1px solid var(--ink-line);
          align-items: start;
        }
        .diag-row:first-child { border-top: 1px solid var(--ink-line); }
        @media (max-width: 780px) {
          .diag-row { grid-template-columns: 1fr; gap: 20px; }
        }
        .diag-marker {
          display: flex; flex-direction: column; gap: 12px;
        }
        .diag-marker-num {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          font-weight: 400;
          color: var(--dorado-deep);
          line-height: 1;
        }
        .diag-marker-tag {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-weight: 500;
        }
        .diag-body h3 {
          font-size: clamp(1.3rem, 2.3vw, 1.85rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 14px;
          max-width: 28ch;
        }
        .diag-body p {
          font-family: 'Lora', Georgia, serif;
          font-size: clamp(0.98rem, 1.3vw, 1.08rem);
          line-height: 1.7;
          color: var(--carbon-soft);
          max-width: 54ch;
        }

        /* ============== SOLUCIÓN PILARES ============== */
        .pilares-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(28px, 4vw, 48px);
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (max-width: 880px) { .pilares-grid { grid-template-columns: 1fr; } }
        .pilar {
          padding: clamp(32px, 4vw, 48px) clamp(28px, 3vw, 40px);
          background: rgba(250,247,242,0.04);
          border: 1px solid rgba(201,169,97,0.20);
          display: flex; flex-direction: column; gap: 18px;
          position: relative;
          transition: background .5s var(--ease), border-color .5s var(--ease), transform .5s var(--ease);
        }
        .pilar:hover {
          background: rgba(250,247,242,0.08);
          border-color: var(--dorado);
          transform: translateY(-4px);
        }
        .pilar-label {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--dorado);
          font-weight: 500;
        }
        .pilar h3 {
          font-size: clamp(1.2rem, 1.9vw, 1.5rem);
          font-weight: 500;
          letter-spacing: -0.015em;
          line-height: 1.25;
          color: var(--cream);
          max-width: 22ch;
        }
        .pilar p {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.98rem;
          line-height: 1.7;
          color: rgba(244,239,231,0.72);
        }

        /* ============== INVENTARIO ============== */
        .inv-block {
          max-width: 1000px;
          margin: 0 auto clamp(56px, 7vw, 84px);
        }
        .inv-block:last-child { margin-bottom: 0; }
        .inv-block-head {
          display: flex; align-items: baseline; gap: 20px;
          padding-bottom: 18px;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--dorado);
        }
        .inv-block-num {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.4rem;
          color: var(--dorado-deep);
          font-variant-numeric: tabular-nums;
        }
        .inv-block-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.4rem, 2.4vw, 1.9rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--marino);
        }
        .inv-block-count {
          margin-left: auto;
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .inv-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px 48px;
        }
        @media (max-width: 720px) { .inv-list { grid-template-columns: 1fr; } }
        .inv-item {
          padding: 20px 0;
          border-bottom: 1px dotted var(--ink-line-2);
          display: flex; flex-direction: column; gap: 8px;
        }
        .inv-item-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1rem, 1.4vw, 1.15rem);
          font-weight: 500;
          letter-spacing: -0.012em;
          color: var(--marino);
          display: flex; align-items: baseline; gap: 12px;
        }
        .inv-item-name::before {
          content: "§";
          color: var(--dorado-deep);
          font-style: italic;
          font-size: 1.1em;
          flex-shrink: 0;
        }
        .inv-item-desc {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--carbon-soft);
          padding-left: 22px;
        }

        /* ============== BENEFICIOS ============== */
        .benef-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(28px, 4vw, 52px) clamp(40px, 5vw, 72px);
          max-width: 1080px;
          margin: 0 auto;
          counter-reset: benef;
        }
        @media (max-width: 780px) { .benef-grid { grid-template-columns: 1fr; } }
        .benef-item {
          padding-top: 28px;
          border-top: 1px solid var(--dorado);
          position: relative;
        }
        .benef-item::before {
          counter-increment: benef;
          content: counter(benef, decimal-leading-zero);
          position: absolute;
          top: -1px; left: 0;
          background: var(--bg);
          padding: 0 12px 0 0;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 13px;
          color: var(--dorado-deep);
          transform: translateY(-58%);
          font-variant-numeric: tabular-nums;
        }
        .benef-item h3 {
          font-size: clamp(1.15rem, 1.9vw, 1.4rem);
          font-weight: 500;
          letter-spacing: -0.018em;
          line-height: 1.25;
          margin-bottom: 14px;
          color: var(--marino);
          max-width: 26ch;
        }
        .benef-item p {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.98rem;
          line-height: 1.7;
          color: var(--carbon-soft);
        }

        /* ============== TECNOLOGÍA (STACK) ============== */
        .stack-table {
          max-width: 980px;
          margin: 0 auto;
          border-top: 1px solid var(--ink-line-2);
        }
        .stack-row {
          display: grid;
          grid-template-columns: 220px 1fr 80px;
          gap: 32px;
          padding: 22px 0;
          border-bottom: 1px solid var(--ink-line);
          align-items: center;
          transition: background .35s var(--ease), padding .35s var(--ease);
        }
        .stack-row:hover {
          background: rgba(201,169,97,0.05);
          padding-left: 18px; padding-right: 18px;
        }
        @media (max-width: 780px) {
          .stack-row { grid-template-columns: 1fr; gap: 6px; padding: 18px 0; }
          .stack-row:hover { padding-left: 0; padding-right: 0; }
          .stack-idx { display: none; }
        }
        .stack-layer {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1rem, 1.4vw, 1.15rem);
          color: var(--dorado-deep);
          font-weight: 500;
        }
        .stack-tech {
          font-family: 'Lora', Georgia, serif;
          font-size: clamp(0.95rem, 1.3vw, 1.05rem);
          line-height: 1.55;
          color: var(--carbon-soft);
        }
        .stack-idx {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--ink-muted);
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        /* ============== MÉTRICAS ============== */
        .metricas-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          max-width: 1080px;
          margin: 0 auto;
          border: 1px solid rgba(201,169,97,0.25);
        }
        @media (max-width: 880px) { .metricas-grid { grid-template-columns: repeat(2, 1fr); } }
        .metrica {
          padding: clamp(28px, 3.5vw, 44px) clamp(20px, 2.5vw, 32px);
          text-align: center;
          border-right: 1px solid rgba(201,169,97,0.25);
          border-bottom: 1px solid rgba(201,169,97,0.25);
          display: flex; flex-direction: column; gap: 10px;
          background: rgba(250,247,242,0.02);
          transition: background .4s var(--ease);
        }
        .metrica:hover { background: rgba(250,247,242,0.06); }
        .metrica:nth-child(4n) { border-right: none; }
        .metrica:nth-last-child(-n+4) { border-bottom: none; }
        @media (max-width: 880px) {
          .metrica:nth-child(4n) { border-right: 1px solid rgba(201,169,97,0.25); }
          .metrica:nth-child(2n) { border-right: none; }
          .metrica:nth-last-child(-n+4) { border-bottom: 1px solid rgba(201,169,97,0.25); }
          .metrica:nth-last-child(-n+2) { border-bottom: none; }
        }
        .metrica-value {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 5vw, 4.2rem);
          font-weight: 400;
          letter-spacing: -0.035em;
          line-height: 1;
          color: var(--dorado);
          font-variant-numeric: tabular-nums;
        }
        .metrica-label {
          font-family: 'Lora', Georgia, serif;
          font-size: clamp(0.95rem, 1.3vw, 1.05rem);
          font-style: italic;
          color: var(--cream);
          line-height: 1.3;
        }
        .metrica-note {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(244,239,231,0.52);
          font-weight: 500;
        }

        /* ============== ROADMAP ============== */
        .roadmap-fase {
          max-width: 1000px;
          margin: 0 auto clamp(56px, 7vw, 80px);
        }
        .roadmap-fase:last-child { margin-bottom: 0; }
        .roadmap-fase-head {
          display: flex; align-items: baseline; gap: 20px;
          padding-bottom: 18px;
          margin-bottom: 32px;
          border-bottom: 1px solid var(--dorado);
        }
        .roadmap-fase-name {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1.4rem, 2.4vw, 1.9rem);
          font-weight: 500;
          color: var(--marino);
        }
        .roadmap-fase-horizonte {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-weight: 500;
          margin-left: auto;
        }
        .roadmap-items {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(20px, 3vw, 40px);
        }
        @media (max-width: 780px) { .roadmap-items { grid-template-columns: 1fr; } }
        .roadmap-item {
          padding: clamp(24px, 3vw, 36px);
          background: var(--paper);
          border: 1px solid var(--ink-line);
          display: flex; flex-direction: column; gap: 12px;
          transition: border-color .4s var(--ease), transform .4s var(--ease);
        }
        .roadmap-item:hover {
          border-color: var(--dorado);
          transform: translateY(-3px);
        }
        .roadmap-item h3 {
          font-size: clamp(1.1rem, 1.7vw, 1.3rem);
          font-weight: 500;
          letter-spacing: -0.015em;
          line-height: 1.25;
        }
        .roadmap-item p {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--carbon-soft);
        }

        /* ============== GO LIVE ============== */
        .golive-table {
          max-width: 980px;
          margin: 0 auto;
          border-top: 1px solid var(--ink-line-2);
        }
        .golive-row {
          display: grid;
          grid-template-columns: 60px 1fr 160px;
          gap: 24px;
          padding: 22px 0;
          border-bottom: 1px solid var(--ink-line);
          align-items: center;
          transition: background .35s var(--ease), padding .35s var(--ease);
        }
        .golive-row:hover {
          background: var(--paper);
          padding-left: 18px; padding-right: 18px;
        }
        @media (max-width: 720px) {
          .golive-row { grid-template-columns: 40px 1fr; gap: 16px; padding: 18px 0; }
          .golive-row:hover { padding-left: 0; padding-right: 0; }
          .golive-resp { grid-column: 1 / -1; padding-left: 56px; }
        }
        .golive-num {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1rem;
          color: var(--dorado-deep);
          font-variant-numeric: tabular-nums;
        }
        .golive-task {
          font-family: 'Lora', Georgia, serif;
          font-size: clamp(0.95rem, 1.3vw, 1.05rem);
          line-height: 1.5;
          color: var(--marino);
        }
        .golive-resp {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 600;
          text-align: right;
          color: var(--dorado-deep);
        }
        .golive-resp.estudio { color: var(--marino-2); }
        .golive-resp.mix { color: var(--carbon-soft); }
        @media (max-width: 720px) { .golive-resp { text-align: left; } }

        /* ============== CIERRE / COLOFÓN ============== */
        .colofon {
          padding: clamp(80px, 12vw, 140px) 0;
          background: var(--bg-deep);
          color: var(--cream);
          text-align: center;
          position: relative;
        }
        .colofon-seal {
          width: 96px; height: 96px;
          border: 1.5px solid var(--dorado);
          border-radius: 50%;
          display: grid; place-items: center;
          margin: 0 auto clamp(32px, 5vw, 48px);
          position: relative;
        }
        .colofon-seal::before {
          content: "";
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(201,169,97,0.3);
          border-radius: 50%;
        }
        .colofon-seal span {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 36px;
          color: var(--dorado);
        }
        .colofon-eyebrow {
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--dorado);
          font-weight: 500;
          margin-bottom: 20px;
          display: inline-flex; align-items: center; gap: 14px;
        }
        .colofon-eyebrow::before,
        .colofon-eyebrow::after {
          content: "";
          width: 28px; height: 1px;
          background: var(--dorado);
        }
        .colofon h2 {
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 400;
          letter-spacing: -0.025em;
          line-height: 1.08;
          color: var(--cream);
          max-width: 22ch;
          margin: 0 auto 28px;
        }
        .colofon h2 em {
          font-style: italic;
          color: var(--dorado);
        }
        .colofon-rule {
          width: 48px; height: 1px;
          background: var(--dorado);
          margin: 0 auto 28px;
        }
        .colofon p {
          font-family: 'Lora', Georgia, serif;
          font-style: italic;
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          color: rgba(244,239,231,0.78);
          max-width: 58ch;
          margin: 0 auto clamp(40px, 5vw, 56px);
          line-height: 1.65;
        }
        .colofon-actions {
          display: inline-flex; gap: 16px; flex-wrap: wrap;
          justify-content: center;
        }
        .col-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 32px;
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-weight: 500;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition: transform .4s var(--ease), background .4s var(--ease), color .4s var(--ease), border-color .4s var(--ease);
          border: 1px solid transparent;
          border-radius: 2px;
        }
        .col-btn .arrow { transition: transform .4s var(--ease); }
        .col-btn:hover .arrow { transform: translateX(4px); }
        .col-btn.primary {
          background: var(--dorado);
          color: #0A1224;
        }
        .col-btn.primary:hover {
          background: var(--cream);
          transform: translateY(-2px);
        }
        .col-btn.secondary {
          background: transparent;
          color: var(--cream);
          border-color: rgba(244,239,231,0.32);
        }
        .col-btn.secondary:hover {
          background: rgba(244,239,231,0.08);
          border-color: var(--dorado);
          transform: translateY(-2px);
        }

        /* ============== FOOTER ============== */
        .pres-footer {
          padding: clamp(36px, 5vw, 56px) 0;
          border-top: 1px solid var(--ink-line);
          background: var(--bg);
        }
        .pres-footer-grid {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; flex-wrap: wrap;
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .pres-footer-grid strong {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 14px;
          letter-spacing: -0.01em;
          text-transform: none;
          color: var(--marino);
          font-weight: 500;
        }

        /* ============== REDUCED MOTION ============== */
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="pres-editorial">
        {/* ============== TOP BAR ============== */}
        <nav className="pres-topbar">
          <Link href="/" className="pres-brand" aria-label="Volver al sitio principal">
            <span className="pres-brand-mark">PD</span>
            <span className="pres-brand-text">
              <strong>Estudio Jurídico De Luca</strong>
              <small>Memorando ejecutivo · Documento confidencial</small>
            </span>
          </Link>
          <div className="pres-topbar-meta">
            <span className="hide-mobile">San Rafael · Mendoza</span>
            <span className="hide-mobile divider" />
            <span>2026</span>
            <span className="divider" />
            <span>v · 1.0</span>
          </div>
        </nav>

        {/* ============== CUBIERTA ============== */}
        <section className="cubierta">
          <div className="pres-wrap">
            <div className="cubierta-frame">
              <div className="cubierta-eyebrow" data-reveal>
                Memorando ejecutivo · Presentación de la solución
              </div>

              <h1 className="cubierta-title" data-reveal data-delay="1">
                Una <em>plataforma digital</em> al servicio del <em>Estudio Jurídico</em> Dr. Pablo
                De Luca.
              </h1>

              <div className="cubierta-rule" data-reveal data-delay="2" />

              <p className="cubierta-lead" data-reveal data-delay="3">
                Lo que sigue no es la presentación de un sitio web. Es la documentación del sistema
                completo que ya se encuentra desplegado en producción — concebido para captar,
                calificar, operar y consolidar autoridad bajo estricto cumplimiento de la
                legislación argentina.
              </p>

              <div className="cubierta-folio" data-reveal data-delay="4">
                <div>
                  <div className="folio-label">Capítulos</div>
                  <div className="folio-value">
                    <em>VIII</em>
                  </div>
                </div>
                <div>
                  <div className="folio-label">Funcionalidades</div>
                  <div className="folio-value">21</div>
                </div>
                <div>
                  <div className="folio-label">Estado</div>
                  <div className="folio-value">
                    <em>En producción</em>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== ÍNDICE ============== */}
        <section className="indice-section">
          <div className="pres-wrap-narrow">
            <div className="indice-head" data-reveal>
              <div className="indice-eyebrow">Índice General</div>
              <h2 className="indice-title">
                Ocho <em>capítulos</em> en orden de lectura.
              </h2>
            </div>
            <ul className="indice-list">
              {CHAPTERS.map((c, i) => (
                <li key={c.id} data-reveal data-delay={(i % 7) + 1}>
                  <a href={`#${c.id}`} className="indice-row">
                    <span className="indice-roman">{c.roman}</span>
                    <span className="indice-label">{c.label}</span>
                    <span className="indice-page">Pág. {String(i + 1).padStart(2, "0")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============== I · DIAGNÓSTICO ============== */}
        <section className="chapter" id="diagnostico">
          <div className="pres-wrap">
            <div className="chapter-head">
              <div className="chapter-roman" data-reveal>
                I
              </div>
              <div className="chapter-label" data-reveal data-delay="1">
                Capítulo Primero · Diagnóstico
              </div>
              <h2 className="chapter-title" data-reveal data-delay="2">
                Cuatro problemas que <em>la mayoría</em> de los estudios ignora.
              </h2>
              <div className="chapter-rule" data-reveal data-delay="3" />
              <p className="chapter-lead" data-reveal data-delay="4">
                La diferencia entre un sitio web y una plataforma profesional está en resolver
                problemas reales del negocio. Antes de construir nada, identificamos los cuatro
                cuellos de botella que comparte casi toda la práctica jurídica local.
              </p>
            </div>
            <div className="diag-stack">
              {DIAGNOSTICO.map((d, i) => (
                <div key={d.tag} className="diag-row" data-reveal data-delay={(i % 4) + 1}>
                  <div className="diag-marker">
                    <span className="diag-marker-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="diag-marker-tag">{d.tag}</span>
                  </div>
                  <div className="diag-body">
                    <h3>{d.head}</h3>
                    <p>{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== II · SOLUCIÓN ============== */}
        <section className="chapter deep" id="solucion">
          <div className="pres-wrap">
            <div className="chapter-head">
              <div className="chapter-roman" data-reveal>
                II
              </div>
              <div className="chapter-label" data-reveal data-delay="1">
                Capítulo Segundo · Solución
              </div>
              <h2 className="chapter-title" data-reveal data-delay="2">
                Una <em>plataforma operativa</em>, no un folleto digital.
              </h2>
              <div className="chapter-rule" data-reveal data-delay="3" />
              <p className="chapter-lead" data-reveal data-delay="4">
                El sitio trabaja por el Estudio las veinticuatro horas. Atrae con SEO útil, califica
                al visitante, automatiza la reserva, sincroniza con el calendario y guarda todo bajo
                cumplimiento legal argentino. Tres pilares organizan el sistema.
              </p>
            </div>
            <div className="pilares-grid">
              {SOLUCION_PILARES.map((p, i) => (
                <div key={p.label} className="pilar" data-reveal data-delay={(i % 4) + 1}>
                  <span className="pilar-label">{p.label}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== III · INVENTARIO ============== */}
        <section className="chapter tinted" id="inventario">
          <div className="pres-wrap">
            <div className="chapter-head">
              <div className="chapter-roman" data-reveal>
                III
              </div>
              <div className="chapter-label" data-reveal data-delay="1">
                Capítulo Tercero · Inventario
              </div>
              <h2 className="chapter-title" data-reveal data-delay="2">
                Todo lo que <em>ya está</em> en producción.
              </h2>
              <div className="chapter-rule" data-reveal data-delay="3" />
              <p className="chapter-lead" data-reveal data-delay="4">
                Veintiún funcionalidades agrupadas en cinco frentes estratégicos. Cada una
                desarrollada, testeada y certificada para deploy.
              </p>
            </div>

            {INVENTARIO.map((g, i) => (
              <div key={g.grupo} className="inv-block" data-reveal data-delay={(i % 5) + 1}>
                <div className="inv-block-head">
                  <span className="inv-block-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="inv-block-name">{g.grupo}</span>
                  <span className="inv-block-count">
                    {g.items.length} {g.items.length === 1 ? "función" : "funciones"}
                  </span>
                </div>
                <div className="inv-list">
                  {g.items.map((item) => (
                    <div key={item.name} className="inv-item">
                      <span className="inv-item-name">{item.name}</span>
                      <span className="inv-item-desc">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============== IV · BENEFICIOS ============== */}
        <section className="chapter" id="beneficios">
          <div className="pres-wrap">
            <div className="chapter-head">
              <div className="chapter-roman" data-reveal>
                IV
              </div>
              <div className="chapter-label" data-reveal data-delay="1">
                Capítulo Cuarto · Beneficios
              </div>
              <h2 className="chapter-title" data-reveal data-delay="2">
                Por qué esto <em>cambia</em> la dinámica del estudio.
              </h2>
              <div className="chapter-rule" data-reveal data-delay="3" />
              <p className="chapter-lead" data-reveal data-delay="4">
                Cada decisión técnica responde a un problema de negocio concreto. No hay funciones
                decorativas — todo lo construido tiene una razón medible y articulable.
              </p>
            </div>
            <div className="benef-grid">
              {BENEFICIOS.map((b, i) => (
                <div key={b.titulo} className="benef-item" data-reveal data-delay={(i % 6) + 1}>
                  <h3>{b.titulo}</h3>
                  <p>{b.detalle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== V · TECNOLOGÍA ============== */}
        <section className="chapter tinted" id="tecnologia">
          <div className="pres-wrap">
            <div className="chapter-head">
              <div className="chapter-roman" data-reveal>
                V
              </div>
              <div className="chapter-label" data-reveal data-delay="1">
                Capítulo Quinto · Tecnología
              </div>
              <h2 className="chapter-title" data-reveal data-delay="2">
                Stack <em>contemporáneo</em>, no soluciones de hace una década.
              </h2>
              <div className="chapter-rule" data-reveal data-delay="3" />
              <p className="chapter-lead" data-reveal data-delay="4">
                Construido sobre las mismas tecnologías que emplean Vercel, Linear, Notion y los
                productos digitales premium. Mantenible, escalable y veloz por diseño.
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

        {/* ============== VI · MÉTRICAS ============== */}
        <section className="chapter deep" id="metricas">
          <div className="pres-wrap">
            <div className="chapter-head">
              <div className="chapter-roman" data-reveal>
                VI
              </div>
              <div className="chapter-label" data-reveal data-delay="1">
                Capítulo Sexto · Métricas
              </div>
              <h2 className="chapter-title" data-reveal data-delay="2">
                Lo que se <em>midió</em> durante la construcción.
              </h2>
              <div className="chapter-rule" data-reveal data-delay="3" />
              <p className="chapter-lead" data-reveal data-delay="4">
                Build verificable, tests automatizados, performance Core Web Vitals. Todo medible y
                reproducible. Cero estimaciones.
              </p>
            </div>
            <div className="metricas-grid" data-reveal>
              {METRICAS.map((m) => (
                <div key={m.label} className="metrica">
                  <span className="metrica-value">{m.value}</span>
                  <span className="metrica-label">{m.label}</span>
                  <span className="metrica-note">{m.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== VII · ROADMAP ============== */}
        <section className="chapter" id="roadmap">
          <div className="pres-wrap">
            <div className="chapter-head">
              <div className="chapter-roman" data-reveal>
                VII
              </div>
              <div className="chapter-label" data-reveal data-delay="1">
                Capítulo Séptimo · Roadmap
              </div>
              <h2 className="chapter-title" data-reveal data-delay="2">
                Lo que <em>viene después</em>.
              </h2>
              <div className="chapter-rule" data-reveal data-delay="3" />
              <p className="chapter-lead" data-reveal data-delay="4">
                La plataforma está diseñada para crecer en módulos. Una vez validado el MVP, se
                incorporan funciones premium que profundizan la diferenciación del estudio.
              </p>
            </div>
            {ROADMAP.map((fase, fi) => (
              <div key={fase.fase} className="roadmap-fase" data-reveal data-delay={fi + 1}>
                <div className="roadmap-fase-head">
                  <span className="roadmap-fase-name">{fase.fase}</span>
                  <span className="roadmap-fase-horizonte">{fase.horizonte}</span>
                </div>
                <div className="roadmap-items">
                  {fase.items.map((it) => (
                    <div key={it.titulo} className="roadmap-item">
                      <h3>{it.titulo}</h3>
                      <p>{it.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============== VIII · GO LIVE ============== */}
        <section className="chapter tinted" id="go-live">
          <div className="pres-wrap">
            <div className="chapter-head">
              <div className="chapter-roman" data-reveal>
                VIII
              </div>
              <div className="chapter-label" data-reveal data-delay="1">
                Capítulo Octavo · Puesta en marcha
              </div>
              <h2 className="chapter-title" data-reveal data-delay="2">
                Pasos para <em>encender</em> el sistema.
              </h2>
              <div className="chapter-rule" data-reveal data-delay="3" />
              <p className="chapter-lead" data-reveal data-delay="4">
                El sitio se encuentra desplegado y funcionando. Para activar al cien por ciento la
                reserva de turnos, los emails automáticos y el blog dinámico, restan los siguientes
                puntos.
              </p>
            </div>
            <div className="golive-table" data-reveal>
              {GO_LIVE.map((g, i) => (
                <div key={g.tarea} className="golive-row">
                  <span className="golive-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="golive-task">{g.tarea}</span>
                  <span
                    className={`golive-resp ${
                      g.responsable === "Estudio"
                        ? "estudio"
                        : g.responsable.includes("y")
                          ? "mix"
                          : ""
                    }`}
                  >
                    {g.responsable}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== COLOFÓN ============== */}
        <section className="colofon">
          <div className="pres-wrap-narrow">
            <div className="colofon-seal" data-reveal>
              <span>PD</span>
            </div>
            <div className="colofon-eyebrow" data-reveal data-delay="1">
              Colofón
            </div>
            <h2 data-reveal data-delay="2">
              El sitio está en producción. Resta <em>encenderlo</em>.
            </h2>
            <div className="colofon-rule" data-reveal data-delay="3" />
            <p data-reveal data-delay="4">
              El código se encuentra desplegado en Vercel. Restan únicamente los datos definitivos
              del Estudio y la configuración de las cuentas externas. Coordinamos esta etapa en una
              llamada de treinta minutos y dejamos el sistema vivo.
            </p>
            <div className="colofon-actions" data-reveal data-delay="5">
              <a
                href="https://web-deluca-abogado.vercel.app/"
                className="col-btn primary"
                target="_blank"
                rel="noreferrer"
              >
                Ver el sitio en producción <span className="arrow">→</span>
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  "Hola, vi la presentación. Coordinemos para avanzar."
                )}`}
                className="col-btn secondary"
                target="_blank"
                rel="noreferrer"
              >
                Coordinar por WhatsApp <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ============== FOOTER ============== */}
        <footer className="pres-footer">
          <div className="pres-wrap pres-footer-grid">
            <span>
              <strong>Estudio Jurídico Dr. Pablo De Luca</strong> · Presentación interna · 2026
            </span>
            <span>web-deluca-abogado.vercel.app</span>
          </div>
        </footer>
      </div>
    </>
  );
}
