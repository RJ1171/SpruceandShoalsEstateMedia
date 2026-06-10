import { z } from "zod";
import { brand } from "../config/brand";
import { getOpenAIClient } from "./openai";

export const propertyPayloadSchema = z.object({
  address: z.string().min(3),
  price: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  squareFeet: z.number().optional(),
  description: z.string().optional(),
  tone: z.enum(["MLS", "LUXURY", "SOCIAL", "OPEN_HOUSE"]).default("LUXURY")
});

export async function generatePropertyDescription(input: z.infer<typeof propertyPayloadSchema>) {
  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: "gpt-5-mini",
    instructions:
      "You write original, compliant real estate marketing copy. Avoid protected-class language, unverifiable claims, and copyrighted phrases.",
    input: `Brand: ${brand.name}. Tone: ${input.tone}. Property: ${JSON.stringify(input)}. Generate polished listing copy with a headline and channel-ready body.`
  });

  return response.output_text ?? "";
}

export async function generateVideoScript(input: z.infer<typeof propertyPayloadSchema>) {
  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: "gpt-5-mini",
    instructions:
      "Create concise real estate video narration scripts with scene beats, overlay copy, and social variants. Keep claims factual and editable.",
    input: `Create a 45 second luxury listing video script for ${input.address}. Details: ${JSON.stringify(input)}`
  });

  return response.output_text ?? "";
}
