import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { glosarioTerminos } from "@/lib/db/schema";
import { isNull, asc, eq, and } from "drizzle-orm";
import { GlosarioForm } from "@/components/admin/glosario-form";

export const metadata: Metadata = {
  title: "Editar término — Glosario Admin",
  robots: { index: false, follow: false },
};

export default async function AdminGlosarioEditarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [termino, allTerminos] = await Promise.all([
    // Término a editar
    db
      .select()
      .from(glosarioTerminos)
      .where(and(eq(glosarioTerminos.slug, slug), isNull(glosarioTerminos.deletedAt)))
      .limit(1)
      .then((rows) => rows[0] ?? null),
    // Todos los términos para relacionados
    db
      .select({
        slug: glosarioTerminos.slug,
        termino: glosarioTerminos.termino,
      })
      .from(glosarioTerminos)
      .where(isNull(glosarioTerminos.deletedAt))
      .orderBy(asc(glosarioTerminos.termino)),
  ]);

  if (!termino) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/glosario"
          className="inline-flex items-center gap-1.5 font-ui text-sm text-text-secondary hover:text-marino transition-colors duration-150 mb-4 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:rounded-[4px]"
        >
          <ChevronLeft size={14} />
          Volver al glosario
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-marino">Editar: {termino.termino}</h1>
        <p className="font-ui text-xs text-text-tertiary mt-0.5">/glosario/{termino.slug}</p>
      </div>

      {/* Form */}
      <div className="bg-bg border border-border-default rounded-[10px] p-6">
        <GlosarioForm mode="edit" termino={termino} allTerminos={allTerminos} />
      </div>
    </div>
  );
}
