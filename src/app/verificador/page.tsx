import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Verificadores legales gratuitos | ${siteConfig.studioName}`,
  description:
    "Herramientas de diagnóstico legal orientativas. Verificá si tu despido fue legal o accedé a otros verificadores jurídicos gratuitos.",
  alternates: { canonical: `${siteConfig.siteUrl}/verificador` },
};

const VERIFICADORES = [
  {
    href: "/verificador/despido",
    titulo: "¿Tu despido fue legal?",
    descripcion:
      "5 preguntas sobre tu despido. Diagnóstico inmediato: legal, dudoso o con irregularidades.",
    tag: "Derecho Laboral",
  },
] as const;

export default function VerificadorIndexPage() {
  return (
    <section className="pt-28 pb-20">
      <Container size="narrow">
        <p
          className="font-ui text-xs font-600 tracking-[0.12em] uppercase mb-4"
          style={{ color: "var(--color-dorado-deep)" }}
        >
          Herramientas gratuitas
        </p>
        <h1 className="font-serif text-[var(--text-4xl)] font-600 text-marino leading-tight mb-4">
          Verificadores legales
        </h1>
        <p className="font-body text-base text-text-secondary leading-relaxed mb-10">
          Diagnósticos orientativos basados en la legislación argentina vigente. No reemplazan el
          asesoramiento profesional.
        </p>

        <div className="space-y-4">
          {VERIFICADORES.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="flex items-start gap-4 p-6 bg-bg border border-border-default rounded-[8px] hover:border-marino hover:shadow-[var(--shadow-md)] hover:-translate-y-[2px] transition-all duration-250 group focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
            >
              <div className="flex-1">
                <span
                  className="inline-block mb-2 px-2.5 py-0.5 rounded-full font-ui text-xs font-500"
                  style={{
                    background: "rgba(201,169,97,0.10)",
                    color: "#7A5F1A",
                    border: "1px solid rgba(201,169,97,0.30)",
                  }}
                >
                  {v.tag}
                </span>
                <h2 className="font-serif text-lg font-500 text-marino mb-1">{v.titulo}</h2>
                <p className="font-body text-sm text-text-secondary leading-relaxed">
                  {v.descripcion}
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
