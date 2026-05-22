/**
 * timeline-divorcio-config.ts
 * Configuración de los hitos del proceso de divorcio en Argentina.
 * Editar este archivo para actualizar el contenido de /proceso/divorcio.
 */

export interface HitoDivorcio {
  id: string;
  numero: number;
  titulo: string;
  descripcion: string;
  duracionEstimada: string;
  icon: string; // nombre del ícono Lucide
  /** Si aplica solo en algunos casos */
  condicional?: string;
}

export const HITOS_DIVORCIO: HitoDivorcio[] = [
  {
    id: "consulta-inicial",
    numero: 1,
    titulo: "Consulta inicial y armado del plan",
    descripcion:
      "El primer paso es reunirse con el abogado para evaluar el caso. Se analizan los bienes en juego, la situación de los hijos (si los hay), el tipo de divorcio más conveniente (vincular, por presentación conjunta o unilateral) y se diseña la estrategia procesal.",
    duracionEstimada: "1–2 semanas",
    icon: "MessageSquare",
  },
  {
    id: "mediacion-previa",
    numero: 2,
    titulo: "Mediación previa obligatoria",
    descripcion:
      "En Mendoza, antes de iniciar el juicio de divorcio, es obligatorio pasar por una instancia de mediación extrajudicial. El mediador intenta que las partes lleguen a un acuerdo sobre los puntos en conflicto (alimentos, cuidado personal, bienes). Si no hay acuerdo, se labra el acta y se habilita la vía judicial.",
    duracionEstimada: "1–3 meses",
    icon: "Users",
    condicional: "Obligatoria cuando hay conflicto en los acuerdos",
  },
  {
    id: "presentacion-demanda",
    numero: 3,
    titulo: "Presentación de la demanda o acuerdo",
    descripcion:
      "Se inicia formalmente el proceso judicial. En el divorcio por presentación conjunta (ambas partes de acuerdo), se presenta el convenio regulador. En el divorcio unilateral, se presenta la demanda. El Código Civil y Comercial (art. 437) no exige alegar causa para el divorcio.",
    duracionEstimada: "1–2 semanas para preparar la presentación",
    icon: "FileText",
  },
  {
    id: "medidas-urgentes",
    numero: 4,
    titulo: "Resolución sobre cuestiones urgentes",
    descripcion:
      "Apenas iniciado el proceso, el juez puede dictar medidas cautelares urgentes: alimentos provisorios para el cónyuge o los hijos, cuidado personal provisorio de los menores, atribución del hogar conyugal, y exclusión del hogar en casos de violencia.",
    duracionEstimada: "Días a semanas según urgencia",
    icon: "AlertCircle",
    condicional: "Solo si hay urgencias que no pueden esperar la sentencia",
  },
  {
    id: "audiencias",
    numero: 5,
    titulo: "Audiencias",
    descripcion:
      "Dependiendo del tipo de proceso y la provincia, puede haber una o varias audiencias. En el divorcio conjunto, suele ser una audiencia de ratificación del convenio. En el contencioso puede haber audiencias de conciliación, prueba e informes periciales.",
    duracionEstimada: "1–6 meses",
    icon: "Calendar",
  },
  {
    id: "sentencia",
    numero: 6,
    titulo: "Sentencia de divorcio",
    descripcion:
      "El juez dicta la sentencia que disuelve el vínculo matrimonial y, si hubo acuerdo, homologa el convenio regulador (cuidado personal, alimentos, atribución del hogar, deudas). La sentencia pone fin al matrimonio y habilita a ambas partes a contraer nuevas nupcias.",
    duracionEstimada: "1–3 meses desde la audiencia final",
    icon: "CheckCircle",
  },
  {
    id: "inscripcion-registral",
    numero: 7,
    titulo: "Inscripción registral",
    descripcion:
      "La sentencia de divorcio se inscribe en el Registro Civil para que el estado civil de cada parte quede actualizado. También se notifica al Registro de la Propiedad si hay bienes inmuebles involucrados. Este paso es fundamental para que el divorcio produzca efectos frente a terceros.",
    duracionEstimada: "2–4 semanas",
    icon: "BookOpen",
  },
  {
    id: "liquidacion-bienes",
    numero: 8,
    titulo: "Liquidación y partición de bienes",
    descripcion:
      "Si el matrimonio tenía bienes bajo el régimen de comunidad de ganancias, la liquidación puede hacerse de manera privada (escritura pública) o judicial. Se determina qué bienes son propios de cada cónyuge y cuáles son gananciales a dividir. En el régimen de separación de bienes, cada parte retiene los suyos.",
    duracionEstimada: "Varía según complejidad: 1 mes a varios años",
    icon: "Scale",
    condicional: "Solo si hay bienes en comunidad a liquidar",
  },
];

export type TimelineDivorcioConfig = typeof HITOS_DIVORCIO;
