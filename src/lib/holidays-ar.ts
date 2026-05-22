/**
 * holidays-ar.ts — Feriados nacionales Argentina 2026.
 * Fuente: Decreto del PEN + Ley 27.399 (feriados puente).
 * Las fechas son en zona America/Argentina/Mendoza (UTC-3).
 * Formato: YYYY-MM-DD
 */

export const FERIADOS_AR_2026: Set<string> = new Set([
  // Enero
  "2026-01-01", // Año Nuevo

  // Febrero
  "2026-02-16", // Carnaval (lunes)
  "2026-02-17", // Carnaval (martes)

  // Marzo
  "2026-03-24", // Día Nacional de la Memoria por la Verdad y la Justicia

  // Abril
  "2026-04-02", // Día del Veterano y de los Caídos en la Guerra de Malvinas
  "2026-04-03", // Viernes Santo
  "2026-04-04", // Sábado Santo (opcional/religioso)

  // Mayo
  "2026-05-01", // Día del Trabajador
  "2026-05-25", // Día de la Revolución de Mayo

  // Junio
  "2026-06-15", // Paso a la Inmortalidad del Gral. Martín Miguel de Güemes
  "2026-06-20", // Paso a la Inmortalidad del Gral. Manuel Belgrano

  // Julio
  "2026-07-09", // Día de la Independencia

  // Agosto
  "2026-08-17", // Paso a la Inmortalidad del Gral. José de San Martín

  // Octubre
  "2026-10-12", // Día del Respeto a la Diversidad Cultural

  // Noviembre
  "2026-11-20", // Día de la Soberanía Nacional

  // Diciembre
  "2026-12-08", // Inmaculada Concepción de María
  "2026-12-25", // Navidad
]);

/**
 * Verifica si una fecha (YYYY-MM-DD) es feriado en Argentina.
 */
export function isFeriadoAR(dateStr: string): boolean {
  return FERIADOS_AR_2026.has(dateStr);
}
