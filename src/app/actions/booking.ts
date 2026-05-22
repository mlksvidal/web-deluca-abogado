"use server";

/**
 * Server Actions de booking — T7
 *
 * Flujo createBooking:
 *   1. Rate limit (Upstash bookingLimiter 3/h + bookingDailyLimiter 10/día)
 *   2. Origin check (CSRF mitigation)
 *   3. Validación Zod
 *   4. Sanitización descripción
 *   5. Honeypot
 *   6. Transacción Postgres (SELECT FOR UPDATE → INSERT ON CONFLICT)
 *   7. Google Calendar (catch, log, NO rollback)
 *   8. Emails async (Resend)
 *   9. Return { success, bookingId, slotConfirmed }
 */

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { bookingLimiter, bookingDailyLimiter, getClientIpFromHeaders } from "@/lib/ratelimit/index";
import {
  sendBookingConfirmationToClient,
  sendBookingNotificationToDoctor,
  sendBookingCancellationToClient,
  sendBookingCancellationToDoctor,
} from "@/lib/email/send";
import { createBookingEvent, cancelBookingEvent } from "@/lib/calendar/events";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { z } from "zod";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

// ─── Logger estructurado ──────────────────────────────────────────────────────

function log(level: "info" | "warn" | "error", context: Record<string, unknown>, msg: string) {
  // No loguear email completo ni descripción completa del cliente
  const { email, descripcion, ...safeContext } = context as Record<string, unknown> & {
    email?: string;
    descripcion?: string;
  };
  const redacted: Record<string, unknown> = { ...safeContext };
  if (email) redacted.email_domain = (email as string).split("@")[1] ?? "[redacted]";
  if (descripcion) redacted.descripcion_len = (descripcion as string).length;

  console[level === "info" ? "log" : level](
    JSON.stringify({ level, msg, ts: new Date().toISOString(), ...redacted })
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sanitizeText(input: string): string {
  // Eliminar tags HTML y escapar entidades
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

function formatSlotAR(date: Date): string {
  const tz = "America/Argentina/Mendoza";
  const zoned = toZonedTime(date, tz);
  return format(zoned, "dd/MM/yyyy HH:mm");
}

function truncateIpToSubnet(ip: string): string {
  // Truncar a /24 para compliance Ley 25.326
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
  }
  return ip; // IPv6 o "anon" — retornar sin cambios
}

// ─── Schemas Zod ─────────────────────────────────────────────────────────────

const phoneARRegex = /^(\+?54\s?)?(\(0?\d{2,4}\)\s?|\d{2,4}[\s-]?)?\d{6,8}$/;

const createBookingSchema = z.object({
  nombre: z
    .string()
    .min(2, { error: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { error: "El nombre no puede superar 100 caracteres" })
    .trim(),
  email: z.email({ error: "Email inválido" }),
  telefono: z
    .string()
    .regex(phoneARRegex, { error: "Teléfono inválido (formato AR)" })
    .max(30, { error: "Teléfono demasiado largo" }),
  areaLegal: z.enum(["civil_familia", "laboral", "penal", "comercial", "general"], {
    error: "Área legal inválida",
  }),
  descripcion: z
    .string()
    .min(10, { error: "La descripción debe tener al menos 10 caracteres" })
    .max(1000, { error: "La descripción no puede superar 1000 caracteres" })
    .trim(),
  slotStartUtc: z
    .string()
    .datetime({ message: "Fecha/hora de turno inválida" })
    .transform((v) => new Date(v)),
  consentimientoLey25326: z
    .boolean()
    .refine((v) => v === true, { message: "Debe aceptar el consentimiento de datos" }),
  // Honeypot — debe estar vacío
  _telefono_fijo: z.string().optional(),
});

const cancelBookingSchema = z.object({
  bookingId: z.uuid({ error: "ID de reserva inválido" }),
  motivo: z
    .string()
    .max(500, { error: "El motivo no puede superar 500 caracteres" })
    .optional()
    .transform((v) => (v ? sanitizeText(v) : undefined)),
});

const listBookingsSchema = z.object({
  status: z.enum(["confirmed", "cancelled", "completed"]).optional(),
  dateFrom: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  dateTo: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

// ─── Tipos de resultado ───────────────────────────────────────────────────────

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; retryAfter?: number; fields?: Record<string, string[]> };

export type CreateBookingResult = {
  bookingId: string;
  slotConfirmed: string; // ISO string
};

// ─── createBooking ────────────────────────────────────────────────────────────

export async function createBooking(
  formData: FormData | Record<string, unknown>
): Promise<ActionResult<CreateBookingResult>> {
  const reqHeaders = await headers();
  const ip = getClientIpFromHeaders(reqHeaders);

  // 1. Rate limit — hourly
  const hourlyResult = await bookingLimiter.limit(ip);
  if (!hourlyResult.success) {
    const retryAfterSeconds = Math.ceil((hourlyResult.reset - Date.now()) / 1000);
    log("warn", { ip: truncateIpToSubnet(ip) }, "[booking] Rate limit horario superado");
    return { success: false, error: "rate_limit", retryAfter: retryAfterSeconds };
  }

  // 1b. Rate limit — daily
  const dailyResult = await bookingDailyLimiter.limit(ip);
  if (!dailyResult.success) {
    const retryAfterSeconds = Math.ceil((dailyResult.reset - Date.now()) / 1000);
    log("warn", { ip: truncateIpToSubnet(ip) }, "[booking] Rate limit diario superado");
    return { success: false, error: "rate_limit", retryAfter: retryAfterSeconds };
  }

  // 2. Origin check (CSRF mitigation)
  const origin = reqHeaders.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (siteUrl && origin && origin !== siteUrl) {
    log("warn", { origin, siteUrl }, "[booking] Origin check failed — posible CSRF");
    return { success: false, error: "forbidden" };
  }

  // 3. Parsear y validar input
  const raw = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

  // Convertir consentimientoLey25326 de string a boolean si viene de FormData
  if (typeof raw.consentimientoLey25326 === "string") {
    raw.consentimientoLey25326 = raw.consentimientoLey25326 === "true";
  }

  const parsed = createBookingSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fields[key]) fields[key] = [];
      fields[key].push(issue.message);
    }
    return { success: false, error: "validation_error", fields };
  }

  const data = parsed.data;

  // 4. Sanitizar descripción
  const descSanitized = sanitizeText(data.descripcion);

  // 5. Honeypot check
  if (data._telefono_fijo && data._telefono_fijo.trim() !== "") {
    // Bot detectado — respuesta fake exitosa para no revelar la trampa
    log("warn", { ip: truncateIpToSubnet(ip) }, "[booking] Honeypot activado — bot detectado");
    const fakeId = crypto.randomUUID();
    return {
      success: true,
      data: { bookingId: fakeId, slotConfirmed: data.slotStartUtc.toISOString() },
    };
  }

  // Calcular slotEndUtc (consulta de 30 minutos)
  const slotStartUtc = data.slotStartUtc;
  const slotEndUtc = new Date(slotStartUtc.getTime() + 30 * 60 * 1000);

  // 6. Transacción Postgres — SELECT FOR UPDATE + INSERT
  let bookingId: string;
  try {
    const result = await db.transaction(async (tx) => {
      // SELECT FOR UPDATE — verificar que el slot no está tomado
      const existing = await tx
        .select({ id: bookings.id })
        .from(bookings)
        .where(and(eq(bookings.slotStartUtc, slotStartUtc), eq(bookings.status, "confirmed")))
        .for("update")
        .limit(1);

      if (existing.length > 0) {
        return { slotTaken: true };
      }

      // INSERT
      const [inserted] = await tx
        .insert(bookings)
        .values({
          clientName: data.nombre,
          clientEmail: data.email,
          clientPhone: data.telefono,
          legalArea: data.areaLegal,
          description: descSanitized,
          slotStartUtc,
          slotEndUtc,
          status: "confirmed",
          notificationStatus: "pending",
          ipSubnet: truncateIpToSubnet(ip),
          userAgent: reqHeaders.get("user-agent")?.slice(0, 500) ?? null,
          consentimientoAt: new Date(),
          gcalSynced: false,
        })
        .returning({ id: bookings.id });

      return { bookingId: inserted.id, slotTaken: false };
    });

    if (result.slotTaken) {
      log("info", { slotStartUtc: slotStartUtc.toISOString() }, "[booking] Slot ya ocupado");
      return { success: false, error: "slot_taken" };
    }

    bookingId = result.bookingId!;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Unique constraint violation → slot tomado (race condition)
    if (msg.includes("bookings_slot_start_confirmed_unique") || msg.includes("unique")) {
      log(
        "warn",
        { slotStartUtc: slotStartUtc.toISOString() },
        "[booking] Race condition detectada en slot"
      );
      return { success: false, error: "slot_taken" };
    }

    log("error", { err: msg }, "[booking] Error de DB al crear reserva");
    return { success: false, error: "internal_error" };
  }

  log("info", { bookingId }, "[booking] Reserva creada exitosamente");

  // 7. Google Calendar (no bloquea — catch y log)
  try {
    const calEvent = await createBookingEvent(
      { startUtc: slotStartUtc, endUtc: slotEndUtc },
      {
        name: data.nombre,
        email: data.email,
        phone: data.telefono,
        legalArea: data.areaLegal,
        description: descSanitized,
        bookingId,
      }
    );

    // Guardar googleEventId (best effort — no critico si falla)
    await db
      .update(bookings)
      .set({ googleEventId: calEvent.eventId, gcalSynced: true })
      .where(eq(bookings.id, bookingId))
      .catch((e) => {
        log(
          "warn",
          { bookingId, err: e instanceof Error ? e.message : String(e) },
          "[booking] No se pudo actualizar googleEventId"
        );
      });
  } catch (err) {
    log(
      "error",
      { bookingId, err: err instanceof Error ? err.message : String(err) },
      "[booking] Error al crear evento GCal — reserva confirmada igual"
    );
  }

  // 8. Emails async — si fallan, marcar notification_status='pending' (ya está por default)
  const slotFormatted = formatSlotAR(slotStartUtc);
  const areaLabels: Record<string, string> = {
    civil_familia: "Civil y Familia",
    laboral: "Laboral",
    penal: "Penal",
    comercial: "Comercial",
    general: "Consulta General",
  };
  const areaLabel = areaLabels[data.areaLegal] ?? data.areaLegal;

  // Ambos emails en paralelo — errores no bloquean el response
  const emailPromises = [
    sendBookingConfirmationToClient({
      clientEmail: data.email,
      clientName: data.nombre,
      slotFormatted,
      legalArea: areaLabel,
      bookingId,
    }),
    sendBookingNotificationToDoctor({
      clientName: data.nombre,
      clientEmail: data.email,
      clientPhone: data.telefono,
      slotFormatted,
      legalArea: areaLabel,
      description: descSanitized,
      bookingId,
    }),
  ];

  Promise.all(emailPromises)
    .then(([clientResult, drResult]) => {
      const allSent = clientResult.success && drResult.success;

      db.update(bookings)
        .set({ notificationStatus: allSent ? "sent" : "pending" })
        .where(eq(bookings.id, bookingId))
        .catch((e) => {
          log(
            "warn",
            { bookingId, err: e instanceof Error ? e.message : String(e) },
            "[booking] No se pudo actualizar notificationStatus"
          );
        });
    })
    .catch((err) => {
      log(
        "error",
        { bookingId, err: err instanceof Error ? err.message : String(err) },
        "[booking] Error al enviar emails — notificationStatus queda pending"
      );
    });

  return {
    success: true,
    data: { bookingId, slotConfirmed: slotStartUtc.toISOString() },
  };
}

// ─── cancelBooking ────────────────────────────────────────────────────────────

export async function cancelBooking(
  bookingId: string,
  motivo?: string
): Promise<ActionResult<{ bookingId: string }>> {
  const parsed = cancelBookingSchema.safeParse({ bookingId, motivo });
  if (!parsed.success) {
    return { success: false, error: "validation_error" };
  }

  // Leer booking existente
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, parsed.data.bookingId))
    .limit(1)
    .catch(() => []);

  if (!booking) {
    return { success: false, error: "not_found" };
  }

  if (booking.status === "cancelled") {
    return { success: false, error: "already_cancelled" };
  }

  // UPDATE status → cancelled
  try {
    await db
      .update(bookings)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(bookings.id, parsed.data.bookingId));
  } catch (err) {
    log(
      "error",
      { bookingId, err: err instanceof Error ? err.message : String(err) },
      "[booking] Error al cancelar reserva en DB"
    );
    return { success: false, error: "internal_error" };
  }

  log("info", { bookingId }, "[booking] Reserva cancelada");

  // Cancelar Google Calendar event (no bloquea)
  if (booking.googleEventId) {
    cancelBookingEvent(booking.googleEventId).catch((err) => {
      log(
        "error",
        {
          bookingId,
          googleEventId: booking.googleEventId,
          err: err instanceof Error ? err.message : String(err),
        },
        "[booking] Error al cancelar evento GCal"
      );
    });
  }

  // Enviar emails de cancelación (no bloquea)
  const slotFormatted = formatSlotAR(booking.slotStartUtc);
  Promise.all([
    sendBookingCancellationToClient({
      clientEmail: booking.clientEmail,
      clientName: booking.clientName,
      slotFormatted,
    }),
    sendBookingCancellationToDoctor({
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      slotFormatted,
      bookingId: booking.id,
      cancelledBy: "admin",
    }),
  ]).catch((err) => {
    log(
      "error",
      { bookingId, err: err instanceof Error ? err.message : String(err) },
      "[booking] Error al enviar emails de cancelación"
    );
  });

  return { success: true, data: { bookingId: booking.id } };
}

