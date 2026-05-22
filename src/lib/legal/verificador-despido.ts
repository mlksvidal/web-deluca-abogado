/**
 * Verificador de legalidad del despido.
 *
 * Analiza las circunstancias del despido y emite un diagnóstico preliminar:
 *   "legal"   — aparenta ajustarse a derecho
 *   "dudoso"  — hay indicios de irregularidad, requiere análisis profesional
 *   "ilegal"  — hay elementos claros de irregularidad (no necesariamente judicializable sin prueba)
 *
 * IMPORTANTE: Este diagnóstico es orientativo. La calificación judicial depende
 * de la prueba disponible y el análisis de un abogado.
 *
 * Patrones evaluados:
 *   1. Registro laboral (trabajo en negro = ilegal automático)
 *   2. Preaviso omitido o mal calculado
 *   3. Causa informada y justificada
 *   4. Recepción de liquidación final
 *   5. Tipo de despido
 */

import { DISCLAIMER_VERIFICADOR } from "./disclaimer";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type TipoDespidoInput =
  | "directo_sin_causa" // Empleador despide sin alegar causa
  | "directo_con_causa" // Empleador despide alegando causa (justa causa)
  | "indirecto" // Trabajador se considera despedido por incumplimiento
  | "mutuo_acuerdo" // Art. 241 LCT — acuerdo homologado
  | "vencimiento_plazo" // Contrato a plazo fijo
  | "fuerza_mayor" // Art. 247 — reducción a 50% indemnización
  | "no_renovacion"; // No renovación de contrato a plazo o eventual

export type DiagnosticoDespido = "legal" | "dudoso" | "ilegal";

export interface InputVerificadorDespido {
  tipoDespido: TipoDespidoInput;
  /** Si el empleado recibió preaviso */
  preavisoRecibido: boolean;
  /** Antigüedad en años */
  antiguedadAnios: number;
  /** Si el trabajo estaba registrado (en blanco) */
  registrado: boolean;
  /** Si se informó motivo claro por escrito */
  motivoInformado: boolean;
  /** Si recibió liquidación final (vacaciones, SAC, haberes) */
  recibioLiquidacion: boolean;
  /** Si firmó algo sin entender el contenido */
  firmoSinEntender?: boolean;
  /** Si le hicieron presión para renunciar */
  presionParaRenunciar?: boolean;
}

