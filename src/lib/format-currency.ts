/**
 * Utilidades de formato de moneda para Argentina (ARS).
 * Formato: $ 1.234.567,89
 */

/**
 * Formatea un número como moneda ARS.
 * Ej: 1234567.89 → "$ 1.234.567,89"
 */
export function formatARS(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formatea un número como porcentaje.
 * Ej: 25 → "25%"
 */
export function formatPct(value: number): string {
  return `${value}%`;
}
