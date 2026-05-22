import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { isNull, desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — Admin",
  robots: { index: false, follow: false },
};

// ─── Área label map ───────────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AdminBlogPage() {
  // Listar todos los posts (incluyendo drafts, excluye soft-deleted)
  const posts = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      areaLegal: blogPosts.areaLegal,
      published: blogPosts.published,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .where(isNull(blogPosts.deletedAt))
    .orderBy(desc(blogPosts.updatedAt));

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-marino">Blog</h1>
          <p className="font-ui text-sm text-text-secondary mt-0.5">
            {posts.length} artículo{posts.length !== 1 ? "s" : ""} en total
          </p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className={cn(
            "inline-flex items-center gap-2 h-10 px-5",
            "font-ui text-sm font-medium tracking-wide",
            "bg-marino text-bg",
            "rounded-sm",
            "hover:bg-marino-hover hover:-translate-y-0.5",
            "transition-all duration-250",
            "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
          )}
        >
          <Plus size={16} aria-hidden="true" />
          Nuevo artículo
        </Link>
      </div>

      {/* Tabla de posts */}
      {posts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 text-center rounded-[10px] border border-dashed"
          style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg)" }}
        >
          <span className="text-4xl mb-4" aria-hidden="true">
            📄
          </span>
          <p className="font-serif text-xl font-semibold text-marino mb-2">Sin artículos aún</p>
          <p className="font-body text-sm text-text-secondary mb-6 max-w-sm">
            Creá el primer artículo del blog con el botón de arriba.
          </p>
          <Link
            href="/admin/blog/nuevo"
            className="inline-flex items-center gap-2 h-10 px-6 font-ui text-sm font-medium bg-marino text-bg rounded-sm hover:bg-marino-hover transition-colors duration-250"
          >
            <Plus size={15} aria-hidden="true" />
            Crear primer artículo
          </Link>
        </div>
      ) : (
        <div
          className="rounded-[10px] border border-border-default overflow-hidden"
          style={{ background: "var(--color-bg)" }}
        >
          <table className="w-full text-left">
            <thead>
              <tr
                className="border-b border-border-default"
                style={{ background: "var(--color-bg-secondary)" }}
              >
                <th className="px-5 py-3 font-ui text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                  Título
                </th>
                <th className="hidden sm:table-cell px-5 py-3 font-ui text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                  Área
                </th>
                <th className="px-5 py-3 font-ui text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                  Estado
                </th>
                <th className="hidden md:table-cell px-5 py-3 font-ui text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                  Última edición
                </th>
                <th className="px-5 py-3 font-ui text-xs font-semibold text-text-tertiary uppercase tracking-wide text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-bg-secondary transition-colors duration-100">
                  {/* Título */}
                  <td className="px-5 py-3.5">
                    <span className="font-ui text-sm font-medium text-marino line-clamp-1">
                      {post.title}
                    </span>
                    <span className="block font-ui text-xs text-text-tertiary mt-0.5">
                      /{post.slug}
                    </span>
                  </td>

                  {/* Área */}
                  <td className="hidden sm:table-cell px-5 py-3.5">
                    <Badge variant="area-legal">
                      {AREA_LABELS[post.areaLegal] ?? post.areaLegal}
                    </Badge>
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 font-ui text-xs font-medium px-2 py-0.5 rounded-full",
                        post.published
                          ? "bg-[#DCFCE7] text-[#15803D]"
                          : "bg-[#FEF3C7] text-[#B45309]"
                      )}
                    >
                      {post.published ? (
                        <Eye size={11} aria-hidden="true" />
                      ) : (
                        <EyeOff size={11} aria-hidden="true" />
                      )}
                      {post.published ? "Publicado" : "Borrador"}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="hidden md:table-cell px-5 py-3.5">
                    <span className="font-ui text-xs text-text-tertiary">
                      {post.updatedAt
                        ? format(new Date(post.updatedAt), "d MMM yyyy", { locale: es })
                        : "—"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 h-8 px-3 font-ui text-xs text-text-secondary border border-border-default rounded-[4px] hover:border-marino hover:text-marino transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
                          aria-label={`Ver artículo publicado: ${post.title}`}
                        >
                          <Eye size={13} aria-hidden="true" />
                          Ver
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/editar/${post.slug}`}
                        className="inline-flex items-center gap-1 h-8 px-3 font-ui text-xs bg-marino text-bg rounded-[4px] hover:bg-marino-hover transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
                        aria-label={`Editar artículo: ${post.title}`}
                      >
                        <Pencil size={13} aria-hidden="true" />
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
