import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const SECTIONS = [
  { id: "diagnostico", label: "01 · Diagnóstico", color: "process" },
  { id: "solucion", label: "02 · Solución", color: "process" },
  { id: "inventario", label: "03 · Inventario", color: "process" },
  { id: "beneficios", label: "04 · Beneficios", color: "transform" },
  { id: "tecnologia", label: "05 · Tecnología", color: "transform" },
  { id: "metricas", label: "06 · Métricas", color: "result" },
  { id: "roadmap", label: "07 · Roadmap", color: "result" },
  { id: "go-live", label: "08 · Go live", color: "result" },
] as const;

const INVENTARIO = [
  {
    grupo: "Captura",
    items: [
      {
        name: "Landing portfolio editorial",
        desc: "Hero + 3 pasos + áreas + casos + about + contacto.",
      },
      {
        name: "Triaje WhatsApp pre-clasificado",
        desc: "Mini wizard 3 clicks → mensaje pre-armado al Dr.",
      },
      {
        name: "Reserva de turnos online",
        desc: "Calendario + slots + form. Sync con Google Calendar del Dr.",
      },
      {
        name: "Centro de descargas con lead capture",
        desc: "4 PDFs con form (nombre + email) → lista de leads en DB.",
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
        desc: "Términos legales SSG con URL individual cada uno. Schema.org DefinedTerm.",
      },
      {
        name: "Línea de tiempo proceso de divorcio",
        desc: "Infografía paso a paso scroll-driven con HowTo schema.",
      },
      {
        name: "Blog editorial + admin",
        desc: "Artículos con Markdown + FAQPage + Article schema.",
      },
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
        desc: "Link directo al perfil oficial en el Colegio de Mendoza.",
      },
      { name: "Trayectoria profesional", desc: "Sección About + credenciales + foto." },
    ],
  },
  {
    grupo: "Operación",
    items: [
      {
        name: "Panel admin protegido",
        desc: "Basic Auth + guard server-side. Turnos, leads, blog, glosario.",
      },
      {
        name: "Sistema de emails transaccionales",
        desc: "Confirmación a cliente + notificación al Dr. con retry.",
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
        desc: "11 secciones cumpliendo Habeas Data + derechos ARCO.",
      },
      {
        name: "Términos de uso",
        desc: "Disclaimer calculadoras + propiedad intelectual + jurisdicción Mendoza.",
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
      "Las 3 calculadoras + glosario + verificador + blog generan SEO masivo. Cada herramienta rankea por separado en Google. La gente busca “calcular indemnización por despido Argentina” o “qué hacer si te despidieron sin causa” todos los meses.",
    color: "transform",
  },
  {
    titulo: "Conversión más alta que un formulario clásico",
    detalle:
      "El triaje WhatsApp pre-clasifica al cliente en 3 clicks. Cuando llega al WhatsApp del Dr., ya viene con área legal + urgencia + tipo de consulta. Cero fricción de discovery.",
    color: "transform",
  },
  {
    titulo: "Menos tiempo perdido en mensajes operativos",
    detalle:
      "La reserva online sincroniza con el Google Calendar del Dr. El cliente recibe email automático con dirección, fecha, hora, cómo llegar. No hay ping-pong de WhatsApp para coordinar.",
    color: "transform",
  },
  {
    titulo: "Diferenciación clara vs otros abogados de la zona",
    detalle:
      "En San Rafael casi nadie del rubro tiene calculadoras, verificadores, descargas gratuitas ni glosario. El sitio se siente premium y entrega valor antes de cobrar — eso es lo que el cliente lee como “esto sí es serio”.",
    color: "transform",
  },
  {
    titulo: "Posicionamiento como autoridad",
    detalle:
      "Casos resueltos narrativos + recursos descargables + blog editorial muestran competencia real, no solo años en una bio. La gente compra abogados que demuestran que saben, no que dicen que saben.",
    color: "transform",
  },
  {
    titulo: "Cumplimiento legal desde el día uno",
    detalle:
      "Ley 25.326 Habeas Data cubierta en política de privacidad, consentimiento expreso en formularios, retention policy y separación de datos sensibles en logs.",
    color: "transform",
  },
];

const STACK = [
  { layer: "Frontend", tech: "Next.js 16 · React Server Components · Turbopack · Tailwind 4" },
  {
    layer: "Diseño",
    tech: "Sistema custom — Playfair Display + Lora + Inter · paleta marino + dorado · WCAG AA",
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
    tech: "Basic Auth proxy · timing-safe XOR SHA-256 · CSP estricta · HSTS · rate limiting Upstash",
  },
  {
    layer: "SEO",
    tech: "Sitemap dinámico · robots.txt · Schema.org (LegalService + Article + HowTo + DefinedTerm + SoftwareApplication)",
  },
  {
    layer: "QA",
    tech: "140 tests Vitest · 11 archivos de spec · build prod limpio · 0 errores lint",
  },
  { layer: "Hosting", tech: "Vercel Edge · CI/CD automático en push a main · HTTPS + CDN global" },
];

const METRICAS = [
  { label: "Rutas", value: "31", note: "estáticas + SSG + dinámicas" },
  { label: "Tareas dev", value: "47", note: "en 11 batches" },
  { label: "Tests pasando", value: "140", note: "automatizados" },
  { label: "Build prod", value: "~60s", note: "Turbopack" },
  { label: "Schemas SEO", value: "5", note: "tipos distintos" },
  { label: "Calculadoras", value: "3", note: "legales gratis" },
  { label: "Idiomas", value: "es-AR", note: "argentino nativo" },
  { label: "Lighthouse target", value: "≥90", note: "perf + SEO + a11y" },
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
    desc: "Wizard para armar tu propia carta documento o poder simple. PDF descargable.",
  },
];

