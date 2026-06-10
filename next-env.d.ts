import { Button, Heading, Text } from "@react-email/components";
import { EmailFrame } from "./base";

export function VideoCompletedEmail({ projectName, previewUrl }: { projectName: string; previewUrl: string }) {
  return (
    <EmailFrame preview="Your AI property video is ready">
      <Heading style={{ fontFamily: "Georgia, serif", color: "#17233B" }}>Video ready for {projectName}</Heading>
      <Text>Your generated listing video is ready for review, timeline edits, and export.</Text>
      <Button href={previewUrl} style={{ backgroundColor: "#C8A45D", color: "#17233B", padding: "12px 18px" }}>Preview video</Button>
    </EmailFrame>
  );
}
