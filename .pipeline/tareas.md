# Tareas — web-deluca-abogado (SCOPE AMPLIADO)

Fecha: 2026-05-21 (revisión post-Visual Checkpoint)
Total: **47 tareas** | Tiempo estimado: ~35 horas (47 × 45 min)
Stack: Next.js 16 App Router + Turbopack | Supabase Postgres (Pooler 6543, postgres.js, prepare:false) | Drizzle ORM | Tailwind 4 (CSS-first @theme) + shadcn/ui | GSAP + Lenis (sutil) | Resend | Google Calendar API v3 (Service Account JWT) | Upstash Ratelimit
Estructura: single-repo (app standalone Next.js, admin en `/admin`)

---

## Decisión Better Auth: POSTERGADO (sin cambios)

`/admin/*` con HTTP Basic Auth via `proxy.ts` (env `ADMIN_USER` + `ADMIN_PASSWORD`). Better Auth queda para Fase 2.

---

## Cambios vs planificación original

| Aspecto             | Original (24 tareas)                   | Ampliado (47 tareas)                                                                  |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| Hero                | Stats counter en sección Experience    | Bloque "Proceso 3 pasos" debajo del hero + micro-meta disponibilidad + FAB Emergencia |
| Sección casos       | Timeline 20XX o stats (decidido stats) | 3 cards narrativas anonimizadas (hardcoded inicialmente)                              |
| Calculadoras        | —                                      | **3 nuevas**: despido / cuota alimentaria / ART                                       |
| Recursos            | —                                      | **Nuevo**: 4 PDFs descargables + lead gating                                          |
| Blog/Guías          | —                                      | **Nuevo**: 2-3 artículos seed + admin Markdown + `/blog/[slug]`                       |
| Triaje WhatsApp     | —                                      | **Nuevo**: wizard 3 pasos → wa.me pre-armado                                          |
| Glosario            | —                                      | **Nuevo**: A-Z con 80-100 términos + URLs individuales                                |
| Verificador despido | —                                      | **Nuevo**: form 5 preguntas + diagnóstico                                             |
| Proceso divorcio    | —                                      | **Nuevo**: timeline scroll-driven Lenis + GSAP                                        |
| Sello matrícula     | —                                      | **Nuevo**: componente footer + About con link Colegio                                 |
| Rate-limit          | In-memory Map                          | **Upstash Redis** (multi-instance Vercel)                                             |
| Tabla DB            | 1 (`bookings`)                         | 4 (`bookings`, `leads_descarga`, `blog_posts`, `glosario_terminos`)                   |

---

## Gaps identificados (datos pendientes del Dr., NO bloquean dev)

1. **Email del Dr.** — `RESEND_TO_EMAIL` antes Fase 5. Dev usa `dev@example.com`.
2. **Número matrícula + URL Colegio Abogados Mendoza** — sello en footer. Dev usa `MAT-XXXX` + URL placeholder.
3. **Fotos Dr. y estudio** — `data-placeholder="true"`. Reemplazo manual post-deploy.
4. **Horarios atención** — default L-V 09-13 + 16-20, configurable.
5. **Direcciones + Google Maps embed URL** — placeholder configurable en `site-config.ts`.
6. **Datos reales de los 3 casos narrativos** — copy inventado verosímil con disclaimer "ejemplos anonimizados".
7. **6-8 hitos del proceso divorcio** — generación inicial con base AR genérica, revisión Dr. post-deploy.
8. **Fórmulas exactas calculadoras** — implementación basada en Ley 20.744 (LCT), Ley 24.557 (ART), criterios jurisprudenciales Mendoza. Revisión legal pre-launch obligatoria.
9. **4 PDFs descarga** — generación inicial por dev como `.pdf` placeholders con disclaimer, reemplazo Dr.
10. **2-3 artículos blog seed** — dev redacta drafts, Dr. revisa.

---

## Riesgos técnicos + mitigaciones (actualizado)

| Riesgo                                                     | Mitigación                                                                                                                                                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cálculos legales inexactos** (despido/alimentos/ART)     | Disclaimer obligatorio "estimación orientativa, no sustituye asesoramiento". Fórmulas en `lib/legal/` con tests unitarios validando casos típicos. Link "Consultá personalizada" como CTA principal. |
| **Contenido legal sensible** (blog, glosario, verificador) | Cada página/término con disclaimer al pie. Verificador despido: badges (legal/dudoso/ilegal) acompañados de "consultá para análisis profesional".                                                    |
| **Doble reserva**                                          | UNIQUE partial index + transacción `SELECT FOR UPDATE`.                                                                                                                                              |
| **Timezone AR-3**                                          | UTC en DB, `date-fns-tz` siempre server-side.                                                                                                                                                        |
| **Resend rate limits**                                     | Retry exponential + fallback `pending_email` en DB.                                                                                                                                                  |
| **Lead gating evadible** (descargas)                       | Honeypot + Upstash rate-limit (3/h IP). Email verification opcional Fase 2.                                                                                                                          |
| **Glosario performance** (80-100 términos en SSG)          | `generateStaticParams` para todas las URLs `/glosario/[termino]` en build. Fuse.js client-side para búsqueda fuzzy.                                                                                  |
| **GSAP+Lenis bundle**                                      | Dynamic import GSAP solo en componentes con animación. Lenis tree-shakeable. Target main < 250KB gzip.                                                                                               |
| **Verificador despido — falsos positivos legales**         | Diagnóstico siempre con CTA "consulta personalizada". Texto "esta evaluación es orientativa y no sustituye análisis profesional".                                                                    |
| **Mixed Content / CSP**                                    | Auditar evidence-collector Fase 3. Todos los recursos externos en https. CSP relajada en `proxy.ts`.                                                                                                 |
| **CLS por web fonts**                                      | `next/font` con `display: swap` + `adjustFontFallback: true`. Preload weights críticos.                                                                                                              |
| **Schema.org duplicado** (varias páginas con LegalService) | Solo layout root inyecta `LegalService + LocalBusiness`. Páginas específicas inyectan tipos únicos (`SoftwareApplication`, `Article`, `FAQPage`, `DefinedTerm`).                                     |
| **Markdown admin XSS**                                     | Sanitize con `rehype-sanitize` antes de render.                                                                                                                                                      |
| **Triage WhatsApp link con caracteres especiales**         | `encodeURIComponent()` en cada paso del wizard.                                                                                                                                                      |

---

## TAREAS

### TAREA 0 — Project Infrastructure (OBLIGATORIA)

**Tipo**: config | **Dependencias**: ninguna
**Descripción**: Setup base Next.js 16 + tooling.

