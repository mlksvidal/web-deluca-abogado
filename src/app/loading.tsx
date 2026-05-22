import { SkeletonGrid } from "@/components/ui/skeleton-card";

/**
 * loading.tsx — Loading global (ruta raíz).
 * Suspense boundary para la página de inicio.
 */
export default function Loading() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-label="Cargando..."
    >
      {/* Skeleton del hero */}
      <div
        className="animate-pulse"
        style={{
          height: "80vh",
          background: "linear-gradient(135deg, #E8EDF5 0%, #F0ECE4 100%)",
        }}
        aria-hidden="true"
      />
      {/* Skeleton de secciones */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <SkeletonGrid count={3} />
      </div>
    </div>
  );
}
