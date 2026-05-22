/**
 * Módulo de rate limiting para web-deluca-abogado.
 *
 * En producción: Upstash Redis + @upstash/ratelimit (sliding window)
 * En dev (sin UPSTASH_REDIS_REST_URL): in-memory Map con misma API
 *
 * Limiters preconfigurados:
 *   bookingLimiter  — 3/h + 10/día por IP (form de reserva)
 *   leadLimiter     — 5/h + 10/día por IP (centro de recursos)
 *   triageLimiter   — 30/h por IP (tracking sin DB)
 *   apiLimiter      — 30/min por IP (default fallback para API routes)
 *   adminLimiter    — 5/15min por IP (panel admin)
 *
 * Uso:
 *   const { success, reset } = await bookingLimiter.limit(getClientIp(headers))
 *   if (!success) return Response.json({ error: "Too Many Requests" }, { status: 429 })
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface RateLimitResult {
  success: boolean;
  /** Timestamp epoch en ms cuando se resetea la ventana */
  reset: number;
  /** Requests restantes en la ventana actual */
  remaining: number;
  /** Límite total de la ventana */
  limit: number;
}

export interface Limiter {
  limit(identifier: string): Promise<RateLimitResult>;
}

// ─── In-memory fallback (dev) ─────────────────────────────────────────────────

interface InMemoryEntry {
  count: number;
  windowStart: number;
}

/**
 * Implementación in-memory con sliding window aproximado (fixed window por simplicidad en dev).
 * Misma API que el limiter de Upstash — garantiza que dev y prod se comportan igual desde
 * el punto de vista del llamador.
 */
function createInMemoryLimiter(maxRequests: number, windowMs: number): Limiter {
  const store = new Map<string, InMemoryEntry>();

  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      const now = Date.now();
      const entry = store.get(identifier);

      if (!entry || now - entry.windowStart >= windowMs) {
        // Nueva ventana
        store.set(identifier, { count: 1, windowStart: now });
        return {
          success: true,
          reset: now + windowMs,
          remaining: maxRequests - 1,
          limit: maxRequests,
        };
      }

      entry.count++;

      if (entry.count > maxRequests) {
        return {
          success: false,
          reset: entry.windowStart + windowMs,
          remaining: 0,
          limit: maxRequests,
        };
      }

      return {
        success: true,
        reset: entry.windowStart + windowMs,
        remaining: maxRequests - entry.count,
        limit: maxRequests,
      };
    },
  };
}

// ─── Factory Upstash ──────────────────────────────────────────────────────────

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  return new Redis({ url, token });
}

function createUpstashLimiter(
  redis: Redis,
  maxRequests: number,
  windowSeconds: number,
  prefix: string
): Limiter {
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
    prefix,
    analytics: false,
  });

  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      const result = await ratelimit.limit(identifier);
      return {
        success: result.success,
        reset: result.reset,
        remaining: result.remaining,
        limit: result.limit,
      };
    },
  };
}

// ─── Creación de limiters ─────────────────────────────────────────────────────

function buildLimiter(config: {
  name: string;
  maxRequests: number;
  windowSeconds: number;
}): Limiter {
  const redis = getRedisClient();

  if (!redis) {
    // Dev fallback con in-memory
    console.log(
      JSON.stringify({
        level: "info",
        msg: `[ratelimit] Dev fallback — in-memory para limiter "${config.name}" (sin UPSTASH_REDIS_REST_URL)`,
        limiter: config.name,
      })
    );
    return createInMemoryLimiter(config.maxRequests, config.windowSeconds * 1000);
  }

  return createUpstashLimiter(
    redis,
    config.maxRequests,
    config.windowSeconds,
    `ratelimit:${config.name}`
  );
}

// ─── Limiters preconfigurados ─────────────────────────────────────────────────

/**
 * Form de reserva de turnos: 3 req/hora por IP.
 * La limitación diaria (10/día) se aplica combinando este limiter con bookingDailyLimiter.
 */
export const bookingLimiter: Limiter = buildLimiter({
  name: "booking-hourly",
  maxRequests: 3,
  windowSeconds: 3600, // 1 hora
});

/**
 * Limitación diaria para reservas: 10 req/día por IP.
 */
export const bookingDailyLimiter: Limiter = buildLimiter({
  name: "booking-daily",
  maxRequests: 10,
  windowSeconds: 86400, // 24 horas
});

/**
 * Centro de recursos / descarga de PDFs: 5 req/hora por IP.
 */
export const leadLimiter: Limiter = buildLimiter({
  name: "lead-hourly",
  maxRequests: 5,
  windowSeconds: 3600,
});

/**
 * Limitación diaria para leads: 10 req/día por IP.
 */
export const leadDailyLimiter: Limiter = buildLimiter({
  name: "lead-daily",
  maxRequests: 10,
  windowSeconds: 86400,
});

/**
 * Triage / formulario de contacto rápido (sin DB): 30 req/hora por IP.
 */
export const triageLimiter: Limiter = buildLimiter({
  name: "triage",
  maxRequests: 30,
  windowSeconds: 3600,
});

/**
 * Default para API routes genéricas: 30 req/min por IP.
 */
export const apiLimiter: Limiter = buildLimiter({
  name: "api-default",
  maxRequests: 30,
  windowSeconds: 60,
});

/**
 * Panel admin: 5 req/15min por IP (bruteforce protection).
 */
export const adminLimiter: Limiter = buildLimiter({
  name: "admin",
  maxRequests: 5,
  windowSeconds: 900, // 15 minutos
});

// ─── Helper: Retry-After header ───────────────────────────────────────────────

/**
 * Genera los headers estándar para respuestas 429.
 *
 * Uso:
 *   const headers = getRateLimitHeaders(result)
 *   return Response.json({ error: "Too Many Requests" }, { status: 429, headers })
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const retryAfterSeconds = Math.ceil((result.reset - Date.now()) / 1000);
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
    "Retry-After": String(Math.max(0, retryAfterSeconds)),
  };
}

// Re-exportar helpers de IP para acceso unificado desde este módulo
export { getClientIp, getClientIpFromHeaders } from "./limiters";
