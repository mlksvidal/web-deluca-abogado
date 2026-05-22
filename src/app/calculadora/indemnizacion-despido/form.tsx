"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Calculator } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatARS } from "@/lib/format-currency";
import {
  calcularDespido,
  type TipoDespido,
  type ResultadoDespido,
} from "@/lib/legal/indemnizacion-despido";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/ui/disclaimer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  aniosTexto: string;
  mesesTexto: string;
  sueldoTexto: string;
  tipoDespido: TipoDespido | "";
  preavisoOmitido: boolean;
  multaArt80: boolean;
}

interface FieldError {
  anios?: string;
  sueldo?: string;
  tipoDespido?: string;
}

// ─── Row helper ──────────────────────────────────────────────────────────────

function DesglosRow({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: number;
  highlighted?: boolean;
}) {
  if (value === 0) return null;
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 border-b border-[var(--color-border-default)] last:border-0",
        highlighted && "font-semibold"
      )}
    >
      <span
        className={cn(
          "font-ui text-sm",
          highlighted ? "text-[var(--color-marino)]" : "text-[var(--color-carbon-soft)]"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-ui text-sm tabular-nums",
          highlighted ? "text-[var(--color-marino)]" : "text-[var(--color-carbon-soft)]"
        )}
      >
        {formatARS(value)}
      </span>
    </div>
  );
}

// ─── Email capture ────────────────────────────────────────────────────────────

function EmailCapture() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Placeholder — integrar con backend cuando esté disponible
    setSent(true);
  };

  if (sent) {
    return (
      <p className="font-ui text-sm text-[var(--color-success)] text-center py-2">
        Recibimos tu email. Te enviaremos el cálculo detallado a la brevedad.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 mt-4"
      aria-label="Recibir cálculo por email"
    >
      <div className="flex-1">
        <Label htmlFor="calc-email" className="sr-only">
          Tu email
        </Label>
        <Input
          id="calc-email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email para recibir el cálculo"
        />
      </div>
      <Button type="submit" variant="secondary" size="md">
        Enviar
      </Button>
    </form>
  );
}

// ─── Results panel ────────────────────────────────────────────────────────────

