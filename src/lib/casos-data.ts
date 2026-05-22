/**
 * casos-data.ts — Casos resueltos narrativos (hardcoded MVP).
 * Estructurado para migrar a tabla `casos` en Supabase en futuro.
 * Los nombres, fechas y detalles han sido alterados.
 */

export interface CasoResuelto {
  id: string;
  area: "Laboral" | "Civil y Familia" | "Comercial" | "Penal";
  duracionMeses: number;
  titulo: string;
  descripcion: string;
  resultado: string;
}

export const casosResueltos: CasoResuelto[] = [
  {
    id: "caso-001",
    area: "Laboral",
    duracionMeses: 4,
    titulo: "Despido después de 12 años de antigüedad",
    descripcion:
      "Un trabajador de la industria vitivinícola fue desvinculado sin causa luego de 12 años de servicio. La empresa ofreció una indemnización inferior a la que correspondía, omitiendo conceptos salariales no registrados y el plus por productividad habitual.",
    resultado:
      "Se logró la indemnización completa por todos los rubros legales, incluyendo art. 245, 232, 233 y multas por falta de entrega de certificados. El importe final superó en un 60% la oferta inicial de la empresa.",
  },
  {
    id: "caso-002",
    area: "Civil y Familia",
    duracionMeses: 6,
    titulo: "Divorcio con cuidado compartido sin litigio",
    descripcion:
      "Una pareja con dos hijos menores se encontraba en una situación de alta conflictividad. Ambas partes querían el cuidado exclusivo, lo que abría la puerta a un proceso largo y costoso, con impacto directo en los niños.",
    resultado:
      "A través de acuerdo mediado y homologado judicialmente, se estableció un régimen de cuidado compartido alternado, con criterios claros para escolaridad, salud y viajes. El proceso evitó el juicio oral y se cerró en seis meses.",
  },
  {
    id: "caso-003",
    area: "Civil y Familia",
    duracionMeses: 8,
    titulo: "Sucesión con cuatro herederos en desacuerdo",
    descripcion:
      "Cuatro hermanos herederos de un inmueble rural y cuentas bancarias no lograban ponerse de acuerdo sobre la valuación del bien ni sobre si vender o adjudicar. La tensión familiar y la falta de testamento complicaban la situación.",
    resultado:
      "Se ordenó el expediente sucesorio, se realizó valuación pericial acordada y se logró la partición homologada en ocho meses. El bien fue adjudicado a quien podía adquirir las hijuelas, sin necesidad de remate judicial.",
  },
];
