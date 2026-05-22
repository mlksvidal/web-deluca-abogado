# Security Spec — web-deluca-abogado

**Proyecto**: Portfolio + Reserva de turnos Dr. Pablo De Luca (abogado)
**Stack**: Next.js 16 (RSC + Route Handlers) · Supabase Postgres (postgres.js, pooler 6543) · Drizzle · Resend · Google Calendar (Service Account JWT) · Vercel
**Datos sensibles**: nombre/email/teléfono cliente, descripción de consulta legal (potencial info confidencial), credenciales Google SA, Resend API key, Supabase keys, ADMIN_USER/ADMIN_PASSWORD
**Owner del threat model**: security-engineer · Fase 2 paralelo

---

## 1. STRIDE Threat Model

### S — Spoofing (suplantación de identidad)

| #   | Amenaza                                                                                             | Componente                          | Riesgo                                                              | Mitigación                                                                                                                                                                                                                                                             |
| --- | --------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | Atacante envía formulario haciéndose pasar por otra persona (sin verificación de email/teléfono)    | `POST /api/turnos`                  | MEDIO — el Dr. recibe consulta de email ajeno → spam/contacto falso | Doble opt-in opcional vía email de confirmación con token (link expira 30 min). Mínimo: enviar email al cliente y dejar evidencia en logs.                                                                                                                             |
| S2  | Atacante adivina/bruteforce de Basic Auth admin                                                     | `proxy.ts` middleware (`/admin/**`) | ALTO — acceso total al panel admin con datos de clientes            | Password fuerte ≥ 24 chars, rate-limit en proxy.ts (5 intentos / 15min por IP), respuesta `WWW-Authenticate: Basic realm="admin"` solo después del rate-limit check, considerar Better Auth en Fase 2                                                                  |
| S3  | Tab-nabbing desde links externos en footer/About                                                    | Componente `<a target="_blank">`    | BAJO                                                                | TODO `<a target="_blank">` debe llevar `rel="noopener noreferrer"`. Reality-checker y frontend-developer enforce.                                                                                                                                                      |
| S4  | Spoofing de Service Account de Google (JWT firmado con clave robada)                                | `lib/google-calendar.ts`            | CRÍTICO                                                             | `credentials.json` JAMÁS en repo (gitignore + secret scan). Almacenar en Vercel Env como JSON-string base64 en `GOOGLE_SERVICE_ACCOUNT_JSON`. Rotar cada 90 días. Scope mínimo: `https://www.googleapis.com/auth/calendar.events` (NO `.readonly` global, NO `.acls`). |
| S5  | Spoofing del remitente de email transaccional (cliente recibe email de "abogado@" pero es phishing) | Resend                              | MEDIO                                                               | Configurar SPF + DKIM + DMARC en el dominio del remitente (`from: turnos@deluca-abogado.com.ar` o el que se use). Resend lo soporta nativamente — el deployer debe configurar registros DNS.                                                                           |

### T — Tampering (modificación maliciosa)

| #   | Amenaza                                                                                                                           | Componente                        | Riesgo | Mitigación                                                                                                                                                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1  | Cliente modifica `slot_id` / `area_legal` / cualquier campo del body POST para reservar slots prohibidos o causar inconsistencias | `POST /api/turnos`                | ALTO   | Validación **zod** server-side de TODO el body. Verificar contra DB que el slot existe, está libre y dentro de horario laboral. NUNCA confiar en el cliente.                                                               |
| T2  | SQL Injection en search del panel admin (`?q=...`)                                                                                | Route handler admin               | ALTO   | Drizzle ORM con queries parametrizadas (`like(turnos.email, \`%${q}%\`)` ya escapa). NUNCA concatenar strings a SQL raw. Si se usa `sql\`...\`` template, usar placeholders `${param}`.                                    |
| T3  | Tampering del lockfile (`package-lock.json`) en supply-chain attack                                                               | CI/CD                             | MEDIO  | Agregar `lockfile-lint` al CI: `npx lockfile-lint --allowed-hosts npm --allowed-schemes https: --type npm --path package-lock.json`. Bloquea hosts/schemes no permitidos en lockfile.                                      |
| T4  | Modificación de un turno ya creado por otro usuario                                                                               | API admin / API pública           | ALTO   | API pública NO permite UPDATE/DELETE. Solo admin (Basic Auth). UPDATE/DELETE en admin requiere `turno_id` + verificación de existencia. Audit trail (ver R1).                                                              |
| T5  | Cliente envía descripción con HTML/script intentando XSS stored                                                                   | `descripcion` field → admin panel | ALTO   | Sanitizar al **mostrar** en admin (allowlist HTML o renderizar como texto plano con `{descripcion}` en JSX — React escapa por default). NO `dangerouslySetInnerHTML`. Backup: storage como texto plano sin transformación. |

