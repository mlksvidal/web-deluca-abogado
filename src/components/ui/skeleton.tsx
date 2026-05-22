import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton — placeholder de carga con shimmer suave.
 *
 * Uso exclusivo en:
 *   - Grid de slots del calendario (booking)
 *   - Tabla admin — carga inicial de turnos
 *   - NO usar en landing (SSR — no necesita skeleton)
 *
 * El shimmer usa los tokens bg-secondary → bg-tertiary del design system,
 * con un tono cálido coherente con la paleta marino/dorado.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Fondo base cálido (no gris frío)
        "bg-bg-secondary",
        // Animación pulse sutil — no shimmer lateral (tono institucional)
        "animate-pulse",
        "rounded-[4px]",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

/** Grupo de skeletons para el grid de slots del calendario */
function SlotGridSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Cargando horarios disponibles…" className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="h-12 w-full rounded-[4px]"
              style={{ animationDelay: `${(rowIndex * 3 + colIndex) * 50}ms` }}
            />
          ))}
        </div>
      ))}
      <p className="text-xs text-text-tertiary font-ui mt-2">Buscando disponibilidad…</p>
    </div>
  );
}

/** Skeleton para tabla admin */
function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex gap-4 items-center py-3 border-b border-border-default" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" style={{ animationDelay: `${i * 40}ms` }} />
      ))}
    </div>
  );
}

export { Skeleton, SlotGridSkeleton, TableRowSkeleton };
