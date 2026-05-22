"use client";

import * as React from "react";
import Link from "next/link";
import { Download, FileText, Briefcase, Scale, BookOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadDialog } from "@/components/recursos/download-dialog";
import type { RecursoConfig } from "@/lib/recursos-config";
import { TIPO_LABELS } from "@/lib/recursos-config";

// ─── Icon map (evita pasar funciones a Client Components) ─────────────────────
const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: "true" }>
> = {
  FileText,
  Briefcase,
  Scale,
  BookOpen,
};

type RecursoCardProps = {
  recurso: RecursoConfig;
};

export function RecursoCard({ recurso }: RecursoCardProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const Icon = ICON_MAP[recurso.iconName] ?? FileText;

  return (
    <>
      <article
        className={cn(
          "flex flex-col h-full",
          "bg-[var(--color-bg)]",
          "border border-[var(--color-border-default)]",
          "rounded-[10px]",
          "shadow-[var(--shadow-sm)]",
          "overflow-hidden",
          "transition-all duration-300 ease-primary",
          "hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
        )}
      >
        {/* Header con ícono y área */}
        <div
          className="px-6 pt-7 pb-5"
          style={{
            background: "linear-gradient(135deg, var(--color-marino) 0%, #1E3A6E 100%)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className="inline-flex items-center justify-center w-11 h-11 rounded-[8px] shrink-0"
              style={{
                background: "rgba(201,169,97,0.15)",
                border: "1px solid rgba(201,169,97,0.30)",
              }}
            >
              <Icon size={22} className="text-[var(--color-dorado)]" aria-hidden="true" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span
                className="font-ui text-[10px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(201,169,97,0.12)",
                  color: "var(--color-dorado)",
                  border: "1px solid rgba(201,169,97,0.25)",
                }}
              >
                {TIPO_LABELS[recurso.tipo]}
              </span>
              <span
                className="font-ui text-[10px] font-medium tracking-[0.04em] px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(250,247,242,0.08)",
                  color: "rgba(250,247,242,0.55)",
                  border: "1px solid rgba(250,247,242,0.12)",
                }}
              >
                {recurso.tamano}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-6 py-5">
          <div className="mb-3">
            <Badge variant="area-legal" className="mb-3">
              {recurso.areaLabel}
            </Badge>

            <h2 className="font-serif text-xl font-semibold text-[var(--color-marino)] leading-snug">
              <Link
                href={`/recursos/${recurso.slug}`}
                className="hover:text-[var(--color-marino-hover)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-2 focus-visible:rounded-[2px]"
              >
                {recurso.titulo}
              </Link>
            </h2>
          </div>

          <p className="font-body text-sm text-[var(--color-carbon-soft)] leading-relaxed flex-1 mb-5">
            {recurso.descripcion}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => setDialogOpen(true)}
              aria-label={`Descargar ${recurso.titulo}`}
            >
              <Download size={15} aria-hidden="true" />
              Descargar
            </Button>

            <Link
              href={`/recursos/${recurso.slug}`}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2",
                "h-10 px-5 py-2.5",
                "font-ui text-xs font-medium tracking-wide uppercase",
                "bg-transparent text-[var(--color-marino)]",
                "border border-[var(--color-border-strong)]",
                "rounded-sm",
                "hover:bg-[var(--color-marino-subtle)]",
                "transition-all duration-250",
                "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-3"
              )}
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </article>

      <DownloadDialog recurso={recurso} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
