/**
 * booking.ts — Schema Zod compartido client/server para el formulario de reserva.
 *
 * Zod v4: `required_error` fue eliminado. Usar `error` para todos los mensajes.
 *
 * Este archivo es el único source of truth de validación:
 *   - Client: react-hook-form + @hookform/resolvers/zod
 *   - Server: booking.ts server action (re-valida siempre)
 *
 * NUNCA confiar en los datos del cliente — el server action valida de nuevo.
 */

import { z } from "zod";

// ─── Regex teléfono AR ─────────────────────────────────────────────────────────
// Acepta número celular argentino: 10 dígitos sin el prefijo +54 9
// Ej: "2604614896" (el prefijo "+54 9" es hardcoded en el form)
export const PHONE_AR_CELULAR_REGEX = /^\d{10}$/;

// ─── Schema principal ──────────────────────────────────────────────────────────

export const bookingFormSchema = z.object({
  // Zod v4: usar .min() con mensaje custom para "requerido" en strings
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres")
    .trim(),

  email: z.string().min(1, "El email es obligatorio").email("Ingresá un email válido"),

  /**
   * Teléfono: solo el número celular sin prefijo.
   * El formulario muestra "+54 9" hardcoded, el usuario ingresa solo los 10 dígitos.
   * En submit se arma el string completo: "+54 9" + telefono.
   */
  telefono: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(PHONE_AR_CELULAR_REGEX, "Ingresá los 10 dígitos del celular (sin 0 ni 15)")
    .max(10, "El número no puede tener más de 10 dígitos"),

  // Zod v4: z.enum solo acepta `error` como clave de mensaje custom
  areaLegal: z.enum(["civil_familia", "laboral", "penal", "comercial", "general"], {
    error: "Seleccioná un área legal válida",
  }),

  descripcion: z
    .string()
    .min(10, "Describí brevemente tu consulta (mínimo 10 caracteres)")
    .max(1000, "La descripción no puede superar 1000 caracteres")
    .trim(),

  slotStartUtc: z.string().min(1, "Seleccioná un turno disponible"),

  consentimientoLey25326: z.boolean().refine((v) => v === true, {
    message: "Debés aceptar el tratamiento de datos personales para continuar",
  }),

  // Honeypot — debe estar vacío. Si está completo es un bot.
  _telefono_fijo: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

// ─── Labels de áreas ──────────────────────────────────────────────────────────

export const AREA_LEGAL_LABELS: Record<BookingFormValues["areaLegal"], string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "Consulta General",
};

export const AREA_LEGAL_OPTIONS = [
  { value: "civil_familia", label: "Civil y Familia" },
  { value: "laboral", label: "Laboral" },
  { value: "penal", label: "Penal" },
  { value: "comercial", label: "Comercial" },
  { value: "general", label: "Consulta General" },
] as const;