- `npx create-next-app@latest web-deluca-abogado --typescript --tailwind --app --turbopack --eslint --src-dir --import-alias "@/*"`
- Deps: `drizzle-orm postgres drizzle-kit gsap lenis resend zod date-fns date-fns-tz @googleapis/calendar @upstash/ratelimit @upstash/redis fuse.js react-markdown remark-gfm rehype-sanitize @react-email/components`
- DevDeps: `prettier eslint-config-prettier husky lint-staged vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom @next/bundle-analyzer bundlewatch`
- shadcn init (new-york, stone)
- `.env.example` con TODAS las vars: `DATABASE_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`, `GOOGLE_CALENDAR_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `ADMIN_USER`, `ADMIN_PASSWORD`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER=5492604614896`
- Estructura carpetas: `src/app`, `src/components/{ui,sections,booking,admin,calculators,blog,glossary,verifier,process,resources,triage,trust}`, `src/lib/{db,email,calendar,seo,legal,validations,ratelimit}`, `src/hooks`, `src/types`, `src/__tests__`, `public/{images/placeholders,icons,pdfs}`
  **Archivos**: `package.json`, `tsconfig.json`, `next.config.ts`, `.eslintrc.json`, `.prettierrc`, `.env.example`, `README.md`, `vitest.config.ts`, `.husky/pre-commit`
  **Criterio**: `npm run lint` pasa, `npm run build` con page default ok, `npm test` corre, README setup completo.

---

### TAREA 1 — Database schema completo (4 tablas) + Drizzle

**Tipo**: backend | **Dependencias**: 0
**Descripción**: Schema Postgres extendido con todas las tablas del scope ampliado.

- `src/lib/db/schema.ts`:
  - **bookings**: id uuid, client_name, client_email, client_phone, legal_area enum, description, slot_start_utc timestamptz, slot_end_utc timestamptz, status enum('confirmed','cancelled','completed'), google_event_id, notification_status enum, timestamps. **PARTIAL UNIQUE INDEX** `(slot_start_utc) WHERE status='confirmed'`.
  - **leads_descarga**: id, nombre, email, area_interes enum (civil_familia/laboral/penal/comercial/general), recurso_slug text, ip text, user_agent text, created_at. INDEX `(email)`, `(recurso_slug)`.
  - **blog_posts**: id, slug text UNIQUE, title, excerpt, content_md text, content_html text, area_legal enum, author text default 'Dr. Pablo De Luca', published boolean default false, published_at timestamptz NULL, seo_title text NULL, seo_description text NULL, og_image text NULL, timestamps. INDEX `(slug)`, `(published, published_at DESC)`.
  - **glosario_terminos**: id, slug text UNIQUE, termino text, letra char(1), definicion_corta text, definicion_larga text, area_legal text NULL, sinonimos text[] NULL, terminos_relacionados text[] NULL, timestamps. INDEX `(letra)`, `(slug)`.
- `src/lib/db/index.ts`: postgres.js con `prepare: false` (Pooler 6543), pool 1.
- `drizzle.config.ts` + scripts `db:generate`, `db:push`, `db:studio`.
- Seeds básicos: `src/lib/db/seeds/glosario.ts` con 30-40 términos iniciales, `seeds/blog.ts` con 2-3 drafts.
  **Archivos**: `src/lib/db/schema.ts`, `src/lib/db/index.ts`, `src/lib/db/seeds/*.ts`, `drizzle.config.ts`
  **Criterio**: `npm run db:push` aplica las 4 tablas. Seeds ejecutables vía `npm run db:seed`. Tipos TS exportados para cada tabla.

---

### TAREA 2 — Time/timezone utilities + horarios config

**Tipo**: backend | **Dependencias**: 0
**Descripción**: Lógica de generación de slots.

- `src/lib/schedule-config.ts`: L-V 09-13 + 16-20, slot 45min, anticipación 24h, ventana 30 días.
- `src/lib/holidays-ar.ts`: feriados nacionales 2026.
- `src/lib/slots.ts`: `generateAvailableSlots(from, to, takenUtc): Slot[]` con date-fns-tz zona Mendoza.
- Tests `src/__tests__/slots.test.ts`: 5+ casos edge (DST, feriado, pasado, tomado, anticipación).
  **Archivos**: ídem | **Criterio**: tests pasan. Semana actual sin feriados retorna slots.

---

### TAREA 3 — Email templates + Resend client

**Tipo**: backend | **Dependencias**: 0
**Descripción**: Sistema emails transaccionales con templates extendidos.

- `src/lib/email/client.ts`: Resend con retry exponential (3 intentos: 1s, 2s, 4s).
- Templates `@react-email/components`:
  - `booking-client.tsx` — confirmación turno cliente
  - `booking-doctor.tsx` — notificación Dr.
  - `booking-cancel-client.tsx` — cancelación cliente
  - `lead-descarga.tsx` — entrega PDF al lead (`/recursos`)
  - `lead-descarga-doctor.tsx` — notificación lead capturado al Dr.
- `src/lib/email/send.ts`: funciones tipadas por template.
- Dev fallback: sin `RESEND_API_KEY` → console.log + return ok.
  **Criterio**: Templates renderizan HTML responsive. Snapshots en tests.

---

### TAREA 4 — Google Calendar Service Account

**Tipo**: backend | **Dependencias**: 0
**Descripción**: Integración GCal Service Account JWT.

- `src/lib/calendar/client.ts` + `events.ts`: `createBookingEvent`, `cancelBookingEvent`, `listBookedSlots`.
- Dev fallback con mock `dev-mock-${uuid}`.
- Doc inline para crear Service Account en GCP + compartir calendario.
  **Criterio**: Función callable. Sin creds → mock.

---

### TAREA 5 — Upstash Ratelimit module

**Tipo**: backend | **Dependencias**: 0
**Descripción**: Rate-limit reusable para todos los formularios públicos.

- `src/lib/ratelimit/index.ts`: factory `createLimiter(name, max, window)` con `@upstash/ratelimit` + `@upstash/redis`.
- Limiters preconfigurados: `bookingLimiter` (3/h IP + 5/día IP), `leadLimiter` (5/h IP + 10/día IP), `triageLimiter` (sin DB, solo 30/h IP para tracking).
- Dev fallback: si no hay `UPSTASH_REDIS_REST_URL`, in-memory Map con misma API.
- Helper `getClientIp(headers)`.
  **Archivos**: `src/lib/ratelimit/index.ts`, `src/lib/ratelimit/limiters.ts`
  **Criterio**: 4to request mismo IP en ventana → bloqueado. Dev sin Upstash funciona con in-memory.

---

### TAREA 6 — Lógica legal (fórmulas calculadoras + verificador)

**Tipo**: backend | **Dependencias**: 0
**Descripción**: Módulo de cálculos legales con tests exhaustivos. Aislado de UI.

- `src/lib/legal/indemnizacion-despido.ts`:
  - Art. 245 LCT: 1 mes sueldo por año (mejor remuneración normal y habitual), tope 3x prom convencional.
  - Art. 232: preaviso (15d período prueba, 1m antigüedad ≤5y, 2m antigüedad >5y).
  - Art. 233: SAC proporcional.
  - Art. 80: multa por falta entrega certificados (3 sueldos si aplica).
  - Function: `calcularDespido({sueldoBruto, antiguedadAnios, antiguedadMeses, tipoDespido, preavisoOtorgado}): {desglose, total}`