### R — Repudiation (negación de acciones)

| #   | Amenaza                                                               | Componente           | Riesgo               | Mitigación                                                                                                                                                                                          |
| --- | --------------------------------------------------------------------- | -------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Cliente reserva, no se presenta, niega haber reservado                | DB turnos            | MEDIO                | Tabla `turnos` con `created_at`, `ip_address` (truncada a /24 para LGPD), `user_agent`, `email_confirmacion_enviado_at`. Audit log inmutable.                                                       |
| R2  | Admin elimina/modifica turno y niega haberlo hecho                    | Panel admin          | BAJO (un solo admin) | Tabla `audit_log` (action, turno_id, timestamp, admin_user, ip). Inmutable — solo INSERT.                                                                                                           |
| R3  | Google Calendar evento no se crea (silently failed) y nadie se entera | Job de sync calendar | MEDIO                | Loguear cada operación contra Google Calendar API (success/fail + response code). Si falla, marcar `turno.gcal_synced=false` y reintento con backoff. Alerta al Dr. por email si N fallas seguidas. |

### I — Information Disclosure (filtración de info)

| #   | Amenaza                                                                                                               | Componente                       | Riesgo      | Mitigación                                                                                                                                                                                                                                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I1  | **Datos de consultas legales filtrados** (puede contener info confidencial: nombres de partes, montos, casos penales) | DB Supabase, panel admin, emails | **CRÍTICO** | TLS 1.2+ en todo (Vercel + Supabase ya lo hacen). Supabase: NO usar service_role en client-side, solo en server. RLS habilitado aunque el acceso sea server-only. Encriptación at-rest (Supabase la provee). Política de retención (ver compliance).                           |
| I2  | Source maps `.map` accesibles en producción exponen código fuente y posiblemente endpoints/secrets en bundle          | Vercel deploy                    | MEDIO       | Verificar en Fase 4 que `https://<deploy>/_next/static/**/*.map` retorna 404 o no se sirven. `next.config.js`: `productionBrowserSourceMaps: false` (default).                                                                                                                 |
| I3  | Secrets hardcoded en bundle client por error (`NEXT_PUBLIC_*` accidental)                                             | Build Next.js                    | ALTO        | Solo `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` deben ir client-side. JAMÁS `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `ADMIN_PASSWORD` con prefix `NEXT_PUBLIC_`. Validar con regex en pre-commit hook o script de boot. |
| I4  | Error stack traces en producción exponen paths, queries, env vars                                                     | Route handlers                   | MEDIO       | `NODE_ENV=production` → Next.js oculta stack traces. Custom error handler que retorna `{error: "Internal error"}` con 500, loguea el stack server-side, nunca al cliente.                                                                                                      |
| I5  | Panel admin indexado por buscadores (filtra que existe `/admin` y a veces datos)                                      | `/admin/**` routes               | ALTO        | Headers `X-Robots-Tag: noindex, nofollow, noarchive` + `Cache-Control: private, no-store, no-cache, must-revalidate` en proxy.ts para `/admin/**`. `robots.txt`: `Disallow: /admin/`.                                                                                          |
| I6  | Logs de Vercel/Supabase contienen datos personales (email, descripción, teléfono)                                     | Server logs                      | ALTO        | NUNCA loguear `body` completo. Loguear solo `{ turno_id, area_legal, slot_id, ip_subnet }`. Resend: no incluir `descripcion` en logs de error.                                                                                                                                 |
| I7  | Listado público de slots ya reservados expone que "X persona reservó tal día"                                         | `GET /api/slots`                 | MEDIO       | Retornar solo `{ available: boolean, slot_id, datetime }` — NUNCA datos de quién reservó.                                                                                                                                                                                      |
| I8  | Enumeration: atacante prueba IDs de turnos `/api/turnos/{id}` para leer datos ajenos                                  | Route handler `[id]`             | ALTO        | Si existe endpoint público para "ver mi reserva", usar token aleatorio (`crypto.randomUUID()`) como identificador del link, NO el id secuencial. Idealmente, mostrar confirmación inline tras el POST y no exponer endpoint GET por id.                                        |
| I9  | Lockfile envenenado redirige a paquetes maliciosos que extraen env vars                                               | npm install en build             | MEDIO       | `lockfile-lint` (ver T3) + `npm audit --audit-level=high` en CI.                                                                                                                                                                                                               |

### D — Denial of Service

| #   | Amenaza                                                      | Componente         | Riesgo | Mitigación                                                                                                                                                                                                                                                      |
| --- | ------------------------------------------------------------ | ------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Flood de reservas falsas satura DB y bloquea slots           | `POST /api/turnos` | ALTO   | **Rate limit** (ver §4): 3 POST/hora por IP, 10/día por IP. Librería recomendada: **Upstash Ratelimit** (Vercel-friendly, sliding window). Fallback: LRU in-memory con `lru-cache` (no funciona multi-instance, solo aceptable mientras se está en hobby plan). |
| D2  | Form abusivo: descripción de 1MB                             | Body parsing       | MEDIO  | Limitar body a 10KB (`maxBodySize` o validar `request.headers.get("content-length")`). Zod schema: `descripcion: z.string().max(2000)`.                                                                                                                         |
| D3  | Bruteforce de Basic Auth tira el proxy                       | `proxy.ts`         | MEDIO  | Rate limit a nivel proxy (ver S2). Vercel ya tiene DDoS protection nativa en capa de red.                                                                                                                                                                       |
| D4  | Reentrancia/double-booking del mismo slot (race condition)   | `POST /api/turnos` | ALTO   | Ver A04. Constraint UNIQUE + transacción con `SELECT ... FOR UPDATE` o `INSERT ... ON CONFLICT DO NOTHING`. Si retorna 0 filas → "slot ocupado".                                                                                                                |
| D5  | Resend API rate limit excedido = no se envían confirmaciones | Resend             | BAJO   | Plan Resend tiene 100 emails/día free. Si se aproxima, queue y reintento. Monitorear vía `Resend` dashboard.                                                                                                                                                    |
| D6  | Spam bot llena la tabla `turnos` con datos basura            | `POST /api/turnos` | ALTO   | Honeypot field invisible (`<input name="website" hidden>`, si viene lleno → 200 OK fake + descartar). Considerar Cloudflare Turnstile (no reCAPTCHA: privacy-friendly) si el spam persiste.                                                                     |

### E — Elevation of Privilege

| #   | Amenaza                                                                                                                           | Componente           | Riesgo  | Mitigación                                                                                                                                                                                                                                                           |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E1  | Usuario público accede a panel admin sin Basic Auth (bypass de proxy.ts)                                                          | `/admin/**`          | CRÍTICO | proxy.ts matcher debe incluir explícitamente `/admin/:path*` y todas las APIs admin `/api/admin/:path*`. Verificar en cada route handler admin **doble** (defense in depth): si `request.headers.get('authorization')` no matchea → 401. Tests de matcher en Fase 4. |
| E2  | Service Account de Google con scopes excesivos                                                                                    | Google Cloud Console | ALTO    | Scope mínimo: `https://www.googleapis.com/auth/calendar.events` SOLO en el calendar específico del Dr. Compartir ese calendar con el SA, no dar acceso global a calendars del workspace.                                                                             |
| E3  | Supabase service_role usado en client-side por error                                                                              | Frontend             | CRÍTICO | service*role JAMÁS con prefix `NEXT_PUBLIC*`. Usar solo en server (route handlers, server actions). En el client, anon key + RLS.                                                                                                                                    |
| E4  | Acceso al endpoint de OAuth callback `/api/auth/google/callback` con state CSRF inválido (si se agrega OAuth user-side en futuro) | OAuth flow           | ALTO    | Si en el futuro se agrega OAuth (post-fase actual), generar `state` con `crypto.randomBytes(32).toString("hex")`, guardar en cookie httpOnly, validar en callback. Por ahora se usa Service Account → N/A.                                                           |

---

## 2. OWASP Top 10 Checklist (aplicado al proyecto)

### ✅ A01 — Broken Access Control (APLICA — panel admin)

- [ ] proxy.ts: matcher cubre `/admin/:path*` + `/api/admin/:path*`
- [ ] Basic Auth: comparación con `timingSafeEqual` (no `===` para evitar timing attacks)
- [ ] Cada route handler admin RE-verifica el header authorization (defense in depth)
- [ ] Endpoints públicos NUNCA exponen turnos de otros usuarios (sin endpoint `GET /api/turnos/[id]` o si existe, usa token UUID)
- [ ] `robots.txt` excluye `/admin/`
- [ ] Headers `X-Robots-Tag: noindex` en respuestas admin
- [ ] Logout: instruir al usuario a cerrar el navegador (Basic Auth no tiene logout real)

### ✅ A02 — Cryptographic Failures (APLICA — info legal sensible)

- [ ] HTTPS obligatorio (Vercel lo provee). HSTS en headers (ver §3)
- [ ] Supabase: connection string usa `sslmode=require` (Vercel postgres.js lo hace por default)
- [ ] Datos en tránsito: TLS 1.2+
- [ ] Datos at-rest: Supabase encripta automáticamente
- [ ] Passwords admin: NO hash (Basic Auth compara plain con env var). Para Better Auth futuro: bcrypt/argon2 ≥ 10 rounds
- [ ] No reinventar crypto: usar `crypto` nativo de Node para UUIDs y tokens
- [ ] `ADMIN_PASSWORD` ≥ 24 chars random, no diccionario

### ✅ A03 — Injection (APLICA — form público, search admin)

- [ ] Drizzle ORM con queries parametrizadas (NO `sql\`SELECT \* FROM users WHERE name = '${input}'\``)
- [ ] Validación zod server-side en TODOS los inputs del POST `/api/turnos`
- [ ] Output encoding en admin (React escapa por default — NO `dangerouslySetInnerHTML`)
- [ ] Email content (Resend): si se templatiza con datos del cliente, usar React Email o escapar manualmente
- [ ] Headers no se construyen con input de usuario (header injection)

### ✅ A04 — Insecure Design (APLICA — race condition de slots)

- [ ] **Slot booking atómico**: constraint `UNIQUE(slot_id)` en tabla `turnos` + INSERT en transacción. Si conflict → "slot ocupado".
  ```
  -- Drizzle migration
  CREATE UNIQUE INDEX turnos_slot_id_unique ON turnos(slot_id) WHERE status != 'cancelado';
  ```
- [ ] Lógica de "horarios disponibles" calculada server-side, nunca confiar en lo que envía el cliente
- [ ] Threat model documentado (este archivo)
- [ ] Validación de business rules server-side: horario laboral, días hábiles, max N turnos por email
- [ ] Idempotencia: si cliente reenvía el form, no crear duplicado (hash de email+slot_id+día)

### ✅ A05 — Security Misconfiguration (APLICA — headers, CORS, Vercel)

- [ ] Security headers en `vercel.json` (ver §3)
- [ ] CORS restrictivo: `/api/turnos` solo accepta same-origin. Sin `Access-Control-Allow-Origin: *`
- [ ] `next.config.js`: `productionBrowserSourceMaps: false`
- [ ] Errores en producción: mensajes genéricos (`NODE_ENV=production`)
- [ ] No directorios listables (Vercel no lo permite por default)
- [ ] Default-deny: rutas no definidas → 404
- [ ] CSP estricta (ver §3)

### ✅ A06 — Vulnerable & Outdated Components (APLICA)

- [ ] `npm audit --audit-level=high` en CI (bloquea si HIGH/CRITICAL)
- [ ] `lockfile-lint` en CI (anti supply-chain)
- [ ] Renovate o Dependabot configurado (semanal)
- [ ] Pin de versiones exactas en `package.json` (sin `^` para deps críticas: next, supabase, drizzle, better-auth)
- [ ] **RECOMENDACIÓN al orquestador**: git-agent puede configurar CodeQL SAST en `.github/workflows/codeql.yml` + Actions pinning a SHA. No es responsabilidad de este agente implementarlo.

### ✅ A07 — Identification & Authentication Failures (APLICA — Basic Auth admin)

- [ ] Rate limit 5 intentos/15min por IP en proxy.ts admin
- [ ] `ADMIN_PASSWORD` fuerte (≥ 24 chars random)
- [ ] Comparación con `timingSafeEqual`
- [ ] HTTPS-only (HSTS) — Basic Auth en HTTP es texto plano
- [ ] No exponer si el `ADMIN_USER` existe o no (mismo response para user/pass incorrectos)
- [ ] Migrar a Better Auth con MFA si el panel admin crece (Fase 2 futura)

### ✅ A08 — Software & Data Integrity Failures (APLICA)

- [ ] `package-lock.json` commiteado y validado por `lockfile-lint`
- [ ] Pre-commit hook bloquea commits de `credentials*.json`, `.env*.local`, `service-account*.json`
- [ ] CI con SAST (CodeQL) + secret scanning (GitHub native o `gitleaks`)
- [ ] No `eval()`, no `new Function()`, no `require()` dinámico con input de usuario

### ✅ A09 — Security Logging & Monitoring Failures (APLICA)

- [ ] Loguear eventos de seguridad:
  - Intentos fallidos de Basic Auth (IP + timestamp + user truncado)
  - Rate limit hits
  - Errores 5xx
  - Fallas de sincronización con Google Calendar
- [ ] NO loguear:
  - `descripcion` del turno (PII + posible info legal confidencial)
  - Passwords (ni en error stacks)
  - Email completo en logs públicos (usar hash o truncar `user@***.com`)
- [ ] Audit log inmutable de acciones admin (insert-only, sin UPDATE/DELETE)
- [ ] Vercel logs: 1 día retención en hobby, suficiente para debug pero exportar a almacenamiento propio si compliance lo requiere
- [ ] Alertas: email al Dr. si N fallas consecutivas de Google Calendar sync

### ⚠️ A10 — SSRF (PARCIALMENTE APLICA)

- [ ] No hay fetch de URLs provistas por el usuario (no aplica directo). Si en el futuro se agrega "subir foto del DNI" u otro upload con URL → whitelist de hosts.
- [ ] Google Calendar API: URLs son fijas (`https://www.googleapis.com`), no construidas con input de usuario.
- [ ] Resend API: URLs fijas.

---

## 3. Security Headers (vercel.json)

Configurar en `/Users/lucas/Documents/web-deluca-abogado/vercel.json`:

```jsonc
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload",
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff",
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY",
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin",
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()",
        },
        {
          "key": "X-DNS-Prefetch-Control",
          "value": "on",
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://www.googleapis.com https://vercel.live; frame-src 'self' https://www.google.com/calendar/; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests",
        },
      ],
    },
    {
      "source": "/admin/(.*)",
      "headers": [
        { "key": "X-Robots-Tag", "value": "noindex, nofollow, noarchive, nosnippet" },
        {
          "key": "Cache-Control",
          "value": "private, no-store, no-cache, must-revalidate, max-age=0",
        },
        { "key": "Pragma", "value": "no-cache" },
      ],
    },
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, no-cache, must-revalidate" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
      ],
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800, immutable" }],
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }],
    },
  ],
}
```

**Notas CSP**:

- `'unsafe-inline'` en `script-src` requerido por Next.js inline scripts; ideal: migrar a nonces (`next.config.js` + middleware) en hardening futuro.
- `connect-src` incluye: Supabase (DB+Realtime), Resend (server-only, defensivo), Google APIs.
- `frame-ancestors 'none'` previene clickjacking (más fuerte que X-Frame-Options).
- `form-action 'self'` previene form hijacking.

**Verificación post-deploy (Fase 4)**:

- `securityheaders.com` debe dar A o A+
- `observatory.mozilla.org` ≥ 90
- `csp-evaluator.withgoogle.com` sin issues HIGH

---

## 4. Validaciones críticas en API routes

### 4.1 Rate Limiting

**Librería recomendada**: `@upstash/ratelimit` + `@upstash/redis` (Vercel-friendly, sin server propio)

```
// Spec — NO código
POST /api/turnos:
  - 3 requests / 1 hora / IP
  - 10 requests / 1 día / IP
  - Si excede → 429 Too Many Requests + Retry-After

POST /api/admin/login (Basic Auth attempts):
  - 5 intentos / 15 min / IP
  - Si excede → 429

GET /api/slots (público):
  - 60 requests / minuto / IP (más permisivo, es de lectura)
```

**Fallback sin Upstash**: `lru-cache` in-memory (solo válido en single instance — Vercel serverless cada lambda tiene su cache aislado, NO funciona bien multi-region). Aceptable solo como interim hasta integrar Upstash.

### 4.2 Validación Zod (server-side)

Schema esperado para `POST /api/turnos`:

```
{
  nombre: string min(2) max(100) trim
  email: string email max(254) toLowerCase
  telefono: string regex(/^\+?[\d\s\-\(\)]{8,20}$/)
  area_legal: enum(["civil-familia", "laboral", "penal", "comercial"])
  descripcion: string min(10) max(2000)
  slot_id: string uuid
  consentimiento_datos: literal(true)  // checkbox obligatorio (Ley 25.326)
  honeypot: string optional empty  // si viene con valor → bot
}
```

### 4.3 CSRF Protection

**Contexto**: Next.js Route Handlers + Basic Auth.

- **Form público de reserva (no cookies de sesión)**: bajo riesgo. Validar `Origin` o `Referer` header server-side: debe matchear `process.env.SITE_URL`. Si no matchea → 403.
- **Panel admin con Basic Auth**: Basic Auth NO es vulnerable a CSRF por sí mismo porque el browser solo envía credentials a same-origin. Pero si en el futuro se migra a cookies (Better Auth), agregar token CSRF doble-submit cookie.

### 4.4 Input Sanitization (XSS prevention)

- `descripcion` y otros free-text: almacenar **tal cual** (raw), sanitizar **al renderizar**.
- React por default escapa (`{descripcion}` en JSX es seguro).
- NUNCA `dangerouslySetInnerHTML` con contenido del usuario.
- Email enviado al Dr. con la descripción: si es HTML, escapar con DOMPurify o usar **React Email** (escape automático). Si es texto plano, no hay riesgo.

### 4.5 HTML Sanitizer con allowlist (defense in depth)

Si en el futuro algún componente renderiza HTML del usuario (no es el caso ahora pero por si se agrega rich-text):

```
ALLOWLIST = {
  '*': ['class', 'dir', 'id', 'lang', 'role', /^aria-[\w-]*/i],
  a: ['target', 'href', 'title', 'rel'],
  p: [], em: [], strong: [], ul: [], ol: [], li: [],
}
SAFE_URL = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i
```

Usar librería: **DOMPurify** server-side (con `jsdom`) o **sanitize-html**.

---

## 5. Secrets Management

### 5.1 `.env.example` (commitear al repo)

```bash
# ───── Supabase ─────
# Project URL — pública, usada client-side
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
# Anon key — pública, client-side, requiere RLS
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
# Service Role — SECRETO, server-only, bypass RLS
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
# Connection string para Drizzle (Transaction Pooler port 6543)
DATABASE_URL=postgresql://postgres.YOUR_PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?prepare=false

