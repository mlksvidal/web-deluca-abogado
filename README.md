# Estudio Jurídico Dr. Pablo De Luca — Sitio Web

Stack: Next.js 16 App Router · TypeScript · Tailwind CSS 4 · shadcn/ui · Drizzle ORM · Supabase PostgreSQL · Resend · Google Calendar API · Upstash Ratelimit

---

## Setup inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
# Editar .env.local con los valores reales
```

Variables requeridas para desarrollo local:

| Variable                       | Descripción                                                                |
| ------------------------------ | -------------------------------------------------------------------------- |
| `DATABASE_URL`                 | Connection string Supabase (Transaction Pooler port 6543, `prepare=false`) |
| `RESEND_API_KEY`               | API key de Resend (sin esto los emails van a console.log)                  |
| `RESEND_FROM_EMAIL`            | Email remitente verificado en Resend                                       |
| `RESEND_TO_EMAIL`              | Email del Dr. para notificaciones                                          |
| `GOOGLE_SERVICE_ACCOUNT_KEY`   | JSON del Service Account base64 encoded                                    |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Email del Service Account                                                  |
| `GOOGLE_CALENDAR_ID`           | ID del calendar del Dr.                                                    |
| `ADMIN_USER`                   | Usuario para panel admin                                                   |
| `ADMIN_PASSWORD`               | Contraseña admin (mínimo 24 chars)                                         |
| `UPSTASH_REDIS_REST_URL`       | URL de Upstash Redis (opcional, fallback in-memory)                        |
| `UPSTASH_REDIS_REST_TOKEN`     | Token de Upstash Redis                                                     |
| `NEXT_PUBLIC_SITE_URL`         | URL del sitio                                                              |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`  | Número de WhatsApp (sin + ni espacios)                                     |

> Sin `DATABASE_URL` el servidor no arranca. Sin `RESEND_API_KEY` los emails se loguean en console. Sin Upstash el ratelimit usa in-memory (no funciona multi-instancia en Vercel).

### 3. Aplicar el schema de la base de datos

```bash
npm run db:push
```

### 4. Cargar seeds iniciales (glosario + blog drafts)

```bash
npx dotenv -e .env.local -- npm run db:seed
```

### 5. Correr en desarrollo

```bash
npm run dev
# → http://localhost:3000
```

---

## Scripts disponibles

| Comando               | Descripción                        |
| --------------------- | ---------------------------------- |
| `npm run dev`         | Servidor de desarrollo (Turbopack) |
| `npm run build`       | Build de producción                |
| `npm run start`       | Servidor de producción local       |
| `npm run lint`        | ESLint                             |
| `npm run lint:fix`    | ESLint con auto-fix                |
| `npm run format`      | Prettier                           |
| `npm run type-check`  | TypeScript sin emit                |
| `npm test`            | Vitest (run)                       |
| `npm run test:ui`     | Vitest UI                          |
| `npm run check`       | lint + type-check + test + build   |
| `npm run db:generate` | Generar migraciones Drizzle        |
| `npm run db:push`     | Aplicar schema a la DB             |
| `npm run db:studio`   | Drizzle Studio                     |
| `npm run db:seed`     | Cargar seeds                       |
| `npm run analyze`     | Bundle analyzer                    |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout root (fonts, Lenis, metadata, Schema.org JSON-LD)
│   ├── page.tsx            # Landing (hero + secciones)
│   ├── globals.css         # Tailwind 4 @theme + paleta institucional
│   ├── sitemap.ts          # Sitemap dinámico (estáticas + DB blog/glosario)
│   ├── robots.ts           # Robots.txt (disallow /admin, /api)
│   ├── opengraph-image.tsx # OG image raíz generada con next/og
│   ├── not-found.tsx       # 404 custom con brand
│   ├── error.tsx           # Error boundary por ruta
│   ├── global-error.tsx    # Error boundary global (reemplaza root layout)
│   ├── loading.tsx         # Skeleton root
│   ├── blog/
│   │   ├── loading.tsx     # Skeleton del listado
│   │   ├── error.tsx
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── opengraph-image.tsx  # OG dinámico por post
│   ├── glosario/
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── [termino]/page.tsx
│   ├── reservar/
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── calculadora/
│   │   ├── indemnizacion-despido/loading.tsx
│   │   ├── cuota-alimentaria/loading.tsx
│   │   └── indemnizacion-art/loading.tsx
│   ├── verificador/despido/error.tsx
│   └── admin/loading.tsx
├── components/
│   ├── ui/                 # shadcn/ui + skeleton-card.tsx
│   ├── providers/          # LenisProvider (respeta prefers-reduced-motion)
│   ├── layout/             # Header, Footer, FABs
│   ├── sections/           # Hero, About, etc.
│   ├── booking/            # Flujo de reserva + calendario
│   ├── calculators/        # Calculadoras legales (3)
│   ├── blog/               # Blog cards + filters + pagination
│   ├── glossary/           # Glosario A-Z + búsqueda Fuse.js
│   ├── verifier/           # Verificador despido
│   ├── process/            # Timeline divorcio animada
│   ├── resources/          # PDFs + lead gating
│   ├── triage/             # Wizard WhatsApp 3 pasos
│   ├── trust/              # Sello matrícula
│   └── admin/              # Panel admin (turnos, leads, blog, glosario)
├── lib/
│   ├── db/
│   │   ├── index.ts        # Drizzle client (Transaction Pooler, prepare:false)
│   │   ├── schema.ts       # 4 tablas: bookings, leads_descarga, blog_posts, glosario_terminos
│   │   └── seeds/          # Seeds glosario + blog
│   ├── seo/schema.ts       # Helpers tipados: Article, FAQPage, HowTo, DefinedTerm, Calculator, Breadcrumb
│   ├── site-config.ts      # Fuente única de verdad (todos los datos del estudio)
│   ├── schedule-config.ts  # Horarios disponibles L-V 9-13 + 16-20
│   ├── holidays-ar.ts      # Feriados nacionales Argentina 2026
│   ├── slots.ts            # generateAvailableSlots()
│   ├── recursos-config.ts  # Configuración de PDFs descargables
│   ├── email/              # Resend + React Email templates
│   ├── calendar/           # Google Calendar Service Account
│   ├── ratelimit/          # Upstash + fallback in-memory
│   ├── legal/              # Calculadoras + verificador despido
│   └── validations/        # Schemas Zod (booking, lead, blog, glosario)
└── __tests__/
    ├── slots.test.ts
    ├── ratelimit.test.ts
    ├── email.test.ts
    ├── calendar.test.ts
    ├── actions/            # booking, leads, blog, glosario
    └── legal/              # indemnizacion-despido, cuota-alimentaria, art, verificador
