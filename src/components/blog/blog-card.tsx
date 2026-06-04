import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowRight,
  Scale,
  Briefcase,
  Landmark,
  FileText,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { BlogPostRow } from "@/app/actions/blog";

// ─── Metadata por área ────────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General",
};

// Cover editorial: fondo marino + grain, ícono + acento por rama (on-brand,
// reemplaza los emoji sobre pastel plano que se veían baratos).
const AREA_META: Record<string, { icon: LucideIcon; accent: string; initial: string }> = {
  civil_familia: { icon: Scale, accent: "#C9A45A", initial: "C" },
  laboral: { icon: Briefcase, accent: "#2EA043", initial: "L" },
  penal: { icon: Landmark, accent: "#C0563B", initial: "P" },
  comercial: { icon: FileText, accent: "#2952FF", initial: "M" },
  general: { icon: BookOpen, accent: "#8A6FB0", initial: "G" },
};

// ─── Componente ───────────────────────────────────────────────────────────────

type BlogCardProps = {
  post: BlogPostRow;
  priority?: boolean;
};

export function BlogCard({ post }: BlogCardProps) {
  const area = post.areaLegal ?? "general";
  const areaLabel = AREA_LABELS[area] ?? area;
  const meta = AREA_META[area] ?? AREA_META.general;
  const Icon = meta.icon;

  const publishedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })
    : null;

  return (
    <article
      className={cn(
        "group flex flex-col h-full",
        "bg-bg",
        "border border-border-default",
        "rounded-[10px]",
        "shadow-[var(--shadow-sm)]",
        "overflow-hidden",
        "transition-all duration-300 ease-primary",
        "hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
      )}
    >
      {/* Cover editorial generativo */}
      <div
        className="relative h-44 shrink-0 overflow-hidden grain"
        style={{
          background: "radial-gradient(130% 130% at 25% 0%, #1c2e52 0%, #0e1b33 55%, #08111f 100%)",
        }}
        aria-hidden="true"
      >
        {/* Acento superior por rama */}
        <span
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: meta.accent }}
        />

        {/* Arcos concéntricos decorativos (motivo sello PD) */}
        <svg
          className="absolute"
          style={{ top: "50%", right: "-40px", transform: "translateY(-50%)", opacity: 0.12 }}
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          stroke="#C9A45A"
          strokeWidth="0.8"
        >
          <circle cx="100" cy="100" r="95" />
          <circle cx="100" cy="100" r="74" strokeDasharray="3 5" />
          <circle cx="100" cy="100" r="52" />
        </svg>

        {/* Inicial fantasma */}
        <span
          className="absolute select-none"
          style={{
            top: "-12px",
            left: "14px",
            fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
            fontStyle: "italic",
            fontSize: "8.5rem",
            fontWeight: 500,
            lineHeight: 1,
            color: meta.accent,
            opacity: 0.16,
            letterSpacing: "-0.04em",
          }}
        >
          {meta.initial}
        </span>

        {/* Ícono + etiqueta de área */}
        <div className="absolute bottom-4 left-5 flex items-center gap-2.5">
          <span
            className="flex items-center justify-center w-9 h-9 rounded-full border"
            style={{ borderColor: "rgba(201,164,90,0.5)", color: meta.accent }}
          >
            <Icon size={17} />
          </span>
          <span
            className="font-ui text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{ color: "rgba(250,247,242,0.78)" }}
          >
            {areaLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-6 py-5">
        {/* Área badge */}
        <Badge variant="area-legal" className="w-fit mb-3">
          {areaLabel}
        </Badge>

        {/* Título */}
        <h2 className="font-serif text-xl font-semibold text-marino leading-snug mb-3 line-clamp-2">
          <Link
            href={`/blog/${post.slug}`}
            className={cn(
              "hover:text-marino-hover transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2 focus-visible:rounded-[2px]"
            )}
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="font-body text-sm text-carbon-soft leading-relaxed flex-1 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta: fecha + autor */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-border-default">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {publishedDate && (
              <span className="flex items-center gap-1.5 font-ui text-xs text-text-tertiary whitespace-nowrap">
                <Calendar size={12} aria-hidden="true" />
                <time dateTime={post.publishedAt?.toISOString()}>{publishedDate}</time>
              </span>
            )}
            <span className="flex items-center gap-1.5 font-ui text-xs text-text-tertiary min-w-0">
              <User size={12} aria-hidden="true" />
              <span className="truncate">{post.author}</span>
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            aria-label={`Leer artículo completo: ${post.title}`}
            className={cn(
              "shrink-0 inline-flex items-center gap-1",
              "font-ui text-xs font-semibold text-dorado-deep",
              "hover:text-marino",
              "transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2 focus-visible:rounded-[2px]"
            )}
          >
            Leer más
            <ArrowRight
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
