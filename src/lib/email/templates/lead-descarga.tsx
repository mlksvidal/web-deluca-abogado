/**
 * Template email: entrega de recurso PDF al lead (centro de recursos).
 * Tono: generoso, cercano — "te mandamos el recurso que pediste".
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface LeadDescargaEmailProps {
  nombre: string;
  /** Título del recurso: "Guía de derechos laborales" */
  recursoTitulo: string;
  /** URL de descarga directa del PDF */
  downloadUrl: string;
  /** Área legal del recurso */
  areaLegal?: string;
  siteUrl?: string;
}

const baseUrl = process.env.SITE_URL ?? "https://estudiodeluca.com.ar";

export function LeadDescargaEmail({
  nombre,
  recursoTitulo,
  downloadUrl,
  areaLegal,
  siteUrl = baseUrl,
}: LeadDescargaEmailProps) {
  const recursosUrl = `${siteUrl}/recursos`;

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Tu recurso está listo: {recursoTitulo}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>Estudio De Luca</Text>
          </Section>

          <Section style={mainStyle}>
            <Heading style={headingStyle}>Acá está tu recurso</Heading>

            <Text style={textStyle}>Hola {nombre},</Text>

            <Text style={textStyle}>
              Te mandamos el recurso que pediste: <strong>{recursoTitulo}</strong>
              {areaLegal ? ` (${areaLegal})` : ""}.
            </Text>

            <Section style={btnContainerStyle}>
              <Button style={downloadBtnStyle} href={downloadUrl}>
                Descargar PDF
              </Button>
            </Section>

            <Text style={smallTextStyle}>
              Si el botón no funciona, copiá este link:{" "}
              <Link href={downloadUrl} style={linkStyle}>
                {downloadUrl}
              </Link>
            </Text>

            <Hr style={hrStyle} />

            <Text style={textStyle}>
              En nuestro{" "}
              <Link href={recursosUrl} style={linkStyle}>
                centro de recursos
              </Link>{" "}
              encontrás más guías y materiales legales gratuitos.
            </Text>

            <Text style={smallTextStyle}>
              Si tenés preguntas sobre el contenido o querés consultar tu situación particular,
              podés{" "}
              <Link href={`${siteUrl}/#reservar`} style={linkStyle}>
                reservar una consulta
              </Link>
              .
            </Text>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Estudio Jurídico Dr. Pablo De Luca — San Rafael, Mendoza
            </Text>
            <Text style={footerTextStyle}>
              Recibiste este email porque lo solicitaste. No compartimos tu información con
              terceros.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default LeadDescargaEmail;

// ─── Estilos ──────────────────────────────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#FAF7F2",
  fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  margin: 0,
  padding: 0,
};

const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};

const headerStyle: React.CSSProperties = {
  backgroundColor: "#0F1E3D",
  padding: "24px 32px",
};

const logoTextStyle: React.CSSProperties = {
  color: "#C9A961",
  fontSize: "20px",
  fontWeight: "600",
  margin: 0,
};

const mainStyle: React.CSSProperties = {
  padding: "32px",
};

const headingStyle: React.CSSProperties = {
  color: "#0F1E3D",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 20px 0",
};

const textStyle: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const btnContainerStyle: React.CSSProperties = {
  margin: "20px 0",
};

const downloadBtnStyle: React.CSSProperties = {
  backgroundColor: "#C9A961",
  color: "#0F1E3D",
  fontSize: "15px",
  fontWeight: "600",
  padding: "14px 32px",
  borderRadius: "4px",
  textDecoration: "none",
  display: "inline-block",
};

const linkStyle: React.CSSProperties = {
  color: "#0F1E3D",
  fontWeight: "500",
  textDecoration: "underline",
};

const hrStyle: React.CSSProperties = {
  borderColor: "#E5E0D8",
  margin: "24px 0",
};

const smallTextStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 16px 0",
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#F2EBDE",
  padding: "16px 32px",
  borderTop: "1px solid #E5E0D8",
};

const footerTextStyle: React.CSSProperties = {
  color: "#888888",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 4px 0",
};