- `src/lib/legal/cuota-alimentaria.ts`:
  - Orientativa: % sobre sueldo bruto según N hijos (1 hijo 20%, 2 hijos 30%, 3+ hijos 40%, ajustable por edades menores 6 años).
  - Function: `calcularCuota({sueldoBruto, nHijos, edades}): {porcentaje, montoEstimado, disclaimer}`
- `src/lib/legal/indemnizacion-art.ts`:
  - Ley 24.557 + 26.773: VIBM (valor ingreso base mensual) × 53 × % incapacidad × coef edad (65/edad).
  - Adicional pago único 20% (art. 3 Ley 26.773) si accidente in itinere/laboral.
  - Function: `calcularART({sueldoBruto, porcentajeIncapacidad, edad, tipoAccidente}): {desglose, total}`
- `src/lib/legal/verificador-despido.ts`:
  - 5 preguntas: tipo, preaviso, antigüedad, registración, motivo.
  - Function: `evaluarDespido(input): {diagnostico: 'legal'|'dudoso'|'ilegal', razones: string[], recomendacion: string}`
- Tests `src/__tests__/legal/*.test.ts`: 10+ casos por calculadora con expectativas verificadas contra ejemplos reales.
  **Archivos**: `src/lib/legal/*.ts`, `src/__tests__/legal/*.test.ts`
  **Criterio**: Tests pasan con casos típicos. Funciones documentadas con JSDoc referenciando artículos LCT/ART.

---

### TAREA 7 — Server Actions de booking (core flow)

**Tipo**: backend | **Dependencias**: 1, 2, 3, 4, 5
**Descripción**: Server Actions reservar/consultar.

- `src/app/actions/bookings.ts`:
  - `getAvailableSlots(from, to)` — DB + GCal merge.
  - `createBooking(input)` — Zod valid, `SELECT FOR UPDATE`, insert, gcal event, 2 emails. UNIQUE violation → error claro.
- `src/lib/validations/booking.ts`: Zod (nombre, email, phone AR, area, descripción, honeypot).
- Integrar `bookingLimiter` por IP.
  **Criterio**: Reserva ok → DB+email+gcal. Doble reserva → bloqueada. Honeypot lleno → rechazo silencioso.

---

### TAREA 8 — Server Actions de leads, blog y glosario

**Tipo**: backend | **Dependencias**: 1, 3, 5, 6
**Descripción**: Server Actions para features adicionales.

- `src/app/actions/leads.ts`:
  - `submitLeadDescarga(input)` — Zod, honeypot, ratelimit, insert, email PDF al lead + notif al Dr.
  - Retorna URL firmada o path al PDF.
- `src/app/actions/calculators.ts`:
  - `calcularYGuardarLead(tipo, calculo, optEmail?)` — opcional capturar email post-cálculo.
- `src/app/actions/blog-admin.ts`:
  - `createOrUpdatePost(input)` — admin only, Zod, sanitize MD, persistir.
  - `deletePost(id)`, `publishPost(id)`, `unpublishPost(id)`.
- `src/app/actions/glosario-admin.ts`:
  - `createOrUpdateTermino`, `deleteTermino`.
- `src/lib/validations/{lead,blog,glosario}.ts`
  **Criterio**: Cada action validable + ratelimit. Admin actions verifican header Basic Auth (proxy ya filtra, doble check).

---

### TAREA 9 — Layout root + fonts + Lenis + metadata + site-config

**Tipo**: frontend | **Dependencias**: 0
**Descripción**: Setup global + config central.

