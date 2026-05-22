/**
 * Calculadora de indemnización por accidente de trabajo / enfermedad profesional.
 *
 * Marco legal:
 *   Ley 24.557  (Riesgos del Trabajo) — art. 14: incapacidad permanente parcial
 *   Ley 26.773  — art. 3: adicional 20% para accidentes in itinere y laborales
 *                         art. 17 inc. 6: actualización por RIPTE
 *
 * Fórmula (incapacidad permanente parcial ≥ 1%):
 *   VIB = 53 × IBM × % incapacidad × (65 / edad)
 *   Donde IBM = Ingreso Base Mensual (sueldo bruto)
 *
 *   Adicional Ley 26.773 art. 3 (si accidente laboral / in itinere):
 *   Adicional = VIB × 0.20
 *
 *   Total = VIB + Adicional
 *
 * Nota sobre RIPTE:
 *   La Ley 26.773 establece que los importes se actualizan por RIPTE
 *   (Remuneración Imponible Promedio de los Trabajadores Estables).
 *   El RIPTE se publica trimestralmente. Esta función NO aplica RIPTE
 *   automáticamente porque el valor varía constantemente.
 *   Se documenta cómo ajustarlo manualmente.
 *
 * Limitaciones calculadas:
 *   - Solo cubre incapacidad permanente parcial (art. 14 inc. 2)
 *   - No cubre incapacidad permanente total ni gran invalidez
 *   - No incluye prestaciones dinerarias periódicas (renta)
 */

import { DISCLAIMER_ART } from "./disclaimer";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type TipoAccidenteART =
  | "laboral" // Accidente ocurrido durante jornada de trabajo
  | "in_itinere" // Accidente en el trayecto casa-trabajo o trabajo-casa
  | "enfermedad"; // Enfermedad profesional — adicional 20% NO aplica automáticamente

export interface InputART {
  /** Sueldo bruto mensual (Ingreso Base Mensual — IBM) */
  sueldoBruto: number;
  /** Porcentaje de incapacidad laboral permanente (1-100) */
  porcentajeIncapacidad: number;
  /** Edad del trabajador al momento del accidente */
  edad: number;
  /** Tipo de accidente/siniestro */
  tipoAccidente: TipoAccidenteART;
  /**
   * Factor RIPTE para actualizar los valores.
   * Si no se informa, se usa 1.0 (sin actualización).
   * Para obtener el RIPTE actual: https://www.argentina.gob.ar/trabajo/riesgostrabajo/ripte
   */
  factorRipte?: number;
}

export interface DesgloseART {
  /** Ingreso Base Mensual (sueldo bruto informado) */
  ibm: number;
  /** Multiplicador de edad: 65 / edad */
  coeficienteEdad: number;
  /** VIB: 53 × IBM × % incapacidad × coeficiente edad */
  vib: number;
  /** Adicional 20% Ley 26.773 art. 3 (0 si no aplica) */
  adicionalLey26773: number;
  /** Factor RIPTE aplicado */
  factorRipte: number;
  /** Total final */
  total: number;
  /** Base legal aplicada */
  baseLegal: string;
  notas: string[];
}

export interface ResultadoART {
  desglose: DesgloseART;
  disclaimer: string;
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Calcula la indemnización por incapacidad permanente parcial (Ley 24.557 + 26.773).
 *
 * @example
 * calcularART({
 *   sueldoBruto: 600000,
 *   porcentajeIncapacidad: 30,
 *   edad: 45,
 *   tipoAccidente: "laboral",
 * })
 */
export function calcularART(input: InputART): ResultadoART {
  const { sueldoBruto, porcentajeIncapacidad, edad, tipoAccidente, factorRipte = 1.0 } = input;

  if (sueldoBruto <= 0) throw new Error("El sueldo bruto debe ser mayor a 0");
  if (porcentajeIncapacidad <= 0 || porcentajeIncapacidad > 100) {
    throw new Error("El porcentaje de incapacidad debe estar entre 1 y 100");
  }
  if (edad < 18 || edad > 65) {
    throw new Error("La edad debe estar entre 18 y 65 años");
  }

  const notas: string[] = [];

  // ─── Coeficiente edad ────────────────────────────────────────────────────
  const coeficienteEdad = 65 / edad;
  notas.push(`Coeficiente edad: 65 / ${edad} = ${coeficienteEdad.toFixed(4)}`);

  // ─── VIB (Valor Indemnizatorio Base) ─────────────────────────────────────
  // 53 × IBM × (% incapacidad / 100) × (65 / edad)
  const vibSinRipte = 53 * sueldoBruto * (porcentajeIncapacidad / 100) * coeficienteEdad;
  const vib = redondear(vibSinRipte * factorRipte);

  notas.push(
    `VIB: 53 × ${fmt(sueldoBruto)} × ${porcentajeIncapacidad}% × ${coeficienteEdad.toFixed(4)} = ${fmt(redondear(vibSinRipte))}`
  );

  if (factorRipte !== 1.0) {
    notas.push(`RIPTE aplicado (factor ${factorRipte}): VIB ajustado = ${fmt(vib)}`);
  } else {
    notas.push(
      "RIPTE: factor 1.0 (sin actualización). El valor real puede ser mayor según el índice vigente."
    );
  }

  // ─── Adicional Ley 26.773 art. 3 ─────────────────────────────────────────
  let adicionalLey26773 = 0;
  if (tipoAccidente === "laboral" || tipoAccidente === "in_itinere") {
    adicionalLey26773 = redondear(vib * 0.2);
    notas.push(
      `Adicional 20% Ley 26.773 art. 3 (${tipoAccidente === "laboral" ? "accidente laboral" : "accidente in itinere"}): ${fmt(adicionalLey26773)}`
    );
  } else {
    notas.push(
      "Enfermedad profesional: el adicional 20% Ley 26.773 art. 3 puede no aplicar — consultá con un especialista"
    );
  }

  const total = redondear(vib + adicionalLey26773);

  notas.push(`Total: ${fmt(vib)} + ${fmt(adicionalLey26773)} = ${fmt(total)}`);

  const baseLegal =
    tipoAccidente === "enfermedad"
      ? "Ley 24.557 art. 14 (incapacidad permanente parcial)"
      : "Ley 24.557 art. 14 + Ley 26.773 art. 3 (adicional 20%)";

  return {
    desglose: {
      ibm: sueldoBruto,
      coeficienteEdad: redondear(coeficienteEdad * 10000) / 10000,
      vib,
      adicionalLey26773,
      factorRipte,
      total,
      baseLegal,
      notas,
    },
    disclaimer: DISCLAIMER_ART,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

function fmt(n: number): string {
  return `$${n.toLocaleString("es-AR")}`;
}