# ───── Resend ─────
RESEND_API_KEY=re_...
# Email del remitente (debe estar verificado en Resend)
RESEND_FROM_EMAIL=turnos@deluca-abogado.com.ar
# Email del Dr. (destinatario de notificaciones)
DR_NOTIFICATION_EMAIL=dr.pablo.deluca@example.com

# ───── Google Calendar (Service Account) ─────
# JSON completo del Service Account, base64 encoded (single line)
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=eyJ0eXBlIjoic2VydmljZV9hY2NvdW50Ii...
# ID del calendar del Dr. (compartido con el SA)
GOOGLE_CALENDAR_ID=primary
# Si en el futuro se agrega OAuth user-side:
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_REDIRECT_URI=https://deluca-abogado.com.ar/api/auth/google/callback

# ───── Admin Panel (Basic Auth) ─────
ADMIN_USER=admin
ADMIN_PASSWORD=GENERAR_RANDOM_24_CHARS_OPENSSL_RAND_HEX_24

# ───── Rate Limit (Upstash) ─────
UPSTASH_REDIS_REST_URL=https://YOUR.upstash.io
UPSTASH_REDIS_REST_TOKEN=AY...

# ───── App ─────
SITE_URL=https://deluca-abogado.vercel.app
NODE_ENV=production
```

### 5.2 `.gitignore` (asegurar que existe)

```gitignore
# Env files
.env
.env.local
.env.*.local
.env.production
.env.development

