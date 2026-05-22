/**
 * Tests para Server Actions de leads — T8
 *
 * Cobertura:
 *   - submitLeadDescarga: honeypot → fake success
 *   - submitLeadDescarga: rate limit → error rate_limit
 *   - submitLeadDescarga: email inválido → error validation_error
 *   - submitLeadDescarga: recurso no existe → error recurso_not_found
 *   - submitLeadDescarga: input válido → success con downloadUrl
 *   - submitLeadDescarga: error de DB → error internal_error
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers({ "user-agent": "vitest" })),
}));

const mockInsert = vi.fn();
vi.mock("@/lib/db", () => ({
  db: {
    insert: mockInsert,
  },
}));

const mockLeadLimiter = { limit: vi.fn() };
const mockLeadDailyLimiter = { limit: vi.fn() };

vi.mock("@/lib/ratelimit/index", () => ({
  leadLimiter: mockLeadLimiter,
  leadDailyLimiter: mockLeadDailyLimiter,
  getRateLimitHeaders: vi.fn().mockReturnValue({}),
  getClientIpFromHeaders: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("@/lib/email/send", () => ({
  sendLeadDescargaToLead: vi.fn().mockResolvedValue({ success: true }),
  sendLeadNotificationToDoctor: vi.fn().mockResolvedValue({ success: true }),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rateLimitSuccess() {
  return { success: true, reset: Date.now() + 3600_000, remaining: 4, limit: 5 };
}

function rateLimitBlocked() {
  return { success: false, reset: Date.now() + 3600_000, remaining: 0, limit: 5 };
}

const validLeadInput = {
  nombre: "María García",
  email: "maria@example.com",
  areaInteres: "laboral" as const,
  recursoSlug: "guia-despido",
  _website: "", // honeypot vacío
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("submitLeadDescarga", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLeadLimiter.limit.mockResolvedValue(rateLimitSuccess());
    mockLeadDailyLimiter.limit.mockResolvedValue(rateLimitSuccess());
  });

  it("honeypot activado → retorna success FAKE sin tocar DB", async () => {
    const { submitLeadDescarga } = await import("@/app/actions/leads");

    const result = await submitLeadDescarga({
      ...validLeadInput,
      _website: "http://spam.com", // honeypot con valor
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.downloadUrl).toBeDefined();
    }
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("rate limit horario superado → retorna error rate_limit con retryAfter", async () => {
    const { submitLeadDescarga } = await import("@/app/actions/leads");
    mockLeadLimiter.limit.mockResolvedValue(rateLimitBlocked());

    const result = await submitLeadDescarga(validLeadInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("rate_limit");
      expect(result.retryAfter).toBeDefined();
    }
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("rate limit diario superado → retorna error rate_limit", async () => {
    const { submitLeadDescarga } = await import("@/app/actions/leads");
    mockLeadDailyLimiter.limit.mockResolvedValue(rateLimitBlocked());

    const result = await submitLeadDescarga(validLeadInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("rate_limit");
    }
  });

  it("email inválido → retorna error validation_error con campo email", async () => {
    const { submitLeadDescarga } = await import("@/app/actions/leads");

    const result = await submitLeadDescarga({ ...validLeadInput, email: "no-es-email" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
      expect(result.fields?.email).toBeDefined();
    }
  });

  it("nombre muy corto → retorna error validation_error", async () => {
    const { submitLeadDescarga } = await import("@/app/actions/leads");

    const result = await submitLeadDescarga({ ...validLeadInput, nombre: "X" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });

  it("recursoSlug con caracteres inválidos → error validation_error", async () => {
    const { submitLeadDescarga } = await import("@/app/actions/leads");

    const result = await submitLeadDescarga({ ...validLeadInput, recursoSlug: "SLUG INVALIDO!" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });

  it("recurso no existe en el mapa → retorna error recurso_not_found", async () => {
    const { submitLeadDescarga } = await import("@/app/actions/leads");

    const result = await submitLeadDescarga({
      ...validLeadInput,
      recursoSlug: "recurso-inexistente",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("recurso_not_found");
    }
  });

  it("input válido con recurso conocido → retorna success con downloadUrl", async () => {
    const { submitLeadDescarga } = await import("@/app/actions/leads");

    const fakeLeadId = crypto.randomUUID();
    mockInsert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: fakeLeadId }]),
      }),
    });

    const result = await submitLeadDescarga(validLeadInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.downloadUrl).toContain("guia-despido");
      expect(result.data.recursoTitulo).toBeDefined();
    }
  });

  it("error de DB → retorna error internal_error", async () => {
    const { submitLeadDescarga } = await import("@/app/actions/leads");

    mockInsert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockRejectedValue(new Error("DB connection failed")),
      }),
    });

    const result = await submitLeadDescarga(validLeadInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("internal_error");
    }
  });

  it("acepta FormData además de objeto plano", async () => {
    const { submitLeadDescarga } = await import("@/app/actions/leads");

    const fakeLeadId = crypto.randomUUID();
    mockInsert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: fakeLeadId }]),
      }),
    });

    const fd = new FormData();
    fd.append("nombre", "Carlos López");
    fd.append("email", "carlos@example.com");
    fd.append("areaInteres", "penal");
    fd.append("recursoSlug", "guia-penal-basica");

    const result = await submitLeadDescarga(fd);

    expect(result.success).toBe(true);
  });
});
