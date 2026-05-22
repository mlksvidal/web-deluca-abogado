/**
 * admin-auth.ts — Función compartida de validación de Basic Auth para /admin
 *
 * Usada por:
 *   - src/proxy.ts (intercepción a nivel de proxy/middleware)
 *   - src/app/admin/layout.tsx (guard server-side de defensa en profundidad)
 *
 * La validación es idéntica en ambos lugares: timing-safe via SHA-256 XOR.
 */

/**
 * Compara dos strings de forma timing-safe usando SHA-256.
 * Ambos hashes son exactamente 32 bytes — sin riesgo de mismatch de longitud.
 */
export async function timingSafeCompare(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const bufA = new Uint8Array(hashA);
  const bufB = new Uint8Array(hashB);
  let result = 0;
  for (let i = 0; i < bufA.length; i++) {
    result |= bufA[i] ^ bufB[i];
  }
  return result === 0;
}

/**
 * Valida un header Authorization Basic contra las env vars ADMIN_USER / ADMIN_PASSWORD.
 * Retorna true si las credenciales son correctas, false en cualquier otro caso.
 */
export async function validateAdminAuth(authHeader: string | null): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;

  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) return false;

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
    return false;
  }

  const [userMatch, passMatch] = await Promise.all([
    timingSafeCompare(username, expectedUser),
    timingSafeCompare(password, expectedPass),
  ]);

  return userMatch && passMatch;
}
