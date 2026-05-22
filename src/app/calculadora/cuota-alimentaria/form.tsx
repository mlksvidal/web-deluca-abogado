"use client";

import * as React from "react";
import Link from "next/link";
import { Calculator, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatARS, formatPct } from "@/lib/format-currency";
import {
  calcularCuotaAlimentaria,
  type ResultadoCuotaAlimentaria,
} from "@/lib/legal/cuota-alimentaria";
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

interface FieldError {
  sueldo?: string;
  hijos?: string;
  edades?: string;
}

// ─── Result panel ──────────────────────────────────────────────────────────

function ResultadoPanel({ resultado }: { resultado: ResultadoCuotaAlimentaria }) {
  return (
    <div
      role="region"
      aria-label="Resultado del cálculo alimentario"
      aria-live="polite"
      className={cn(
        "mt-8 rounded-[8px] overflow-hidden",
        "border border-[var(--color-border-default)]",
        "shadow-[var(--shadow-md)]",
        "animate-in fade-in slide-in-from-bottom-4 duration-500"
      )}
    >
      {/* Header */}
      <div className="bg-marino px-6 py-5">
        <p className="font-ui text-xs font-medium tracking-[0.1em] uppercase text-[rgba(250,247,242,0.60)] mb-1">
          Cuota mensual estimada
        </p>
        <p
          className="font-serif leading-none text-bg"
          style={{ fontSize: "clamp(2rem,3vw+1rem,3rem)" }}
        >
          {formatARS(resultado.montoMensual)}
        </p>
        <p className="mt-1.5 font-ui text-sm text-dorado">
          {formatPct(resultado.porcentajeEstimado)} del sueldo bruto
        </p>
      </div>

      {/* Rango */}
      <div className="bg-bg px-6 py-4 border-b border-[var(--color-border-default)]">
        <p className="font-ui text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">
          Rango jurisprudencial
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 text-center p-3 rounded-[6px] bg-bg-warm border border-[var(--color-border-default)]">
            <p className="font-ui text-xs text-[var(--color-text-tertiary)] mb-0.5">Mínimo</p>
            <p className="font-serif text-lg font-semibold text-marino">
              {formatARS(resultado.rangoMin)}
            </p>
          </div>
          <div className="text-[var(--color-border-strong)] font-ui text-sm">—</div>
          <div className="flex-1 text-center p-3 rounded-[6px] bg-bg-warm border border-[var(--color-border-default)]">
            <p className="font-ui text-xs text-[var(--color-text-tertiary)] mb-0.5">Máximo</p>
            <p className="font-serif text-lg font-semibold text-marino">
              {formatARS(resultado.rangoMax)}
            </p>
          </div>
        </div>
      </div>

      {/* Notas */}
      {resultado.notas.length > 0 && (
        <div className="bg-bg-warm px-6 py-4 border-b border-[var(--color-border-default)]">
          <p className="font-ui text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
            Criterio aplicado
          </p>
          <ul className="space-y-1">
            {resultado.notas.map((nota, i) => (
              <li
                key={i}
                className="font-body text-xs text-carbon-soft leading-relaxed pl-2 border-l-2 border-[var(--color-dorado-muted)]"
              >
                {nota}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer + CTA */}
      <div className="px-6 py-5 space-y-4 bg-bg">
        <Disclaimer variant="warning" title="Estimación orientativa">
          {resultado.disclaimer}
        </Disclaimer>

        <Link href="/reservar?area=familia">
          <Button variant="primary" size="lg" className="w-full" withArrow>
            Consultá con un especialista en familia
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function FormCuotaAlimentaria() {
  const resultRef = React.useRef<HTMLDivElement>(null);

  const [sueldoTexto, setSueldoTexto] = React.useState("");
  const [nHijos, setNHijos] = React.useState(1);
  const [edades, setEdades] = React.useState<string[]>([""]);
  const [otrasObligaciones, setOtrasObligaciones] = React.useState(false);
  const [errors, setErrors] = React.useState<FieldError>({});
  const [resultado, setResultado] = React.useState<ResultadoCuotaAlimentaria | null>(null);
  const [calculando, setCalculando] = React.useState(false);

  // Sincronizar array edades con nHijos
  const handleNHijosChange = (value: string) => {
    const n = Math.max(1, Math.min(10, parseInt(value, 10) || 1));
    setNHijos(n);
    setEdades((prev) => {
      const next = [...prev];
      while (next.length < n) next.push("");
      return next.slice(0, n);
    });
    if (errors.hijos || errors.edades)
      setErrors((e) => ({ ...e, hijos: undefined, edades: undefined }));
  };

  const handleEdadChange = (index: number, value: string) => {
    setEdades((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (errors.edades) setErrors((e) => ({ ...e, edades: undefined }));
  };

  const addHijo = () => {
    if (nHijos >= 10) return;
    setNHijos((n) => n + 1);
    setEdades((prev) => [...prev, ""]);
  };

  const removeHijo = (index: number) => {
    if (nHijos <= 1) return;
    setNHijos((n) => n - 1);
    setEdades((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): FieldError => {
    const errs: FieldError = {};
    const sueldo = parseFloat(sueldoTexto.replace(/[.$\s]/g, "").replace(",", "."));
    if (!sueldoTexto || isNaN(sueldo) || sueldo <= 0) {
      errs.sueldo = "Ingresá el sueldo bruto del obligado";
    }
    if (nHijos < 1 || nHijos > 10) {
      errs.hijos = "La cantidad de hijos debe estar entre 1 y 10";
    }
    const edadesNum = edades.map((e) => parseInt(e, 10));
    if (edadesNum.some((e) => isNaN(e) || e < 0 || e > 25)) {
      errs.edades = "Completá la edad de cada hijo (0-25 años)";
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
    const edadesNum = edades.map((e) => parseInt(e, 10));

    setTimeout(() => {
      try {
        const res = calcularCuotaAlimentaria({
          sueldoBrutoObligado: sueldo,
          nHijos,
          edades: edadesNum,
          tieneOtrasObligaciones: otrasObligaciones,
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
        aria-label="Calculadora de cuota alimentaria"
        className="space-y-6"
      >
        {/* Sueldo del obligado */}
        <div className="space-y-1.5">
          <Label htmlFor="alim-sueldo">
            Sueldo bruto mensual del obligado (ARS){" "}
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
              id="alim-sueldo"
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
              aria-describedby={errors.sueldo ? "error-alim-sueldo" : "hint-alim-sueldo"}
            />
          </div>
          {errors.sueldo ? (
            <p
              id="error-alim-sueldo"
              role="alert"
              className="font-ui text-xs text-[var(--color-error)]"
            >
              {errors.sueldo}
            </p>
          ) : (
            <p id="hint-alim-sueldo" className="font-ui text-xs text-[var(--color-text-tertiary)]">
              Ingreso bruto declarado o estimado del progenitor obligado
            </p>
          )}
        </div>

        {/* Cantidad de hijos */}
        <div className="space-y-1.5">
          <Label htmlFor="alim-nhijos">
            Cantidad de hijos{" "}
            <span className="text-[var(--color-error)]" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="alim-nhijos"
            type="number"
            min={1}
            max={10}
            step={1}
            value={nHijos}
            onChange={(e) => handleNHijosChange(e.target.value)}
            aria-invalid={!!errors.hijos}
            aria-describedby={errors.hijos ? "error-alim-hijos" : undefined}
            className="max-w-[120px]"
          />
          {errors.hijos && (
            <p
              id="error-alim-hijos"
              role="alert"
              className="font-ui text-xs text-[var(--color-error)]"
            >
              {errors.hijos}
            </p>
          )}
        </div>

        {/* Edades de cada hijo */}
        <fieldset className="space-y-3">
          <legend className="font-ui text-sm font-medium text-carbon-soft">
            Edades de los hijos{" "}
            <span className="text-[var(--color-error)]" aria-hidden="true">
              *
            </span>
          </legend>

          {errors.edades && (
            <p role="alert" className="font-ui text-xs text-[var(--color-error)]">
              {errors.edades}
            </p>
          )}

          <div className="space-y-2">
            {edades.map((edad, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 space-y-0">
                  <Label htmlFor={`alim-edad-${i}`} className="sr-only">
                    Edad del hijo {i + 1}
                  </Label>
                  <Select value={edad} onValueChange={(v) => handleEdadChange(i, v ?? "")}>
                    <SelectTrigger
                      id={`alim-edad-${i}`}
                      aria-label={`Edad del hijo ${i + 1}`}
                      aria-invalid={!!errors.edades && !edad}
                    >
                      <SelectValue placeholder={`Hijo ${i + 1} — Edad`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from({ length: 26 }, (_, a) => (
                          <SelectItem key={a} value={String(a)}>
                            {a} {a === 1 ? "año" : "años"}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {nHijos > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHijo(i)}
                    aria-label={`Eliminar hijo ${i + 1}`}
                    className={cn(
                      "flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-[6px]",
                      "text-[var(--color-text-tertiary)]",
                      "hover:text-[var(--color-error)] hover:bg-[#FEE2E2]",
                      "transition-colors duration-150",
                      "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)]"
                    )}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {nHijos < 10 && (
            <button
              type="button"
              onClick={addHijo}
              className={cn(
                "flex items-center gap-1.5 font-ui text-sm text-marino",
                "hover:text-[var(--color-marino-hover)] transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-2"
              )}
            >
              <Plus size={15} aria-hidden="true" />
              Agregar otro hijo
            </button>
          )}
        </fieldset>

        {/* Otras obligaciones */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              className="peer sr-only"
              id="alim-otras"
              checked={otrasObligaciones}
              onChange={(e) => setOtrasObligaciones(e.target.checked)}
            />
            <div
              className={cn(
                "w-5 h-5 rounded-[4px] border-2 flex items-center justify-center",
                "transition-colors duration-150",
                "border-[var(--color-border-strong)]",
                "group-hover:border-[var(--color-marino)]",
                "peer-checked:bg-marino peer-checked:border-[var(--color-marino)]",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-dorado)] peer-focus-visible:outline-offset-2"
              )}
              aria-hidden="true"
            >
              {otrasObligaciones && (
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
            htmlFor="alim-otras"
            className="font-ui text-sm text-carbon-soft leading-snug cursor-pointer"
          >
            El obligado tiene otras obligaciones alimentarias activas
            <span className="block font-body text-xs text-[var(--color-text-tertiary)] mt-0.5">
              Ej: hijos de otra relación o alimentos a ascendientes
            </span>
          </label>
        </label>

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
          Calcular cuota estimada
        </Button>
      </form>

      {/* Result */}
      <div ref={resultRef}>{resultado && <ResultadoPanel resultado={resultado} />}</div>
    </div>
  );
}
