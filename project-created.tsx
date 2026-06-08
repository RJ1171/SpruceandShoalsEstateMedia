import { Button, Heading, Text } from "@react-email/components";
import { EmailFrame } from "@/emails/base";

export function PasswordResetEmail({ resetUrl }: { resetUrl: string }) {
  return (
    <EmailFrame preview="Reset your password">
      <Heading style={{ fontFamily: "Georgia, serif", color: "#17233B" }}>Reset your password</Heading>
      <Text>Use the secure link below to finish resetting your account credentials.</Text>
      <Button href={resetUrl} style={{ backgroundColor: "#17233B", color: "#FFFFFF", padding: "12px 18px" }}>Reset password</Button>
    </EmailFrame>
  );
}
