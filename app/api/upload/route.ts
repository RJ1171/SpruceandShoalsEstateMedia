import { NextResponse } from "next/server";
import { z } from "zod";
import { generateDepthMap } from "../../../lib/depth/generateDepthMap";
import { ensurePublicBucket } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const uploadSchema = z.object({
  files: z.array(z.object({
    name: z.string().min(1),
    type: z.string().startsWith("image/"),
    size: z.number().positive().max(20 * 1024 * 1024)
  })).min(5).max(30)
});

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  try {
    const { files } = uploadSchema.parse(await request.json());
    const projectId = crypto.randomUUID();
    const supabase = await ensurePublicBucket("listing-media");

    const uploads = await Promise.all(files.map(async (file, index) => {
      const prefix = String(index + 1).padStart(2, "0");
      const originalPath = `${projectId}/originals/${prefix}-${safeFileName(file.name)}`;
      const { data: signed, error: signedError } = await supabase.storage.from("listing-media").createSignedUploadUrl(originalPath);
      if (signedError) throw signedError;

      const depth = await generateDepthMap(new Uint8Array());
      const depthMapPath = `${projectId}/depth/${prefix}.${depth.extension}`;
      const { error: depthError } = await supabase.storage.from("listing-media").upload(depthMapPath, depth.bytes, {
        contentType: depth.contentType,
        upsert: false
      });
      if (depthError) throw depthError;

      return {
        name: file.name,
        path: originalPath,
        token: signed.token,
        originalUrl: supabase.storage.from("listing-media").getPublicUrl(originalPath).data.publicUrl,
        depthMapUrl: supabase.storage.from("listing-media").getPublicUrl(depthMapPath).data.publicUrl,
        depthProvider: depth.provider
      };
    }));

    return NextResponse.json({ projectId, bucket: "listing-media", uploads });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Upload between 5 and 30 images under 20 MB each.", issues: error.issues }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Upload preparation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
