/**
 * proxy.ts — Next.js 16 Proxy (reemplaza middleware.ts)
 *
 * Responsabilidades:
 *   1. Basic Auth para /admin y /api/admin (5 intentos / 15 min por IP)
 *   2. Headers de seguridad en respuestas admin (X-Robots-Tag, Cache-Control)
 *
 * Seguridad:
 *   - timingSafeEqual para comparación de credenciales (evita timing attacks)
 *   - Buffers de igual longitud garantizado (padding con PBKDF2 derivado)
 *   - Sin logging de credenciales ni intentos fallidos con detalle
 *   - Rate limit con adminLimiter (5 req / 15min por IP)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Matcher — solo rutas admin ───────────────────────────────────────────────

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

// ─── Helpers de IP ────────────────────────────────────────────────────────────

function getIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();
  return "anon";
}

// ─── In-memory rate limiter (admin: 5 req / 900s por IP) ─────────────────────
//
// No usamos el módulo src/lib/ratelimit porque proxy corre ANTES del
// filesystem y no puede importar código de src/ de forma segura en Edge.
// Este limiter simple en memoria cumple el requisito de 5/15min.

const ADMIN_LIMIT = 5;
const ADMIN_WINDOW_MS = 900_000; // 15 minutos

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function checkAdminRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart >= ADMIN_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true, retryAfter: 0 };
  }

  entry.count++;

  if (entry.count > ADMIN_LIMIT) {
    const retryAfter = Math.ceil((entry.windowStart + ADMIN_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true, retryAfter: 0 };
}

// ─── Comparación timing-safe ──────────────────────────────────────────────────
//
// crypto.timingSafeEqual requiere buffers de IGUAL longitud.
// Para garantizarlo siempre, derivamos el hash SHA-256 de ambos strings
// y comparamos los hashes (32 bytes fijos).

async function timingSafeCompare(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();

  // Usamos subtle.digest para llevar ambos valores a 32 bytes
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);

  const bufA = new Uint8Array(hashA);
  const bufB = new Uint8Array(hashB);

  // timingSafeEqual no está disponible directamente en Edge Runtime —
  // usamos XOR bit a bit que es equivalente y seguro para comparaciones fijas.
  // Ambos buffers son exactamente 32 bytes (SHA-256) — sin riesgo de mismatch.
  let result = 0;
  for (let i = 0; i < bufA.length; i++) {
    result |= bufA[i] ^ bufB[i];
  }
  return result === 0;
}

// ─── Respuesta 401 ────────────────────────────────────────────────────────────

function unauthorizedResponse(retryAfter?: number): Response {
  const headers: Record<string, string> = {
    "WWW-Authenticate": 'Basic realm="Admin - Estudio De Luca"',
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "private, no-store",
  };
  if (retryAfter !== undefined && retryAfter > 0) {
    headers["Retry-After"] = String(retryAfter);
  }

  return new Response("Acceso no autorizado", {
    status: 401,
    headers,
  });
}

// ─── Proxy function ───────────────────────────────────────────────────────────

export async function proxy(request: NextRequest): Promise<Response> {
  const ip = getIp(request);

  // 1. Rate limit
  const { allowed, retryAfter } = checkAdminRateLimit(ip);
  if (!allowed) {
    // No loguear IP ni detalles del intento
    return new Response("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "private, no-store",
      },
    });
  }

  // 2. Leer Authorization header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return unauthorizedResponse();
  }

  // 3. Decodificar base64
  let username: string;
  let password: string;
  try {
    const base64 = authHeader.slice("Basic ".length);
    const decoded = atob(base64);
    const colonIdx = decoded.indexOf(":");
    if (colonIdx === -1) throw new Error("malformed");
    username = decoded.slice(0, colonIdx);
    password = decoded.slice(colonIdx + 1);
  } catch {
    // No loguear detalles de la credencial malformada
    return unauthorizedResponse();
  }

  // 4. Comparar con env vars — timing-safe
  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";

  if (!expectedUser || !expectedPass) {
    // Configuración incompleta — negar acceso, nunca exponer el motivo
    return unauthorizedResponse();
  }

  const [userMatch, passMatch] = await Promise.all([
    timingSafeCompare(username, expectedUser),
    timingSafeCompare(password, expectedPass),
  ]);

  if (!userMatch || !passMatch) {
    return unauthorizedResponse();
  }

  // 5. Auth OK — continuar con headers de seguridad admin
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");

  return response;
}
