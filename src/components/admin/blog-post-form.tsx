"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Save, Eye, EyeOff, Globe, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { createPost, updatePost, publishPost } from "@/app/actions/blog";
import type { BlogPostRow } from "@/app/actions/blog";

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(200, "Slug demasiado largo")
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones")
    .trim(),
  title: z.string().min(1, "El título es requerido").max(200).trim(),
  excerpt: z.string().min(1, "El resumen es requerido").max(500).trim(),
  contentMd: z.string().min(1, "El contenido es requerido").max(100_000).trim(),
  areaLegal: z.enum(["civil_familia", "laboral", "penal", "comercial", "general"], {
    error: "Seleccioná un área",
  }),
  seoTitle: z.string().max(70).trim().optional(),
  seoDescription: z.string().max(160).trim().optional(),
  ogImage: z.string().max(500).trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Área label map ───────────────────────────────────────────────────────────

const AREA_OPTIONS = [
  { value: "civil_familia", label: "Civil y Familia" },
  { value: "laboral", label: "Laboral" },
  { value: "penal", label: "Penal" },
  { value: "comercial", label: "Comercial" },
  { value: "general", label: "General" },
] as const;

// ─── Utilidad: título → slug ──────────────────────────────────────────────────

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quitar tildes
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200);
}

// ─── Preview Markdown → HTML (cliente, sin sanitizar — solo preview) ──────────

function MarkdownPreview({ markdown }: { markdown: string }) {
  if (!markdown.trim()) {
    return (
      <div className="flex items-center justify-center h-full text-center py-12">
        <p className="font-ui text-sm text-text-tertiary">
          El preview del contenido aparece aquí mientras escribís.
        </p>
      </div>
    );
  }

  // Render básico de Markdown en cliente para preview (no sanitizado — es solo admin)
  // El HTML real y sanitizado lo procesa la server action
  const html = markdown
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*<\/li>)/, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^([^<].+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");

  return <div className="prose-editorial px-1" dangerouslySetInnerHTML={{ __html: html }} />;
}

// ─── Props ────────────────────────────────────────────────────────────────────

type BlogPostFormProps = {
  /** Post existente — si está presente el form es un edit, si no es un create */
  post?: BlogPostRow;
};

// ─── Componente ───────────────────────────────────────────────────────────────

