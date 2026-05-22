/**
 * /reservar/confirmacion — Página de confirmación de turno.
 *
 * Server Component que recibe searchParams.id (UUID del booking).
 * Consulta la DB y muestra los detalles del turno confirmado.
 *
 * Si el booking no existe → notFound() (404)
 * Si el id no es UUID válido → notFound()
 * Si la DB falla → error boundary de Next.js
 *
 * Timezone: SIEMPRE convierte UTC → America/Argentina/Mendoza para mostrar.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { TIMEZONE } from "@/lib/schedule-config";
import { AREA_LEGAL_LABELS } from "@/lib/validations/booking";
import { siteConfig } from "@/lib/site-config";
import { CheckCircle2, Mail, Clock, MessageCircle, CalendarX, Home } from "lucide-react";
import type { BookingFormValues } from "@/lib/validations/booking";

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface ConfirmacionPageProps {
  searchParams: Promise<{ id?: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function formatDateMendoza(date: Date): string {
  return formatInTimeZone(date, TIMEZONE, "EEEE d 'de' MMMM 'de' yyyy", {
    locale: es,
  });
}

function formatTimeMendoza(date: Date): string {
  return formatInTimeZone(date, TIMEZONE, "HH:mm");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Metadata dinámica ────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Turno confirmado",
    description: `Tu consulta con ${siteConfig.drName} está confirmada. Revisá los detalles y esperá el email de confirmación.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ConfirmacionPage({ searchParams }: ConfirmacionPageProps) {
  const params = await searchParams;
  const id = params.id;

  // Validar UUID
  if (!id || !isValidUUID(id)) {
    notFound();
  }

  // Consultar booking
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);

  if (!booking) {
    notFound();
  }

  // Formatear fechas en TZ Mendoza
  const fechaDisplay = capitalize(formatDateMendoza(booking.slotStartUtc));
  const horaDisplay = formatTimeMendoza(booking.slotStartUtc);
  const areaLabel =
    AREA_LEGAL_LABELS[booking.legalArea as BookingFormValues["areaLegal"]] ?? booking.legalArea;

  // Mensaje WhatsApp de cancelación pre-armado
  const waMsg = encodeURIComponent(
    `Hola, quisiera cancelar mi turno del ${fechaDisplay} a las ${horaDisplay} hs. ID: ${booking.id.slice(0, 8)}`
  );
  const waUrl = `https://wa.me/${siteConfig.whatsapp}?text=${waMsg}`;

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        {/* ─── Header de éxito ──────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div
            className="mb-6 flex size-20 items-center justify-center rounded-full bg-marino"
            aria-hidden="true"
          >
            <CheckCircle2 className="size-10 text-dorado" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-marino md:text-4xl">
            Turno confirmado
          </h1>
          <p className="mt-3 font-body text-text-secondary max-w-md">
            Tu consulta está agendada. Revisá tu email para ver la confirmación con todos los
            detalles.
          </p>
        </div>

        {/* ─── Card con detalles del turno ─────────────────────────────── */}
        <div
          className="mb-8 overflow-hidden rounded-[6px] border border-border-default bg-white shadow-[var(--shadow-md)]"
          aria-label="Detalles del turno confirmado"
        >
          {/* Header marino */}
          <div className="bg-marino px-6 py-4">
            <p className="font-ui text-xs font-medium uppercase tracking-[0.12em] text-dorado">
              Detalles del turno
            </p>
            <p className="mt-1 font-serif text-lg font-medium text-bg">
              {fechaDisplay} a las {horaDisplay} hs
            </p>
          </div>

          {/* Body */}
          <dl className="divide-y divide-border-default">
            {[
              { label: "Cliente", value: booking.clientName },
              { label: "Email", value: booking.clientEmail },
              { label: "Teléfono", value: booking.clientPhone },
              { label: "Área legal", value: areaLabel },
              {
                label: "ID de reserva",
                value: (
                  <span className="font-mono text-xs text-text-tertiary">
                    {booking.id.slice(0, 8)}…
                  </span>
                ),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-0.5 px-6 py-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <dt className="min-w-[120px] font-ui text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  {label}
                </dt>
                <dd className="font-ui text-sm text-carbon">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ─── Pasos siguientes ─────────────────────────────────────────── */}
        <div className="mb-8 space-y-4">
          <h2 className="font-ui text-sm font-semibold uppercase tracking-wide text-marino">
            ¿Qué pasa ahora?
          </h2>
          <ul className="space-y-3" aria-label="Próximos pasos">
            {[
              {
                icon: Mail,
                text: `Te enviamos un email de confirmación a ${booking.clientEmail} con los detalles del turno.`,
              },
              {
                icon: Clock,
                text: `El turno tiene una duración de 45 minutos. Si necesitás más tiempo, avisanos al confirmar.`,
              },
              {
                icon: CalendarX,
                text: `Si necesitás cancelar, escribinos por WhatsApp con al menos 24 hs de anticipación.`,
              },
            ].map(({ icon: Icon, text }, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-[6px] bg-bg-secondary px-4 py-3"
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-marino" aria-hidden="true" />
                <p className="font-body text-sm text-text-secondary">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── CTAs ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[4px] border-2 border-marino px-6 py-2.5 font-ui text-sm font-medium text-marino transition-colors hover:bg-marino hover:text-bg focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
          >
            <Home className="size-4" aria-hidden="true" />
            Volver al inicio
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-marino px-6 py-2.5 font-ui text-sm font-medium text-bg transition-colors hover:bg-marino-hover focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Cancelar por WhatsApp
          </a>
        </div>

        {/* Nota legal */}
        <p className="mt-8 text-center font-ui text-xs text-text-tertiary">
          Turno confirmado bajo la{" "}
          <Link
            href="/privacidad"
            className="underline underline-offset-2 decoration-dorado hover:decoration-2"
          >
            Política de Privacidad
          </Link>{" "}
          del {siteConfig.studioNameShort}. Para cancelaciones sin cargo, hacelo con al menos 24 hs
          de anticipación.
        </p>
      </div>
    </div>
  );
}
