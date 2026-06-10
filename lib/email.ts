export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(message: EmailMessage) {
  return {
    id: `local-${Date.now()}`,
    provider: "placeholder",
    to: message.to
  };
}
