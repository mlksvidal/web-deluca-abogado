/**
 * schedule-config.ts — Configuración de horarios de atención.
 * Zona horaria: America/Argentina/Mendoza (UTC-3, sin DST)
 */

export const TIMEZONE = "America/Argentina/Mendoza";

export const SCHEDULE_CONFIG = {
  // Duración de cada slot en minutos
  slotDurationMin: 45,

  // Anticipación mínima para reservar (en horas)
  minAdvanceHours: 24,

  // Ventana máxima de reserva (en días desde hoy)
  maxWindowDays: 30,

  // Días hábiles (0=Domingo, 1=Lunes, ..., 6=Sábado)
  workDays: [1, 2, 3, 4, 5] as number[], // Lunes a Viernes

  // Franjas horarias del día (hora local Mendoza)
  timeSlots: [
    { startHour: 9, startMin: 0, endHour: 13, endMin: 0 }, // Mañana
    { startHour: 16, startMin: 0, endHour: 20, endMin: 0 }, // Tarde
  ],
} as const;

export type TimeSlotRange = (typeof SCHEDULE_CONFIG.timeSlots)[number];
