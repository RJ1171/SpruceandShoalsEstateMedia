import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function adminToken() {
  const secret = process.env.ADMIN_PASSWORD || "";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode("spruce-shoals-admin"));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/sign-in") {
    const token = request.cookies.get("spruce_shoals_admin")?.value;
    if (token !== await adminToken()) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/sign-in";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
