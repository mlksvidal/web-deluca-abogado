"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DownloadForm } from "@/components/recursos/download-form";
import type { RecursoConfig } from "@/lib/recursos-config";

type RecursoDownloadSectionProps = {
  recurso: Pick<RecursoConfig, "slug" | "titulo" | "areaLegal" | "areaLabel">;
};

export function RecursoDownloadSection({ recurso }: RecursoDownloadSectionProps) {
  return (
    <div
      className={cn(
        "rounded-[12px] overflow-hidden",
        "border-t-4 border-t-[var(--color-marino)]",
        "border border-[var(--color-border-default)]",
        "shadow-[var(--shadow-md)]"
      )}
      style={{ background: "var(--color-bg)" }}
    >
      {/* Header del panel */}
      <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border-default)]">
        <h2 className="font-serif text-xl font-semibold text-[var(--color-marino)] leading-snug">
          Descargá este documento
        </h2>
        <p className="font-body text-sm text-[var(--color-text-secondary)] mt-1">
          Completá tus datos y accedé al PDF de forma gratuita.
        </p>
      </div>

      {/* Form */}
      <div className="px-6 py-6">
        <DownloadForm recurso={recurso} />
      </div>
    </div>
  );
}
