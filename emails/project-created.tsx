import { Heading, Text } from "@react-email/components";
import { EmailFrame } from "./base";

export function ProjectCreatedEmail({ projectName }: { projectName: string }) {
  return (
    <EmailFrame preview="Your listing project has been created">
      <Heading style={{ fontFamily: "Georgia, serif", color: "#17233B" }}>{projectName} is ready.</Heading>
      <Text>Upload media, choose a template, and start generating campaign assets whenever you are ready.</Text>
    </EmailFrame>
  );
}
