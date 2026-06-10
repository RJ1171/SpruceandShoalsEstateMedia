export type AnalyticsEvent =
  | "signup_started"
  | "project_created"
  | "media_uploaded"
  | "description_generated"
  | "video_generation_started"
  | "export_completed";

export function trackServerEvent(event: AnalyticsEvent, properties: Record<string, unknown> = {}) {
  if (!process.env.POSTHOG_KEY) {
    return;
  }

  void fetch("https://app.posthog.com/capture/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.POSTHOG_KEY,
      event,
      properties
    })
  }).catch(() => undefined);
}
