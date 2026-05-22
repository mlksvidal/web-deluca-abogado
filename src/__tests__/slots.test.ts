import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateAvailableSlots } from "@/lib/slots";
import { fromZonedTime } from "date-fns-tz";

const TZ = "America/Argentina/Mendoza";

/**
 * Helper: crea una fecha UTC a partir de una fecha/hora local en Mendoza.
 */
function localToUtc(year: number, month: number, day: number, hour = 0, min = 0): Date {
  return fromZonedTime(new Date(year, month - 1, day, hour, min, 0), TZ);
}

describe("generateAvailableSlots", () => {
  beforeEach(() => {
    // Fijar "ahora" a un momento anterior al rango para evitar que la
    // anticipación de 24h descarte los slots en todos los tests
    vi.useFakeTimers();
    // Simular que "ahora" es el 2026-06-08 a las 00:00 Mendoza
    vi.setSystemTime(localToUtc(2026, 6, 8, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retorna slots en una semana laboral sin feriados", () => {
    // Semana del 22-26/6/2026 — sin feriados
    const from = localToUtc(2026, 6, 22, 0, 0); // lunes 22/6
    const to = localToUtc(2026, 6, 26, 23, 59); // viernes 26/6
    const slots = generateAvailableSlots(from, to, []);

    // L-V: 5 días laborables sin feriados
    // Mañana: 09:00, 09:45, 10:30, 11:15, 12:00 → 5 slots (12:45 no cabe antes de 13:00)
    // Tarde: 16:00, 16:45, 17:30, 18:15, 19:00 → 5 slots (19:45 no cabe antes de 20:00)
    // 5 días × 10 slots = 50
    expect(slots.length).toBe(50);
    expect(slots[0].startLocal).toBe("09:00");
    expect(slots[0].dateLocal).toBe("2026-06-22");
  });

  it("excluye sábados y domingos", () => {
    const from = localToUtc(2026, 6, 13, 0, 0); // sábado 13/6
    const to = localToUtc(2026, 6, 14, 23, 59); // domingo 14/6
    const slots = generateAvailableSlots(from, to, []);
    expect(slots.length).toBe(0);
  });

  it("excluye feriado nacional (15 de junio — Día de Güemes)", () => {
    const from = localToUtc(2026, 6, 15, 0, 0); // lunes feriado
    const to = localToUtc(2026, 6, 15, 23, 59);
    const slots = generateAvailableSlots(from, to, []);
    expect(slots.length).toBe(0);
  });

  it("excluye slots ya tomados", () => {
    const from = localToUtc(2026, 6, 22, 0, 0); // lunes 22/6 (no feriado)
    const to = localToUtc(2026, 6, 22, 23, 59);

    // Tomar el primer slot (09:00 Mendoza)
    const firstSlotUtc = localToUtc(2026, 6, 22, 9, 0).toISOString();
    const slots = generateAvailableSlots(from, to, [firstSlotUtc]);

    // 10 slots totales menos 1 tomado = 9
    expect(slots.length).toBe(9);
    expect(slots[0].startLocal).toBe("09:45");
  });

  it("excluye slots dentro de la anticipación mínima de 24h", () => {
    // Ahora: 2026-06-08 00:00 Mendoza → mínimo reservable: 2026-06-09 00:00
    const from = localToUtc(2026, 6, 8, 0, 0); // hoy
    const to = localToUtc(2026, 6, 9, 12, 0); // mañana mediodía

    const slots = generateAvailableSlots(from, to, []);
    // Los slots del 2026-06-08 deben quedar excluidos
    // Los del 09/6 antes de las 00:00 quedan excluidos también
    // El día 08/6 no tiene slots (anticipación)
    // El día 09/6: los slots de 09:00 (que caen después de 00:00+24h=00:00 del 09/6) sí deben aparecer
    // Anticipación: ahora=08/6 00:00 → minStart = 09/6 00:00
    // 09:00 del 09/6 > 00:00 del 09/6 → disponibles
    expect(slots.length).toBeGreaterThan(0);
    const firstDate = slots[0].dateLocal;
    expect(firstDate).toBe("2026-06-09");
  });

  it("retorna array vacío si el rango es un solo día no laboral", () => {
    const from = localToUtc(2026, 5, 25, 0, 0); // 25 mayo — feriado (Revolución de Mayo)
    const to = localToUtc(2026, 5, 25, 23, 59);
    const slots = generateAvailableSlots(from, to, []);
    expect(slots.length).toBe(0);
  });

  it("verifica que startUtc y endUtc son strings ISO válidos", () => {
    const from = localToUtc(2026, 6, 22, 0, 0);
    const to = localToUtc(2026, 6, 22, 23, 59);
    const slots = generateAvailableSlots(from, to, []);

    for (const slot of slots) {
      expect(() => new Date(slot.startUtc)).not.toThrow();
      expect(() => new Date(slot.endUtc)).not.toThrow();
      // Duración de 45 minutos
      const diff = new Date(slot.endUtc).getTime() - new Date(slot.startUtc).getTime();
      expect(diff).toBe(45 * 60 * 1000);
    }
  });
});
