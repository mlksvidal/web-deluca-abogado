/**
 * Funciones tipadas de envío de email por template.
 * Cada función recibe los props específicos del template y llama a sendEmail().
 *
 * Uso:
 *   import { sendBookingConfirmationToClient } from "@/lib/email/send"
 *   await sendBookingConfirmationToClient({ clientName, slotFormatted, ... })
 */

import React from "react";
import { sendEmail, type SendEmailResult } from "./client";
import { BookingClientEmail } from "./templates/booking-client";
import { BookingDoctorEmail } from "./templates/booking-doctor";
import { BookingCancelClientEmail } from "./templates/booking-cancel-client";
import { BookingCancelDoctorEmail } from "./templates/booking-cancel-doctor";
import { LeadDescargaEmail } from "./templates/lead-descarga";
import { LeadDescargaDoctorEmail } from "./templates/lead-descarga-doctor";

// ─── Re-export de tipos para conveniencia ─────────────────────────────────────

export type { BookingClientEmailProps } from "./templates/booking-client";
export type { BookingDoctorEmailProps } from "./templates/booking-doctor";
export type { BookingCancelClientEmailProps } from "./templates/booking-cancel-client";
export type { BookingCancelDoctorEmailProps } from "./templates/booking-cancel-doctor";
export type { LeadDescargaEmailProps } from "./templates/lead-descarga";
export type { LeadDescargaDoctorEmailProps } from "./templates/lead-descarga-doctor";

// ─── Helpers internos ─────────────────────────────────────────────────────────

function getDrEmail(): string {
  return process.env.DR_NOTIFICATION_EMAIL ?? "pablo@estudiodeluca.com.ar";
}

// ─── Envíos tipados ───────────────────────────────────────────────────────────

/** Confirmación de turno al cliente */
export async function sendBookingConfirmationToClient(props: {
  clientEmail: string;
  clientName: string;
  slotFormatted: string;
  legalArea: string;
  bookingId: string;
  whatsappDr?: string;
  direccion?: string;
}): Promise<SendEmailResult> {
  return sendEmail({
    to: props.clientEmail,
    subject: `Turno confirmado — ${props.slotFormatted}`,
    react: React.createElement(BookingClientEmail, {
      clientName: props.clientName,
      slotFormatted: props.slotFormatted,
      legalArea: props.legalArea,
      bookingId: props.bookingId,
      whatsappDr: props.whatsappDr,
      direccion: props.direccion,
    }),
  });
}

/** Notificación al Dr. cuando se agenda un turno */
export async function sendBookingNotificationToDoctor(props: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  slotFormatted: string;
  legalArea: string;
  description: string;
  bookingId: string;
}): Promise<SendEmailResult> {
  return sendEmail({
    to: getDrEmail(),
    subject: `Nuevo turno: ${props.clientName} — ${props.slotFormatted}`,
    react: React.createElement(BookingDoctorEmail, props),
    replyTo: props.clientEmail,
  });
}

/** Confirmación de cancelación al cliente */
export async function sendBookingCancellationToClient(props: {
  clientEmail: string;
  clientName: string;
  slotFormatted: string;
}): Promise<SendEmailResult> {
  return sendEmail({
    to: props.clientEmail,
    subject: `Turno cancelado — ${props.slotFormatted}`,
    react: React.createElement(BookingCancelClientEmail, {
      clientName: props.clientName,
      slotFormatted: props.slotFormatted,
    }),
  });
}

/** Notificación al Dr. cuando se cancela un turno */
export async function sendBookingCancellationToDoctor(props: {
  clientName: string;
  clientEmail: string;
  slotFormatted: string;
  bookingId: string;
  cancelledBy?: "client" | "admin";
}): Promise<SendEmailResult> {
  return sendEmail({
    to: getDrEmail(),
    subject: `Turno cancelado: ${props.clientName} — ${props.slotFormatted}`,
    react: React.createElement(BookingCancelDoctorEmail, props),
  });
}

/** Entrega de recurso PDF al lead */
export async function sendLeadDescargaToLead(props: {
  leadEmail: string;
  nombre: string;
  recursoTitulo: string;
  downloadUrl: string;
  areaLegal?: string;
}): Promise<SendEmailResult> {
  return sendEmail({
    to: props.leadEmail,
    subject: `Tu recurso está listo: ${props.recursoTitulo}`,
    react: React.createElement(LeadDescargaEmail, {
      nombre: props.nombre,
      recursoTitulo: props.recursoTitulo,
      downloadUrl: props.downloadUrl,
      areaLegal: props.areaLegal,
    }),
  });
}

/** Notificación al Dr. cuando se captura un lead de descarga */
export async function sendLeadNotificationToDoctor(props: {
  nombre: string;
  email: string;
  recursoTitulo: string;
  recursoSlug: string;
  areaLegal?: string;
  leadId: string;
}): Promise<SendEmailResult> {
  return sendEmail({
    to: getDrEmail(),
    subject: `Nuevo lead: ${props.nombre} descargó "${props.recursoTitulo}"`,
    react: React.createElement(LeadDescargaDoctorEmail, props),
  });
}
