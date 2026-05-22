"use client";

/**
 * GlosarioClient — filtro alfabético + búsqueda Fuse.js
 * Motion intensity 3 → CSS puro, sin Framer Motion
 */

import * as React from "react";
import Link from "next/link";
import Fuse, { type IFuseOptions } from "fuse.js";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GlosarioTerminoRow } from "@/app/actions/glosario";

// ─── Constantes ───────────────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General",
};

const AREA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  civil_familia: {
    bg: "rgba(15,30,61,0.06)",
    text: "var(--color-marino)",
    border: "rgba(15,30,61,0.15)",
  },
  laboral: {
    bg: "rgba(201,169,97,0.10)",
    text: "#7A5F1A",
    border: "rgba(201,169,97,0.30)",
  },
  penal: {
    bg: "rgba(169,29,29,0.06)",
    text: "#7A1818",
    border: "rgba(169,29,29,0.15)",
  },
  comercial: {
    bg: "rgba(46,160,67,0.06)",
    text: "#1A5C2A",
    border: "rgba(46,160,67,0.15)",
  },
  general: {
    bg: "rgba(107,114,128,0.08)",
    text: "var(--color-text-secondary)",
    border: "rgba(107,114,128,0.18)",
  },
};

// ─── Fuse.js config ───────────────────────────────────────────────────────────

