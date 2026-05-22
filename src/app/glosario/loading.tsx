import { SkeletonList } from "@/components/ui/skeleton-card";

export default function GlosarioLoading() {
  return (
    <div
      className="min-h-screen py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-label="Cargando glosario..."
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Título skeleton */}
        <div className="mb-12 space-y-4">
          <div
            className="h-10 w-72 rounded animate-pulse"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
            aria-hidden="true"
          />
          <div
            className="h-5 w-96 rounded animate-pulse"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
            aria-hidden="true"
          />
        </div>
        {/* Filtro de letras skeleton */}
        <div className="flex flex-wrap gap-2 mb-10" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-10 rounded animate-pulse"
              style={{ backgroundColor: "var(--color-bg-secondary)" }}
            />
          ))}
        </div>
        <SkeletonList count={8} />
      </div>
    </div>
  );
}