export interface ResultadoVerificadorDespido {
  diagnostico: DiagnosticoDespido;
  razones: string[];
  recomendacion: string;
  disclaimer: string;
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Evalúa si el despido fue legal, dudoso o ilegal según los datos informados.
 *
 * @example
 * evaluarDespido({
 *   tipoDespido: "directo_sin_causa",
 *   preavisoRecibido: false,
 *   antiguedadAnios: 3,
 *   registrado: true,
 *   motivoInformado: false,
 *   recibioLiquidacion: false,
 * })
 * // → { diagnostico: "ilegal", razones: [...], recomendacion: "..." }
 */
export function evaluarDespido(input: InputVerificadorDespido): ResultadoVerificadorDespido {
  const {
    tipoDespido,
    preavisoRecibido,
    antiguedadAnios,
    registrado,
    motivoInformado,
    recibioLiquidacion,
    firmoSinEntender = false,
    presionParaRenunciar = false,
  } = input;

  const razones: string[] = [];
  let puntosIlegales = 0;
  let puntosDudosos = 0;

  // ─── 1. Registro laboral ───────────────────────────────────────────────────
  if (!registrado) {
    puntosIlegales += 3;
    razones.push(
      "Trabajo no registrado (en negro): el empleador incumplió sus obligaciones legales de registro. Esto genera derechos adicionales (multas Ley 24.013 y 25.323)."
    );
  }

  // ─── 2. Tipo de despido ────────────────────────────────────────────────────
  switch (tipoDespido) {
    case "mutuo_acuerdo":
      // Válido solo si fue homologado ante el SECLO o juez laboral
      puntosDudosos += 1;
      razones.push(
        "Mutuo acuerdo (art. 241 LCT): es válido SOLO si fue homologado ante el SECLO o juzgado laboral. Sin homologación, puede impugnarse."
      );
      break;
    case "directo_con_causa":
      if (!motivoInformado) {
        puntosIlegales += 2;
        razones.push(
          "Despido con causa sin comunicación escrita del motivo: la causa no comunicada no tiene efecto legal (art. 243 LCT). Se equipara a despido sin causa."
        );
      } else {
        puntosDudosos += 1;
        razones.push(
          "Despido con causa: la justificación de la causa debe evaluarse con un abogado — si no es suficiente, corresponde indemnización completa."
        );
      }
      break;
    case "indirecto":
      puntosDudosos += 1;
      razones.push(
        "Despido indirecto: el trabajador debe haber intimado por escrito al empleador antes de considerarse despedido. Verificar que se cumplió este requisito."
      );
      break;
    case "fuerza_mayor":
      puntosDudosos += 1;
      razones.push(
        "Fuerza mayor o falta de trabajo: reduce indemnización al 50% (art. 247 LCT), pero el empleador debe acreditar la causa. Si no la prueba, corresponde indemnización completa."
      );
      break;
    case "no_renovacion":
      puntosDudosos += 1;
      razones.push(
        "No renovación de contrato: si el contrato fue renovado varias veces, puede encubrir una relación por tiempo indeterminado. Consultá con un abogado."
      );
      break;
    default:
      // directo_sin_causa, vencimiento_plazo → sin puntos adicionales
      break;
  }

  // ─── 3. Preaviso ──────────────────────────────────────────────────────────
  if (!preavisoRecibido && tipoDespido !== "mutuo_acuerdo" && tipoDespido !== "directo_con_causa") {
    puntosIlegales += 1;
    const mesesEsperados = antiguedadAnios >= 5 ? 2 : 1;
    razones.push(
      `Preaviso no recibido: corresponden ${mesesEsperados} mes${mesesEsperados > 1 ? "es" : ""} de preaviso o su equivalente en dinero (art. 232 LCT).`
    );
  }

  // ─── 4. Liquidación final ──────────────────────────────────────────────────
  if (!recibioLiquidacion) {
    puntosDudosos += 1;
    razones.push(
      "Sin liquidación final recibida: el empleador debe liquidar vacaciones proporcionales, SAC proporcional y haberes del mes. Si no lo hizo, hay una deuda pendiente."
    );
  }

  // ─── 5. Firma sin entender ─────────────────────────────────────────────────
  if (firmoSinEntender) {
    puntosIlegales += 2;
    razones.push(
      "Firma bajo presión o sin entender el contenido: los acuerdos firmados bajo error, dolo o violencia pueden impugnarse judicialmente. NO aceptes dinero del empleador sin consultar antes — aceptarlo puede hacer presumir conformidad."
    );
  }

  // ─── 6. Presión para renunciar ─────────────────────────────────────────────
  if (presionParaRenunciar) {
    puntosIlegales += 2;
    razones.push(
      "Presión para renunciar: la renuncia obtenida mediante coerción puede impugnarse. La renuncia válida debe ser voluntaria, libre y enviada por telegrama o carta documento al empleador."
    );
  }

  // ─── Diagnóstico final ─────────────────────────────────────────────────────
  let diagnostico: DiagnosticoDespido;

  if (puntosIlegales >= 2) {
    diagnostico = "ilegal";
  } else if (puntosIlegales >= 1 || puntosDudosos >= 2) {
    diagnostico = "dudoso";
  } else {
    diagnostico = "legal";
  }

  // Ajuste: trabajo no registrado siempre es ilegal sin importar el resto
  if (!registrado) {
    diagnostico = "ilegal";
  }

  // ─── Recomendación personalizada ──────────────────────────────────────────
  let recomendacion: string;

  switch (diagnostico) {
    case "ilegal":
      recomendacion =
        "Hay indicios serios de irregularidades en este despido. Te recomendamos consultar con un abogado laboralista ANTES de firmar cualquier documento o recibir dinero del empleador. Aceptar pagos puede implicar renuncia a derechos. Tenés 2 años para reclamar (prescripción laboral).";
      break;
    case "dudoso":
      recomendacion =
        "Hay aspectos del despido que requieren análisis profesional. Consultá con un abogado laboralista para evaluar si corresponde reclamar. Si firmaste algo sin entenderlo bien, llévalo a revisión cuanto antes.";
      break;
    case "legal":
      recomendacion =
        "El despido aparenta haberse realizado conforme a derecho según los datos informados. Si igualmente tenés dudas sobre los montos liquidados o algún detalle del proceso, una consulta con un abogado te da certeza.";
      break;
  }

  return {
    diagnostico,
    razones,
    recomendacion,
    disclaimer: DISCLAIMER_VERIFICADOR,
  };
}
