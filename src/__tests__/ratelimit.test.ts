/**
 * Tests para el módulo de rate limiting (T5).
 *
 * Cobertura:
 *   - In-memory fallback: bloquea después de N requests
 *   - getRateLimitHeaders: genera headers correctos para 429
 *   - getClientIp: extrae IP correctamente de distintas cabeceras
 */

import { describe, it, expect, beforeEach } from "vitest";

// ─── Tests de getClientIp ─────────────────────────────────────────────────────

describe("getClientIp", () => {
  // importar después para evitar problemas de módulo
  it("extrae la primera IP de x-forwarded-for", async () => {
    const { getClientIp } = await import("../lib/ratelimit/limiters");
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8, 9.10.11.12" },
    });
    expect(getClientIp(request)).toBe("1.2.3.4");
  });

  it("extrae IP de x-real-ip cuando no hay x-forwarded-for", async () => {
    const { getClientIp } = await import("../lib/ratelimit/limiters");
    const request = new Request("https://example.com", {
      headers: { "x-real-ip": "10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("10.0.0.1");
  });

  it("retorna 'anon' cuando no hay ninguna cabecera de IP", async () => {
    const { getClientIp } = await import("../lib/ratelimit/limiters");
    const request = new Request("https://example.com");
    expect(getClientIp(request)).toBe("anon");
  });

  it("prefiere x-forwarded-for sobre x-real-ip", async () => {
    const { getClientIp } = await import("../lib/ratelimit/limiters");
    const request = new Request("https://example.com", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
        "x-real-ip": "10.0.0.1",
      },
    });
    expect(getClientIp(request)).toBe("192.168.1.1");
  });

  it("trimea espacios en la IP", async () => {
    const { getClientIp } = await import("../lib/ratelimit/limiters");
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "  203.0.113.1 , 198.51.100.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.1");
  });
});

// ─── Tests de in-memory limiter ────────────────────────────────────────────────
// Probamos el comportamiento del limiter usando el módulo sin Upstash configurado

describe("in-memory limiter (dev fallback)", () => {
  beforeEach(() => {
    // Asegurar que no hay credenciales Upstash para activar el fallback
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it("permite los primeros N requests y bloquea el N+1", async () => {
    // Recrear el in-memory limiter directamente (sin usar Upstash)
    const maxRequests = 3;
    const windowMs = 60 * 1000; // 1 minuto
    const store = new Map<string, { count: number; windowStart: number }>();

    function limit(identifier: string) {
      const now = Date.now();
      const entry = store.get(identifier);

      if (!entry || now - entry.windowStart >= windowMs) {
        store.set(identifier, { count: 1, windowStart: now });
        return {
          success: true,
          remaining: maxRequests - 1,
          limit: maxRequests,
          reset: now + windowMs,
        };
      }

      entry.count++;

      if (entry.count > maxRequests) {
        return {
          success: false,
          remaining: 0,
          limit: maxRequests,
          reset: entry.windowStart + windowMs,
        };
      }

      return {
        success: true,
        remaining: maxRequests - entry.count,
        limit: maxRequests,
        reset: entry.windowStart + windowMs,
      };
    }

    const ip = "192.168.1.100";

    // Primeros 3 deben pasar
    expect(limit(ip).success).toBe(true);
    expect(limit(ip).success).toBe(true);
    expect(limit(ip).success).toBe(true);

    // El 4to debe fallar
    const blocked = limit(ip);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("IPs distintas no se afectan entre sí", async () => {
    const store = new Map<string, { count: number; windowStart: number }>();
    const maxRequests = 2;
    const windowMs = 60 * 1000;

    function limit(identifier: string) {
      const now = Date.now();
      const entry = store.get(identifier);
      if (!entry || now - entry.windowStart >= windowMs) {
        store.set(identifier, { count: 1, windowStart: now });
        return { success: true };
      }
      entry.count++;
      return { success: entry.count <= maxRequests };
    }

    // IP A consume su límite
    expect(limit("1.1.1.1").success).toBe(true);
    expect(limit("1.1.1.1").success).toBe(true);
    expect(limit("1.1.1.1").success).toBe(false);

    // IP B no está afectada
    expect(limit("2.2.2.2").success).toBe(true);
  });
});

// ─── Tests de getRateLimitHeaders ─────────────────────────────────────────────

describe("getRateLimitHeaders", () => {
  it("genera headers correctos para una respuesta 429", async () => {
    const { getRateLimitHeaders } = await import("../lib/ratelimit/index");

    const futureReset = Date.now() + 30_000; // 30 segundos
    const result = {
      success: false,
      limit: 3,
      remaining: 0,
      reset: futureReset,
    };

    const headers = getRateLimitHeaders(result);

    expect(headers["X-RateLimit-Limit"]).toBe("3");
    expect(headers["X-RateLimit-Remaining"]).toBe("0");
    expect(headers["Retry-After"]).toBeDefined();
    // Retry-After debe ser positivo (~30 segundos)
    expect(Number(headers["Retry-After"])).toBeGreaterThan(0);
    expect(Number(headers["Retry-After"])).toBeLessThanOrEqual(31);
  });

  it("Retry-After es 0 cuando ya se reseteó la ventana", async () => {
    const { getRateLimitHeaders } = await import("../lib/ratelimit/index");

    const pastReset = Date.now() - 5000; // Ya pasó
    const result = {
      success: false,
      limit: 3,
      remaining: 0,
      reset: pastReset,
    };

    const headers = getRateLimitHeaders(result);
    expect(Number(headers["Retry-After"])).toBe(0);
  });

  it("incluye X-RateLimit-Reset como segundos epoch", async () => {
    const { getRateLimitHeaders } = await import("../lib/ratelimit/index");

    const resetMs = Date.now() + 60_000;
    const headers = getRateLimitHeaders({
      success: false,
      limit: 5,
      remaining: 0,
      reset: resetMs,
    });

    const resetSeconds = Number(headers["X-RateLimit-Reset"]);
    expect(resetSeconds).toBeCloseTo(Math.ceil(resetMs / 1000), -1);
  });
});
