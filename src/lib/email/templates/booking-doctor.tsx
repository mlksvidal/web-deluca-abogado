/**
 * Template email: notificación al Dr. cuando se confirma un turno.
 * Tono: conciso, operativo — es para el profesional, no el cliente.
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export interface BookingDoctorEmailProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  /** Fecha/hora local ya formateada */
  slotFormatted: string;
  legalArea: string;
  description: string;
  bookingId: string;
  siteUrl?: string;
}

const baseUrl = process.env.SITE_URL ?? "https://estudiodeluca.com.ar";

export function BookingDoctorEmail({
  clientName,
  clientEmail,
  clientPhone,
  slotFormatted,
  legalArea,
  description,
  bookingId,
  siteUrl = baseUrl,
}: BookingDoctorEmailProps) {
  const adminUrl = `${siteUrl}/admin`;

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>
        Nuevo turno: {clientName} — {slotFormatted}
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>Estudio De Luca — Panel</Text>
          </Section>

          <Section style={mainStyle}>
            <Heading style={headingStyle}>Nuevo turno reservado</Heading>

            <Text style={textStyle}>
              Se registró un turno para el <strong>{slotFormatted}</strong>.
            </Text>

            {/* Datos del cliente */}
            <Section style={infoBoxStyle}>
              <Text style={sectionTitleStyle}>Datos del cliente</Text>
              <Row>
                <Text style={infoLabelStyle}>Nombre</Text>
                <Text style={infoValueStyle}>{clientName}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>Email</Text>
                <Text style={infoValueStyle}>{clientEmail}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>Teléfono</Text>
                <Text style={infoValueStyle}>{clientPhone}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>Área</Text>
                <Text style={infoValueStyle}>{legalArea}</Text>
              </Row>
            </Section>

            {/* Descripción de la consulta */}
            <Section style={descBoxStyle}>
              <Text style={sectionTitleStyle}>Descripción de la consulta</Text>
              <Text style={descTextStyle}>{description}</Text>
            </Section>

            <Text style={metaTextStyle}>ID de reserva: {bookingId}</Text>

            <Hr style={hrStyle} />

            <Section style={btnContainerStyle}>
              <Button style={adminBtnStyle} href={adminUrl}>
                Ver en panel admin
              </Button>
            </Section>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Notificación automática — Estudio Jurídico Dr. Pablo De Luca
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingDoctorEmail;

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
  padding: "20px 32px",
};

const logoTextStyle: React.CSSProperties = {
  color: "#C9A961",
  fontSize: "16px",
  fontWeight: "600",
  margin: 0,
};

const mainStyle: React.CSSProperties = {
  padding: "28px 32px",
};

const headingStyle: React.CSSProperties = {
  color: "#0F1E3D",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const textStyle: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: "#F2EBDE",
  borderLeft: "4px solid #C9A961",
  padding: "16px 20px",
  margin: "16px 0",
  borderRadius: "4px",
};

const sectionTitleStyle: React.CSSProperties = {
  color: "#0F1E3D",
  fontSize: "13px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "0.8px",
  margin: "0 0 12px 0",
};

const infoLabelStyle: React.CSSProperties = {
  color: "#888888",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 2px 0",
};

const infoValueStyle: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "15px",
  margin: "0 0 10px 0",
};

const descBoxStyle: React.CSSProperties = {
  backgroundColor: "#fef9f0",
  border: "1px solid #E5E0D8",
  padding: "16px 20px",
  margin: "16px 0",
  borderRadius: "4px",
};

const descTextStyle: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};

const metaTextStyle: React.CSSProperties = {
  color: "#aaaaaa",
  fontSize: "12px",
  margin: "8px 0 0 0",
  fontFamily: "monospace",
};

const hrStyle: React.CSSProperties = {
  borderColor: "#E5E0D8",
  margin: "20px 0",
};

const btnContainerStyle: React.CSSProperties = {
  margin: "4px 0 8px 0",
};

const adminBtnStyle: React.CSSProperties = {
  backgroundColor: "#C9A961",
  color: "#0F1E3D",
  fontSize: "14px",
  fontWeight: "600",
  padding: "10px 24px",
  borderRadius: "4px",
  textDecoration: "none",
  display: "inline-block",
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#F2EBDE",
  padding: "14px 32px",
  borderTop: "1px solid #E5E0D8",
};

const footerTextStyle: React.CSSProperties = {
  color: "#aaaaaa",
  fontSize: "12px",
  margin: 0,
};
