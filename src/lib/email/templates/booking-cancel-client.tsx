/**
 * Template email: confirmación de cancelación de turno para el cliente.
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
  Section,
  Text,
} from "@react-email/components";

export interface BookingCancelClientEmailProps {
  clientName: string;
  slotFormatted: string;
  siteUrl?: string;
}

const baseUrl = process.env.SITE_URL ?? "https://estudiodeluca.com.ar";

export function BookingCancelClientEmail({
  clientName,
  slotFormatted,
  siteUrl = baseUrl,
}: BookingCancelClientEmailProps) {
  const newBookingUrl = `${siteUrl}/#reservar`;

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Turno cancelado — {slotFormatted}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>Estudio De Luca</Text>
          </Section>

          <Section style={mainStyle}>
            <Heading style={headingStyle}>Turno cancelado</Heading>

            <Text style={textStyle}>Hola {clientName},</Text>

            <Text style={textStyle}>
              Confirmamos que tu turno del <strong>{slotFormatted}</strong> fue cancelado
              correctamente.
            </Text>

            <Text style={textStyle}>
              Si querés reservar otro turno, podés hacerlo cuando quieras:
            </Text>

            <Section style={btnContainerStyle}>
              <Button style={newBtnStyle} href={newBookingUrl}>
                Reservar nuevo turno
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={smallTextStyle}>
              Si cancelaste por error o necesitás hablar con el Dr. De Luca, respondé este email o
              escribinos directamente.
            </Text>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Estudio Jurídico Dr. Pablo De Luca — San Rafael, Mendoza
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingCancelClientEmail;

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
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const textStyle: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const btnContainerStyle: React.CSSProperties = {
  margin: "16px 0 24px 0",
};

const newBtnStyle: React.CSSProperties = {
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

const smallTextStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: 0,
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#F2EBDE",
  padding: "16px 32px",
  borderTop: "1px solid #E5E0D8",
};

const footerTextStyle: React.CSSProperties = {
  color: "#888888",
  fontSize: "12px",
  margin: 0,
};
