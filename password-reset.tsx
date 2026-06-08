import { Button, Heading, Text } from "@react-email/components";
import { EmailFrame } from "@/emails/base";

export function ExportCompletedEmail({ exportUrl }: { exportUrl: string }) {
  return (
    <EmailFrame preview="Your export is complete">
      <Heading style={{ fontFamily: "Georgia, serif", color: "#17233B" }}>Export complete</Heading>
      <Text>Your final media export is ready to download and share.</Text>
      <Button href={exportUrl} style={{ backgroundColor: "#17233B", color: "#FFFFFF", padding: "12px 18px" }}>Download export</Button>
    </EmailFrame>
  );
}