const GO_LIVE = [
  { tarea: "Confirmar número de matrícula real", responsable: "Dr." },
  { tarea: "Confirmar URL del perfil en el Colegio de Mendoza", responsable: "Dr." },
  { tarea: "Enviar dirección exacta del estudio + Google Maps embed", responsable: "Dr." },
  { tarea: "Confirmar email para notificaciones (RESEND_TO_EMAIL)", responsable: "Dr." },
  { tarea: "Aprobar fórmulas de las 3 calculadoras", responsable: "Dr. (revisión legal)" },
  { tarea: "Validar 3 casos narrativos (Laboral / Familia / Civil)", responsable: "Dr." },
  { tarea: "Aprobar 8 hitos del proceso de divorcio", responsable: "Dr." },
  { tarea: "Enviar fotos profesionales del Dr. y del estudio", responsable: "Dr." },
  {
    tarea: "Configurar Supabase + Resend + Google Service Account + Upstash en Vercel",
    responsable: "Dev",
  },
  { tarea: "Verificar dominio Resend (DKIM + SPF + DMARC)", responsable: "Dev + Dr." },
  { tarea: "Reemplazar 4 PDFs placeholders por documentos reales", responsable: "Dr." },
  { tarea: "Aprobar 2-3 artículos del blog seed", responsable: "Dr." },
  {
    tarea: "Dominio custom opcional (ej. deluca-abogado.com.ar)",
    responsable: "Dr. (compra) + Dev (DNS)",
  },
];

