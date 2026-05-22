"use client";

/**
 * BookingForm — formulario de datos + submit de reserva (T20).
 *
 * Integración:
 *   - react-hook-form + @hookform/resolvers/zod
 *   - Schema Zod compartido en src/lib/validations/booking.ts
 *   - Submit → createBooking() server action
 *
 * Errores manejados:
 *   - slot_taken → toast error + callback onSlotTaken (limpia selección)
 *   - rate_limit → toast con minutos restantes
 *   - validation_error → errores inline por campo
 *   - internal_error | forbidden → toast genérico con contexto útil
 *
 * A11y:
 *   - aria-describedby para errores
 *   - aria-required en campos obligatorios
 *   - aria-live en mensajes de error de form
 *   - focus-visible en todos los controles
 *   - honeypot con aria-hidden + tabIndex -1
 */

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Clock, AlertCircle } from "lucide-react";

import { createBooking } from "@/app/actions/booking";
import {
  bookingFormSchema,
  type BookingFormValues,
  AREA_LEGAL_OPTIONS,
} from "@/lib/validations/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface BookingFormProps {
  selectedSlotUtc: string | null;
  selectedDateLabel: string;
  onSlotTaken: () => void;
  className?: string;
}

// ─── Helper: formatear slot para mostrar (sin TZ conversion aquí — usar label del slot) ──

