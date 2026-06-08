import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const event = await request.json();

  // Add svix signature verification before enabling this endpoint in production.
  return NextResponse.json({
    received: true,
    type: event.type
  });
}
