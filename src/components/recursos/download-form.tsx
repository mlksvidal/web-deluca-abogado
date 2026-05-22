"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Download, CheckCircle2, AlertCircle, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitLeadDescarga } from "@/app/actions/leads";
import type { RecursoConfig } from "@/lib/recursos-config";

// ─── Schema cliente (espejo del server schema) ─────────────────────────────────

const formSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres")
    .trim(),
  email: z.string().email("Email inválido"),
  areaInteres: z.enum(["civil_familia", "laboral", "penal", "comercial", "general"], {
    error: "Seleccioná un área de interés",
  }),
  consentimiento: z.literal(true, {
    error: "Debés aceptar el tratamiento de datos (Ley 25.326)",
  }),
  // Honeypot — oculto, nunca debe tener valor
  _website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Tipos ────────────────────────────────────────────────────────────────────

type DownloadResult = {
  downloadUrl: string;
  recursoTitulo: string;
};

// ─── Props ────────────────────────────────────────────────────────────────────

type DownloadFormProps = {
  recurso: Pick<RecursoConfig, "slug" | "titulo" | "areaLegal" | "areaLabel">;
  /** Callback al completar descarga exitosa */
  onSuccess?: (result: DownloadResult) => void;
  className?: string;
};

// ─── Áreas label map ──────────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General / No sé",
};

// ─── Componente ───────────────────────────────────────────────────────────────

