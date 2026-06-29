import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  password: z.string().min(1),
  next: z.string().optional()
});

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function adminToken() {
  return createHmac("sha256", adminPassword()).update("spruce-shoals-admin").digest("base64");
}

export async function POST(request: Request) {
  try {
    const { password, next } = schema.parse(await request.json());

    if (password !== adminPassword()) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, next: next?.startsWith("/admin") ? next : "/admin" });
    response.cookies.set("spruce_shoals_admin", adminToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/admin",
      maxAge: 60 * 60 * 8
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Sign in failed." }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("spruce_shoals_admin", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0
  });
  return response;
}