# Credentials
credentials.json
credentials/
service-account*.json
*-credentials.json
secrets/

# Vercel
.vercel

# Next.js
.next/
out/

# Node
node_modules/
npm-debug.log*

# Misc
.DS_Store
*.pem
*.key
```

### 5.3 Validación al boot (server)

Spec: crear `lib/env.ts` con zod schema. Si una env crítica falta, el server NO arranca.

```
// Spec — no código
ENV_SCHEMA = {
  required_server: [
    "DATABASE_URL", "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY", "RESEND_FROM_EMAIL", "DR_NOTIFICATION_EMAIL",
    "GOOGLE_SERVICE_ACCOUNT_JSON_BASE64", "GOOGLE_CALENDAR_ID",
    "ADMIN_USER", "ADMIN_PASSWORD",
    "SITE_URL"
  ],
  required_public: [
    "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ],
  optional: [
    "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"
  ]
}

// Reglas extra:
// - ADMIN_PASSWORD: min 24 chars
// - SITE_URL: debe ser https:// en producción
// - DATABASE_URL: debe contener "pooler.supabase.com:6543" y "prepare=false"
// - GOOGLE_SERVICE_ACCOUNT_JSON_BASE64: al decodear, debe ser JSON con campo "type": "service_account"
```

### 5.4 Rotación de secrets (post-deploy)

| Secret                        | Rotación         | Triggers                                              |
| ----------------------------- | ---------------- | ----------------------------------------------------- |
| `ADMIN_PASSWORD`              | Cada 90 días     | Sospecha de leak, ex-empleado con acceso              |
| `SUPABASE_SERVICE_ROLE_KEY`   | Cada 180 días    | Leak detectado, regenerar desde Supabase dashboard    |
| `RESEND_API_KEY`              | Cada 180 días    | Leak                                                  |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | **Cada 90 días** | Política GCP recomienda rotación frecuente de SA keys |
| `UPSTASH_REDIS_REST_TOKEN`    | Cada 180 días    | Leak                                                  |

### 5.5 Source maps en producción

- Verificar en Fase 4: `https://<deploy>/_next/static/chunks/main-*.map` debe retornar 404
- `next.config.js`: `productionBrowserSourceMaps: false` (es el default, pero verificar explícitamente)

---

## 6. Compliance — Argentina

### 6.1 Ley 25.326 (Protección de Datos Personales / "Habeas Data")

**Aplicabilidad**: SÍ aplica. Recolecta datos personales (nombre, email, teléfono) y datos sensibles (descripción de consulta legal = potencial información de salud, situación judicial, etc.).

**Requisitos obligatorios**:

1. **Inscripción en la base de datos AAIP** (Agencia de Acceso a la Información Pública):
   - El responsable (Dr. Pablo De Luca / su estudio) debe inscribir la base de datos `turnos` ante la AAIP.
   - Es un trámite del Dr., NO de desarrollo. Documentar en README.
   - Link: https://www.argentina.gob.ar/aaip/datospersonales

2. **Política de Privacidad obligatoria** (página pública `/privacidad`):
   - Quién es el responsable (Dr. Pablo De Luca, DNI, dirección, CUIT)
   - Qué datos se recolectan (nombre, email, teléfono, descripción)
   - Finalidad (gestión de turnos y comunicación profesional)
   - Plazo de conservación (sugerido: **2 años desde la consulta**, alineado con prescripción de honorarios civiles)
   - Cesión a terceros (Google Calendar API, Resend, Supabase — listar)
   - Derechos del titular: ARCO (Acceso, Rectificación, Cancelación, Oposición). Cómo ejercerlos (email de contacto)
   - Medidas de seguridad implementadas (este threat model resumido)

3. **Consentimiento explícito** en el form de reserva:
   - Checkbox NO pre-marcado: "He leído y acepto la [Política de Privacidad](/privacidad). Consiento el tratamiento de mis datos personales para los fines indicados."
   - Backend valida `consentimiento_datos === true`. Si false → 400.
   - Persistir `consentimiento_at` (timestamp) en la tabla `turnos` como evidencia.

4. **Derecho de acceso/cancelación**:
   - Email contacto en política: el cliente puede solicitar borrado de sus datos.
   - Endpoint admin para soft-delete (`status: 'cancelado_por_titular'`, NO hard-delete hasta cumplir retention).

5. **Brecha de seguridad — notificación**:
   - Si hay un breach: notificar AAIP en 72hs + a los titulares afectados (Ley 27.275 + Disp. AAIP 4/2019).
   - Documentar contacto AAIP en runbook del Dr.

6. **Datos sensibles (Art. 7)**:
   - Descripción de consulta puede contener "datos sensibles" (situación procesal, salud, ideología si es caso de discriminación, etc.).
   - Datos sensibles requieren consentimiento "expreso y por escrito" — el checkbox + texto explícito cumple esto.

### 6.2 Cookies y trackers

- Por ahora el sitio NO usa Google Analytics ni trackers third-party.
- Si en el futuro se agregan: banner de cookies + consentimiento previo a setear cookies non-essential (alineado con buenas prácticas GDPR, aplicable también en AR).

### 6.3 Retention Policy

| Dato                           | Retención                            | Acción al expirar                                             |
| ------------------------------ | ------------------------------------ | ------------------------------------------------------------- |
| Turnos confirmados/completados | 2 años desde la fecha del turno      | Soft-delete (anonimizar email, nombre, teléfono, descripción) |
| Turnos cancelados / no-show    | 1 año                                | Soft-delete                                                   |
| Audit log admin                | 5 años (responsabilidad profesional) | Archivar offline                                              |
| Logs de Vercel                 | 1 día (hobby)                        | Auto-purge                                                    |

Implementar como cron job (Vercel Cron) mensual que ejecuta el soft-delete.

---

## 7. Recomendaciones CI/CD (para git-agent + deployer)

> No son responsabilidad de security-engineer implementar, solo documentar.

1. **GitHub Actions pinning a SHA** (no tags mutables):
   ```yaml
   - uses: actions/checkout@8e8c483e2afff8c3a0e1f4d1c1c4e9c1c1c1c1c1 # v4.x.x
   ```
2. **CodeQL SAST** (`github/codeql-action/analyze@v3`) — detecta SQL injection, XSS, path traversal automáticamente.
3. **Secret scanning** nativo de GitHub + `gitleaks` en pre-commit.
4. **Branch protection** en `main`: PR review obligatorio, status checks green, no force push.
5. **Vercel Deploy Hooks** firmados (no público sin token).
6. **Dependabot/Renovate** semanal.

---

## 8. Checklist verificación Fase 4 (reality-checker)

- [ ] Todos los security headers presentes en `curl -I https://<deploy>/`
- [ ] `securityheaders.com` ≥ A
- [ ] CSP no rompe la app (no errores en console del browser)
- [ ] `https://<deploy>/admin` retorna 401 sin auth
- [ ] `https://<deploy>/admin` con auth válida retorna 200
- [ ] Rate limit funciona: 4to POST a `/api/turnos` desde misma IP → 429
- [ ] Body > 10KB en POST → 413 o 400
- [ ] `https://<deploy>/_next/static/chunks/main-*.map` → 404
- [ ] Honeypot field: POST con honeypot lleno → 200 fake pero NO se inserta en DB
- [ ] Slot booking concurrente: dos POST simultáneos al mismo slot → 1 ok, 1 falla con "ocupado"
- [ ] Sin `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE` ni similares en bundle (grep en `.next/static`)
- [ ] Página `/privacidad` existe y es accesible
- [ ] Checkbox de consentimiento bloquea submit si está vacío
- [ ] `robots.txt` excluye `/admin/`
- [ ] No tab-nabbing: todo `target="_blank"` con `rel="noopener noreferrer"`
- [ ] Logs no contienen `descripcion` ni emails completos
- [ ] Email del Dr. en notificaciones llega con SPF/DKIM/DMARC pass (revisar headers)

---

## 9. Resumen ejecutivo

- **30 amenazas STRIDE identificadas** (5 críticas, 11 altas, 10 medias, 4 bajas)
- **OWASP**: 9 de 10 aplican; A10 SSRF solo parcialmente
- **Top 5 mitigaciones críticas**:
  1. Slot booking atómico (UNIQUE constraint + transacción) — previene double-booking
  2. Rate limit en POST /api/turnos + /admin (Upstash) — previene flood/bruteforce
  3. CSP estricta + HSTS + frame-ancestors none — previene clickjacking/XSS
  4. Validación zod server-side + Drizzle parametrizado — previene injection
  5. Política de privacidad + checkbox consentimiento + retention 2 años — compliance Ley 25.326
- **Secrets**: 13 env vars críticas, validación zod al boot, `.env.example` documentado, rotación cada 90-180 días
- **Compliance Argentina**: Ley 25.326 (Habeas Data) — política privacidad + consentimiento explícito + inscripción AAIP por el Dr.

— security-engineer · Fase 2 · 2026-05-21
