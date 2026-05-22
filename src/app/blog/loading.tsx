import { SkeletonGrid } from "@/components/ui/skeleton-card";

export default function BlogLoading() {
  return (
    <div
      className="min-h-screen py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-label="Cargando artículos..."
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Skeleton del título */}
        <div className="mb-12 text-center space-y-4">
          <div
            className="h-4 w-24 mx-auto rounded animate-pulse"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
            aria-hidden="true"
          />
          <div
            className="h-10 w-80 mx-auto rounded animate-pulse"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
            aria-hidden="true"
          />
        </div>
        <SkeletonGrid count={6} />
      </div>
    </div>
  );
}
