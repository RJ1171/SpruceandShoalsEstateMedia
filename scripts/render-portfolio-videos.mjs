import { bundle } from "@remotion/bundler";
import { ensureBrowser, renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";

const root = process.cwd();
const serveUrl = await bundle({
  entryPoint: path.join(root, "remotion", "index.ts"),
  webpackOverride: (configuration) => ({ ...configuration, cache: false })
});
const browser = await ensureBrowser({ chromeMode: "headless-shell", logLevel: "warn" });

if (browser.type === "no-browser" || browser.type === "version-mismatch") {
  throw new Error("Chrome Headless Shell is unavailable.");
}

const listings = [
  ["atlantic-shingle-estate", "Atlantic Shingle Estate", "Featured residence"],
  ["north-shore-modern", "North Shore Modern", "Architectural story"],
  ["maine-blue-hour", "Maine at Blue Hour", "Twilight campaign"],
  ["cape-cod-pool-house", "Cape Cod Glass House", "Lifestyle presentation"]
];
const requestedSlug = process.argv[2];

for (const [slug, title, label] of listings) {
  if (requestedSlug && requestedSlug !== slug) continue;
  const inputProps = {
    scenes: [
      { image: `/images/portfolio/${slug}.png`, room: "Arrival" },
      { image: `/images/portfolio/interiors/${slug}-entrance.png`, room: "Entrance" },
      { image: `/images/portfolio/interiors/${slug}-living-room.png`, room: "Living room" },
      { image: `/images/portfolio/interiors/${slug}-kitchen.png`, room: "Kitchen" },
      { image: `/images/portfolio/interiors/${slug}-bedroom.png`, room: "Primary bedroom" },
      { image: `/images/portfolio/interiors/${slug}-bathroom.png`, room: "Primary bath" }
    ],
    title,
    label
  };
  const composition = await selectComposition({
    serveUrl,
    id: "PortfolioVideo",
    inputProps,
    browserExecutable: browser.path
  });

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: path.join(root, "public", "videos", "portfolio", `${slug}.mp4`),
    inputProps,
    videoBitrate: "4M",
    imageFormat: "jpeg",
    jpegQuality: 90,
    concurrency: 2,
    overwrite: true,
    browserExecutable: browser.path
  });
}