function ResultadoPanel({ resultado }: { resultado: ResultadoDespido }) {
  const { desglose } = resultado;
  const esVacio = desglose.art245 === 0 && desglose.preaviso === 0 && desglose.multaArt80 === 0;

  return (
    <div
      role="region"
      aria-label="Resultado del cálculo"
      aria-live="polite"
      className={cn(
        "mt-8 rounded-[8px] overflow-hidden",
        "border border-[var(--color-border-default)]",
        "shadow-[var(--shadow-md)]",
        "animate-in fade-in slide-in-from-bottom-4 duration-500"
      )}
    >
      {/* Header del resultado */}
      <div className="bg-[var(--color-marino)] px-6 py-5">
        <p className="font-ui text-xs font-medium tracking-[0.1em] uppercase text-[rgba(250,247,242,0.60)] mb-1">
          Estimación total
        </p>
        <p
          className="font-serif leading-none text-[var(--color-bg)]"
          style={{ fontSize: "clamp(2rem,3vw+1rem,3rem)" }}
        >
          {formatARS(desglose.total)}
        </p>
        {desglose.topeAplicado && (
          <p className="mt-2 font-ui text-xs text-[var(--color-dorado)] flex items-center gap-1.5">
            <AlertTriangle size={12} aria-hidden="true" />
            Se aplicó tope art. 245
          </p>
        )}
      </div>

      {/* Desglose */}
      <div className="bg-[var(--color-bg)] px-6 py-2">
        {esVacio ? (
          <p className="py-4 font-body text-sm text-[var(--color-carbon-soft)] text-center">
            {desglose.notas[0]}
          </p>
        ) : (
          <>
            <DesglosRow label="Indemnización art. 245 LCT" value={desglose.art245} />
            <DesglosRow label="Preaviso art. 232 LCT" value={desglose.preaviso} />
            <DesglosRow label="SAC s/preaviso art. 233 LCT" value={desglose.sacSobrePreaviso} />
            <DesglosRow label="Multa art. 80 LCT" value={desglose.multaArt80} />
            <DesglosRow label="Total" value={desglose.total} highlighted />
          </>
        )}
      </div>

      {/* Notas técnicas */}
      {desglose.notas.length > 0 && !esVacio && (
        <div className="bg-[var(--color-bg-warm)] px-6 py-4 border-t border-[var(--color-border-default)]">
          <p className="font-ui text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
            Detalle del cálculo
          </p>
          <ul className="space-y-1">
            {desglose.notas.map((nota, i) => (
              <li
                key={i}
                className="font-body text-xs text-[var(--color-carbon-soft)] leading-relaxed pl-2 border-l-2 border-[var(--color-dorado-muted)]"
              >
                {nota}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer + CTA */}
      <div className="px-6 py-5 space-y-4 border-t border-[var(--color-border-default)] bg-[var(--color-bg)]">
        <Disclaimer variant="warning" title="Estimación orientativa">
          {resultado.disclaimer}
        </Disclaimer>

        <div className="flex flex-col gap-3">
          <Link href="/reservar?area=laboral">
            <Button variant="primary" size="lg" className="w-full" withArrow>
              Consultá personalizada
            </Button>
          </Link>

          <div className="border border-[var(--color-border-default)] rounded-[6px] p-4">
            <p className="font-ui text-sm font-medium text-[var(--color-carbon-soft)] mb-0.5">
              Recibí el cálculo detallado en PDF
            </p>
            <p className="font-body text-xs text-[var(--color-text-tertiary)] mb-2">
              Te lo enviamos a tu correo sin costo.
            </p>
            <EmailCapture />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function FormIndemnizacionDespido() {
  const resultRef = React.useRef<HTMLDivElement>(null);

  const [form, setForm] = React.useState<FormState>({
    aniosTexto: "",
    mesesTexto: "0",
    sueldoTexto: "",
    tipoDespido: "",
    preavisoOmitido: false,
    multaArt80: false,
  });

  const [errors, setErrors] = React.useState<FieldError>({});
  const [resultado, setResultado] = React.useState<ResultadoDespido | null>(null);
  const [calculando, setCalculando] = React.useState(false);

  const validate = (): FieldError => {
    const errs: FieldError = {};
    const anios = parseFloat(form.aniosTexto);
    const sueldo = parseFloat(form.sueldoTexto.replace(/\./g, "").replace(",", "."));

    if (!form.aniosTexto || isNaN(anios) || anios < 0) {
      errs.anios = "Ingresá los años trabajados (mínimo 0)";
    }
    if (!form.sueldoTexto || isNaN(sueldo) || sueldo <= 0) {
      errs.sueldo = "Ingresá el sueldo bruto mensual";
    }
    if (!form.tipoDespido) {
      errs.tipoDespido = "Seleccioná el tipo de despido";
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setCalculando(true);

    const anios = Math.floor(parseFloat(form.aniosTexto));
    const mesesDecimal = parseFloat(form.aniosTexto) - anios;
    const mesesAdicionales = form.mesesTexto
      ? parseInt(form.mesesTexto, 10)
      : Math.round(mesesDecimal * 12);
    const sueldo = parseFloat(form.sueldoTexto.replace(/[.$\s]/g, "").replace(",", "."));

    // Simular loading para dar feedback visual (el cálculo es sincrónico)
    setTimeout(() => {
      try {
        const res = calcularDespido({
          sueldoBruto: sueldo,
          antiguedadAnios: anios,
          antiguedadMeses: Math.min(11, Math.max(0, mesesAdicionales)),
          tipoDespido: form.tipoDespido as TipoDespido,
          preavisoOtorgado: !form.preavisoOmitido,
          aplicarMultaArt80: form.multaArt80,
        });
        setResultado(res);
        setCalculando(false);

        // Scroll al resultado
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } catch {
        setCalculando(false);
      }
    }, 400);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Calculadora de indemnización por despido"
        className="space-y-6"
      >
        {/* Antigüedad */}
        <fieldset className="space-y-1">
          <legend className="sr-only">Antigüedad laboral</legend>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="calc-anios">
                Años trabajados{" "}
                <span className="text-[var(--color-error)]" aria-hidden="true">
                  *
                </span>
              </Label>
              <Input
                id="calc-anios"
                type="number"
                min={0}
                max={50}
                step={1}
                placeholder="Ej: 5"
                value={form.aniosTexto}
                onChange={(e) => {
                  setForm((f) => ({ ...f, aniosTexto: e.target.value }));
                  if (errors.anios) setErrors((e2) => ({ ...e2, anios: undefined }));
                }}
                aria-invalid={!!errors.anios}
                aria-describedby={errors.anios ? "error-anios" : undefined}
              />
              {errors.anios && (
                <p
                  id="error-anios"
                  role="alert"
                  className="font-ui text-xs text-[var(--color-error)]"
                >
                  {errors.anios}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="calc-meses">Meses adicionales</Label>
              <Select
                value={form.mesesTexto}
                onValueChange={(v) => setForm((f) => ({ ...f, mesesTexto: v ?? "0" }))}
              >
                <SelectTrigger id="calc-meses" aria-label="Meses adicionales de antigüedad">
                  <SelectValue placeholder="0 meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {i} {i === 1 ? "mes" : "meses"}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </fieldset>

        {/* Sueldo bruto */}
        <div className="space-y-1.5">
          <Label htmlFor="calc-sueldo">
            Sueldo bruto último mes (ARS){" "}
            <span className="text-[var(--color-error)]" aria-hidden="true">
              *
            </span>
          </Label>
          <div className="relative">
            <span
              className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center font-ui text-sm text-[var(--color-text-tertiary)]"
              aria-hidden="true"
            >
              $
            </span>
            <Input
              id="calc-sueldo"
              type="text"
              inputMode="numeric"
              placeholder="0"
              className="pl-7"
              value={form.sueldoTexto}
              onChange={(e) => {
                // Permitir solo dígitos y punto/coma
                const raw = e.target.value.replace(/[^\d.,]/g, "");
                setForm((f) => ({ ...f, sueldoTexto: raw }));
                if (errors.sueldo) setErrors((e2) => ({ ...e2, sueldo: undefined }));
              }}
              aria-invalid={!!errors.sueldo}
              aria-describedby={errors.sueldo ? "error-sueldo" : "hint-sueldo"}
            />
          </div>
          {errors.sueldo ? (
            <p id="error-sueldo" role="alert" className="font-ui text-xs text-[var(--color-error)]">
              {errors.sueldo}
            </p>
          ) : (
            <p id="hint-sueldo" className="font-ui text-xs text-[var(--color-text-tertiary)]">
              Mejor remuneración normal y habitual (sin SAC ni horas extra ocasionales)
            </p>
          )}
        </div>

        {/* Tipo de despido */}
        <div className="space-y-1.5">
          <Label htmlFor="calc-tipo">
            Tipo de despido{" "}
            <span className="text-[var(--color-error)]" aria-hidden="true">
              *
            </span>
          </Label>
          <Select
            value={form.tipoDespido}
            onValueChange={(v) => {
              if (v) setForm((f) => ({ ...f, tipoDespido: v as TipoDespido }));
              if (errors.tipoDespido) setErrors((e2) => ({ ...e2, tipoDespido: undefined }));
            }}
          >
            <SelectTrigger
              id="calc-tipo"
              aria-invalid={!!errors.tipoDespido}
              aria-describedby={errors.tipoDespido ? "error-tipo" : undefined}
            >
              <SelectValue placeholder="Seleccioná una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sin_causa">Sin causa (art. 245 LCT)</SelectItem>
                <SelectItem value="indirecto">
                  Despido indirecto (incumplimiento del empleador)
                </SelectItem>
                <SelectItem value="periodo_prueba">Período de prueba (≤ 3 meses)</SelectItem>
                <SelectItem value="con_causa">Con causa justificada</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipoDespido && (
            <p id="error-tipo" role="alert" className="font-ui text-xs text-[var(--color-error)]">
              {errors.tipoDespido}
            </p>
          )}
        </div>

        {/* Checkboxes */}
        <fieldset className="space-y-3">
          <legend className="font-ui text-sm font-medium text-[var(--color-carbon-soft)]">
            Conceptos adicionales
          </legend>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={form.preavisoOmitido}
                onChange={(e) => setForm((f) => ({ ...f, preavisoOmitido: e.target.checked }))}
                id="check-preaviso"
              />
              <div
                className={cn(
                  "w-5 h-5 rounded-[4px] border-2 flex items-center justify-center",
                  "transition-colors duration-150",
                  "border-[var(--color-border-strong)]",
                  "group-hover:border-[var(--color-marino)]",
                  "peer-checked:bg-[var(--color-marino)] peer-checked:border-[var(--color-marino)]",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-dorado)] peer-focus-visible:outline-offset-2"
                )}
                aria-hidden="true"
              >
                {form.preavisoOmitido && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="#FAF7F2"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <label
              htmlFor="check-preaviso"
              className="font-ui text-sm text-[var(--color-carbon-soft)] leading-snug cursor-pointer"
            >
              Preaviso omitido
              <span className="block font-body text-xs text-[var(--color-text-tertiary)] mt-0.5">
                El empleador no otorgó el período de preaviso (art. 232 LCT)
              </span>
            </label>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={form.multaArt80}
                onChange={(e) => setForm((f) => ({ ...f, multaArt80: e.target.checked }))}
                id="check-art80"
              />
              <div
                className={cn(
                  "w-5 h-5 rounded-[4px] border-2 flex items-center justify-center",
                  "transition-colors duration-150",
                  "border-[var(--color-border-strong)]",
                  "group-hover:border-[var(--color-marino)]",
                  "peer-checked:bg-[var(--color-marino)] peer-checked:border-[var(--color-marino)]",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-dorado)] peer-focus-visible:outline-offset-2"
                )}
                aria-hidden="true"
              >
                {form.multaArt80 && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="#FAF7F2"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <label
              htmlFor="check-art80"
              className="font-ui text-sm text-[var(--color-carbon-soft)] leading-snug cursor-pointer"
            >
              Certificados art. 80 no entregados
              <span className="block font-body text-xs text-[var(--color-text-tertiary)] mt-0.5">
                Multa equivalente a 3 sueldos por falta de certificados laborales
              </span>
            </label>
          </label>
        </fieldset>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={calculando}
          loadingText="Calculando…"
        >
          <Calculator size={18} aria-hidden="true" />
          Calcular estimación
        </Button>
      </form>

      {/* Result */}
      <div ref={resultRef}>{resultado && <ResultadoPanel resultado={resultado} />}</div>
    </div>
  );
}
