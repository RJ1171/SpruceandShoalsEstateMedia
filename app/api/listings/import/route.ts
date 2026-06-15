import { NextResponse } from "next/server";
import { z } from "zod";

const importSchema = z.object({
  url: z.string().url()
});

const allowedHosts = new Set([
  "www.zillow.com",
  "zillow.com",
  "www.realtor.com",
  "realtor.com",
  "www.redfin.com",
  "redfin.com"
]);

type JsonRecord = Record<string, unknown>;

type PropertyDetails = {
  address: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  description: string | null;
};

function decode(value: string) {
  return value
    .replace(/\\u002F/g, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function textValue(value: unknown) {
  return typeof value === "string" && value.trim() ? decode(value.trim()) : null;
}

function recordValue(value: unknown): JsonRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : null;
}

function flattenJsonLd(value: unknown): JsonRecord[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  const record = recordValue(value);
  if (!record) return [];
  const graph = Array.isArray(record["@graph"]) ? flattenJsonLd(record["@graph"]) : [];
  return [record, ...graph];
}

function jsonLdRecords(html: string) {
  const records: JsonRecord[] = [];
  const pattern = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      records.push(...flattenJsonLd(JSON.parse(match[1])));
    } catch {
      // Some listing sites emit non-standard JSON-LD. Embedded-data fallbacks handle those pages.
    }
  }
  return records;
}

function formattedAddress(value: unknown) {
  if (typeof value === "string") return textValue(value);
  const address = recordValue(value);
  if (!address) return null;
  return [address.streetAddress, address.addressLocality, address.addressRegion, address.postalCode]
    .map(textValue)
    .filter(Boolean)
    .join(", ") || null;
}

function firstEmbeddedNumber(html: string, keys: string[]) {
  for (const key of keys) {
    const match = html.match(new RegExp(`"${key}"\\s*:\\s*(?:"([^"\\\\]+)"|([0-9.]+))`, "i"));
    const value = numberValue(match?.[1] ?? match?.[2]);
    if (value !== null) return value;
  }
  return null;
}

function firstEmbeddedText(html: string, keys: string[]) {
  for (const key of keys) {
    const match = html.match(new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, "i"));
    if (match?.[1]) return decode(match[1].replace(/\\n/g, " ").replace(/\\"/g, '"'));
  }
  return null;
}

function propertyDetails(html: string): PropertyDetails {
  const records = jsonLdRecords(html);
  const listing = records.find((record) => {
    const type = Array.isArray(record["@type"]) ? record["@type"].join(" ") : String(record["@type"] ?? "");
    return /RealEstateListing/i.test(type);
  });
  const property = recordValue(listing?.mainEntity) ?? records.find((record) => {
    const type = Array.isArray(record["@type"]) ? record["@type"].join(" ") : String(record["@type"] ?? "");
    return /Residence|House|Apartment|Accommodation/i.test(type);
  }) ?? records[0];
  const offers = recordValue(listing?.offers) ?? recordValue(property?.offers);
  const floorSize = recordValue(property?.floorSize);
  const ldAddress = formattedAddress(property?.address);
  const embeddedStreet = firstEmbeddedText(html, ["streetAddress", "addressLine", "line"]);
  const embeddedCity = firstEmbeddedText(html, ["city", "addressLocality"]);
  const embeddedState = firstEmbeddedText(html, ["state", "addressRegion"]);
  const embeddedZip = firstEmbeddedText(html, ["zipcode", "postalCode"]);

  return {
    address: ldAddress || [embeddedStreet, embeddedCity, embeddedState, embeddedZip].filter(Boolean).join(", ") || null,
    price: numberValue(offers?.price) ?? numberValue(listing?.price) ?? numberValue(property?.price) ?? firstEmbeddedNumber(html, ["list_price", "listPrice", "price"]),
    bedrooms: numberValue(property?.numberOfBedrooms) ?? firstEmbeddedNumber(html, ["bedrooms", "beds"]),
    bathrooms: numberValue(property?.numberOfBathroomsTotal) ?? numberValue(property?.numberOfBathrooms) ?? firstEmbeddedNumber(html, ["bathrooms", "baths"]),
    squareFeet: numberValue(floorSize?.value) ?? firstEmbeddedNumber(html, ["livingArea", "sqft", "squareFeet"]),
    description: textValue(listing?.description) ?? textValue(property?.description) ?? firstEmbeddedText(html, ["description", "homeDescription"])
  };
}

function uniqueImages(html: string) {
  const urls = new Set<string>();
  const addImage = (candidate: unknown) => {
    const value = textValue(candidate);
    if (!value?.startsWith("https://")) return;
    try {
      const host = new URL(value).hostname;
      if (/rdcpix|zillowstatic|redfin|cloudfront|imgix|images/i.test(host)) urls.add(value);
    } catch {
      // Ignore malformed embedded URLs.
    }
  };

  for (const record of jsonLdRecords(html)) {
    const images = Array.isArray(record.image) ? record.image : [record.image];
    images.forEach((image) => addImage(recordValue(image)?.url ?? image));
    addImage(recordValue(record.primaryImageOfPage)?.url);
  }

  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/gi,
    /"(?:image|imageUrl|image_url|photoUrl|photo_url|href|url)"\s*:\s*"(https?:\\?\/\\?\/[^"']+)"/gi
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      addImage(decode(match[1] ?? ""));
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
        { error: "Use a public Zillow, Realtor.com, or Redfin listing URL." },
        { status: 400 }
      );
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "The listing site blocked automatic import. You can still enter details and upload photos manually." },
        { status: 422 }
      );
    }

    const html = await response.text();
    const images = uniqueImages(html);
    const property = propertyDetails(html);
    const hasDetails = Object.values(property).some((value) => value !== null);

    if (!images.length && !hasDetails) {
      return NextResponse.json(
        { error: "No public listing information was found. Check that the listing is active and publicly visible." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      property,
      images: images.map((image) => `/api/listings/image?url=${encodeURIComponent(image)}`)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid listing URL." }, { status: 400 });
    }

    return NextResponse.json({ error: "Listing import failed. Try manual entry instead." }, { status: 500 });
  }
}
