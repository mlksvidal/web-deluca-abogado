"use client";

/**
 * TriajeWizard — Wizard 3 pasos → wa.me pre-armado.
 *
 * Paso 1: Área (4 radio-cards)
 * Paso 2: Urgencia (3 cards)
 * Paso 3: Tipo de consulta (3 cards)
 * Resultado: preview mensaje + botón WhatsApp
 *
 * Diseño: azul eléctrico #2952FF para cards seleccionadas, progress bar y botón Continuar.
 * Fondo de sección: bg-warm (cálido, distinto del marino institucional).
 */

import { useState, useId } from "react";
import { siteConfig } from "@/lib/site-config";

// ── Datos de los pasos ──────────────────────────────────────────────────────

const AREAS = [
  { id: "civil_familia", label: "Civil y Familia", desc: "Divorcios, herencias, daños" },
  { id: "laboral", label: "Laboral", desc: "Despidos, accidentes, haberes" },
  { id: "penal", label: "Penal", desc: "Defensa, víctimas, excarcelación" },
  { id: "comercial", label: "Comercial", desc: "Sociedades, contratos, cobros" },
] as const;

const URGENCIAS = [
  { id: "inmediata", label: "Inmediata", desc: "Necesito respuesta en las próximas 24 h" },
  { id: "semana", label: "Esta semana", desc: "Puedo esperar unos días" },
  { id: "sin_apuro", label: "Sin urgencia", desc: "Estoy planificando con tiempo" },
] as const;

const TIPOS = [
  { id: "asesoria", label: "Asesoría puntual", desc: "Quiero entender mis derechos y opciones" },
  {
    id: "tramite",
    label: "Iniciar un trámite",
    desc: "Necesito representación para iniciar una causa",
  },
  {
    id: "defensa",
    label: "Defensa en curso",
    desc: "Tengo una causa abierta y necesito patrocinio",
  },
] as const;

type AreaId = (typeof AREAS)[number]["id"];
type UrgenciaId = (typeof URGENCIAS)[number]["id"];
type TipoId = (typeof TIPOS)[number]["id"];

interface WizardState {
  area: AreaId | null;
  urgencia: UrgenciaId | null;
  tipo: TipoId | null;
}

// ── Labels legibles para el mensaje ────────────────────────────────────────

function getLabel(id: string, list: ReadonlyArray<{ id: string; label: string }>) {
  return list.find((x) => x.id === id)?.label ?? id;
}

function buildWhatsAppMessage(state: WizardState): string {
  const area = getLabel(state.area ?? "", AREAS);
  const urgencia = getLabel(state.urgencia ?? "", URGENCIAS);
  const tipo = getLabel(state.tipo ?? "", TIPOS);
  return `Hola Dr., tengo una consulta de ${area}, urgencia: ${urgencia}, tipo: ${tipo}. Me gustaría coordinar una entrevista.`;
}

// ── Sub-componente: RadioCard con azul eléctrico ──────────────────────────

interface RadioCardProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  desc: string;
}

