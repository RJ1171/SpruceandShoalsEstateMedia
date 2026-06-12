import { bundle } from "@remotion/bundler";
import { ensureBrowser, renderMedia, selectComposition } from "@remotion/renderer";
import chromium from "@sparticuz/chromium";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { ListingVideoProps } from "../../remotion/ListingVideo";
import { ensurePublicBucket } from "../supabase-server";

declare global {
  // eslint-disable-next-line no-var
  var spruceShoalsRemotionBundle: Promise<string> | undefined;
  // eslint-disable-next-line no-var
  var spruceShoalsBrowserExecutable: Promise<string> | undefined;
}

const projectRoot = process.cwd();

function getBundle() {
  if (!globalThis.spruceShoalsRemotionBundle) {
    globalThis.spruceShoalsRemotionBundle = bundle({
      entryPoint: path.join(projectRoot, "remotion", "index.ts"),
      webpackOverride: (configuration) => ({ ...configuration, cache: false })
    });
  }

  return globalThis.spruceShoalsRemotionBundle;
}

function getBrowserExecutable() {
  if (!globalThis.spruceShoalsBrowserExecutable) {
    globalThis.spruceShoalsBrowserExecutable = (async () => {
      if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        chromium.setGraphicsMode = false;
        return chromium.executablePath();
      }

      const browser = await ensureBrowser({ chromeMode: "headless-shell", logLevel: "warn" });
      if (browser.type === "no-browser" || browser.type === "version-mismatch") {
        throw new Error("Chrome Headless Shell could not be prepared for rendering.");
      }
      return browser.path;
    })();
  }

  return globalThis.spruceShoalsBrowserExecutable;
}

export async function renderListingVideo(projectId: string, inputProps: ListingVideoProps) {
  const serveUrl = await getBundle();
  const browserExecutable = await getBrowserExecutable();
  const composition = await selectComposition({
    serveUrl,
    id: "ListingVideo",
    inputProps,
    browserExecutable
  });
  const outputLocation = path.join(tmpdir(), `${projectId}.mp4`);

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation,
    inputProps,
    crf: 28,
    imageFormat: "jpeg",
    jpegQuality: 82,
    concurrency: 2,
    timeoutInMilliseconds: 240000,
    overwrite: true,
    browserExecutable
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
