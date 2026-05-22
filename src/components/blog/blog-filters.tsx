"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const AREAS = [
  { value: "", label: "Todos" },
  { value: "civil_familia", label: "Civil y Familia" },
  { value: "laboral", label: "Laboral" },
  { value: "penal", label: "Penal" },
  { value: "comercial", label: "Comercial" },
  { value: "general", label: "General" },
] as const;

export function BlogFilters({ activeArea }: { activeArea: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleArea = (area: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (area) {
      params.set("area", area);
    } else {
      params.delete("area");
    }
    params.delete("page"); // Reset a página 1 al cambiar filtro
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      role="group"
      aria-label="Filtrar artículos por área legal"
      className="flex flex-wrap gap-2"
    >
      {AREAS.map((area) => {
        const isActive = activeArea === area.value;
        return (
          <button
            key={area.value}
            onClick={() => handleArea(area.value)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center px-4 py-1.5",
              "font-ui text-sm font-medium tracking-wide",
              "rounded-full border",
              "transition-all duration-200 ease-primary",
              "focus-visible:outline-2 focus-visible:outline-offset-2"
            )}
            style={
              isActive
                ? {
                    background: "var(--color-marino)",
                    color: "#F5F2EE",
                    borderColor: "var(--color-marino)",
                  }
                : {
                    background: "transparent",
                    color: "var(--color-carbon-soft)",
                    borderColor: "rgba(15,30,61,0.18)",
                  }
            }
          >
            {area.label}
          </button>
        );
      })}
    </div>
  );
}
