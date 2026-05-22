/**
 * Google Calendar — Service Account JWT auth.
 *
 * Configuración requerida (en .env):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL   — email del service account (xxx@project.iam.gserviceaccount.com)
 *   GOOGLE_SERVICE_ACCOUNT_KEY     — clave privada en base64 (ver abajo cómo generarla)
 *   GOOGLE_CALENDAR_ID             — ID del calendario del Dr. (xxxxx@group.calendar.google.com)
 *
 * ─── Cómo crear el Service Account (para Lucas post-deploy) ───────────────────
 *
 * 1. Google Cloud Console → IAM & Admin → Service Accounts → "Create Service Account"
 *    Nombre: "estudio-deluca-calendar"
 *    No es necesario asignar roles a nivel proyecto.
 *
 * 2. Crear key → JSON → descargar el archivo.
 *
 * 3. Codificar en base64 para la env var:
 *    Linux/Mac: base64 -i downloaded-key.json | tr -d '\n'
 *    Windows:   certutil -encode downloaded-key.json key.b64 && type key.b64
 *    Copiar el resultado en GOOGLE_SERVICE_ACCOUNT_KEY en .env y en Vercel.
 *
 * 4. En Google Calendar:
 *    - Ir al calendario del Dr. → Configuración → Compartir con personas específicas
 *    - Agregar el email del service account (GOOGLE_SERVICE_ACCOUNT_EMAIL)
 *    - Permisos: "Realizar cambios en eventos" (no "Ver todos los detalles" — necesita write)
 *
 * 5. SCOPE MÍNIMO: el cliente solo tiene acceso a calendar.events en el calendario
 *    compartido específicamente. NO tiene acceso a otros calendarios del Dr.
 */

import { auth as gcalAuth } from "@googleapis/calendar";
import type { JWT } from "google-auth-library";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface CalendarClient {
  auth: JWT;
  calendarId: string;
}

export class CalendarAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalendarAuthError";
  }
}

// ─── Singleton del cliente autenticado ────────────────────────────────────────

let _calendarClient: CalendarClient | null = null;

/**
 * Retorna el cliente autenticado con Service Account JWT.
 * Retorna null si las credenciales no están configuradas (dev fallback).
 */
export function getCalendarClient(): CalendarClient | null {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const serviceAccountKeyB64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!serviceAccountEmail || !serviceAccountKeyB64 || !calendarId) {
    return null; // Dev fallback activo
  }

  if (_calendarClient) {
    return _calendarClient;
  }

  let privateKey: string;
  try {
    // La key viene en base64 para evitar problemas con newlines en .env
    const decoded = Buffer.from(serviceAccountKeyB64, "base64").toString("utf-8");
    const keyJson = JSON.parse(decoded) as { private_key: string };
    privateKey = keyJson.private_key;
  } catch (err) {
    throw new CalendarAuthError(
      `GOOGLE_SERVICE_ACCOUNT_KEY no es un JSON base64 válido: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const auth = new gcalAuth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  });

  _calendarClient = { auth, calendarId };
  return _calendarClient;
}

/**
 * Resetea el singleton (útil en tests).
 */
export function resetCalendarClient(): void {
  _calendarClient = null;
}
