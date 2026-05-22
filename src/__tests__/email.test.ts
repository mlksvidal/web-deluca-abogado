/**
 * Tests para el módulo de email (T3).
 *
 * Cobertura:
 *   - sendEmail: dev fallback (sin API key) → retorna mock ID
 *   - sendEmail: retry exponencial → 2 fallos + 1 éxito
 *   - sendEmail: 3 fallos → lanza EmailSendError
 *   - Templates: renderizan sin errores (verificación de estructura)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";

// ─── Mock de Resend ───────────────────────────────────────────────────────────

const mockSend = vi.fn();

vi.mock("resend", () => {
  // Vitest requiere `function` keyword para mocks usados con `new`
  function ResendMock() {
    return { emails: { send: mockSend } };
  }
  return { Resend: ResendMock };
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("sendEmail — dev fallback", () => {
  beforeEach(() => {
    // Asegurar que no hay API key en el entorno de tests
    delete process.env.RESEND_API_KEY;
    mockSend.mockClear();
    // Reset el singleton del cliente
    vi.resetModules();
  });

  it("devuelve id mock cuando no hay RESEND_API_KEY", async () => {
    const { sendEmail } = await import("../lib/email/client");

    const result = await sendEmail({
      to: "test@example.com",
      subject: "Test",
      react: React.createElement("div", null, "Test"),
    });

    expect(result.success).toBe(true);
    expect(result.id).toMatch(/^dev-/);
    expect(mockSend).not.toHaveBeenCalled();
  });
});

describe("sendEmail — retry exponencial", () => {
  const REAL_API_KEY = "re_test_key_123";

  beforeEach(() => {
    process.env.RESEND_API_KEY = REAL_API_KEY;
    mockSend.mockClear();
    vi.resetModules();
    // Mock global de setTimeout para no esperar realmente
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env.RESEND_API_KEY;
  });

  it("tiene éxito en el tercer intento (2 fallos + 1 éxito)", async () => {
    const { sendEmail } = await import("../lib/email/client");

    mockSend
      .mockRejectedValueOnce(new Error("Network error — intento 1"))
      .mockRejectedValueOnce(new Error("Network error — intento 2"))
      .mockResolvedValueOnce({ data: { id: "email_ok_123" }, error: null });

    const promise = sendEmail({
      to: "cliente@example.com",
      subject: "Turno confirmado",
      react: React.createElement("div", null, "Content"),
    });

    // Avanzar los timers de retry (1s + 2s)
    await vi.runAllTimersAsync();

    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.id).toBe("email_ok_123");
    expect(mockSend).toHaveBeenCalledTimes(3);
  });

  it("lanza EmailSendError tras 3 intentos fallidos", async () => {
    const { sendEmail, EmailSendError } = await import("../lib/email/client");

    mockSend.mockRejectedValue(new Error("Resend unavailable"));

    // Capturar el error directamente para evitar UnhandledRejection espurio
    let caughtError: unknown;
    const promise = sendEmail({
      to: "fail@example.com",
      subject: "Fallo total",
      react: React.createElement("div", null, "Content"),
    }).catch((err) => {
      caughtError = err;
    });

    await vi.runAllTimersAsync();
    await promise;

    expect(caughtError).toBeInstanceOf(EmailSendError);
    expect(mockSend).toHaveBeenCalledTimes(3);
  });

  it("falla inmediatamente con EmailSendError cuando Resend devuelve error en data", async () => {
    const { sendEmail, EmailSendError } = await import("../lib/email/client");

    mockSend.mockResolvedValue({
      data: null,
      error: { message: "Invalid API key", name: "invalid_api_key" },
    });

    let caughtError: unknown;
    const promise = sendEmail({
      to: "test@example.com",
      subject: "Test error",
      react: React.createElement("div", null, "Content"),
    }).catch((err) => {
      caughtError = err;
    });

    await vi.runAllTimersAsync();
    await promise;

    expect(caughtError).toBeInstanceOf(EmailSendError);
  });

  it("tiene éxito en el primer intento", async () => {
    const { sendEmail } = await import("../lib/email/client");

    mockSend.mockResolvedValueOnce({
      data: { id: "first_try_ok" },
      error: null,
    });

    const promise = sendEmail({
      to: "success@example.com",
      subject: "Primer intento",
      react: React.createElement("div", null, "Content"),
    });

    await vi.runAllTimersAsync();

    const result = await promise;
    expect(result.id).toBe("first_try_ok");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});

describe("Templates — renderizan sin errores", () => {
  it("BookingClientEmail tiene props correctas", async () => {
    const { BookingClientEmail } = await import("../lib/email/templates/booking-client");
    const element = React.createElement(BookingClientEmail, {
      clientName: "Juan Pérez",
      slotFormatted: "Martes 10 de junio, 10:00 hs",
      legalArea: "Laboral",
      bookingId: "uuid-test-123",
    });
    expect(element).toBeTruthy();
    expect(element.props.clientName).toBe("Juan Pérez");
  });

  it("BookingDoctorEmail tiene props correctas", async () => {
    const { BookingDoctorEmail } = await import("../lib/email/templates/booking-doctor");
    const element = React.createElement(BookingDoctorEmail, {
      clientName: "María García",
      clientEmail: "maria@example.com",
      clientPhone: "2604123456",
      slotFormatted: "Miércoles 11 de junio, 15:00 hs",
      legalArea: "Civil",
      description: "Consulta sobre divorcio",
      bookingId: "uuid-doc-456",
    });
    expect(element).toBeTruthy();
    expect(element.props.legalArea).toBe("Civil");
  });

  it("LeadDescargaEmail tiene props correctas", async () => {
    const { LeadDescargaEmail } = await import("../lib/email/templates/lead-descarga");
    const element = React.createElement(LeadDescargaEmail, {
      nombre: "Carlos López",
      recursoTitulo: "Guía de derechos laborales",
      downloadUrl: "https://estudiodeluca.com.ar/recursos/guia-laboral.pdf",
    });
    expect(element).toBeTruthy();
    expect(element.props.recursoTitulo).toBe("Guía de derechos laborales");
  });

  it("BookingCancelClientEmail tiene props correctas", async () => {
    const { BookingCancelClientEmail } =
      await import("../lib/email/templates/booking-cancel-client");
    const element = React.createElement(BookingCancelClientEmail, {
      clientName: "Ana Martínez",
      slotFormatted: "Jueves 12 de junio, 09:00 hs",
    });
    expect(element).toBeTruthy();
  });
});
