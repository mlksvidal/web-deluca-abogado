"use client";

/**
 * GlosarioForm — form compartido para crear y editar términos del glosario.
 * Usado por /admin/glosario/nuevo y /admin/glosario/editar/[slug]
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createTermino, updateTermino, deleteTermino } from "@/app/actions/glosario";
import type { GlosarioTerminoRow } from "@/app/actions/glosario";
import { Save, Trash2, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

function autoLetra(text: string): string {
  return text.trim().normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase() || "";
}

const AREA_OPTIONS = [
  { value: "civil_familia", label: "Civil y Familia" },
  { value: "laboral", label: "Laboral" },
  { value: "penal", label: "Penal" },
  { value: "comercial", label: "Comercial" },
  { value: "general", label: "General" },
] as const;

// ─── Tags input ───────────────────────────────────────────────────────────────

function TagsInput({
  label,
  value,
  onChange,
  placeholder,
  id,
}: {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  id: string;
}) {
  const [inputValue, setInputValue] = React.useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div>
      <Label htmlFor={id} className="font-ui text-sm font-500 text-carbon">
        {label}
      </Label>
      <div className="mt-1.5 flex flex-wrap gap-1.5 min-h-[42px] p-2 rounded-[6px] border border-border-default bg-bg focus-within:border-marino focus-within:ring-2 focus-within:ring-marino/10 transition-colors duration-150">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full font-ui text-xs text-marino border border-border-default bg-bg-warm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-error transition-colors duration-100 focus-visible:outline-none"
              aria-label={`Eliminar ${tag}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue);
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] font-ui text-sm text-carbon bg-transparent outline-none placeholder:text-text-tertiary"
        />
      </div>
      <p className="mt-1 font-ui text-xs text-text-tertiary">
        Presioná Enter o coma para agregar. Backspace para eliminar el último.
      </p>
    </div>
  );
}

// ─── Form principal ───────────────────────────────────────────────────────────

interface GlosarioFormProps {
  mode: "create" | "edit";
  termino?: GlosarioTerminoRow;
  allTerminos?: Array<{ slug: string; termino: string }>;
}

interface FormState {
  termino: string;
  slug: string;
  letra: string;
  definicionCorta: string;
  definicionLarga: string;
  areaLegal: string;
  sinonimos: string[];
  terminosRelacionados: string[];
}

export function GlosarioForm({ mode, termino, allTerminos = [] }: GlosarioFormProps) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  const [form, setForm] = React.useState<FormState>({
    termino: termino?.termino ?? "",
    slug: termino?.slug ?? "",
    letra: termino?.letra ?? "",
    definicionCorta: termino?.definicionCorta ?? "",
    definicionLarga: termino?.definicionLarga ?? "",
    areaLegal: termino?.areaLegal ?? "general",
    sinonimos: termino?.sinonimos ?? [],
    terminosRelacionados: termino?.terminosRelacionados ?? [],
  });

  // Slug y letra auto-derivados al tipear el término (solo en modo create)
  const handleTerminoChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      termino: value,
      ...(mode === "create" ? { slug: slugify(value), letra: autoLetra(value) } : {}),
    }));
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});
    setSaving(true);

    const payload = {
      termino: form.termino,
      slug: form.slug,
      letra: form.letra,
      definicionCorta: form.definicionCorta,
      definicionLarga: form.definicionLarga,
      areaLegal: form.areaLegal as "civil_familia" | "laboral" | "penal" | "comercial" | "general",
      sinonimos: form.sinonimos,
      terminosRelacionados: form.terminosRelacionados,
    };

    try {
      const result =
        mode === "create"
          ? await createTermino(payload)
          : await updateTermino(termino!.slug, payload);

      if (result.success) {
        router.push("/admin/glosario");
        router.refresh();
      } else {
        if (result.error === "slug_taken") {
          setErrorMsg("Ya existe un término con ese slug. Cambiá el nombre o el slug.");
        } else if (result.error === "validation_error" && result.fields) {
          setFieldErrors(result.fields);
          setErrorMsg("Revisá los campos marcados.");
        } else {
          setErrorMsg("Ocurrió un error. Intentá de nuevo.");
        }
      }
    } catch {
      setErrorMsg("Error de conexión. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!termino) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const result = await deleteTermino(termino.slug);
      if (result.success) {
        router.push("/admin/glosario");
        router.refresh();
      } else {
        setErrorMsg("No se pudo eliminar el término.");
      }
    } catch {
      setErrorMsg("Error al eliminar. Intentá de nuevo.");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  // ─── Otros términos para multi-select relacionados ─────────────────────────

  const otrosTerminos = allTerminos.filter((t) => t.slug !== termino?.slug);

  const toggleRelacionado = (slug: string) => {
    setField(
      "terminosRelacionados",
      form.terminosRelacionados.includes(slug)
        ? form.terminosRelacionados.filter((s) => s !== slug)
        : [...form.terminosRelacionados, slug]
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Error global */}
      {errorMsg && (
        <div
          className="mb-5 px-4 py-3 rounded-[6px] border font-ui text-sm"
          style={{ background: "#FEF2F2", borderColor: "#FCA5A5", color: "#7F1D1D" }}
          role="alert"
        >
          {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        {/* Término + Slug + Letra */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="termino" className="font-ui text-sm font-500 text-carbon">
              Término{" "}
              <span className="text-error" aria-hidden="true">
                *
              </span>
            </Label>
            <Input
              id="termino"
              value={form.termino}
              onChange={(e) => handleTerminoChange(e.target.value)}
              placeholder="Ej: Preaviso laboral"
              required
              className="mt-1.5"
              aria-describedby={fieldErrors.termino ? "termino-error" : undefined}
            />
            {fieldErrors.termino && (
              <p id="termino-error" className="mt-1 font-ui text-xs text-error">
                {fieldErrors.termino[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="area-legal" className="font-ui text-sm font-500 text-carbon">
              Área legal
            </Label>
            <Select
              value={form.areaLegal}
              onValueChange={(v: string | null) => {
                if (v) setField("areaLegal", v);
              }}
            >
              <SelectTrigger id="area-legal" className="mt-1.5">
                <SelectValue placeholder="Seleccionar área" />
              </SelectTrigger>
              <SelectContent>
                {AREA_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Slug + Letra (solo-lectura calculados / editables en edit) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="slug" className="font-ui text-sm font-500 text-carbon">
              Slug (URL)
            </Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              placeholder="preaviso-laboral"
              readOnly={mode === "create"}
              className={cn(
                "mt-1.5 font-mono text-xs",
                mode === "create" && "bg-bg-secondary cursor-default"
              )}
              aria-describedby="slug-hint"
            />
            <p id="slug-hint" className="mt-1 font-ui text-xs text-text-tertiary">
              {mode === "create"
                ? "Se genera automáticamente."
                : "Modificar el slug rompe URLs existentes."}
            </p>
          </div>

          <div>
            <Label htmlFor="letra" className="font-ui text-sm font-500 text-carbon">
              Letra (A-Z)
            </Label>
            <Input
              id="letra"
              value={form.letra}
              onChange={(e) => setField("letra", e.target.value.toUpperCase().charAt(0))}
              maxLength={1}
              readOnly={mode === "create"}
              className={cn(
                "mt-1.5 text-center font-serif text-lg font-600",
                mode === "create" && "bg-bg-secondary cursor-default"
              )}
              style={{ color: "var(--color-dorado-deep)" }}
            />
          </div>
        </div>

        {/* Definición corta */}
        <div>
          <Label htmlFor="def-corta" className="font-ui text-sm font-500 text-carbon">
            Definición corta{" "}
            <span className="text-error" aria-hidden="true">
              *
            </span>
            <span className="ml-2 font-ui text-xs text-text-tertiary">(máx. 500 caracteres)</span>
          </Label>
          <textarea
            id="def-corta"
            value={form.definicionCorta}
            onChange={(e) => setField("definicionCorta", e.target.value)}
            required
            maxLength={500}
            rows={2}
            placeholder="Resumen breve de 1-2 oraciones que aparece en las cards del glosario."
            className={cn(
              "mt-1.5 w-full px-3 py-2.5 rounded-[6px] font-body text-sm text-carbon",
              "border border-border-default bg-bg",
              "placeholder:text-text-tertiary",
              "focus:outline-none focus:border-marino focus:ring-2 focus:ring-marino/10",
              "transition-colors duration-150 resize-none"
            )}
            aria-describedby="def-corta-count"
          />
          <p id="def-corta-count" className="mt-1 font-ui text-xs text-text-tertiary text-right">
            {form.definicionCorta.length}/500
          </p>
        </div>

        {/* Definición larga (Markdown) */}
        <div>
          <Label htmlFor="def-larga" className="font-ui text-sm font-500 text-carbon">
            Definición completa{" "}
            <span className="text-error" aria-hidden="true">
              *
            </span>
            <span className="ml-2 font-ui text-xs text-text-tertiary">(Markdown soportado)</span>
          </Label>
          <textarea
            id="def-larga"
            value={form.definicionLarga}
            onChange={(e) => setField("definicionLarga", e.target.value)}
            required
            maxLength={10000}
            rows={12}
            placeholder="Explicación detallada del término en Markdown. Podés usar **negrita**, _cursiva_, listas y encabezados."
            className={cn(
              "mt-1.5 w-full px-3 py-2.5 rounded-[6px] font-mono text-xs text-carbon",
              "border border-border-default bg-bg",
              "placeholder:text-text-tertiary",
              "focus:outline-none focus:border-marino focus:ring-2 focus:ring-marino/10",
              "transition-colors duration-150 resize-y"
            )}
          />
          <p className="mt-1 font-ui text-xs text-text-tertiary text-right">
            {form.definicionLarga.length}/10000
          </p>
        </div>

        {/* Sinónimos */}
        <TagsInput
          id="sinonimos"
          label="Sinónimos"
          value={form.sinonimos}
          onChange={(tags) => setField("sinonimos", tags)}
          placeholder="Ej: notificación previa, aviso previo…"
        />

        {/* Términos relacionados */}
        {otrosTerminos.length > 0 && (
          <div>
            <Label className="font-ui text-sm font-500 text-carbon">Términos relacionados</Label>
            <p className="font-ui text-xs text-text-tertiary mt-0.5 mb-2">
              Seleccioná otros términos del glosario que estén vinculados a este.
            </p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-[6px] border border-border-default bg-bg">
              {otrosTerminos.map((t) => {
                const selected = form.terminosRelacionados.includes(t.slug);
                return (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => toggleRelacionado(t.slug)}
                    className={cn(
                      "px-2.5 py-1 rounded-full font-ui text-xs transition-all duration-150",
                      "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-1",
                      selected
                        ? "bg-marino text-bg border border-marino"
                        : "bg-bg-warm text-text-secondary border border-border-default hover:border-marino"
                    )}
                    aria-pressed={selected}
                  >
                    {t.termino}
                  </button>
                );
              })}
            </div>
            {form.terminosRelacionados.length > 0 && (
              <p className="mt-1 font-ui text-xs text-text-tertiary">
                {form.terminosRelacionados.length} término
                {form.terminosRelacionados.length !== 1 ? "s" : ""} relacionado
                {form.terminosRelacionados.length !== 1 ? "s" : ""} seleccionado
                {form.terminosRelacionados.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-border-default">
          <div>
            {mode === "edit" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className={cn(
                  "font-ui text-sm gap-1.5",
                  confirmDelete
                    ? "text-error hover:bg-[#FEF2F2]"
                    : "text-text-secondary hover:text-error"
                )}
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {confirmDelete ? "¿Confirmar eliminación?" : "Eliminar término"}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/glosario")}
              disabled={saving}
              className="font-ui text-sm text-text-secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="font-ui text-sm gap-1.5"
              style={{ background: "var(--color-marino)", color: "var(--color-bg)" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {mode === "create" ? "Crear término" : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
