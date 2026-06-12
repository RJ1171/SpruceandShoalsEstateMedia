import { NextResponse } from "next/server";
import { z } from "zod";

const importSchema = z.object({
  url: z.string().url()
});

const allowedHosts = new Set([
  "www.zillow.com",
  "zillow.com",
  "www.realtor.com",
  "realtor.com"
]);

function uniqueImages(html: string) {
  const urls = new Set<string>();
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/gi,
    /"(?:image|imageUrl|image_url|photoUrl|photo_url)"\s*:\s*"(https?:\\?\/\\?\/[^"']+)"/gi
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const value = match[1]
        ?.replace(/\\u002F/g, "/")
        .replace(/\\\//g, "/")
        .replace(/&amp;/g, "&");

      if (value?.startsWith("https://")) urls.add(value);
      if (urls.size >= 30) break;
    }
  }

  return Array.from(urls).slice(0, 24);
}

export async function POST(request: Request) {
  try {
    const { url } = importSchema.parse(await request.json());
    const parsed = new URL(url);

    if (!allowedHosts.has(parsed.hostname.toLowerCase())) {
      return NextResponse.json(
        { error: "Use a public Zillow or Realtor.com listing URL." },
        { status: 400 }
      );
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SpruceShoalsMedia/1.0)"
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "The listing site did not allow image import. Upload the photos from your device instead." },
        { status: 422 }
      );
    }

    const html = await response.text();
    const images = uniqueImages(html);

    if (!images.length) {
      return NextResponse.json(
        { error: "No public listing images were found. Upload the photos from your device instead." },
        { status: 422 }
      );
    }

    return NextResponse.json({ images });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid listing URL." }, { status: 400 });
    }

    return NextResponse.json({ error: "Listing import failed. Try a device upload instead." }, { status: 500 });
  }
}
