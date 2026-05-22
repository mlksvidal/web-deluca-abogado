import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { glosarioTerminos } from "@/lib/db/schema";
import { isNull, asc } from "drizzle-orm";
import { GlosarioForm } from "@/components/admin/glosario-form";

export const metadata: Metadata = {
  title: "Nuevo término — Glosario Admin",
  robots: { index: false, follow: false },
};

export default async function AdminGlosarioNuevoPage() {
  // Cargar todos los términos para el multi-select de relacionados
  const allTerminos = await db
    .select({
      slug: glosarioTerminos.slug,
      termino: glosarioTerminos.termino,
    })
    .from(glosarioTerminos)
    .where(isNull(glosarioTerminos.deletedAt))
    .orderBy(asc(glosarioTerminos.termino));

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
        <h1 className="font-serif text-2xl font-semibold text-marino">Nuevo término</h1>
        <p className="font-ui text-sm text-text-secondary mt-0.5">
          Completá los campos para agregar un nuevo término al glosario.
        </p>
      </div>

      {/* Form */}
      <div className="bg-bg border border-border-default rounded-[10px] p-6">
        <GlosarioForm mode="create" allTerminos={allTerminos} />
      </div>
    </div>
  );
}
