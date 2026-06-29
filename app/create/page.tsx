"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  GripVertical,
  ImagePlus,
  Link2,
  Loader2,
  Play,
  Sparkles,
  UploadCloud,
  Video,
  X
} from "lucide-react";
import { getSupabaseClient } from "../../lib/supabase";

type LocalPhoto = {
  id: string;
  file: File;
  previewUrl: string;
};

type UploadedPhoto = {
  path: string;
  token: string;
  originalUrl: string;
  depthMapUrl: string | null;
};

type RenderResult = {
  videoUrl: string;
  durationInFrames: number;
  fps: number;
};

type ImportedProperty = {
  address: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  description: string | null;
};

const MIN_PHOTOS = 5;
const MAX_PHOTOS = 30;

function missingImportedFields(property?: ImportedProperty) {
  const missing = [
    ["price", property?.price],
    ["bedrooms", property?.bedrooms],
    ["bathrooms", property?.bathrooms],
    ["square feet", property?.squareFeet]
  ]
    .filter(([, value]) => value === null || value === undefined)
    .map(([label]) => label);

  return missing;
}

export default function Home() {
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [agentName, setAgentName] = useState("Rocco Fiacchino");
  const [listingUrl, setListingUrl] = useState("");
  const [listingText, setListingText] = useState("");
  const [importStatus, setImportStatus] = useState<"idle" | "loading" | "error">("idle");
  const [importMessage, setImportMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "rendering" | "complete" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<RenderResult | null>(null);

  const estimatedSeconds = useMemo(() => photos.length * 2.5 - Math.max(0, photos.length - 1) * 0.5, [photos.length]);
  const canRender = photos.length >= MIN_PHOTOS && photos.length <= MAX_PHOTOS && address.trim() && price.trim() && beds.trim() && baths.trim() && squareFeet.trim() && agentName.trim();

  useEffect(() => () => photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl)), [photos]);

  async function importListing() {
    if (!listingUrl.trim()) return;
    setImportStatus("loading");
    setImportMessage("Reading public listing details and photos...");

    try {
      const response = await fetch("/api/listings/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: listingUrl.trim(), pageText: listingText.trim() || undefined })
      });
      const payload = await response.json() as { property?: ImportedProperty; images?: string[]; warning?: string | null; error?: string };
      if (!response.ok) throw new Error(payload.error || "Listing import failed.");

      const property = payload.property;
      const missing = missingImportedFields(property);
      if (property?.address) setAddress(property.address);
      if (property?.price) setPrice(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(property.price));
      if (property?.bedrooms !== null && property?.bedrooms !== undefined) setBeds(String(property.bedrooms));
      if (property?.bathrooms !== null && property?.bathrooms !== undefined) setBaths(String(property.bathrooms));
      if (property?.squareFeet) setSquareFeet(new Intl.NumberFormat("en-US").format(property.squareFeet));

      const available = MAX_PHOTOS - photos.length;
      const imported = await Promise.all((payload.images ?? []).slice(0, available).map(async (src, index) => {
        const imageResponse = await fetch(src);
        if (!imageResponse.ok) return null;
        const blob = await imageResponse.blob();
        const extension = blob.type.split("/")[1] || "jpg";
        const file = new File([blob], `listing-photo-${index + 1}.${extension}`, { type: blob.type || "image/jpeg" });
        return { id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) } satisfies LocalPhoto;
      }));
      const validPhotos = imported.filter((photo): photo is LocalPhoto => photo !== null);
      if (validPhotos.length) setPhotos((current) => [...current, ...validPhotos]);

      const blockedWithoutFallback = Boolean(payload.warning && !listingText.trim());
      setImportStatus(missing.length || blockedWithoutFallback ? "error" : "idle");
      if (blockedWithoutFallback) {
        setImportMessage("Address filled from the listing URL. The listing site blocked price, beds, baths, square feet, and photos, so paste the visible listing facts into the fallback box or enter the remaining fields manually.");
      } else if (missing.length) {
        setImportMessage(`${payload.warning ? `${payload.warning} ` : ""}Still missing ${missing.join(", ")}. Paste the visible listing facts into the fallback box, then click Auto-fill again.`);
      } else {
        setImportMessage(`Listing details filled${validPhotos.length ? ` and ${validPhotos.length} photos added` : ""}. Review any fields before rendering.`);
      }
    } catch (error) {
      setImportStatus("error");
      setImportMessage(error instanceof Error ? error.message : "Listing import failed.");
    }
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const available = MAX_PHOTOS - photos.length;
    const files = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, available);

    setPhotos((current) => [
      ...current,
      ...files.map((file) => ({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) }))
    ]);
    setResult(null);
    setStatus("idle");
    event.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((photo) => photo.id !== id);
    });
  }

  function reorder(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    setPhotos((current) => {
      const next = [...current];
      const from = next.findIndex((photo) => photo.id === draggedId);
      const to = next.findIndex((photo) => photo.id === targetId);
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedId(null);
  }

  async function createVideo() {
    if (!canRender) return;
    setResult(null);
    setMessage("Uploading originals and preparing simulated depth maps...");
    setStatus("uploading");

    try {
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: photos.map(({ file }) => ({ name: file.name, type: file.type, size: file.size })) })
      });
      const upload = await uploadResponse.json() as { projectId?: string; bucket?: string; uploads?: UploadedPhoto[]; error?: string };
      if (!uploadResponse.ok || !upload.projectId || !upload.bucket || !upload.uploads) throw new Error(upload.error || "Photo upload failed.");

      const supabase = getSupabaseClient();
      await Promise.all(upload.uploads.map(async (slot, index) => {
        const { error } = await supabase.storage.from(upload.bucket!).uploadToSignedUrl(slot.path, slot.token, photos[index].file, {
          contentType: photos[index].file.type
        });
        if (error) throw error;
      }));

      setStatus("rendering");
      setMessage("Rendering 9:16 MP4 with parallax motion and crossfades...");
      const renderResponse = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: upload.projectId,
          images: upload.uploads.map(({ originalUrl, depthMapUrl }) => ({ originalUrl, depthMapUrl })),
          address,
          price,
          beds,
          baths,
          squareFeet,
          agentName
        })
      });
      const render = await renderResponse.json() as RenderResult & { error?: string };
      if (!renderResponse.ok || !render.videoUrl) throw new Error(render.error || "Video rendering failed.");

      setResult(render);
      setStatus("complete");
      setMessage("Your vertical listing reel is ready.");
    } catch (error) {
      setStatus("error");
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setMessage(/fetch failed|failed to fetch|networkerror/i.test(message)
        ? "The video render request was cut off before the server returned a result. Try 5-8 smaller photos first; if it still fails, the render needs to run in a background worker instead of a live Vercel request."
        : message);
    }
  }

  return (
    <main className="min-h-screen bg-cream text-charcoal">
      <header className="border-b border-gold/25 bg-forest text-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md border border-gold/50 bg-pine font-serif text-xl font-semibold text-gold">S</span>
            <div>
              <p className="font-serif text-xl font-semibold">Spruce & Shoals</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">Parallax Reel Studio</p>
            </div>
          </div>
          <a href="/dashboard" className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-gold hover:text-gold">Dashboard</a>
        </div>
      </header>

      <section className="border-b border-pine/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div className="border-l border-gold pl-6">
            <div className="inline-flex items-center gap-2 rounded-md border border-gold/35 bg-cream px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-pine">
              <Sparkles size={15} className="text-gold" /> Street-view-inspired motion
            </div>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.98] text-pine md:text-7xl">Turn listing photos into a cinematic property walk-through.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-charcoal/65">Upload still photography and render a vertical MP4 with smooth forward movement, layered parallax, motion blur, crossfades, and luxury listing typography.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["2.5 sec", "per photo"],
              ["9:16", "vertical MP4"],
              ["3 layers", "simulated depth"],
              ["No paid AI", "first version"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-md border border-pine/15 bg-cream p-5">
                <p className="font-serif text-3xl font-semibold text-pine">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-charcoal/45">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-lg border border-pine/15 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">01 · Property media</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-pine">Upload 5–30 listing photos</h2>
                <p className="mt-2 text-sm leading-6 text-charcoal/55">Drag cards after upload to set the sequence. Exterior-first usually creates the strongest opening.</p>
              </div>
              <span className={`rounded-md border px-3 py-2 text-sm font-bold ${photos.length >= MIN_PHOTOS ? "border-gold/40 bg-cream text-pine" : "border-pine/10 text-charcoal/40"}`}>{photos.length}/{MAX_PHOTOS}</span>
            </div>

            <label className="mt-6 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gold/60 bg-cream p-6 text-center transition hover:border-pine hover:bg-white">
              <UploadCloud size={31} className="text-gold" />
              <span className="mt-3 font-semibold text-pine">Drop photos or browse files</span>
              <span className="mt-1 text-sm text-charcoal/50">JPG, PNG, or WebP · 20 MB maximum each</span>
              <input className="sr-only" type="file" accept="image/*" multiple onChange={addPhotos} disabled={photos.length >= MAX_PHOTOS} />
            </label>

            {photos.length ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {photos.map((photo, index) => (
                  <article
                    key={photo.id}
                    draggable
                    onDragStart={() => setDraggedId(photo.id)}
                    onDragOver={(event: DragEvent) => event.preventDefault()}
                    onDrop={() => reorder(photo.id)}
                    className="group relative overflow-hidden rounded-md border border-pine/15 bg-cream"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.previewUrl} alt={photo.file.name} className="aspect-[4/3] w-full object-cover" />
                    <span className="absolute left-2 top-2 flex h-7 min-w-7 items-center justify-center rounded bg-pine px-2 text-xs font-bold text-gold">{index + 1}</span>
                    <button onClick={() => removePhoto(photo.id)} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded bg-white/95 text-pine shadow" aria-label={`Remove ${photo.file.name}`}><X size={14} /></button>
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-pine"><GripVertical size={14} className="text-gold" /><span className="truncate">{photo.file.name}</span></div>
                  </article>
                ))}
                {photos.length < MAX_PHOTOS ? (
                  <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-pine/20 bg-cream text-center text-sm font-semibold text-pine">
                    <ImagePlus size={23} className="text-gold" /><span className="mt-2">Add more</span>
                    <input className="sr-only" type="file" accept="image/*" multiple onChange={addPhotos} />
                  </label>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="rounded-lg border border-pine/15 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">02 · Listing details</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-pine">Build the on-screen presentation</h2>
            <div className="mt-6 rounded-md border border-gold/35 bg-cream p-4">
              <label className="text-sm font-semibold text-pine" htmlFor="listing-url">Import a public listing</label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Link2 size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
                  <input
                    id="listing-url"
                    value={listingUrl}
                    onChange={(event) => setListingUrl(event.target.value)}
                    placeholder="Paste a Zillow, Realtor.com, or Redfin URL"
                    className="h-12 w-full rounded-md border border-pine/20 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-gold"
                  />
                </div>
                <button
                  type="button"
                  onClick={importListing}
                  disabled={!listingUrl.trim() || importStatus === "loading"}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pine px-5 text-sm font-bold text-white transition hover:bg-forest disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {importStatus === "loading" ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
                  Auto-fill
                </button>
              </div>
              <textarea
                value={listingText}
                onChange={(event) => setListingText(event.target.value)}
                placeholder="Optional fallback: paste copied listing facts here when a listing site blocks import. Include price, beds, baths, square feet, and description."
                className="mt-3 min-h-24 w-full rounded-md border border-pine/20 bg-white p-3 text-sm leading-6 outline-none transition focus:border-gold"
              />
              {importMessage ? <p className={`mt-2 text-sm ${importStatus === "error" ? "text-red-700" : "text-charcoal/60"}`}>{importMessage}</p> : null}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Property address", address, setAddress, "44 Railroad Ave #6, Salisbury, MA"],
                ["Price", price, setPrice, "$531,500"],
                ["Bedrooms", beds, setBeds, "2"],
                ["Bathrooms", baths, setBaths, "2"],
                ["Square feet", squareFeet, setSquareFeet, "978"],
                ["Agent name", agentName, setAgentName, "Rocco Fiacchino"]
              ].map(([label, value, setter, placeholder]) => (
                <label key={label as string} className="text-sm font-semibold text-pine">
                  {label as string}
                  <input
                    value={value as string}
                    onChange={(event) => (setter as (value: string) => void)(event.target.value)}
                    placeholder={placeholder as string}
                    className="mt-2 h-12 w-full rounded-md border border-pine/20 bg-cream px-3 text-sm outline-none transition focus:border-gold focus:bg-white"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <section className="overflow-hidden rounded-lg border border-pine/15 bg-forest text-white shadow-luxury">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Reel preview</p>
                <p className="mt-1 text-sm text-white/50">{estimatedSeconds > 0 ? `${estimatedSeconds.toFixed(1)} seconds` : "Waiting for photos"}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/5"><Play size={17} /></span>
            </div>
            <div className="flex min-h-[520px] items-center justify-center p-6">
              <div className="relative aspect-[9/16] max-h-[500px] w-full overflow-hidden rounded-md border border-white/15 bg-pine shadow-2xl">
                {photos[0] ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photos[0].previewUrl} alt="Preview" className="h-full w-full scale-110 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-black/15" />
                  </>
                ) : <div className="flex h-full flex-col items-center justify-center text-center"><Video size={38} className="text-gold" /><p className="mt-4 font-serif text-2xl">Your reel begins here</p><p className="mt-2 max-w-xs text-sm leading-6 text-white/50">Upload at least five photos to prepare the motion sequence.</p></div>}
                {photos[0] ? (
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">{price || "LISTING PRICE"}</p>
                    <p className="mt-2 font-serif text-2xl font-semibold leading-tight">{address || "Property address"}</p>
                    <p className="mt-2 text-xs tracking-[0.12em] text-white/70">{beds || "—"} BEDS · {baths || "—"} BATHS · {squareFeet || "—"} SQ FT</p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-pine/15 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-pine text-gold"><Sparkles size={19} /></span>
              <div><p className="font-semibold text-pine">Render vertical MP4</p><p className="text-sm text-charcoal/50">Remotion + FFmpeg · H.264</p></div>
            </div>
            <div className="mt-5 space-y-3 text-sm text-charcoal/65">
              {["Slow forward zoom and alternating pan", "Three simulated depth layers", "Smooth 15-frame crossfades", "Address, price, specs, and agent overlay"].map((item) => <div key={item} className="flex items-center gap-2"><BadgeCheck size={16} className="shrink-0 text-gold" />{item}</div>)}
            </div>
            <button
              onClick={createVideo}
              disabled={!canRender || status === "uploading" || status === "rendering"}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-pine px-5 text-sm font-semibold text-white transition hover:bg-forest disabled:cursor-not-allowed disabled:opacity-45"
            >
              {status === "uploading" || status === "rendering" ? <Loader2 className="animate-spin" size={17} /> : <Video size={17} />}
              {status === "uploading" ? "Uploading photos" : status === "rendering" ? "Rendering video" : "Create listing reel"}
              {status === "idle" && canRender ? <ArrowRight size={16} /> : null}
            </button>
            {photos.length > 0 && photos.length < MIN_PHOTOS ? <p className="mt-3 text-center text-xs font-semibold text-charcoal/45">Add {MIN_PHOTOS - photos.length} more photo{MIN_PHOTOS - photos.length === 1 ? "" : "s"} to render.</p> : null}
            {message ? <p className={`mt-4 rounded-md border p-3 text-sm leading-6 ${status === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-gold/25 bg-cream text-pine"}`}>{message}</p> : null}
          </section>

          {result ? (
            <section className="rounded-lg border border-gold/40 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Render complete</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/45">{Math.round(result.durationInFrames / result.fps)}s listing reel</p>
              <video className="mt-4 aspect-[9/16] max-h-[560px] w-full rounded-md bg-black object-contain" src={result.videoUrl} controls playsInline />
              <a href={result.videoUrl} download className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-gold px-5 text-sm font-semibold text-forest transition hover:bg-[#d4b36f]"><Download size={17} /> Download MP4</a>
            </section>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
