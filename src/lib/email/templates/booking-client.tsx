/**
 * Template email: confirmación de turno para el cliente.
 * Tono: claro, cercano, sin pomposidad. "Podés cancelar si necesitás."
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
  Row,
  Section,
  Text,
} from "@react-email/components";

export interface BookingClientEmailProps {
  clientName: string;
  /** Fecha/hora local ya formateada: "Martes 10 de junio, 10:00 hs" */
  slotFormatted: string;
  legalArea: string;
  /** ID interno del turno para el link de cancelación */
  bookingId: string;
  /** URL base del sitio (ej: https://estudiodeluca.com.ar) */
  siteUrl?: string;
  /** WhatsApp del Dr. para consultas urgentes */
  whatsappDr?: string;
  /** Dirección del estudio */
  direccion?: string;
}

const baseUrl = process.env.SITE_URL ?? "https://estudiodeluca.com.ar";

export function BookingClientEmail({
  clientName,
  slotFormatted,
  legalArea,
  bookingId,
  siteUrl = baseUrl,
  whatsappDr = "2604000000",
  direccion = "San Rafael, Mendoza",
}: BookingClientEmailProps) {
  const cancelUrl = `${siteUrl}/cancelar-turno?id=${bookingId}`;
  const whatsappUrl = `https://wa.me/54${whatsappDr}`;

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Turno confirmado — {slotFormatted}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>Estudio De Luca</Text>
          </Section>

          {/* Contenido principal */}
          <Section style={mainStyle}>
            <Heading style={headingStyle}>Tu turno está confirmado</Heading>

            <Text style={textStyle}>Hola {clientName},</Text>

            <Text style={textStyle}>
              Tu consulta está reservada. Te esperamos el <strong>{slotFormatted}</strong>.
            </Text>

            {/* Resumen del turno */}
            <Section style={infoBoxStyle}>
              <Row>
                <Text style={infoLabelStyle}>Fecha y hora</Text>
                <Text style={infoValueStyle}>{slotFormatted}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>Área</Text>
                <Text style={infoValueStyle}>{legalArea}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>Lugar</Text>
                <Text style={infoValueStyle}>{direccion}</Text>
              </Row>
            </Section>

            <Text style={textStyle}>
              Si necesitás cancelar o reprogramar, podés hacerlo desde acá hasta 24 horas antes:
            </Text>

            <Section style={btnContainerStyle}>
              <Button style={cancelBtnStyle} href={cancelUrl}>
                Cancelar turno
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={textStyle}>
              ¿Tenés alguna duda urgente?{" "}
              <Link href={whatsappUrl} style={linkStyle}>
                Escribile al Dr. por WhatsApp
              </Link>
              .
            </Text>

            <Text style={smallTextStyle}>
              Por favor, traé cualquier documentación relacionada con tu consulta. La reunión dura
              aproximadamente 45 minutos.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>Estudio Jurídico Dr. Pablo De Luca — {direccion}</Text>
            <Text style={footerTextStyle}>
              Este mensaje es confidencial. Si lo recibiste por error, por favor eliminalo.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingClientEmail;

// ─── Estilos inline (requeridos por react-email) ──────────────────────────────

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
  letterSpacing: "0.5px",
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

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: "#F2EBDE",
  borderLeft: "4px solid #C9A961",
  padding: "16px 20px",
  margin: "20px 0",
  borderRadius: "4px",
};

const infoLabelStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 2px 0",
};

const infoValueStyle: React.CSSProperties = {
  color: "#0F1E3D",
  fontSize: "15px",
  fontWeight: "500",
  margin: "0 0 12px 0",
};

const btnContainerStyle: React.CSSProperties = {
  margin: "16px 0 24px 0",
};

const cancelBtnStyle: React.CSSProperties = {
  backgroundColor: "#0F1E3D",
  color: "#FAF7F2",
  fontSize: "15px",
  fontWeight: "500",
  padding: "12px 28px",
  borderRadius: "4px",
  textDecoration: "none",
  display: "inline-block",
};

const hrStyle: React.CSSProperties = {
  borderColor: "#E5E0D8",
  margin: "24px 0",
};

const linkStyle: React.CSSProperties = {
  color: "#0F1E3D",
  fontWeight: "600",
  textDecoration: "underline",
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