export function DownloadForm({ recurso, onSuccess, className }: DownloadFormProps) {
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [retryAfter, setRetryAfter] = React.useState<number | null>(null);
  const [downloadResult, setDownloadResult] = React.useState<DownloadResult | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      areaInteres: recurso.areaLegal as FormValues["areaInteres"],
    },
  });

  const areaInteres = watch("areaInteres");

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    setRetryAfter(null);

    try {
      const result = await submitLeadDescarga({
        nombre: data.nombre,
        email: data.email,
        areaInteres: data.areaInteres,
        recursoSlug: recurso.slug,
        _website: data._website ?? "",
      });

      if (!result.success) {
        if (result.error === "rate_limit") {
          setRetryAfter(result.retryAfter ?? 3600);
          return;
        }
        if (result.error === "validation_error") {
          setSubmitError("Revisá los campos marcados e intentá nuevamente.");
          return;
        }
        setSubmitError("Ocurrió un error. Por favor, intentá más tarde.");
        return;
      }

      const res: DownloadResult = {
        downloadUrl: result.data.downloadUrl,
        recursoTitulo: result.data.recursoTitulo,
      };
      setDownloadResult(res);
      onSuccess?.(res);
    } catch {
      setSubmitError("Ocurrió un error inesperado. Por favor, intentá más tarde.");
    }
  };

  // ─── Estado: éxito ──────────────────────────────────────────────────────────

  if (isSubmitSuccessful && downloadResult) {
    return (
      <div className={cn("flex flex-col items-center gap-6 py-4 text-center", className)}>
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "rgba(21,128,61,0.12)", color: "var(--color-success)" }}
        >
          <CheckCircle2 size={32} aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-xl font-semibold text-[var(--color-marino)]">
            ¡Listo! Tu descarga está lista.
          </h3>
          <p className="font-body text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto">
            También enviamos una copia a tu email para que puedas acceder cuando quieras.
          </p>
        </div>

        <a
          href={downloadResult.downloadUrl}
          download
          className={cn(
            "inline-flex items-center gap-2.5",
            "px-7 py-3 h-12",
            "bg-[var(--color-marino)] text-[var(--color-bg)]",
            "font-ui text-sm font-medium tracking-wide uppercase",
            "rounded-sm",
            "hover:bg-[var(--color-marino-hover)] hover:-translate-y-0.5",
            "transition-all duration-250",
            "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-3"
          )}
          aria-label={`Descargar ${downloadResult.recursoTitulo}`}
        >
          <Download size={16} aria-hidden="true" />
          Descargar ahora
        </a>

        <p className="font-ui text-xs text-[var(--color-text-tertiary)]">
          El archivo se descarga en formato PDF.
        </p>
      </div>
    );
  }

  // ─── Estado: rate limit ─────────────────────────────────────────────────────

  if (retryAfter !== null) {
    const minutes = Math.ceil(retryAfter / 60);
    return (
      <div className={cn("flex flex-col items-center gap-4 py-4 text-center", className)}>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "rgba(180,83,9,0.10)", color: "var(--color-warning)" }}
        >
          <Clock size={28} aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-serif text-lg font-semibold text-[var(--color-marino)]">
            Demasiadas solicitudes
          </h3>
          <p className="font-body text-sm text-[var(--color-text-secondary)]">
            Alcanzaste el límite de descargas. Podés volver a intentarlo en{" "}
            <strong>
              {minutes > 60
                ? `${Math.ceil(minutes / 60)} hora${Math.ceil(minutes / 60) > 1 ? "s" : ""}`
                : `${minutes} minuto${minutes > 1 ? "s" : ""}`}
            </strong>
            .
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setRetryAfter(null)}>
          Volver al formulario
        </Button>
      </div>
    );
  }

  // ─── Formulario ─────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-5", className)}
      noValidate
      aria-label={`Formulario para descargar ${recurso.titulo}`}
    >
      {/* Honeypot — oculto de lectores de pantalla y bots */}
      <input
        {...register("_website")}
        type="text"
        name="_website"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        style={{ display: "none" }}
      />

      {/* Nombre */}
      <div className="space-y-1.5">
        <Label htmlFor="dl-nombre">
          Nombre{" "}
          <span className="text-[var(--color-error)]" aria-hidden="true">
            *
          </span>
        </Label>
        <Input
          id="dl-nombre"
          type="text"
          placeholder="Tu nombre"
          autoComplete="given-name"
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? "dl-nombre-error" : undefined}
          {...register("nombre")}
        />
        {errors.nombre && (
          <p
            id="dl-nombre-error"
            role="alert"
            className="font-ui text-xs text-[var(--color-error)]"
          >
            {errors.nombre.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="dl-email">
          Email{" "}
          <span className="text-[var(--color-error)]" aria-hidden="true">
            *
          </span>
        </Label>
        <Input
          id="dl-email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "dl-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="dl-email-error" role="alert" className="font-ui text-xs text-[var(--color-error)]">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Área de interés */}
      <div className="space-y-1.5">
        <Label htmlFor="dl-area">
          Área de interés{" "}
          <span className="text-[var(--color-error)]" aria-hidden="true">
            *
          </span>
        </Label>
        <Select
          value={areaInteres}
          onValueChange={(val) =>
            setValue("areaInteres", val as FormValues["areaInteres"], { shouldValidate: true })
          }
        >
          <SelectTrigger id="dl-area" aria-invalid={!!errors.areaInteres}>
            <SelectValue placeholder="Seleccioná un área" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(AREA_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.areaInteres && (
          <p role="alert" className="font-ui text-xs text-[var(--color-error)]">
            {errors.areaInteres.message}
          </p>
        )}
      </div>

      {/* Consentimiento Ley 25.326 */}
      <div className="space-y-1.5">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            id="dl-consentimiento"
            aria-invalid={!!errors.consentimiento}
            aria-describedby={errors.consentimiento ? "dl-consentimiento-error" : undefined}
            {...register("consentimiento")}
            className={cn(
              "mt-0.5 h-4 w-4 shrink-0 cursor-pointer",
              "rounded-[3px] border-[var(--color-border-strong)]",
              "text-[var(--color-marino)]",
              "accent-[var(--color-marino)]",
              "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-2"
            )}
          />
          <span className="font-ui text-xs text-[var(--color-text-secondary)] leading-relaxed group-hover:text-[var(--color-carbon)]">
            Acepto el tratamiento de mis datos personales conforme a la <strong>Ley 25.326</strong>{" "}
            de Protección de Datos Personales. Mis datos serán utilizados únicamente para el envío
            del documento solicitado y comunicaciones del Estudio De Luca.
          </span>
        </label>
        {errors.consentimiento && (
          <p
            id="dl-consentimiento-error"
            role="alert"
            className="font-ui text-xs text-[var(--color-error)]"
          >
            {errors.consentimiento.message}
          </p>
        )}
      </div>

      {/* Error general */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-[6px] border border-[#FCA5A5] bg-[#FEE2E2] px-4 py-3"
        >
          <AlertCircle
            size={16}
            className="shrink-0 mt-0.5 text-[var(--color-error)]"
            aria-hidden="true"
          />
          <p className="font-ui text-sm text-[var(--color-error)]">{submitError}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
        loadingText="Enviando…"
        withArrow={!isSubmitting}
      >
        <Download size={16} aria-hidden="true" />
        Descargar gratis
      </Button>

      <p className="text-center font-ui text-xs text-[var(--color-text-tertiary)]">
        Documento en PDF · Gratuito · Sin spam
      </p>
    </form>
  );
}
