import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { glosarioTerminos } from "@/lib/db/schema";
import { isNull, asc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Glosario — Admin",
  robots: { index: false, follow: false },
};

// ─── Labels ───────────────────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminGlosarioPage() {
  const terminos = await db
    .select({
      id: glosarioTerminos.id,
      slug: glosarioTerminos.slug,
      termino: glosarioTerminos.termino,
      letra: glosarioTerminos.letra,
      areaLegal: glosarioTerminos.areaLegal,
      sinonimos: glosarioTerminos.sinonimos,
      terminosRelacionados: glosarioTerminos.terminosRelacionados,
      updatedAt: glosarioTerminos.updatedAt,
    })
    .from(glosarioTerminos)
    .where(isNull(glosarioTerminos.deletedAt))
    .orderBy(asc(glosarioTerminos.letra), asc(glosarioTerminos.termino));

  // Agrupar por letra
  const porLetra = terminos.reduce<Record<string, typeof terminos>>((acc, t) => {
    const l = t.letra.toUpperCase();
    if (!acc[l]) acc[l] = [];
    acc[l].push(t);
    return acc;
  }, {});

  const letras = Object.keys(porLetra).sort();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[var(--color-marino)]">
            Glosario jurídico
          </h1>
          <p className="font-ui text-sm text-[var(--color-text-secondary)] mt-0.5">
            {terminos.length} término{terminos.length !== 1 ? "s" : ""} publicados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/glosario"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] font-ui text-xs font-500 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] bg-[var(--color-bg)] hover:border-[var(--color-marino)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)]"
          >
            <ExternalLink size={12} />
            Ver sitio
          </Link>
          <Link
            href="/admin/glosario/nuevo"
            className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] font-ui text-sm font-600 transition-colors duration-150 hover:-translate-y-[1px] focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)]"
            style={{ background: "var(--color-marino)", color: "var(--color-bg)" }}
          >
            <Plus size={14} />
            Nuevo término
          </Link>
        </div>
      </div>

      {terminos.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-bg)] rounded-[8px] border border-[var(--color-border-default)]">
          <p className="font-serif text-lg text-[var(--color-text-secondary)] mb-2">
            Aún no hay términos
          </p>
          <p className="font-ui text-sm text-[var(--color-text-tertiary)] mb-6">
            Agregá el primer término al glosario.
          </p>
          <Link
            href="/admin/glosario/nuevo"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] font-ui text-sm font-600"
            style={{ background: "var(--color-marino)", color: "var(--color-bg)" }}
          >
            <Plus size={14} />
            Agregar término
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {letras.map((letra) => (
            <section key={letra}>
              {/* Separador de letra */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="font-serif text-2xl font-700"
                  style={{ color: "var(--color-dorado)" }}
                >
                  {letra}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--color-border-default)" }}
                />
                <span className="font-ui text-xs text-[var(--color-text-tertiary)]">
                  {porLetra[letra].length} término{porLetra[letra].length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Tabla de términos */}
              <div className="bg-[var(--color-bg)] rounded-[8px] border border-[var(--color-border-default)] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className="border-b border-[var(--color-border-default)]"
                      style={{ background: "var(--color-bg-warm)" }}
                    >
                      <th className="text-left px-4 py-2.5 font-ui text-xs font-600 text-[var(--color-text-secondary)] tracking-wide uppercase">
                        Término
                      </th>
                      <th className="text-left px-4 py-2.5 font-ui text-xs font-600 text-[var(--color-text-secondary)] tracking-wide uppercase hidden sm:table-cell">
                        Área
                      </th>
                      <th className="text-left px-4 py-2.5 font-ui text-xs font-600 text-[var(--color-text-secondary)] tracking-wide uppercase hidden md:table-cell">
                        Sinónimos
                      </th>
                      <th className="text-right px-4 py-2.5 font-ui text-xs font-600 text-[var(--color-text-secondary)] tracking-wide uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-default)]">
                    {porLetra[letra].map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-[var(--color-bg-warm)] transition-colors duration-100"
                      >
                        <td className="px-4 py-3">
                          <div className="font-ui text-sm font-500 text-[var(--color-marino)]">
                            {t.termino}
                          </div>
                          <div className="font-ui text-xs text-[var(--color-text-tertiary)] mt-0.5">
                            /glosario/{t.slug}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="font-ui text-xs text-[var(--color-text-secondary)]">
                            {t.areaLegal ? (AREA_LABELS[t.areaLegal] ?? t.areaLegal) : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="font-ui text-xs text-[var(--color-text-tertiary)]">
                            {t.sinonimos && t.sinonimos.length > 0
                              ? t.sinonimos.slice(0, 2).join(", ") +
                                (t.sinonimos.length > 2 ? ` +${t.sinonimos.length - 2}` : "")
                              : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/glosario/${t.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-[4px] text-[var(--color-text-tertiary)] hover:text-[var(--color-marino)] hover:bg-[var(--color-bg-secondary)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)]"
                              aria-label={`Ver ${t.termino} en el sitio`}
                            >
                              <ExternalLink size={13} />
                            </Link>
                            <Link
                              href={`/admin/glosario/editar/${t.slug}`}
                              className="p-1.5 rounded-[4px] text-[var(--color-text-tertiary)] hover:text-[var(--color-marino)] hover:bg-[var(--color-bg-secondary)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)]"
                              aria-label={`Editar ${t.termino}`}
                            >
                              <Pencil size={13} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
