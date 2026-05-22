/**
 * site-config.ts — Fuente única de verdad para datos del estudio.
 * Reemplazar placeholders antes del deploy en producción.
 */

export const siteConfig = {
  // ─── Identidad ───────────────────────────────────────────────
  drName: "Dr. Pablo De Luca",
  studioName: "Estudio Jurídico Dr. Pablo De Luca",
  studioNameShort: "Estudio De Luca",
  monogram: "PD",
  taglineShort: "Asesoría jurídica con criterio, claridad y compromiso.",
  taglineLong:
    "En el Estudio De Luca asesoramos a personas y empresas de San Rafael con criterio jurídico sólido y un lenguaje que se entiende.",

  // ─── Contacto ────────────────────────────────────────────────
  whatsapp: "5492604614896",
  whatsappDisplay: "+54 9 260 461-4896",
  email: "consultas@deluca-abogado.com.ar",
  phone: "+54 260 461-4896",

  // ─── Ubicación ───────────────────────────────────────────────
  address: "San Rafael, Mendoza, Argentina",
  addressFull: "Dirección pendiente — San Rafael, Mendoza, CP 5600",
  city: "San Rafael",
  province: "Mendoza",
  country: "Argentina",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3d-placeholder", // Reemplazar con embed real

  // ─── Matrícula ───────────────────────────────────────────────
  matricula: "MAT-XXXX", // Reemplazar con número real
  colegioUrl: "https://www.colegiodeabogadosmendoza.org", // URL real del colegio
  colegioName: "Colegio de Abogados de Mendoza",

  // ─── Horarios ────────────────────────────────────────────────
  horarios: {
    lunes: "09:00–13:00 / 16:00–20:00",
    martes: "09:00–13:00 / 16:00–20:00",
    miercoles: "09:00–13:00 / 16:00–20:00",
    jueves: "09:00–13:00 / 16:00–20:00",
    viernes: "09:00–13:00 / 16:00–20:00",
    sabado: "Cerrado",
    domingo: "Cerrado",
  },
  horariosDisplay: "Lunes a Viernes 9:00–13:00 y 16:00–20:00",

  // ─── SEO ─────────────────────────────────────────────────────
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://deluca-abogado.vercel.app",
  seoTitle: "Dr. Pablo De Luca | Abogado en San Rafael, Mendoza",
  seoDescription:
    "Estudio Jurídico en San Rafael, Mendoza. Derecho Civil, Laboral, Penal y Comercial. Consulta inicial sin cargo. Reservá tu turno online.",
  ogImage: "/og-image.png",

  // ─── Áreas de práctica ───────────────────────────────────────
  areas: [
    {
      id: "civil_familia",
      label: "Civil y Familia",
      slug: "civil-familia",
    },
    {
      id: "laboral",
      label: "Laboral",
      slug: "laboral",
    },
    {
      id: "penal",
      label: "Penal",
      slug: "penal",
    },
    {
      id: "comercial",
      label: "Comercial",
      slug: "comercial",
    },
  ],

  // ─── Redes sociales ──────────────────────────────────────────
  social: {
    instagram: "https://www.instagram.com/estudio.deluca", // Placeholder
    linkedin: "https://www.linkedin.com/in/pablo-deluca-abogado", // Placeholder
  },
} as const;

export type SiteConfig = typeof siteConfig;
