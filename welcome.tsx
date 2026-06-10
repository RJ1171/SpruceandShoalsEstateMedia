"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { BadgeCheck, FileAudio, FileText, Image as ImageIcon, Palette, Sparkles, UploadCloud, Video, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

type UploadItem = {
  id: string;
  file: File;
  previewUrl?: string;
  kind: "image" | "video" | "audio" | "document" | "other";
};

function getKind(file: File): UploadItem["kind"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.includes("pdf") || file.type.includes("document") || file.type.includes("text")) return "document";
  return "other";
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function UploadWorkspace({ compact = false }: { compact?: boolean }) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  const counts = useMemo(
    () => ({
      images: items.filter((item) => item.kind === "image").length,
      media: items.filter((item) => item.kind === "video" || item.kind === "audio").length,
      documents: items.filter((item) => item.kind === "document").length
    }),
    [items]
  );

  function onFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const next = files.map((file) => {
      const kind = getKind(file);
      return {
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        kind,
        previewUrl: kind === "image" ? URL.createObjectURL(file) : undefined
      };
    });

    setItems((current) => [...current, ...next]);
    setStatus("idle");
    event.target.value = "";
  }

  function removeItem(id: string) {
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function markReady() {
    setStatus("ready");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
      <Card className="corner-frame overflow-hidden">
        <div className="bg-pine px-6 py-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Project intake</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">Listing media package</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">Build the source package for videos, descriptions, social posts, and branded listing assets.</p>
        </div>
        <div className="gold-rule" />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-pine">Listing intake</h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/65">Photos, media, brand files, disclosures, and description notes.</p>
            </div>
            {status === "ready" ? <span className="rounded-md border border-gold/40 bg-cream px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-gold">Ready</span> : null}
          </div>

        <label className="group mt-6 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gold/60 bg-cream px-5 text-center shadow-inner transition hover:border-pine hover:bg-white">
          <span className="flex h-14 w-14 items-center justify-center rounded-md bg-white text-gold shadow-sm transition group-hover:bg-pine">
            <UploadCloud size={30} />
          </span>
          <span className="mt-3 font-semibold text-pine">Upload listing assets</span>
          <span className="mt-1 text-sm text-charcoal/60">Images, video, audio, logos, headshots, PDFs, and text files</span>
          <input className="sr-only" type="file" multiple accept="image/*,video/*,audio/*,.pdf,.txt,.doc,.docx" onChange={onFilesSelected} />
        </label>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="outline-tile rounded-md p-3">
            <ImageIcon size={18} className="text-gold" />
            <p className="mt-2 text-sm font-semibold text-pine">{counts.images ? "Images added" : "Images"}</p>
            <p className="mt-1 text-xs text-charcoal/55">Listing photos</p>
          </div>
          <div className="outline-tile rounded-md p-3">
            <Video size={18} className="text-gold" />
            <p className="mt-2 text-sm font-semibold text-pine">{counts.media ? "Media added" : "Video/audio"}</p>
            <p className="mt-1 text-xs text-charcoal/55">Voice, clips, music</p>
          </div>
          <div className="outline-tile rounded-md p-3">
            <FileText size={18} className="text-gold" />
            <p className="mt-2 text-sm font-semibold text-pine">{counts.documents ? "Docs added" : "Documents"}</p>
            <p className="mt-1 text-xs text-charcoal/55">Copy and PDFs</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {["Address", "Price", "Bedrooms", "Bathrooms", "Square footage", "Template"].map((field) => (
            <label key={field} className="text-sm font-semibold text-pine">
              {field}
              <input className="mt-2 h-11 w-full rounded-md border border-pine/25 bg-cream px-3 text-sm shadow-inner outline-none focus:border-gold focus:bg-white" placeholder={field} />
            </label>
          ))}
        </div>

        <label className="mt-5 block text-sm font-semibold text-pine">
          Listing description
          <textarea
            className="mt-2 min-h-36 w-full resize-y rounded-md border border-pine/25 bg-cream px-3 py-3 text-sm leading-6 shadow-inner outline-none focus:border-gold focus:bg-white"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setStatus("idle");
            }}
            placeholder="Paste existing notes, seller highlights, MLS draft copy, or property remarks."
          />
        </label>

        <Button className="mt-5 w-full" onClick={markReady} disabled={!items.length && !description.trim()}>
          <UploadCloud size={16} /> Upload package
        </Button>
        </div>
      </Card>

      <Card className="corner-frame overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-pine/10 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Campaign sourceboard</p>
            <h2 className="mt-1 font-serif text-3xl font-semibold text-pine">Uploaded assets</h2>
          </div>
          <Palette className="text-gold" size={24} />
        </div>
        <div className="p-6">
        {!items.length && !description.trim() ? (
          <div className="rounded-lg border border-pine/20 bg-cream p-8 shadow-inner">
            <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div className="aspect-[4/3] rounded-lg border border-pine/20 bg-[linear-gradient(135deg,#0F2C25,#F7F3EA_62%,#C8A45D)] shadow-inner" />
              <div>
                <UploadCloud className="text-gold" size={34} />
                <p className="mt-3 font-semibold text-pine">No assets uploaded yet</p>
                <p className="mt-2 text-sm leading-6 text-charcoal/65">Add property photos and description notes to populate the preview board.</p>
                <div className="mt-4 grid gap-2">
                  {["Photo gallery", "Description draft", "Brand assets"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-charcoal/70">
                      <BadgeCheck size={15} className="text-gold" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {items.length ? (
          <div className={compact ? "mt-6 grid gap-3" : "mt-6 grid gap-4 sm:grid-cols-2"}>
            {items.map((item) => (
              <div key={item.id} className="relative overflow-hidden rounded-lg border border-pine/20 bg-cream shadow-sm">
                {item.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.previewUrl} alt={item.file.name} className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-white">
                    {item.kind === "audio" ? <FileAudio className="text-gold" size={34} /> : item.kind === "video" ? <Video className="text-gold" size={34} /> : <FileText className="text-gold" size={34} />}
                  </div>
                )}
                <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-white text-pine shadow-sm" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.file.name}`}>
                  <X size={16} />
                </button>
                <div className="p-4">
                  <p className="truncate text-sm font-semibold text-pine">{item.file.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-charcoal/50">{item.kind} - {formatSize(item.file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {description.trim() ? (
          <div className="mt-6 rounded-lg border border-pine/20 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Description draft</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-charcoal/75">{description}</p>
            <div className="mt-4 flex items-center gap-2 border-t border-pine/10 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-pine">
              <Sparkles size={15} className="text-gold" />
              Ready for AI copy generation
            </div>
          </div>
        ) : null}
        </div>
      </Card>
    </div>
  );
}
