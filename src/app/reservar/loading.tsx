import { SkeletonForm } from "@/components/ui/skeleton-card";

export default function ReservarLoading() {
  return (
    <div
      className="min-h-screen py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-label="Cargando formulario de reserva..."
    >
      <div className="max-w-2xl mx-auto px-6">
        {/* Título skeleton */}
        <div className="mb-12 space-y-3">
          <div
            className="h-10 w-80 rounded animate-pulse"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
            aria-hidden="true"
          />
          <div
            className="h-5 w-96 rounded animate-pulse"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
            aria-hidden="true"
          />
        </div>
        <SkeletonForm />
      </div>
    </div>
  );
}