- `src/lib/site-config.ts`: const exportado con todos los datos placeholder (nombre Dr., matrícula, dirección, teléfono, email contacto, whatsapp, redes, mapa embed URL, horarios). Fuente única de verdad para reemplazo rápido pre-deploy.
- `src/app/layout.tsx`: html lang="es-AR", `next/font/google` (Playfair Display 400/700, Inter 400/500/700, swap + adjustFontFallback), Lenis provider, metadata base, schema.org LegalService+LocalBusiness root.
- `src/app/globals.css`: Tailwind 4 `@theme` con variables (navy #0F1E3D, gold #C9A961, bone #FAF7F2, charcoal #1A1A1A), reset, typography base, focus-visible.
- `src/components/providers/lenis-provider.tsx`: client, lerp 0.1, honra reduced-motion.
- `src/app/sitemap.ts` + `src/app/robots.ts` (placeholder, se completan en T44).
  **Criterio**: Carga sin errores, fonts sin FOUT, scroll smooth, schema root valida.

---

### TAREA 10 — UI primitives (shadcn customizados)

**Tipo**: frontend | **Dependencias**: 9
**Descripción**: Componentes base.

- shadcn add: button, input, textarea, label, select, card, dialog, sonner, skeleton, calendar, popover, alert, badge, tabs, accordion, progress, separator.
- Customizar variants en `button.tsx` (primary navy+gold, secondary outline gold, ghost, destructive red, success green), tamaños sm/md/lg/icon.
- `src/components/layout/container.tsx`: `max(24px, calc((100vw - 1200px) / 2))`.
- `src/components/layout/section.tsx`: py-16 md:py-24 lg:py-32.
- `src/components/ui/disclaimer.tsx`: bloque amarillo suave con icon "ⓘ" para disclaimers legales reutilizable.
  **Criterio**: Paleta correcta, contraste AA, focus visible.

---

### TAREA 11 — Header + Footer + FABs (WhatsApp + Emergencia 24h) + Sello Matrícula

**Tipo**: frontend | **Dependencias**: 10
**Descripción**: Estructura común + trust signals.

- `src/components/layout/header.tsx`: sticky, logo placeholder, nav (Inicio, Áreas, Casos, Calculadoras [dropdown], Recursos, Blog, Glosario, Contacto, CTA "Reservar"). Hamburger mobile con Dialog. Scroll change bg transparente→bone shadow.
- `src/components/layout/footer.tsx`: 3 cols (Contacto, Áreas+Recursos, Legal), bottom row copyright + redes + **Sello Matrícula** componente. Bg navy + texto bone.
- `src/components/trust/sello-matricula.tsx`: badge con número matrícula + link al Colegio Abogados Mendoza (`site-config.matriculaUrl`). Usable en footer + About + página específica.
- `src/components/layout/whatsapp-float.tsx`: FAB esquina inf der, `wa.me/5492604614896`, pulse sutil, aparece scroll >200px.
- `src/components/layout/emergencia-float.tsx`: FAB rojo pill "Emergencia 24h", apilado encima del WhatsApp. Click → `wa.me/...?text=URGENTE...`. aria-label claro.
  **Criterio**: Header responsive, FABs apilados sin overlap, sello con link real placeholder, A11y tab nav correcta.

---

### TAREA 12 — Hero rediseñado + Proceso 3 pasos + Micro-meta disponibilidad

**Tipo**: frontend | **Dependencias**: 10
**Descripción**: Hero según mock visual-direction.html.

- `src/components/sections/hero.tsx`: min-h-[90vh], bg `::after` con placeholder marcado, overlay navy 70%.
- Contenido: kicker "Estudio Jurídico" gold, h1 Playfair word-by-word reveal (GSAP SplitText o manual span stagger), subtítulo, párrafo intro, **2 CTAs** (primary "Reservar Consulta", secondary "Conocer Áreas"), **micro-meta disponibilidad** debajo de CTAs (`"Próximo turno disponible: {fecha}"` con dot pulsante verde — server component fetch `getNextAvailableSlot()`).
- `src/components/sections/proceso-3-pasos.tsx`: SECCIÓN nueva inmediatamente debajo del hero. 3 cards horizontales: "1. Consulta inicial sin cargo" → "2. Estrategia + honorarios claros" → "3. Acompañamiento al cierre". Iconos numéricos circulares gold + texto.
- Animación stagger entrada GSAP. Honra reduced-motion.
  **Archivos**: `src/components/sections/hero.tsx`, `src/components/sections/proceso-3-pasos.tsx`, `public/images/placeholders/hero-placeholder.jpg`
  **Criterio**: Visualmente impactante, micro-meta funcional (server data), proceso visible mobile (stack vertical). LCP <2.5s.

---

### TAREA 13 — Sección About + Trayectoria

**Tipo**: frontend | **Dependencias**: 11
**Descripción**: Biografía con sello matrícula.

- `src/components/sections/about.tsx`: grid 2 cols (foto 4/5 izq + texto der), 1 col mobile.
- Kicker "Trayectoria", h2 Playfair, 2-3 párrafos placeholder, 3-4 highlights con iconos (Matrícula CSJN/CAM, Universidad, Especializaciones).
- Integra `<SelloMatricula />` al pie de la sección.
- Animación scroll-trigger fade+up.
  **Criterio**: Layout limpio, mobile stack, placeholders evidentes, sello visible.

---

### TAREA 14 — Sección Áreas legales (2×2 cards)

**Tipo**: frontend | **Dependencias**: 10
**Descripción**: 4 cards Civil/Familia, Laboral, Penal, Comercial.

- `src/components/sections/practice-areas.tsx`: grid 2×2 desktop, 1 col mobile.
- Cada card: icon SVG en frame gold, h3 Playfair, descripción, 3-4 sub-temas, link "Más info" (ancla contacto en MVP).
- `src/lib/practice-areas-data.ts`: array tipado.
- Hover: card lift -4px, color invert sutil (sin rotación).
- Stagger 0.15s.
  **Criterio**: 4 cards, hover funciona, mobile colapsa.

---

### TAREA 15 — Sección Casos Resueltos Narrativos (3 cards)

**Tipo**: frontend | **Dependencias**: 10
**Descripción**: Reemplaza Experience/timeline stats por casos narrativos.

- `src/components/sections/casos-resueltos.tsx`: 3 cards horizontales (stack vertical mobile).
- `src/lib/casos-data.ts`: array hardcoded inicial:
  1. "Despido 12 años antigüedad → indemnización completa cobrada"
  2. "Divorcio comunicacional → cuidado compartido sin litigio"
  3. "Sucesión con 4 herederos → partición homologada en 8 meses"
- Cada card: badge área legal, h3 título, párrafo narrativo 2-3 líneas, métricas finales (monto/tiempo).
- **Disclaimer obligatorio** visible al pie: "Casos reales anonimizados. Resultados no garantizados."
- Animación stagger scroll-triggered.
- Estructurado para migrar a Supabase en futuro (tabla `casos` queda fuera de MVP).
  **Criterio**: 3 cards renderizan, disclaimer visible, copy verosímil.

---

### TAREA 16 — Sección Contacto + Mapa + CTA agenda

**Tipo**: frontend | **Dependencias**: 10
**Descripción**: Sección final landing.

- `src/components/sections/contact.tsx`: grid 2 cols. Izq: info contacto (dirección, tel, email, horarios, mapa iframe `site-config.mapEmbedUrl`). Der: card CTA "Reservá tu consulta online" → `/reservar`.
- Schema.org `LocalBusiness` adicional inline si difiere de root (sólo si necesario).
  **Criterio**: Info legible, mapa carga, CTA navega.

---

### TAREA 17 — Triaje WhatsApp wizard (componente)

**Tipo**: frontend | **Dependencias**: 10
**Descripción**: Wizard 3 pasos → wa.me pre-armado.

- `src/components/triage/triage-wizard.tsx`: client component, 3 steps.
  - Paso 1 Área (4 cards: Civil/Familia, Laboral, Penal, Comercial).
  - Paso 2 Urgencia (3 opciones: Urgente/Esta semana/Sin apuro).
  - Paso 3 Tipo (3 opciones contextuales por área).
- Output: botón "Continuar por WhatsApp" → `https://wa.me/5492604614896?text=${encodeURIComponent(...)}` con mensaje pre-armado "Hola Dr., consulta de [ÁREA], urgencia [NIVEL], tipo [TIPO]".
- Navegación: progress bar visible, botón "Atrás" en pasos 2-3.
- Versión integrable: hero (compacta) + página dedicada `/consultar` (full).
  **Archivos**: `src/components/triage/triage-wizard.tsx`, `src/app/consultar/page.tsx`
  **Criterio**: Wizard funcional, encodeURIComponent correcto, mobile responsive, WhatsApp app/web abre con texto.

---

### TAREA 18 — Landing — Composición página principal

**Tipo**: frontend | **Dependencias**: 11, 12, 13, 14, 15, 16, 17
**Descripción**: Ensamblar `/` con todas las secciones.

- `src/app/page.tsx`: Hero → Proceso3Pasos → PracticeAreas → CasosResueltos → About → TriageWizard (versión compacta opcional) → Contact.
- Metadata específica: title "Dr. Pablo De Luca | Abogado en San Rafael, Mendoza", description optimizada SEO local.
- Verificar transiciones sin breaks bruscos de color.
  **Criterio**: Landing renderiza sin warnings, navegación por anchors funciona, sin scroll horizontal mobile.

---

### TAREA 19 — Página /reservar — Calendario + slots

**Tipo**: frontend | **Dependencias**: 7, 11
**Descripción**: UI selección turno.

- `src/app/reservar/page.tsx`: server component, fetch inicial `getAvailableSlots()` 30 días.
- `src/components/booking/booking-flow.tsx`: stepper 3 pasos.
- Paso 1: Calendar shadcn destacando días con slots, deshabilitando feriados/sin disponibilidad. Click día → grid slots HH:mm AR. Loading skeleton + empty state ("No hay turnos, WhatsApp") + error retry.
  **Criterio**: Calendar renderiza, TZ Mendoza correcto, mobile usable, estados implementados.

---

### TAREA 20 — Página /reservar — Form + submit

**Tipo**: frontend | **Dependencias**: 19, 7
**Descripción**: Paso 2-3 + submit.

- Form: nombre, email, teléfono (+54 fijo), select área, textarea desc (max 500 + counter), checkbox términos+privacidad, honeypot oculto, botón confirmar.
- Validación client Zod + react-hook-form. Errores inline.
- Submit → `createBooking`. Loading. OK → paso 3 + clear. Slot tomado → toast + back to paso 1 + refresh.
- Paso 3: card éxito ícono check gold, resumen turno AR, "Te enviamos confirmación", botón "Volver".
- A11y: labels, aria-live errores, focus mgmt.
  **Criterio**: Valida client+server. OK → paso 3 + email. Doble reserva concurrente UX clara.

---

### TAREA 21 — Calculadora Indemnización Despido (`/calculadora/indemnizacion-despido`)

**Tipo**: fullstack | **Dependencias**: 6, 11
**Descripción**: Página + form + cálculo art. 245/232/233/80 LCT.

- `src/app/calculadora/indemnizacion-despido/page.tsx`: server component, metadata específica, schema.org SoftwareApplication JSON-LD.
- `src/components/calculators/despido-form.tsx`: client component.
  - Inputs: sueldo bruto mensual, fecha ingreso (date picker), fecha despido (default hoy), tipo despido (sin causa / con causa rechazada / mutuo acuerdo), preaviso otorgado (sí/no), recibió cert. art. 80 (sí/no).
  - Output: desglose con cada concepto (art. 245, 232, 233, multa 80) + total. Tarjeta resultado destacada.
  - **Disclaimer obligatorio** arriba y abajo: "Estimación orientativa. Cada caso requiere análisis profesional."
  - CTA "Consultá personalizada" → `/reservar?area=laboral`.
  - Opcional: capturar email para enviar resumen PDF (server action `calcularYGuardarLead`).
- Lógica importada de `src/lib/legal/indemnizacion-despido.ts` (T6).
  **Archivos**: ídem | **Criterio**: Cálculo correcto vs casos test. Schema valida. Mobile usable. Disclaimer prominente.

---

### TAREA 22 — Calculadora Cuota Alimentaria (`/calculadora/cuota-alimentaria`)

**Tipo**: fullstack | **Dependencias**: 6, 11
**Descripción**: Similar a T21.

- Inputs: sueldo bruto obligado, N hijos, edades (dynamic array), zona (Mendoza default).
- Output: % estimado + monto orientativo + disclaimer fuerte "Varía según jurisdicción y circunstancias."
- Schema.org SoftwareApplication.
- CTA "Consultá personalizada" → `/reservar?area=civil_familia`.
  **Criterio**: Cálculo razonable, disclaimer visible.

---

### TAREA 23 — Calculadora Indemnización ART (`/calculadora/indemnizacion-art`)

**Tipo**: fullstack | **Dependencias**: 6, 11
**Descripción**: Similar a T21/22.

- Inputs: sueldo bruto, % incapacidad, edad, tipo accidente (trabajo / in itinere / enf profesional).
- Output: desglose Ley 24.557 + adicional 20% Ley 26.773.
- Disclaimer ART.
- CTA `/reservar?area=laboral`.
  **Criterio**: ídem T21/T22.

---

### TAREA 24 — Index de calculadoras + Dropdown header

**Tipo**: frontend | **Dependencias**: 21, 22, 23
**Descripción**: Pequeña página índice + actualizar nav.

- `src/app/calculadora/page.tsx`: lista 3 calculadoras como cards con descripción + CTA. Schema breadcrumbs.
- Actualizar `header.tsx` con dropdown "Calculadoras" listando las 3.
  **Criterio**: Index renderiza, dropdown funciona, navegación OK.

---

### TAREA 25 — Centro de descargas `/recursos` + lead gating

**Tipo**: fullstack | **Dependencias**: 8, 11
**Descripción**: Página + 4 PDFs + form gating.

- `src/app/recursos/page.tsx`: lista 4 cards de recursos:
  1. Modelo de poder general
  2. Modelo de carta documento
  3. Guía "¿Qué hacer si te despidieron?"
  4. Guía "Pasos para iniciar una sucesión en Mendoza"
- `src/components/resources/resource-card.tsx`: card con icon, título, descripción, botón "Descargar" → abre Dialog con form.
- `src/components/resources/lead-form.tsx`: nombre + email + área interés + honeypot + checkbox términos. Submit → `submitLeadDescarga` → muestra link descarga + envía email.
- PDFs placeholder en `public/pdfs/`: generar 4 PDFs simples con disclaimer "Documento ejemplo, no reemplaza asesoramiento legal".
- Rate-limit `leadLimiter`.
  **Archivos**: ídem + `public/pdfs/{poder,carta-documento,guia-despido,guia-sucesion}.pdf`
  **Criterio**: Form valida, descarga se entrega, lead persiste DB, email llega, ratelimit funciona.

---

### TAREA 26 — Blog público: lista + detalle

**Tipo**: fullstack | **Dependencias**: 8, 11
**Descripción**: `/blog` y `/blog/[slug]`.

- `src/app/blog/page.tsx`: lista paginada (10/página) de posts publicados, ordenados por `published_at DESC`. Cards con cover placeholder, excerpt, área, fecha. Paginación URL `?page=2`.
- `src/app/blog/[slug]/page.tsx`: detalle. Render Markdown con `react-markdown + remark-gfm + rehype-sanitize`. TOC opcional con anclas. Author bio + CTA reservar al final.
- `generateStaticParams` para slugs publicados.
- Schema.org Article + FAQPage (si el post contiene preguntas).
- Metadata dinámica (title, description, OG).
- Disclaimer legal al pie.
  **Criterio**: Lista paginada funciona, detalle renderiza MD seguro, schema valida en Rich Results Test.

---

### TAREA 27 — Blog admin: editor Markdown en `/admin/blog`

**Tipo**: fullstack | **Dependencias**: 8, 26, 41 (proxy)
**Descripción**: CRUD posts simple.

- `src/app/admin/blog/page.tsx`: lista posts con filtro published/draft, botones edit/delete/publish.
- `src/app/admin/blog/new/page.tsx` y `[id]/edit/page.tsx`: form con título, slug (auto-generado desde título), excerpt, area_legal select, textarea Markdown grande (con preview side-by-side básico), seo_title, seo_description, og_image URL, switch publicar.
- Server Actions `createOrUpdatePost`, `deletePost`, `publishPost`.
- Sanitización Markdown server-side antes de guardar `content_html`.
  **Criterio**: CRUD completo funcional. Preview Markdown visible. Slug único validado.

---

### TAREA 28 — Glosario `/glosario` lista + filtro letras + búsqueda

**Tipo**: fullstack | **Dependencias**: 8, 11
**Descripción**: Listado A-Z con búsqueda.

- `src/app/glosario/page.tsx`: server component, fetch todos los términos publicados.
- `src/components/glossary/glossary-index.tsx`: client component.
  - Strip A-Z con letras (deshabilitar las sin términos). Click letra → filtra.
  - Input búsqueda con Fuse.js (search en termino + definicion_corta).
  - Grid de términos por letra con definición corta + link "Ver más" → `/glosario/[slug]`.
- Seed inicial 30-40 términos en `db/seeds/glosario.ts` (T1).
- Schema.org `DefinedTermSet` en index.
  **Archivos**: ídem + `src/components/glossary/glossary-index.tsx`
  **Criterio**: Letras filtran, búsqueda funciona, lista actualizable via admin.

---

### TAREA 29 — Glosario detalle `/glosario/[termino]`

**Tipo**: fullstack | **Dependencias**: 28
**Descripción**: Página individual por término.

- `src/app/glosario/[termino]/page.tsx`: fetch por slug, render definición corta + larga, área legal asociada, sinónimos, términos relacionados (links).
- `generateStaticParams` para SSG.
- Metadata dinámica.
- Schema.org `DefinedTerm`.
- CTA "Consultá si necesitás ayuda con este tema" → `/reservar`.
  **Criterio**: URL única por término, schema valida, navegación entre relacionados.

---

### TAREA 30 — Glosario admin `/admin/glosario`

**Tipo**: fullstack | **Dependencias**: 28, 41
**Descripción**: CRUD términos.

- Lista filtrable por letra.
- Form: termino, slug (auto), letra (auto desde termino), definicion_corta, definicion_larga, area_legal, sinonimos (tag input), terminos_relacionados (multi-select otros términos).
- Server actions `createOrUpdateTermino`, `deleteTermino`.
  **Criterio**: CRUD funcional. Slug único.

---

### TAREA 31 — Verificador "¿Tu despido fue legal?" (`/verificador/despido`)

**Tipo**: fullstack | **Dependencias**: 6, 11
**Descripción**: Form 5 preguntas + diagnóstico.

- `src/app/verificador/despido/page.tsx`: metadata + schema SoftwareApplication.
- `src/components/verifier/despido-verifier.tsx`: client component, wizard 5 preguntas (cards de opciones por step):
  1. Tipo despido (sin causa / con causa / mutuo acuerdo / discriminatorio)
  2. ¿Te otorgaron preaviso? (sí escrito / sí verbal / no)
  3. Antigüedad (menos 3m / 3m-1a / 1-5a / 5-10a / 10+a)
  4. ¿Estabas registrado correctamente? (sí / parcialmente / no)
  5. ¿Te informaron motivo por escrito? (sí / no / verbal)
- Output: diagnóstico (badge color: verde "legal" / amarillo "dudoso" / rojo "ilegal") + razones bullet + recomendación.
- **CTA fuerte** "Consultá ahora — análisis profesional" → `/reservar?area=laboral`.
- Opción "Descargar resumen" (genera PDF on-the-fly con `@react-pdf/renderer` o link a PDF estático con datos básicos).
- Disclaimer obligatorio "esta evaluación es orientativa".
- Estructura replicable para futuros verificadores.
  **Lógica**: importada de `src/lib/legal/verificador-despido.ts` (T6).
  **Criterio**: Wizard funcional, diagnóstico coherente con tests T6, CTA prominente, disclaimer visible.

---

### TAREA 32 — Línea de tiempo proceso divorcio (`/proceso/divorcio`)

**Tipo**: frontend | **Dependencias**: 9, 11
**Descripción**: Infografía scroll-driven Lenis + GSAP ScrollTrigger.

- `src/app/proceso/divorcio/page.tsx`: metadata específica + schema HowTo.
- `src/components/process/divorce-timeline.tsx`: client, dynamic import GSAP.
  - 6-8 hitos verticales (desktop: alternar izq/der; mobile: stack vertical):
    1. Consulta inicial y reunión de documentación
    2. Análisis de causales y estrategia
    3. Demanda o convenio
    4. Notificación y audiencia
    5. Sentencia
    6. Liquidación bienes (si aplica)
    7. Cuidado personal y régimen comunicacional
    8. Inscripción registral
  - Cada hito: icono + título Playfair + descripción + duración estimada.
  - Animación: línea vertical que se "dibuja" con scroll (clip-path o SVG path stroke), hitos fade+slide al entrar viewport (ScrollTrigger).
  - Honra reduced-motion (sin animación).
- Disclaimer al pie + CTA reservar.
  **Criterio**: Animación scroll funciona, mobile stack vertical, accesible (no requiere mouse).

---

### TAREA 33 — Páginas legales (Privacidad + Términos)

**Tipo**: frontend | **Dependencias**: 10
**Descripción**: Compliance básico.

- `src/app/privacidad/page.tsx`: política Ley 25.326 (datos, retención, derechos ARCO).
- `src/app/terminos/page.tsx`: uso del sitio, reserva ≠ relación abogado-cliente, jurisdicción Mendoza.
- Linkear desde footer + form checkbox.
  **Criterio**: Renderizan legibles, linkeadas.

---

### TAREA 34 — Admin layout + Basic Auth proxy

**Tipo**: fullstack | **Dependencias**: 0
**Descripción**: Proxy.ts + layout admin.

- `src/proxy.ts` (Next.js 16): intercepta `/admin/*`, verifica `Authorization: Basic`, 401 con `WWW-Authenticate`. CSP relajada para admin si necesita inline editor.
- `src/app/admin/layout.tsx`: layout admin con nav lateral (Turnos, Blog, Glosario, Leads), header con "Cerrar sesión" (instrucción para limpiar credenciales del navegador).
- `X-Robots-Tag: noindex, nofollow` + `Cache-Control: no-store` para `/admin/*`.
  **Archivos**: `src/proxy.ts`, `src/app/admin/layout.tsx`
  **Criterio**: Sin creds → 401 prompt nativo. Con creds → admin layout. noindex aplicado.

---

### TAREA 35 — Admin turnos `/admin` (lista + cancelar)

**Tipo**: fullstack | **Dependencias**: 7, 34
**Descripción**: Gestión turnos.

- `src/app/admin/page.tsx`: lista turnos próximos 30 días + pasados 7, sorted by date. Filtros estado/área, search nombre/email.
- Cada row: fecha/hora AR, nombre, contacto, área, descripción truncada (expandible), status badge, notif status.
- Acción "Cancelar" → server action `cancelBooking(id)` → status='cancelled' + borra GCal event + email cancel cliente.
- Tabla responsive (cards mobile).
  **Criterio**: Lista renderiza, cancelar funciona end-to-end.

---

### TAREA 36 — Admin leads `/admin/leads`

**Tipo**: fullstack | **Dependencias**: 8, 34
**Descripción**: Vista leads_descarga.

- Lista paginada de leads con filtros (área interés, recurso, fecha).
- Export CSV button (server action genera CSV en memory).
- Sin edit (sólo visualización + export).
  **Criterio**: Lista renderiza, export CSV funciona.

---

### TAREA 37 — SEO completo: sitemap dinámico + schema.org global

**Tipo**: backend | **Dependencias**: 18, 26, 28, 32
**Descripción**: SEO base ampliado para todas las rutas.

- `src/app/sitemap.ts`: rutas estáticas (/, /reservar, /consultar, /privacidad, /terminos, /calculadora, /calculadora/\*, /recursos, /blog, /glosario, /proceso/divorcio, /verificador/despido) + dinámicas (`/blog/[slug]` y `/glosario/[termino]` fetch desde DB).
- `src/app/robots.ts`: allow all excepto `/admin`, `/api`.
- `src/lib/seo/schema.ts`: helpers tipados para `LegalService + LocalBusiness` (root), `SoftwareApplication` (calculadoras), `Article + FAQPage` (blog), `DefinedTerm` (glosario), `HowTo` (proceso), `BreadcrumbList` (todas).
- OG image dinámica: `src/app/opengraph-image.tsx` + `src/app/blog/[slug]/opengraph-image.tsx` con `next/og`.
  **Criterio**: Todos los schemas validan en Schema.org Validator + Rich Results Test. Sitemap accesible.

---

### TAREA 38 — Performance: fonts, images, bundle, code-splitting

**Tipo**: frontend | **Dependencias**: 18, 32
**Descripción**: Core Web Vitals.

- `next/font` swap + adjustFontFallback verificado.
- `next/image` con sizes + priority en hero.
- Blur placeholders en imágenes grandes.
- GSAP: dynamic import + `ssr: false` solo en componentes que lo usan (hero, casos, proceso divorcio).
- Lenis: solo `prefers-reduced-motion: no-preference`.
- Bundle analyzer: `npm run analyze`. Verificar main < 250KB gzip.
- Calculadoras + verificador + glosario index: code-splitting verificado (cada ruta su chunk).
- Lighthouse target: Performance > 85, A11y > 95.
  **Criterio**: build reporta sizes esperados, Lighthouse > 85, LCP < 2.5s, CLS < 0.1.

---

### TAREA 39 — Security headers + Vercel config + CSP

**Tipo**: config | **Dependencias**: 34
**Descripción**: Headers production.

- `vercel.json`:
  - Global `(.*)`: X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera=(), microphone=(), geolocation=()), Strict-Transport-Security max-age=63072000.
  - `/admin/(.*)`: X-Robots-Tag noindex,nofollow + Cache-Control no-store.
  - `/_next/static/(.*)`: max-age=31536000 immutable.
  - `/images/(.*)`, `/pdfs/(.*)`: max-age=604800.
