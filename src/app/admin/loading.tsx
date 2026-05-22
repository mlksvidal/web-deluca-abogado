import { SkeletonList } from "@/components/ui/skeleton-card";

export default function AdminLoading() {
  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{ backgroundColor: "#F8F8F8" }}
      aria-label="Cargando panel de administración..."
    >
      <div className="max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div
            className="h-8 w-48 rounded animate-pulse"
            style={{ backgroundColor: "#E5E5E5" }}
            aria-hidden="true"
          />
          <div
            className="h-10 w-32 rounded animate-pulse"
            style={{ backgroundColor: "#E5E5E5" }}
            aria-hidden="true"
          />
        </div>
        {/* Filtros skeleton */}
        <div className="flex gap-3 mb-6" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 rounded animate-pulse"
              style={{ backgroundColor: "#E5E5E5" }}
            />
          ))}
        </div>
        <SkeletonList count={5} />
      </div>
    </div>
  );
}