// ─── listBookings ─────────────────────────────────────────────────────────────

export async function listBookings(params: {
  status?: "confirmed" | "cancelled" | "completed";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}): Promise<
  ActionResult<{
    items: (typeof bookings.$inferSelect)[];
    total: number;
    page: number;
    pageSize: number;
  }>
> {
  const parsed = listBookingsSchema.safeParse({
    ...params,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  });

  if (!parsed.success) {
    return { success: false, error: "validation_error" };
  }

  const { status, dateFrom, dateTo, page, pageSize } = parsed.data;

  const conditions = [];
  if (status) conditions.push(eq(bookings.status, status));
  if (dateFrom) conditions.push(gte(bookings.slotStartUtc, dateFrom));
  if (dateTo) conditions.push(lte(bookings.slotStartUtc, dateTo));

  try {
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * pageSize;

    const [items, countResult] = await Promise.all([
      db
        .select()
        .from(bookings)
        .where(whereClause)
        .orderBy(desc(bookings.slotStartUtc))
        .limit(pageSize)
        .offset(offset),
      db.select({ count: bookings.id }).from(bookings).where(whereClause),
    ]);

    return {
      success: true,
      data: {
        items,
        total: countResult.length,
        page,
        pageSize,
      },
    };
  } catch (err) {
    log(
      "error",
      { err: err instanceof Error ? err.message : String(err) },
      "[booking] Error al listar reservas"
    );
    return { success: false, error: "internal_error" };
  }
}
