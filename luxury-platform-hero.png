import { z } from "zod";

export const videoGenerationSchema = z.object({
  projectId: z.string(),
  templateId: z.string(),
  format: z.enum(["VERTICAL", "HORIZONTAL", "SQUARE"]),
  voiceId: z.string().optional(),
  musicId: z.string().optional(),
  brandProfileId: z.string()
});

export type VideoGenerationJob = z.infer<typeof videoGenerationSchema>;

export async function enqueueVideoGeneration(job: VideoGenerationJob) {
  // Production path: persist a job row, invoke FFmpeg workers, upload mezzanine output to Mux, and emit lifecycle webhooks.
  return {
    id: `job_${job.projectId}_${Date.now()}`,
    status: "QUEUED",
    providers: ["ffmpeg", "mux", "openai", "replicate"]
  };
}

export const futureVideoProviders = {
  replicate: ["image-enhancement", "virtual-staging"],
  runway: ["text-to-video", "motion-brush"],
  stability: ["sky-replacement", "image-upscale"]
};
