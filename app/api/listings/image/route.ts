import { NextResponse } from "next/server";

const allowedImageHosts = [
  "zillow.com",
  "zillowstatic.com",
  "realtor.com",
  "realtorstatic.com",
  "rdcpix.com"
];

function isAllowedHost(hostname: string) {
  const host = hostname.toLowerCase();
  return allowedImageHosts.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

export async function GET(request: Request) {
  const source = new URL(request.url).searchParams.get("url");
  if (!source) return NextResponse.json({ error: "Missing image URL." }, { status: 400 });

  try {
    const url = new URL(source);
    if (url.protocol !== "https:" || !isAllowedHost(url.hostname)) {
      return NextResponse.json({ error: "Image host is not supported." }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SpruceShoalsMedia/1.0)" },
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) return NextResponse.json({ error: "Image could not be loaded." }, { status: 422 });

    const contentType = response.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Requested resource is not an image." }, { status: 422 });
    }

    return new NextResponse(await response.arrayBuffer(), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400"
      }
    });
  } catch {
    return NextResponse.json({ error: "Image proxy failed." }, { status: 500 });
  }
}
