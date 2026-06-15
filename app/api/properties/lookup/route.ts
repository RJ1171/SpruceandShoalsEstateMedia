import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const revalidate = 86400;

const querySchema = z.object({
  address: z.string().trim().min(8).max(200)
});

type RentCastProperty = {
  formattedAddress?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  lastSalePrice?: number;
};

type RentCastListing = RentCastProperty & {
  price?: number;
  status?: string;
};

type RentCastError = {
  error?: string;
  message?: string;
};

async function rentCastGet<T>(path: string, address: string, apiKey: string) {
  const url = new URL(`https://api.rentcast.io/v1/${path}`);
  url.searchParams.set("address", address);
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: { Accept: "application/json", "X-Api-Key": apiKey },
    signal: AbortSignal.timeout(10000),
    next: { revalidate: 86400 }
  });

  if (response.status === 404) return [] as T[];
  if (!response.ok) {
    const details = await response.json().catch(() => null) as RentCastError | null;
    if (details?.error === "billing/subscription-inactive") {
      throw new Error("Property lookup subscription is inactive. Activate the RentCast API plan, then try again.");
    }
    throw new Error(details?.message || `Property service returned ${response.status}.`);
  }
  return response.json() as Promise<T[]>;
}

function fullAddress(property: RentCastProperty, fallback: string) {
  if (property.formattedAddress) return property.formattedAddress;
  const locality = [property.city, property.state, property.zipCode].filter(Boolean).join(", ");
  return [property.addressLine1, locality].filter(Boolean).join(", ") || fallback;
}

export async function GET(request: Request) {
  try {
    const { address } = querySchema.parse({ address: new URL(request.url).searchParams.get("address") });
    const apiKey = process.env.RENTCAST_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Property lookup is not configured yet." }, { status: 503 });
    }

    const [properties, listings] = await Promise.all([
      rentCastGet<RentCastProperty>("properties", address, apiKey),
      rentCastGet<RentCastListing>("listings/sale", address, apiKey)
    ]);

    const property = properties[0];
    const listing = listings[0];
    const match = listing ?? property;

    if (!match) {
      return NextResponse.json({ error: "No matching property was found. Try the full city, state, and ZIP code." }, { status: 404 });
    }

    const price = listing?.price ?? property?.lastSalePrice ?? null;

    return NextResponse.json({
      address: fullAddress(match, address),
      price,
      priceType: listing?.price ? "list" : price ? "last-sale" : null,
      bedrooms: listing?.bedrooms ?? property?.bedrooms ?? null,
      bathrooms: listing?.bathrooms ?? property?.bathrooms ?? null,
      squareFeet: listing?.squareFootage ?? property?.squareFootage ?? null
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a more complete property address." }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Property lookup failed." },
      { status: 502 }
    );
  }
}
