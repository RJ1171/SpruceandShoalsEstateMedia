import { NextResponse } from "next/server";
import { z } from "zod";
import { renderListingVideo } from "../../../lib/video/render";

export const runtime = "nodejs";
export const maxDuration = 300;

const renderSchema = z.object({
  projectId: z.string().uuid(),
  images: z.array(z.object({
    originalUrl: z.string().url(),
    depthMapUrl: z.string().url().nullable().optional()
  })).min(5).max(30),
  address: z.string().min(3),
  price: z.string().min(1),
  beds: z.string().min(1),
  baths: z.string().min(1),
  squareFeet: z.string().min(1),
  agentName: z.string().min(2)
});

export async function POST(request: Request) {
  try {
    const payload = renderSchema.parse(await request.json());
    const renderPayload = {
      ...payload,
      images: payload.images.map((image) => ({ originalUrl: image.originalUrl, depthMapUrl: null }))
    };
    const result = await renderListingVideo(payload.projectId, renderPayload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Render details are incomplete.", issues: error.issues }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Video render failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
