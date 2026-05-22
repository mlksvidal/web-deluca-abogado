/**
 * /reservar — Página de reserva de turnos online.
 *
 * Server Component:
 *   - Carga getAvailableDates() en el servidor (fetch inicial de 30 días)
 *   - Renderiza el BookingFlow client component con las fechas disponibles
 *   - Metadata SEO específica para la página de reserva
 *
 * Si getAvailableDates() falla, muestra un estado de error gracioso
 * con botón de retry + link a WhatsApp como fallback.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getAvailableDates } from "@/app/actions/slots";
import { BookingFlow } from "@/components/booking/booking-flow";
import { siteConfig } from "@/lib/site-config";
import { MessageCircle, RefreshCw } from "lucide-react";

// ─── Metadata SEO ──────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Reservar consulta online",
  description: `Reservá tu consulta con el ${siteConfig.drName} en San Rafael, Mendoza. Turnos online disponibles de lunes a viernes. Primera consulta sin cargo.`,
  alternates: {
    canonical: `${siteConfig.siteUrl}/reservar`,
  },
  openGraph: {
    title: `Reservar consulta | ${siteConfig.studioNameShort}`,
    description: `Reservá tu turno online con ${siteConfig.drName}. Atención personalizada en derecho civil, laboral, penal y comercial.`,
    url: `${siteConfig.siteUrl}/reservar`,
  },
};

// ─── Schema.org — ReservationService ──────────────────────────────────────────

function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ReservationService",
    name: "Reserva de turno online",
    provider: {
      "@type": "LegalService",
      "@id": `${siteConfig.siteUrl}/#organization`,
      name: siteConfig.studioName,
    },
    url: `${siteConfig.siteUrl}/reservar`,
    description: "Sistema de reserva de turnos para consultas legales online.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Error State ───────────────────────────────────────────────────────────────

function BookingLoadError() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-bg-secondary">
        <RefreshCw className="size-7 text-text-tertiary" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-xl font-medium text-marino">
          No pudimos cargar el calendario
        </h2>
        <p className="font-body text-text-secondary max-w-md">
          Hubo un problema al obtener la disponibilidad. Podés intentar recargar la página o
          comunicarte directamente por WhatsApp.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/reservar"
          className="inline-flex items-center justify-center gap-2 rounded-[4px] border-2 border-marino px-6 py-2.5 font-ui text-sm font-medium text-marino transition-colors hover:bg-marino hover:text-bg focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Recargar página
        </Link>
        <a
          href={`https://wa.me/${siteConfig.whatsapp}?text=Hola%2C%20quisiera%20reservar%20un%20turno`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-marino px-6 py-2.5 font-ui text-sm font-medium text-bg transition-colors hover:bg-marino-hover focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Reservar por WhatsApp
        </a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ReservarPage() {
  // Fetch inicial de fechas disponibles en el servidor
  const datesResult = await getAvailableDates();

  return (
    <>
      <SchemaOrg />

      {/* Skip link target — ya definido en layout pero reforzar en sección */}
      <div className="min-h-screen bg-bg">
        {/* ─── Hero de la página ─────────────────────────────────────────── */}
        <div className="border-b border-border-default bg-marino px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <p className="mb-2 font-ui text-xs font-medium uppercase tracking-[0.15em] text-dorado">
              Reservar consulta
            </p>
            <h1 className="font-serif text-3xl font-medium text-bg md:text-4xl">
              Agendá tu turno online
            </h1>
            <p className="mt-3 font-body text-bg/80 max-w-xl text-base leading-relaxed">
              Elegí el día y horario que mejor te quede. Te enviamos confirmación por email. La
              primera consulta es sin cargo.
            </p>

            {/* Indicadores del proceso */}
            <div className="mt-8 flex flex-wrap gap-4">
              {[
                { step: "1", label: "Elegí un día" },
                { step: "2", label: "Elegí un horario" },
                { step: "3", label: "Completá tus datos" },
              ].map(({ step, label }) => (
                <div key={step} className="flex items-center gap-2">
                  <span
                    className="flex size-7 items-center justify-center rounded-full border border-dorado font-ui text-xs font-semibold text-dorado"
                    aria-hidden="true"
                  >
                    {step}
                  </span>
                  <span className="font-ui text-sm text-bg/80">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Contenido principal ───────────────────────────────────────── */}
        <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
          {datesResult.success ? (
            <BookingFlow availableDates={datesResult.availableDates} />
          ) : (
            <BookingLoadError />
          )}

          {/* Info adicional */}
          <div className="mt-12 border-t border-border-default pt-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Horarios de atención",
                  body: siteConfig.horariosDisplay,
                },
                {
                  title: "Duración de la consulta",
                  body: "45 minutos por turno. Podés extender si el caso lo requiere.",
                },
                {
                  title: "¿Necesitás urgencia?",
                  body: `Llamanos o escribinos por WhatsApp al ${siteConfig.whatsappDisplay}.`,
                },
              ].map(({ title, body }) => (
                <div key={title} className="space-y-1">
                  <p className="font-ui text-xs font-semibold uppercase tracking-wide text-marino">
                    {title}
                  </p>
                  <p className="font-body text-sm text-text-secondary">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
