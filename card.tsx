import { NextResponse } from "next/server";
import { generateVideoScript, propertyPayloadSchema } from "../../../../lib/ai";

export async function POST(request: Request) {
  try {
    const payload = propertyPayloadSchema.parse(await request.json());
    const script = await generateVideoScript(payload);
    return NextResponse.json({ script });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
