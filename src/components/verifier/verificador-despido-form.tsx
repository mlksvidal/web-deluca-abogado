"use client";

/**
 * VerificadorDespidoForm — 5 preguntas → diagnóstico slide-in.
 * Las preguntas del usuario se mapean a InputVerificadorDespido.
 * Motion intensity 3 → CSS transition, sin Framer Motion.
 */

import * as React from "react";
import Link from "next/link";
import { evaluarDespido } from "@/lib/legal/verificador-despido";
import type {
  InputVerificadorDespido,
  ResultadoVerificadorDespido,
  DiagnosticoDespido,
} from "@/lib/legal/verificador-despido";
import { cn } from "@/lib/utils";
import { lenisScrollTo } from "@/lib/lenis";
import { gsap } from "@/lib/gsap";
import { AlertTriangle, CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";

// ─── Tipos del formulario de usuario ─────────────────────────────────────────
// Preguntas simplificadas para UX → se mapean a InputVerificadorDespido

interface UserAnswers {
  q1TipoDespido: "sin_causa" | "con_causa" | "no_sabe" | "";
  q2Preaviso: "si" | "no" | "parcial" | "";
  q3Antiguedad: "menos1" | "1a5" | "5a10" | "mas10" | "";
  q4Registro: "si" | "no" | "parcial" | "no_sabe" | "";
  q5Motivo: "si_escrito" | "si_verbal" | "no" | "";
}

const INITIAL_ANSWERS: UserAnswers = {
  q1TipoDespido: "",
  q2Preaviso: "",
  q3Antiguedad: "",
  q4Registro: "",
  q5Motivo: "",
};

// ─── Mapeo respuestas → InputVerificadorDespido ───────────────────────────────

function mapAnswers(a: UserAnswers): InputVerificadorDespido {
  // Tipo despido
  const tipoDespido =
    a.q1TipoDespido === "sin_causa"
      ? "directo_sin_causa"
      : a.q1TipoDespido === "con_causa"
        ? "directo_con_causa"
        : "directo_sin_causa"; // no_sabe → tratamos como sin causa (peor caso para evaluación)

  // Preaviso
  const preavisoRecibido = a.q2Preaviso === "si";

  // Antigüedad
  const antiguedadAnios =
    a.q3Antiguedad === "menos1"
      ? 0
      : a.q3Antiguedad === "1a5"
        ? 3
        : a.q3Antiguedad === "5a10"
          ? 7
          : 12; // mas10

  // Registro
  const registrado = a.q4Registro === "si";

  // Motivo
  const motivoInformado = a.q5Motivo === "si_escrito" || a.q5Motivo === "si_verbal";

  return {
    tipoDespido,
    preavisoRecibido,
    antiguedadAnios,
    registrado,
    motivoInformado,
    recibioLiquidacion: true, // no preguntamos para simplificar UX (va a dudoso de todos modos si otras cosas fallan)
    firmoSinEntender: false,
    presionParaRenunciar: false,
  };
}

// ─── Badge diagnóstico ────────────────────────────────────────────────────────

const DIAGNOSTICO_CONFIG: Record<
  DiagnosticoDespido,
  {
    label: string;
    bg: string;
    color: string;
    icon: React.ReactNode;
    border: string;
  }
> = {
  legal: {
    label: "Aparentemente legal",
    bg: "rgba(46,160,67,0.08)",
    color: "#1A5C2A",
    border: "rgba(46,160,67,0.25)",
    icon: <CheckCircle2 size={24} aria-hidden="true" />,
  },
  dudoso: {
    label: "Hay aspectos dudosos",
    bg: "rgba(180,83,9,0.08)",
    color: "#92400E",
    border: "rgba(180,83,9,0.25)",
    icon: <AlertTriangle size={24} aria-hidden="true" />,
  },
  ilegal: {
    label: "Indicios de irregularidad",
    bg: "rgba(185,28,28,0.08)",
    color: "#7F1D1D",
    border: "rgba(185,28,28,0.25)",
    icon: <AlertTriangle size={24} aria-hidden="true" />,
  },
};

// ─── Opción radio ─────────────────────────────────────────────────────────────

function RadioOption({
  id,
  name,
  value,
  checked,
  onChange,
  children,
}: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-3 p-4 rounded-[6px] cursor-pointer border transition-all duration-150",
        "hover:border-marino hover:bg-bg-warm",
        "focus-within:ring-2 focus-within:ring-marino/10",
        checked ? "border-marino bg-marino-subtle" : "border-border-default bg-bg"
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-150",
          checked ? "border-marino bg-marino" : "border-border-strong bg-bg"
        )}
        aria-hidden="true"
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span className="font-body text-sm text-carbon leading-snug">{children}</span>
    </label>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function VerificadorDespidoForm() {
  const [answers, setAnswers] = React.useState<UserAnswers>(INITIAL_ANSWERS);
  const [resultado, setResultado] = React.useState<ResultadoVerificadorDespido | null>(null);
  const [showResult, setShowResult] = React.useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);
  const verdictRef = React.useRef<HTMLDivElement>(null);

  // Reveal dramático del veredicto cuando aparece
  React.useEffect(() => {
    if (!showResult || !resultado) return;
    const root = verdictRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".verdict-icon", {
        scale: 0,
        rotate: -25,
        duration: 0.7,
        ease: "back.out(2.2)",
      })
        .from(".verdict-label > *", { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.35")
        .from(".verdict-reason", { x: -14, opacity: 0, duration: 0.45, stagger: 0.09 }, "-=0.2")
        .from(".verdict-extra", { y: 14, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.15");
    }, root);

    return () => ctx.revert();
  }, [showResult, resultado]);

  const allAnswered =
    answers.q1TipoDespido !== "" &&
    answers.q2Preaviso !== "" &&
    answers.q3Antiguedad !== "" &&
    answers.q4Registro !== "" &&
    answers.q5Motivo !== "";

  const handleEvaluar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;
    const input = mapAnswers(answers);
    const res = evaluarDespido(input);
    setResultado(res);
    setShowResult(true);
    // Scroll al resultado
    setTimeout(() => {
      if (resultRef.current) lenisScrollTo(resultRef.current);
    }, 100);
  };

  const handleReset = () => {
    setAnswers(INITIAL_ANSWERS);
    setResultado(null);
    setShowResult(false);
    lenisScrollTo(0, { offset: 0 });
  };

  const setQ = <K extends keyof UserAnswers>(key: K, value: UserAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const diagConfig = resultado ? DIAGNOSTICO_CONFIG[resultado.diagnostico] : null;

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleEvaluar} noValidate>
        <div className="space-y-8">
          {/* ─── Pregunta 1 ──────────────────────────────────────── */}
          <fieldset>
            <legend className="font-serif text-lg font-500 text-marino mb-1">
              1. ¿Qué tipo de despido fue?
            </legend>
            <p className="font-body text-sm text-text-secondary mb-3">
              Cómo te comunicó el empleador el fin de la relación laboral.
            </p>
            <div className="space-y-2">
              {[
                { value: "sin_causa", label: "Sin causa — el empleador no alegó ningún motivo" },
                { value: "con_causa", label: "Con causa — el empleador alegó una razón concreta" },
                { value: "no_sabe", label: "No me lo informaron claramente" },
              ].map((opt) => (
                <RadioOption
                  key={opt.value}
                  id={`q1-${opt.value}`}
                  name="q1"
                  value={opt.value}
                  checked={answers.q1TipoDespido === opt.value}
                  onChange={() => setQ("q1TipoDespido", opt.value as UserAnswers["q1TipoDespido"])}
                >
                  {opt.label}
                </RadioOption>
              ))}
            </div>
          </fieldset>

          {/* ─── Pregunta 2 ──────────────────────────────────────── */}
          <fieldset>
            <legend className="font-serif text-lg font-500 text-marino mb-1">
              2. ¿Recibiste preaviso por escrito?
            </legend>
            <p className="font-body text-sm text-text-secondary mb-3">
              El preaviso es la notificación anticipada del despido (normalmente 1 o 2 meses).
            </p>
            <div className="space-y-2">
              {[
                { value: "si", label: "Sí, recibí el preaviso completo" },
                { value: "parcial", label: "Sí, pero fue parcial o informal (verbal)" },
                { value: "no", label: "No recibí ningún preaviso" },
              ].map((opt) => (
                <RadioOption
                  key={opt.value}
                  id={`q2-${opt.value}`}
                  name="q2"
                  value={opt.value}
                  checked={answers.q2Preaviso === opt.value}
                  onChange={() => setQ("q2Preaviso", opt.value as UserAnswers["q2Preaviso"])}
                >
                  {opt.label}
                </RadioOption>
              ))}
            </div>
          </fieldset>

          {/* ─── Pregunta 3 ──────────────────────────────────────── */}
          <fieldset>
            <legend className="font-serif text-lg font-500 text-marino mb-1">
              3. ¿Cuántos años trabajaste en esa empresa?
            </legend>
            <p className="font-body text-sm text-text-secondary mb-3">
              La antigüedad afecta el monto del preaviso e indemnización.
            </p>
            <div className="space-y-2">
              {[
                { value: "menos1", label: "Menos de 1 año" },
                { value: "1a5", label: "Entre 1 y 5 años" },
                { value: "5a10", label: "Entre 5 y 10 años" },
                { value: "mas10", label: "Más de 10 años" },
              ].map((opt) => (
                <RadioOption
                  key={opt.value}
                  id={`q3-${opt.value}`}
                  name="q3"
                  value={opt.value}
                  checked={answers.q3Antiguedad === opt.value}
                  onChange={() => setQ("q3Antiguedad", opt.value as UserAnswers["q3Antiguedad"])}
                >
                  {opt.label}
                </RadioOption>
              ))}
            </div>
          </fieldset>

          {/* ─── Pregunta 4 ──────────────────────────────────────── */}
          <fieldset>
            <legend className="font-serif text-lg font-500 text-marino mb-1">
              4. ¿Estabas registrado correctamente en AFIP?
            </legend>
            <p className="font-body text-sm text-text-secondary mb-3">
              Estar &ldquo;en blanco&rdquo; significa que el empleador realizaba los aportes y
              contribuciones legales.
            </p>
            <div className="space-y-2">
              {[
                { value: "si", label: "Sí, estaba registrado correctamente (en blanco)" },
                { value: "parcial", label: "Parcialmente — salario registrado menor al real" },
                { value: "no", label: "No, trabajaba en negro (sin registro)" },
                { value: "no_sabe", label: "No lo sé con certeza" },
              ].map((opt) => (
                <RadioOption
                  key={opt.value}
                  id={`q4-${opt.value}`}
                  name="q4"
                  value={opt.value}
                  checked={answers.q4Registro === opt.value}
                  onChange={() => setQ("q4Registro", opt.value as UserAnswers["q4Registro"])}
                >
                  {opt.label}
                </RadioOption>
              ))}
            </div>
          </fieldset>

          {/* ─── Pregunta 5 ──────────────────────────────────────── */}
          <fieldset>
            <legend className="font-serif text-lg font-500 text-marino mb-1">
              5. ¿Te informaron el motivo del despido?
            </legend>
            <p className="font-body text-sm text-text-secondary mb-3">
              El empleador tiene obligación legal de comunicar el motivo por escrito (art. 243 LCT).
            </p>
            <div className="space-y-2">
              {[
                { value: "si_escrito", label: "Sí, por escrito (telegrama, carta, etc.)" },
                { value: "si_verbal", label: "Sí, pero solo verbalmente" },
                { value: "no", label: "No, no me explicaron ningún motivo" },
              ].map((opt) => (
                <RadioOption
                  key={opt.value}
                  id={`q5-${opt.value}`}
                  name="q5"
                  value={opt.value}
                  checked={answers.q5Motivo === opt.value}
                  onChange={() => setQ("q5Motivo", opt.value as UserAnswers["q5Motivo"])}
                >
                  {opt.label}
                </RadioOption>
              ))}
            </div>
          </fieldset>

          {/* ─── Submit ───────────────────────────────────────────── */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!allAnswered}
              className={cn(
                "w-full py-4 rounded-[6px] font-ui text-base font-600 transition-all duration-250",
                "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2",
                allAnswered
                  ? "cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)]"
                  : "cursor-not-allowed opacity-50"
              )}
              style={
                allAnswered
                  ? { background: "var(--color-marino)", color: "var(--color-bg)" }
                  : { background: "var(--color-bg-tertiary)", color: "var(--color-text-tertiary)" }
              }
              aria-describedby={!allAnswered ? "submit-hint" : undefined}
            >
              Evaluar mi caso →
            </button>
            {!allAnswered && (
              <p
                id="submit-hint"
                className="mt-2 text-center font-ui text-xs text-text-tertiary"
                aria-live="polite"
              >
                Respondé todas las preguntas para continuar.
              </p>
            )}
          </div>
        </div>
      </form>

      {/* ─── Resultado slide-in ──────────────────────────────────── */}
      <div
        ref={resultRef}
        role="region"
        aria-label="Resultado del verificador"
        aria-live="polite"
        className={cn(
          "mt-10 transition-all duration-500 overflow-hidden",
          showResult && resultado
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        )}
        style={{ transitionProperty: "opacity, transform" }}
      >
        {resultado && diagConfig && (
          <div
            ref={verdictRef}
            className="rounded-[10px] border overflow-hidden"
            style={{ borderColor: diagConfig.border }}
          >
            {/* Badge diagnóstico */}
            <div
              className="px-6 py-5 flex items-center gap-4"
              style={{ background: diagConfig.bg, borderBottom: `1px solid ${diagConfig.border}` }}
            >
              <div className="verdict-icon" style={{ color: diagConfig.color }}>
                {diagConfig.icon}
              </div>
              <div className="verdict-label">
                <p
                  className="font-ui text-xs font-600 tracking-[0.10em] uppercase"
                  style={{ color: diagConfig.color }}
                >
                  Diagnóstico orientativo
                </p>
                <p
                  className="font-serif text-xl font-600 mt-0.5"
                  style={{ color: diagConfig.color }}
                >
                  {diagConfig.label}
                </p>
              </div>
            </div>

            {/* Razones */}
            <div className="px-6 py-5 bg-bg">
              <h3 className="font-ui text-sm font-600 text-carbon mb-3">¿Por qué?</h3>
              <ul className="space-y-2.5" role="list">
                {resultado.razones.map((razon, i) => (
                  <li key={i} className="verdict-reason flex items-start gap-2.5">
                    <ChevronRight
                      size={14}
                      className="shrink-0 mt-0.5"
                      style={{ color: "var(--color-dorado-deep)" }}
                      aria-hidden="true"
                    />
                    <span className="font-body text-sm text-carbon-soft leading-relaxed">
                      {razon}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Recomendación */}
              <div
                className="verdict-extra mt-5 p-4 rounded-[6px] border"
                style={{
                  background: "var(--color-bg-warm)",
                  borderColor: "var(--color-border-default)",
                }}
              >
                <p className="font-ui text-xs font-600 text-marino uppercase tracking-wide mb-1.5">
                  Recomendación
                </p>
                <p className="font-body text-sm text-carbon leading-relaxed">
                  {resultado.recomendacion}
                </p>
              </div>

              {/* Disclaimer prominente */}
              <div
                className="verdict-extra mt-4 p-4 rounded-[6px] border"
                style={{
                  background: "rgba(180,83,9,0.04)",
                  borderColor: "rgba(180,83,9,0.20)",
                }}
                role="note"
                aria-label="Aviso legal importante"
              >
                <p className="font-ui text-xs font-600 text-[#92400E] uppercase tracking-wide mb-1.5">
                  Aviso legal importante
                </p>
                <p className="font-ui text-xs text-[#92400E] leading-relaxed">
                  {resultado.disclaimer}
                </p>
              </div>

              {/* CTAs */}
              <div className="verdict-extra mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/reservar"
                  className={cn(
                    "flex-1 text-center py-3 px-4 rounded-[6px] font-ui text-sm font-600",
                    "transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)]",
                    "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
                  )}
                  style={{ background: "var(--color-marino)", color: "var(--color-bg)" }}
                >
                  Reservar consulta →
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-3 px-4 rounded-[6px] font-ui text-sm font-500",
                    "border border-border-default bg-bg",
                    "text-text-secondary",
                    "hover:border-marino hover:text-marino",
                    "transition-colors duration-150",
                    "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
                  )}
                >
                  <RotateCcw size={14} />
                  Nueva evaluación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
