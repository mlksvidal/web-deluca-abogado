"use server";

/**
 * slots.ts — Server actions para obtener slots disponibles.
 *
 * getAvailableSlotsForDay: dado un string YYYY-MM-DD (fecha local Mendoza),
 * retorna los slots disponibles para ese día consultando la DB.
 *
 * getAvailableDates: retorna array de fechas YYYY-MM-DD con al menos 1 slot
 * disponible en los próximos 30 días (para pintar el calendario).
 */

import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { generateAvailableSlots, type Slot } from "@/lib/slots";
import { SCHEDULE_CONFIG, TIMEZONE } from "@/lib/schedule-config";
import { and, eq, gte, lte } from "drizzle-orm";
import { addDays } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Retorna los ISO strings UTC de los slots ya confirmados en el rango dado.
 */
async function getTakenSlotsInRange(fromUtc: Date, toUtc: Date): Promise<string[]> {
  const rows = await db
    .select({ slotStartUtc: bookings.slotStartUtc })
    .from(bookings)
    .where(
      and(
        eq(bookings.status, "confirmed"),
        gte(bookings.slotStartUtc, fromUtc),
        lte(bookings.slotStartUtc, toUtc)
      )
    );

  return rows.map((r) => r.slotStartUtc.toISOString());
}

// ─── getAvailableSlotsForDay ──────────────────────────────────────────────────

export type SlotsResult = { success: true; slots: Slot[] } | { success: false; error: string };

/**
 * Retorna los slots disponibles para un día específico (YYYY-MM-DD en TZ Mendoza).
 */
export async function getAvailableSlotsForDay(dateLocalStr: string): Promise<SlotsResult> {
  // Validar formato básico
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateLocalStr)) {
    return { success: false, error: "Fecha inválida" };
  }

  try {
    // Construir inicio y fin del día en TZ local → convertir a UTC
    const [year, month, day] = dateLocalStr.split("-").map(Number);
    const dayStartLocal = new Date(year, month - 1, day, 0, 0, 0);
    const dayEndLocal = new Date(year, month - 1, day, 23, 59, 59);

    const fromUtc = fromZonedTime(dayStartLocal, TIMEZONE);
    const toUtc = fromZonedTime(dayEndLocal, TIMEZONE);

    // Obtener slots ya tomados en ese día
    const takenUtc = await getTakenSlotsInRange(fromUtc, toUtc);

    // Generar todos los slots disponibles para ese día
    const slots = generateAvailableSlots(fromUtc, toUtc, takenUtc);

    return { success: true, slots };
  } catch {
    return { success: false, error: "No se pudo obtener los horarios. Intentá de nuevo." };
  }
}

// ─── getAvailableDates ────────────────────────────────────────────────────────

export type DatesResult =
  | { success: true; availableDates: string[] }
  | { success: false; error: string };

/**
 * Retorna array de fechas YYYY-MM-DD (TZ Mendoza) con al menos 1 slot disponible
 * en los próximos maxWindowDays días.
 */
export async function getAvailableDates(): Promise<DatesResult> {
  try {
    const now = new Date();
    const to = addDays(now, SCHEDULE_CONFIG.maxWindowDays);

    // Obtener todos los slots tomados en la ventana completa
    const takenUtc = await getTakenSlotsInRange(now, to);

    // Generar todos los slots disponibles en la ventana
    const allSlots = generateAvailableSlots(now, to, takenUtc);

    // Extraer fechas únicas
    const uniqueDates = Array.from(new Set(allSlots.map((s) => s.dateLocal))).sort();

    return { success: true, availableDates: uniqueDates };
  } catch {
    return { success: false, error: "No se pudo obtener el calendario. Intentá de nuevo." };
  }
}
