/**
 * practice-areas-data.ts — Áreas de práctica del Estudio De Luca.
 * Array tipado, fuente única. Consumido por PracticeAreas y TriajeWizard.
 */

export interface PracticeArea {
  id: "civil_familia" | "laboral" | "penal" | "comercial";
  label: string;
  slug: string;
  /** Subtítulo para la card */
  tagline: string;
  /** Descripción párrafo corto */
  description: string;
  /** 3-4 sub-temas */
  subtemas: string[];
  /** Nombre del SVG icon en /public/icons/ (sin extensión) */
  icon: "balanza" | "gavel" | "escudo" | "edificio";
}

export const practiceAreas: PracticeArea[] = [
  {
    id: "civil_familia",
    label: "Civil y Familia",
    slug: "civil-familia",
    tagline: "Relaciones personales con rigor jurídico",
    description:
      "Asesoramiento y representación en conflictos civiles, sucesiones, divorcios y cuestiones de familia. Priorizamos las soluciones acordadas sin descartar la vía judicial cuando es necesario.",
    subtemas: [
      "Divorcios y separaciones",
      "Guarda y cuidado de hijos",
      "Sucesiones y herencias",
      "Contratos civiles y daños",
    ],
    icon: "balanza",
  },
  {
    id: "laboral",
    label: "Derecho Laboral",
    slug: "laboral",
    tagline: "Derechos del trabajador y del empleador",
    description:
      "Defensa de trabajadores ante despidos arbitrarios y reclamos de haberes. Asesoramiento a empresas en gestión de personal, liquidaciones y conflictos colectivos.",
    subtemas: [
      "Despidos y liquidaciones",
      "Accidentes de trabajo (ART)",
      "Reclamos de haberes",
      "Asesoramiento empresarial",
    ],
    icon: "gavel",
  },
  {
    id: "penal",
    label: "Derecho Penal",
    slug: "penal",
    tagline: "Defensa técnica en toda la etapa procesal",
    description:
      "Representación en causas penales desde la investigación preparatoria hasta el juicio oral. Defensa de imputados y asesoramiento a víctimas en delitos de todo tipo.",
    subtemas: [
      "Defensa en causas penales",
      "Excarcelaciones y eximiciones",
      "Delitos económicos y fraude",
      "Representación de víctimas",
    ],
    icon: "escudo",
  },
  {
    id: "comercial",
    label: "Derecho Comercial",
    slug: "comercial",
    tagline: "Seguridad jurídica para su empresa",
    description:
      "Constitución y reorganización de sociedades, contratos comerciales, cobro de deudas y resolución de conflictos entre socios o con terceros. Acompañamiento legal en cada etapa del negocio.",
    subtemas: [
      "Sociedades y contratos",
      "Cobro de deudas (juicio ejecutivo)",
      "Conflictos entre socios",
      "Quiebras y concursos",
    ],
    icon: "edificio",
  },
];