```

---

## Base de datos

### Conexión Supabase

Usar siempre el **Transaction Pooler** (puerto 6543) con `prepare=false`:

```
DATABASE_URL=postgresql://postgres.YOUR_PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?prepare=false
```

### Tablas

| Tabla               | Descripción        |
| ------------------- | ------------------ |
| `bookings`          | Turnos reservados  |
| `leads_descarga`    | Leads de PDFs      |
| `blog_posts`        | Artículos del blog |
| `glosario_terminos` | Glosario jurídico  |

---

## Admin panel

Acceso en `/admin`. Protegido por HTTP Basic Auth via `src/proxy.ts` (→ T34).

Generar contraseña:

```bash
openssl rand -hex 24
```

---

## Google Calendar — Configuración post-deploy

1. Crear un **Service Account** en Google Cloud Console.
2. Otorgar acceso al calendario del Dr. con el email del Service Account.
3. Scope mínimo: `https://www.googleapis.com/auth/calendar.events` (solo en ese calendar).
4. Descargar el JSON de credenciales y codificarlo en base64:
   ```bash
   base64 -i credentials.json | tr -d '\n'
   ```
5. Agregar el resultado como `GOOGLE_SERVICE_ACCOUNT_KEY` en Vercel.
6. Rotar la clave cada 90 días (política de seguridad).

---

## Deploy en Vercel

```bash
# 1. Vincular proyecto
vercel link

# 2. Configurar env vars en Vercel dashboard (ver .env.example)

# 3. Deploy a producción
vercel deploy --prod
```

**Checklist pre-deploy**:

- [ ] Todas las env vars configuradas en Vercel (ver .env.example)
- [ ] `DATABASE_URL` apunta al Transaction Pooler de Supabase (puerto 6543)
- [ ] `ADMIN_PASSWORD` ≥ 24 chars aleatorios (`openssl rand -hex 24`)
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` en base64 configurado
- [ ] Dominio propio configurado en Vercel si aplica
- [ ] Dr. inscribió base de datos ante la AAIP (ver Compliance abajo)

---

## QA Checklist

Ver `QA-CHECKLIST.md` para el checklist manual completo de 25+ ítems.

---

## Compliance — Ley 25.326 (Argentina)

El Dr. debe inscribir la base de datos ante la AAIP antes del deploy en producción:
https://www.argentina.gob.ar/aaip/datospersonales

---

## Datos pendientes del Dr. (reemplazar en `src/lib/site-config.ts`)

1. Email real de contacto
2. Número de matrícula + URL Colegio Abogados Mendoza
3. Dirección del estudio + Google Maps embed URL
4. Fotos del Dr. y del estudio
5. Horarios reales de atención (default: L-V 09-13 + 16-20)
