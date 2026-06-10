import { NextResponse } from "next/server";
import { generatePropertyDescription, propertyPayloadSchema } from "../../../../lib/ai";
import { trackServerEvent } from "../../../../lib/analytics";

export async function POST(request: Request) {
  try {
    const payload = propertyPayloadSchema.parse(await request.json());
    const description = await generatePropertyDescription(payload);
    trackServerEvent("description_generated", { address: payload.address, tone: payload.tone });
    return NextResponse.json({ description });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