const FUSE_OPTIONS: IFuseOptions<GlosarioTerminoRow> = {
  keys: [
    { name: "termino", weight: 2 },
    { name: "sinonimos", weight: 1.5 },
    { name: "definicionCorta", weight: 0.8 },
    { name: "areaLegal", weight: 0.5 },
  ],
  threshold: 0.35,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

// ─── Componente término card ──────────────────────────────────────────────────

function TerminoCard({ termino }: { termino: GlosarioTerminoRow }) {
  const area = termino.areaLegal ?? "general";
  const colors = AREA_COLORS[area] ?? AREA_COLORS.general;
  const areaLabel = AREA_LABELS[area] ?? "General";

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 p-5",
        "bg-bg border border-border-default rounded-[8px]",
        "transition-all duration-250",
        "hover:border-marino hover:shadow-[var(--shadow-md)]",
        "hover:-translate-y-[2px]"
      )}
    >
      {/* Letra inicial grande */}
      <div
        className="absolute top-4 right-4 font-serif text-5xl font-700 leading-none select-none pointer-events-none"
        style={{ color: "var(--color-dorado)", opacity: 0.12 }}
        aria-hidden="true"
      >
        {termino.letra}
      </div>

      {/* Término */}
      <h3 className="font-serif text-lg font-500 text-marino leading-tight pr-8">
        {termino.termino}
      </h3>

      {/* Definición corta */}
      <p className="font-body text-sm text-text-secondary leading-relaxed line-clamp-3 flex-1">
        {termino.definicionCorta}
      </p>

      {/* Footer: badge + link */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border-default">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full font-ui text-xs font-500"
          style={{
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
        >
          {areaLabel}
        </span>
        <Link
          href={`/glosario/${termino.slug}`}
          className={cn(
            "font-ui text-xs font-500 text-marino",
            "hover:text-dorado-deep transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2 focus-visible:rounded-[4px]",
            "flex items-center gap-1 group"
          )}
          aria-label={`Ver definición completa de ${termino.termino}`}
        >
          Ver completo
          <span
            className="transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface GlosarioClientProps {
  terminos: GlosarioTerminoRow[];
  letrasConTerminos: Set<string>;
  allLetters: string[];
}

export function GlosarioClient({ terminos, letrasConTerminos, allLetters }: GlosarioClientProps) {
  const [letraActiva, setLetraActiva] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Fuse instance — memo para no recrear en cada render
  const fuse = React.useMemo(() => new Fuse(terminos, FUSE_OPTIONS), [terminos]);

  // Términos filtrados
  const terminosFiltrados = React.useMemo(() => {
    let result = terminos;

    // Filtro letra
    if (letraActiva) {
      result = result.filter((t) => t.letra === letraActiva);
    }

    // Búsqueda fuzzy sobre los ya filtrados por letra
    if (query.trim().length >= 2) {
      const fuseBase = letraActiva ? new Fuse(result, FUSE_OPTIONS) : fuse;
      result = fuseBase.search(query.trim()).map((r) => r.item);
    }

    return result;
  }, [terminos, letraActiva, query, fuse]);

  const handleLetraClick = (letra: string) => {
    setLetraActiva((prev) => (prev === letra ? null : letra));
    setQuery(""); // Reset búsqueda al cambiar letra
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div>
      {/* ─── Barra de búsqueda ────────────────────────────────────── */}
      <div className="relative max-w-md mb-8">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value) setLetraActiva(null); // búsqueda global limpia el filtro letra
          }}
          placeholder="Buscar término, sinónimo o área…"
          className={cn(
            "w-full pl-9 pr-9 py-2.5 rounded-[6px]",
            "font-ui text-sm text-carbon",
            "bg-bg border border-border-default",
            "placeholder:text-text-tertiary",
            "transition-colors duration-150",
            "focus:outline-none focus:border-marino focus:ring-2 focus:ring-marino/10"
          )}
          aria-label="Buscar en el glosario jurídico"
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-sm text-text-tertiary hover:text-carbon transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-dorado"
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ─── Barra alfabética sticky ──────────────────────────────── */}
      <div
        className="sticky top-[68px] z-10 -mx-6 px-6 py-3 mb-8 border-b border-border-default"
        style={{ background: "var(--color-bg-secondary)", backdropFilter: "blur(8px)" }}
        aria-label="Filtrar por letra"
        role="navigation"
      >
        <div className="flex flex-wrap gap-1" role="group" aria-label="Letras del alfabeto">
          {allLetters.map((letra) => {
            const tieneTerminos = letrasConTerminos.has(letra);
            const isActive = letraActiva === letra;
            return (
              <button
                key={letra}
                onClick={() => tieneTerminos && handleLetraClick(letra)}
                disabled={!tieneTerminos}
                aria-pressed={isActive}
                aria-label={tieneTerminos ? `Filtrar por ${letra}` : `${letra} — sin términos`}
                className={cn(
                  "w-7 h-7 rounded-[4px] font-ui text-xs font-600 transition-all duration-150",
                  "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-1",
                  tieneTerminos
                    ? isActive
                      ? "bg-marino text-dorado"
                      : "bg-bg border border-border-default text-dorado-deep hover:border-marino hover:text-marino"
                    : "opacity-30 cursor-not-allowed text-text-tertiary"
                )}
              >
                {letra}
              </button>
            );
          })}
          {letraActiva && (
            <button
              onClick={() => setLetraActiva(null)}
              className={cn(
                "px-2 h-7 rounded-[4px] font-ui text-xs font-500",
                "bg-bg-tertiary text-text-secondary",
                "border border-border-default",
                "hover:border-carbon transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-1"
              )}
              aria-label="Ver todos los términos"
            >
              × Todos
            </button>
          )}
        </div>
      </div>

      {/* ─── Contador de resultados ───────────────────────────────── */}
      <div className="mb-6" aria-live="polite" aria-atomic="true">
        <p className="font-ui text-sm text-text-tertiary">
          {query || letraActiva ? (
            <>
              <span className="font-600 text-carbon">{terminosFiltrados.length}</span> resultado
              {terminosFiltrados.length !== 1 ? "s" : ""}
              {letraActiva && ` para la letra ${letraActiva}`}
              {query && ` para "${query}"`}
            </>
          ) : (
            <>
              <span className="font-600 text-carbon">{terminos.length}</span> términos jurídicos
            </>
          )}
        </p>
      </div>

      {/* ─── Grid de términos ─────────────────────────────────────── */}
      {terminosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {terminosFiltrados.map((termino) => (
            <TerminoCard key={termino.id} termino={termino} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-serif text-xl text-text-secondary mb-2">No encontramos resultados</p>
          <p className="font-ui text-sm text-text-tertiary">
            Probá con otro término o revisá la ortografía
          </p>
          <button
            onClick={() => {
              setQuery("");
              setLetraActiva(null);
            }}
            className="mt-4 font-ui text-sm text-marino underline underline-offset-2 hover:text-dorado-deep transition-colors duration-150"
          >
            Ver todos los términos
          </button>
        </div>
      )}
    </div>
  );
}
