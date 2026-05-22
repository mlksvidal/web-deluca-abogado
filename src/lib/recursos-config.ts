/**
 * recursos-config.ts — Configuración centralizada de recursos descargables.
 * Fuente única de verdad para el centro de descargas en /recursos.
 *
 * Cada entrada define metadata visible + URL de descarga del PDF.
 * Los PDFs viven en /public/pdfs/*.pdf (Next.js sirve desde /pdfs/*.pdf).
 *
 * NOTA: iconName es un string (no un componente Lucide) para que RecursoConfig
 * sea serializable y seguro de pasar desde Server Components a Client Components.
 * La resolución del ícono ocurre en el cliente via ICON_MAP en recurso-card.tsx.
 */

// ─── Tipo ─────────────────────────────────────────────────────────────────────

export type AreaLegal = "civil_familia" | "laboral" | "penal" | "comercial" | "general";

export type RecursoConfig = {
  /** Slug URL-safe, único */
  slug: string;
  /** Título completo del documento */
  titulo: string;
  /** Descripción corta para cards — máx 120 chars */
  descripcion: string;
  /** Descripción larga para landing de slug individual */
  descripcionLarga: string;
  /**
   * Nombre del ícono Lucide — string para que RecursoConfig sea serializable.
   * Se resuelve a componente en ICON_MAP del cliente.
   */
  iconName: "FileText" | "Briefcase" | "Scale" | "BookOpen";
  /** Área legal a la que pertenece */
  areaLegal: AreaLegal;
  /** Etiqueta de área para mostrar */
  areaLabel: string;
  /** Tipo de documento */
  tipo: "modelo" | "guia" | "formulario";
  /** Tamaño aproximado legible */
  tamano: string;
  /** Ruta al PDF (relativo a /public) → se sirve desde dominio raíz */
  downloadUrl: string;
  /** Keywords SEO para la landing individual */
  keywords: string[];
};

// ─── Datos ────────────────────────────────────────────────────────────────────

export const RECURSOS: RecursoConfig[] = [
  {
    slug: "modelo-poder",
    titulo: "Modelo de Poder General",
    descripcion:
      "Modelo de instrumento para otorgar poder general a un apoderado. Adaptable para gestiones civiles, comerciales y administrativas.",
    descripcionLarga:
      "Este modelo de poder general te permite designar a una persona de confianza para que actúe en tu nombre en una amplia variedad de gestiones jurídicas y administrativas. Incluye cláusulas para representación ante organismos públicos, gestiones bancarias, administrativas y judiciales. Está redactado de acuerdo con el Código Civil y Comercial de la Nación Argentina.",
    iconName: "FileText",
    areaLegal: "civil_familia",
    areaLabel: "Civil y Familia",
    tipo: "modelo",
    tamano: "~80 KB",
    downloadUrl: "/pdfs/modelo-poder-general.pdf",
    keywords: [
      "modelo poder general Argentina",
      "poder notarial modelo",
      "poder general instrumento",
      "modelo poder civil Mendoza",
    ],
  },
  {
    slug: "carta-documento-laboral",
    titulo: "Modelo de Carta Documento Laboral",
    descripcion:
      "Modelo de carta documento para situaciones laborales frecuentes: intimación al pago, desconocimiento de tareas y reserva de derechos.",
    descripcionLarga:
      "La carta documento es el medio fehaciente por excelencia para comunicar reclamos laborales. Este modelo incluye estructura y cláusulas para las situaciones más frecuentes: intimación al empleador al pago de haberes adeudados, desconocimiento de categoría o tareas asignadas, reserva de derechos ante hostigamiento y notificación de enfermedad o accidente. Redactado conforme a la Ley de Contrato de Trabajo 20.744.",
    iconName: "Briefcase",
    areaLegal: "laboral",
    areaLabel: "Derecho Laboral",
    tipo: "modelo",
    tamano: "~75 KB",
    downloadUrl: "/pdfs/carta-documento-laboral.pdf",
    keywords: [
      "modelo carta documento laboral Argentina",
      "carta documento empleador",
      "intimación laboral modelo",
      "carta documento despido",
    ],
  },
  {
    slug: "guia-despido",
    titulo: "¿Qué hacer si te despidieron sin causa?",
    descripcion:
      "Guía práctica paso a paso: qué derechos tenés, qué cobrar, qué plazos respetar y cuándo consultar a un abogado.",
    descripcionLarga:
      "Ser despedido sin causa es una situación estresante y llena de dudas. Esta guía explica en lenguaje claro qué es el despido sin causa, cuáles son las indemnizaciones que corresponden (arts. 231, 232, 233 y 245 LCT), los plazos críticos para reclamar, qué documentación pedir al empleador y cuándo es imprescindible consultar a un abogado. Incluye un checklist de acciones inmediatas.",
    iconName: "Scale",
    areaLegal: "laboral",
    areaLabel: "Derecho Laboral",
    tipo: "guia",
    tamano: "~120 KB",
    downloadUrl: "/pdfs/guia-despido-sin-causa.pdf",
    keywords: [
      "qué hacer despido sin causa Argentina",
      "derechos despido laboral",
      "indemnización despido Argentina",
      "pasos después del despido",
    ],
  },
  {
    slug: "guia-sucesion",
    titulo: "Pasos para iniciar una sucesión en Mendoza",
    descripcion:
      "Guía completa sobre el trámite sucesorio en la provincia de Mendoza: requisitos, etapas, documentación y tiempos estimados.",
    descripcionLarga:
      "Iniciar una sucesión puede parecer complejo, pero con la información correcta el proceso es claro y ordenado. Esta guía explica las etapas del juicio sucesorio en Mendoza: radicación, declaratoria de herederos, inventario y tasación, partición y adjudicación. Detalla la documentación necesaria, los costos aproximados en sellados y honorarios, y los tiempos estimados para cada etapa.",
    iconName: "BookOpen",
    areaLegal: "civil_familia",
    areaLabel: "Civil y Familia",
    tipo: "guia",
    tamano: "~130 KB",
    downloadUrl: "/pdfs/guia-sucesion-mendoza.pdf",
    keywords: [
      "sucesión Mendoza tramite",
      "iniciar sucesión Argentina",
      "juicio sucesorio Mendoza pasos",
      "herencia trámite Mendoza",
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Busca un recurso por slug. Retorna undefined si no existe. */
export function getRecursoBySlug(slug: string): RecursoConfig | undefined {
  return RECURSOS.find((r) => r.slug === slug);
}

/** Etiquetas de tipo legibles */
export const TIPO_LABELS: Record<RecursoConfig["tipo"], string> = {
  modelo: "Modelo editable",
  guia: "Guía práctica",
  formulario: "Formulario",
};

/** Mapa slug → downloadUrl para la server action leads.ts */
export const SLUG_TO_DOWNLOAD_URL: Record<string, string> = Object.fromEntries(
  RECURSOS.map((r) => [r.slug, r.downloadUrl])
);
