/**
 * Helper: extracción de IP del cliente para rate limiting.
 *
 * Prioridad:
 *   1. x-forwarded-for (Vercel Edge — cabecera más confiable en producción)
 *   2. x-real-ip (proxies alternativos)
 *   3. "anon" (fallback — nunca bloquea, pero no protege)
 *
 * Nota de seguridad: x-forwarded-for puede contener múltiples IPs separadas
 * por coma ("client, proxy1, proxy2"). Solo tomamos la primera (el cliente original).
 */

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    // Puede ser "1.2.3.4, 5.6.7.8" — tomar la primera IP (cliente real)
    const firstIp = xff.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  return "anon";
}

/**
 * Versión para Next.js headers() (server components / server actions).
 * Acepta el objeto Headers de Next.js o un Record<string, string>.
 */
export function getClientIpFromHeaders(
  headers: Headers | Record<string, string | string[] | undefined>
): string {
  const get = (key: string): string | undefined => {
    if (headers instanceof Headers) {
      return headers.get(key) ?? undefined;
    }
    const val = headers[key];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  const xff = get("x-forwarded-for");
  if (xff) {
    const firstIp = xff.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  return "anon";
}
