import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import { brand } from "../config/brand";

export function EmailFrame({ preview, children }: { preview: string; children: React.ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: brand.colors.cream, color: brand.colors.charcoal, fontFamily: "Arial, sans-serif" }}>
        <Container style={{ margin: "0 auto", padding: "32px 20px", maxWidth: "620px" }}>
          <Section style={{ backgroundColor: brand.colors.white, border: `1px solid ${brand.colors.linen}`, padding: "32px" }}>
            <Text style={{ color: brand.colors.gold, fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase" }}>{brand.name}</Text>
            {children}
            <Hr style={{ borderColor: brand.colors.linen, margin: "28px 0" }} />
            <Text style={{ color: "#69707a", fontSize: "12px" }}>{brand.contact.email}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
