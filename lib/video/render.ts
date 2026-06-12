import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { ListingVideoProps } from "../../remotion/ListingVideo";
import { ensurePublicBucket } from "../supabase-server";

declare global {
  // eslint-disable-next-line no-var
  var spruceShoalsRemotionBundle: Promise<string> | undefined;
}

function getBundle() {
  if (!globalThis.spruceShoalsRemotionBundle) {
    globalThis.spruceShoalsRemotionBundle = bundle({
      entryPoint: path.join(process.cwd(), "remotion", "index.ts"),
      webpackOverride: (configuration) => configuration
    });
  }

  return globalThis.spruceShoalsRemotionBundle;
}

export async function renderListingVideo(projectId: string, inputProps: ListingVideoProps) {
  const serveUrl = await getBundle();
  const composition = await selectComposition({
    serveUrl,
    id: "ListingVideo",
    inputProps
  });
  const outputLocation = path.join(tmpdir(), `${projectId}.mp4`);

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation,
    inputProps,
    crf: 20,
    imageFormat: "jpeg",
    jpegQuality: 90,
    concurrency: 1,
    timeoutInMilliseconds: 120000,
    overwrite: true
  });

  const video = await readFile(outputLocation);
  const supabase = await ensurePublicBucket("listing-videos");
  const videoPath = `${projectId}/listing-reel.mp4`;
  const { error } = await supabase.storage.from("listing-videos").upload(videoPath, video, {
    contentType: "video/mp4",
    cacheControl: "3600",
    upsert: true
  });
  await rm(outputLocation, { force: true });
  if (error) throw error;

  return {
    videoPath,
    videoUrl: supabase.storage.from("listing-videos").getPublicUrl(videoPath).data.publicUrl,
    durationInFrames: composition.durationInFrames,
    fps: composition.fps
  };
}
