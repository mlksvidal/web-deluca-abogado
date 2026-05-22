"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DownloadForm } from "@/components/recursos/download-form";
import type { RecursoConfig } from "@/lib/recursos-config";

type DownloadDialogProps = {
  recurso: Pick<RecursoConfig, "slug" | "titulo" | "areaLegal" | "areaLabel">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DownloadDialog({ recurso, open, onOpenChange }: DownloadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Descargar documento</DialogTitle>
          <DialogDescription>
            Completá tus datos para acceder a &ldquo;{recurso.titulo}&rdquo; de forma gratuita.
            También te enviaremos una copia a tu email.
          </DialogDescription>
        </DialogHeader>

        <DownloadForm
          recurso={recurso}
          onSuccess={() => {
            // El diálogo se mantiene abierto para mostrar el link de descarga
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
