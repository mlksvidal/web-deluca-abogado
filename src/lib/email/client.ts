/**
 * Resend client con retry exponencial para web-deluca-abogado.
 *
 * Estrategia de retry:
 *   Intento 1 → espera 1s → Intento 2 → espera 2s → Intento 3 → espera 4s → falla
 *
 * Si todos los reintentos fallan, la función lanza un EmailSendError
 * para que el llamador pueda marcar notificationStatus = 'pending_email' en DB.
 */

import { Resend } from "resend";
import type { ReactElement } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
  /** Texto plano de fallback (accesibilidad + clientes sin HTML) */
  text?: string;
}

export interface SendEmailResult {
  id: string;
  success: true;
}

export class EmailSendError extends Error {
  public readonly cause: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "EmailSendError";
    this.cause = cause;
  }
}

// ─── Logger estructurado mínimo ───────────────────────────────────────────────

function logError(context: Record<string, unknown>, msg: string) {
  // En producción usar pino; en dev console.error es aceptable
  console.error(JSON.stringify({ level: "error", msg, ...context }));
}

function logInfo(context: Record<string, unknown>, msg: string) {
  console.log(JSON.stringify({ level: "info", msg, ...context }));
}

// ─── Retry helper ─────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const RETRY_DELAYS_MS = [1000, 2000, 4000] as const;

// ─── Cliente Resend singleton ─────────────────────────────────────────────────

let _resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!_resendClient) {
    _resendClient = new Resend(apiKey);
  }
  return _resendClient;
}

// ─── sendEmail ─────────────────────────────────────────────────────────────────

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const from = process.env.RESEND_FROM_EMAIL ?? "noreply@estudiodeluca.com.ar";
  const resend = getResendClient();

  // Dev fallback: sin API key → simular envío exitoso con log
  if (!resend) {
    logInfo(
      { to: options.to, subject: options.subject, mode: "dev-fallback" },
      "[email] Dev fallback — sin RESEND_API_KEY, email simulado"
    );
    return { id: `dev-${Date.now()}`, success: true };
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
    try {
      const result = await resend.emails.send({
        from,
        to: options.to,
        subject: options.subject,
        react: options.react,
        ...(options.replyTo ? { replyTo: options.replyTo } : {}),
        ...(options.text ? { text: options.text } : {}),
      });

      if (result.error) {
        throw new Error(`Resend error: ${result.error.message}`);
      }

      if (!result.data?.id) {
        throw new Error("Resend no devolvió ID");
      }

      logInfo(
        { emailId: result.data.id, to: options.to, attempt: attempt + 1 },
        "[email] Email enviado correctamente"
      );

      return { id: result.data.id, success: true };
    } catch (err) {
      lastError = err;
      logError(
        {
          attempt: attempt + 1,
          maxAttempts: RETRY_DELAYS_MS.length,
          to: options.to,
          subject: options.subject,
          err: err instanceof Error ? err.message : String(err),
        },
        "[email] Fallo en intento de envío"
      );

      if (attempt < RETRY_DELAYS_MS.length - 1) {
        await sleep(RETRY_DELAYS_MS[attempt]);
      }
    }
  }

  throw new EmailSendError(
    `Email no enviado tras ${RETRY_DELAYS_MS.length} intentos: ${options.subject}`,
    lastError
  );
}
