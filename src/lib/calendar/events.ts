/**
 * Operaciones de Google Calendar para el sistema de turnos.
 *
 * Manejo de errores:
 *   - 401 (credenciales inválidas): log de error estructurado + throw CalendarAuthError
 *   - 409 (conflicto): retry una sola vez con slot +5 minutos
 *   - Sin credenciales: dev fallback con eventId mock
 */

import { calendar as gcalendar } from "@googleapis/calendar";
import { getCalendarClient, CalendarAuthError } from "./client";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface BookingSlot {
  startUtc: Date;
  endUtc: Date;
}

export interface ClientData {
  name: string;
  email: string;
  phone: string;
  legalArea: string;
  description: string;
  bookingId: string;
}

export interface CalendarEvent {
  eventId: string;
  htmlLink?: string;
}

export interface CalendarEventUpdate {
  startUtc?: Date;
  endUtc?: Date;
  summary?: string;
  description?: string;
}

// ─── Logger estructurado mínimo ───────────────────────────────────────────────

function logError(context: Record<string, unknown>, msg: string) {
  console.error(JSON.stringify({ level: "error", msg, ...context }));
}

function logInfo(context: Record<string, unknown>, msg: string) {
  console.log(JSON.stringify({ level: "info", msg, ...context }));
}

// ─── Dev mock ID ──────────────────────────────────────────────────────────────

