"use server";

/**
 * Server Actions de leads — T8
 *
 * submitLeadDescarga:
 *   1. Rate limit downloadLimiter 5/h IP
 *   2. Validar input con Zod
 *   3. Honeypot
 *   4. INSERT en leads_descarga
 *   5. Enviar email con link al PDF
 *   6. Log para CRM futuro
 *   7. Return { success, downloadUrl }
 */

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { leadsDescarga } from "@/lib/db/schema";
import { leadLimiter, leadDailyLimiter, getClientIpFromHeaders } from "@/lib/ratelimit/index";
import { sendLeadDescargaToLead, sendLeadNotificationToDoctor } from "@/lib/email/send";
import { z } from "zod";

// ─── Logger estructurado ──────────────────────────────────────────────────────

function log(level: "info" | "warn" | "error", context: Record<string, unknown>, msg: string) {
  const { email, ...safeContext } = context as Record<string, unknown> & { email?: string };
  const redacted: Record<string, unknown> = { ...safeContext };
  if (email) redacted.email_domain = (email as string).split("@")[1] ?? "[redacted]";

  console[level === "info" ? "log" : level](
    JSON.stringify({ level, msg, ts: new Date().toISOString(), ...redacted })
  );
}

// ─── Mapa de recursos disponibles ────────────────────────────────────────────

/**
 * Mapa de recurso slug → URL de descarga y metadata.
 * En producción los PDFs viven en /public/recursos/ o en un storage externo.
 */
const RECURSOS: Record<string, { titulo: string; downloadUrl: string; areaLegal?: string }> = {
  "guia-despido": {
    titulo: "Guía Completa sobre Despido Laboral",
    downloadUrl: "/recursos/guia-despido-laboral.pdf",
    areaLegal: "laboral",
  },
  "guia-divorcio": {
    titulo: "Guía sobre Divorcio en Argentina",
    downloadUrl: "/recursos/guia-divorcio.pdf",
    areaLegal: "civil_familia",
  },
  "guia-accidente-transito": {
    titulo: "Guía de Accidentes de Tránsito",
    downloadUrl: "/recursos/guia-accidente-transito.pdf",
    areaLegal: "civil_familia",
  },
  "guia-penal-basica": {
    titulo: "Conceptos Básicos del Derecho Penal",
    downloadUrl: "/recursos/guia-penal-basica.pdf",
    areaLegal: "penal",
  },
};

// ─── Schema Zod ───────────────────────────────────────────────────────────────

const submitLeadSchema = z.object({
  nombre: z
    .string()
    .min(2, { error: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { error: "El nombre no puede superar 100 caracteres" })
    .trim(),
  email: z.email({ error: "Email inválido" }),
  areaInteres: z.enum(["civil_familia", "laboral", "penal", "comercial", "general"], {
    error: "Área de interés inválida",
  }),
  recursoSlug: z
    .string()
    .min(1, { error: "Recurso requerido" })
    .max(100)
    .regex(/^[a-z0-9-]+$/, { error: "Recurso slug inválido" }),
  // Honeypot — debe estar vacío
  _website: z.string().optional(),
});

// ─── Tipos de resultado ───────────────────────────────────────────────────────

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; retryAfter?: number; fields?: Record<string, string[]> };

export type LeadDescargaResult = {
  downloadUrl: string;
  recursoTitulo: string;
};

// ─── submitLeadDescarga ───────────────────────────────────────────────────────

export async function submitLeadDescarga(
  formData: FormData | Record<string, unknown>
): Promise<ActionResult<LeadDescargaResult>> {
  const reqHeaders = await headers();
  const ip = getClientIpFromHeaders(reqHeaders);

  // 1. Rate limit — hourly
  const hourlyResult = await leadLimiter.limit(ip);
  if (!hourlyResult.success) {
    const retryAfterSeconds = Math.ceil((hourlyResult.reset - Date.now()) / 1000);
    log("warn", { ip }, "[leads] Rate limit horario superado");
    return { success: false, error: "rate_limit", retryAfter: retryAfterSeconds };
  }

  // 1b. Rate limit — daily
  const dailyResult = await leadDailyLimiter.limit(ip);
  if (!dailyResult.success) {
    const retryAfterSeconds = Math.ceil((dailyResult.reset - Date.now()) / 1000);
    log("warn", { ip }, "[leads] Rate limit diario superado");
    return { success: false, error: "rate_limit", retryAfter: retryAfterSeconds };
  }

  // 2. Parsear y validar input
  const raw = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

  const parsed = submitLeadSchema.safeParse(raw);
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

  // 3. Honeypot check
  if (data._website && data._website.trim() !== "") {
    log("warn", { ip }, "[leads] Honeypot activado — bot detectado");
    // Respuesta fake exitosa
    const recurso = RECURSOS[data.recursoSlug] ?? {
      titulo: "Recurso",
      downloadUrl: "/recursos/placeholder.pdf",
    };
    return {
      success: true,
      data: { downloadUrl: recurso.downloadUrl, recursoTitulo: recurso.titulo },
    };
  }

  // Verificar que el recurso existe
  const recurso = RECURSOS[data.recursoSlug];
  if (!recurso) {
    return { success: false, error: "recurso_not_found" };
  }

  // 4. INSERT en leads_descarga
  let leadId: string;
  try {
    const [inserted] = await db
      .insert(leadsDescarga)
      .values({
        nombre: data.nombre,
        email: data.email,
        areaInteres: data.areaInteres,
        recursoSlug: data.recursoSlug,
        ip: ip === "anon" ? null : ip,
        userAgent: reqHeaders.get("user-agent")?.slice(0, 500) ?? null,
      })
      .returning({ id: leadsDescarga.id });

    leadId = inserted.id;
  } catch (err) {
    log(
      "error",
      { err: err instanceof Error ? err.message : String(err) },
      "[leads] Error al insertar lead en DB"
    );
    return { success: false, error: "internal_error" };
  }

  log("info", { leadId, recursoSlug: data.recursoSlug }, "[leads] Lead capturado exitosamente");

  // 5. Enviar email con link al PDF (async — no bloquea respuesta)
  Promise.all([
    sendLeadDescargaToLead({
      leadEmail: data.email,
      nombre: data.nombre,
      recursoTitulo: recurso.titulo,
      downloadUrl: recurso.downloadUrl,
      areaLegal: recurso.areaLegal,
    }),
    sendLeadNotificationToDoctor({
      nombre: data.nombre,
      email: data.email,
      recursoTitulo: recurso.titulo,
      recursoSlug: data.recursoSlug,
      areaLegal: recurso.areaLegal,
      leadId,
    }),
  ]).catch((err) => {
    log(
      "error",
      { leadId, err: err instanceof Error ? err.message : String(err) },
      "[leads] Error al enviar email al lead"
    );
  });

  // 6. Log para CRM futuro
  log(
    "info",
    {
      leadId,
      recursoSlug: data.recursoSlug,
      areaInteres: data.areaInteres,
      crm_ready: true,
    },
    "[leads] CRM log — lead listo para integración futura"
  );

  return {
    success: true,
    data: {
      downloadUrl: recurso.downloadUrl,
      recursoTitulo: recurso.titulo,
    },
  };
}
