import * as React from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { BlogPostRow } from "@/app/actions/blog";

// ─── Mapa de etiquetas de área ────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General",
};

// ─── Placeholder imagen por área ─────────────────────────────────────────────

const AREA_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  civil_familia: { bg: "#E8EDF5", text: "#0F1E3D", icon: "⚖️" },
  laboral: { bg: "#ECFDF5", text: "#065F46", icon: "💼" },
  penal: { bg: "#FEF2F2", text: "#7F1D1D", icon: "🏛️" },
  comercial: { bg: "#FFFBEB", text: "#78350F", icon: "📋" },
  general: { bg: "#F5F3FF", text: "#4C1D95", icon: "📚" },
};

// ─── Componente ───────────────────────────────────────────────────────────────

type BlogCardProps = {
  post: BlogPostRow;
  priority?: boolean;
};

export function BlogCard({ post }: BlogCardProps) {
  const area = post.areaLegal ?? "general";
  const areaLabel = AREA_LABELS[area] ?? area;
  const areaColors = AREA_COLORS[area] ?? AREA_COLORS.general;

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
      {/* Imagen placeholder con color por área */}
      <div
        className="h-40 flex items-center justify-center text-4xl shrink-0"
        style={{ background: areaColors.bg }}
        aria-hidden="true"
      >
        {areaColors.icon}
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
