import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memorando ejecutivo · Estudio Jurídico Dr. Pablo De Luca",
  description:
    "Documento interno de presentación de la plataforma web desarrollada para el Estudio Jurídico Dr. Pablo De Luca.",
  robots: { index: false, follow: false, nocache: true },
};

export default function PresentacionLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ contain: "layout" }}>{children}</div>;
}
