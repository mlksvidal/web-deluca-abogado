/**
 * Template email: notificación al Dr. cuando se captura un nuevo lead de descarga.
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

export interface LeadDescargaDoctorEmailProps {
  nombre: string;
  email: string;
  recursoTitulo: string;
  recursoSlug: string;
  areaLegal?: string;
  leadId: string;
}

export function LeadDescargaDoctorEmail({
  nombre,
  email,
  recursoTitulo,
  recursoSlug,
  areaLegal,
  leadId,
}: LeadDescargaDoctorEmailProps) {
  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>
        Nuevo lead: {nombre} descargó &quot;{recursoTitulo}&quot;
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>Estudio De Luca — Panel</Text>
          </Section>

          <Section style={mainStyle}>
            <Heading style={headingStyle}>Nuevo lead capturado</Heading>

            <Text style={textStyle}>Alguien descargó un recurso de tu sitio y dejó sus datos.</Text>

            <Section style={infoBoxStyle}>
              <Row>
                <Text style={infoLabelStyle}>Nombre</Text>
                <Text style={infoValueStyle}>{nombre}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>Email</Text>
                <Text style={infoValueStyle}>{email}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>Recurso descargado</Text>
                <Text style={infoValueStyle}>{recursoTitulo}</Text>
              </Row>
              <Row>
                <Text style={infoLabelStyle}>Slug</Text>
                <Text style={infoValueIdStyle}>{recursoSlug}</Text>
              </Row>
              {areaLegal && (
                <Row>
                  <Text style={infoLabelStyle}>Área</Text>
                  <Text style={infoValueStyle}>{areaLegal}</Text>
                </Row>
              )}
              <Row>
                <Text style={infoLabelStyle}>ID lead</Text>
                <Text style={infoValueIdStyle}>{leadId}</Text>
              </Row>
            </Section>

            <Text style={smallTextStyle}>
              Podés contactar a este lead por email para ofrecerle una consulta.
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

export default LeadDescargaDoctorEmail;

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
  borderLeft: "4px solid #2EA043",
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
  margin: "0 0 10px 0",
};

const smallTextStyle: React.CSSProperties = {
  color: "#555555",
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
