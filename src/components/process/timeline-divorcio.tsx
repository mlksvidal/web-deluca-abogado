"use client";

/**
 * TimelineDivorcio — visualización scroll-driven del proceso de divorcio.
 *
 * Cada hito entra con IntersectionObserver (sincronizado con el scroll). Al
 * revelarse: la línea conectora se "dibuja" (scaleY 0→1), el dot hace pop
 * (back-ease) y cambia a marino + ícono dorado, y un número fantasma editorial
 * aparece detrás del contenido.
 *
 * prefers-reduced-motion: todo visible/estático desde el inicio.
 * Mobile: stack vertical. Lenis ya está en el layout root.
 */

import * as React from "react";
import {
  MessageSquare,
  Users,
  FileText,
  AlertCircle,
  Calendar,
  CheckCircle,
  BookOpen,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { HitoDivorcio } from "@/lib/timeline-divorcio-config";

// ─── Mapa de íconos ───────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  MessageSquare,
  Users,
  FileText,
  AlertCircle,
  Calendar,
  CheckCircle,
  BookOpen,
  Scale,
};

// ─── Hito individual ──────────────────────────────────────────────────────────

function HitoItem({ hito, index }: { hito: HitoDivorcio; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  // Inicializar como visible si el usuario prefiere movimiento reducido
  const [visible, setVisible] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  React.useEffect(() => {
    if (visible) return; // ya visible por prefers-reduced-motion

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  const Icon = ICON_MAP[hito.icon] ?? MessageSquare;
  const isLast = hito.numero === 8;

  return (
    <div
      ref={ref}
      className="relative flex gap-6 md:gap-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${index * 80}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${index * 80}ms`,
      }}
    >
      {/* ─── Línea vertical + dot ────────────────────────────────── */}
      <div className="flex flex-col items-center shrink-0">
        {/* Dot — pop + cambio de color al revelarse */}
        <div
          className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full border-2"
          style={{
            background: visible ? "var(--color-marino)" : "var(--color-bg-secondary)",
            borderColor: "var(--color-dorado)",
            color: visible ? "var(--color-dorado)" : "var(--color-text-tertiary)",
            transform: visible ? "scale(1)" : "scale(0.7)",
            boxShadow: visible ? "0 0 0 4px rgba(201,164,90,0.14)" : "0 0 0 0 transparent",
            transition:
              "background .4s ease, color .4s ease, box-shadow .5s ease, transform .55s cubic-bezier(.34,1.56,.64,1)",
          }}
          aria-hidden="true"
        >
          <Icon size={18} />
        </div>

        {/* Línea conectora — se dibuja (scaleY) al revelarse */}
        {!isLast && (
          <div
            className="flex-1 w-0.5 mt-2 min-h-[40px]"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-dorado), var(--color-border-default))",
              transformOrigin: "top center",
              transform: visible ? "scaleY(1)" : "scaleY(0)",
              transition: `transform .65s cubic-bezier(.22,1,.36,1) ${index * 80 + 180}ms`,
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ─── Contenido del hito ───────────────────────────────────── */}
      <div className={cn("relative flex-1 pb-10", isLast && "pb-0")}>
        {/* Número fantasma editorial */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-18px",
            right: "0",
            fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(3.5rem, 8vw, 5.5rem)",
            fontWeight: 500,
            fontStyle: "italic",
            lineHeight: 1,
            color: "var(--color-dorado)",
            opacity: visible ? 0.1 : 0,
            transition: "opacity .8s ease .2s",
            pointerEvents: "none",
            zIndex: 0,
            letterSpacing: "-0.03em",
          }}
        >
          {String(hito.numero).padStart(2, "0")}
        </span>

        {/* Número + título */}
        <div className="relative z-[1] flex items-start gap-3 mb-2">
          <span
            className="shrink-0 mt-1 font-ui text-xs font-700 tracking-wide"
            style={{ color: "var(--color-dorado)" }}
            aria-label={`Paso ${hito.numero}`}
          >
            {String(hito.numero).padStart(2, "0")}
          </span>
          <h3 className="font-serif text-lg font-500 text-marino leading-snug">{hito.titulo}</h3>
        </div>

        {/* Descripción */}
        <p className="relative z-[1] font-body text-sm text-text-secondary leading-relaxed mb-3 ml-9">
          {hito.descripcion}
        </p>

        {/* Footer: duración + condicional */}
        <div className="relative z-[1] ml-9 flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-ui text-xs font-500"
            style={{
              background: "var(--color-marino-subtle)",
              color: "var(--color-marino)",
              border: "1px solid rgba(15,30,61,0.15)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "var(--color-dorado)" }}
              aria-hidden="true"
            />
            {hito.duracionEstimada}
          </span>

          {hito.condicional && (
            <span
              className="font-ui text-xs italic"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              ({hito.condicional})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface TimelineDivorcioProps {
  hitos: HitoDivorcio[];
}

export function TimelineDivorcio({ hitos }: TimelineDivorcioProps) {
  return (
    <div className="relative" role="list" aria-label="Pasos del proceso de divorcio">
      {hitos.map((hito, index) => (
        <div key={hito.id} role="listitem">
          <HitoItem hito={hito} index={index} />
        </div>
      ))}
    </div>
  );
}
