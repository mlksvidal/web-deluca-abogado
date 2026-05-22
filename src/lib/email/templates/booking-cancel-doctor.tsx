/**
 * Template email: notificación al Dr. cuando se cancela un turno.
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export interface BookingCancelDoctorEmailProps {
  clientName: string;
  clientEmail: string;
  slotFormatted: string;
  bookingId: string;
  /** Quién inició la cancelación */
  cancelledBy?: "client" | "admin";
}

export function BookingCancelDoctorEmail({
  clientName,
  clientEmail,
  slotFormatted,
  bookingId,
  cancelledBy = "client",
}: BookingCancelDoctorEmailProps) {
  const initiator = cancelledBy === "admin" ? "el panel admin" : "el cliente";

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>
        Turno cancelado: {clientName} — {slotFormatted}
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>Estudio De Luca — Panel</Text>
          </Section>

          <Section style={mainStyle}>
            <Heading style={headingStyle}>Turno cancelado</Heading>

            <Text style={textStyle}>
              El turno del <strong>{slotFormatted}</strong> fue cancelado por {initiator}.
            </Text>

            <Section style={infoBoxStyle}>
              <Row>
                <Text style={infoLabelStyle}>Cliente</Text>
                <Text style={infoValueStyle}>{clientName}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>Email</Text>
                <Text style={infoValueStyle}>{clientEmail}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>Cancelado por</Text>
                <Text style={infoValueStyle}>{initiator}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>ID reserva</Text>
                <Text style={infoValueIdStyle}>{bookingId}</Text>
              </Row>
            </Section>

            <Text style={smallTextStyle}>
              El slot quedó liberado y disponible para nuevas reservas.
            </Text>
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

export default BookingCancelDoctorEmail;

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
  borderLeft: "4px solid #A91D1D",
  padding: "16px 20px",
  margin: "16px 0",
  borderRadius: "4px",
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

const infoValueIdStyle: React.CSSProperties = {
  color: "#888888",
  fontSize: "12px",
  fontFamily: "monospace",
  margin: "0 0 4px 0",
};

const smallTextStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: 0,
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