function RadioCard({ id, name, checked, onChange, label, desc }: RadioCardProps) {
  return (
    <label htmlFor={id} className={`triaje-card ${checked ? "triaje-card--selected" : ""}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {/* Indicador visual seleccionado */}
      <span className="triaje-card-check" aria-hidden="true">
        {checked ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" fill="#fff" />
            <path
              d="M4.5 8l2.5 2.5L11 5.5"
              stroke="var(--color-azul-electrico, #2952ff)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="rgba(15,30,61,.2)" strokeWidth="1" />
          </svg>
        )}
      </span>
      <span className="triaje-card-text">
        <span className="triaje-card-label">{label}</span>
        <span className="triaje-card-desc">{desc}</span>
      </span>
    </label>
  );
}

// ── Componente principal ────────────────────────────────────────────────────

export function TriajeWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | "done">(1);
  const [state, setState] = useState<WizardState>({ area: null, urgencia: null, tipo: null });
  const [visible, setVisible] = useState(true);
  const instanceId = useId();

  /** Transición con fade: ocultar → actualizar → mostrar */
  function transition(fn: () => void) {
    setVisible(false);
    setTimeout(() => {
      fn();
      setVisible(true);
    }, 200);
  }

  function goNext() {
    if (step === 1 && state.area) transition(() => setStep(2));
    else if (step === 2 && state.urgencia) transition(() => setStep(3));
    else if (step === 3 && state.tipo) transition(() => setStep("done"));
  }
  function goBack() {
    if (step === 2) transition(() => setStep(1));
    else if (step === 3) transition(() => setStep(2));
    else if (step === "done") transition(() => setStep(3));
  }
  function restart() {
    transition(() => {
      setStep(1);
      setState({ area: null, urgencia: null, tipo: null });
    });
  }

  const canContinue =
    (step === 1 && !!state.area) ||
    (step === 2 && !!state.urgencia) ||
    (step === 3 && !!state.tipo);

  const totalSteps = 3;
  const currentStep = step === "done" ? 3 : (step as number);
  const progressPct = step === "done" ? 100 : ((currentStep - 1) / totalSteps) * 100;

  const waMessage = buildWhatsAppMessage(state);
  const waUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <section className="triaje-section" aria-label="Asistente de consulta por WhatsApp">
      <div className="triaje-container">
        {/* Header */}
        <div className="triaje-header">
          <span
            style={{
              fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "var(--color-dorado-deep, #B89344)",
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "24px",
                height: "1px",
                background: "var(--color-dorado-deep, #B89344)",
                flexShrink: 0,
              }}
            />
            Consulta rápida
          </span>
          <h2
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(1.6rem, 1rem + 2vw, 2.4rem)",
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "var(--color-marino, #0F1E3D)",
              marginBottom: "8px",
            }}
          >
            ¿De qué se trata tu consulta?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
              fontSize: ".9rem",
              color: "var(--color-carbon-soft, #3A3A3A)",
              marginBottom: "0",
            }}
          >
            Respondé 3 preguntas y te armamos el mensaje para WhatsApp.
          </p>
        </div>

        {/* Progress bar — azul eléctrico, bien visible con label */}
        <div className="triaje-progress-wrap">
          <div className="triaje-progress-labels">
            <span className="triaje-progress-step-label">
              {step === "done" ? "¡Listo!" : `Paso ${currentStep} de ${totalSteps}`}
            </span>
            <span className="triaje-progress-pct">
              {step === "done" ? "100%" : `${Math.round(progressPct)}%`}
            </span>
          </div>
          <div
            className="triaje-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              step === "done" ? 100 : Math.round(((currentStep - 1) / totalSteps) * 100)
            }
            aria-label={step === "done" ? "Completado" : `Paso ${currentStep} de ${totalSteps}`}
          >
            <div className="triaje-progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Step content — fade transition */}
        <div
          className="triaje-content"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 250ms ease, transform 250ms ease",
          }}
        >
          {/* ── PASO 1: Área ── */}
          {step === 1 && (
            <fieldset className="triaje-fieldset">
              <legend className="triaje-step-label">¿Qué tipo de consulta es?</legend>
              <div className="triaje-cards triaje-cards--2col">
                {AREAS.map((area) => (
                  <RadioCard
                    key={area.id}
                    id={`${instanceId}-area-${area.id}`}
                    name={`${instanceId}-area`}
                    checked={state.area === area.id}
                    onChange={() => setState((s) => ({ ...s, area: area.id }))}
                    label={area.label}
                    desc={area.desc}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {/* ── PASO 2: Urgencia ── */}
          {step === 2 && (
            <fieldset className="triaje-fieldset">
              <legend className="triaje-step-label">¿Qué urgencia tiene?</legend>
              <div className="triaje-cards triaje-cards--3col">
                {URGENCIAS.map((urg) => (
                  <RadioCard
                    key={urg.id}
                    id={`${instanceId}-urg-${urg.id}`}
                    name={`${instanceId}-urgencia`}
                    checked={state.urgencia === urg.id}
                    onChange={() => setState((s) => ({ ...s, urgencia: urg.id }))}
                    label={urg.label}
                    desc={urg.desc}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {/* ── PASO 3: Tipo ── */}
          {step === 3 && (
            <fieldset className="triaje-fieldset">
              <legend className="triaje-step-label">¿Qué necesitás?</legend>
              <div className="triaje-cards triaje-cards--3col">
                {TIPOS.map((tipo) => (
                  <RadioCard
                    key={tipo.id}
                    id={`${instanceId}-tipo-${tipo.id}`}
                    name={`${instanceId}-tipo`}
                    checked={state.tipo === tipo.id}
                    onChange={() => setState((s) => ({ ...s, tipo: tipo.id }))}
                    label={tipo.label}
                    desc={tipo.desc}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {/* ── RESULTADO ── */}
          {step === "done" && (
            <div className="triaje-result">
              <div className="triaje-result-preview">
                <span
                  style={{
                    fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
                    fontSize: "11px",
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    color: "var(--color-dorado-deep, #B89344)",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Mensaje pre-armado
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-lora, Lora, Georgia, serif)",
                    fontSize: ".95rem",
                    lineHeight: 1.6,
                    color: "var(--color-marino, #0F1E3D)",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  &ldquo;{waMessage}&rdquo;
                </p>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="triaje-wa-btn"
                aria-label="Enviar mensaje por WhatsApp al Dr. De Luca"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.548 4.107 1.508 5.842L.057 23.5l5.798-1.52A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.868 0-3.624-.5-5.14-1.374l-.369-.218-3.82 1.002 1.02-3.72-.24-.381C2.498 15.618 2 13.87 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                Enviar por WhatsApp
              </a>

              <button
                type="button"
                className="triaje-restart-btn"
                onClick={restart}
                aria-label="Reiniciar el asistente de consulta"
              >
                Empezar de nuevo
              </button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {step !== "done" && (
          <div className="triaje-nav">
            {(step === 2 || step === 3) && (
              <button type="button" className="triaje-btn triaje-btn--back" onClick={goBack}>
                ← Atrás
              </button>
            )}
            <button
              type="button"
              className={`triaje-btn triaje-btn--next ${!canContinue ? "triaje-btn--disabled" : ""}`}
              onClick={goNext}
              disabled={!canContinue}
              aria-disabled={!canContinue}
            >
              {step === 3 ? "Ver resumen" : "Continuar"}
              {step !== 3 && <span aria-hidden="true"> →</span>}
            </button>
          </div>
        )}
      </div>

      <style>{`
        /* ── Section wrapper — fondo cálido, zona interactiva diferenciada ── */
        .triaje-section {
          background: var(--color-bg-warm, #F2EBDE);
          padding: 72px 0;
          border-top: 1px solid rgba(15,30,61,.08);
          border-bottom: 1px solid rgba(15,30,61,.08);
        }

        .triaje-container {
          max-width: 860px;
          margin-inline: auto;
          padding-inline: clamp(20px, 4vw, 40px);
        }

        /* ── Header ── */
        .triaje-header { margin-bottom: 28px; }

        /* ── Progress bar — azul eléctrico, bien visible ── */
        .triaje-progress-wrap {
          margin-bottom: 32px;
        }
        .triaje-progress-labels {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .triaje-progress-step-label {
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: .78rem;
          font-weight: 500;
          color: var(--color-marino, #0F1E3D);
          letter-spacing: .04em;
        }
        .triaje-progress-pct {
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: .72rem;
          color: var(--color-marino, #0F1E3D);
          font-weight: 600;
          letter-spacing: .04em;
        }
        .triaje-progress {
          position: relative;
          height: 4px;
          background: rgba(15,30,61,.12);
          border-radius: 2px;
          overflow: hidden;
        }
        .triaje-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--color-azul-electrico, #2952ff), var(--color-azul-electrico-hover, #4366ff));
          border-radius: 2px;
          transition: width 400ms cubic-bezier(.22,1,.36,1);
        }

        /* ── Content ── */
        .triaje-content { min-height: 220px; }

        /* ── Fieldset reset ── */
        .triaje-fieldset {
          border: none;
          padding: 0;
          margin: 0;
        }
        .triaje-step-label {
          font-family: var(--font-playfair, 'Playfair Display', Georgia, serif);
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--color-marino, #0F1E3D);
          margin-bottom: 20px;
          display: block;
        }

        /* ── Cards grid ── */
        .triaje-cards {
          display: grid;
          gap: 12px;
        }
        .triaje-cards--2col {
          grid-template-columns: 1fr;
        }
        .triaje-cards--3col {
          grid-template-columns: 1fr;
        }
        @media (min-width: 480px) {
          .triaje-cards--2col { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 600px) {
          .triaje-cards--3col { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── Radio Card — padding generoso, border 1.5px, azul eléctrico en hover/selected ── */
        .triaje-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 24px 24px;
          background: var(--color-bg, #FAF7F2);
          border: 1.5px solid rgba(15,30,61,.1);
          cursor: pointer;
          transition: border-color .25s cubic-bezier(.22,1,.36,1),
                      box-shadow .25s cubic-bezier(.22,1,.36,1),
                      background .25s cubic-bezier(.22,1,.36,1),
                      transform .2s cubic-bezier(.22,1,.36,1);
          border-radius: 4px;
          position: relative;
        }
        .triaje-card:hover {
          border-color: var(--color-azul-electrico, #2952ff);
          background: var(--color-azul-electrico-soft, rgba(41,82,255,.08));
          box-shadow: 0 4px 16px -4px var(--color-azul-electrico-shadow, rgba(41,82,255,.25));
        }
        .triaje-card--selected {
          border-color: var(--color-azul-electrico, #2952ff);
          background: var(--color-azul-electrico, #2952ff);
          box-shadow: 0 6px 22px -6px var(--color-azul-electrico-shadow, rgba(41,82,255,.45));
          transform: scale(1.02);
        }

        .triaje-card-check {
          flex-shrink: 0;
          margin-top: 2px;
          display: flex;
          align-items: center;
        }

        .triaje-card-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .triaje-card-label {
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: .92rem;
          font-weight: 600;
          color: var(--color-marino, #0F1E3D);
          line-height: 1.3;
          transition: color .2s;
        }
        .triaje-card--selected .triaje-card-label {
          color: #fff;
        }
        .triaje-card-desc {
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: .8rem;
          color: var(--color-carbon-soft, #3A3A3A);
          line-height: 1.4;
          transition: color .2s;
        }
        .triaje-card--selected .triaje-card-desc {
          color: rgba(255,255,255,.75);
        }

        /* ── Navigation buttons ── */
        .triaje-nav {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(15,30,61,.08);
        }

        .triaje-btn {
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: .05em;
          text-transform: uppercase;
          padding: 12px 24px;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          transition: transform .25s cubic-bezier(.22,1,.36,1),
                      background .25s cubic-bezier(.22,1,.36,1),
                      box-shadow .25s cubic-bezier(.22,1,.36,1),
                      opacity .25s;
        }
        .triaje-btn--back {
          background: transparent;
          color: var(--color-carbon-soft, #3A3A3A);
          border: 1.5px solid rgba(15,30,61,.15);
        }
        .triaje-btn--back:hover {
          background: rgba(15,30,61,.05);
        }
        /* Botón Continuar — azul eléctrico */
        .triaje-btn--next {
          background: var(--color-azul-electrico, #2952ff);
          color: #fff;
          box-shadow: 0 4px 14px -4px var(--color-azul-electrico-shadow, rgba(41,82,255,.35));
        }
        .triaje-btn--next:hover:not(.triaje-btn--disabled) {
          background: var(--color-azul-electrico-hover, #4366ff);
          transform: translateY(-1px);
          box-shadow: 0 8px 22px -6px var(--color-azul-electrico-shadow, rgba(41,82,255,.5));
        }
        .triaje-btn--disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        /* ── Result ── */
        .triaje-result {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .triaje-result-preview {
          padding: 20px 24px;
          background: var(--color-bg, #FAF7F2);
          border: 1px solid rgba(201,169,97,.3);
          border-left: 3px solid var(--color-dorado, #C9A961);
          border-radius: 2px;
        }

        /* WhatsApp button */
        .triaje-wa-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 32px;
          background: #25D366;
          color: #fff;
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: .03em;
          border-radius: 4px;
          text-decoration: none;
          box-shadow: 0 8px 20px -6px rgba(37,211,102,.5);
          transition: transform .3s cubic-bezier(.22,1,.36,1),
                      background .3s cubic-bezier(.22,1,.36,1),
                      box-shadow .3s cubic-bezier(.22,1,.36,1);
          align-self: flex-start;
        }
        .triaje-wa-btn:hover {
          background: #1ebe5d;
          transform: translateY(-2px);
          box-shadow: 0 14px 28px -8px rgba(37,211,102,.55);
        }

        /* Restart button */
        .triaje-restart-btn {
          background: transparent;
          border: none;
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: .83rem;
          color: var(--color-carbon-soft, #3A3A3A);
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 3px;
          align-self: flex-start;
          transition: color .2s;
        }
        .triaje-restart-btn:hover {
          color: var(--color-marino, #0F1E3D);
        }

        /* Screen reader only */
        .sr-only {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .triaje-progress-bar,
          .triaje-card,
          .triaje-btn,
          .triaje-wa-btn {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