export default function Page() {
  return (
    <>
      <style>{`
        /* ============ HIDE SITE CHROME ON /presentacion ============ */
        body:has(.deluca-presentacion) header,
        body:has(.deluca-presentacion) footer[role="contentinfo"],
        body:has(.deluca-presentacion) a[aria-label*="WhatsApp"],
        body:has(.deluca-presentacion) a[aria-label*="Contactar"],
        body:has(.deluca-presentacion) .skip-link {
          display: none !important;
        }
        body:has(.deluca-presentacion) main#main-content,
        body:has(.deluca-presentacion) main {
          padding: 0 !important;
          margin: 0 !important;
          min-height: 0 !important;
        }
        body:has(.deluca-presentacion) {
          background: #F7F7FC !important;
        }

        :root {
          --c-bg: #F7F7FC;
          --c-text: #09090E;
          --c-process: #3B4EFC;
          --c-transform: #7B2DFF;
          --c-result: #AAFF00;
          --c-surface: #EEEEF6;
          --c-dark: #0D0D14;
          --c-muted: rgba(9,9,14,0.55);
          --c-muted-2: rgba(9,9,14,0.35);
          --c-border: rgba(9,9,14,0.08);
          --c-instr-bg: rgba(9,9,14,0.03);
          --ease: cubic-bezier(0.16,1,0.3,1);
          --font: var(--font-pres-grotesk), system-ui, sans-serif;
          --font-sec: var(--font-pres-manrope), system-ui, sans-serif;
          --gutter: clamp(20px, 5vw, 56px);
          --wrap: 1240px;
          --pill: 100px;
        }
        .deluca-presentacion {
          min-height: 100vh;
          background: var(--c-bg);
          color: var(--c-text);
          font-family: var(--font-pres-grotesk, ui-sans-serif), system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          line-height: 1.4;
          overflow-x: hidden;
        }
        .deluca-presentacion *,
        .deluca-presentacion *::before,
        .deluca-presentacion *::after {
          box-sizing: border-box;
        }
        .wrap { max-width: var(--wrap); margin: 0 auto; padding: 0 var(--gutter); }
        .deluca-presentacion h1,
        .deluca-presentacion h2,
        .deluca-presentacion h3,
        .deluca-presentacion h4,
        .deluca-presentacion h5,
        .deluca-presentacion h6 {
          font-family: var(--font-pres-grotesk, ui-sans-serif), system-ui, sans-serif;
          font-weight: 400;
          font-size: inherit;
          line-height: inherit;
          letter-spacing: 0;
          color: inherit;
          margin: 0;
        }
        .deluca-presentacion p,
        .deluca-presentacion span,
        .deluca-presentacion a,
        .deluca-presentacion li,
        .deluca-presentacion button,
        .deluca-presentacion small,
        .deluca-presentacion strong,
        .deluca-presentacion em {
          font-family: inherit;
        }
        .deluca-presentacion p { margin: 0; font-weight: inherit; }
        .deluca-presentacion a { text-decoration: none; color: inherit; }

        /* ============ NAV TOP ============ */
        .top-nav {
          position: sticky; top: 0; z-index: 50;
          padding: 18px var(--gutter);
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(247,247,252,0.86);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--c-border);
        }
        .brand {
          display: flex; align-items: center; gap: 12px;
          font-weight: 600; font-size: 18px; letter-spacing: -0.01em;
        }
        .brand-mark {
          width: 36px; height: 36px;
          background: var(--c-text); color: var(--c-bg);
          display: grid; place-items: center;
          border-radius: 8px;
          font-weight: 700; font-size: 14px;
          letter-spacing: 0;
        }
        .brand small {
          display: block;
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 11px;
          color: var(--c-muted);
          font-weight: 400;
          letter-spacing: 0.02em;
        }
        .nav-meta {
          display: flex; align-items: center; gap: 24px;
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 13px;
          color: var(--c-muted);
        }
        .nav-meta strong { color: var(--c-text); font-weight: 500; }
        .nav-meta .dot {
          display: inline-block; width: 7px; height: 7px; border-radius: 50%;
          background: var(--c-result); margin-right: 8px;
          box-shadow: 0 0 0 4px rgba(170,255,0,0.18);
        }
        @media (max-width: 720px) {
          .nav-meta .hide-mobile { display: none; }
        }

        /* ============ PROGRESS DOTS ============ */
        .progress-nav {
          position: fixed; right: 20px; top: 50%;
          transform: translateY(-50%); z-index: 40;
          display: flex; flex-direction: column; gap: 10px;
        }
        @media (max-width: 1024px) { .progress-nav { display: none; } }
        .prog-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--c-text); opacity: .18;
          cursor: pointer; transition: opacity .3s, transform .4s var(--ease), background .3s;
        }
        .prog-dot:hover { opacity: .5; }

        /* ============ HERO ============ */
        .hero { padding: clamp(72px, 14vw, 160px) 0 clamp(60px, 10vw, 120px); position: relative; }
        .hero-kicker {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--c-muted);
          margin-bottom: clamp(24px, 4vw, 40px);
          display: flex; align-items: center; gap: 14px;
          flex-wrap: wrap;
        }
        .hero-kicker::before {
          content: ""; display: inline-block;
          width: 40px; height: 1px; background: var(--c-text); opacity: .25;
        }
        .hero-kicker .pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px;
          background: var(--c-result);
          color: var(--c-dark);
          border-radius: var(--pill);
          font-weight: 600;
          letter-spacing: 0.08em;
        }
        .hero h1 {
          font-size: clamp(2.6rem, 9vw, 7.5rem);
          line-height: 0.94;
          font-weight: 400;
          letter-spacing: -0.045em;
          margin-bottom: clamp(28px, 5vw, 48px);
          max-width: 18ch;
        }
        .hero h1 em {
          font-style: normal;
          color: var(--c-process);
        }
        .hero h1 .accent-2 { color: var(--c-transform); }
        .hero h1 .accent-3 { color: var(--c-result); -webkit-text-stroke: 1px var(--c-dark); }
        .hero-sub {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: clamp(1rem, 2vw, 1.3rem);
          line-height: 1.5;
          max-width: 56ch;
          color: var(--c-muted);
          margin-bottom: clamp(40px, 6vw, 64px);
        }
        .hero-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(12px, 2vw, 20px);
          margin-top: clamp(40px, 6vw, 80px);
        }
        @media (max-width: 880px) { .hero-cards { grid-template-columns: 1fr; } }
        .hero-card {
          padding: clamp(20px, 3vw, 32px);
          border: 1px solid var(--c-border);
          background: var(--c-bg);
          display: flex; flex-direction: column; gap: 14px;
          transition: transform .35s var(--ease), border-color .35s var(--ease);
        }
        .hero-card:hover { transform: translateY(-3px); border-color: var(--c-text); }
        .hero-card-tag {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--c-muted);
        }
        .hero-card-num {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 400;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .hero-card-num.process { color: var(--c-process); }
        .hero-card-num.transform { color: var(--c-transform); }
        .hero-card-num.result { color: var(--c-result); -webkit-text-stroke: 1px var(--c-dark); }
        .hero-card-label {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 14px;
          color: var(--c-muted);
        }

        /* ============ SECTION BASE ============ */
        section.deluca-section { padding: clamp(80px, 12vw, 160px) 0; position: relative; }
        section.deluca-section.dark {
          background: var(--c-dark);
          color: var(--c-bg);
        }
        section.deluca-section.dark .label-muted,
        section.deluca-section.dark .item-desc {
          color: rgba(247,247,252,0.55);
        }
        section.deluca-section.dark .grupo-titulo,
        section.deluca-section.dark .item-name {
          color: var(--c-bg);
        }
        .section-head {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: clamp(24px, 4vw, 64px);
          align-items: end;
          margin-bottom: clamp(48px, 8vw, 100px);
        }
        @media (max-width: 880px) {
          .section-head { grid-template-columns: 1fr; align-items: start; }
        }
        .section-num {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 13px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--c-muted);
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
        }
        .section-num .col-dot {
          width: 12px; height: 12px; border-radius: 50%;
        }
        .col-process { background: var(--c-process); }
        .col-transform { background: var(--c-transform); }
        .col-result { background: var(--c-result); }
        section.deluca-section h2 {
          font-size: clamp(2rem, 5vw, 4rem);
          line-height: 0.98;
          font-weight: 400;
          letter-spacing: -0.035em;
          max-width: 14ch;
        }
        section.deluca-section h2 em { font-style: normal; }
        section.deluca-section h2 em.process { color: var(--c-process); }
        section.deluca-section h2 em.transform { color: var(--c-transform); }
        section.deluca-section h2 em.result { color: var(--c-result); -webkit-text-stroke: 1px var(--c-dark); }
        .section-bajada {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          line-height: 1.55;
          color: var(--c-muted);
          max-width: 56ch;
        }

        /* ============ DIAGNÓSTICO ============ */
        .diag-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(20px, 3vw, 36px);
        }
        @media (max-width: 720px) { .diag-grid { grid-template-columns: 1fr; } }
        .diag-card {
          padding: clamp(24px, 3vw, 40px);
          background: var(--c-surface);
          border-radius: 4px;
          display: flex; flex-direction: column; gap: 16px;
          position: relative;
        }
        .diag-card-tag {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--c-process);
          font-weight: 600;
        }
        .diag-card h3 {
          font-size: clamp(1.3rem, 2.4vw, 1.85rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .diag-card p {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          color: var(--c-muted);
          font-size: 0.98rem;
          line-height: 1.55;
        }

        /* ============ SOLUCIÓN MANIFIESTO ============ */
        .manifiesto {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: clamp(1.2rem, 2.8vw, 2.2rem);
          font-weight: 400;
          line-height: 1.35;
          max-width: 32ch;
          color: rgba(247,247,252,0.9);
        }
        .manifiesto strong {
          color: var(--c-result);
          font-weight: 600;
          -webkit-text-stroke: 0;
        }
        .manifiesto-keys {
          margin-top: clamp(48px, 6vw, 80px);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2vw, 28px);
        }
        @media (max-width: 720px) { .manifiesto-keys { grid-template-columns: 1fr; } }
        .manif-key {
          display: flex; flex-direction: column; gap: 12px;
          padding: clamp(20px, 2.5vw, 28px);
          border: 1px solid rgba(247,247,252,0.12);
        }
        .manif-num {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 400;
          letter-spacing: -0.04em;
        }
        .manif-num.process { color: var(--c-process); }
        .manif-num.transform { color: var(--c-transform); }
        .manif-num.result { color: var(--c-result); }
        .manif-key-label {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 0.9rem;
          color: rgba(247,247,252,0.65);
          line-height: 1.4;
        }

        /* ============ INVENTARIO ============ */
        .grupo { margin-bottom: clamp(48px, 6vw, 80px); }
        .grupo:last-child { margin-bottom: 0; }
        .grupo-head {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--c-border);
        }
        .grupo-num {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          color: var(--c-muted);
          font-variant-numeric: tabular-nums;
        }
        .grupo-titulo {
          font-size: clamp(1.3rem, 2.4vw, 1.7rem);
          font-weight: 500;
          letter-spacing: -0.02em;
        }
        .grupo-items {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(16px, 2vw, 28px);
        }
        @media (max-width: 720px) { .grupo-items { grid-template-columns: 1fr; } }
        .item {
          display: flex; flex-direction: column; gap: 8px;
          padding: 20px 0;
          border-bottom: 1px solid var(--c-border);
        }
        .item-name {
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          font-weight: 500;
          letter-spacing: -0.01em;
          display: flex; align-items: center; gap: 12px;
        }
        .item-name::before {
          content: "";
          width: 8px; height: 8px;
          background: var(--c-process);
          border-radius: 1px;
          flex-shrink: 0;
        }
        .item-desc {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 0.92rem;
          color: var(--c-muted);
          line-height: 1.55;
          padding-left: 20px;
        }

        /* ============ BENEFICIOS ============ */
        .benef-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(20px, 2.5vw, 32px);
        }
        @media (max-width: 720px) { .benef-grid { grid-template-columns: 1fr; } }
        .benef {
          padding: clamp(28px, 4vw, 44px);
          border: 1px solid var(--c-border);
          background: var(--c-bg);
          display: flex; flex-direction: column; gap: 16px;
          position: relative;
          transition: transform .4s var(--ease), border-color .4s var(--ease);
        }
        .benef:hover { transform: translateY(-4px); border-color: var(--c-transform); }
        .benef-icon {
          width: 40px; height: 40px;
          background: var(--c-transform);
          color: white;
          display: grid; place-items: center;
          font-family: var(--font-pres-grotesk, ui-sans-serif), system-ui, sans-serif;
          font-weight: 600;
          font-size: 16px;
          border-radius: 50%;
          letter-spacing: -0.02em;
        }
        .benef-icon.alt-1 { background: var(--c-process); }
        .benef-icon.alt-2 { background: var(--c-result); color: var(--c-dark); }
        .benef h3 {
          font-size: clamp(1.15rem, 2vw, 1.45rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }
        .benef p {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 0.95rem;
          color: var(--c-muted);
          line-height: 1.55;
        }

        /* ============ STACK TABLE ============ */
        .stack-table {
          display: flex; flex-direction: column;
        }
        .stack-row {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 32px;
          padding: 22px 0;
          border-top: 1px solid var(--c-border);
          align-items: center;
        }
        .stack-row:last-child { border-bottom: 1px solid var(--c-border); }
        @media (max-width: 720px) {
          .stack-row { grid-template-columns: 1fr; gap: 6px; padding: 18px 0; }
        }
        .stack-layer {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--c-muted);
          display: flex; align-items: center; gap: 10px;
        }
        .stack-layer::before {
          content: ""; width: 8px; height: 8px;
          background: var(--c-process); border-radius: 50%;
        }
        .stack-tech {
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          font-weight: 400;
          letter-spacing: -0.01em;
          line-height: 1.4;
        }

        /* ============ METRICAS ============ */
        .metricas-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(12px, 2vw, 20px);
        }
        @media (max-width: 880px) { .metricas-grid { grid-template-columns: repeat(2, 1fr); } }
        .metrica {
          padding: clamp(24px, 3vw, 36px) clamp(20px, 2.5vw, 28px);
          border: 1px solid var(--c-border);
          background: var(--c-bg);
          display: flex; flex-direction: column; gap: 8px;
        }
        .metrica-label {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--c-muted);
        }
        .metrica-value {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 400;
          letter-spacing: -0.045em;
          line-height: 0.95;
          color: var(--c-result);
          -webkit-text-stroke: 1px var(--c-dark);
          font-variant-numeric: tabular-nums;
        }
        .metrica-note {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 12px;
          color: var(--c-muted);
        }

        /* ============ ROADMAP ============ */
        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(20px, 2.5vw, 32px);
        }
        @media (max-width: 720px) { .roadmap-grid { grid-template-columns: 1fr; } }
        .roadmap-card {
          padding: clamp(24px, 3vw, 36px);
          background: rgba(170,255,0,0.06);
          border: 1px solid var(--c-result);
          display: flex; flex-direction: column; gap: 12px;
          position: relative;
        }
        .roadmap-etapa {
          display: inline-flex; align-self: flex-start;
          padding: 4px 12px;
          background: var(--c-result);
          color: var(--c-dark);
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          border-radius: var(--pill);
        }
        .roadmap-card h3 {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }
        .roadmap-card p {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 0.95rem;
          color: var(--c-muted);
          line-height: 1.55;
        }

        /* ============ GO LIVE TABLE ============ */
        .golive-table {
          display: flex; flex-direction: column;
          border-top: 1px solid var(--c-border);
        }
        .golive-row {
          display: grid;
          grid-template-columns: 50px 1fr 180px;
          gap: 20px;
          padding: 18px 0;
          border-bottom: 1px solid var(--c-border);
          align-items: center;
        }
        @media (max-width: 720px) {
          .golive-row { grid-template-columns: 40px 1fr; padding: 14px 0; }
          .golive-resp { grid-column: 1 / -1; padding-left: 60px; font-size: 12px; }
        }
        .golive-num {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 13px;
          color: var(--c-muted);
          font-variant-numeric: tabular-nums;
        }
        .golive-task {
          font-size: clamp(0.95rem, 1.3vw, 1.05rem);
          font-weight: 400;
        }
        .golive-resp {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-process);
          font-weight: 600;
          text-align: right;
        }
        .golive-resp.dev { color: var(--c-transform); }
        .golive-resp.mix { color: var(--c-result); -webkit-text-stroke: 0.5px var(--c-dark); }

        /* ============ CTA FINAL ============ */
        .cta-final {
          padding: clamp(80px, 12vw, 160px) 0;
          background: var(--c-dark);
          color: var(--c-bg);
          text-align: center;
        }
        .cta-final h2 {
          font-size: clamp(2.2rem, 6vw, 5rem);
          line-height: 1;
          font-weight: 400;
          letter-spacing: -0.04em;
          margin-bottom: clamp(24px, 4vw, 40px);
          color: var(--c-bg);
          max-width: 22ch;
          margin-left: auto;
          margin-right: auto;
        }
        .cta-final h2 em {
          font-style: normal;
          color: var(--c-result);
          -webkit-text-stroke: 1px var(--c-bg);
        }
        .cta-final p {
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          color: rgba(247,247,252,0.65);
          max-width: 56ch;
          margin: 0 auto clamp(40px, 5vw, 60px);
          line-height: 1.55;
        }
        .cta-buttons {
          display: inline-flex; gap: 14px; flex-wrap: wrap;
          justify-content: center;
        }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 32px;
          font-family: var(--font-pres-grotesk, ui-sans-serif), system-ui, sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-radius: var(--pill);
          transition: transform .3s var(--ease), background .3s var(--ease);
        }
        .cta-btn.primary {
          background: var(--c-result);
          color: var(--c-dark);
        }
        .cta-btn.primary:hover { transform: translateY(-2px); background: #B8FF1A; }
        .cta-btn.secondary {
          background: transparent;
          color: var(--c-bg);
          border: 1px solid rgba(247,247,252,0.3);
        }
        .cta-btn.secondary:hover { background: rgba(247,247,252,0.08); transform: translateY(-2px); }

        /* ============ FOOTER ============ */
        .footer-pres {
          padding: clamp(32px, 5vw, 56px) 0;
          border-top: 1px solid var(--c-border);
          font-family: var(--font-pres-manrope, ui-sans-serif), system-ui, sans-serif;
          font-size: 13px;
          color: var(--c-muted);
        }
        .footer-grid {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; flex-wrap: wrap;
        }
        .footer-grid strong { color: var(--c-text); font-weight: 500; }
      `}</style>

      <div className="deluca-presentacion">
        {/* ============== NAV TOP ============== */}
        <nav className="top-nav">
          <Link href="/" className="brand">
            <span className="brand-mark">PDL</span>
            <span>
              Estudio De Luca
              <small>Presentación · v1.0</small>
            </span>
          </Link>
          <div className="nav-meta">
            <span className="hide-mobile">
              <span className="dot" />
              Sitio desplegado
            </span>
            <span>
              <strong>{siteConfig.whatsappDisplay}</strong>
            </span>
          </div>
        </nav>

        {/* ============== PROGRESS DOTS ============== */}
        <div className="progress-nav" aria-hidden="true">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="prog-dot"
              style={{
                background:
                  s.color === "process"
                    ? "var(--c-process)"
                    : s.color === "transform"
                      ? "var(--c-transform)"
                      : "var(--c-result)",
                opacity: 0.4,
              }}
              aria-label={s.label}
            />
          ))}
        </div>

        {/* ============== HERO ============== */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-kicker">
              <span>Presentación de la solución</span>
              <span className="pill">en producción</span>
              <span>·</span>
              <span>web-deluca-abogado.vercel.app</span>
            </div>
            <h1>
              Una plataforma para que el <em>cliente llegue</em>, el{" "}
              <span className="accent-2">caso se ordene</span> y la marca{" "}
              <span className="accent-3">crezca</span> sola.
            </h1>
            <p className="hero-sub">
              Lo que sigue no es un sitio web. Es un sistema completo de captación, conversión,
              autoridad y operación — construido para el Estudio Jurídico Dr. Pablo De Luca con
              tecnología de punta y cumplimiento legal nativo desde el primer minuto.
            </p>
            <div className="hero-cards">
              <div className="hero-card">
                <span className="hero-card-tag">Páginas activas</span>
                <span className="hero-card-num process">31</span>
                <span className="hero-card-label">rutas en producción ya navegables</span>
              </div>
              <div className="hero-card">
                <span className="hero-card-tag">Herramientas legales</span>
                <span className="hero-card-num transform">07</span>
                <span className="hero-card-label">
                  calculadoras, verificadores, guías y glosario
                </span>
              </div>
              <div className="hero-card">
                <span className="hero-card-tag">Cobertura QA</span>
                <span className="hero-card-num result">140</span>
                <span className="hero-card-label">tests automatizados pasando al 100%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============== 01 DIAGNÓSTICO ============== */}
        <section className="deluca-section" id="diagnostico">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="section-num">
                  <span className="col-dot col-process" />
                  01 · Diagnóstico
                </div>
                <h2>
                  Cuatro problemas que{" "}
                  <em className="process">la mayoría de los abogados ignora</em>.
                </h2>
              </div>
              <p className="section-bajada">
                La diferencia entre un sitio web y una plataforma profesional está en resolver
                problemas reales del negocio, no solo en verse bien. Estos son los cuellos de
                botella que detectamos antes de empezar.
              </p>
            </div>
            <div className="diag-grid">
              <div className="diag-card">
                <span className="diag-card-tag">P1 · Visibilidad</span>
                <h3>El sitio aparece en Google solo si el cliente busca tu nombre.</h3>
                <p>
                  Sin contenido útil indexable, el sitio es una tarjeta de presentación. Quien
                  todavía no te conoce, no te encuentra. Hay que entregar valor para que Google te
                  muestre.
                </p>
              </div>
              <div className="diag-card">
                <span className="diag-card-tag">P2 · Conversión</span>
                <h3>
                  El formulario genérico no convierte. El cliente se va al primer abogado que
                  conteste rápido.
                </h3>
                <p>
                  Un “contactanos” pierde contra un proceso claro. Si el visitante no entiende
                  cuánto va a costar, cuándo va a tener respuesta y por qué tu estudio, se va.
                </p>
              </div>
              <div className="diag-card">
                <span className="diag-card-tag">P3 · Operación</span>
                <h3>Coordinar turnos por WhatsApp consume horas que deberían ir al expediente.</h3>
                <p>
                  Cada turno coordinado a mano es 8-12 mensajes. Multiplicado por 20 consultas
                  mensuales = una jornada laboral entera tirada en logística.
                </p>
              </div>
              <div className="diag-card">
                <span className="diag-card-tag">P4 · Confianza</span>
                <h3>
                  Sin diferenciadores visibles, todos los abogados parecen iguales al cliente.
                </h3>
                <p>
                  El visitante no distingue entre 200 estudios con la misma estructura: hero, áreas,
                  contacto. El que entrega valor antes de cobrar gana la conversación.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============== 02 SOLUCIÓN ============== */}
        <section className="deluca-section dark" id="solucion">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="section-num">
                  <span className="col-dot col-process" />
                  02 · Solución
                </div>
                <h2>
                  Una <em className="result">plataforma operativa</em>, no un folleto digital.
                </h2>
              </div>
              <p className="manifiesto">
                Construimos un sitio que <strong>trabaja por vos las 24 horas</strong>: atrae con
                SEO útil, califica al visitante, automatiza la reserva, sincroniza con tu calendario
                y guarda todo bajo cumplimiento legal argentino.
              </p>
            </div>
            <div className="manifiesto-keys">
              <div className="manif-key">
                <span className="manif-num process">01.</span>
                <span className="manif-key-label">
                  <strong style={{ color: "white" }}>Atrae</strong> con herramientas que la gente
                  busca todos los meses en Google.
                </span>
              </div>
              <div className="manif-key">
                <span className="manif-num transform">02.</span>
                <span className="manif-key-label">
                  <strong style={{ color: "white" }}>Convierte</strong> con un triaje
                  pre-clasificado que llega al WhatsApp del Dr. ya ordenado.
                </span>
              </div>
              <div className="manif-key">
                <span className="manif-num result">03.</span>
                <span className="manif-key-label">
                  <strong style={{ color: "white" }}>Opera</strong> sola — reserva, emails, Google
                  Calendar y panel admin con auditoría.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============== 03 INVENTARIO ============== */}
        <section className="deluca-section" id="inventario">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="section-num">
                  <span className="col-dot col-process" />
                  03 · Inventario
                </div>
                <h2>
                  Todo lo que <em className="process">ya está en producción</em>.
                </h2>
              </div>
              <p className="section-bajada">
                21 features funcionando en 5 grupos. Cada una desarrollada, testeada y certificada
                para deploy.
              </p>
            </div>
            {INVENTARIO.map((g, i) => (
              <div key={g.grupo} className="grupo">
                <div className="grupo-head">
                  <span className="grupo-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="grupo-titulo">{g.grupo}</span>
                </div>
                <div className="grupo-items">
                  {g.items.map((item) => (
                    <div key={item.name} className="item">
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
        <section
          className="deluca-section"
          id="beneficios"
          style={{ background: "var(--c-surface)" }}
        >
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="section-num">
                  <span className="col-dot col-transform" />
                  04 · Beneficios
                </div>
                <h2>
                  Por qué esto <em className="transform">cambia el juego</em>.
                </h2>
              </div>
              <p className="section-bajada">
                Cada decisión técnica responde a un problema de negocio concreto. No hay features de
                adorno — todo lo construido tiene una razón medible.
              </p>
            </div>
            <div className="benef-grid">
              {BENEFICIOS.map((b, i) => (
                <div key={b.titulo} className="benef">
                  <span
                    className={`benef-icon ${i % 3 === 0 ? "alt-1" : i % 3 === 1 ? "" : "alt-2"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{b.titulo}</h3>
                  <p>{b.detalle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 05 TECNOLOGÍA ============== */}
        <section className="deluca-section" id="tecnologia">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="section-num">
                  <span className="col-dot col-transform" />
                  05 · Tecnología
                </div>
                <h2>
                  Stack <em className="transform">2026</em>, no Wordpress de 2014.
                </h2>
              </div>
              <p className="section-bajada">
                Construido sobre las mismas tecnologías que usan Vercel, Linear, Notion y los
                productos digitales premium. Mantenibles, escalables y rápidos por diseño.
              </p>
            </div>
            <div className="stack-table">
              {STACK.map((s) => (
                <div key={s.layer} className="stack-row">
                  <span className="stack-layer">{s.layer}</span>
                  <span className="stack-tech">{s.tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 06 MÉTRICAS ============== */}
        <section className="deluca-section dark" id="metricas">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="section-num">
                  <span className="col-dot col-result" />
                  06 · Métricas
                </div>
                <h2>
                  Lo que se <em className="result">midió</em> durante el build.
                </h2>
              </div>
              <p className="section-bajada" style={{ color: "rgba(247,247,252,0.55)" }}>
                Build verificable, tests automáticos, performance Core Web Vitals, todo medible y
                reproducible.
              </p>
            </div>
            <div className="metricas-grid">
              {METRICAS.map((m) => (
                <div key={m.label} className="metrica">
                  <span className="metrica-label">{m.label}</span>
                  <span className="metrica-value">{m.value}</span>
                  <span className="metrica-note">{m.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 07 ROADMAP ============== */}
        <section className="deluca-section" id="roadmap">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="section-num">
                  <span className="col-dot col-result" />
                  07 · Roadmap
                </div>
                <h2>
                  Lo que <em className="result">viene después</em>.
                </h2>
              </div>
              <p className="section-bajada">
                La plataforma está diseñada para crecer en módulos. Cuando el MVP esté validado,
                sumamos features premium que diferencian al estudio aún más.
              </p>
            </div>
            <div className="roadmap-grid">
              {ROADMAP.map((r) => (
                <div key={r.titulo} className="roadmap-card">
                  <span className="roadmap-etapa">{r.etapa}</span>
                  <h3>{r.titulo}</h3>
                  <p>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 08 GO LIVE ============== */}
        <section className="deluca-section" id="go-live" style={{ background: "var(--c-surface)" }}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="section-num">
                  <span className="col-dot col-result" />
                  08 · Go live
                </div>
                <h2>
                  Pasos para que el sitio <em className="result">empiece a generar</em>.
                </h2>
              </div>
              <p className="section-bajada">
                El sitio está deployado y funcionando. Para activar al 100% el sistema de turnos,
                emails y blog dinámico, necesitamos completar estos puntos.
              </p>
            </div>
            <div className="golive-table">
              {GO_LIVE.map((g, i) => (
                <div key={g.tarea} className="golive-row">
                  <span className="golive-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="golive-task">{g.tarea}</span>
                  <span
                    className={`golive-resp ${
                      g.responsable === "Dev" ? "dev" : g.responsable.includes("+") ? "mix" : ""
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
          <div className="wrap">
            <h2>
              El sitio está en producción.
              <br />
              Falta <em>encenderlo</em>.
            </h2>
            <p>
              El código está desplegado en Vercel. Faltan tus datos reales y la configuración de las
              cuentas externas (Supabase, Resend, Google Calendar). Coordinamos esto en una llamada
              de 30 minutos y dejamos el sitio vivo.
            </p>
            <div className="cta-buttons">
              <a href="https://web-deluca-abogado.vercel.app/" className="cta-btn primary">
                Ver el sitio en vivo →
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  "Hola, vi la presentación. Coordinemos para arrancar."
                )}`}
                className="cta-btn secondary"
              >
                Coordinemos por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ============== FOOTER ============== */}
        <footer className="footer-pres">
          <div className="wrap footer-grid">
            <span>
              <strong>Estudio Jurídico Dr. Pablo De Luca</strong> · Presentación generada para
              revisión interna.
            </span>
            <span>2026 · web-deluca-abogado.vercel.app</span>
          </div>
        </footer>
      </div>
    </>
  );
}
