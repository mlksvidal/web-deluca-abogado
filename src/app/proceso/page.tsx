import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Guías de proceso legal | ${siteConfig.studioName}`,
  description:
    "Guías paso a paso de procesos legales argentinos: divorcio, juicios laborales y más. Explicados en lenguaje claro por el Estudio De Luca.",
  alternates: { canonical: `${siteConfig.siteUrl}/proceso` },
};

const PROCESOS = [
  {
    href: "/proceso/divorcio",
    titulo: "Proceso de divorcio en Argentina",
    descripcion:
      "8 pasos del divorcio: mediación, demanda, convenio regulador, sentencia e inscripción registral.",
    tag: "Civil y Familia",
  },
] as const;

export default function ProcesoIndexPage() {
  return (
    <section className="pt-28 pb-20">
      <Container size="narrow">
        <p
          className="font-ui text-xs font-600 tracking-[0.12em] uppercase mb-4"
          style={{ color: "var(--color-dorado-deep)" }}
        >
          Guías jurídicas
        </p>
        <h1 className="font-serif text-[var(--text-4xl)] font-600 text-marino leading-tight mb-4">
          Guías de proceso legal
        </h1>
        <p className="font-body text-base text-text-secondary leading-relaxed mb-10">
          Cada proceso jurídico tiene sus etapas. Acá las explicamos de forma clara para que llegués
          a la consulta sabiendo qué esperar.
        </p>

        <div className="space-y-4">
          {PROCESOS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="flex items-start gap-4 p-6 bg-bg border border-border-default rounded-[8px] hover:border-marino hover:shadow-[var(--shadow-md)] hover:-translate-y-[2px] transition-all duration-250 group focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
            >
              <div className="flex-1">
                <span
                  className="inline-block mb-2 px-2.5 py-0.5 rounded-full font-ui text-xs font-500"
                  style={{
                    background: "rgba(15,30,61,0.06)",
                    color: "var(--color-marino)",
                    border: "1px solid rgba(15,30,61,0.15)",
                  }}
                >
                  {p.tag}
                </span>
                <h2 className="font-serif text-lg font-500 text-marino mb-1">{p.titulo}</h2>
                <p className="font-body text-sm text-text-secondary leading-relaxed">
                  {p.descripcion}
                </p>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 mt-1 text-text-tertiary group-hover:text-marino group-hover:translate-x-1 transition-all duration-200"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
