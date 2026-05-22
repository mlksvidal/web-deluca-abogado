/**
 * Estimador de cuota alimentaria — criterio jurisprudencial argentino.
 *
 * IMPORTANTE: Esta función entrega una estimación ORIENTATIVA.
 * El juez fija la cuota según las circunstancias concretas del caso.
 *
 * Criterios aplicados (jurisprudencia Argentina):
 *   - 1 hijo adulto:     20% del sueldo bruto
 *   - 1 hijo < 6 años:   25% (mayor dedicación y gastos)
 *   - 2 hijos:           30%
 *   - 2 hijos, alguno < 6: 35%
 *   - 3+ hijos:          40%
 *   - 3+ hijos, alguno < 6: 45%
 *   - Capado en 50% si hay múltiples obligaciones alimentarias
 *
 * Referencia: criterios sistematizados de cámaras de familia de Buenos Aires,
 * Mendoza y Córdoba. Los porcentajes varían por jurisdicción.
 */

import { DISCLAIMER_ALIMENTOS } from "./disclaimer";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface InputCuotaAlimentaria {
  /** Sueldo bruto mensual del obligado alimentario */
  sueldoBrutoObligado: number;
  /** Cantidad de hijos a alimentar */
  nHijos: number;
  /** Edades de cada hijo (en años). Ej: [3, 7, 14] */
  edades: number[];
  /** Si tiene otras obligaciones alimentarias activas (ej: hijos de otra relación) */
  tieneOtrasObligaciones?: boolean;
}

export interface ResultadoCuotaAlimentaria {
  porcentajeEstimado: number;
  montoMensual: number;
  rangoMin: number;
  rangoMax: number;
  notas: string[];
  disclaimer: string;
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Estima la cuota alimentaria mensual según criterio jurisprudencial argentino.
 *
 * @example
 * calcularCuotaAlimentaria({
 *   sueldoBrutoObligado: 400000,
 *   nHijos: 2,
 *   edades: [4, 10],
 * })
 * // → { porcentajeEstimado: 35, montoMensual: 140000, ... }
 */
export function calcularCuotaAlimentaria(input: InputCuotaAlimentaria): ResultadoCuotaAlimentaria {
  const { sueldoBrutoObligado, nHijos, edades, tieneOtrasObligaciones = false } = input;

  if (sueldoBrutoObligado <= 0) {
    throw new Error("El sueldo bruto del obligado debe ser mayor a 0");
  }
  if (nHijos <= 0) {
    throw new Error("La cantidad de hijos debe ser mayor a 0");
  }
  if (edades.length !== nHijos) {
    throw new Error("La cantidad de edades debe coincidir con nHijos");
  }

  const notas: string[] = [];
  const tieneHijoMenorDe6 = edades.some((edad) => edad < 6);

  // ─── Porcentaje base según cantidad de hijos ─────────────────────────────
  let porcentajeBase: number;
  let rangoMin: number;
  let rangoMax: number;

  if (nHijos === 1) {
    if (tieneHijoMenorDe6) {
      porcentajeBase = 25;
      rangoMin = 20;
      rangoMax = 30;
      notas.push("1 hijo menor de 6 años: rango orientativo 20-30% (gastos de crianza elevados)");
    } else {
      porcentajeBase = 20;
      rangoMin = 15;
      rangoMax = 25;
      notas.push("1 hijo: rango orientativo 15-25%");
    }
  } else if (nHijos === 2) {
    if (tieneHijoMenorDe6) {
      porcentajeBase = 35;
      rangoMin = 30;
      rangoMax = 40;
      notas.push("2 hijos (alguno menor de 6 años): rango orientativo 30-40%");
    } else {
      porcentajeBase = 30;
      rangoMin = 25;
      rangoMax = 35;
      notas.push("2 hijos: rango orientativo 25-35%");
    }
  } else {
    // 3 o más hijos
    if (tieneHijoMenorDe6) {
      porcentajeBase = 45;
      rangoMin = 40;
      rangoMax = 50;
      notas.push("3+ hijos (alguno menor de 6 años): rango orientativo 40-50%");
    } else {
      porcentajeBase = 40;
      rangoMin = 35;
      rangoMax = 50;
      notas.push("3+ hijos: rango orientativo 35-50%");
    }
  }

  // ─── Reducción por otras obligaciones alimentarias ────────────────────────
  let porcentajeAjustado = porcentajeBase;
  if (tieneOtrasObligaciones) {
    porcentajeAjustado = Math.min(porcentajeBase, 25);
    rangoMin = Math.max(10, rangoMin - 10);
    rangoMax = Math.min(50, rangoMax);
    notas.push(
      `Otras obligaciones alimentarias activas: porcentaje estimado reducido a ${porcentajeAjustado}% (tope jurisprudencial 50% total entre todas las obligaciones)`
    );
  }

  // Tope absoluto: 50% del sueldo (criterio de subsistencia del obligado)
  if (porcentajeAjustado > 50) {
    porcentajeAjustado = 50;
    notas.push("Aplicado tope del 50% del sueldo bruto (criterio de subsistencia del obligado)");
  }

  const montoMensual = redondear(sueldoBrutoObligado * (porcentajeAjustado / 100));
  const montoRangoMin = redondear(sueldoBrutoObligado * (rangoMin / 100));
  const montoRangoMax = redondear(sueldoBrutoObligado * (rangoMax / 100));

  notas.push(
    `Estimación: ${porcentajeAjustado}% de ${fmt(sueldoBrutoObligado)} = ${fmt(montoMensual)}/mes`
  );
  notas.push(`Rango orientativo: ${fmt(montoRangoMin)} – ${fmt(montoRangoMax)}/mes`);
  notas.push(
    "IMPORTANTE: el juez puede fijar un monto fuera de este rango según las circunstancias del caso."
  );

  return {
    porcentajeEstimado: porcentajeAjustado,
    montoMensual,
    rangoMin: montoRangoMin,
    rangoMax: montoRangoMax,
    notas,
    disclaimer: DISCLAIMER_ALIMENTOS,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

function fmt(n: number): string {
  return `$${n.toLocaleString("es-AR")}`;
}