function formatRetryTime(seconds: number): string {
  const mins = Math.ceil(seconds / 60);
  return mins === 1 ? "1 minuto" : `${mins} minutos`;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function BookingForm({
  selectedSlotUtc,
  selectedDateLabel,
  onSlotTaken,
  className,
}: BookingFormProps) {
  const router = useRouter();
  const [descLength, setDescLength] = React.useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      areaLegal: undefined,
      descripcion: "",
      slotStartUtc: selectedSlotUtc ?? "",
      consentimientoLey25326: false,
      _telefono_fijo: "",
    },
  });

  // Sincronizar slotStartUtc cuando cambia desde afuera
  React.useEffect(() => {
    setValue("slotStartUtc", selectedSlotUtc ?? "", { shouldValidate: false });
  }, [selectedSlotUtc, setValue]);

  // descLength se actualiza directamente desde el onChange del textarea

  // ─── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (data: BookingFormValues) => {
    // Construir teléfono completo con prefijo AR
    const telefonoCompleto = `+54 9 ${data.telefono}`;

    const result = await createBooking({
      ...data,
      telefono: telefonoCompleto,
    });

    if (result.success) {
      reset();
      router.push(`/reservar/confirmacion?id=${result.data.bookingId}`);
      return;
    }

    // Manejo de errores específicos
    switch (result.error) {
      case "slot_taken":
        toast.error("Ese turno ya fue reservado por otro cliente", {
          description: "Elegí otro horario para continuar.",
          duration: 6000,
        });
        onSlotTaken();
        break;

      case "rate_limit": {
        const mins = result.retryAfter ? formatRetryTime(result.retryAfter) : "unos minutos";
        toast.error("Demasiados intentos", {
          description: `Podés intentar de nuevo en ${mins}.`,
          duration: 8000,
        });
        break;
      }

      case "validation_error":
        toast.error("Revisá los datos del formulario", {
          description: "Hay campos con errores. Corregalos y volvé a intentar.",
        });
        // Los errores de campos los maneja react-hook-form inline
        break;

      case "forbidden":
        toast.error("Solicitud rechazada", {
          description: "Recargá la página e intentá de nuevo.",
        });
        break;

      default:
        toast.error("No pudimos procesar la reserva", {
          description:
            "Ocurrió un problema inesperado. Intentá de nuevo o comunicate por WhatsApp.",
          action: {
            label: "WhatsApp",
            onClick: () =>
              window.open(
                `https://wa.me/${siteConfig.whatsapp}?text=Hola%2C%20tuve%20un%20problema%20al%20reservar%20un%20turno`,
                "_blank"
              ),
          },
          duration: 10000,
        });
    }
  };

  // ─── Si no hay slot seleccionado, mostrar aviso ───────────────────────────

  if (!selectedSlotUtc) {
    return (
      <div
        id="booking-form"
        className={cn(
          "flex flex-col items-center gap-3 rounded-[6px] border border-dashed",
          "border-border-default bg-bg-secondary",
          "px-6 py-10 text-center",
          className
        )}
        role="status"
      >
        <Clock className="size-8 text-text-tertiary" aria-hidden="true" />
        <p className="font-ui text-sm text-text-secondary">
          Seleccioná un horario en el calendario para completar la reserva.
        </p>
      </div>
    );
  }

  // ─── Formulario ───────────────────────────────────────────────────────────

  return (
    <section
      id="booking-form"
      aria-labelledby="booking-form-title"
      className={cn("scroll-mt-28", className)}
    >
      {/* Slot seleccionado — confirmación visual */}
      <div
        className={cn("mb-6 flex items-center gap-3 rounded-[6px]", "bg-marino px-4 py-3")}
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="size-5 shrink-0 text-dorado" aria-hidden="true" />
        <div>
          <p className="font-ui text-xs font-medium uppercase tracking-wide text-dorado">
            Turno seleccionado
          </p>
          <p className="font-ui text-sm text-bg">{selectedDateLabel}</p>
        </div>
      </div>

      <h2 id="booking-form-title" className="mb-6 font-ui text-base font-semibold text-marino">
        Completá tus datos
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Formulario de reserva de turno"
        className="space-y-5"
      >
        {/* Honeypot — completamente oculto para humanos, no para bots */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <label htmlFor="telefono_fijo">No completar</label>
          <input
            id="telefono_fijo"
            tabIndex={-1}
            autoComplete="off"
            {...register("_telefono_fijo")}
          />
        </div>

        {/* Campo oculto: slotStartUtc */}
        <input type="hidden" {...register("slotStartUtc")} />

        {/* ─── Nombre ────────────────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <Label htmlFor="nombre">
            Nombre completo
            <span className="text-error ml-0.5" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="nombre"
            type="text"
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.nombre ? "nombre-error" : undefined}
            aria-invalid={!!errors.nombre}
            placeholder="Ej: María González"
            {...register("nombre")}
          />
          {errors.nombre && (
            <p
              id="nombre-error"
              role="alert"
              className="flex items-center gap-1.5 font-ui text-xs text-error"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.nombre.message}
            </p>
          )}
        </div>

        {/* ─── Email ─────────────────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email
            <span className="text-error ml-0.5" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-required="true"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            placeholder="tu@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="flex items-center gap-1.5 font-ui text-xs text-error"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* ─── Teléfono AR ───────────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <Label htmlFor="telefono">
            Celular
            <span className="text-error ml-0.5" aria-hidden="true">
              *
            </span>
          </Label>
          <div className="flex items-stretch gap-0">
            {/* Prefijo fijo +54 9 */}
            <div
              className={cn(
                "flex shrink-0 items-center px-3",
                "font-ui text-base font-medium text-text-secondary",
                "border border-r-0 border-border-default",
                "bg-bg-secondary",
                "rounded-l-[6px]",
                "select-none",
                errors.telefono && "border-error"
              )}
              aria-hidden="true"
            >
              +54 9
            </div>
            <Input
              id="telefono"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              aria-required="true"
              aria-label="Número de celular sin prefijo de país ni cero"
              aria-describedby={errors.telefono ? "telefono-error" : "telefono-hint"}
              aria-invalid={!!errors.telefono}
              placeholder="2604614896"
              className="rounded-l-none"
              maxLength={10}
              {...register("telefono")}
            />
          </div>
          {!errors.telefono && (
            <p id="telefono-hint" className="font-ui text-xs text-text-tertiary">
              10 dígitos sin 0 ni 15 (ej: 2604614896)
            </p>
          )}
          {errors.telefono && (
            <p
              id="telefono-error"
              role="alert"
              className="flex items-center gap-1.5 font-ui text-xs text-error"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.telefono.message}
            </p>
          )}
        </div>

        {/* ─── Área legal ────────────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <Label htmlFor="areaLegal">
            Área legal
            <span className="text-error ml-0.5" aria-hidden="true">
              *
            </span>
          </Label>
          <Select
            onValueChange={(val) =>
              setValue("areaLegal", val as BookingFormValues["areaLegal"], { shouldValidate: true })
            }
          >
            <SelectTrigger
              id="areaLegal"
              aria-required="true"
              aria-describedby={errors.areaLegal ? "areaLegal-error" : undefined}
              aria-invalid={!!errors.areaLegal}
            >
              <SelectValue placeholder="Seleccioná un área" />
            </SelectTrigger>
            <SelectContent>
              {AREA_LEGAL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.areaLegal && (
            <p
              id="areaLegal-error"
              role="alert"
              className="flex items-center gap-1.5 font-ui text-xs text-error"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.areaLegal.message}
            </p>
          )}
        </div>

        {/* ─── Descripción ───────────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <Label htmlFor="descripcion">
            Descripción breve de tu consulta
            <span className="text-error ml-0.5" aria-hidden="true">
              *
            </span>
          </Label>
          <Textarea
            id="descripcion"
            rows={4}
            maxLength={1000}
            showCounter
            currentLength={descLength}
            aria-required="true"
            aria-describedby={errors.descripcion ? "descripcion-error" : "descripcion-hint"}
            aria-invalid={!!errors.descripcion}
            placeholder="Contanos brevemente sobre tu situación. No incluyas datos sensibles como DNI o números de expediente."
            {...register("descripcion", {
              onChange: (e) => setDescLength(e.target.value?.length ?? 0),
            })}
          />
          {!errors.descripcion && (
            <p id="descripcion-hint" className="font-ui text-xs text-text-tertiary">
              Mínimo 10 caracteres. Máximo 1000.
            </p>
          )}
          {errors.descripcion && (
            <p
              id="descripcion-error"
              role="alert"
              className="flex items-center gap-1.5 font-ui text-xs text-error"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.descripcion.message}
            </p>
          )}
        </div>

        {/* ─── Consentimiento Ley 25.326 ─────────────────────────────────────── */}
        <div className="space-y-1.5">
          <div className="flex items-start gap-3">
            <input
              id="consentimientoLey25326"
              type="checkbox"
              aria-required="true"
              aria-describedby={
                errors.consentimientoLey25326 ? "consentimiento-error" : "consentimiento-desc"
              }
              aria-invalid={!!errors.consentimientoLey25326}
              className={cn(
                "mt-0.5 size-4 shrink-0 cursor-pointer",
                "rounded-[3px]",
                "border border-border-strong",
                "accent-marino",
                "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
              )}
              {...register("consentimientoLey25326")}
            />
            <label
              htmlFor="consentimientoLey25326"
              id="consentimiento-desc"
              className="font-ui text-sm leading-relaxed text-text-secondary cursor-pointer"
            >
              Acepto el tratamiento de mis datos personales conforme a la{" "}
              <strong className="font-medium text-marino">Ley 25.326</strong> de Protección de Datos
              Personales. Mis datos serán utilizados exclusivamente para coordinar la consulta.{" "}
              <a
                href="/privacidad"
                className="text-marino underline underline-offset-2 decoration-dorado hover:decoration-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver política de privacidad
              </a>
              .
            </label>
          </div>
          {errors.consentimientoLey25326 && (
            <p
              id="consentimiento-error"
              role="alert"
              className="flex items-center gap-1.5 font-ui text-xs text-error pl-7"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.consentimientoLey25326.message}
            </p>
          )}
        </div>

        {/* ─── Submit ────────────────────────────────────────────────────────── */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
            loadingText="Procesando reserva…"
            disabled={!selectedSlotUtc || isSubmitting}
            aria-describedby={!selectedSlotUtc ? "no-slot-warning" : undefined}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Procesando…
              </>
            ) : (
              "Confirmar reserva"
            )}
          </Button>
          {!selectedSlotUtc && (
            <p id="no-slot-warning" className="mt-2 font-ui text-xs text-center text-text-tertiary">
              Seleccioná un horario arriba para habilitar este botón.
            </p>
          )}
          <p className="mt-3 font-ui text-xs text-center text-text-tertiary">
            Recibirás un email de confirmación con los detalles del turno.
          </p>
        </div>
      </form>
    </section>
  );
}
