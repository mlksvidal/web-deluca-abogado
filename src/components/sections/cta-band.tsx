/**
 * CtaBand — Banda full-width CTA entre Casos Resueltos y About.
 *
 * Fondo: marino #0F1E3D.
 * Kicker dorado + h2 con "sin cargo" en dorado + bajada + 2 CTAs.
 * Reveal on scroll sutil.
 */

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/utils/reveal";

export function CtaBand() {
  const waUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    "Hola Dr. De Luca, me gustaría coordinar una primera consulta."
  )}`;

  return (
    <section
      className="cta-band"
      aria-labelledby="cta-band-heading"
      style={{
        background: "var(--color-marino, #0F1E3D)",
        paddingBlock: "clamp(80px, 8vw, 120px)",
        paddingInline: "clamp(20px, 4vw, 40px)",
      }}
    >
      <div className="cta-band-inner">
        {/* Kicker */}
        <Reveal>
          <span
            style={{
              fontFamily: "var(--font-ui, Inter, system-ui, sans-serif)",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "var(--color-dorado, #C9A961)",
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "28px",
                height: "1px",
                background: "var(--color-dorado, #C9A961)",
                flexShrink: 0,
              }}
            />
            Primera consulta
          </span>
        </Reveal>

        {/* H2 */}
        <Reveal delay={80}>
          <h2
            id="cta-band-heading"
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(2.2rem, 1.4rem + 4vw, 3.5rem)",
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--color-bg, #FAF7F2)",
              marginBottom: "20px",
            }}
          >
            Tu primer encuentro es{" "}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--color-dorado, #C9A961)",
              }}
            >
              sin cargo.
            </em>
          </h2>
        </Reveal>

        {/* Bajada */}
        <Reveal delay={140}>
          <p
            style={{
              fontFamily: "var(--font-lora, Lora, Georgia, serif)",
              fontSize: "1.05rem",
              lineHeight: 1.65,
              color: "rgba(250,247,242,.7)",
              maxWidth: "560px",
              margin: "0 auto 44px",
            }}
          >
            30 minutos para entender tu caso, evaluar opciones legales y decidir si trabajamos
            juntos. Sin compromiso.
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={200}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            <Link href="/reservar" className="cta-band-btn cta-band-btn--primary">
              Reservar consulta
              <span aria-hidden="true">→</span>
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-band-btn cta-band-btn--outline"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.548 4.107 1.508 5.842L.057 23.5l5.798-1.52A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.868 0-3.624-.5-5.14-1.374l-.369-.218-3.82 1.002 1.02-3.72-.24-.381C2.498 15.618 2 13.87 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </Reveal>
      </div>

      <style>{`
        .cta-band-inner {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Botón primary — dorado */
        .cta-band-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 32px;
          font-family: var(--font-ui, Inter, system-ui, sans-serif);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: .05em;
          text-transform: uppercase;
          border-radius: 2px;
          text-decoration: none;
          transition: transform .3s cubic-bezier(.22,1,.36,1),
                      background .3s cubic-bezier(.22,1,.36,1),
                      box-shadow .3s cubic-bezier(.22,1,.36,1),
                      color .3s cubic-bezier(.22,1,.36,1);
        }
        .cta-band-btn--primary {
          background: var(--color-dorado, #C9A961);
          color: var(--color-marino, #0F1E3D);
          box-shadow: 0 4px 16px -4px rgba(201,169,97,.35);
        }
        .cta-band-btn--primary:hover {
          background: var(--color-dorado-hover, #DDB96E);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -6px rgba(201,169,97,.5);
        }
        /* Botón outline — blanco */
        .cta-band-btn--outline {
          background: transparent;
          color: rgba(250,247,242,.85);
          border: 1px solid rgba(250,247,242,.25);
        }
        .cta-band-btn--outline:hover {
          background: rgba(250,247,242,.08);
          color: var(--color-bg, #FAF7F2);
          border-color: rgba(250,247,242,.5);
          transform: translateY(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-band-btn {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
