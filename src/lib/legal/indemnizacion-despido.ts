/**
 * Calculadora de indemnización por despido — Ley de Contrato de Trabajo Argentina.
 *
 * Artículos aplicados:
 *   Art. 245 LCT  — Indemnización por antigüedad (1 mes sueldo por año trabajado)
 *   Art. 232 LCT  — Indemnización sustitutiva de preaviso
 *   Art. 233 LCT  — Integración del mes de despido
 *   Art. 80 LCT   — Multa por falta de entrega de certificados laborales
 *
 * Reglas clave:
 *   - Mejor remuneración mensual normal y habitual (art. 245): exclúye SAC, horas extra,
 *     premios ocasionales. Se toma el sueldo bruto informado como proxy.
 *   - Antigüedad: fracción ≥ 3 meses se computa como 1 año completo (art. 245 in fine)
 *   - Antigüedad mínima: 3 meses en período de prueba — si < 3m, no hay indemnización
 *   - Tope art. 245: 3 veces el promedio de las remuneraciones del convenio colectivo
 *     Si no se informa tope convencional, se aplica sin tope (default conservador para el trabajador)
 *   - Preaviso (art. 232): durante período de prueba 15d, ≤ 5 años 1 mes, > 5 años 2 meses
 *   - SAC s/preaviso (art. 233): preaviso × 8.33% (1/12)
 *   - Multa art. 80: 3 sueldos si el empleador no entrega certificados de trabajo
 */

import { DISCLAIMER_LCT } from "./disclaimer";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type TipoDespido =
  | "sin_causa" // Despido directo sin causa (art. 245)
  | "indirecto" // El trabajador se considera despedido por incumplimiento del empleador
  | "periodo_prueba" // Dentro de los 3 meses de período de prueba
  | "con_causa"; // Despido con causa justificada — no genera art. 245

export interface InputDespido {
  /** Sueldo bruto mensual (mejor remuneración normal y habitual) */
  sueldoBruto: number;
  /** Años completos de antigüedad */
  antiguedadAnios: number;
  /** Meses adicionales de antigüedad (0-11) */
  antiguedadMeses: number;
  tipoDespido: TipoDespido;
  /** Si el preaviso fue otorgado (trabajó el período) — reduce la indemnización de preaviso */
  preavisoOtorgado?: boolean;
  /** Si debe calcularse la multa del art. 80 (falta de entrega de certificados) */
  aplicarMultaArt80?: boolean;
  /**
   * Tope del art. 245 = 3 × promedio remuneratorio del convenio colectivo.
   * Si no se informa, no se aplica tope (beneficia al trabajador en la estimación).
   */
  topeConvencional?: number;
}

export interface DesgloseDespido {
  /** Base de cálculo (sueldo vs tope) */
  baseCalculo: number;
  /** Si se aplicó el tope convencional */
  topeAplicado: boolean;
  /** Años computados para el art. 245 (incluye redondeo de meses) */
  aniosComputados: number;
  /** Indemnización art. 245 */
  art245: number;
  /** Preaviso (art. 232) */
  preaviso: number;
  /** SAC proporcional sobre preaviso (art. 233) */
  sacSobrePreaviso: number;
  /** Multa art. 80 (0 si no aplica) */
  multaArt80: number;
  /** Total general */
  total: number;
  /** Mensajes informativos por ítem */
  notas: string[];
}

