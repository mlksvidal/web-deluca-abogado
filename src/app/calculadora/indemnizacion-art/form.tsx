"use client";

import * as React from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatARS } from "@/lib/format-currency";
import {
  calcularART,
  type TipoAccidenteART,
  type ResultadoART,
} from "@/lib/legal/indemnizacion-art";
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

// ─── Slider ───────────────────────────────────────────────────────────────────

function IncapacidadSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="art-incapacidad">
          Porcentaje de incapacidad{" "}
          <span className="text-[var(--color-error)]" aria-hidden="true">
            *
          </span>
        </Label>
        <span
          className="font-ui text-lg font-semibold text-[var(--color-marino)] tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {value}%
        </span>
      </div>

      <div className="relative pt-1">
        <input
          id="art-incapacidad"
          type="range"
          min={1}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          aria-valuemin={1}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={`${value}% de incapacidad`}
          className={cn(
            "w-full h-2 rounded-full appearance-none cursor-pointer",
            "bg-[var(--color-border-default)]",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-[var(--color-marino)]",
            "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-dorado)]",
            "[&::-webkit-slider-thumb]:shadow-[var(--shadow-sm)]",
            "[&::-webkit-slider-thumb]:cursor-grab",
            "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5",
            "[&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:bg-[var(--color-marino)]",
            "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--color-dorado)]",
            "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[var(--shadow-sm)]",
            "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-2"
          )}
          style={{
            background: `linear-gradient(to right, var(--color-marino) ${value}%, var(--color-border-default) ${value}%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="font-ui text-xs text-[var(--color-text-tertiary)]">1%</span>
          <span className="font-ui text-xs text-[var(--color-text-tertiary)]">100%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Result panel ──────────────────────────────────────────────────────────

function DesglosRow({
  label,
  value,
  sub,
  highlighted = false,
}: {
  label: string;
  value: number;
  sub?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between py-3 border-b border-[var(--color-border-default)] last:border-0",
        highlighted && "font-semibold"
      )}
    >
      <div>
        <span
          className={cn(
            "font-ui text-sm",
            highlighted ? "text-[var(--color-marino)]" : "text-[var(--color-carbon-soft)]"
          )}
        >
          {label}
        </span>
        {sub && (
          <span className="block font-body text-xs text-[var(--color-text-tertiary)] mt-0.5">
            {sub}
          </span>
        )}
      </div>
      <span
        className={cn(
          "font-ui text-sm tabular-nums ml-4 shrink-0",
          highlighted ? "text-[var(--color-marino)]" : "text-[var(--color-carbon-soft)]"
        )}
      >
        {formatARS(value)}
      </span>
    </div>
  );
}

function ResultadoPanel({ resultado }: { resultado: ResultadoART }) {
  const { desglose } = resultado;

  return (
    <div
      role="region"
      aria-label="Resultado del cálculo ART"
      aria-live="polite"
      className={cn(
        "mt-8 rounded-[8px] overflow-hidden",
        "border border-[var(--color-border-default)]",
        "shadow-[var(--shadow-md)]",
        "animate-in fade-in slide-in-from-bottom-4 duration-500"
      )}
    >
      {/* Header */}
      <div className="bg-[var(--color-marino)] px-6 py-5">
        <p className="font-ui text-xs font-medium tracking-[0.1em] uppercase text-[rgba(250,247,242,0.60)] mb-1">
          Indemnización estimada
        </p>
        <p
          className="font-serif leading-none text-[var(--color-bg)]"
          style={{ fontSize: "clamp(2rem,3vw+1rem,3rem)" }}
        >
          {formatARS(desglose.total)}
        </p>
        <p className="mt-1.5 font-ui text-xs text-[var(--color-dorado)] opacity-90">
          {desglose.baseLegal}
        </p>
      </div>

      {/* Desglose */}
      <div className="bg-[var(--color-bg)] px-6 py-2">
        <DesglosRow
          label="VIB — Valor Indemnizatorio Base"
          value={desglose.vib}
          sub={`53 × IBM × ${Math.round((1 / desglose.coeficienteEdad) * 65)}% incap. × coef. ${desglose.coeficienteEdad.toFixed(3)}`}
        />
        {desglose.adicionalLey26773 > 0 && (
          <DesglosRow
            label="Adicional 20% Ley 26.773 art. 3"
            value={desglose.adicionalLey26773}
            sub="Accidente laboral o in itinere"
          />
        )}
        <DesglosRow label="Total estimado" value={desglose.total} highlighted />
      </div>

      {/* RIPTE notice */}
      <div className="px-6 py-3 bg-[var(--color-marino-subtle)] border-t border-[var(--color-border-default)]">
        <p className="font-ui text-xs text-[var(--color-marino)] font-medium">
          Sujeto al piso RIPTE vigente
        </p>
        <p className="font-body text-xs text-[var(--color-text-secondary)] mt-0.5">
          La Ley 26.773 establece actualización trimestral por RIPTE (Remuneración Imponible
          Promedio de los Trabajadores Estables). El valor real puede ser mayor.
        </p>
      </div>

      {/* Notas técnicas */}
      {desglose.notas.length > 0 && (
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

        <Link href="/reservar?area=laboral">
          <Button variant="primary" size="lg" className="w-full" withArrow>
            Consultá con un especialista en ART
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

interface FieldError {
  sueldo?: string;
  incapacidad?: string;
  edad?: string;
  tipoAccidente?: string;
}

export function FormIndemnizacionART() {
  const resultRef = React.useRef<HTMLDivElement>(null);

  const [sueldoTexto, setSueldoTexto] = React.useState("");
  const [incapacidad, setIncapacidad] = React.useState(20);
  const [edadTexto, setEdadTexto] = React.useState("");
  const [tipoAccidente, setTipoAccidente] = React.useState<TipoAccidenteART | "">("");
  const [errors, setErrors] = React.useState<FieldError>({});
  const [resultado, setResultado] = React.useState<ResultadoART | null>(null);
  const [calculando, setCalculando] = React.useState(false);

  const validate = (): FieldError => {
    const errs: FieldError = {};
    const sueldo = parseFloat(sueldoTexto.replace(/[.$\s]/g, "").replace(",", "."));
    const edad = parseInt(edadTexto, 10);

    if (!sueldoTexto || isNaN(sueldo) || sueldo <= 0) {
      errs.sueldo = "Ingresá el sueldo bruto mensual";
    }
    if (incapacidad < 1 || incapacidad > 100) {
      errs.incapacidad = "El porcentaje debe estar entre 1% y 100%";
    }
    if (!edadTexto || isNaN(edad) || edad < 18 || edad > 65) {
      errs.edad = "La edad debe estar entre 18 y 65 años";
    }
    if (!tipoAccidente) {
      errs.tipoAccidente = "Seleccioná el tipo de accidente";
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setCalculando(true);
    const sueldo = parseFloat(sueldoTexto.replace(/[.$\s]/g, "").replace(",", "."));
    const edad = parseInt(edadTexto, 10);

    setTimeout(() => {
      try {
        const res = calcularART({
          sueldoBruto: sueldo,
          porcentajeIncapacidad: incapacidad,
          edad,
          tipoAccidente: tipoAccidente as TipoAccidenteART,
        });
        setResultado(res);
        setCalculando(false);
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
        aria-label="Calculadora de indemnización ART"
        className="space-y-6"
      >
        {/* Slider incapacidad */}
        <div>
          <IncapacidadSlider
            value={incapacidad}
            onChange={(v) => {
              setIncapacidad(v);
              if (errors.incapacidad) setErrors((e) => ({ ...e, incapacidad: undefined }));
            }}
          />
          {errors.incapacidad && (
            <p role="alert" className="mt-1 font-ui text-xs text-[var(--color-error)]">
              {errors.incapacidad}
            </p>
          )}
        </div>

        {/* Sueldo */}
        <div className="space-y-1.5">
          <Label htmlFor="art-sueldo">
            Sueldo bruto mensual — IBM (ARS){" "}
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
              id="art-sueldo"
              type="text"
              inputMode="numeric"
              placeholder="0"
              className="pl-7"
              value={sueldoTexto}
              onChange={(e) => {
                setSueldoTexto(e.target.value.replace(/[^\d.,]/g, ""));
                if (errors.sueldo) setErrors((e2) => ({ ...e2, sueldo: undefined }));
              }}
              aria-invalid={!!errors.sueldo}
              aria-describedby={errors.sueldo ? "error-art-sueldo" : "hint-art-sueldo"}
            />
          </div>
          {errors.sueldo ? (
            <p
              id="error-art-sueldo"
              role="alert"
              className="font-ui text-xs text-[var(--color-error)]"
            >
              {errors.sueldo}
            </p>
          ) : (
            <p id="hint-art-sueldo" className="font-ui text-xs text-[var(--color-text-tertiary)]">
              Ingreso Base Mensual (IBM) al momento del accidente
            </p>
          )}
        </div>

        {/* Tipo de accidente */}
        <div className="space-y-1.5">
          <Label htmlFor="art-tipo">
            Tipo de accidente{" "}
            <span className="text-[var(--color-error)]" aria-hidden="true">
              *
            </span>
          </Label>
          <Select
            value={tipoAccidente}
            onValueChange={(v) => {
              if (v) setTipoAccidente(v as TipoAccidenteART);
              if (errors.tipoAccidente) setErrors((e) => ({ ...e, tipoAccidente: undefined }));
            }}
          >
            <SelectTrigger
              id="art-tipo"
              aria-invalid={!!errors.tipoAccidente}
              aria-describedby={errors.tipoAccidente ? "error-art-tipo" : undefined}
            >
              <SelectValue placeholder="Seleccioná una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="laboral">Accidente de trabajo (en jornada laboral)</SelectItem>
                <SelectItem value="in_itinere">
                  Accidente in itinere (trayecto casa-trabajo)
                </SelectItem>
                <SelectItem value="enfermedad">Enfermedad profesional</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipoAccidente && (
            <p
              id="error-art-tipo"
              role="alert"
              className="font-ui text-xs text-[var(--color-error)]"
            >
              {errors.tipoAccidente}
            </p>
          )}
        </div>

        {/* Edad */}
        <div className="space-y-1.5">
          <Label htmlFor="art-edad">
            Edad del trabajador al momento del accidente{" "}
            <span className="text-[var(--color-error)]" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="art-edad"
            type="number"
            min={18}
            max={65}
            step={1}
            placeholder="Ej: 35"
            value={edadTexto}
            onChange={(e) => {
              setEdadTexto(e.target.value);
              if (errors.edad) setErrors((e2) => ({ ...e2, edad: undefined }));
            }}
            aria-invalid={!!errors.edad}
            aria-describedby={errors.edad ? "error-art-edad" : "hint-art-edad"}
            className="max-w-[160px]"
          />
          {errors.edad ? (
            <p
              id="error-art-edad"
              role="alert"
              className="font-ui text-xs text-[var(--color-error)]"
            >
              {errors.edad}
            </p>
          ) : (
            <p id="hint-art-edad" className="font-ui text-xs text-[var(--color-text-tertiary)]">
              Entre 18 y 65 años (Ley 24.557)
            </p>
          )}
        </div>

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
          Calcular indemnización ART
        </Button>
      </form>

      {/* Result */}
      <div ref={resultRef}>{resultado && <ResultadoPanel resultado={resultado} />}</div>
    </div>
  );
}
