/**
 * Tests para el módulo de Google Calendar (T4).
 *
 * Cobertura:
 *   - Dev fallback: sin credenciales, retorna mock eventId
 *   - cancelBookingEvent: ignora cancelaciones de eventos mock
 *   - listBookedSlots: sin creds retorna array vacío
 *   - getCalendarClient: retorna null sin env vars
 */

import { describe, it, expect, beforeEach } from "vitest";

// Limpiar env vars de GCal antes de cada test
beforeEach(() => {
  delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  delete process.env.GOOGLE_CALENDAR_ID;
});

describe("getCalendarClient — sin credenciales", () => {
  it("retorna null cuando no hay env vars configuradas", async () => {
    // Reset módulo para que recree el singleton
    const { getCalendarClient, resetCalendarClient } = await import("../lib/calendar/client");
    resetCalendarClient();
    const client = getCalendarClient();
    expect(client).toBeNull();
  });
});

describe("createBookingEvent — dev fallback", () => {
  it("retorna un eventId con prefijo dev-mock- cuando no hay credenciales", async () => {
    const { resetCalendarClient } = await import("../lib/calendar/client");
    resetCalendarClient();

    const { createBookingEvent } = await import("../lib/calendar/events");

    const result = await createBookingEvent(
      {
        startUtc: new Date("2026-06-10T13:00:00Z"),
        endUtc: new Date("2026-06-10T13:45:00Z"),
      },
      {
        name: "Juan Pérez",
        email: "juan@example.com",
        phone: "2604123456",
        legalArea: "laboral",
        description: "Consulta por despido",
        bookingId: "test-booking-id-123",
      }
    );

    expect(result.eventId).toMatch(/^dev-mock-/);
  });
});

describe("cancelBookingEvent — dev fallback", () => {
  it("no lanza errores al cancelar un evento mock", async () => {
    const { resetCalendarClient } = await import("../lib/calendar/client");
    resetCalendarClient();

    const { cancelBookingEvent } = await import("../lib/calendar/events");

    // No debe lanzar error
    await expect(cancelBookingEvent("dev-mock-1234567890-abc")).resolves.toBeUndefined();
  });
});

describe("listBookedSlots — dev fallback", () => {
  it("retorna array vacío cuando no hay credenciales", async () => {
    const { resetCalendarClient } = await import("../lib/calendar/client");
    resetCalendarClient();

    const { listBookedSlots } = await import("../lib/calendar/events");

    const slots = await listBookedSlots(
      new Date("2026-06-01T00:00:00Z"),
      new Date("2026-06-30T23:59:59Z")
    );

    expect(slots).toEqual([]);
  });
});

describe("getCalendarClient — credenciales inválidas", () => {
  it("lanza CalendarAuthError si GOOGLE_SERVICE_ACCOUNT_KEY no es JSON válido en base64", async () => {
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "test@project.iam.gserviceaccount.com";
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = Buffer.from("not-valid-json").toString("base64");
    process.env.GOOGLE_CALENDAR_ID = "test@group.calendar.google.com";

    const { getCalendarClient, resetCalendarClient, CalendarAuthError } =
      await import("../lib/calendar/client");
    resetCalendarClient();

    expect(() => getCalendarClient()).toThrow(CalendarAuthError);
  });
});