function generateMockEventId(): string {
  return `dev-mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Área legal → label legible ───────────────────────────────────────────────

function areaLabel(area: string): string {
  const map: Record<string, string> = {
    civil_familia: "Civil y Familia",
    laboral: "Laboral",
    penal: "Penal",
    comercial: "Comercial",
    general: "Consulta General",
  };
  return map[area] ?? area;
}

// ─── createBookingEvent ───────────────────────────────────────────────────────

/**
 * Crea un evento en Google Calendar para el turno.
 * En dev (sin creds) devuelve un eventId mock.
 *
 * @throws CalendarAuthError si las credenciales son inválidas (401)
 * @throws Error si hay un error inesperado tras retry
 */
export async function createBookingEvent(
  slot: BookingSlot,
  client: ClientData
): Promise<CalendarEvent> {
  const calClient = getCalendarClient();

  if (!calClient) {
    const mockId = generateMockEventId();
    logInfo(
      { bookingId: client.bookingId, mockEventId: mockId, mode: "dev-fallback" },
      "[calendar] Dev fallback — sin credenciales GCal, evento simulado"
    );
    return { eventId: mockId };
  }

  // Narrow the type so inner functions can access it without null check
  const resolvedClient = calClient;
  const calendar = gcalendar({ version: "v3", auth: resolvedClient.auth });

  const event = {
    summary: `Consulta: ${client.name} (${areaLabel(client.legalArea)})`,
    description: [
      `Cliente: ${client.name}`,
      `Email: ${client.email}`,
      `Teléfono: ${client.phone}`,
      `Área: ${areaLabel(client.legalArea)}`,
      ``,
      `Descripción:`,
      client.description,
      ``,
      `ID reserva: ${client.bookingId}`,
    ].join("\n"),
    start: {
      dateTime: slot.startUtc.toISOString(),
      timeZone: "America/Argentina/Mendoza",
    },
    end: {
      dateTime: slot.endUtc.toISOString(),
      timeZone: "America/Argentina/Mendoza",
    },
    attendees: [{ email: client.email, displayName: client.name }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 60 * 24 }, // 24h antes
        { method: "popup", minutes: 30 },
      ],
    },
  };

  async function attemptCreate(slotForAttempt: BookingSlot): Promise<CalendarEvent> {
    try {
      const adjustedEvent = {
        ...event,
        start: {
          dateTime: slotForAttempt.startUtc.toISOString(),
          timeZone: "America/Argentina/Mendoza",
        },
        end: {
          dateTime: slotForAttempt.endUtc.toISOString(),
          timeZone: "America/Argentina/Mendoza",
        },
      };

      const response = await calendar.events.insert({
        calendarId: resolvedClient.calendarId,
        requestBody: adjustedEvent,
        sendUpdates: "all",
      });

      const eventId = response.data.id;
      const htmlLink = response.data.htmlLink ?? undefined;

      if (!eventId) {
        throw new Error("GCal no devolvió eventId");
      }

      logInfo({ eventId, bookingId: client.bookingId }, "[calendar] Evento creado correctamente");

      return { eventId, htmlLink };
    } catch (err: unknown) {
      const errAny = err as { code?: number; message?: string };
      const code = errAny?.code;

      if (code === 401) {
        logError(
          { bookingId: client.bookingId, code },
          "[calendar] CRÍTICO: credenciales inválidas (401) — verificar Service Account"
        );
        throw new CalendarAuthError(
          "Google Calendar: credenciales de Service Account inválidas o expiradas"
        );
      }

      throw err;
    }
  }

  try {
    return await attemptCreate(slot);
  } catch (err: unknown) {
    const errAny = err as { code?: number; message?: string };
    // 409 = conflicto (slot ocupado en GCal) → retry con slot +5min
    if (errAny?.code === 409) {
      logInfo(
        { bookingId: client.bookingId, originalStart: slot.startUtc.toISOString() },
        "[calendar] Conflicto 409 — retry con slot +5min"
      );
      const retrySlot: BookingSlot = {
        startUtc: new Date(slot.startUtc.getTime() + 5 * 60 * 1000),
        endUtc: new Date(slot.endUtc.getTime() + 5 * 60 * 1000),
      };
      return await attemptCreate(retrySlot);
    }

    logError(
      {
        bookingId: client.bookingId,
        err: errAny?.message ?? String(err),
        code: errAny?.code,
      },
      "[calendar] Error al crear evento en GCal"
    );
    throw err;
  }
}

// ─── cancelBookingEvent ───────────────────────────────────────────────────────

/**
 * Cancela (elimina) un evento de Google Calendar por su eventId.
 * En dev (sin creds) solo logea.
 */
export async function cancelBookingEvent(eventId: string): Promise<void> {
  const calClient = getCalendarClient();

  if (!calClient || eventId.startsWith("dev-mock-")) {
    logInfo({ eventId, mode: "dev-fallback" }, "[calendar] Dev fallback — cancelación simulada");
    return;
  }

  const calendar = gcalendar({ version: "v3", auth: calClient.auth });

  try {
    await calendar.events.delete({
      calendarId: calClient.calendarId,
      eventId,
      sendUpdates: "all",
    });

    logInfo({ eventId }, "[calendar] Evento cancelado correctamente");
  } catch (err: unknown) {
    const errAny = err as { code?: number; message?: string };

    if (errAny?.code === 401) {
      logError(
        { eventId, code: 401 },
        "[calendar] CRÍTICO: credenciales inválidas al cancelar evento"
      );
      throw new CalendarAuthError("Google Calendar: credenciales inválidas al cancelar evento");
    }

    // 404 → el evento ya fue eliminado — no es un error crítico
    if (errAny?.code === 404) {
      logInfo({ eventId }, "[calendar] Evento ya no existe en GCal (404) — ignorado");
      return;
    }

    logError(
      { eventId, err: errAny?.message ?? String(err) },
      "[calendar] Error al cancelar evento"
    );
    throw err;
  }
}

// ─── updateEvent ─────────────────────────────────────────────────────────────

/**
 * Actualiza un evento existente (reprogramación, cambio de descripción).
 */
export async function updateBookingEvent(
  eventId: string,
  changes: CalendarEventUpdate
): Promise<void> {
  const calClient = getCalendarClient();

  if (!calClient || eventId.startsWith("dev-mock-")) {
    logInfo(
      { eventId, changes, mode: "dev-fallback" },
      "[calendar] Dev fallback — actualización simulada"
    );
    return;
  }

  const calendar = gcalendar({ version: "v3", auth: calClient.auth });

  const patchBody: Record<string, unknown> = {};

  if (changes.summary) patchBody.summary = changes.summary;
  if (changes.description) patchBody.description = changes.description;
  if (changes.startUtc) {
    patchBody.start = {
      dateTime: changes.startUtc.toISOString(),
      timeZone: "America/Argentina/Mendoza",
    };
  }
  if (changes.endUtc) {
    patchBody.end = {
      dateTime: changes.endUtc.toISOString(),
      timeZone: "America/Argentina/Mendoza",
    };
  }

  try {
    await calendar.events.patch({
      calendarId: calClient.calendarId,
      eventId,
      requestBody: patchBody,
      sendUpdates: "all",
    });

    logInfo({ eventId }, "[calendar] Evento actualizado correctamente");
  } catch (err: unknown) {
    const errAny = err as { code?: number; message?: string };

    if (errAny?.code === 401) {
      throw new CalendarAuthError("Google Calendar: credenciales inválidas al actualizar evento");
    }

    logError(
      { eventId, err: errAny?.message ?? String(err) },
      "[calendar] Error al actualizar evento"
    );
    throw err;
  }
}

// ─── listBookedSlots ──────────────────────────────────────────────────────────

/**
 * Lista los slots ocupados en GCal dentro de un rango de fechas.
 * Útil para hacer merge con los slots disponibles de la DB.
 */
export async function listBookedSlots(
  from: Date,
  to: Date
): Promise<Array<{ start: Date; end: Date; eventId: string }>> {
  const calClient = getCalendarClient();

  if (!calClient) {
    logInfo(
      { from: from.toISOString(), to: to.toISOString(), mode: "dev-fallback" },
      "[calendar] Dev fallback — listBookedSlots retorna array vacío"
    );
    return [];
  }

  const calendar = gcalendar({ version: "v3", auth: calClient.auth });

  try {
    const response = await calendar.events.list({
      calendarId: calClient.calendarId,
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 100,
    });

    const items = response.data.items ?? [];

    return items
      .filter((item) => item.start?.dateTime && item.end?.dateTime && item.id)
      .map((item) => ({
        start: new Date(item.start!.dateTime!),
        end: new Date(item.end!.dateTime!),
        eventId: item.id!,
      }));
  } catch (err: unknown) {
    const errAny = err as { code?: number; message?: string };

    if (errAny?.code === 401) {
      logError({ code: 401 }, "[calendar] CRÍTICO: credenciales inválidas al listar eventos");
      return []; // No bloquear la UI — devolver vacío con el error logueado
    }

    logError({ err: errAny?.message ?? String(err) }, "[calendar] Error al listar eventos de GCal");
    return [];
  }
}
