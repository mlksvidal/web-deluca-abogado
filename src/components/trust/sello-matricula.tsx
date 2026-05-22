import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

/**
 * SelloMatricula — badge institucional con número de matrícula.
 *
 * Reutilizable en: Footer, About, página específica.
 * Enlaza al registro oficial del Colegio de Abogados de Mendoza.
 *
 * @example
 * <SelloMatricula />
 * <SelloMatricula variant="light" />
 */
type SelloMatriculaProps = {
  /** Variante de color según el fondo donde se usa */
  variant?: "dark" | "light";
  className?: string;
};

function SelloMatricula({ variant = "dark", className }: SelloMatriculaProps) {
  const isDark = variant === "dark";

  return (
    <a
      href={siteConfig.colegioUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Verificá el registro oficial en el Colegio de Abogados de Mendoza"
      className={cn(
        "inline-flex items-center gap-3",
        "group",
        "transition-opacity duration-250",
        "hover:opacity-80",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-3",
        className
      )}
    >
      {/* Sello SVG */}
      <div
        className={cn(
          "relative flex-shrink-0 w-10 h-10",
          "opacity-80 group-hover:opacity-100 transition-opacity duration-250"
        )}
        aria-hidden="true"
      >
        <Image
          src={isDark ? "/logos/v4-seal-gold.svg" : "/logos/v4-seal-marino.svg"}
          alt=""
          width={40}
          height={40}
          className="w-full h-full"
        />
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            "font-ui text-xs font-semibold tracking-[0.06em] uppercase",
            isDark ? "text-[rgba(250,247,242,0.60)]" : "text-[var(--color-text-tertiary)]"
          )}
        >
          Matrícula {siteConfig.matricula}
        </span>
        <span
          className={cn(
            "font-ui text-xs",
            isDark ? "text-[rgba(250,247,242,0.40)]" : "text-[var(--color-text-tertiary)]"
          )}
        >
          {siteConfig.colegioName}
        </span>
      </div>
    </a>
  );
}

export { SelloMatricula };
export type { SelloMatriculaProps };