export function BlogPostForm({ post }: BlogPostFormProps) {
  const isEdit = !!post;
  const router = useRouter();

  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"write" | "preview">("write");
  const [isPublishing, setIsPublishing] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: post?.slug ?? "",
      title: post?.title ?? "",
      excerpt: post?.excerpt ?? "",
      contentMd: post?.contentMd ?? "",
      areaLegal: (post?.areaLegal as FormValues["areaLegal"]) ?? "general",
      seoTitle: post?.seoTitle ?? "",
      seoDescription: post?.seoDescription ?? "",
      ogImage: post?.ogImage ?? "",
    },
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");
  const contentMd = watch("contentMd");
  const areaLegal = watch("areaLegal");
  const isPublished = post?.published ?? false;

  // Auto-derivar slug desde el título (solo en create, no en edit)
  const prevTitle = React.useRef(post?.title ?? "");
  React.useEffect(() => {
    if (!isEdit && titleValue !== prevTitle.current) {
      prevTitle.current = titleValue;
      if (titleValue) {
        setValue("slug", titleToSlug(titleValue), { shouldValidate: false });
      }
    }
  }, [isEdit, titleValue, setValue]);

  // ─── Submit: guardar borrador ───────────────────────────────────────────────

  const onSave = async (data: FormValues) => {
    setSubmitError(null);

    const payload = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      contentMd: data.contentMd,
      areaLegal: data.areaLegal,
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      ogImage: data.ogImage || undefined,
    };

    if (isEdit && post) {
      const result = await updatePost(post.slug, payload);
      if (!result.success) {
        setSubmitError(
          result.error === "slug_taken"
            ? "Ese slug ya está en uso por otro artículo."
            : "Error al guardar. Intentá nuevamente."
        );
        return;
      }
      // Redirigir al nuevo slug si cambió
      if (data.slug !== post.slug) {
        router.push(`/admin/blog/editar/${data.slug}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } else {
      const result = await createPost(payload);
      if (!result.success) {
        setSubmitError(
          result.error === "slug_taken"
            ? "Ese slug ya está en uso. Cambiá el slug o el título."
            : "Error al crear el artículo. Intentá nuevamente."
        );
        return;
      }
      router.push(`/admin/blog/editar/${result.data.slug}`);
    }
  };

  // ─── Publicar ──────────────────────────────────────────────────────────────

  const handlePublish = async () => {
    if (!isEdit || !post) return;
    setIsPublishing(true);
    setSubmitError(null);

    const result = await publishPost(post.slug);
    if (!result.success) {
      setSubmitError("Error al publicar. Intentá nuevamente.");
    } else {
      router.refresh();
    }
    setIsPublishing(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-0" noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* ─── Columna principal ─────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Título */}
          <div className="space-y-1.5">
            <Label htmlFor="bf-title">
              Título{" "}
              <span className="text-error" aria-hidden="true">
                *
              </span>
            </Label>
            <Input
              id="bf-title"
              type="text"
              placeholder="Título del artículo"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "bf-title-error" : undefined}
              {...register("title")}
            />
            {errors.title && (
              <p id="bf-title-error" role="alert" className="font-ui text-xs text-error">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="bf-slug">
              Slug URL{" "}
              <span className="text-error" aria-hidden="true">
                *
              </span>
              {!isEdit && (
                <span className="ml-2 font-ui text-xs text-text-tertiary font-normal">
                  (auto-derivado del título)
                </span>
              )}
            </Label>
            <div className="flex items-center gap-2">
              <span className="font-ui text-sm text-text-tertiary shrink-0">/blog/</span>
              <Input
                id="bf-slug"
                type="text"
                placeholder="mi-articulo"
                aria-invalid={!!errors.slug}
                aria-describedby={errors.slug ? "bf-slug-error" : undefined}
                {...register("slug")}
              />
            </div>
            {slugValue && !errors.slug && (
              <p className="font-ui text-xs text-text-tertiary">URL pública: /blog/{slugValue}</p>
            )}
            {errors.slug && (
              <p id="bf-slug-error" role="alert" className="font-ui text-xs text-error">
                {errors.slug.message}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <Label htmlFor="bf-excerpt">
              Resumen / Excerpt{" "}
              <span className="text-error" aria-hidden="true">
                *
              </span>
              <span className="ml-2 font-ui text-xs text-text-tertiary font-normal">
                (máx. 500 chars — aparece en listado y SEO)
              </span>
            </Label>
            <textarea
              id="bf-excerpt"
              rows={3}
              maxLength={520}
              placeholder="Resumen breve del artículo visible en la lista del blog..."
              aria-invalid={!!errors.excerpt}
              aria-describedby={errors.excerpt ? "bf-excerpt-error" : undefined}
              className={cn(
                "block w-full px-3.5 py-2.5",
                "bg-bg text-carbon",
                "font-ui text-base placeholder:text-text-tertiary",
                "border border-border-default rounded-[6px]",
                "shadow-[inset_0_1px_3px_rgba(15,30,61,0.08)]",
                "outline-none resize-y",
                "hover:border-border-strong",
                "focus:border-2 focus:border-marino focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,30,61,0.12)]",
                "transition-[border-color,box-shadow] duration-150",
                errors.excerpt && "border-2 border-error"
              )}
              {...register("excerpt")}
            />
            {errors.excerpt && (
              <p id="bf-excerpt-error" role="alert" className="font-ui text-xs text-error">
                {errors.excerpt.message}
              </p>
            )}
          </div>

          {/* Contenido Markdown con tabs Write/Preview */}
          <div className="space-y-0">
            <div className="flex items-center gap-0 border-b border-border-default mb-0">
              <Label className="mr-auto self-center pb-2">
                Contenido (Markdown){" "}
                <span className="text-error" aria-hidden="true">
                  *
                </span>
              </Label>
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={cn(
                  "px-4 py-2 font-ui text-sm border-b-2 -mb-px transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-[-2px]",
                  activeTab === "write"
                    ? "border-marino text-marino font-medium"
                    : "border-transparent text-text-tertiary hover:text-carbon"
                )}
              >
                Escribir
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "px-4 py-2 font-ui text-sm border-b-2 -mb-px transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-[-2px]",
                  activeTab === "preview"
                    ? "border-marino text-marino font-medium"
                    : "border-transparent text-text-tertiary hover:text-carbon"
                )}
              >
                <Eye size={14} className="inline mr-1" aria-hidden="true" />
                Preview
              </button>
            </div>

            <div
              className="border border-t-0 border-border-default rounded-b-[6px] overflow-hidden"
              style={{ minHeight: "480px" }}
            >
              {activeTab === "write" ? (
                <textarea
                  id="bf-content"
                  aria-label="Contenido del artículo en Markdown"
                  aria-invalid={!!errors.contentMd}
                  placeholder={`# Título del artículo\n\nEscribí el contenido aquí usando Markdown...\n\n## Sección\n\nPárrafo con **negrita** e *itálica*.\n\n- Item 1\n- Item 2`}
                  className={cn(
                    "block w-full h-full min-h-[480px] px-4 py-4",
                    "bg-bg text-carbon",
                    "font-mono text-sm leading-relaxed placeholder:text-text-tertiary",
                    "outline-none resize-y",
                    "transition-[border-color] duration-150",
                    errors.contentMd && "border-l-2 border-l-error"
                  )}
                  style={{ fontFamily: "ui-monospace, monospace" }}
                  {...register("contentMd")}
                />
              ) : (
                <div className="min-h-[480px] px-6 py-5 overflow-auto">
                  <MarkdownPreview markdown={contentMd} />
                </div>
              )}
            </div>
            {errors.contentMd && (
              <p role="alert" className="font-ui text-xs text-error mt-1">
                {errors.contentMd.message}
              </p>
            )}
          </div>
        </div>

        {/* ─── Sidebar derecho: metadatos + acciones ─────────────────────────── */}
        <div className="space-y-5">
          {/* Estado actual */}
          {isEdit && (
            <div
              className="rounded-[8px] p-4 border"
              style={{
                background: isPublished ? "#DCFCE7" : "#FFFBEB",
                borderColor: isPublished ? "#86EFAC" : "#FCD34D",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                {isPublished ? (
                  <Globe size={14} className="text-[#15803D]" aria-hidden="true" />
                ) : (
                  <EyeOff size={14} className="text-[#B45309]" aria-hidden="true" />
                )}
                <span
                  className="font-ui text-xs font-semibold uppercase tracking-wide"
                  style={{ color: isPublished ? "#15803D" : "#B45309" }}
                >
                  {isPublished ? "Publicado" : "Borrador"}
                </span>
              </div>
              <p className="font-ui text-xs" style={{ color: isPublished ? "#166534" : "#92400E" }}>
                {isPublished
                  ? "Este artículo es visible en el blog público."
                  : "Este artículo no es visible para visitantes."}
              </p>
            </div>
          )}

          {/* Área legal */}
          <div className="space-y-1.5">
            <Label htmlFor="bf-area">
              Área legal{" "}
              <span className="text-error" aria-hidden="true">
                *
              </span>
            </Label>
            <Select
              value={areaLegal}
              onValueChange={(val) =>
                setValue("areaLegal", val as FormValues["areaLegal"], { shouldValidate: true })
              }
            >
              <SelectTrigger id="bf-area" aria-invalid={!!errors.areaLegal}>
                <SelectValue placeholder="Seleccioná un área" />
              </SelectTrigger>
              <SelectContent>
                {AREA_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.areaLegal && (
              <p role="alert" className="font-ui text-xs text-error">
                {errors.areaLegal.message}
              </p>
            )}
          </div>

          {/* SEO */}
          <div
            className="rounded-[8px] border border-border-default overflow-hidden"
            style={{ background: "var(--color-bg-secondary)" }}
          >
            <div className="px-4 py-3 border-b border-border-default">
              <p className="font-ui text-xs font-semibold text-carbon uppercase tracking-wide">
                SEO / Open Graph
              </p>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="bf-seo-title" className="text-xs">
                  SEO Title
                  <span className="ml-1 text-text-tertiary font-normal">(máx 70)</span>
                </Label>
                <Input
                  id="bf-seo-title"
                  type="text"
                  placeholder="Título para Google..."
                  maxLength={70}
                  {...register("seoTitle")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bf-seo-desc" className="text-xs">
                  SEO Description
                  <span className="ml-1 text-text-tertiary font-normal">(máx 160)</span>
                </Label>
                <textarea
                  id="bf-seo-desc"
                  rows={3}
                  maxLength={170}
                  placeholder="Descripción para buscadores..."
                  className="block w-full px-3 py-2 bg-bg text-carbon font-ui text-sm placeholder:text-text-tertiary border border-border-default rounded-[6px] outline-none resize-none hover:border-border-strong focus:border-2 focus:border-marino focus:bg-white transition-[border-color] duration-150"
                  {...register("seoDescription")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bf-og-image" className="text-xs">
                  OG Image URL
                  <span className="ml-1 text-text-tertiary font-normal">(placeholder)</span>
                </Label>
                <Input
                  id="bf-og-image"
                  type="url"
                  placeholder="https://..."
                  {...register("ogImage")}
                />
              </div>
            </div>
          </div>

          {/* Error general */}
          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-[6px] border border-[#FCA5A5] bg-[#FEE2E2] px-4 py-3"
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-error" aria-hidden="true" />
              <p className="font-ui text-xs text-error">{submitError}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="space-y-2.5">
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              className="w-full"
              isLoading={isSubmitting}
              loadingText="Guardando…"
            >
              <Save size={15} aria-hidden="true" />
              Guardar borrador
            </Button>

            {isEdit && !isPublished && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="w-full"
                isLoading={isPublishing}
                loadingText="Publicando…"
                onClick={handlePublish}
              >
                <Globe size={15} aria-hidden="true" />
                Publicar
              </Button>
            )}

            {isEdit && isPublished && (
              <a
                href={`/blog/${post?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-10 px-5 w-full font-ui text-sm font-medium text-text-secondary border border-border-default rounded-sm hover:border-marino hover:text-marino transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
              >
                <Eye size={15} aria-hidden="true" />
                Ver artículo publicado
              </a>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
