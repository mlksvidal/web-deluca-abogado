import { SkeletonForm } from "@/components/ui/skeleton-card";

export default function CalcDespidoLoading() {
  return (
    <div
      className="min-h-screen py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-label="Cargando calculadora..."
    >
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-10 space-y-3">
          <div
            className="h-8 w-64 rounded animate-pulse"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
            aria-hidden="true"
          />
          <div
            className="h-4 w-80 rounded animate-pulse"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
            aria-hidden="true"
          />
        </div>
        <SkeletonForm />
      </div>
    </div>
  );
}