- CSP en `proxy.ts` (default-src 'self', script-src 'self' 'unsafe-inline' embed maps, img-src 'self' data: https:, font-src 'self' data:, frame-src https://www.google.com).
- Validar PDFs servidos con `Content-Disposition: attachment` + content-type correcto.
  **Criterio**: securityheaders.com grade B+, CSP no rompe assets, PDFs descargan correctamente.

---

### TAREA 40 — Error pages + not-found + loading states

**Tipo**: frontend | **Dependencias**: 18
**Descripción**: Estados error/carga globales + por ruta.

- `src/app/error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx`.
- Por ruta crítica: `reservar/{loading,error}.tsx`, `calculadora/[slug]/{loading,error}.tsx`, `blog/{loading,error}.tsx`, `glosario/{loading,error}.tsx`, `verificador/despido/error.tsx`.
- UX consistente: icon, mensaje, retry button, link WhatsApp fallback.
  **Criterio**: 404 custom funciona, error boundaries renderizan, loading visible.

---

### TAREA 41 — Testing + QA prep + bundlewatch

**Tipo**: config | **Dependencias**: 20, 21, 22, 23, 25, 27, 30, 31, 35, 36, 39
**Descripción**: Tests + checklist + gates.

- Vitest unit tests:
  - `slots.test.ts` (5+ casos) ✓ ya en T2
  - `validations/*.test.ts` (booking, lead, blog, glosario)
  - `legal/*.test.ts` (10+ casos cada calculadora + verificador) ✓ ya en T6
  - `ratelimit.test.ts`
- Smoke E2E manual: documentar en `QA-CHECKLIST.md` (25+ items):
  - Flujo reserva completo desktop + mobile
  - Cancelación admin end-to-end
  - Calculadora despido con caso real
  - Calculadora cuota alimentaria
  - Calculadora ART
  - Verificador despido (caso ilegal claro)
  - Descarga PDF con lead capture
  - Blog: navegación + post detalle + sitemap
  - Glosario: filtro letra + búsqueda + término individual
  - Proceso divorcio: scroll animation + reduced-motion
  - Triaje WhatsApp: 3 pasos → link correcto
  - Sello matrícula footer + about
  - FAB emergencia visible + WhatsApp encima
  - Email transaccional recibido (dev console o real)
  - Schema.org valida todas las páginas
  - Headers seguridad presentes
  - 404 + loading visible
- `bundlewatch`: main < 250KB gzip, total JS < 400KB gzip, calculadoras < 100KB.
- Script `npm run check`: lint + tsc --noEmit + test + build.
  **Criterio**: `npm run check` verde. QA-CHECKLIST con 25+ items. Bundle dentro de límites.

---

### TAREAS PLACEHOLDER ELIMINADAS POR CONSOLIDACIÓN

_(las tareas 42-47 originales del scope ampliado se integraron arriba — la numeración final llega a T41 + admins ya cubiertos)_

> **Nota de numeración**: el plan ampliado consolida 47 unidades de trabajo en 41 tareas numeradas formalmente (algunas tareas grandes encapsulan 2-3 sub-features). Las features del scope no eliminadas:
>
> - Hero rediseñado → T12
> - Proceso 3 pasos → T12
> - Casos narrativos → T15
> - 3 calculadoras → T21, T22, T23 (+ index T24)
> - Centro descargas → T25
> - Blog público + admin → T26, T27
> - Triaje WhatsApp → T17
> - Glosario público + detalle + admin → T28, T29, T30
> - Verificador despido → T31
> - Timeline divorcio → T32
> - Sello matrícula → T11 (+ uso en T13, footer)
> - Admin leads → T36

---

## BATCHES (orden ejecución dev loop)

### BATCH 1 — Foundation (T0, T1, T2, T9)

**Paralelizables internamente**: T1, T2, T9 después de T0.
Infra + DB schema (4 tablas) + utilidades de tiempo + layout root + site-config. Sin UI visible aún. Habilita todo lo demás.

### BATCH 2 — Backend services (T3, T4, T5, T6)

**Paralelizables**: las 4 tareas son completamente independientes entre sí (sólo dependen de T0).
Email + Google Calendar + Upstash Ratelimit + lógica legal con tests. Lógica core sin UI.

### BATCH 3 — Server Actions (T7, T8)

**Paralelizables**: T7 y T8 (ambas dependen de Batch 2, pero diferentes dominios).
Booking actions + Leads/Blog/Glosario actions. Cierre del backend.

### BATCH 4 — UI primitives + chrome (T10, T11)

Secuencial: T10 → T11 (header/footer usan primitives).
shadcn customizados + header/footer/FABs/sello matrícula. Habilita todas las páginas.

### BATCH 5 — Landing sections (T12, T13, T14, T15, T16, T17, T18)

**Paralelizables**: T12, T13, T14, T15, T16, T17 (todas dependen de Batch 4, secciones independientes).
**Secuencial al final**: T18 (composición) depende de las 6 anteriores.
Hero + proceso + about + áreas + casos + contacto + triaje wizard + composición. Producto visual completo.

### BATCH 6 — Booking flow (T19, T20)

Secuencial: T19 → T20.
Calendar + form + success. Feature crítica.

### BATCH 7 — Calculadoras (T21, T22, T23, T24)

**Paralelizables**: T21, T22, T23 (independientes entre sí, dependen de T6+T11).
**Secuencial**: T24 (index) al final.
3 calculadoras legales + index + dropdown header.

### BATCH 8 — Magnets de contenido (T25, T26, T27)

**Paralelizables internamente**: T25 (recursos) y T26 (blog público) son independientes.
**Secuencial**: T27 (blog admin) después de T26.
Recursos PDF + blog público + blog admin.

### BATCH 9 — Glosario + Verificador + Proceso (T28, T29, T30, T31, T32)

**Paralelizables**: T28 → T29 → T30 (glosario lineal). T31 (verificador) y T32 (proceso) independientes y paralelizables con cualquiera de las 3 de glosario.
Glosario A-Z + verificador despido + timeline divorcio.

### BATCH 10 — Compliance + Admin (T33, T34, T35, T36)

**Paralelizables**: T33 (legales) independiente. T34 (proxy + layout admin) primero, luego T35 y T36 en paralelo.
Privacidad/Términos + Basic Auth + admin turnos + admin leads.

### BATCH 11 — Certificación final (T37, T38, T39, T40, T41)

**Paralelizables**: T37 (SEO), T38 (perf), T39 (security), T40 (errors) — todas independientes entre sí.
**Secuencial al final**: T41 (testing + QA) después de las 4 anteriores.
SEO + Performance + Security + Errors + Testing/QA. Cierre pre-Fase 4.

---

## ORDEN RECOMENDADO DE BATCHES

1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11

**Justificación**: foundation primero (sin DB no hay nada), backend services antes que actions, actions antes que UI que las consume, primitives antes que secciones, landing visible temprano para QA temprano del visual, después features de captura (booking + calculadoras + recursos), luego contenido seed (blog/glosario), luego cumplimiento+admin, cierre con cert.

---

## DEPENDENCIAS CRÍTICAS (top 5)

1. **T1 (DB schema 4 tablas) bloquea TODO el backend** — sin las 4 tablas (bookings, leads_descarga, blog_posts, glosario_terminos) no se pueden hacer server actions ni admin. Es la dependencia más cara si se omite.
2. **T6 (lógica legal) bloquea las 3 calculadoras + verificador** — si falla T6 se invalidan 4 tareas (T21, T22, T23, T31). Tests exhaustivos en T6 son no-negociables.
3. **T34 (proxy Basic Auth + admin layout) bloquea T27, T30, T35, T36** — todo el admin depende de proxy funcionando. Sin proxy → admin expuesto público.
4. **T11 (header + footer + FABs + sello) bloquea TODAS las páginas de contenido** — sin chrome común no se puede componer ninguna sección.
5. **T18 (composición landing) bloquea evidence-collector visual de la home** — sin landing ensamblada no hay QA visual de marketing.

---

## TAREAS PARALELIZABLES POR BATCH

| Batch | Paralelizables (mismo agente puede hacer secuencial; varios agentes en paralelo posible) |
| ----- | ---------------------------------------------------------------------------------------- |
| 1     | T1, T2, T9 después de T0 (3 simultáneas)                                                 |
| 2     | T3, T4, T5, T6 (4 simultáneas independientes)                                            |
| 3     | T7 y T8 (2 simultáneas)                                                                  |
| 5     | T12, T13, T14, T15, T16, T17 (6 simultáneas, luego T18 secuencial)                       |
| 7     | T21, T22, T23 (3 simultáneas, luego T24)                                                 |
| 8     | T25 y T26 (2 simultáneas, luego T27)                                                     |
| 9     | T28→T29→T30 (glosario lineal); T31 y T32 paralelos a glosario                            |
| 10    | T33 paralelo a T34; T35 y T36 paralelos después de T34                                   |
| 11    | T37, T38, T39, T40 (4 simultáneas, luego T41)                                            |

**Total tareas paralelizables**: ~28 de 42 (67%).

---

## RIESGOS NUEVOS DE LAS FEATURES AÑADIDAS

1. **Calculadoras legales con fórmulas inexactas → exposición legal del Dr.** — un cálculo mal puede dañar reputación. Mitigación: disclaimer obligatorio + tests con 10+ casos por calculadora + revisión legal del Dr. pre-launch.

2. **Contenido del Dr. pendiente (matrícula, fórmulas exactas, dirección, fotos, casos)** — el sitio quedará con placeholders post-deploy. Mitigación: `site-config.ts` centraliza todos los placeholders para reemplazo en <30 minutos. Bloqueador deploy a producción real (Fase 5).

3. **Verificador despido → diagnóstico erróneo genera expectativa equivocada** — usuario asume "ilegal" y entra en conflicto sin asesoría. Mitigación: badge + texto siempre acompañado de "esta evaluación es orientativa", CTA principal "Consultá ahora".

4. **Glosario performance + SEO interno** — 80-100 URLs `/glosario/[termino]` pueden inflar sitemap y diluir authority. Mitigación: `generateStaticParams` para SSG, schema `DefinedTerm` por término, internal linking entre términos relacionados. Empezamos con 30-40 términos.

5. **Lead gating evadible + spam descargas** — bots pueden vaciar PDFs y llenar tabla leads. Mitigación: honeypot + Upstash ratelimit (5/h IP) + email opcional verification Fase 2. Monitor Vercel logs primer mes.

---

## RESUMEN EJECUTIVO

- **42 tareas** numeradas (vs 24 originales) — **+18 tareas** netas para 12 features nuevas.
- **11 batches** lógicos (vs 7 originales) — **+4 batches** organizativos.
- **Time estimado**: ~31h dev continuo (vs ~18h original).
- **Better Auth**: sigue postergado (Basic Auth via proxy).
- **Google Calendar**: Service Account (sin cambios).
- **Upstash Ratelimit nuevo**: reemplaza in-memory para multi-instance Vercel.
- **4 tablas DB**: bookings + leads_descarga + blog_posts + glosario_terminos.
- **Tareas paralelizables**: 28 de 42 (67%) — alto throughput posible con paralelismo.
- **Bloqueadores deploy**: datos del Dr. (8 items en Gaps) — desarrollo NO bloqueado.
