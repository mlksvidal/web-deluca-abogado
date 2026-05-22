/**
 * slots.ts — Generación de slots disponibles con timezone Mendoza.
 * Zona: America/Argentina/Mendoza (UTC-3, sin DST).
 */

import { addMinutes, parseISO, isAfter, isBefore, addHours, startOfDay, getDay } from "date-fns";
import { fromZonedTime, toZonedTime, formatInTimeZone } from "date-fns-tz";
import { SCHEDULE_CONFIG, TIMEZONE } from "./schedule-config";
import { isFeriadoAR } from "./holidays-ar";

export interface Slot {
  /** ISO string en UTC */
  startUtc: string;
  /** ISO string en UTC */
  endUtc: string;
  /** Hora local Mendoza, ej: "09:00" */
  startLocal: string;
  /** Fecha local Mendoza, ej: "2026-06-15" */
  dateLocal: string;
  /** Label para mostrar al usuario */
  label: string;
}

/**
 * Genera todos los slots disponibles en el rango [from, to],
 * excluyendo los que ya están tomados.
 *
 * @param from - Fecha inicio del rango (Date, UTC)
 * @param to - Fecha fin del rango (Date, UTC)
 * @param takenUtc - Array de ISO strings UTC de slots ya reservados (slot_start_utc)
 * @returns Array de slots disponibles ordenados cronológicamente
 */
export function generateAvailableSlots(from: Date, to: Date, takenUtc: string[]): Slot[] {
  const slots: Slot[] = [];
  const takenSet = new Set(takenUtc.map((t) => new Date(t).toISOString()));

  // Anticipación mínima: ahora + minAdvanceHours
  const minStart = addHours(new Date(), SCHEDULE_CONFIG.minAdvanceHours);

  // Iterar día a día desde `from` hasta `to`
  let currentDay = startOfDay(toZonedTime(from, TIMEZONE));
  const endDay = startOfDay(toZonedTime(to, TIMEZONE));

  while (!isAfter(currentDay, endDay)) {
    const dayOfWeek = getDay(currentDay);
    const dateStr = formatInTimeZone(currentDay, TIMEZONE, "yyyy-MM-dd");

    // Saltar fines de semana y feriados
    if ((SCHEDULE_CONFIG.workDays as number[]).includes(dayOfWeek) && !isFeriadoAR(dateStr)) {
      // Iterar franjas horarias del día
      for (const range of SCHEDULE_CONFIG.timeSlots) {
        let slotStart = fromZonedTime(
          new Date(
            currentDay.getFullYear(),
            currentDay.getMonth(),
            currentDay.getDate(),
            range.startHour,
            range.startMin,
            0
          ),
          TIMEZONE
        );

        const rangeEnd = fromZonedTime(
          new Date(
            currentDay.getFullYear(),
            currentDay.getMonth(),
            currentDay.getDate(),
            range.endHour,
            range.endMin,
            0
          ),
          TIMEZONE
        );

        // Generar slots de slotDurationMin minutos
        while (isBefore(slotStart, rangeEnd)) {
          const slotEnd = addMinutes(slotStart, SCHEDULE_CONFIG.slotDurationMin);

          // El slot completo debe caber dentro del rango
          if (!isAfter(slotEnd, rangeEnd)) {
            const startIso = slotStart.toISOString();
            const isTaken = takenSet.has(startIso);
            const isPast = isBefore(slotStart, minStart);

            if (!isTaken && !isPast) {
              const startLocal = formatInTimeZone(slotStart, TIMEZONE, "HH:mm");
              const dateLocal = formatInTimeZone(slotStart, TIMEZONE, "yyyy-MM-dd");

              slots.push({
                startUtc: startIso,
                endUtc: slotEnd.toISOString(),
                startLocal,
                dateLocal,
                label: startLocal,
              });
            }
          }

          slotStart = addMinutes(slotStart, SCHEDULE_CONFIG.slotDurationMin);
        }
      }
    }

    // Avanzar al siguiente día (en zona local)
    const nextDayLocal = toZonedTime(currentDay, TIMEZONE);
    nextDayLocal.setDate(nextDayLocal.getDate() + 1);
    currentDay = startOfDay(nextDayLocal);
  }

  return slots;
}

/**
 * Formatea una fecha UTC para mostrarla al usuario en zona Mendoza.
 * Ej: "Lunes 15 de junio, 09:00 hs"
 */
export function formatSlotForDisplay(utcIso: string): string {
  return formatInTimeZone(parseISO(utcIso), TIMEZONE, "EEEE d 'de' MMMM, HH:mm 'hs'");
}

// Re-export para conveniencia
export { TIMEZONE };
