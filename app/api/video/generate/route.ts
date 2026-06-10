import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { trackServerEvent } from "../../../../lib/analytics";
import { enqueueVideoGeneration, videoGenerationSchema } from "../../../../lib/video";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const job = videoGenerationSchema.parse(await request.json());
    const result = await enqueueVideoGeneration(job);
    trackServerEvent("video_generation_started", { userId, projectId: job.projectId, format: job.format });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