export interface ResultadoDespido {
  desglose: DesgloseDespido;
  disclaimer: string;
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Calcula la indemnización por despido según la LCT argentina.
 *
 * @example
 * calcularDespido({
 *   sueldoBruto: 500000,
 *   antiguedadAnios: 5,
 *   antiguedadMeses: 0,
 *   tipoDespido: "sin_causa",
 * })
 * // → { desglose: { art245: 2500000, preaviso: 1000000, ... }, ... }
 */
export function calcularDespido(input: InputDespido): ResultadoDespido {
  const {
    sueldoBruto,
    antiguedadAnios,
    antiguedadMeses,
    tipoDespido,
    preavisoOtorgado = false,
    aplicarMultaArt80 = false,
    topeConvencional,
  } = input;

  if (sueldoBruto <= 0) {
    throw new Error("El sueldo bruto debe ser mayor a 0");
  }
  if (antiguedadAnios < 0 || antiguedadMeses < 0 || antiguedadMeses > 11) {
    throw new Error("Antigüedad inválida");
  }

  const notas: string[] = [];

  // ─── Caso: despido con causa → sin indemnización art. 245 ─────────────────
  if (tipoDespido === "con_causa") {
    return {
      desglose: {
        baseCalculo: sueldoBruto,
        topeAplicado: false,
        aniosComputados: 0,
        art245: 0,
        preaviso: 0,
        sacSobrePreaviso: 0,
        multaArt80: 0,
        total: 0,
        notas: [
          "Despido con causa justificada: no corresponde indemnización art. 245",
          "Si considerás que la causa fue injustificada, consultá con un abogado",
        ],
      },
      disclaimer: DISCLAIMER_LCT,
    };
  }

  // ─── Período de prueba: < 3 meses → sin indemnización ───────────────────
  if (tipoDespido === "periodo_prueba") {
    const totalMeses = antiguedadAnios * 12 + antiguedadMeses;
    if (totalMeses < 3) {
      notas.push("Dentro del período de prueba (< 3 meses): no corresponde indemnización art. 245");
      return {
        desglose: {
          baseCalculo: sueldoBruto,
          topeAplicado: false,
          aniosComputados: 0,
          art245: 0,
          preaviso: redondear(sueldoBruto * (15 / 30)), // 15 días en período de prueba
          sacSobrePreaviso: 0,
          multaArt80: 0,
          total: redondear(sueldoBruto * (15 / 30)),
          notas: ["Período de prueba: preaviso de 15 días (art. 232 LCT)"],
        },
        disclaimer: DISCLAIMER_LCT,
      };
    }
    // Si tiene ≥ 3 meses, igual corresponde art. 245
    notas.push("Antigüedad ≥ 3 meses: corresponde indemnización art. 245");
  }

  // ─── Cómputo de antigüedad (art. 245 in fine) ─────────────────────────────
  let aniosComputados = antiguedadAnios;
  if (antiguedadMeses >= 3) {
    aniosComputados += 1;
    notas.push(
      `Meses adicionales ≥ 3: se computan como 1 año completo (art. 245 in fine). Antigüedad final: ${aniosComputados} años`
    );
  } else if (antiguedadMeses > 0) {
    notas.push(`Meses adicionales = ${antiguedadMeses} (< 3): no se computan como año adicional`);
  }

  // Mínimo 1 año computado si hay antigüedad suficiente
  if (aniosComputados === 0) aniosComputados = 1;

  // ─── Base de cálculo y tope (art. 245) ────────────────────────────────────
  let baseCalculo = sueldoBruto;
  let topeAplicado = false;

  if (topeConvencional && topeConvencional > 0) {
    const topeArt245 = topeConvencional * 3;
    if (sueldoBruto > topeArt245) {
      baseCalculo = topeArt245;
      topeAplicado = true;
      notas.push(
        `Sueldo (${fmt(sueldoBruto)}) supera el tope art. 245 (${fmt(topeArt245)}). Se usa el tope.`
      );
    }
  } else {
    notas.push(
      "Sin tope convencional informado: cálculo sin tope (favorece al trabajador en la estimación)"
    );
  }

  // ─── Art. 245: indemnización por antigüedad ───────────────────────────────
  const art245 = redondear(baseCalculo * aniosComputados);
  notas.push(`Art. 245: ${fmt(baseCalculo)} × ${aniosComputados} años = ${fmt(art245)}`);

  // ─── Art. 232: preaviso ────────────────────────────────────────────────────
  let mesesPrioridad = 1;
  if (antiguedadAnios >= 5) {
    mesesPrioridad = 2;
    notas.push("Preaviso: 2 meses (antigüedad > 5 años, art. 232 LCT)");
  } else {
    notas.push("Preaviso: 1 mes (antigüedad ≤ 5 años, art. 232 LCT)");
  }

  let preaviso = 0;
  if (!preavisoOtorgado) {
    preaviso = redondear(sueldoBruto * mesesPrioridad);
    notas.push(`Preaviso no otorgado: indemnización sustitutiva = ${fmt(preaviso)}`);
  } else {
    notas.push("Preaviso otorgado: no corresponde indemnización sustitutiva");
  }

  // ─── Art. 233: SAC proporcional sobre preaviso ────────────────────────────
  const sacSobrePreaviso = preaviso > 0 ? redondear(preaviso / 12) : 0;
  if (sacSobrePreaviso > 0) {
    notas.push(`SAC s/preaviso (art. 233): ${fmt(preaviso)} / 12 = ${fmt(sacSobrePreaviso)}`);
  }

  // ─── Art. 80: multa por no entrega de certificados ────────────────────────
  let multaArt80 = 0;
  if (aplicarMultaArt80) {
    multaArt80 = redondear(sueldoBruto * 3);
    notas.push(`Multa art. 80 (no entrega de certificados): 3 sueldos = ${fmt(multaArt80)}`);
  }

  // ─── Total ────────────────────────────────────────────────────────────────
  const total = art245 + preaviso + sacSobrePreaviso + multaArt80;

  return {
    desglose: {
      baseCalculo,
      topeAplicado,
      aniosComputados,
      art245,
      preaviso,
      sacSobrePreaviso,
      multaArt80,
      total,
      notas,
    },
    disclaimer: DISCLAIMER_LCT,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

function fmt(n: number): string {
  return `$${n.toLocaleString("es-AR")}`;
}
